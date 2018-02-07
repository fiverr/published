#!/usr/bin/env node

(async (options) => {
    try {
        console.log(
            await require('./lib/publish')(options)
        );
    } catch (error) {
        console.error(error);
    }
})(
    optionsFrom(
        [].slice.call(process.argv),
        Object.keys(require('./package.json').bin).pop(),
        'index.js'
    )
);

/**
 * All "rest" arguments become keys of an options object with "true" value
 * @param  {array}     args
 * @param  {...string} strings
 * @return {Object}
 *
 * @example
 * node ./index.js testing // {testing: true}
 * published testing       // {testing: true}
 * npx published testing   // {testing: true}
 * npm start -- testing    // {testing: true}
 */
function optionsFrom(args, ...strings) {
    while (args[0] && !strings.some(string => args[0].endsWith(string))) {
        args.shift();
    }

    args.shift();

    return args.reduce(
        (options, key) => Object.assign(options, {[key]: true}),
        {}
    );
}
