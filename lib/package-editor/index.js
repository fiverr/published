const { promisify } = require('util');
const writeFile = promisify(require('fs').writeFile);
const merge = require('lodash.merge');

const JSONCopy = (object) => JSON.parse(JSON.stringify(object));

let _original;
const original = async () => _original = _original || JSONCopy(await require('package-data')());

/**
 * [exports description]
 * @type {[type]}
 *
 * @example
 *
 */
const packageEditor = {

    /**
     * Read package
     * @return {Object}
     *
     * @example
     * await packageEditor.read()
     */
    read: async () => await require('package-data')(),

    /**
     * Edit the package file
     * @param  {Object} data
     * @return {Object}
     *
     * @example
     * await packageEditor.write({name: 'NOT_THE_PACKAGE_NAME'});
     */
    write: async (data) => {
        await original(); // make sure original is stored

        const json = merge(
            {},
            await packageEditor.read(),
            data
        );

        try {
            await writeFile(
                'package.json',
                require('json-beautify')(json, null, 2)
            );
        } catch (error) {
            throw error;
        }

        return json;
    },

    /**
     * Reset to the original package.json
     * @return {Objecy}
     */
    reset: async () => await packageEditor.write(await original()),
};

module.exports = packageEditor;
