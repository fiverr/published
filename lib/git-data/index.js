const GIT_REPO_INFO = 'git-repo-info';
const {
    ENV_PROJECT,
    ENV_BRANCH,
    ENV_AUTHOR,
    ENV_SHA,
} = require('../constants');

/**
 * memory
 * @type {Object}
 */
const memory = {};
const anyEnvVar = require('../any-env-var')

/**
 * @typedef           gitGet
 * @description       Get git info
 * @type     {Object}
 * @property {Object} info          Information about the git instance
 * @property {String} name          Project name
 * @property {String} branch        Current branch name
 * @property {String} tag           Current git tag
 * @property {String} author        Author of the last commit
 * @property {String} sha           Unique identifier of the last commit
 * @property {String} commitMessage Most recent commit message
 */
const gitData = {
    get info() {
        return memory.info = memory.info || require(GIT_REPO_INFO)();
    },
    get name() {
        return memory.name = memory.name || (anyEnvVar(...ENV_PROJECT) || '').split('/').pop();
    },
    get branch() {
        return memory.branch = memory.branch || anyEnvVar(...ENV_BRANCH) || gitData.info.branch;
    },
    get tag() {
        return memory.tag = memory.tag || gitData.info.tag;
    },
    get author() {
        return memory.author = memory.author || anyEnvVar(...ENV_AUTHOR) || gitData.info.author || 'Publishing bot :robot_face:';
    },
    get sha() {
        return memory.sha = memory.sha || (ENV_SHA.reduce((result, name) => result || process.env[name], undefined) || gitData.info.sha).substr(0, 7);
    },
    get commitMessage() {
        return memory.commitMessage = memory.commitMessage || gitData.info.commitMessage || 'New tag {RANDOM_MESSAGE}';
    },
};

module.exports = gitData;
