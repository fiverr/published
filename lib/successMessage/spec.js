const {expect} = require('chai');
const successMessage = require('.');

describe('successMessage', () => {
    describe('successMessage', () => {
        const {
            username,
            status,
            pretext,
            fields,
        } = successMessage({
            author: 'a person',
            name: 'my-package',
            tag: 'next',
            version: '1.2.3-rc',
            message: 'a multi\nline message',
        });

        it('Should format a message including the commit message', () => {
            expect(username).to.equal('a person');
            expect(status).to.equal('pass');
            expect(pretext).to.equal('Published my-package\n> a multi\n> line message');
        });

        it('Should add informative fields', () => {
            expect(fields).to.deep.equal([
                {title: 'version', value: '1.2.3-rc', short: true},
                {title: 'tag', value: 'next', short: true},
                {title: 'install', value: '`my-package@next`', short: false},
            ]);
        });
    });
});
