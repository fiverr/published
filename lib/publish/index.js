require('colors');
const { promisify } = require('util');
const gitData = require('../git-data');
const isSemverClean = require('../is-semver-clean');
const getPreReleaseTag = require('../get-pre-release-tag');
const packageExists = require('../package-exists');
const {
    RELEASE_CANDIDATES,
    COLOR_OKAY,
    COLOR_NEUTRAL,
    COLOR_ERROR,
} = require('../constants');
const packageEditor = require('../package-editor');
const message = require('../message');
const formatSlackMessage = require('../format-slack-message');
const webhookNotify = require('../webhook-notify');

module.exports = async ({testing = false} = {}) => {
    testing && console.log(require('boxt')(`${'Testing Mode'.bold}\n\nI'm only printing what I ${'intend'.underline} to do`, {theme: 'round', align: 'start'}));

    try {
        const npm = await promisify(require('npm').load)();
        const packageData = await require('package-data')();

        const { name } = packageData;
        const tag = tagName(packageData);
        const version = packageData.version + await versionSuffix(tag);
        const title = name ? `${name} package` : gitData.name || 'Unknown process';
        const title_link = name ? `https://www.npmjs.com/package/${name}` : undefined;

        const exists = await packageExists.call(npm, name);
        const published = exists && await packageExists.call(npm, `${name}@${version}`);
        const released = exists && await packageExists.call(npm, `${name}@${tag}`);

        // Version not published yet - let's publish it
        if (!published) {
            const result = await publish({npm, exists, name, version, tag, title, title_link, testing});

            await packageEditor.reset();
            return result;
        }

        // Version published but tag isn't pointing to it - get pointing!
        if (!released) {
            const result = await release({npm, exists, name, version, tag, title, title_link, testing});

            await packageEditor.reset();
            return result;
        }

        // Version published, Tag's already pointing to it. Nothing to do but sit back and sip on Margaritas
        const msg = message('Do nothing. Tag ${tag} is already set to version ${version}', {tag, version});
        await packageEditor.reset();

        return msg.console;

    } catch (error) {
        console.error(error);

        await webhookNotify(
            await formatSlackMessage(`Error in publishing flow: ${error}`, {title, title_link, color: COLOR_OKAY})
        );

        throw error;
    }
}

async function publish({npm, exists, name, version, tag, title, title_link, testing = true}) {
    const msg = message(`${exists ? '' : `${name} package doesn't exist yet. `}Publish version \${version} to tag \${tag}`, {version, tag});

    if (testing) {
        return msg.console;
    }

    await packageEditor.write({
        version,
        publishConfig: {
            tag,
        }
    });
    await promisify(npm.publish)();
    await require('../git-tag')(version);
    await webhookNotify(
        await formatSlackMessage(msg.md, {title, title_link, color: COLOR_OKAY})
    );
    await packageEditor.reset();

    return msg.console;
}

async function release({npm, name, version, tag, title, title_link, testing = true}) {
    const msg = message('Set tag ${tag} to version ${version}', {tag, version});

    if (testing) {
        return msg.console;
    }

    await packageEditor.write({
        publishConfig: {
            tag,
        }
    });
    await promisify(npm.distTag)('set', `${name}@${version}`, tag);
    await webhookNotify(
        await formatSlackMessage(msg.md, {title, title_link, color: COLOR_NEUTRAL})
    );

    return message.console;
}

/**
 * Create a tag name: master branch pushes "latest", others push as branch name
 * @param  {string} branch
 * @param  {string} version
 * @return {string}
 */
function tagName({version}) {
    const branch = gitData.branch;

    // master branch pushes "latest", others push as branch name
    if (branch === 'master') {
        if (!isSemverClean(version)) {
            throw new Error(messageNoPreRelease(version));
        }

        return 'latest';
    }

    if (!isReleaseCandidate(version)) {
        throw new Error(messageNoReleaseCondidate(version));
    }

    return branch.replace(/[^\w-_]/g, '-');
}

/**
 * Add suffix (commit sha) to version for all tags but latest
 * @param  {string} tag
 * @return {string}
 *
 * @example
 * await versionSuffix('latest') // ''
 * await versionSuffix('feature-branch') // '-c447f6a'
 */
async function versionSuffix(tag) {
    if (tag === 'latest') {
        return '';
    }

    const { sha } = require('../git-data');

    return `-${sha}`;
}

const messageNoPreRelease = (version) => `Publishing a "latest" version is not allowed using a pre-release suffix.\nRemove the pre-release from ${version.underline}.`.red.bold;


const isReleaseCandidate = (version) => RELEASE_CANDIDATES.some(term => getPreReleaseTag(version).toLowerCase().includes(term));


const messageNoReleaseCondidate = (version) => `${version.underline} is not declared as a release candidate ("rc" in version's pre release part, e.g. 1.2.0-rc.1). ${'Not publishing'.underline}.`;

