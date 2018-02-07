require('colors');
const { promisify } = require('util');
const gitData = require('../git-data');
const packageExists = require('../package-exists');
const {
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

    const packageData = await require('package-data')();
    const { name } = packageData;
    const title = name ? `${name} package` : gitData.name || 'Unknown process';
    const title_link = name ? `https://www.npmjs.com/package/${name}` : undefined;

    try {
        const npm = await promisify(require('npm').load)();
        const tag = require('../tag-name')(packageData);
        const version = packageData.version + await require('../version-suffix')(tag);
        const exists = await packageExists.call(npm, name);
        let result;

        // Version not published yet - let's publish it
        if (!exists || !await packageExists.call(npm, `${name}@${version}`)) {
            result = await publish({npm, exists, name, version, tag, title, title_link, testing});
        }

        // Version published but tag isn't pointing to it - get pointing!
        if (!result && !await packageExists.call(npm, `${name}@${tag}`)) {
            result = await release({npm, exists, name, version, tag, title, title_link, testing});
        }

        // Version published, Tag's already pointing to it. Nothing to do but sit back and sip on Margaritas
        if (!result) {
            result = message('Do nothing. Tag ${tag} is already set to version ${version}', {tag, version}).console;
        }

        await packageEditor.reset();

        return result;

    } catch (error) {
        webhookNotify(
            await formatSlackMessage(`Error in publishing flow: ${error}`, {title, title_link, color: COLOR_OKAY})
        );

        throw error;
    }
}

async function publish({npm, exists, name, version, tag, title, title_link, testing = true}) {
    const shouldTag = tag === 'latest';
    const lines = [
        exists ? '' : `${name} package doesn't exist yet.`,
        `Publish version \${version} to tag \${tag}.`,
        shouldTag ? `Creating git tag ${version}.` : ''
    ].reduce((string, line) => string + (line ? `\n${line}` : ''));

    const msg = message(lines, {version, tag});

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
    shouldTag && await require('../git-tag')(version);

    webhookNotify(
        await formatSlackMessage(msg.md, {title, title_link, color: COLOR_OKAY})
    );

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
    webhookNotify(
        await formatSlackMessage(msg.md, {title, title_link, color: COLOR_NEUTRAL})
    );

    return message.console;
}
