const exec = require('../exec');

/**
 * Prefix the errors so we know it's own own error
 * @type {String}
 */
const ERROR_PREFIX = '!!';

module.exports = async (tag) => {
    const {
        message = 'Automatic tag created',
        author = 'Automatic publisher',
        email = 'published@ci-cd.net',
    } = require('../git-data');

    if (!tag) {
        throw new Error('No tag was supplied');
    }

    try {
        await exec(`git config --global user.name "${await author}"`);
        await exec(`git config --global user.email "${await email}"`);
        await exec(`git tag -a ${tag} -m "${await message}"`);
        const response = await exec(`git push origin refs/tags/${await tag}`);

        if (response.toLowerCase().includes('error:')) {
            throw new Error(`${ERROR_PREFIX}${response}`);
        }
    } catch (error) {
        if (error.message && error.message.startsWith(ERROR_PREFIX)) {
            throw new Error(`Could not push Git tag.\n${error.replace(ERROR_PREFIX, '')}`);
        }
    }

    return `Pushed git tag ${await tag} with message "${await message}" as ${await author}.`;
};
