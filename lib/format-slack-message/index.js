const random = require('../random');
const {
    WEBHOOK_MESSAGE_COLOUR,
    WEBHOOK_CHANNEL,
    WEBHOOK_USERNAME,
    CHATTER,
    SMILEYS,
} = require('../constants');

module.exports = async (text, {
        channel = WEBHOOK_CHANNEL,
        color = WEBHOOK_MESSAGE_COLOUR,
        title = '',
        author,
        title_link
    } = {}) => ({
        attachments: [{
            fallback: `${title}: package was automatically published`,
            color,
            author_name: random(CHATTER),
            title,
            title_link,
            pretext: `Automated operation triggered by *${author || await require('../git-data').author}*`,
            text,
            mrkdwn_in: ['text', 'pretext'],
        }],
        channel,
        username: WEBHOOK_USERNAME,
        icon_emoji: random(SMILEYS),
    });
