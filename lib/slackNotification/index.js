const postRequest = require('../postRequest');

/**
 * [slackNotification description]
 * @param  {Object} options.webhook} [description]
 * @param  {[type]} body              [description]
 * @return {[type]}                   [description]
 */
module.exports = async function slackNotification({webhook} = {}, body) {
    webhook && await postRequest(webhook, body);
}
