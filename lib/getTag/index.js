/**
 * Apart from master, tag name is equal to branch name
 * @param  {String} branch
 * @param  {String} desired Desired tag
 * @return {String}
 */
module.exports = (branch, desired) => branch === 'master' ? desired : branch.replace(/[^\w-_]/g, '-');
