require('dotenv-flow').config({
  path: '../config/env-files',
  node_env: 'gitlabCI'
});

const GITHUB_USER = process.env.GITHUB_USER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;
const remote = `https://${GITHUB_USER}:${GITHUB_ACCESS_TOKEN}@${GITHUB_REPO}`;
require('simple-git')('./')
  .add('./*')
  .commit("update test report")
  .addRemote('test-report', remote)
  .push(['-u', 'test-report', 'master'], () => console.log('push successfully !'));
