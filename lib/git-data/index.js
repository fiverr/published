const exec = require('../exec');
const anyEnvVar = require('../any-env-var')
const {
    ENV_PROJECT,
    ENV_BRANCH,
    ENV_AUTHOR,
    ENV_SHA,
} = require('../constants');

const GIT_LOG = {
    name: '%an',
    email: '%ae',
    sha: '%h',
    message: '%B',
};

const log = async (part) => await exec(`git log -1 --pretty=${GIT_LOG[part]}`);

/**
 * memory
 * @type {Object}
 */
const memory = {};

/**
 * @typedef           gitGet
 * @description       Get git info
 * @type     {Object}
 * @property {String} name    Project name
 * @property {String} branch  Current branch name
 * @property {String} author  Author of the last commit
 * @property {String} email   Git user email
 * @property {String} sha     Unique identifier of the last commit
 * @property {String} message Most recent commit message
 */
module.exports = Object.defineProperties(
    {},
    Object.entries(
        {
            name: async () => (anyEnvVar(...ENV_PROJECT) || '').split('/').pop() || await exec('basename `git rev-parse --show-toplevel`'),
            branch: async () => anyEnvVar(...ENV_BRANCH) || await exec('git rev-parse --abbrev-ref HEAD'),
            author: async () => await log('name') || anyEnvVar(...ENV_AUTHOR) || 'Publishing bot :robot_face:',
            email: async () => await log('email'),
            sha: async () => anyEnvVar(...ENV_SHA).substr(0, 7) || await log('sha'),
            message: async () => await log('message'),
        }
    ).reduce(
        (props, [key, value]) => {
            return Object.assign(
                props,
                {
                    [key]: {
                        get: async () => memory[key] = memory[key] || await value(),
                        configurable: true,
                    }
                }
            )
        },
        {}
    )
);
