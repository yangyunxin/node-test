const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

console.log('爬虫开始.................')

let concurrencyCount = 0; // 当前并发数记录

;(async () => {

	// 1、发起getData请求，获取所有4星角色的列表
	// 获取四星的数组列表
	let heroes = await superagent.post('http://wcatproject.com/charSearch/function/getData.php')
	.send({
		// 请求体
		info: 'isempty', 
		star: [0, 0, 0, 1, 0],
		job: [0, 0, 0, 0, 0, 0, 0, 0, 0],
		type: [0, 0, 0, 0, 0, 0, 0],
		phase: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		cate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		phases: ['初代', '第一期', '第二期', '第三期', '第四期', '第五期', '第六期', '第七期', '第八期', '第九期', '第十期', '第十一期', '第十二期', '第十三期', '第十四期', '第十五期', '第十六期', '第十七期', '第十八期', '第十九期', '第二十期', '第二十一期', '第二十二期'],
		cates: ['活動限定', '限定角色', '聖誕2014', '正月2015', '黑貓2015', '中川限定', '茶熊限定', '夏日2015', '七大罪', '獅劍2015', '溫泉限定', '聖誕2015', '正月2016', '黑貓2016', '茶熊2016', '騎士限定', '夏日2016', '偵探限定', '獅劍2016', '獵人合作']
	})
	.set('Accept', 'application/json, text/javascript, */*; q=0.01')
	.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
	.then(function(res) {
		return JSON.parse(res.text);
	})

	async.mapLimit(heroes, 3, async function(hero) {
		
		let heroId = hero[0]
		concurrencyCount++
		console.log("...正在抓取"+ heroId + "...当前并发数记录：" + concurrencyCount);
		let heroInfo = await superagent.get('http://wcatproject.com/char/' + heroId)
		var $ = cheerio.load(heroInfo.text,{decodeEntities: false});       			
		// 对页面内容进行解析，以收集队长技能为例
		concurrencyCount--;
		console.log(heroId + '\t' + $('.leader-skill span').last().text())

	}, (err, results) => {
		if (err) console.log(err)
		//console.log(results)
	})

})()
