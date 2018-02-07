const { SMILEYS } = require('../constants');

/**
 * Returns a random "smiley" out of the store
 * @return {String}
 */
module.exports = () => SMILEYS[Math.floor(Math.random() * SMILEYS.length)];
