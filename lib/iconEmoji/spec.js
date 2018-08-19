const {expect} = require('chai');
const iconEmoji = require('.');
const {
    SMILEYS,
    FROWNEYS,
    INDIFERENT,
} = iconEmoji;

describe('iconEmoji', () => {
    [
        true,
        'SMILE',
        'Good',
        'pass',
    ].forEach(item => it(`Should express a positive emotion for ${item}`, () =>
            expect(iconEmoji(item)).to.be.oneOf(SMILEYS)
        )
    );
    [
        false,
        'FROWN',
        'Bad',
        'fail',
    ].forEach(item => it(`Should express a negative emotion for ${item}`, () =>
            expect(iconEmoji(item)).to.be.oneOf(FROWNEYS)
        )
    );
    [
        null,
        '',
        'Hello',
        3,
    ].forEach(item => it(`Should express an indiferent emotion for ${item}`, () =>
            expect(iconEmoji(item)).to.be.oneOf(INDIFERENT)
        )
    );
});
