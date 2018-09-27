const {reset} = require('edit-package');
const git = require('async-git');
const execute = require('async-execute');
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
 * @param  {String}  [options.then]
 * @return {void}
 */
module.exports = async function({slack = {}, quiet, shouldGitTag, testing, then} = {}) {
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

        const {latestBranch, published} = details;
        then && latestBranch && published && console.log(await execute(then));

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
