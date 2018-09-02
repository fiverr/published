function fake(name, value) {
    require(name);
    require.cache[require.resolve(name)].exports = value;
}
const noop = () => null;
function err() {
    throw new Error('I should have not been called');
}

const NPM_FUNCTIONS = {};
const NPM_FUNCTIONS_DEFAULTS = {
    config: noop,
    exists: noop,
    getVersion: noop,
    setTag: err,
    publish: err,
};

const GIT_DETAILS = {};
const GIT_DETAILS_DEFAULTS = {
    branch:   'master',
    author:   'the author',
    email:    'author@email.net',
    subject:  'Some subject',
    message:  'Some subject\n\nDid a thing',
    short:    '12345678',
};

const PKG_DETAILS = {};
const PKG_DETAILS_DEFAULTS = {
    name:          'fake-package-name',
    version:       '1.0.0',
    homepage:      'https://www.website.net',
    publishConfig: undefined,
};

function _before() {
    fake(
        'edit-package',
        {
            read: () => Object.defineProperties(
                {},
                Object.keys(PKG_DETAILS_DEFAULTS).reduce(
                    (accumulator, key) => ({
                        ...accumulator,
                        [key]: {get: () => PKG_DETAILS[key]},
                    }),
                    {}
                )
            ),
            write: () => null,
        }
    );

    fake(
        'async-git',
        Object.defineProperties(
            {},
            Object.keys(GIT_DETAILS_DEFAULTS).reduce(
                (accumulator, key) => ({
                    ...accumulator,
                    [key]: {get: () => GIT_DETAILS[key]},
                }),
                {}
            )
        )
    );

    fake(
        'jsnpm',
        Object.defineProperties(
            {},
            Object.keys(NPM_FUNCTIONS_DEFAULTS).reduce(
                (accumulator, key) => ({
                    ...accumulator,
                    [key]: {get: () => NPM_FUNCTIONS[key]},
                }),
                {}
            )
        )
    );
}

function _beforeEach() {
    Object.assign(NPM_FUNCTIONS, NPM_FUNCTIONS_DEFAULTS);
    Object.assign(GIT_DETAILS, GIT_DETAILS_DEFAULTS);
    Object.assign(PKG_DETAILS, PKG_DETAILS_DEFAULTS);
    delete require.cache[require.resolve('.')];
}

function _afterEach() {}

function _after() {
    [
        'edit-package',
        'async-git',
        'jsnpm',
        '.',
    ].forEach(pkg => {
        delete require.cache[require.resolve(pkg)];
    });
}

module.exports = {
    NPM_FUNCTIONS,
    GIT_DETAILS,
    PKG_DETAILS,
    _before,
    _beforeEach,
    _afterEach,
    _after,
};
