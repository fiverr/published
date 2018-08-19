/**
 * Apart from master, tag name is equal to branch name
 * @param  {String} branch
 * @param  {String} [desired='latest'] Desired tag
 * @return {String}
 */
module.exports = (branch, desired = 'latest') => branch === 'master' ? desired : branch.replace(/[^\w-_]/g, '-');
