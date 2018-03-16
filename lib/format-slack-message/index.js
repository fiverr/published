const random = require('../random');
const statusColour = require('../status-colour');
const banter = require('../banter');
const emotion = require('../emotion');
const {
    DEFAULT_SLACK_USERNAME,
    ENV_SLACK_CHANNEL,
    DEFAULT_SLACK_CHANNEL,
} = require('../constants');
const channel = () => require('../any-env-var')(...ENV_SLACK_CHANNEL) || DEFAULT_SLACK_CHANNEL;

module.exports = async (text, {status = 'success'} = {}) => ({
        attachments: [{
            pretext: banter(status),
            color: statusColour(status),
            text,
            mrkdwn_in: ['text'],
        }],
        channel: channel(),
        username: await require('../git-data').author || DEFAULT_SLACK_USERNAME,
        icon_emoji: emotion(status),
    });
