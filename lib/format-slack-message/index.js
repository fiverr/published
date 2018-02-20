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
            fallback: `${title}: package was automatically published`,
            color: statusColour(status),
            author_name: banter(status),
            title,
            title_link,
            pretext: `Automated operation triggered by *${author || await require('../git-data').author}*`,
            text,
            mrkdwn_in: ['text', 'pretext'],
        }],
        channel,
        username: WEBHOOK_USERNAME,
        icon_emoji: emotion(status),
    });
