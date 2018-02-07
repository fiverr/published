const { expect } = require('chai');
const exec = require('./');

describe('exec', () => {
    it('Should return console output', async () => {
        expect(await exec('echo "Hello"')).to.equal('Hello');
    });
    it('Should return multi line answers', async () => {
        expect(await exec('echo "Hello\nthere"')).to.equal('Hello\nthere');
    });
    it('Should trim line breaks and white space from the edges', async () => {
        expect(await exec('echo "\n\n   Hello        \n\n         "')).to.equal('Hello');
    });
    it('Should always return a string', async () => {
        expect(await exec('echo "hello" > /dev/null')).to.be.a('string');
    });
});
