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
 * @property {String} user          Git user name
 * @property {String} email         Git user email
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
    get user() {
        return memory.user = memory.user || gitData.info.author.split('<').shift().trim() || this.author;
    },
    get email() {
        if (!memory.hasOwnProperty('email')) {
            const match = gitData.info.author && gitData.info.author.match(/(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/);
            memory.email = match && match[0] || '';
        }

        return memory.email;
    },
    get sha() {
        return memory.sha = memory.sha || (ENV_SHA.reduce((result, name) => result || process.env[name], undefined) || gitData.info.sha).substr(0, 7);
    },
    get commitMessage() {
        return memory.commitMessage = memory.commitMessage || gitData.info.commitMessage || 'New tag {RANDOM_MESSAGE}';
    },
};

module.exports = gitData;
