const {reset} = require('edit-package');
const git = require('async-git');
const {
    formatSlackMessage,
    slackNotification,
    successMessage,
} = require('../lib');
const publish = require('./publish');

/**
 * print, publish, notify...
 * @param  {String} [options.slack.webhook]
 * @param  {String} [options.slack.channel]
 * @param  {Boolean} [options.quiet]
 * @param  {Boolean} [options.shouldGitTag]
 * @param  {Boolean} [options.testing]
 * @return {void}
 */
module.exports = async function({slack = {}, quiet, shouldGitTag, testing} = {}) {
    const narrate = testing || (quiet !== true);
    let result = null;

    try {
        result = await publish({
            testing,
            shouldGitTag,
        });

        const {
            message,
            details,
        } = result;

        narrate && console.log(message);

        if (narrate && details && !testing) {
            const body = formatSlackMessage({
                ...successMessage(details),
                channel: slack.channel,
            });
            await slackNotification(slack, body);
        }
    } catch (error) {
        if (narrate) {
            console.error(error);
            const body = formatSlackMessage({
                username: await git.author,
                status: 'fail',
                pretext: `An error has occured trying to publish from ${await git.name} repository`,
                text: error.message,
                channel: slack.channel,
            });
            await slackNotification(slack, body);
        }
    } finally {
        reset();
    }
    return result || {};
};
