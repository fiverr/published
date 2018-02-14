const https = require('https');
const url = require('url');
const { ENV_SLACK_WEBHOOK } = require('../constants');

/**
 * Posts webhook with the data
 * @param  {Object} data Data object
 * @return {Promise}
 */
module.exports = (data) => new Promise((resolve, reject) => {
    const webhook = require('../any-env-var')(...ENV_SLACK_WEBHOOK);

    if (!webhook) {
        console.log(`No environment variable for webhook (${ENV_SLACK_WEBHOOK.join(', ')})`);

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
        res.on('data', resolve);
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
});
