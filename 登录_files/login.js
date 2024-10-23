function countdownTime() {
    var countdown = 60; //倒计时秒数
    $('.get-code').hide();
    $('.before-reget').show();
	$('.voice-use').removeClass("voice-tip");
    var clock = window.setInterval(function () {
        countdown--;
        $("#showcountdown").html( countdown+"s后重新获取");
        if (countdown == 0) {
            window.clearInterval(clock);
            $('.get-code').show().text('重新获取');
            $('.before-reget').hide();
			$('.voice-use').html("没有收到验证码？可尝试<a href='javascript:voiceCodeFunc.showVoiceCodePop()'>语音获取</a>").addClass("voice-tip");
		}
    }, 1000)
}

//闭眼睁眼
function initPassword(doc) {
    if ($(doc).hasClass('icon-eye-close')) {
        $(doc).removeClass('icon-eye-close').addClass('icon-eye-open');
        $(doc).parent().find("input").attr('type', 'text');
    } else {
        $(doc).removeClass('icon-eye-open').addClass('icon-eye-close');
        $(doc).parent().find("input").attr('type', 'password');
    }

}

//选择学校、机构
function initSelectList() {
    $(".to-select-list").on('focus', function () {
        $(this).parent().find('.filter-list').fadeIn();
    })
    $('.filter-list').on('click', 'li', function () {
        var opt = $(this).text();
        $(this).siblings().removeClass('current');
        $(this).addClass('current');
        $(this).parents('div').find('.to-select-list').val(opt);
        $('.filter-list').fadeOut()
    });
    $(document).click(function (e) {
        var $target = $(e.target);
        $('.filter-list').hide();
    });
    $('.item-select').click(function (event) {
        event.stopPropagation();
    });
}


//选择区号
function showTelList(html) {
    $(html).parent().find('.filter-list').fadeIn();
    /*$(html).addClass('icon-up');*/
}

