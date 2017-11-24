const url = require('url')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

const targetUrl = 'https://github.com/trending/javascript?since=weekly'


superagent.get(targetUrl)
.then((res) => {
	// 获取仓库
	const $ = cheerio.load(res.text) // cheerio解析

	let repoUrls = []
	let titleArray = []

	$('.repo-list .mb-1 a').each((index, element) => {
		let $element = $(element)

		// 获取每一个仓库url
		let href = url.resolve('https://github.com', $element.attr('href'))
		repoUrls.push(href)

		// 获取每一个仓库名
		let $title = $element.contents().last()[0].data
		$title = $title.substr(0, $title.length - 1)
		titleArray.push($title)
	})
	return [repoUrls, titleArray]
}, (error) => { 
	error.content = 'superagent使用错误' 
	throw error
})
.then((data) => {
	// 开始并发请求仓库
	async.mapLimit(data[0], 5, async function(repoUrl) {
		// result 抓取结果
		try {
			let result = await superagent.get(repoUrl)
			.then((res) => {
				let $ = cheerio.load(res.text)
				let httpGitUrl = $('.https-clone-options .js-url-field').attr('value')

				return ({
					url: repoUrl,
					httpGitUrl: httpGitUrl
				})
			})
			console.log(result)
		} catch (error) {
			error.content = 'super使用错误'
			throw error
		}
	}, (err, results) => {
		if (err) {
			err.content = 'async使用错误'
			console.log(err)
		}
	})
})
.catch((err) => {
	// 写入日志
	console.log(err)

})


