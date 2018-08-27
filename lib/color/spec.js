const {expect} = require('chai');
const color = require('.');

describe('color', () => {
    ['pass', true].forEach(term => it(
        `Should translate ${term} to Nephritis (green)`,
        () => expect(color(term)).to.equal('#27ae60'))
    );

    ['fail', false].forEach(term => it(
        `Should translate ${term} to Pomegranate (red)`,
        () => expect(color(term)).to.equal('#c0392b'))
    );

    ['other', undefined].forEach(term => it(
        `Should translate ${term} to Asbestos (gray)`,
        () => expect(color(term)).to.equal('#7f8c8d'))
    );
});
