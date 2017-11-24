let rentalObj = (function(){
	/*保存58同城上爬取的每个租房的URL*/
	let rentalSet =  new Set();

	/*增加URL后的回调函数*/
	let callBackFunc = function(){};

	return {
		add(data){
			if (data.indexOf('hz.58.com') < 0) return;/*暂时屏蔽会跳转的URL*/
			rentalSet.add(data);
			callBackFunc && callBackFunc(data);
		},

		register(func){
			callBackFunc = func;
		},

		unRegister(){
			callBackFunc = function(){};
		}
	}
})();