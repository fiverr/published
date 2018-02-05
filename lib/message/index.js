require('colors');
const phrase = require('paraphrase/dollar');

/**
 * Wraps object values using a given method
 * @param  {Object}   [data={}]          Original data object
 * @param  {Function} [convert=(a) => a] Wrapping method. Default returns the first argument
 * @return {Object}                      Object copy with wrapped values
 */
const convertKeys = (data = {}, convert = (thing) => thing) => Object.entries(data).reduce(
    (collector, [key, value]) => {
        collector[key] = convert(value);

        return collector;
    },
    {}
);

/**
 * @typedef  MessageStruct
 * @type     {Object}
 * @property {string}   plain    Provides a filled out message (filled with variables values)
 * @property {string}   console  Underlines variables in the console
 * @property {string}   md       Highlights variables in markdown style
 * @property {Function} toString Returns plain text representation
 */

/**
 * Fills variables in text and highlights them
 * @param  {string} string Template of the message
 * @param  {Object} [data] Data members to fill in the template
 * @return {MessageStruct} Various styles of the interpolated message
 */
module.exports = (string, data) => ({
    plain: phrase(string, convertKeys(data)),
    toString: () => phrase(string, convertKeys(data)),
    console: phrase(string, convertKeys(data, (item => item.underline))),
    md: phrase(string, convertKeys(data, (item => `*${item}*`))),
});

