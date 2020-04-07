const postRequest = require('../postRequest');

/**
 * Post slack notification to webhook
 * @param  {String} options.webhook}
 * @param  {Object} body
 * @return {void}
 */
module.exports = async function slackNotification({ webhook } = {}, body) {
    webhook && await postRequest(webhook, body);
};
