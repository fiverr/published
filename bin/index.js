#!/usr/bin/env node

process.on('unhandledRejection', console.error);

const execute = require('async-execute');
const { argv } = require('yargs');
const publish = require('../app');
const truthy = require('../lib/truthy');
const { name, version } = require('../package.json');

const {
    slack = {},
    _
} = argv;

if (!slack.webhook && process.env.SLACK_WEBHOOK) {
    slack.webhook = process.env.SLACK_WEBHOOK;
}

if (!slack.channel && process.env.SLACK_PUBLISHED_CHANNEL) {
    slack.channel = process.env.SLACK_PUBLISHED_CHANNEL;
}

(async() => {
    console.log(`☕️ ${name} v${version}`);

    const data = await publish({
        slack,
        quiet: truthy(argv.quiet),
        testing: truthy(argv.testing) || _.includes('testing'),
        shouldGitTag: truthy(argv.gitTag),
        prefixGitTag: argv.prefixGitTag,
        latestBranch: argv.latestBranch,
        tagName: argv.tagName,
        noSha: truthy(argv.noSha)
    });
    const { details = {} } = data || {};
    const { published, tag } = details;
    const { onPublish } = argv;
    const onTag = argv[`on-${tag}`];
    published && onPublish && console.log(await execute(onPublish));
    published && onTag && console.log(await execute(onTag));
})();
