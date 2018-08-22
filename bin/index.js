#!/usr/bin/env node

process.on('unhandledRejection', console.error);

const publish = require('../');
const {argv} = require('yargs');
const {
    slack = {},
    quiet,
    gitTag,
    _,
} = argv;

const testing = argv.testing || _.includes('testing');
slack.webhook = slack.webhook || process.env.SLACK_WEBHOOK;

publish({
    slack,
    quiet,
    testing,
    shouldGitTag: gitTag,
});
