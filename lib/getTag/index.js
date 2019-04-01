/**
 * Apart from master, tag name is equal to branch name
 * @param  {String}  branch
 * @param  {String}  [desired='latest'] Desired tag
 * @param  {Boolean} [isLatest]         Is "latest" branch
 * @return {String}
 */
module.exports = (branch, desired = 'latest', isLatest) => isLatest ? desired : branch.replace(/[^\w-_]/g, '-');
