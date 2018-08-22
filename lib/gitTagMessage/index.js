module.exports = async (condition, action) => {
    if (!condition) { return undefined; }

    try {
        await action();
        return 'Pushed git tag';
    } catch (error) {
        return 'Failed to push git tag';
    }
};
