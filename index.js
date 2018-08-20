#!/usr/bin/env node

process.on('unhandledRejection', console.error);

const {
    read,
    write,
    reset,
} = require('edit-package');
const {argv} = require('yargs');
const TRUETHY = ['true', true];
const truethyArg = value => TRUETHY.includes(argv[value]);
const {
    slack = {},
    _,
} = argv;
const testing = truethyArg('testing') || _.includes('testing');

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
    successMessage,
    skipPublish,
} = require('./lib');

(async function() {
    const narrate = testing || !truethyArg('quiet');

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

    const output = [`Published version ${version}${suffix}`];

    if (latestBranch && truethyArg('gitTag')) {
        try {
            await gitTag({version, subject, author, email, publishConfig})

            output.push(`Pushed git tag ${version}`)
        } catch (error) {
            console.error(error);
            output.push(`Failed to push git tag ${version}`)
        }
    }

    return {
        message: output.join('\n'),
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
