#!/usr/bin/env node

process.on('unhandledRejection', console.error);

const publish = require('../');
const truthy = require('../lib/truthy');
const {argv} = require('yargs');
const {
    slack = {},
    _,
} = argv;

slack.webhook = slack.webhook || process.env.SLACK_WEBHOOK;

publish({
    slack,
    quiet: truthy(argv.quiet),
    testing: truthy(argv.testing) || _.includes('testing'),
    shouldGitTag: truthy(argv.gitTag),
});
