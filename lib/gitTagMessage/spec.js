const { expect } = require('chai');
const gitTagMessage = require('.');

describe('gitTagMessage', async() => {
    it('Should be undefined when condition is falsy', async() => {
        expect(await gitTagMessage(false)).to.have.lengthOf(0);
    });

    it('Should try to execute the passed action', async() => {
        let called = false;
        await gitTagMessage(true, () => { called = true; });
        expect(called).to.be.true;
    });

    it('Should say that a tag was puched', async() => {
        const [message, success] = await gitTagMessage(true, () => null);
        expect(success).to.be.true;
        expect(message.toLowerCase()).to.include('git tag');
    });

    it('Should say so when action failed', async() => {
        const [message, success] = await gitTagMessage(true, () => { throw new Error(); });
        expect(success).to.be.false;
        expect(message.toLowerCase()).to.include('failed');
    });
});
