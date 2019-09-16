const NEPHRITIS = '#27ae60';
const POMEGRANATE = '#c0392b';
const ASBESTOS = '#7f8c8d';

const colors = {
    pass: NEPHRITIS,
    true: NEPHRITIS,
    fail: POMEGRANATE,
    false: POMEGRANATE,
    none: ASBESTOS
};

/**
 * Map status to status colour
 * @param  {String} [status] Options: pass, fail
 * @return {String}
 */
module.exports = (status = '') => colors[status.toString().toLowerCase()] || colors.none;
