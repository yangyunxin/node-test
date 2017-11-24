'use strict'

const http = require('http')
const url = require('url')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

let urlsArray = [] // 存放爬取网址
let pageUrls = [] //存放手机文字页面网站
let pageNum = 200

for (let i = 0; i < 200; i++) {
	pageUrls.push(`http://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&PageIndex=${i}&ParentCategoryId=0`);
}

;(async () => {

	// 并发读取远程URL
  const textPromises = pageUrls.map(async url => {
    const responses = await superagent.get(url).catch(error => { error.content = "请求出错"; throw error; }) 
    return response
  });
  let arr = []
  // 按次序输出
  for (const textPromise of textPromises) {

    arr = arr.concat(await textPromise)
  }

  return await arr


	for (let i = 0; i < pageUrls.length; i++) {
		let getRes = await superagent.get(pageUrls[i]).catch(error => { error.content = "请求出错"; throw error; }) 
		let htmlText = getRes.text // 获取html节点

		let $ = cheerio.load(htmlText)
		let curPageUrls = $('.titlelnk')

		for (let j = 0; j < curPageUrls.length; j++) {
			let articleUrl = curPageUrls.eq(j).attr('href')
			urlsArray.push(articleUrl)
		}
	}
	return await urlsArray
})()
.then((result) => {
	let server = http.createServer((req, res) => {
		res.write('<br />')

		res.write('articleUrls.length is ' + result.length + '<br />')

		for (let i = 0; i < result.length; i++) {
			res.write('articleUrls is ' + result[i] + '<br />')
		}
	})

	server.listen(3000, () => {
		console.log('listen 3000')
	})
})
.catch(error => {
	console.log(error)
})

// let curCount = 0;
// async.mapLimit(pageUrls, 5, async function(url) {
// 	try {
// 		curCount++;
// 		let delay = parseInt((Math.random() * 30000000) % 1000, 10);
// 		console.log('现在的并发数是', curCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');  

// 		let getRes = await superagent.get(url).catch(error => { error.content = "请求出错"; throw error; }) 
// 		let htmlText = getRes.text // 获取html节点

// 		let $ = cheerio.load(htmlText)
// 		let curPageUrls = $('.titlelnk')

// 		for (let j = 0; j < curPageUrls.length; j++) {
// 			let articleUrl = curPageUrls.eq(j).attr('href')
// 			urlsArray.push(articleUrl)
// 		}

// 		return await urlsArray
// 	} catch (error) {
// 		console.log(error)
// 	}

// }, (err, result) => {
// 	if (err) throw err
// 	console.log(result)

// 	let server = http.createServer((req, res) => {
// 		res.write('<br />')

// 		res.write('articleUrls.length is ' + result.length + '<br />')

// 		for (let i = 0; i < result.length; i++) {
// 			res.write('articleUrls is ' + result[i] + '<br />')
// 		}
// 	})

// 	server.listen(3000, () => {
// 		console.log('listen 3000')
// 	})
// })

