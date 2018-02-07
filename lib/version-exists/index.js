const { promisify } = require('util');

module.exports = function (module) {
    try {
        return Object.keys(await promisify(this.view)(module, 'version')).length;
    } catch (error) {
        throw error;
    }
}
