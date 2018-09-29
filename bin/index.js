#!/usr/bin/env node

process.on('unhandledRejection', console.error);

const execute = require('async-execute');
const publish = require('../app');
const truthy = require('../lib/truthy');
const {argv} = require('yargs');
const {
    slack = {},
    _,
} = argv;

if (!slack.webhook && process.env.SLACK_WEBHOOK) {
    slack.webhook = process.env.SLACK_WEBHOOK;
}

(async() => {
    const result = await publish({
        slack,
        quiet: truthy(argv.quiet),
        testing: truthy(argv.testing) || _.includes('testing'),
        shouldGitTag: truthy(argv.gitTag),
    });
    const {published, tag} = result;
    const {onPublish} = argv;
    const onTag = argv[`on-${tag}`];
    published && onPublish && console.log(await execute(onPublish));
    published && onTag && console.log(await execute(onTag));
})();
