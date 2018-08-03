/**
 * Downloads info of all the repos owned by the user
 */

const winston = require('../shared/logger');
const _ = require('lodash');
const parse = require('parse-link-header');
const config = require('config').github;
const axios = require('axios');

const axiosConfig = {
  baseURL: config.api,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
  parameters: { type: 'sources' },
};

const axiosRequest = axios.create(axiosConfig);

/**
 * Get request to fetch repos metadata
 * @param {string} username
 */
async function getRepos(username) {
  let repos = [];
  const repoURL = config.repos_url.replace('{username}', username);
  let reqResult = [];
  try {
    reqResult = await axiosRequest.get(repoURL);
  } catch (err) {
    winston.error(`Fetching repos of user: ${username} | ${err.message}`);
    return null;
  }
  const pagination = parse(reqResult.headers.link);
  repos = [...repos, ...reqResult.data];
  // Check if more pages exists
  const lastPage = pagination && pagination.next ? parseInt(pagination.last.page, 10) : null;
  /* Fetch across pagination */
  if (lastPage && lastPage > 2) {
    for (let page = 2; page <= lastPage; page += 1) {
      try {
        const pageResult = await axiosRequest.get(repoURL, { // eslint-disable-line no-await-in-loop
          params: { page },
        });
        repos = [...repos, ...pageResult.data];
      } catch (err) {
        winston.error(`Fetching repos of user: ${username} | ${err.message}`);
        return null;
      }
    }
  }

  const ownRepos = _(repos).filter(repo => !repo.fork).map(repo => ({
    name: repo.name,
    url: repo.html_url,
    stars: repo.stargazers_count,
    language: repo.language,
    languages_url: repo.languages_url,
  }));

  return ownRepos.value();
}


module.exports = { getRepos };
