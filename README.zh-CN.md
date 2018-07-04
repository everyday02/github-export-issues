# github-export-issues

导出 github issues

## 快速入门

<!-- 在此次添加使用文档 -->

查看 ./app/controller/home.js 文件

```javascript
/*
// 如果是私有仓库，可以先授权
octokit.authenticate({
  type: 'oauth',
  token: ''
})
*/
const owner = 'facebook'  // 更改所属组织
const repo = 'react'      // 更改仓库名
```

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```
