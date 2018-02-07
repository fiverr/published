const RANDOM_ENV_VAR = 'a' + Math.random().toString(36).substring(2);
const { expect } = require('chai');
const anyEnvVar = require('./');

describe('any-env-var', () => {
    beforeEach(() => {
        process.env[RANDOM_ENV_VAR] = 'Value';
    });
    afterEach(() => {
        delete process.env[RANDOM_ENV_VAR];
    });
    it('finds the environment variable', () => {
        expect(anyEnvVar(RANDOM_ENV_VAR)).to.equal('Value');
    });
    it('does not find the environment variable', () => {
        expect(anyEnvVar(RANDOM_ENV_VAR + 'not')).to.be.undefined;
    });
    it('finds the environment variable on the second argument', () => {
        expect(anyEnvVar(RANDOM_ENV_VAR + 'not', RANDOM_ENV_VAR)).to.equal('Value');
    });
});
