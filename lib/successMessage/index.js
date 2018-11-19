/**
 * Format the success notification for Slack
 * @see Slack message builder https://api.slack.com/docs/messages/builder
 * @param  {String} options.author
 * @param  {String} options.name
 * @param  {String} options.homepage
 * @param  {String} options.tag
 * @param  {String} options.version
 * @param  {String} options.message
 * @return {Object} pretext, fields
 */
module.exports = ({
    author,
    name,
    homepage,
    tag = 'latest',
    version,
    message = '',
    ...rest
}) => {
    const pretext = [
        ...message.split('\n').map(line => `> ${line}`),
        `\`\`\`${[name, tag].join('@')}\`\`\``,
    ].join('\n');

    return {
        username: author,
        status: 'pass',
        pretext,
        message: `Published ${link(name, homepage)}`,
        text: `version \`${version}\`, tag \`${tag}\`.`,
        ...rest,
    };
};


/**
 * Wrap text with a slack link if there is a url
 * @param  {String} text
 * @param  {String} [url]
 * @return {String}
 */
const link = (text, url) => url ? `<${url}|${text}>` : text;
