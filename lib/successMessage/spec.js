const {expect} = require('chai');
const successMessage = require('.');

describe('successMessage', () => {
    describe('successMessage', () => {
        const {
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
            expect(pretext).to.equal('*a person* just published my-package:\n> a multi\n> line message');
        });

        it('Should add informative fields', () => {
            expect(fields).to.deep.equal([
                {title: 'author', value: 'a person', short: true},
                {title: 'package', value: 'my-package', short: true},
                {title: 'version', value: '1.2.3-rc', short: true},
                {title: 'tag', value: 'next', short: true},
            ]);
        });
    });
});
