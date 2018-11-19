const DEFAULT_SLACK_USERNAME = 'published';
const color = require('../color');
const iconEmoji = require('../iconEmoji');
const mrkdwn_in = ['text', 'pretext', 'fields'];

const emotions = {
    pass: 'smile',
    fail: 'frown',
    none: 'blank',
}

/**
 * Format slack notification object
 * @param  {String} options.text
 * @param  {String} [options.status='okay']
 * @param  {String} [options.username='published']
 * @param  {String} [options.channel] // Default: Use webhook default channel
 * @param  {String} [options.icon_emoji] // Default: Use a random emoji
 * @param  {Array} [attachments] // Extra attachments (see Slack API)
 * @param  {...Any} options.*
 * @return {Object}
 */
module.exports = ({
    status = 'okay',
    username = DEFAULT_SLACK_USERNAME,
    channel,
    icon_emoji = iconEmoji(status),
    message,
    attachments = [],
    ...rest
} = {}) => ({
    text: message,
    attachments: [
        {
            color: color(status),
            mrkdwn_in,
            ...rest,
        },
        ...attachments,
    ],
    channel,
    username,
    icon_emoji,
});