function initTelList() {
    $('.filter-list').on('click', 'li', function () {
        var opt = $(this).data('id');
        $(this).siblings().removeClass('current');
        $(this).addClass('current');
        $(this).parents('div').find('.to-select-list b').text('+' + opt);
        $('.filter-list').fadeOut()
        $(this).parents('div').find('.to-select-list').removeClass('icon-up')
    });
    $(document).click(function (e) {
        var $target = $(e.target);
        $('.filter-list').hide();
        $('.to-select-list').removeClass('icon-up')
    });
    $('.item-select').click(function (event) {
        event.stopPropagation();
    });
}
function encryptByDES(message, key){
	var keyHex = CryptoJS.enc.Utf8.parse(key);
	var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.ciphertext.toString();
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

//手机号+密码登录
function loginByPhoneAndPwd(){
	util.showMsg(false,"phoneMsg","",true);
	util.showMsg(false,"pwdMsg","",true);
	util.showMsg(false,"err-txt","");
	var phone = $("#phone").val().trim();
	var pwd = $("#pwd").val();
	var fid = $("#fid").val();
	var refer = $("#refer").val();
	var doubleFactorLogin = $("#doubleFactorLogin").val();
	var independentId = $("#independentId").val();
	var independentNameId = $("#independentNameId").val();
	var forbidotherlogin = $("#forbidotherlogin").val();
	if(util.isEmpty(phone)){
		util.showMsg(true,"phoneMsg","请输入手机号",true);
		return;
	}/*else if(!util.isInterPhone(phone) && (phone.length > 50 || !util.checkEmail(phone))){
		util.showMsg(true,"phoneMsg","手机号格式错误",true);
		return;
	}*/
	if(util.isEmpty(pwd)){
		util.showMsg(true,"pwdMsg","请输入密码",true);
		return;
	}
	var t = $("#t").val();
	if(t == "true"){
		let transferKey = "u2oh6Vu^HWe4_AES";
		pwd = encryptByAES(pwd, transferKey);
		phone = encryptByAES(phone, transferKey);
	}
	$.ajax({
		url: _CP_+"/fanyalogin",
		type:"post",
		dataType : 'json',
		data: {
			'fid': fid,
			'uname': phone,
			'password': pwd,
			'refer': refer,
			't': t,
			'doubleFactorLogin': doubleFactorLogin,
			'forbidotherlogin': forbidotherlogin,
			'independentId': independentId,
			'independentNameId': independentNameId
		},
		success: function(data){
			if(data.status){
				var url = "";
				/*
				if(data.tochaoxing){
					url = "/towriteother?name="+encodeURIComponent(data.name)+"&pwd="+encodeURIComponent(data.pwd)+"&refer="+data.url;
				}else{

				 */
					url = decodeURIComponent(data.url);
				//}
				if (data.containTwoFactorLogin) {
					let twoFactorLoginUrl = data.twoFactorLoginUrl + "&refer=" +encodeURIComponent(url);
					window.location = twoFactorLoginUrl;
					return false;
				}

				if($("#_blank").val() == "1"){
					top.location = url;
				}else{
					window.location = url;
				}
			}else{
				if(data.weakpwd) {
					window.location = _CP_+"/v11/updateweakpwd?uid=" + data.uid + "&oldpwd=" + encodeURIComponent(pwd) + "&refer=" + refer;
				}else{
					var msg = util.isEmpty(data.msg2) ? "登录失败" : data.msg2;
					msg = ("密码错误" == msg || "用户名或密码错误" == msg) ? "手机号或密码错误" : msg;
					util.showMsg(true,"err-txt",msg);
				}
			}
		}
	});
}

//手机号+验证码登录
function loginByPhoneAndCode(){
	util.showMsg(false,"phoneMsg","",true);
	util.showMsg(false,"vercodeMsg","",true);
	util.showMsg(false,"err-txt","");
	let phone = $("#phone").val().trim();
	let countryCode = $("#countryCode").val();
	let vercode = $("#vercode").val().trim();
	let fid = $("#fid").val();
	let refer = $("#refer").val();
	let doubleFactorLogin = $("#doubleFactorLogin").val();
	let independentNameId = $("#independentNameId").val();
	if(util.isEmpty(phone)){
		util.showMsg(true,"phoneMsg","请输入手机号",true);
		return;
	}else if(!util.isInterPhone(phone,countryCode)){
		util.showMsg(true,"phoneMsg","手机号格式错误",true);
		return;
	}
	if(util.isEmpty(vercode)){
		//避免与下方提示冲突
		util.showMsg(true,"vercodeMsg","",true);
		util.showMsg(true,"err-txt","请输入验证码");
		return;
	}else if(!util.checkPhoneCode(vercode)){
		//避免与下方提示冲突
		util.showMsg(true,"vercodeMsg","",true);
		util.showMsg(true,"err-txt","验证码格式错误");
		return;
	}

	var transferKey = "u2oh6Vu^HWe4_AES";
	vercode = encodeURIComponent(encryptByAES(vercode, transferKey));

	$.ajax({
			url: _CP_+"/fanyaloginbycode",
			type:"post",
			dataType : 'json',
			data:{ 'fid':fid,'uname':phone,'verCode':vercode,'refer':refer, 'doubleFactorLogin': doubleFactorLogin, 'independentNameId':independentNameId},
			success: function(data){
				if(data.status){
					let url = decodeURIComponent(data.url);
					if (data.containTwoFactorLogin) {
						let twoFactorLoginUrl = data.twoFactorLoginUrl + "&refer=" +encodeURIComponent(url);
						window.location = twoFactorLoginUrl;
						return false;
					}
					window.location = url;
					/*
					if(data.tochaoxing){
						window.location = "/towriteother?name="+encodeURIComponent(data.name)+"&pwd="+encodeURIComponent(data.pwd)+"&refer="+data.url;
					}else{
						window.location = decodeURIComponent(data.url);
					}*/
				}else{
					if(data.type == 1){
						var quick = $("#quick").val();
						if(quick == "1"){
							window.location = data.quickUrl;
						}else{
							window.location = data.url;			//跳转到注册流程(设置密码页面)
						}
						//$("#err-txt").html("手机号不存在，请先注册");
					}else{
						var msg = util.isEmpty(data.msg2) ? "登录失败" : data.msg2;
						$("#err-txt").html(msg);
					}
				}
			}
	});
}

document.cookie = "retainlogin=0;";
//机构登录
function beforeunitlogin(){
	if(capInstance == null || $('#captchaFlag').val() == "true"){
		//容错
		unitlogin();
	}else{
		capInstance && capInstance.popUp();
	}
}

function unitlogin(){
	let msgId = "err-txt2";
	util.showMsg(false,"unameMsg","",true);
	util.showMsg(false,"passwordMsg","",true);
	util.showMsg(false,"vercodeMsg","",true);
	util.showMsg(false,msgId,"");
	var uname = $("#uname").val().trim();
	var vercode = $("#vercode").val().trim();
	var password = $("#password").val();
	var pid = $("#pid").val();
	var fid = $("#fid").val();
	var refer = $("#refer").val();
	var doubleFactorLogin = $("#doubleFactorLogin").val();
	var hidecompletephone = $("#hidecompletephone").val();
	var forbidotherlogin = $("#forbidotherlogin").val();
	var independentId = $("#independentId").val();
	var independentNameId = $("#independentNameId").val();
	if(util.isEmpty(uname)){
		util.showMsg(true,"unameMsg","请输入学号/工号",true);
		return;
	}
	if(util.isEmpty(password)){
		util.showMsg(true,"passwordMsg","请输入密码",true);
		return;
	}

	var validate = $("#validate").val();
	if(undefined == validate){
		validate = "";
	}
	var t = $("#t").val();
	if(t == "true"){
		let transferKey = "u2oh6Vu^HWe4_AES";
		password = encryptByAES(password, transferKey);
		uname = encryptByAES(uname, transferKey);
	}

	if(fid == -1){
		var fidName = $("#inputunitname").val();
		$.ajax({
			type:"get",
			url: _CP_+"/org/searchUnis",
			async:false,
			data:"filter="+encodeURIComponent(fidName)+"&product=44&type=",
			success: function(date){
				var myjson = eval("("+date+")");
				var result = myjson.result;
				if(result){
					var froms = myjson.froms;
					var size = myjson.fromNums;
					for(var i=0;i<size;i++){
						var name = froms[i].name;
						if(fidName == name){
							var id = froms[i].schoolid;
							$("#fid").val(id);
							fid = $("#fid").val();
							break;
						}
					}
				} else {
					var reg = /^[0-9]*$/;
					if (reg.test(fidName)) {
						fid = fidName
					}
				}
			}
		});
	}

	$.ajax({
		url: _CP_+"/unitlogin",
		type: "post",
		dataType: 'json',
		data: {
			'pid': pid,
			'fid': fid,
			'uname': uname,
			'numcode': vercode,
			'validate': validate,
			'password': password,
			'refer': refer,
			't': t,
			'hidecompletephone': hidecompletephone,
			'doubleFactorLogin': doubleFactorLogin,
			'forbidotherlogin': forbidotherlogin,
			'independentId': independentId,
			'independentNameId': independentNameId
		},
		success: function (data) {
			if(data.status){
				if(data.type == 0 ){
					let url = data.url;
					if (data.containTwoFactorLogin) {
						let twoFactorLoginUrl = data.twoFactorLoginUrl + "&refer=" + url;
						window.location = twoFactorLoginUrl;
						return false;
					}

					window.location = decodeURIComponent(url);
					/*
					if(data.tochaoxing){
						window.location = "/towriteother?name="+encodeURIComponent(data.name)+"&pwd="+encodeURIComponent(data.pwd)+"&refer="+data.url;
					}else{
						window.location = decodeURIComponent(data.url);
					}*/
				}else if(data.type == 1){
					getNumCode();
					var msg = "密码错误" == data.mes ? "用户名或密码错误" : data.mes;
					util.showMsg(true,msgId,msg);
				}else if(data.type == 2){//完善信息
					var host=document.domain;
					window.location = document.location.protocol+"//"+host+data.url;
				}
			}else{
				getNumCode();
				var msg = util.isEmpty(data.mes) ? "登录失败" : data.mes;
				msg = ("密码错误" == msg) ? "用户名或密码错误" : msg;
				util.showMsg(true,msgId,msg);
			}
		}
	});
}
function getNumCode() {
	var img = document.getElementById("numVerCode");
	img.src = _CP_+"/num/code?" + new Date().getTime();
}

//跳转到其他方式的登录页面
function otherLogin(loginType){
	var fid = $("#fid").val();
	var refer = $("#refer").val();
	var quick = $("#quick").val();
	var pwdtip = $("#pwdtip").val();
	if (quick == undefined) {
		quick = 0;
	}
	var forbidotherlogin = $("#forbidotherlogin").val();
	var hideForgotPwd = typeof getURLQuery == 'function' ? getURLQuery('hideForgotPwd') : '';
	var url = _CP_+"/mlogin?quick=" + quick + "&loginType=" + loginType + "&forbidotherlogin=" + forbidotherlogin
		+ "&newversion=true&fid=" + fid + "&refer=" + refer;
	var doubleFactorLogin = $("#doubleFactorLogin").val();
	if (doubleFactorLogin != undefined) {
		url += "&doubleFactorLogin=" + doubleFactorLogin;
	}
	var independentId = $("#independentId").val();
	if (independentId != undefined) {
		url += "&independentId=" + independentId;
	}
	var independentNameId = $("#independentNameId").val();
	if (independentNameId != undefined) {
		url += "&independentNameId=" + independentNameId;
	}
	var accounttip = $("#accounttip").val();
	if (accounttip != undefined) {
		url += "&accounttip=" + accounttip;
	}
	if (pwdtip != undefined) {
		url +="&pwdtip="+pwdtip;
	}
	var topTip = $("#topTip").val();
	if(loginType =="3" && topTip!=''  && topTip!='undefined'&& topTip!=undefined){
		url += "&topTip=" + topTip;
	}
	if (hideForgotPwd && hideForgotPwd == '1')
		url += '&hideForgotPwd=1';

	var otherLoginUrl = $("#otherLoginUrl").val();
	if(loginType =="3" && otherLoginUrl!=''  && otherLoginUrl!='undefined'&& otherLoginUrl!=undefined){
		url = otherLoginUrl;
	}
	location.href = url;
}

function toRegister(){
	var fid = $("#fid").val();
	var refer = $("#refer").val();
	var quick = $("#quick").val();
	if (quick == undefined) {
		quick = 0;
	}
	let url = _CP_ + "/enroll?quick=" + quick + "&newversion=true&fid=" + fid + "&refer=" + refer;
	let independentId = $("#independentId").val();
	if (independentId != undefined) {
		url += "&independentId=" + independentId;
	}
	location.href = url;
}

function toFindPwd() {
	let refer = $("#refer").val();
	let fid = $("#fid").val();
	let independentId = $("#independentId").val();
	location.href = _CP_ + "/pwd/getpwd?version=1&fid=" + fid + "&independentId=" + independentId + "&refer=" + refer;
}

function toUnitFindPwd(){
	let refer = $("#refer").val();
	let fid = $("#fid").val();
	let uname = $("#uname").val();
	let fromAccountManage = $("#fromAccountManage").val();
	if (fromAccountManage == "1"){
		uname = $("#idNumber").val();
	}
	location.href = _CP_+"/pwd/pwdappeal?client=false&fid="+fid+"&uname="+uname+"&refer="+encodeURIComponent(refer);
}

function loginType(type) {
	$('.login-box div').removeClass('check');
	if (type == 0) {
		$('.code').addClass('check');
		$('.tab-list').hide();
		$('.QR-list').show()
	} else {
		$('.password').addClass('check');
		$('.tab-list').show();
		$('.QR-list').hide()
	}
}
