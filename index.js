#!/usr/bin/env node

(async (options) => {
    try {
        console.log(
            await require('./lib/publish')(options)
        );
    } catch (error) {
        throw error;
    }
})(argsFrom(
        [].slice.call(process.argv),
        Object.keys(require('./package.json').bin).pop()
    ).reduce((options, key) => Object.assign(options, {[key]: true}), {})
);

function argsFrom(args, string) {
    while (args[0] && !args[0].endsWith(string)) {
        args.shift();
    }

    args.shift();

    return args;
}
