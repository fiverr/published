const {expect} = require('chai');
const getTagMessage = require('.');

describe('getTagMessage', async() => {
    it('Should be undefined when condition is falsy', async() => {
        expect(await getTagMessage(false)).to.be.undefined;
    });

    it('Should try to execute the passed action', async() => {
        let called = false;
        await getTagMessage(true, () => { called = true; });
        expect(called).to.be.true;
    });

    it('Should say that a tag was puched', async() => {
        const message = await getTagMessage(true, () => null);
        expect(message.toLowerCase()).to.include('git tag');
    });

    it('Should say so when action failed', async() => {
        const message = await getTagMessage(true, () => { throw new Error(); });
        expect(message.toLowerCase()).to.include('failed');
    });
});
