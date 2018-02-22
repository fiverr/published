const random = require('../random');
const statusColour = require('../status-colour');
const banter = require('../banter');
const emotion = require('../emotion');
const {
    WEBHOOK_MESSAGE_COLOUR,
    WEBHOOK_CHANNEL,
    WEBHOOK_USERNAME,
} = require('../constants');

module.exports = async (text, {
        channel = WEBHOOK_CHANNEL,
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
        username: author || await require('../git-data').author || WEBHOOK_USERNAME,
        icon_emoji: emotion(status),
    });
