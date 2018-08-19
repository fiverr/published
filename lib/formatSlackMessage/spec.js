const {expect} = require('chai');
const formatSlackMessage = require('.');

describe('formatSlackMessage', () => {
    it('Should build a Slack message format', () => {
        const data = formatSlackMessage({text: 'Hello'});

        expect(data).to.have.all.keys([
            'attachments',
            'channel',
            'username',
            'icon_emoji',
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
        const data = formatSlackMessage({text: 'Hello', something_else: 'Yo'});

        expect(data.attachments[0].text).to.equal('Hello');
        expect(data.attachments[0].something_else).to.equal('Yo');
    });

    describe('status color', () => {
        const getColor = arg => formatSlackMessage(arg).attachments[0].color;

        it('Should be Nephritis green', () => {
            expect(
                getColor({status: 'pass'})
            ).to.equal('#27ae60');
        });
        it('Should be Pomegranate red', () => {
            expect(
                getColor({status: 'fail'})
            ).to.equal('#c0392b');
        });
        it('Should be Nephritis', () => {
            expect(
                getColor({status: 'other'})
            ).to.equal('#7f8c8d');
            expect(
                getColor()
            ).to.equal('#7f8c8d');
        });
    });
});
