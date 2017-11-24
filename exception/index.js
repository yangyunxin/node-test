const fs = require('fs')

function test() {
	return new Promise((resolve, reject) => {
		fs.readFile('./tes.js', 'utf8', (err, data) => {
			if (err) {
				//err.codeStatus = 302
				reject(err)
			} else {
				resolve(data)
			}
		})
	})
}


// Promise.resolve()
// .then(() => {
// 	return test()
// 	.then(data => {
// 		console.log(data)
// 	})
// 	.catch((error) => {
// 		//console.log(error)
// 		throw error
// 	})
// })
// .catch(err => {
// 	console.log(err)
// })


async function test2() {
	try {
		return await test()
	} catch (err) {
		console.log(err)
	}
}
test2()