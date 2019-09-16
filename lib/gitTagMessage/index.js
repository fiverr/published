module.exports = async(condition, action) => {
    if (!condition) { return []; }

    try {
        await action();
        return ['Pushed git tag', true];
    } catch (error) {
        return ['Failed to push git tag', false];
    }
};
