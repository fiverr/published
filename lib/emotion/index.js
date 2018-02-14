const random = require('../random');
const {
    SMILEYS,
    FROWNEYS,
} = require('../constants');

/**
 * Match a smiley to status
 * @param  {String} status
 * @return {String}
 */
module.exports = (status) => /^(error|fail)$/i.test(status) ? random(FROWNEYS) : random(SMILEYS);
