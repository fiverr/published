#!/usr/bin/env node

process.on('unhandledRejection', console.error);

const {
    read,
    write,
    reset,
} = require('edit-package');
const {
    quiet = false,
    slack = {},
    _,
} = require('yargs').argv;
const testing = _.includes('testing');

const git = require('async-git');
const {
    config,
    exists,
    publish,
} = require('jsnpm');
const {
    formatSlackMessage,
    getTag,
    isLatestBranch,
    postRequest,
    successMessage,
    skipPublish,
} = require('./lib');

(async function() {
    const narrate = testing || !['true', true].includes(quiet);

    try {
        const {
            message,
            details,
        } = await start();


        narrate && console.log(message);
        if (testing) { return; }
        if (!details) { return; }

        if (narrate) {
            const body = formatSlackMessage(Object.assign(
                successMessage(details),
                {
                    username: details.author,
                    status: 'pass',
                    channel: slack.channel,
                }
            ));
            await slackNotification(body);
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
            await slackNotification(body);
        }
    } finally {
        reset();
    }
})();

async function start() {
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
        message,
        short,
    ] = await Promise.all([
        read(),
        git.branch,
        git.author,
        git.message,
        git.short,
    ]);

    const skip = skipPublish(version, branch);

    if (skip) {
        return {message: skip};
    }

    const suffix = isLatestBranch(branch) ? '' : `-${short}`;
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

    return {
        message: `Published version ${version}${suffix}`,
        details: {
            name,
            version: `${version}${suffix}`,
            tag,
            homepage,
            author,
            message,
            registry: publishConfig.registry,
        },
    };
}

async function slackNotification(body) {
    const {webhook = process.env.SLACK_WEBHOOK} = slack;

    webhook && await postRequest(webhook, body);
}
