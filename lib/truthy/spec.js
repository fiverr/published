const { expect } = require('chai');
const truthy = require('.');

describe('truthy', () => {
    it('Should find true and the string true - truthy', () =>
        [
            true,
            'true'
        ].forEach((item) => expect(truthy(item)).to.be.true)
    );
    it('Should find other things falsy', () =>
        [
            false,
            'false',
            undefined,
            null,
            0,
            'something',
            {}
        ].forEach((item) => expect(truthy(item)).to.be.false)
    );
});
