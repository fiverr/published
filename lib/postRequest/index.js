const https = require('https');
const url = require('url');

/**
 * Posts webhook with the data
 * @param  {String} address Webhook URL
 * @param  {Object} data    Body
 * @return {Promise}
 */
module.exports = (address, data) => new Promise(
    (resolve, reject) => {
        const {
            hostname,
            path
        } = url.parse(address);

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
    }
);
