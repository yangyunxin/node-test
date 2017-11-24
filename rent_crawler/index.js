const crawler = require('./services/crawler')
const User = require('./models')



;(async () => {
	// insert data
	for (let i = 0; i < 50; i += 25) {
		let results = await crawler.fetchSingleDoubanList(i)
		for (let j = 0; j < results.length; j++) {
			console.log(results[j].url)

			// 去重
			if ()
			// let created = User.create({
			// 	id: results[j].url.match(/\d+/)[0],
			// 	title: results[j].title,
			// 	url: results[j].url,
			// })
			// .catch(e => {
			// 	console.log(e)
			// })
		}
		//await crawler.fetchSingleDoubanTopic(results[0].url)
	}

})()
.then(r => {
	console.log('done')
	process.exit(0)
})
.catch(e => {
	console.log(e)
	process.exit(1)
})