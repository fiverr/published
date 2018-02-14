const { expect } = require('chai');
const emotion = require('./');
const {
    SMILEYS,
    FROWNEYS,
} = require('../constants');

describe('emotion', () => {
    it('Should smileys for good statuses and as default', () => {
        expect(SMILEYS).to.include(emotion('success'));
        expect(SMILEYS).to.include(emotion('Success'));
        expect(SMILEYS).to.include(emotion('anything'));
        expect(FROWNEYS).not.to.include(emotion('anything'));
    });
    it('Should frowneys for bad statuses and be case insensitive', () => {
        expect(FROWNEYS).to.include(emotion('fail'));
        expect(FROWNEYS).to.include(emotion('error'));
        expect(FROWNEYS).to.include(emotion('Fail'));
        expect(FROWNEYS).to.include(emotion('ERROR'));
    });
});
