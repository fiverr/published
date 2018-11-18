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
    const pretext = [`Published ${link(name, homepage)}`,
            ...message.split('\n').map(line => `> ${line}`),
            ].join('\n');
    const fields = [
        ['version', version],
        ['tag', tag],
        ['install', `\`${[name, tag].join('@')}\``, false],
    ].map(([title, value, short = true]) => ({
        title,
        value,
        short,
    }));

    return {
        username: author,
        status: 'pass',
        pretext,
        fields,
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
