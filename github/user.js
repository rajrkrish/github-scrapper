/**
 * Downloads user info
 */

const config = require('config').github;
const axios = require('axios');
const winston = require('../shared/logger');

const axiosConfig = {
  baseURL: config.api,
  headers: {
    Authorization: `Bearer ${config.token}`,
  },
};

const axiosRequest = axios.create(axiosConfig);

/**
 * Fetches user details
 * @param {String} username
 */
async function getUserMeta(username) {
  const userURL = config.user_url.replace('{username}', username);
  let result = {};
  try {
    result = await axiosRequest.get(userURL);
    result = result.data;
  } catch (err) {
    winston.error(`Fetching user: ${username} | ${err.message}`);
    return null;
  }

  const userMeta = {
    name: result.name,
    url: result.html_url,
    followers: result.followers_url,
    followers_count: result.followers,
  };

  return userMeta;
}

module.exports = {
  getUserMeta,
};
