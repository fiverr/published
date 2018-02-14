const { expect } = require('chai');
const statusColour = require('./');
const {
    COLOR_OKAY,
    COLOR_NEUTRAL,
    COLOR_ERROR,
} = require('../constants');

describe('status-colour', () => {
    it('Should retrieve correct colours from the constants file', () => {
        expect(statusColour('okay')).to.equal(COLOR_OKAY);
        expect(statusColour('success')).to.equal(COLOR_OKAY);
        expect(statusColour('error')).to.equal(COLOR_ERROR);
        expect(statusColour('fail')).to.equal(COLOR_ERROR);
        expect(statusColour('neutral')).to.equal(COLOR_NEUTRAL);
    });
    it('Should default and fall back to neutral', () => {
        expect(statusColour()).to.equal(COLOR_NEUTRAL);
        expect(statusColour('other')).to.equal(COLOR_NEUTRAL);
    });
    it('Should be case insensitive', () => {
        expect(statusColour('okay')).to.equal(statusColour('OKAY'));
        expect(statusColour('error')).to.equal(statusColour('ERROR'));
        expect(statusColour('other')).to.equal(statusColour('OTHER'));
    });
});
