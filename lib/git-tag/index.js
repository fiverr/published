const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const create = promisify(require('git-tag')().create);

module.exports = async (newTag) => {
    const {
        commitMessage,
        tag,
        user,
        email,
    } = require('../git-data');

    if (!newTag) {
        throw new Error('No tag was supplied');
    }

    if (newTag === tag) {
        return;
    }

    await exec(`git config user.email "${email}"; git config user.name "${user}"`)

    try {
        return await create(newTag, commitMessage)
    } catch (error) {
        throw error;
    }
};
