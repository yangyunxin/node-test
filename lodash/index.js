const _ = require('lodash')

const user1 = {
	name: '张三',
	height: 180,
	weight: 120,
}

const user2 = {
	name: 'lisi',
	height: 180,
	weight: 130
}

const user3 = {
	name: '张三',
	height: 180,
	weight: 131,
}

const users = [user1, user2, user3]

// let result = _.find(users, {name: '张三'})

// console.log(result)

// let result2 = users.find((value, index, arr) =>  value.name === '张三' && value.weight === 131)

// console.log(result2)

// let result3 = users.filter((value) => value.name === '张三')

// console.log(result3)

// let result4 = users.map((value) => value.name)

// console.log(result4)

// let result5 = _.remove(users, {name: "张三"})
// console.log(users)

// let result6 = _.filter(users, {name: '张三'})
// console.log(users)
// let result = _.uniq(users, {'name'});
// console.log(result)
// let result7 = _.chain(users).filter({name: "张三"}).uniq('name').sortBy('weight').value()
// console.log(result7)

// let result = _.uniqBy(users,'name')
// console.log(result)

// for(var i=0;i<abc.length;i++){
//    for(var j=0;j<abc.length;j++){
//         if(abc[i].page==i+1){
//            if(abc[i].sort>abc[j+1].sort){
//                var swap=abc[j]
//                abc[j]=$scope.form.elementValues[j+1];
//                abc[j+1]=swap
//            }
//         }
//    }
// }


var arr = [{page: 1, sort: 4}, {page: 4, sort: 1}, {page: 1, sort: 1}, {page: 2, sort: 6}, {page: 3, sort: 2}, {page: 2, sort: 3}]

arr.sort(function (a, b) {
	if (a.page === b.page) {
		return a.sort - b.sort
	} else {
		return a.page - b.page
	}
})
console.log(arr)

// var test = _.chain(arr).sortBy(['page', 'sort']).value()
// console.log(test)


// function quickSort(elements) {
// 	if (elements.length <= 1) {
// 		return elements
// 	}

// 	var pivotIndex = Math.floor(elements.length / 2)
// 	var pivot = elements.splice(pivotIndex, 1)[0]

// 	var left = []
// 	var right = []

// 	for (var i = 0; i < elements.length; i++) {
// 		if (elements[i]['page'] < pivot['page']) {
// 			left.push(elements[i])
// 		} else {
// 			right.push(elements[i])
// 		}
// 	}
// 	// console.log('-------')
// 	// console.log(left, right)
// 	return quickSort(left).concat([pivot], quickSort(right))
// }


// var elements = [{page: 1, sort: 4}, {page: 4, sort: 1}, {page: 1, sort: 1}, {page: 2, sort: 6}, {page: 3, sort: 2}, {page: 2, sort: 3}] // [] 1, [32, 23, 6, 4, 12, 36, 1, 61, 3, 2, 16, 7]
// console.log(quickSort(elements))
// // quickSort(elements)

