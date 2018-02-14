const {
    COLOR_OKAY,
    COLOR_NEUTRAL,
    COLOR_ERROR,
} = require('../constants');

/**
 * Map status to status colour
 * @param  {String} [status] Options: okay, success, error, fail...
 * @return {String}
 */
module.exports = (status) => ({
    okay: COLOR_OKAY,
    success: COLOR_OKAY,
    error: COLOR_ERROR,
    fail: COLOR_ERROR,
}[`${status}`.toLowerCase()] || COLOR_NEUTRAL);
