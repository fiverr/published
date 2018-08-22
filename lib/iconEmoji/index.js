const random = require('doamrn');

const SMILEYS = [
    ':smiley:',
    ':grinning:',
    ':blush:',
    ':wink:',
    ':yum:',
    ':sunglasses:',
    ':hugging_face:',
    ':monkey:',
    ':sunflower:',
    ':birthday:',
    ':beers:',
    ':medal:',
    ':champagne:',
    ':confetti_ball:',
    ':rocket:',
    ':sparkles:',
    ':bowtie:',
];

const FROWNEYS = [
    ':disappointed:',
    ':confounded:',
    ':sob:',
    ':pouting_cat:',
    ':scream_cat:',
    ':see_no_evil:',
    ':skull:',
    ':warning:',
    ':do_not_litter:',
    ':bangbang:',
    ':imp:',
];

const INDIFERENT = [
    ':package:',
];

const feel = emotion => {
    emotion = typeof emotion === 'string' ? emotion.toLowerCase() : emotion;

    switch (emotion) {
        case true:
        case 'smile':
        case 'good':
        case 'pass':
            return random(...SMILEYS);
        case false:
        case 'frown':
        case 'bad':
        case 'fail':
            return random(...FROWNEYS);
        default:
            return random(...INDIFERENT);
    }
};

Object.assign(
    feel,
    {
        SMILEYS,
        FROWNEYS,
        INDIFERENT,
    }
);

module.exports = feel;
