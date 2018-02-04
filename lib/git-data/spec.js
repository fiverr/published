const assert = require('assert');
const { expect } = require('chai');
const importFresh = require('import-fresh');
const values = [
    'CIRCLE_BRANCH',
];

describe('git-data', () => {
    let gitData;
    const originalValues = values.reduce((values, key) => Object.assign({[key]: process.env[key]}));

    beforeEach(() => {
        Object.keys(
            originalValues,
            (key) => {
                delete process.env[key];
            }
        );

        gitData = importFresh('./');
    });

    afterEach(() => {
        Object.entries(
            originalValues,
            ([key, value]) => {
                process.env[key] = value;
            }
        );
    });

    it('should supply git information', () => {
        [
            'sha',
            'branch',
            'author',
            'commitMessage',
        ].forEach(key => expect(gitData.info).to.have.any.keys(key));
    });

    it('Should memoise results', () => {
        process.env.CIRCLE_BRANCH = 'some_feature_branch';
        expect(gitData.branch).to.equal('some_feature_branch');

        delete process.env.CIRCLE_BRANCH;
        expect(gitData.branch).to.equal('some_feature_branch');

        process.env.CIRCLE_BRANCH = 'some_other_branch';
        expect(gitData.branch).to.equal('some_feature_branch');
    });

    it('takes project name', () => {

        // Circle
        process.env.CIRCLE_PROJECT_REPONAME = 'CircleProject';
        expect(importFresh('./').name).to.equal('CircleProject');
        delete process.env.CIRCLE_PROJECT_REPONAME;

        // Travis
        process.env.TRAVIS_REPO_SLUG = 'UserName/TravisProject';
        expect(importFresh('./').name).to.equal('TravisProject');
        delete process.env.TRAVIS_REPO_SLUG;
    });

    it('Can import specific getters', () => {
        const { author } = importFresh('./');
        expect(author).to.be.a('string');
    });
});
