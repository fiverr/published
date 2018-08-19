const DEFAULT_SLACK_USERNAME = 'published';
const iconEmoji = require('../iconEmoji');

const colors = {
    pass: '#27ae60', // Nephritis
    fail: '#c0392b', // Pomegranate
    none: '#7f8c8d', // Asbestos
};

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
 * @param  {String} options.channel
 * @return {Object}
 */
module.exports = ({status = 'okay', username = DEFAULT_SLACK_USERNAME, channel, ...rest} = {}) => ({
    attachments: [{
        color: statusColour(status),
        mrkdwn_in: ['text', 'pretext'],
        ...rest,
    }],
    channel,
    username,
    icon_emoji: iconEmoji(status),
});

/**
 * Map status to status colour
 * @param  {String} status Options: pass, fail
 * @return {String}
 */
const statusColour = status => colors[status.toLowerCase()] || colors.none;
