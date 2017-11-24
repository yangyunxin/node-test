'use strict'

const http = require('http')
const url = require('url')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

const arr = [1,2]
let arr2 = []

;(async function() {
 	let test = await Promise.all(arr.map(async function () {
 		return await Promise.resolve(1)
 		return await Promise.resolve([1,2,3].forEach((item) => {
 			return item
 		}))

 	}))

 	console.log(test)
})()