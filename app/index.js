const { reset } = require('edit-package');
const git = require('async-git');
const {
    formatSlackMessage,
    slackNotification,
    successMessage
} = require('../lib');
const publish = require('./publish');

/**
 * print, publish, notify...
 * @param  {String}  [options.slack.webhook]
 * @param  {String}  [options.slack.channel]
 * @param  {Boolean} [options.quiet]
 * @param  {Boolean} [options.shouldGitTag]
 * @param  {String}  [options.prefixGitTag]
 * @param  {Boolean} [options.testing]
 * @param  {String}  [options.latestBranch]
 * @param  {String}  [options.tagName]
 * @param  {Boolean} [options.noSha]
 * @return {void}
 */
module.exports = async function({ slack = {}, quiet, shouldGitTag, prefixGitTag, testing, latestBranch, tagName, noSha } = {}) {
    const narrate = testing || (quiet !== true);
    let result = null;

    try {
        result = await publish({
            testing,
            shouldGitTag,
            prefixGitTag,
            latestBranch,
            tagName,
            noSha
        });

        const {
            message,
            details
        } = result;

        if (!narrate) {
            return;
        }

        if (details) {
            const body = formatSlackMessage({
                ...successMessage(details),
                channel: slack.channel
            });

            if (testing) {
                console.log(
                    'Slack message:',
                    '\n',
                    JSON.stringify(body, null, 2)
                );
            } else {
                await slackNotification(slack, body);
            }
        }

        console.log(message);

    } catch (error) {
        if (narrate) {
            console.error(error);
            const body = formatSlackMessage({
                username: await git.author,
                status: 'fail',
                pretext: `An error has occured trying to publish from ${await git.name} repository`,
                text: error.message,
                channel: slack.channel
            });
            await slackNotification(slack, body);
        }
    } finally {
        reset();
    }
    return result || {};
};
