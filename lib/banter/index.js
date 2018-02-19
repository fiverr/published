const random = require('../random');
const {
    CHATTER,
    HECKLER,
} = require('../constants');

/**
 * Match a message to status
 * @param  {String} status
 * @return {String}
 */
module.exports = (status) => /^(error|fail)$/i.test(status) ? random(HECKLER) : random(CHATTER);
