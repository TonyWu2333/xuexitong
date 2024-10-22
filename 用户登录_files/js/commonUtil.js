//获取学习通的版本号
function getXxtVersion() {
    var intUa = 3000;
    try {
        var ua = navigator.userAgent;
        var index = ua.indexOf('ChaoXingStudy_3_');
        ua = ua.substring(index + 16);
        index = ua.indexOf('_');
        ua = ua.substring(0, index).replace(/\./g, '');
        var intUa = parseInt(ua);

        if (intUa < 10) {
            intUa = intUa * 1000;
        } else if (intUa < 100) {
            intUa = intUa * 100;
        } else if (intUa < 1000) {
            intUa = intUa * 10;
        }
    } catch (error) {
        return intUa;
    }
    return intUa;
}

function versionTransfer(v) {
    var intUa = parseInt(v.replace(/\./g, ''));

    if (intUa < 10) {
        intUa = intUa * 1000;
    } else if (intUa < 100) {
        intUa = intUa * 100;
    } else if (intUa < 1000) {
        intUa = intUa * 10;
    }
    return intUa;
}

var xxtVersion = {
    productid: 0,//产品id
    clientNum: 0,//客户端版本号0.0.0.0文本
    clientNumCount: 0,//客户端版本号整形
    apiVersion: 1,//api版本号
    deviceNUm: ""//设备号
}

function clientVersion(ua) {
    var reg = /.*ChaoXingStudy_(\d+)_(\d+[^_]*)_([^_]*)_([^_]*)_([^ ]*)?( \([^)]*\))?.*_(.*[-]?\w+).*$/g
    var result = reg.exec(ua);
    if (result) {
        try {
            xxtVersion.productid = result[1];
            xxtVersion.clientNum = result[2];
            xxtVersion.deviceNUm = result[7];
            xxtVersion.clientNumCount = versionTransfer(result[2]);
            var apiv = result[5];
            if (apiv.split('_').length == 2) {
                xxtVersion.apiVersion = apiv.split('_')[1];
            }
        } catch (e) {
        }

    }
    return xxtVersion;
}

/**
 * 获取客户端信息
 * */
function clientVersionInfo() {
    var ua = navigator.userAgent;
    var reg = /.*ChaoXingStudy_(\d+)_(\d+[^_]*)_([^_]*)_([^_]*)_([^ ]*)?( \([^)]*\))?.*_(.*[-]?\w+).*$/g
    var result = reg.exec(ua);
    if (result) {
        try {
            xxtVersion.productid = result[1];
            xxtVersion.clientNum = result[2];
            xxtVersion.deviceNUm = result[7];
            var apiv = result[5];
            if (apiv.split('_').length == 2) {
                xxtVersion.apiVersion = apiv.split('_')[1];
            }
        } catch (e) {
        }

    }
    return xxtVersion;
}

/**
 * 校验姓名
 * 1、数字只能出现在最后，切不能大于4
 * */
function checkRealName(realName) {
    var flag = /^[^0-9]*(\d*)$/.test(realName);
    if (!flag) {
        return false;
    } else {
        var num = RegExp.$1;
        if (num != "") {
            if (parseInt(num) > 4) {
                return false;
            }
        }
    }
    //纯数字不可以
    flag = /^[0-9]+$/.test(realName);
    if (flag) {
        return false;
    }

    if (realName.length < 2) {
        return false;
    }

    flag = /^[A-Za-z0-9·.\u4e00-\u9FFF\uf979\ue863\u4dae\s*]+$/.test(realName)
    if (!flag) {
        return flag
    }
    //纯中文不能大于5
    flag = /^[\u4e00-\u9FFF\uf979\ue863\u4dae]+$/.test(realName);
    if (flag && realName.length >= 5) {
        return false;
    }

    return true;
}

function loadJsBridgeByUa(ua) {
    var load = true;
    if (ua.indexOf("keTang") > -1) {
        load = false;
    }
    return load;
}

function isXXTPC(ua) {
    return ua.indexOf("com.chaoxing.cxstudy") > -1 && ua.indexOf("_pc_") > -1;
}

/**
 * 判断是否包含指定参数，以及指定的值
 */
function getURLQuery(param) {
    var url = window.location.href;
    var regex = new RegExp('[?&]' + encodeURIComponent(param) + '=([^&]*)');
    var match = url.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
}
