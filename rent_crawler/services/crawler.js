const axios = require('axios')
const cheerio = require('cheerio')
// const jieba = require('nodejieba')

async function fetchSingleDoubanList(start) {
	let res = await axios.get(`https://www.douban.com/group/shanghaizufang/discussion?start=${start}`)
	let htmlText = res.data

	const $ = cheerio.load(htmlText)
	const rs = $('a[title]')

	const resultList = []

	for (let i = 0; i < rs.length; i++) {
		resultList.push({
			title: rs.eq(i).attr('title'),
			url: rs.eq(i).attr('href')
		})
	}
	//console.log(resultList)
	return resultList
}

async function fetchSingleDoubanTopic(url) {
	let res = await axios.get(url)
	let htmlText = res.data

	const $ = cheerio.load(htmlText)
}


module.exports = {
	fetchSingleDoubanList,
	fetchSingleDoubanTopic,
}