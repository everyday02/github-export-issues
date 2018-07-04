'use strict';

const Controller = require('egg').Controller;
const octokit = require('@octokit/rest')();
const xlsx = require('node-xlsx');
const fs = require('fs');

let issues = []
// oauth
octokit.authenticate({
  type: 'oauth',
  token: '5a07ece0c5821f2840966a866252c3d5143da4fd'
})

const nameMapping = {
  jhhkk1200: '郑志刚',
  hehangfighting: '何航',
  whenevery: '吴云',
  imyufu: '黄裕富',
  ouyunge: '区云阁',
  'Bevisz':'张慧明',
  'Shirley-LIAO': '廖静雯'
}

class HomeController extends Controller {
  async index() {
    // console.info(octokit.issues)
    issues = []
    let hasNext = true
    let page = 1
    while (hasNext) {
      const result = await octokit.issues.getForRepo({
        page,
        state: 'all',
        owner: 'zqlian',
        per_page: 100,
        repo: 'fuchi-issues'
      })
      const datas = result.data
      issues = issues.concat(datas)
      if (datas.length === 0) hasNext = false
      page += 1
    }
    let xlsxDatas = []
    xlsxDatas.push(['标题', '状态', '优先级', '创建日期', '关闭日期', '负责人', '地区'])
    for (let i = 0; i < issues.length; i += 1) {
      if (issues[i].title.indexOf('--不导出') > -1) continue;
      let row = []
      // row.push(issues[i].number)
      row.push(issues[i].title)
      // row.push(issues[i].labels && issues[i].labels.map((item) => item.name).join(','))
      let labels = issues[i].labels || []
      let hasLabel = false
      for (let s = 0; s < labels.length; s += 1) {
        if (labels[s].name === '待解决' || labels[s].name === '已解决' || labels[s].name === '待讨论' || labels[s].name === '待测试') {
          hasLabel = true
          row.push(labels[s].name)
          break;
        }
      }
      if (hasLabel === false) row.push('')
      // 继续第二个标签
      hasLabel = false
      for (let s = 0; s < labels.length; s += 1) {
        if (labels[s].name === '高' || labels[s].name === '中' || labels[s].name === '低') {
          hasLabel = true
          row.push(labels[s].name)
          break;
        }
      }
      if (hasLabel === false) row.push('')

      row.push(issues[i].created_at.substring(0, 10))
      row.push(issues[i].closed_at && issues[i].closed_at.substring(0, 10))
      row.push(issues[i].assignee && (nameMapping[issues[i].assignee.login] || issues[i].assignee.login))
      // 继续第三个标签
      hasLabel = false
      for (let s = 0; s < labels.length; s += 1) {
        if (labels[s].name === '云南' || labels[s].name === '佛山') {
          hasLabel = true
          row.push(labels[s].name)
          break;
        }
      }
      if (hasLabel === false) row.push('')
      // console.info(`${issues[i].number};${issues[i].title};${issues[i].labels && issues[i].labels.map((item) => item.name).join(',')};${issues[i].created_at};${issues[i].assignee && issues[i].assignee.login}`)
      xlsxDatas.push(row)
    }
    // 写xlsx
    const buffer = xlsx.build([{
      name: 'github问题导出',
      data: xlsxDatas
    }]);
    fs.writeFile('./github问题导出.xlsx', buffer, function (err) {
      if (err) throw err;
    });
    this.ctx.body = issues;
  }
}

module.exports = HomeController;
