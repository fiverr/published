const execute = require('async-execute');

/**
 * Create a tag and push it to remote repository
 * @param  {String} options.version
 * @param  {String} options.subject
 * @param  {String} options.author
 * @param  {String} options.email
 * @param  {Object} options.publishConfig
 * @return {void}
 */
module.exports = async ({version, subject, author = 'Published', email = 'published@ci-cd.net', publishConfig = {}}) => {
    const prefix = publishConfig['tag-version-prefix'] || '';

    await Promise.all([
        execute(`git config --global user.name "${author}"`),
        execute(`git config --global user.email "${email}"`),
    ]);
    await execute(`git tag ${prefix}${version} -a -m "${subject}"`);
    await execute(`git push origin ${version}`);
};