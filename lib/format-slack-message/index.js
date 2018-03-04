const random = require('../random');
const statusColour = require('../status-colour');
const banter = require('../banter');
const emotion = require('../emotion');
const {
    DEFAULT_SLACK_USERNAME,
    ENV_SLACK_CHANNEL,
    DEFAULT_SLACK_CHANNEL,
} = require('../constants');

module.exports = async (text, {
        channel = defaultChannel(),
        status,
        title = '',
        author,
        title_link
    } = {}) => ({
        attachments: [{
            pretext: banter(status),
            fallback: `${title}: package was automatically published`,
            color: statusColour(status),
            text,
            mrkdwn_in: ['text'],
        }],
        channel,
        username: author || await require('../git-data').author || DEFAULT_SLACK_USERNAME,
        icon_emoji: emotion(status),
    });

const defaultChannel = () => require('../any-env-var')(...ENV_SLACK_CHANNEL) || DEFAULT_SLACK_CHANNEL;
console.log(defaultChannel());
