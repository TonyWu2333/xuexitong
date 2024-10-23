/**
 * 工具JS(多个地方使用，请勿轻易改动)
 */
var util = {
		isEmpty: function (value) {
			if (typeof value == 'undefined' || value == undefined || value == null || value === "") {
				return true;
			}
			return false;
		},
		isInterPhone:function(phone,countryCode){	//国际手机格式验证,区号86则必须11位
			var phone_pattern  = /^\d{5,11}$/;
			var phone_cn_pattern  = /^\d{11}$/;
			if(countryCode == "86"){
				return phone_cn_pattern.test(phone);
			}else{
				return phone_pattern.test(phone);
			}
		},
		notNull:function(value){
			if(util.isEmpty(value)){
				return "";
			}
			return value;
		},
		showMsg:function(flag,id,msg,isSingle){ //flag id msg必需   isSingle表示是否需要将该元素的父级边框变红
			if(!util.isEmpty(id)){
				if(flag){
					if(isSingle){
						$("#"+id).parent().addClass("error-tip");
					}
					if(msg != undefined && msg != null){
						$("#"+id).html(msg);
					}
				}else{
					if(isSingle){
						$("#"+id).parent().removeClass("error-tip");
					}
					if(msg != undefined && msg != null){
						$("#"+id).html(msg);
					}
				}
			}
		},
		checkPwd:function(pwd){ //密码要求8-16位字符，至少包含数字、字母、符号两种元素,不能包含空格和中文
			if(util.isEmpty(pwd)){
				return false;
			}
			if(pwd.length < 8 || pwd.length > 16){
				return false;
			}
			//var reg_pwd = /(?!^(\d+|[a-zA-Z]+|[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+)$)^[\w!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{6,16}$/;
			var reg = /^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s\u4e00-\u9fa5]+)$/
			return reg.test(pwd);
		},
		checkPhoneCode:function(code){//验证4位验证码
			var reg_code = /^\d{4}$/;
			return reg_code.test(code);
		},
		checkEmail:function(email){	//验证邮箱
			var reg_email  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return reg_email.test(email);
		},
		URIComponent:function(value,flag){//URL加密解密
			if(flag){
				return encodeURIComponent(value);
			}else{
				return decodeURIComponent(value);
			}
		},
		checkMobile:function(){
			var sUserAgent = navigator.userAgent.toLowerCase();
			var phoneReg = /\b(ip(hone|od)|android|opera m(ob|in)i|windows (phone|ce)|blackberry|s(ymbian|eries60|amsung)|p(laybook|alm|rofile\/midp|laystation portable)|nokia|fennec|htc[-_]|mobile|up.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\b/;
			var tableReg = /\b(ipad|tablet|(Nexus 7)|up.browser|[1-4][0-9]{2}x[1-4][0-9]{2})\b/;
			return phoneReg.test(sUserAgent) || tableReg.test(sUserAgent);

		}
}

/**
 * 国家手机号Code区号公共JS，需要Jquery, 使用方式：countryCode.init() 或 countryCode.init(id1,id2,id3,id4,id5)
 * nameCodeId			code搜索文本框ID
 * codeSearchId			code搜索按钮ID
 * codeContentId		code列表所在DIV的ID
 * targetShowCodeId		选择code之后显示目标ID
 * targetSaveCodeId		选择code之后保存目标ID
 */
