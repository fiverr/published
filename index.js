process.on('unhandledRejection', console.error);

const {
    read,
    write,
    reset,
} = require('edit-package');
const git = require('async-git');
const {
    config,
    exists,
    publish,
} = require('jsnpm');

const {
    formatSlackMessage,
    getTag,
    gitTag,
    isLatestBranch,
    postRequest,
    skipPublish,
    successMessage,
    truthy,
} = require('./lib');

module.exports = async function({
    slack,
    quiet,
    shouldGitTag,
    testing,
}) {
    const narrate = testing || !truthy(quiet);

    try {
        const {
            message,
            details,
        } = await start({
            testing,
            shouldGitTag,
        });

        narrate && console.log(message);
        if (testing) { return; }
        if (!details) { return; }

        if (narrate) {
            const body = formatSlackMessage({
                ...successMessage(details),
                username: details.author,
                status: 'pass',
                channel: slack.channel,
            });
            await slackNotification(slack, body);
        }

    } catch (error) {
        if (narrate) {
            console.error(error);
            const body = formatSlackMessage({
                username: await git.author,
                status: 'fail',
                pretext: `An error has occured trying to publish from ${await git.name} repository`,
                text: error.message,
                channel: slack.channel,
            });
            await slackNotification(slack, body);
        }
    } finally {
        reset();
    }
}

async function start({testing, shouldGitTag}) {
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

    let gitTagMessage;

    if (latestBranch && truthy(shouldGitTag)) {
        try {
            await gitTag({version, subject, author, email, publishConfig});

            gitTagMessage = `Pushed git tag ${version}`;
        } catch (error) {
            console.error(error);
            gitTagMessage = `Failed to push git tag ${version}`;
        }
    }

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

async function slackNotification(slack, body) {
    const {webhook} = slack;

    webhook && await postRequest(webhook, body);
}
