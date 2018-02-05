const https = require('https');
const url = require('url');
const { ENV_SLACK_WEBHOOK } = require('../constants');

/**
 * Finds an environment variable out of the possible webhooks
 * @return {string|undefined}
 */
const address = () => ENV_SLACK_WEBHOOK.find(item => process.env.hasOwnProperty(item));

/**
 * Posts webhook with the data
 * @param  {Object} data Data object
 * @return {Promise}
 */
module.exports = (data) => new Promise((resolve, reject) => {
    const webhook = address();

    if (!webhook) {
        resolve();
        return;
    }

    const {
        hostname,
        path,
    } = url.parse(webhook);

    const options = {
        hostname,
        port: 443,
        path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('end', resolve);
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
});
