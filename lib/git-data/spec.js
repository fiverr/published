const assert = require('assert');
const { expect } = require('chai');
const importFresh = require('import-fresh');
const values = [
    'CIRCLE_BRANCH',
];

describe('git-data', () => {
    const originalValues = values.reduce((values, key) => Object.assign({[key]: process.env[key]}));
    let gitData;

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

    [
        'name',
        'branch',
        'author',
        'email',
        'sha',
        'message',
    ].forEach(member => it(`${member} getter should retreive a string`, async () => {
        const value = await gitData[member];
        expect(value).to.be.a('string');
        expect(value).to.have.lengthOf.at.least(1);
    }));

    it('Should memoise results', async () => {
        process.env.CIRCLE_BRANCH = 'some_feature_branch';
        expect(await gitData.branch).to.equal('some_feature_branch');

        delete process.env.CIRCLE_BRANCH;
        expect(await gitData.branch).to.equal('some_feature_branch');

        process.env.CIRCLE_BRANCH = 'some_other_branch';
        expect(await gitData.branch).to.equal('some_feature_branch');
    });

    it('Should find project name', async () => {

        // Circle
        process.env.CIRCLE_PROJECT_REPONAME = 'CircleProject';
        expect(await importFresh('./').name).to.equal('CircleProject');
        delete process.env.CIRCLE_PROJECT_REPONAME;

        // Travis
        process.env.TRAVIS_REPO_SLUG = 'UserName/TravisProject';
        expect(await importFresh('./').name).to.equal('TravisProject');
        delete process.env.TRAVIS_REPO_SLUG;
    });

    it('Should be able to import specific getters', async () => {
        const { author } = importFresh('./');
        expect(await author).to.be.a('string');
    });
});
