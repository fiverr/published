const {expect} = require('chai');
const successMessage = require('.');

describe('successMessage', () => {
    describe('successMessage', () => {
        const {
            username,
            status,
            message,
            pretext,
            text,
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
            expect(message).to.equal('Published my-package');
            expect(pretext).to.equal('> a multi\n> line message\n```my-package@next```');
            expect(text).to.equal('version `1.2.3-rc`, tag `next`.');
        });
    });
});
