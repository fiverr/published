const gitTag = require('git-tag')();

module.exports = (newTag) => new Promise((resolve, reject) => {
    const {
        commitMessage,
        tag,
    } = require('../git-data');

    if (!newTag) {
        reject(new Error('No tag was supplied'));
    }

    if (newTag === tag) {
        resolve();
    }

    gitTag.create(
        newTag,
        commitMessage,
        (error, response) => {
            if (error) {
                reject(error);
            }

            resolve(response);
        }
    );
});
