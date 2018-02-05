const { promisify } = require('util');
const assert = require('assert');
const packageExists = require('./');

describe('package-exists', () => {
    let npm;
    beforeEach(async () => {
        npm = await promisify(require('npm').load)();
    });

    it('Returns true if a package exists', async function () {
        this.timeout(3000);
        this.retries(2);

        assert(await packageExists.call(npm, 'npm'), 'claims npm package does not exist');
    });

    it('Returns false if a package does not exists', async function () {
        this.timeout(3000);
        this.retries(2);

        assert(!await packageExists.call(npm, '@bender/kill-all-humans'), 'claims @bender/kill-all-humans exists');
    });

    it('Returns true if a package has a version', async function () {
        this.timeout(3000);
        this.retries(2);

        assert(await packageExists.call(npm, 'npm@5.6.0'), 'claims npm@5.6.0 does not exist');
    });

    it('Returns false if a package doesn\'t have a version', async function () {
        this.timeout(3000);
        this.retries(2);

        assert(!await packageExists.call(npm, 'npm@4.32.10'), 'claims npm@4.32.10 exists');
    });
});
