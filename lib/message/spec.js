const { expect } = require('chai');
const message = require('./');
require('colors');

describe('message', () => {
    const struct = message(
        'I have two variables: ${one} and ${two}',
        {one: '_ONE_', two: '_TWO_'}
    );

    it('works without data', () => {
        [
            'plain',
            'console',
            'md',
        ].forEach(member => expect(message('I have no variables')[member]).to.equal('I have no variables'));
    });

    it('builds plain text', () => {
        expect(struct.plain).to.equal('I have two variables: _ONE_ and _TWO_');
    });

    it('markdown marks the variables bold', () => {
        expect(struct.md).to.equal('I have two variables: *_ONE_* and *_TWO_*');
    });

    xit('console marks the variables with underline', () => {
        expect(struct.console).to.equal('I have two variables: \u001b[4m_ONE_\u001b[24m and \u001b[4m_TWO_\u001b[24m');
        expect(struct.console).to.equal(`I have two variables: ${'_ONE_'.underline} and ${'_TWO_'.underline}`);
    });

    it('message string representation matched the plain text', () => {
        expect(`${struct}`).to.equal(struct.plain);
    });
});
