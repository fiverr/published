const asyncExec = require('util').promisify(require('child_process').exec);

/**
 * Execute command line in a child process
 * @param  {...String} args Commands
 * @return {String}
 */
async function exec (...args) {
  const { stdout, stderr } = await asyncExec(...args);

  if (stderr) {
    throw new Error(stderr);
  }

  return stdout.trim();
}

/**
 * @typedef           gitData
 * @description       Git data getters
 * @type     {Object}
 * @property {String} author  Author of the last commit
 * @property {String} email   Git user email
 * @property {String} message Most recent commit message
 */
// const gitData = {
//   get author()  { return (async () => await exec('git log -1 --pretty=%an'))(); },
//   get email()   { return (async () => await exec('git log -1 --pretty=%ae'))(); },
//   get message() { return (async () => await exec('git log -1 --pretty=%B') )(); },
// };

const gitData = Object.defineProperties({}, {
  author:  { get: async () => await exec('git log -1 --pretty=%an') },
  email:   { get: async () => await exec('git log -1 --pretty=%ae') },
  message: { get: async () => await exec('git log -1 --pretty=%B') },
});

/**
 * Create a tag by the last commit's author with it's message
 * @param  {String} tag Tag name (e.g. v1.1.0)
 * no return value
 */
 async function start (tag=  '1.0.0') {
  const { message, author, email } = gitData;

  try {
    console.log(
      await message,
      await author,
      await email,
      await tag
        );

    // await exec(`git config --global user.name "${await author}"`);
    // await exec(`git config --global user.email "${await email}"`);
    // await exec(`git tag -a ${tag} -m "${await message}"`);
    // await exec(`git push origin refs/tags/${tag}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

start();
