const { promisify } = require('util');

/**
 * Check if a module exists in NPM registry
 * @param  {String} module
 * @return {Boolean}
 *
 * @example
 * await packageExists('my_package')       // Package exists
 * await packageExists('my_package@1.1.0') // Version exists
 * await packageExists('my_package@next')  // Tag exists
 */
module.exports = async function (module) {
    try {
        const versions = await promisify(this.view)(module, 'version');

        return Object.keys(versions).length;
    } catch (error) {
        return false;
    }
}
