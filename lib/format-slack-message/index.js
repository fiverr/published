const {
    WEBHOOK_MESSAGE_COLOUR,
    WEBHOOK_CHANNEL,
    WEBHOOK_USERNAME,
} = require('../constants');

const { author } = require('../git-data');

const smile = require('../smile');

module.exports = (text, {
        channel = WEBHOOK_CHANNEL,
        color = WEBHOOK_MESSAGE_COLOUR,
        title = '',
        author,
        title_link
    } = {}) => ({
        attachments: [{
            fallback: `${title}: package was automatically published`,
            color,
            author_name: author,
            title,
            title_link,
            pretext: `Automated operation triggered by *${author}*`,
            text,
            mrkdwn_in: ['text', 'pretext'],
        }],
        channel,
        username: WEBHOOK_USERNAME,
        icon_emoji: smile(),
    });