var countryCode = {
	init: function (nameCodeId, codeSearchId, codeContentId, targetShowCodeId, targetSaveCodeId) {
		if (!util.isEmpty(nameCodeId)) {
			countryCode.nameCodeId = nameCodeId;
		}
		if (!util.isEmpty(codeSearchId)) {
			countryCode.codeSearchId = codeSearchId
		}
		if (!util.isEmpty(codeContentId)) {
			countryCode.codeContentId = codeContentId;
		}
		if (!util.isEmpty(targetShowCodeId)) {
			countryCode.targetShowCodeId = targetShowCodeId;
		}
		if (!util.isEmpty(targetSaveCodeId)) {
			countryCode.targetSaveCodeId = targetSaveCodeId;
		}
		countryCode.getCountryCode();
		countryCode.lister();

	},
	nameCodeId: "nameCode",		//code搜索文本框ID
	codeSearchId: "codeSearch",  //code搜索按钮ID
	codeContentId: "codeContent",//code列表所在DIV的ID
	targetShowCodeId: "showCountryCode",	//选择编码之后展示目标ID
	targetSaveCodeId: "countryCode",	//选择编码之后保存目标ID
	getCountryCode: function () {
		var nameCode = $("#" + countryCode.nameCodeId).val();
		if (util.isEmpty(nameCode)) {
			nameCode = "";
		}
		nameCode = nameCode.trim();
		$.get(_CP_ + "/countryCode/getCountryCode", {'nameCode': nameCode}, function (data, status) {
			var browserLocale = countryCode.getCookie('browserLocale');
			var msg = "";
			if (data.status == 1) {
				var codeArray = data.countryCode;
				if (codeArray != null && codeArray.length > 0) {
					for (var i = 0; i < codeArray.length; i++) {
						var name = codeArray[i].zh;
						if (browserLocale == "en_US") {
							name = codeArray[i].en;
						}
						if (browserLocale == "zh_TW") {
							name = codeArray[i].ft;
						}
						msg += ' <li data-id="' + codeArray[i].code + '" onclick="countryCode.setCountryCode(' + codeArray[i].code + ')"><span class="fl">' + name + '</span><span class="fr">+' + codeArray[i].code + '</span></li>';
					}
				}
			}
			$("#" + countryCode.codeContentId).html(msg);
		}, "json");

	},
	setCountryCode: function (code) {
		$("#" + countryCode.targetShowCodeId).html("+" + code);
		$("#" + countryCode.targetSaveCodeId).val(code);
	},
	lister: function () {
		$("#" + countryCode.nameCodeId).bind('input propertychange', function () {
			countryCode.getCountryCode();
		});
		$("#" + countryCode.codeSearchId).bind("click", function () {
			countryCode.getCountryCode();
		});
	},
	getCookie: function (c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1)
					c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return "";
	}
}

/**
 * 发送手机验证码
 * phoneId			手机号文本框ID
 * countrycodeId	手机区号文本框ID
 * sendBtnId		发送验证码按钮ID
 * phoneErrorId		手机号下方的提示ID(上方手机号边框变红)
 * msgId			整体页面提示ID
 * isExistPhone		是否需要判断手机号存在：true 需要判断 false 不判断，直接发送验证码 默认true
 */
