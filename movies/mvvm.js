class Watcher {
	constructor(sf) {
		this.sf = sf
	}
	observe(viewModel, callback) {
		console.log('000')
		let host = this.sf
		for (let key in viewModel) {
			var defaultValue = viewModel[key];
			(function (k, dv) {
				// 去除别名后的其他属性
				if (k !== '_alias') {
					Object.defineProperty(viewModel, k, {
						get: function () {
							return dv
						},
						set: function (value) {
							dv = value
							console.log("do somethind after set a new value")
							callback.call(host, viewModel, k)
						}
					})
				}
			})(key, defaultValue);
		}
	}
}

// 扫描dom找到sf与vm比对
class Scanner {
	constructor (viewModelPool ) {
		this.prefix = "sf";
		this.viewModelPool = viewModelPool;// Scanner肯定是为SegmentFault服务的，所以初始化的时候SegmentFault会把之前注册过的viewModel信息传给Scanner，便于它去扫描。
	}
	scanBindDOM () { // 找出attribute里带sf-，且等号右边表达式里含有viewModel的alias的Element，并返回一个view与viewModel的map
		let boundMap = {}

		let boundElements = this.getAllBoundElements(this.prefix);
        boundElements.forEach(element => {
           for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes[i];
                if (attr.nodeName.search(this.prefix) > -1) {
                    let attributeName = attr.nodeName;
                    let expression = element.getAttribute(attributeName);
                    for (let alias in this.viewModelPool) {
                        if (expression.search(alias + ".") != -1) {
                            let boundItem = new BoundItem(this.viewModelPool[alias], element, expression,attributeName);
                            if (!boundMap[alias]) {
                                boundMap[alias] = [boundItem];
                            } else {
                                boundMap[alias].push(boundItem);
                            }
                        }
                    }
                }
            }
 
		})
		return boundMap;
	}
	fuzzyFind(element, text) {
		if (element && element.attributes) {
			for (let i = 0; i < element.attributes.length; i++) {
				let attr = element.attributes[i]
				if (attr.nodeName.search(text) > -1) {
					return element
				}
			}
		}
	}
	getAllBoundElements(prefix) {
		let elements = []
		let allChildren = document.querySelectorAll("*")

		for (let i = 0; i < allChildren.length; i++) {
			let child = allChildren[i]
			let matchElement = this.fuzzyFind(child, prefix)
			if (matchElement) {
				elements.push(matchElement)
			}
		}
		return elements
	}

}

class BoundItem {
	constructor (viewModel, element, expression, attributeName) {
		this.viewModel = viewModel
		this.element = element
		this.expression = expression
		this.attributeName = attributeName
		this.interactiveDomConfig = {
			"INPUT": {
				"text":"input",
				"password":"input",
				"email":"input",
				"url":"input",
				"tel":"input",
				"radio":"change",
				"checkbox":"change",
				"color":"change",
				"date":"change",
				"datetime":"change",
				"datetime-local":"change",
				"month":"change",
				"number":"change",
				"range":"change",
				"search":"change",
				"time":"change",
				"week":"change",
				"button":"N/A",
				"submit":"N/A"
			},
			"SELECT":"change",
        	"TEXTAREA":"change"
		}
		this.addListener.call(this, this.element, this.expression); // 如果有变化
		
	}
	addListener(element, expression) {
		let tagName = element.tagName
		if (tagName === 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') {
			console.log(this.viewModel)

			let eventName = this.interactiveDomConfig[tagName]
			
			if (typeof eventName === "object") {
				let type = element.getAttribute("type")
				eventName = eventName[type];
			}
			console.log(eventName)
			element.addEventListener(eventName, (e) => {
				let newValue = element.value
				let cmd = expression + "= \"" + newValue + "\""
				try {
					eval(cmd)
				} catch(e) {
					console.error(e)
				}
			})
		} else {
			return;
		}
	}
}

class Renderer {
	render(boundItem) {
		let value = this.getValue(boundItem.viewModel, boundItem.expression);
		let attribute = boundItem.attributeName.split('-')[1];
		if (attribute.toLowerCase() === "innertext") {
			attribute = "innerText";
		}
		boundItem.element[attribute] = value;
	}
	getValue(viewModel, expression) {
		return (function () {
            var alias = viewModel._alias;
            var tempScope = {};
            tempScope[alias] = viewModel;
            try { //TODO
                var pattern = new RegExp("\\b" + alias + "\\b", "gm");
                expression = expression.replace(pattern, "tempScope." + alias);
                var result = eval(expression);
                tempScope = null;
                console.log(result)
                return result;
            } catch (e) {
                throw e;
            }
        })();
	}
}


class SegmentFault {
	constructor() {
		this.viewModelPool = {}; //用来维护viewModel的别名alias与viewModel之间的关系
		this.viewViewModelMap = {}; // 用来维护viewModel和被绑定的view之间的关系
		this.renderer = new Renderer()
	}
	registerViewModel(alias, viewModel) { // 在sf正式运作之前我们先要注册一个viewModel并给他起一个别名
		viewModel["_alias"] = alias;
        window[alias] = this.viewModelPool[alias] = viewModel; // vm对象
	};
	init() { // sf库入口函数
		let scanner = new Scanner(this.viewModelPool) // 传入viewmodel
		let watcher = new Watcher(this) // 传入sf类

		//step 1, 暗中观察各个viewModel
		for (let key in this.viewModelPool) {
			watcher.observe(this.viewModelPool[key], this.viewModelChangedHandler)
		}

		// step 2 3, 扫描DOM Tree并返回Map
		this.viewViewModelMap = scanner.scanBindDOM()

		Object.keys(this.viewViewModelMap).forEach(alias => {
			this.refresh(alias)
		})
	};
	refresh(alias) { // 暴露一个强制刷新整个viewModel的方法，因为毕竟有你监控不到的角落
		let boundItems = this.viewViewModelMap[alias];
		boundItems.forEach(boundItem => {
            this.renderer.render(boundItem);
        });
	};
	viewModelChangedHandler(viewModel, prop) {
        this.refresh(viewModel._alias);
    }
}
