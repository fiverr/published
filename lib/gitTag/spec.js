const {expect} = require('chai');
const dummy = {};

describe('gitTag', async() => {
    require('async-execute');
    require.cache[require.resolve('async-execute')].exports = (...args) => dummy.stub(...args);
    const gitTag = require('.');

    it('Should create a git tag with given message and push it', async() => {
        const lines = [
            'git tag 1.1.1 -a -m "Hello, world"',
            'git push origin 1.1.1',
        ];

        dummy.stub = command => lines.splice(lines.indexOf(command), 1);

        await gitTag({version: '1.1.1', message: 'Hello, world'});
        expect(lines).to.have.lengthOf(0);
    });

    it('Should use a given user', async() => {
        const lines = [
            'git config --global user.name "Username"',
            'git config --global user.email "email@website.org"',
        ];

        dummy.stub = command => lines.splice(lines.indexOf(command), 1);

        await gitTag({version: '1.1.1', message: 'Hello, world', author: 'Username', email: 'email@website.org'});
        expect(lines).to.have.lengthOf(0);
    });

    it('Should have a default user', async() => {
        const lines = [
            'git config --global user.name "Published"',
            'git config --global user.email "published@ci-cd.net"',
        ];

        dummy.stub = command => lines.splice(lines.indexOf(command), 1);

        await gitTag({version: '1.1.1', message: 'Hello, world'});
        expect(lines).to.have.lengthOf(0);
    });

    it('Should Add a tag prefix', async() => {
        const lines = [
            'git tag v1.1.1 -a -m "Hello, world"',
            'git push origin v1.1.1',
        ];

        dummy.stub = command => lines.splice(lines.indexOf(command), 1);

        await gitTag({version: '1.1.1', message: 'Hello, world', publishConfig: 'v'});
        expect(lines).to.have.lengthOf(0);
    });
});
