const http = require('http')
const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')

const startId = "672933" // 起始ID
const articalSavePath = "./data" // 文章存放路径
const imgSavePath = "./img"; // 图片存放路径
const fetchLimit = process.argv[2] || 50 // 抓取条数

// 创建所需文件夹
if (!fs.existsSync(articalSavePath)) {
	fs.mkdirSync(articalSavePath)
}
if (!fs.existsSync(imgSavePath)) {
	fs.mkdirSync(imgSavePath)
}

let fetched = 0

// 获取关联文章id
let getNext = function (_csrf, op) {
	let syncUrl = 'http://www.cnbeta.com/comment/read'
	return new Promise(function(resolve, reject) {
		if (!_csrf || !op) { // 参数为空
			return reject(`getNext() param error: _csrf: ${_csrf}, op: ${op}`)
		} else {
			syncUrl += '?_csrf=' + encodeURIComponent(_csrf) + '&op=' + encodeURIComponent(op)
			http.get(syncUrl, function (res){
				let resChunk = ''
				res.setEncoding('utf8')
				res.on('data', (chunk) => {
					resChunk += chunk
				})

				// 接收到数据
				res.on('end', () => {
					try {
						let json = JSON.parse(resChunk)
						let lastId = json.result.neighbor.last
						resolve(lastId)
					} catch (error) {
						reject(e)
					}
				})
			})
		}
	})
}

// 保存内容
let savedContent = function ($, news_title) {
	$('.article-content p').each(function(index, item) {
		let x = $(this).text().trim()
		if (x) {
			x = ' ' + x + '\n'
			fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function(err) {
				if (err) {
					console.log(err)
				}
			})
		}
	})
}

// 保存图片
let savedImg = function ($, news_title) {
	$('.article-content img').each(function(index, item) {
		let img_src = $(this).attr('src')
		let img_filename = news_title + '---' + index + img_src.match(/\.[^.]+$/)[0]

		https.get(img_src, function(res) {
			let imgData = ""
			res.setEncoding("binary")
			res.on("data", function(chunk) {
				imgData += chunk
			})
			res.on("end", function() {
				fs.writeFile(imgSavePath + '/' + img_filename, imgData, "binary", function(err) { 
					if (err) {
						console.log(err)
					}
				})
			})
		})
	})
	
}

// 抓取新闻
let fetchPage = function (x, fullpath) {
	if (fetched > fetchLimit) {
		fetched = 0
		console.log(`已完成爬取${fetchLimit}条数据`)
		return process.exit()
	}

	let articleUrl = fullpath || `http://www.cnbeta.com/articles/${x}.htm`
	let client = http.get(articleUrl, function(res) {
		if (res.statusCode === 301) {
			if (res.headers.location) {
				fetchPage(null, res.headers.location);
			} else {
				console.log('fetchPage() reLocated. ', articleUrl)
			}
			return client.abort() // TODO不懂什么意思
		}

		let html = ''
		res.setEncoding('utf-8')
		res.on('data', function(chunk) {
			html += chunk
		})
		res.on('end', function() {
			if (html) {
				fetched++
				const $ = cheerio.load(html)
				const time = $('.cnbeta-article .title .meta span:first-child').text().trim();
				let news_title = $('.cnbeta-article .title h1').text().trim().replace(/\//g, '-');
				if (news_title.length > 40) {
					news_title = news_title.slice(0, 40);
				}

				savedContent($, news_title);

				savedImg($, news_title);

				console.log(`got: ${news_title} url: ${articleUrl}`);


				// 抓取下一篇
				let _csrf = $('meta[name="csrf-token"]').attr('content')
				let opStr = html.match(/{SID:[^{}]+}/)[0]
				let op = '1,'
				op += opStr.match(/SID:"([^"]+)"/)[1] + ',' + opStr.match(/SN:"([^"]+)"/)[1];
				getNext(_csrf, op).then(function(lastId) {
					fetchPage(lastId);
				}).catch(function(error) {
					console.log(error);
				})
			} else {
				console.log('fetchPage() failed. ', articleUrl);
			}
		})
	}).on('error', function(err) {
		console.log(err);
	});
}

console.log(`即将抓取 ${fetchLimit} 条数据`);
fetchPage(startId);

