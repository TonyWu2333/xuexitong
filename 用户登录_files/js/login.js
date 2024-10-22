// 判断是否是超星阅读器
function isChaoxingReader() {
    var ua = navigator.userAgent;
    if (ua != undefined) {
        return ua.indexOf("SSREADER/4.1.6.0001") != -1;
    }
}

function countdownTime() {
    var retry = "重新获取";
    if (getCookie("browserLocale") == 'en_US') {
        retry = "Reacquire";
    }
    var countdown = 60; //倒计时秒数
    $('.get-code').hide();
    $('.before-reget').show();
    $('.voice-use').removeClass("voice-tip");
    var clock = window.setInterval(function () {
        countdown--;
        $("#showcountdown").html(countdown + "s后重新获取");
        if (countdown == 0) {
            window.clearInterval(clock);
            $('.get-code').show().text(retry);
            $('.before-reget').hide();
            $('.voice-use').html("没有收到验证码？可尝试<a href='javascript:voiceCodeFunc.showVoiceCodePop()'>语音获取</a>").addClass("voice-tip");
        }
    }, 1000)

}

function getCookie(c_name) {
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
}

function initTelList() {
    $('.filter-list').on('click', 'li', function () {
        var opt = $(this).data('id');
        $(this).siblings().removeClass('current');
        $(this).addClass('current');
        $(this).parents('div').find('.to-select-list').text('+' + opt);
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

var please_input_phone = "请输入手机号";
var please_input_pwd = "请输入密码";
var phone_format_error = "手机号格式错误";
var captcha_format_error = "验证码格式错误";
var please_input_captcha = "请输入验证码";
var please_input_studentcode = "请输入学号/工号";

try {
    if (countryCode.getCookie("browserLocale") == 'en_US') {
        please_input_phone = "please input phone number";
        please_input_pwd = "please input password";
        phone_format_error = "phone format error";
        captcha_format_error = "captcha format error";
        please_input_captcha = "please input captcha";
        please_input_studentcode = 'please input Student ID/Institution ID';
    }
} catch (e) {
    console.log('请先引用util.js')
}

function encryptByDES(message, key) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
}

function encryptByAES(message, key) {
    let CBCOptions = {
        iv: CryptoJS.enc.Utf8.parse(key),
        mode: CryptoJS.mode.CBC,
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
function loginByPhoneAndPwd() {
    util.showMsg(false, "phoneMsg", "", true);
    util.showMsg(false, "pwdMsg", "", true);
    util.showMsg(false, "err-txt", "");
    var phone = $("#phone").val().trim();
    var pwd = $("#pwd").val();
    var fid = $("#fid").val();
    var refer = $("#refer").val();
    var forbidotherlogin = $("#forbidotherlogin").val();
    if (util.isEmpty(phone)) {
        util.showMsg(true, "phoneMsg", please_input_phone, true);
        return;
    }/*else if(!util.isInterPhone(phone) && (phone.length > 50 || !util.checkEmail(phone))){
		util.showMsg(true,"phoneMsg","手机号格式错误",true);
		return;
	}*/
    if (util.isEmpty(pwd)) {
        util.showMsg(true, "pwdMsg", please_input_pwd, true);
        return;
    }
    var t = $("#t").val();
    if (t == "true") {
        var transferKey = "u2oh6Vu^HWe4_AES";
        pwd = encryptByAES(pwd, transferKey);
        //pwd = $.base64.btoa(pwd,"UTF-8");
    }

    if (capInstance == null || $("#needVcode").val() != "1") {
        //容错
        loginByPhoneAndPwdSubmit();
    } else {
        capInstance && capInstance.popUp();
    }
}

function loginByPhoneAndPwdSubmit() {
    var phone = $("#phone").val().trim();
    var pwd = $("#pwd").val();
    var fid = $("#fid").val();
    var refer = $("#refer").val();
    var forbidotherlogin = $("#forbidotherlogin").val();
    var t = $("#t").val();
    var _blank = $("#_blank").val();
    var doubleFactorLogin = $("#doubleFactorLogin").val();
    var independentId = $("#independentId").val();
    var independentNameId = $("#independentNameId").val();
    if (t == "true") {
        let transferKey = "u2oh6Vu^HWe4_AES";
        pwd = encryptByAES(pwd, transferKey);
        phone = encryptByAES(phone, transferKey);
    }
    let validate = $("#validate").val();
    if (undefined == validate) {
        validate = "";
    }
    $.ajax({
        url: _CP_ + "/fanyalogin",
        type: "post",
        dataType: 'json',
        data: {
            'fid': fid,
            'uname': phone,
            'password': pwd,
            'refer': refer,
            't': t,
            'forbidotherlogin': forbidotherlogin,
            'validate': validate,
            'doubleFactorLogin': doubleFactorLogin,
            'independentId': independentId,
            'independentNameId': independentNameId
        },
        success: function (data) {
            if (data.status) {
                let url = "";
                if (isChaoxingReader()) {
                    let path = window.location.protocol + '//' + window.location.host;
                    url = path + _CP_ + "/towriteother?name=" + encodeURIComponent(data.name) + "&pwd=" + encodeURIComponent(data.pwd) + "&refer=" + data.url;
                } else {
                    url = decodeURIComponent(data.url);
                }
                //跳转到双因子登录页面
                if (data.containTwoFactorLogin) {
                    let toTwoFactorLoginPCUrl = data.twoFactorLoginPCUrl;
                    location.href = toTwoFactorLoginPCUrl + "&_blank=" + _blank + "&refer=" + encodeURIComponent(url);
                    return false;
                }

                if (top.location != self.location && _blank == "1") {
                    top.location = url;
                } else {
                    window.location = url;
                }
            } else {
                if (data.weakpwd) {
                    window.location = _CP_ + "/v11/updateweakpwd?uid=" + data.uid + "&oldpwd=" + encodeURIComponent(pwd) + "&_blank=" + $("#_blank").val() + "&refer=" + refer;
                } else {
                    let msg = util.isEmpty(data.msg2) ? "登录失败" : data.msg2;
                    msg = ("密码错误" == msg || "用户名或密码错误" == msg) ? "手机号或密码错误" : msg;
                    util.showMsg(true, "err-txt", msg);
                }
            }
        }
    });
}

//手机号+验证码登录
function loginByPhoneAndCode() {
    util.showMsg(false, "phoneMsg", "", true);
    util.showMsg(false, "vercodeMsg", "", true);
    util.showMsg(false, "err-txt", "");
    $(".voice-tip").removeClass("voice-tip");
    var phone = $("#phone").val().trim();
    var countryCode = $("#countryCode").val();
    var vercode = $("#vercode").val().trim();
    var fid = $("#fid").val();
    var refer = $("#refer").val();
    var ebook = $("#ebook").val();
    var allowSkip = $("#allowSkip").val();
    var doubleFactorLogin = $("#doubleFactorLogin").val();
    var independentNameId = $("#independentNameId").val();
    if (util.isEmpty(phone)) {
        util.showMsg(true, "phoneMsg", please_input_phone, true);
        return;
    } else if (!util.isInterPhone(phone, countryCode)) {
        util.showMsg(true, "phoneMsg", phone_format_error, true);
        return;
    }
    if (util.isEmpty(vercode)) {
        //避免与下方提示冲突
        util.showMsg(true, "vercodeMsg", "", true);
        util.showMsg(true, "err-txt", please_input_captcha);
        return;
    } else if (!util.checkPhoneCode(vercode)) {
        //避免与下方提示冲突
        util.showMsg(true, "vercodeMsg", "", true);
        util.showMsg(true, "err-txt", captcha_format_error);
        return;
    }

    var transferKey = "u2oh6Vu^HWe4_AES";
    vercode = encodeURIComponent(encryptByAES(vercode, transferKey));

    $.ajax({
        url: _CP_ + "/fanyaloginbycode",
        type: "post",
        dataType: 'json',
        data: {
            'fid': fid,
            'uname': phone,
            'verCode': vercode,
            'refer': refer,
            'doubleFactorLogin': doubleFactorLogin,
            'independentNameId': independentNameId
        },
        success: function (data) {
            if (data.status) {
                let url = decodeURIComponent(data.url);
                if (isChaoxingReader()) {
                    url = _CP_ + "/towriteother?name=" + encodeURIComponent(data.name) + "&pwd=" + encodeURIComponent(data.pwd) + "&refer=" + data.url;
                }
                //跳转到双因子登录页面
                if (data.containTwoFactorLogin) {
                    let toTwoFactorLoginPCUrl = data.twoFactorLoginPCUrl;
                    location.href = toTwoFactorLoginPCUrl + "&refer=" + encodeURIComponent(url);
                    return false;
                }

                window.location = url
            } else {
                if (data.type == 1) {
                    var quick = $("#quick").val();
                    if (quick == "1") {
                        window.location = data.quickUrl;
                    } else {
                        window.location = data.url + "&ebook=" + ebook + "&allowSkip=" + allowSkip;//跳转到注册流程(设置密码页面)
                    }
                } else {
                    var msg = util.isEmpty(data.msg2) ? "登录失败" : data.msg2;
                    $("#err-txt").html(msg);
                }
            }
        }
    });
}

//机构登录
function beforeunitlogin() {
    if (capInstance == null || $('#captchaFlag').val() == "true") {
        //容错
        unitlogin();
    } else {
        capInstance && capInstance.popUp();
    }
}

function unitlogin() {
    let msgId = "err-txt2";
    util.showMsg(false, "unameMsg", "", true);
    util.showMsg(false, "passwordMsg", "", true);
    util.showMsg(false, "vercodeMsg", "", true);
    util.showMsg(false, msgId, "");
    var uname = $("#uname").val().trim();
    var password = $("#password").val();
    var pid = $("#pid").val();
    var fid = $("#fid").val();
    var refer = $("#refer").val();
    var hidecompletephone = $("#hidecompletephone").val();
    var forbidotherlogin = $("#forbidotherlogin").val();
    var doubleFactorLogin = $("#doubleFactorLogin").val();
    var independentId = $("#independentId").val();
    var independentNameId = $("#independentNameId").val();
    if (util.isEmpty(uname)) {
        util.showMsg(true, "unameMsg", please_input_studentcode, true);
        return;
    }
    if (util.isEmpty(password)) {
        util.showMsg(true, "passwordMsg", please_input_pwd, true);
        return;
    }

    var t = $("#t").val();
    var validate = $("#validate").val();
    if (undefined == validate) {
        validate = "";
    }

    if (t == "true") {
        let transferKey = "u2oh6Vu^HWe4_AES";
        password = encryptByAES(password, transferKey);
        uname = encryptByAES(uname, transferKey);
    }

    if (fid == -1) {
        let fidName = $("#inputunitname").val();
        $.ajax({
            type: "get",
            url: _CP_ + "/org/searchUnis",
            async: false,
            data: "filter=" + encodeURIComponent(fidName) + "&product=44&type=",
            success: function (date) {
                let myjson = eval("(" + date + ")");
                let result = myjson.result;
                if (result) {
                    var froms = myjson.froms;
                    var size = myjson.fromNums;
                    for (let i = 0; i < size; i++) {
                        let name = froms[i].name;
                        if (fidName == name) {
                            let id = froms[i].schoolid;
                            $("#fid").val(id);
                            fid = $("#fid").val();
                            break;
                        }
                    }
                } else {
                    let reg = /^[0-9]*$/;
                    if (reg.test(fidName)) {
                        fid = fidName
                    }
                }
            }
        });
    }

    $.ajax({
        url: _CP_ + "/unitlogin",
        type: "post",
        dataType: 'json',
        data: {
            'pid': pid,
            'fid': fid,
            'uname': uname,
            'password': password,
            'refer': refer,
            't': t,
            'validate': validate,
            'hidecompletephone': hidecompletephone,
            'doubleFactorLogin': doubleFactorLogin,
            'forbidotherlogin': forbidotherlogin,
            'independentId': independentId,
            'independentNameId': independentNameId
        },
        success: function (data) {
            if (data.status) {
                if (data.type == 0) {
                    let url = decodeURIComponent(data.url);
                    if (isChaoxingReader()) {
                        url = _CP_ + "/towriteother?name=" + encodeURIComponent(data.name) + "&pwd=" + encodeURIComponent(data.pwd) + "&refer=" + data.url;
                    }
                    //跳转到双因子登录页面
                    if (data.containTwoFactorLogin) {
                        let toTwoFactorLoginPCUrl = data.twoFactorLoginPCUrl;
                        location.href = toTwoFactorLoginPCUrl + "&refer=" + encodeURIComponent(url);
                        return false;
                    }
                    window.location = url;
                } else if (data.type == 1) {
                    getNumCode();
                    var msg = "密码错误" == data.mes ? "用户名或密码错误" : data.mes;
                    util.showMsg(true, msgId, msg);
                } else if (data.type == 2) {//完善信息
                    var host = document.domain;
                    window.location = document.location.protocol + "//" + host + data.url;
                }
            } else {
                getNumCode();
                var msg = util.isEmpty(data.mes) ? "登录失败" : data.mes;
                msg = ("密码错误" == msg) ? "用户名或密码错误" : msg;
                util.showMsg(true, msgId, msg);
            }
        }
    });
}

function getNumCode() {
    var img = document.getElementById("numVerCode");
    img.src = _CP_ + "/num/code?" + new Date().getTime();
}

//跳转到其他方式的登录页面
function otherLogin(loginType) {
    var fid = $("#fid").val();
    var refer = $("#refer").val();
    var accounttip = $("#accounttip").val();
    var pwdtip = $("#pwdtip").val();
    var hidecompletephone = $("#hidecompletephone").val();
    var ebook = $("#ebook").val();
    var allowSkip = $("#allowSkip").val();
    var doubleFactorLogin = $("#doubleFactorLogin").val();
    if (hidecompletephone == undefined) {
        hidecompletephone = 0;
    }
    var hideForgotPwd = typeof getURLQuery == 'function' ? getURLQuery('hideForgotPwd') : '';
    var forbidotherlogin = $("#forbidotherlogin").val();
    var url = _CP_ + "/login?loginType=" + loginType + "&newversion=true&fid=" + fid + "&hidecompletephone=" + hidecompletephone
        + "&ebook=" + ebook + "&allowSkip=" + allowSkip + "&forbidotherlogin=" + forbidotherlogin + "&refer=" + refer;
    if (accounttip != undefined) {
        url += "&accounttip=" + accounttip;
    }
    if (pwdtip != undefined) {
        url += "&pwdtip=" + pwdtip;
    }
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
    var retainlogin = $("#retainlogin").val();
    if (retainlogin != undefined) {
        url += "&retainlogin=" + retainlogin;
    }
    var topTip = $("#topTip").val();
    if (loginType == "3" && topTip != '' && topTip != 'undefined' && topTip != undefined) {
        url += "&topTip=" + topTip;
    }
    if (hideForgotPwd && hideForgotPwd == '1')
        url += '&hideForgotPwd=1';

    var otherLoginUrl = $("#otherLoginUrl").val();
    if (loginType == "3" && otherLoginUrl != '' && otherLoginUrl != 'undefined' && otherLoginUrl != undefined) {
        url = otherLoginUrl;
    }

    if (window.parent != this.window) {
        window.open(url, "_blank");
    } else {
        location.href = url;
    }
}

function toRegister() {
    var fid = $("#fid").val();
    var refer = $("#refer").val();
    var regurl = $("#regurl").val();
    var quick = $("#quick").val();
    var ebook = $("#ebook").val();
    var allowSkip = $("#allowSkip").val();
    if (quick == undefined) {
        quick = 0;
    }
    var url = "/enroll?quick=" + quick + "&newversion=true&fid=" + fid + "&ebook=" + ebook + "&allowSkip=" + allowSkip + "&refer=" + refer;
    let independentId = $("#independentId").val();
    if (independentId != undefined) {
        url += "&independentId=" + independentId;
    }
    if (regurl != undefined && regurl != "") {
        if (regurl.indexOf("?") != -1) {
            url = regurl + "&fid=" + fid + "&refer=" + refer;
        } else {
            url = regurl + "?fid=" + fid + "&refer=" + refer;
        }
    }
    if (window.parent != this.window) {
        window.open(_CP_ + url, "_blank");
    } else {
        location.href = _CP_ + url;
    }
}

function toFindPwd(fromPage) {
    let independentId = $("#independentId").val();
    let refer = $("#refer").val();
    let fid = $("#fid").val();
    let reg = /^[0-9]+.?[0-9]*$/;
    if (!reg.test(fid)) {
        fid = 0;
    }
    let flushCookie = true;
    if (typeof fromPage != 'undefined' && fromPage != '') {
        //目前不是从双因子找回密码的都进行cookie刷新
        flushCookie = fromPage.indexOf("toTwoFactorLogin") < 0;
        refer = encodeURIComponent(fromPage);
    }
    let url = _CP_ + "/pwd/findpwd?version=1&fid=" + fid + "&flushCookie=" + flushCookie + "&independentId=" + independentId + "&refer=" + refer;
    if (window.parent != this.window) {
        window.open(url, "_blank");
    } else {
        location.href = url;
    }
}

function toUnitFindPwd() {
    let refer = encodeURIComponent($("#refer").val());
    let fid = $("#fid").val();
    let uname = $("#uname").val();
    location.href = _CP_ + "/pwd/pwdappeal?client=false&fid=" + fid + "&uname=" + uname + "&refer=" + refer;
}

//获取登录页面下方显示的通知内容
function showNotice(fid) {
    if (util.isEmpty(fid) || fid < 0) {
        return;
    } else {
        $.get(_CP_ + "/api/notice", {'fid': fid}, function (data, status) {
            if (data.status) {
                var content = delHtmlTag(data.content);
                $("#noticeContent").html(content);
                $("#notice").show();
            }
        }, "json");
    }
}

function delHtmlTag(str) {
    return str;
    //return str.replace(/<[^>]+>/g, "");// 去掉所有的html标记
}

//tab切换
function initTab(parent, changeBack, x) {
    var _index = x || 1;
    $(parent).find('.tab-head .tab-t').removeClass('current');
    $(parent).find('.tab-head .tab-t').eq(_index - 1).addClass('current');
    $(parent).find('.tab-list').hide();
    $(parent).find('.tab-list').eq(_index - 1).show();

    $(parent).on('click', '.tab-head .tab-t', function () {
        $(this).siblings().removeClass('current');
        $(this).addClass('current');
        $(parent).find('.tab-list').hide();
        var index = $(this).index();
        $(parent).find('.tab-list').eq(index).show();
        if (changeBack) {
            changeBack();
        }
    })
}

//加载滑动校验块
function loadSlide(beforeFun, onVerifyFun) {
    let url = document.location.protocol + '//captcha.chaoxing.com/load.min.js' + '?t=' + getTimestamp(60 * 1000); // 时长1分钟，建议时长分钟级别
    beforeFun && beforeFun();
    loadScript(url, function () {
        try {
            //验证码初始化
            var initCaptcha = initCXCaptcha({
                captchaId: 'GcXX5vewqE7DezKGlyvleKCnkTglvGpL',
                element: '#captcha',
                mode: 'popup',
                onVerify: function (err, data) {
                    if (err) return; // 当验证失败时，内部会自动refresh方法，无需手动再调用一次
                    $("#validate").val(data.validate);
                    // 成功事件
                    onVerifyFun && onVerifyFun();
                    capInstance.refresh();
                }
            }, function onload(instance) {
                capInstance = instance;
            }, function onerror(err) {
            });
        } catch (e) {
        }
    })
}

//双因子登录 手机+验证码校验||手机+密码校验
function twoFactorVerifyBtnClick(type) {
    util.showMsg(false, "pwdMsg", "", true);
    util.showMsg(false, "vercodeMsg", "", true);
    $(".voice-tip").removeClass("voice-tip");
    let refer = $("#refer").val();
    let phone = $("#phone").val().trim();
    let vercode = $("#vercode").val();
    let password = $("#pwd").val();
    let postUrl = '/v11/checkPassword';
    let postData = {'phone': phone, 'password': password};
    if (type === 'verify_code') {//校验验证码
        postUrl = '/v11/checkmessage';
        postData = {'phone': phone, 'vcode': vercode};
        vercode.trim();
        if (util.isEmpty(vercode)) {
            //避免与下方提示冲突
            util.showMsg(true, "vercodeMsg", "", true);
            util.showMsg(true, "err-txt", please_input_captcha);
            return;
        } else if (!util.checkPhoneCode(vercode)) {
            //避免与下方提示冲突
            util.showMsg(true, "vercodeMsg", "", true);
            util.showMsg(true, "err-txt", captcha_format_error);
            return;
        }
    } else {//校验密码
        if (util.isEmpty(password)) {
            util.showMsg(true, "pwdMsg", please_input_pwd, true);
            return;
        }
    }
    $.ajax({
        url: _CP_ + postUrl,
        type: "post",
        dataType: 'json',
        data: postData,
        success: function (data) {
            if (data.status) {
                if (top.location != self.location && $("#_blank").val() == "1") {
                    top.location = refer;
                } else {
                    window.location = refer;
                }
            } else {
                util.showMsg(true, "err-txt", data.mes);
            }
        }
    });
}

$(document).on("click", ".auto-lg-next .check-input", function () {
    if ($(this).hasClass("checked-input")) {
        $("#retainlogin").val(2);
        document.cookie = "retainlogin=2;";
    } else {
        $("#retainlogin").val(1);
        document.cookie = "retainlogin=1;";
    }
    $(".auto-lg-next .check-input").toggleClass("checked-input");

});