var phoneCode = {
	init: function (phoneId, countrycodeId, sendBtnId, phoneErrorId, msgId, isExistPhone) {
		if (!util.isEmpty(phoneId)) {
			phoneCode.phoneId = phoneId;
		}
		if (!util.isEmpty(countrycodeId)) {
			phoneCode.countrycodeId = countrycodeId;
		}
		if (!util.isEmpty(sendBtnId)) {
			phoneCode.sendBtnId = sendBtnId;
		}
		if (!util.isEmpty(phoneErrorId)) {
			phoneCode.phoneErrorId = phoneErrorId;
		}
		if (!util.isEmpty(msgId)) {
			phoneCode.msgId = msgId;
		}
		if (!util.isEmpty(isExistPhone)) {
			phoneCode.isExistPhone = isExistPhone;

		}
		phoneCode.lister();
	},
	phoneId: "phone",
	countrycodeId: "countryCode",
	sendBtnId: "sendCodeBtn",
	phoneErrorId: "phoneMsg",
	msgId: "msg",
	isExistPhone: true,
	getCode: function () {
		util.showMsg(false, phoneCode.phoneErrorId, "", true);
		var phone = $("#" + phoneCode.phoneId).val().trim();
		var countrycode = $("#" + phoneCode.countrycodeId).val();
		if (!util.isEmpty(phone)) {
			countrycode = util.isEmpty(countrycode) ? "86" : countrycode;
			if (util.isInterPhone(phone)) {
				phoneCode.checkBooleanCode(phone, countrycode);
			} else {
				util.showMsg(true, phoneCode.phoneErrorId, "手机号格式错误", true);
			}
		} else {
			util.showMsg(true, phoneCode.phoneErrorId, "请输入手机号", true);

		}
	},
	checkBooleanCode: function (phone, countrycode) {	//验证短信是否超出上限
		$.ajax({
			url: _CP_ + "/num/booleanCode?key=" + phone + "&type=1",
			type: "post",
			success: function (data) {
				if ("alert" == data) {
					util.showMsg(true, phoneCode.msgId, "发送失败，超出今日短信发送上限");
				} else {
					if (phoneCode.isExistPhone) {
						phoneCode.isPhoneExist(phone, countrycode);
					} else {
						phoneCode.getPhoneCode(phone, countrycode);
					}
				}
			}
		});
	},
	isPhoneExist: function (phone, countrycode) {
		$.ajax({
			url: _CP_ + "/isPhoneExist?phone=" + phone,
			type: "post",
			success: function (data) {
				if ("true" == data) {//手机号在平台存在
					phoneCode.getPhoneCode(phone, countrycode);
				} else {
					util.showMsg(true, phoneCode.phoneErrorId, "手机号不存在，请先注册", true);
				}
			}
		});
	},
	isPhoneExistByfid: function (phone, vercode, fid) {
		var returnData = "";
		$.ajax({
			url: _CP_ + "/isPhoneExistByfid?phone=" + phone + "&code=" + vercode + "&fid=" + fid,
			type: "post",
			async: false,//true为异步，false为同步
			success: function (data) {
				returnData = data;
			}
		});
		return returnData;
	},
	getPhoneCode: function (phone, countrycode) {	//获取手机号验证码
		if (capInstance == null || $('#captchaFlag').val() == "true") {
			//容错
			phoneCode.send();
		} else {
			capInstance && capInstance.popUp();
		}
	},
	lister: function () {
		$("#" + phoneCode.sendBtnId).bind('click', function () {
			phoneCode.getCode();
		});
	},
	send: function (phone, countrycode) {
		var code = "";
		var needcode = true;
		var validate = $("#validate").val();
		if (undefined == validate) {
			validate = "";
		}
		var fid = $("#fid").val();
		if (undefined == fid) {
			fid = "0";
		}
		var phone = $("#" + phoneCode.phoneId).val().trim();
		var countrycode = $("#" + phoneCode.countrycodeId).val();
		if (typeof voiceCodeFunc != "undefined" && !util.isEmpty(voiceCodeFunc) && voiceCodeFunc.isVoiceCode) {
			voiceCodeFunc.sendVoiceCode(code, needcode, validate, fid, phone, countrycode);
		} else {
			$.ajax({
				url: _CP_ + "/num/phonecode?phone=" + phone + "&code=" + code + "&type=1&needcode=" + needcode + "&countrycode=" + countrycode + "&validate=" + validate + "&fid=" + fid,
				type: "get",
				success: function (date) {
					var myjson = eval("(" + date + ")");
					if (myjson.result) {
						util.showMsg(false, phoneCode.msgId, "验证码发送成功，请注意查收", true);
						countdownTime(); //计时器
					} else {
						var msg = util.isEmpty(myjson.msg) ? "验证码发送失败" : myjson.msg;
						util.showMsg(true, phoneCode.msgId, msg);
					}
				}
			});
		}
	}
};
function getTimestamp(msec) {
	msec = !msec && msec !== 0 ? msec : 1
	return parseInt((new Date()).valueOf() / msec, 10)
}
function enterSubmit(submitBtn){
	$("body").keydown(function (event) {
	    if (event.keyCode == 13) { //enter键键值为13
	        $("#"+submitBtn).click();
	    }
	});
}
function loadScript(src, cb) {
	var head = document.head || document.getElementsByTagName('head')[0]
	var script = document.createElement('script')

	cb = cb || function () {}

	script.type = 'text/javascript'
	script.src = src

	if (!('onload' in script)) {
		script.onreadystatechange = function () {
			if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
			this.onreadystatechange = null
			cb(script)
		}
	}

	script.onload = function () {
		this.onload = null
		cb(script)
	}

	head.appendChild(script)
}

function encryptByAES(message, key){
	let CBCOptions = {
		iv: CryptoJS.enc.Utf8.parse(key),
		mode:CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	};
	let aeskey = CryptoJS.enc.Utf8.parse(key);
	let secretData = CryptoJS.enc.Utf8.parse(message);
	let encrypted = CryptoJS.AES.encrypt(
		secretData,
		aeskey,
		CBCOptions
	);
	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
/**
 * 提取url上指定参数的值
 */
function getURLQuery(param) {
	var url = window.location.href;
	var regex = new RegExp('[?&]' + encodeURIComponent(param) + '=([^&]*)');
	var match = url.match(regex);
	return match ? decodeURIComponent(match[1]) : null;
}
