const { expect } = require('chai');
const formatSlackMessage = require('.');

describe('formatSlackMessage', () => {
    it('Should build a Slack message format', () => {
        const data = formatSlackMessage({ text: 'Hello' });

        expect(data).to.have.all.keys([
            'attachments',
            'channel',
            'text',
            'username',
            'icon_emoji'
        ]);
    });
    it('Should build a message with one attachment', () => {
        expect(formatSlackMessage().attachments).to.be.lengthOf(1);
    });
    it('Should have a default username, but not channel, text or title', () => {
        const data = formatSlackMessage();

        expect(data.username).to.equal('published');
        expect(data.channel).to.be.undefined;
        expect(data.attachments[0].text).to.be.undefined;
        expect(data.attachments[0].title).to.be.undefined;
    });
    it('Should append any arbitrary field to the attachment', () => {
        const data = formatSlackMessage({ text: 'Hello', something_else: 'Yo' });

        expect(data.attachments[0].text).to.equal('Hello');
        expect(data.attachments[0].something_else).to.equal('Yo');
    });
    it('Should add additional attachments after the default one', () => {
        const data = formatSlackMessage({ text: 'Hello', attachments: [{ text: 'Some additional message' }] });
        expect(data.attachments).to.have.lengthOf(2);

        expect(data.attachments[0].text).to.equal('Hello');
        expect(data.attachments[1].text).to.equal('Some additional message');
    });
});
