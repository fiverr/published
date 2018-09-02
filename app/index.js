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

    try {
        const {
            message,
            details,
        } = await publish({
            testing,
            shouldGitTag,
        });

        narrate && console.log(message);
        if (testing) { return; }
        if (!details) { return; }

        if (narrate) {
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
};
