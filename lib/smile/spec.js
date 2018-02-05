const { expect } = require('chai');
const constants = require('../constants');
const smile = require('./');
const DUMMY_SMILEYS = Array.from(Array(40)).map((_, i) => `:${i + 1}:`);
const { SMILEYS } = constants;

describe('smile', () => {
    let _SMILEYS;

    beforeEach(() => {
        _SMILEYS = SMILEYS.splice(0);
        constants.SMILEYS.push(...DUMMY_SMILEYS);
    });
    afterEach(() => {
        constants.SMILEYS.splice(0);
        constants.SMILEYS.push(..._SMILEYS);
    });

    it('should retrieve a member of SMILEYS collection', () => {
        expect(DUMMY_SMILEYS).to.include(smile());
    });

    it('should retrieve a random item each time', function() {
        this.retries(4);

        expect(smile()).not.to.equal(smile());
    });
});
