'use strict';

const Controller = require('egg').Controller;
const octokit = require('@octokit/rest')();
const xlsx = require('node-xlsx');
const fs = require('fs');

let issues = []
/*
// oauth
octokit.authenticate({
  type: 'oauth',
  token: ''
})
*/
const owner = 'facebook'
const repo = 'react'

class HomeController extends Controller {
  async index() {
    // console.info(octokit.issues)
    issues = []
    let hasNext = true
    let page = 1
    while (hasNext) {
      const result = await octokit.issues.getForRepo({
        page,
        state: 'open', // or 'all' or 'closed'
        owner,
        repo,
        per_page: 100,
      })
      console.info(`the export page ${page}`)
      const datas = result.data
      issues = issues.concat(datas)
      if (datas.length === 0) hasNext = false
      page += 1
    }
    let xlsxDatas = []
    xlsxDatas.push(['title', 'labels', 'created_at', 'closed_at'])
    for (let i = 0; i < issues.length; i += 1) {
      let row = []
      row.push(issues[i].title)
      row.push(issues[i].labels && issues[i].labels.map((item) => item.name).join(','))
      row.push(issues[i].created_at.substring(0, 10))
      row.push(issues[i].closed_at && issues[i].closed_at.substring(0, 10))
      xlsxDatas.push(row)
    }
    // write to xlsx
    const buffer = xlsx.build([{
      name: 'github-issues',
      data: xlsxDatas
    }]);
    fs.writeFile('./github-issues.xlsx', buffer, function (err) {
      if (err) throw err;
    });
    console.info('export success!')
    this.ctx.body = 'export success!'// issues;
  }
}

module.exports = HomeController;
