const {
    read,
    write
} = require('edit-package');
const git = require('async-git');
const {
    config,
    exists,
    getVersion,
    setTag,
    publish
} = require('jsnpm');
const {
    color,
    getTag,
    gitTagMessage,
    isLatestBranch,
    skipPublish
} = require('../../lib');

/**
 * Publish the package according to your opinion
 * @param  {Boolean} [options.testing]
 * @param  {Boolean} [options.shouldGitTag]
 * @param  {String} [options.latestBranch]
 * @param  {String} [options.tagName]
 * @return {Object} details of the publishing event
 */
module.exports = async function({ testing, shouldGitTag, latestBranch, tagName }) {
    testing && console.log('Testing only, will not publish');

    const [
        packageJson,
        branch,
        author,
        message,
        short
    ] = await Promise.all([
        read(),
        git.branch,
        git.author,
        git.message,
        git.short
    ]);

    const {
        name,
        version,
        homepage,
        publishConfig = {}
    } = packageJson;

    if (packageJson.private === true) {
        return { message: 'Package set to private and will not be published' };
    }

    const onLatestBranch = isLatestBranch(branch, latestBranch);
    const skip = skipPublish(version, onLatestBranch);

    if (skip) {
        return { message: skip };
    }

    const suffix = onLatestBranch ? '' : `-${short}`;
    const fullVersion = `${version}${suffix}`;
    const tag = tagName || getTag(branch, publishConfig.tag, onLatestBranch);
    const exist = await exists(name, fullVersion);
    let action = publish;
    let cliMsg = `Published version ${fullVersion}`;

    if (exist) {

        if ((await getVersion(name, tag)) === fullVersion) {
            return { message: `${name}@${fullVersion} already published` };
        } else {
            action = () => setTag(name, fullVersion, tag);
            cliMsg = `Set tag ${tag} to ${fullVersion}`;
        }
    }

    // Configure other registries where applicable
    publishConfig.registry && await config('registry', publishConfig.registry);

    // Modify version and tag according to previous decisions
    await write({
        version: fullVersion,
        publishConfig: { tag }
    });

    testing || await action();
    const attachments = [];

    const [text, success] = await gitTagMessage(
        onLatestBranch && shouldGitTag,
        async() => testing || await git.tag(`${publishConfig['tag-version-prefix'] || ''}${version}`)
    );

    text && attachments.push({ text, color: color(success) });

    return {
        message: cliMsg,
        details: {
            name,
            version: fullVersion,
            tag,
            homepage,
            author,
            message,
            attachments,
            registry: publishConfig.registry,
            published: action === publish
        }
    };
};
