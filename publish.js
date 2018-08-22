const {
    read,
    write,
} = require('edit-package');
const git = require('async-git');
const {
    config,
    exists,
    publish,
} = require('jsnpm');
const {
    getTag,
    gitTag,
    isLatestBranch,
    skipPublish,
    truthy,
} = require('./lib');

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
    const tag = getTag(branch, publishConfig.tag);

    const exist = await exists(name, `${version}${suffix}`);

    if (exist) {
        return {message: `${name}@${version}${suffix} already published`};
    }

    // Configure other registries where applicable
    publishConfig.registry && await config('registry', publishConfig.registry);

    // Modify version and tag according to previous decisions
    await write({
        version: `${version}${suffix}`,
        publishConfig: { tag },
    })

    testing || await publish();

    const gitTagMessage = await (async condition => {
        if (!condition) { return undefined; }

        try {
            testing || await gitTag({version, subject, author, email, publishConfig});

            return `Pushed git tag ${version}`;
        } catch (error) {
            console.error(error);
            return `Failed to push git tag ${version}`;
        }
    })(latestBranch && truthy(shouldGitTag));


    return {
        message: `Published version ${version}${suffix}\n${gitTagMessage || ''}`,
        details: {
            name,
            version: `${version}${suffix}`,
            tag,
            homepage,
            author,
            message,
            footer: gitTagMessage,
            footer_icon: gitTagMessage ? ':octocat:' : undefined,
            registry: publishConfig.registry,
        },
    };
}
