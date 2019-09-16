const dummies = {};
function fake(name, value) {
    require(name);
    require.cache[require.resolve(name)].exports = value;
}

function _before() {
    fake(
        'edit-package',
        {
            reset: (...args) => dummies.reset(...args)
        }
    );
    fake(
        './publish',
        (...args) => dummies.publish(...args)
    );
    fake(
        '../lib/slackNotification',
        (...args) => dummies.slack(...args)
    );
}

function _beforeEach() {
    dummies.reset = () => null;
    dummies.publish = () => ({message: 'dummy'});
}

const log = console.log;
const error = console.error;
function _afterEach() {
    console.log = log;
    console.error = error;
}

function _after() {
    [
        'edit-package',
        './publish',
        '../lib/slackNotification'
    ].forEach((pkg) => {
        delete require.cache[require.resolve(pkg)];
    });
}

module.exports = {
    dummies,
    _before,
    _beforeEach,
    _afterEach,
    _after
};
