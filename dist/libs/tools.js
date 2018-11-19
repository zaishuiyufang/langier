define(function(){

var QFTools = {
	/*
	 	返回dom对象或者dom集合
	 * @params selector string 选择器
	 * @params [parent] DOMObject 父级对象
	 * @return DOMObject || DOMCollection
	 * 
	 * */
	
	$: function(selector,parent){
		parent = parent || document;
		/*if(selector.charAt(0) === "#"){
			return parent.getElementById(selector.splice(1));
		}*/
		
		switch(selector.charAt(0)){
			case "#":
				return parent.getElementById(selector.slice(1));
			case ".":
				return parent.getElementsByClassName(selector.slice(1));
			default:
				return parent.getElementsByTagName(selector);
		}
	},
	/*
	 	获取内部或者外部样式
	 * @params obj DOMObject 获取样式的元素对象
	 * @params attr string  属性名称
	 * @return string 属性值
	 * 
	 * */
	getStyle: function(obj, attr){
		/*if(obj.currentStyle){ // ie
			return obj.currentStyle[attr];
		}
		return getComputedStyle(obj, false)[attr];*/
		
		
		//return obj.currentStyle ? obj.currentStyle[attr] :  getComputedStyle(obj, false)[attr];
		
		try{
			return getComputedStyle(obj, false)[attr];
		}catch(e){
			return obj.currentStyle[attr];
		}
	},
	
	/*
	 	使元素绝对居中
	 * @params obj DOMObject 要居中的元素对象
	 * */
	
	showCenter: function(obj){
		var _this = this; //留住this
		obj.style.display = "block";
		obj.style.position = "absolute";
		//计算left和top
		function calc(){
			console.log(this);
			var left = (_this.getBody().width - obj.offsetWidth)/2;
			var top = (_this.getBody().height - obj.offsetHeight)/2;
			obj.style.left = left + "px";
			obj.style.top = top + "px";
		}
		calc();
		window.onresize = calc;
		
	},
	/*
	 	得到浏览器的宽高
	 * @return object {width,height}
	 * */
	getBody: function(){
		return {
			width: document.documentElement.clientWidth || document.body.clientWidth,
			height: document.documentElement.clientHeight || document.body.clientHeight
		}
		/*window.innerHeight
		window.innerWidth*/
	},
	/*
	 	事件监听
	 * @params obj DOMObject 事件监听对象
	 * @params event string 事件句柄
	 * @params fn  Function 事件处理函数
	 * 
	 * */
	on: function(obj, event, fn){
		if(obj.attachEvent){
			obj.attachEvent("on"+event,fn);
		}else{
			obj.addEventListener(event,fn,false);
		}
	},
	
	/*
	 	移出事件监听
	 * @params obj DOMObject 事件监听对象
	 * @params event string 事件句柄
	 * @params fn  Function 事件处理函数
	 * */
	off: function(obj, event, fn){
		if(obj.detachEvent){
			obj.detachEvent("on"+event, fn);
		}else{
			obj.removeEventListener(event, fn);
		}
	},
	/*
	 	实现cookie的创建，删除，获取
	 * @params key string cookie名称 (如果只传这一个参数，执行获取操作)
	 * @params [value] string cookie值
	 * @params [expires] string 定义过期时间和path
	 * */
	cookie: function(key, value, expires){
		if(value !== undefined){
			//传了value，执行创建,修改或者删除(取决于expires里面包含的过期时间)
			//加密
			value = encodeURIComponent(value);
			if(expires !== undefined){
				document.cookie = key+"="+value+";"+expires;
			}else{
				document.cookie = key+"="+value;
			}
			
		}else{
			//获取
			//取出所有
			var str = document.cookie;
			var obj = {};
			var arr = str.split("; ");
			for(var i in arr){
				var item = arr[i].split("=");
				obj[item[0]] = item[1];
			}
			//有就直接返回，obj如果没有key，return undefined(加密之前)
			//return obj[key];
			
			if(obj[key]){
				return decodeURIComponent(obj[key]);
			}else{
				return undefined;
			}
		}
	},

	/* 获取一个元素到浏览器边缘的距离

	*  @param obj 要获取距离的元素
	* @return {left, top}
	*/
	getPosition: function(obj){
		var position = {
			left: 0,
			top: 0
		}
		//只要存在父级，那么就继续找
		while(obj.offsetParent){
			//进行累加
			position.top += obj.offsetTop;
			position.left += obj.offsetLeft;
			//层级往上增加一个，继续找父级的offsetParent
			obj = obj.offsetParent;
		}

		return position;
	},

	/* 发送get方式的ajax请求
	 * @param url string 请求地址
	 * @param param object 请求携带的参数对象
	 * @param fn Function  请求成功之后的回调函数

	*/
	ajaxGet: function(url, param, fn){
		if(param){
			//如果有参数，那么就在url后面拼接?key1=value1&key2=value2这样的形势
			url += "?";
			for(var key in param){
				url += key+"="+param[key]+"&";
			}
			url = url.slice(0,-1);
		}
		//1、创建核心对象
		var ajax = new XMLHttpRequest();
		//2、准备请求
		ajax.open("GET", url);
		//3、发送请求
		ajax.send(null);
		//4、监听状态改变
		ajax.onreadystatechange = function(){
			if(ajax.readyState === 4 && ajax.status === 200){
				//请求成功返回了
				var res = JSON.parse(ajax.responseText);
				fn(res);
			}
		}
	},

	/* 发送post方式的ajax请求
	 * @param url string 请求地址
	 * @param param object 请求携带的参数对象
	 * @param fn Function  请求成功之后的回调函数
	*/
	ajaxPost: function(url, param, fn){
		var ajax = new XMLHttpRequest();
		ajax.open("POST", url);
		//如果有参数，那么就拼接参数字符串，如果没有，那就send null
		var str = "";
		if(param){
			
			for(var key in param){
				str += key+"="+param[key]+"&";
			}
			str = str.slice(0, -1);
		}else{
			str = null;
		}

		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");

		ajax.send(str);

		ajax.onreadystatechange = function(){
			if(ajax.readyState === 4 && ajax.status === 200){

				fn(ajax.responseText);
			}
		}
	},

	/* 完美ajax
	 * @param method string   请求方式
	 * @param url    string   请求地址
	 * @param param  object   请求参数
	 * @param fn     Function 请求成功的回调
	 * @param isJson Boolean  返回是否是json格式的数据，默认为true
	*/

	ajax: function(method, url, param, fn, isJson=true){
		if(param){
			//拼接参数字符串
			var str = "";
			for(var key in param){
				str += key+"="+param[key]+"&";
			}
			str = str.slice(0, -1);
		}
		
		
		var ajax = new XMLHttpRequest();
		//根据不同的请求方式发送不同类型的请求
		if(method.toUpperCase() === "GET"){
			//url后买你拼接参数
			ajax.open("GET",param? url+"?"+str : url);
			ajax.send(null);
		}else if(method.toUpperCase() === "POST"){
			//先open，再设置头
			ajax.open("POST",url);
			ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			//send参数字符串
			ajax.send(param ? str : null);
		}

		ajax.onreadystatechange = function(){
			if(ajax.readyState === 4 && ajax.status === 200){
				//是否转换为json
				var res = isJson ? JSON.parse(ajax.responseText) : ajax.responseText;
				fn(res);
			}
		}

	},

	/*实现跨域ajax请求
 	 * @param url    string  请求地址
 	 * @param fnName string  回调函数的函数名
 	 * @param param  object  其他请求参数的对象
	*/
	ajaxJsonp: function(url, fnName, param){
		//动态创建一个script标签
		var script = document.createElement("script");
		//url后面拼接callback
		url += "?callback="+fnName;
		//拼接其他参数
		if(param){
			for(var key in param){
				url += "&"+key+"="+param[key];
			}
		}
		//把请求完整url给src
		script.src = url;

		//script添加到页面上
		document.body.appendChild(script);
		//一旦请求发出了，script标签就没有存在的必要了
		document.body.removeChild(script);

	},

	ajaxgetPromise: function(url, param){
		if(param){
			//如果有参数，那么就在url后面拼接?key1=value1&key2=value2这样的形势
			url += "?";
			for(var key in param){
				url += key+"="+param[key]+"&";
			}
			url = url.slice(0,-1);
		}
		return new Promise(function(resolve, reject){
			//许下承诺，发送一个ajax请求
			var ajax = new XMLHttpRequest();
			ajax.open("GET", url);
			//3、发送请求
			ajax.send(null);
			//4、监听状态改变
			ajax.onreadystatechange = function(){
				if(ajax.readyState === 4){
					if(ajax.status === 200){
						var res = JSON.parse(ajax.responseText);
						resolve(res);
					}else{
						reject();
					}
					
				}
			}
		});
	}
}

return QFTools;

})