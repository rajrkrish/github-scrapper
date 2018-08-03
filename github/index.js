/**
 * Contains github data fetch logic
 */

const config = require('config').github;
const _ = require('lodash');
const winston = require('../shared/logger');
const repos = require('./repos');
const user = require('./user');
const GithubUser = require('../models/githubUser');

const usernames = require('../github_usernames.json').users;

/**
 * @param {String} username
 */
async function getUserDetails(username) {
  const userMetaReq = user.getUserMeta(username);
  const userReposReq = repos.getRepos(username);
  winston.info(`Fetching user:${username}`);
  // wait for it to complete
  const [meta, repoList] = await Promise.all([userMetaReq, userReposReq]);
  // null reflects error occured.
  if (meta === null || repoList === null) {
    return null;
  }
  return {
    ...meta,
    repository: repoList,
  };
}

/**
 * Fetches data from github in pre-defined batches
 * @param {Array} users
 */
async function batchFetch(users) {
  const batchPromise = users.map(async userItem => getUserDetails(userItem));
  let batchOutput = await Promise.all(batchPromise);
  // filter out null items
  batchOutput = _.filter(batchOutput, item => item);
  GithubUser.insertMany(batchOutput).then(() => {
    winston.info('Saved to DB');
  }).catch((err) => {
    winston.error(err.message);
  });
}

/**
 * Entry point
 */
async function initFetch() {
  while (usernames.length !== 0) {
    let count = 0;
    const userList = [];
    while (count < config.batch_size) {
      const userItem = usernames.pop();
      if (userItem === undefined) {
        break;
      }
      userList.push(userItem);
      count += 1;
    }
    await batchFetch(userList); // eslint-disable-line no-await-in-loop
  }
}

module.exports = {
  initFetch,
};
