const {
    read,
    write,
} = require('edit-package');
const git = require('async-git');
const {
    config,
    exists,
    getVersion,
    setTag,
    publish,
} = require('jsnpm');
const {
    color,
    getTag,
    gitTag,
    gitTagMessage,
    isLatestBranch,
    skipPublish,
} = require('../../lib');

/**
 * Publish the package according to your opinion
 * @param  {Boolean} [options.testing]
 * @param  {Boolean} [options.shouldGitTag]
 * @return {Object} details of the publishing event
 */
module.exports = async function({testing, shouldGitTag}) {
    testing && console.log('Testing only, will not publish');

    const [
        {
            name,
            version,
            homepage,
            publishConfig = {},
        },
        branch,
        author,
        email,
        subject,
        message,
        short,
    ] = await Promise.all([
        read(),
        git.branch,
        git.author,
        git.email,
        git.subject,
        git.message,
        git.short,
    ]);

    const skip = skipPublish(version, branch);

    if (skip) {
        return {message: skip};
    }

    const latestBranch = isLatestBranch(branch);
    const suffix = latestBranch ? '' : `-${short}`;
    const fullVersion = `${version}${suffix}`;
    const tag = getTag(branch, publishConfig.tag);
    const exist = await exists(name, fullVersion);
    let action = publish;
    let cliMsg = `Published version ${fullVersion}`;

    if (exist) {

        if ((await getVersion(name, tag)) === fullVersion) {
            return {message: `${name}@${fullVersion} already published`};
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
        publishConfig: { tag },
    });

    testing || await action();
    const attachments = [];

    const [text, success] = await gitTagMessage(
        latestBranch && shouldGitTag,
        async () => testing || await gitTag({version, subject, author, email, publishConfig})
    );

    text && attachments.push({text, color: color(success)});

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
            published: action === publish,
        },
    };
};
