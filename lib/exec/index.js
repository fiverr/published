const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async function (...args) {
    const {
        stdout,
        stderr,
    } = (await exec(...args));

    if (stderr) {
        throw stderr;
    }

    return stdout.trim();
}
