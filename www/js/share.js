

function clientinit() {
    ws = new WebSocket("ws://" + ClientServerUrl + "/bet");
    ws.onopen = function () {
        ws.send(JSON.stringify({
            type: "login",
            nameid: $("#ServerUserId").val(),
            name: $("#ServerUserName").val()
        }));
    };
    ws.onmessage = function (e) {
        var t, n, i, a = JSON.parse(e.data);
        if (a.type == "ping") {
            ws.send(JSON.stringify({
                type: "pong",
                nameid: $("#ServerUserId").val(),
                name: $("#ServerUserName").val()
            }));
            return
        } else if (a.type == "login") {
            alert("系统维护或者你的帐号在其他地方登录！"),
            logout1();
            layer.closeAll();
        }else if(a.type==$("#cpbm").val() && a.type!=40){
    		setCpqhKjhm(a.context);
    		getCpqhAndTime1($("#cpbm").val());
        }else if(a.type==40){
        	var cpbm = $("#cpbm").val();
        	if(cpbm==40){
            	getCpqhAndTime(cpbm);
        	}
        }else if(a.type==400){
        	setLhcWfpl3(a.context);
        }else if (a.type == "cztx") {
            tips.alertNoShade(a.context);
        }else if (a.type == "hyxx") {
            tips.alertNoShadeNoTime(a.context);
        }else if(a.type==500){
        	tips.alertNoShade(a.context);
        	//页面层
        	var myAuto1 = document.getElementById('audio1'); 
        	myAuto1.currentTime = 0;
            myAuto1.play();  
            setTimeout(function(){
            	myAuto1.pause();
            },4000);
        }
    };
    ws.onclose = function () {
//    	console.log(ws.readyState);
    	if(ServerUserId != ''){
            setTimeout("clientinit()", 10000);
    	}
    };
    ws.onerror = function () {};
}

function webSeocketClose(){
	if(ws != undefined && ws != null && ws != ''){
		ws.close(); //发起断连请求
	}
};


function setLhcWfpl3(context){
//	console.log(context);
	var arrays = context.split("|");
	var wfid = arrays[0];
	var wfpl = arrays[1];
	var wfpl2 = arrays[2];
	var wfids = wfid.split(",");
	for(var i=0;i<wfids.length;i++){
		$("#"+wfids[i]).html(wfpl);
		if(wfpl2!=undefined || wfpl2 != ''){
			$("#"+wfids[i]).attr("wfpl2",wfpl2);
		}
	}
}

/*
function home_hash_changed(e) {
	//alert(e);
    var t, n, i, a, r;
    e || (e = "hall"),
    e = e.toLowerCase();
    var s = "home",
        o = e,
        l = $("#window-option");
    l.show().next().removeClass("ub-index");
    switch (e) {
        case "hall":
            l.hide().next().addClass("ub-index");
            break;
        case "fail":
            s = "regist";
            break;
        case "success":
            s = "regist";
            break;
        case "lotterys":
            s = "Lottery";
            break;
        case "award":
            s = "award";
            break;
        case "activity":
            s = "activity";
            break;
        case "trend":
            s = "trend"
        }
    t = null,
    e.startWith("regist") && (s = "regist"),
    e.startWith("awarddetail/") && (s = "award", o = "award"),
    n = !1,
    e.startWith("member") ? (n = !0, s = "member") : e.startWith("helper") && (s = "helper"),
    i = ["cqssc.do", "tjc", "pl3", "fc3d", "sd11x5", "klpk", "pk10", "jlk3", "jsk3", "wfc", "kck3", "kcjs3d", "ggc", "xjssc", "gxk3", "ahk3", "hubk3", "hebk3", "shk3", "yfc", "gd11x5", "jx11x5", "sh11x5", "hlj11x5"],
    _.contains(i, e) && (s = "ssc", o = "lotterys"),
    e.indexOf("trend-") != -1 && (s = "trend", o = "trend", t = e.replace("trend-", ""), e = "Detail"),
    a = {
            partial: 1
        },
    //SetHeaderMenu(o);
    var u = $("body"),
        c = $("#loading-page"),
        d = s == "ssc" || s == "trend";
       // d = s == "bet" || s == "trend";
    d 
    //&& gl.loadingPage.show(),
    //r = "/{0}/{1}".replaceFormat([s, e]),
    console.log(e)
    r = "/cpqWeb/{0}/{1}".replaceFormat([s, e]),
    t && (r = r + "/" + t),
    e = e.split("?")[0],
    $.ajax({
            type: "GET",
            url: r,
            async: !1,
            data: a,
            beforeSend: function () {
                u.css("cursor", "wait").attr("title", "系统正为你奋力加载中..."),
                s == "member" && u.tpuiLoading("_show")
            },
            complete: function () {
                u.css("cursor", "default").attr("title", ""),
                _.delay(function () {
                    s == "member" && u.tpuiLoading("_hide"),
                    gl.loadingPage.hide()
                }, 500)
            },
            success: function (t) {
                var i, a, r, o, l, c, d, h;
                t == "ajax_login" ? (_alert("您的登录已失效，请重新登录！登录失效的原因可能有：1.在其他地方登录;2.当前IP改变; 3.网络不稳定."), location.href = "/") : (gl.$noticeList && gl.$noticeList.tpuiMarquee("_destroy"), $("#tmpDialogWrap").empty(), unloadEveryTimeObjs(), i = $("#memberSideBarId"), a = $("#memberSideBarContainer"), unbindGlobalEvents(), n ? (i.is(":visible") ? i.find("subContainerId").html(t) : ($("subContainerId").html("").append('<div class="main" id="content"></div>'), i.appendTo("#content").show().find("subContainerId").html(t), delete t), r = e, _.contains(["memberagentbetrecord", "memberagentagbetrecord", "memberagentfunddetail", "memberagentrechargerecord", "memberagentwithdrawrecord"], e) ? r = "memberagentusermanager" : _.contains(["MemberAgentApplyOpenAccount".toLowerCase(), "MemberAgentApplyLinkManage".toLowerCase()], e) && (r = "memberagentapplylink"), r.startWith("membertraceorderdetail") || (o = $("#user-menu ul>li ul>li"), o.removeClass("active"), l = o.filter("." + r), l.addClass("active")), c = $("#user-menu"), d = c.find("a[href='#" + r + "']").closest("li.tp-ui-menu-sub-group"), c.find("li.tp-ui-menu-sub-group.tp-ui-active").removeClass("tp-ui-active").find("div.tp-ui-menu-submenu").hide(), d.hasClass("tp-ui-active") || d.addClass("tp-ui-active").find("div.tp-ui-menu-submenu").show()) : (a.find("#memberSideBarId").length <= 0 && (i.find(".mainbody").html(""), i.hide().appendTo(a)), t = s == "bet" ? t : '<div class="main" id="content">' + t + "</div>", $("#subContainerId").html(t), delete t), h = $("#nav-toggle-handle"), e == "ggc" ? u.attr("class", "userbg-ggc") : u.attr("class", ""), s == "bet" ? h.show() : (h.hide(), h.hasClass("active") && h.click()), s == "bet" ? (gl.isDebug ? $("title").html("(测试) " + gl.lotteryName + " - " + gl.webName) : $("title").html(gl.lotteryName + " - " + gl.webName), e == "ggc" ? ($("#footer >div").hide(), $("#backtop").show().next().show()) : $("#footer >div").show()) : gl.title && (gl.lotteryId = 0, gl.title.indexOf(gl.webName) == -1 && (gl.title += " - " + gl.webName), gl.isDebug ? $("title").html("(测试) " + gl.title) : $("title").html(gl.title)), (s == "bet" || e == "memberrecharge" || e == "memberwithdraw") && gl.hadConect == 0 && setTimeout(function () {
                    gl.hadConect = 1
                }, 1e3))
            },
            error: function (e) {
                e.status == 500 || e.status == 403,
                console.log(e)
                //window.location.href = "/"
            }
        })
}
*/


String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "")
},
String.prototype.trimAll = function () {
    return this.replace(/\s*/g, "")
},
String.prototype.replaceFormat = function (e) {
    var t = /{(\d+)}/gm;
    return this.replace(t, function (t, n) {
        return e[~~n]
    })
},
String.prototype.replaceAll = function (e, t) {
    return this.replace(new RegExp(e, "gm"), t)
},
String.prototype.startWith = function (e) {
    return typeof e != "string" ? !1 : this.indexOf(e) == 0
},
String.prototype.endWith = function (e) {
    if (typeof e != "string") return !1;
    var t = this.length - e.length;
    return t >= 0 && this.lastIndexOf(e) === t
},
String.prototype.getLastString = function (e) {
    return this.substr(this.length - e)
},
String.prototype.toArray = function () {
    for (var e = [], t = 0; t < this.length; t++) e.push(this[t]);
    return e
},
String.prototype.IsPassStrong = function () {
    return this.length < 6 ? !1 : this.match(/^\d+$/) ? !1 : this.match(/^[A-Za-z]+$/) ? !1 : !0
},
String.prototype.sortAsc = function () {
    return this.toArray().sort().join("")
},
String.prototype.sortDesc = function () {
    return this.toArray().sort().reverse().join("")
},
String.prototype.maxShow = function (e, t) {
    if (e = e || 20, t) {
        var n = parseInt(e / 2);
        return this.length > e ? this.substr(0, n - 1) + "..." + this.substr(this.length - (e - n - 1)) : this
    }
    return this.length > e ? this.substr(0, e - 2) + "..." : this
},
String.prototype.toSingleSep = function (e) {
    for (var t = this.split(e), n = [], i, a = 0; a < t.length; a++) i = t[a],
    i != "" && n.push(i);
    return n.join(e)
}
//Number.prototype.toFixedNum = function (e) {
//    return parseFloat(this.toFixed(e))
//},
//Array.prototype.each = function (e) {
//    for (var t = 0; t < this.length; t++) if (e(this[t], t) == !1) break;
//    return this
//},
//Array.prototype.where = function (e) {
//    var t = [];
//    return this.each(function (n, i) {
//        e(n, i) == !0 && t.push(n)
//    }),
//    t
//},
//Array.prototype.first = function () {
//    return this.length == 0 ? null : this[0]
//},
//Array.prototype.last = function () {
//    return this.length == 0 ? null : this[this.length - 1]
//},
//Array.prototype.take = function (e) {
//    for (var t = [], n = 0; n < e; n++) t.push(this[n]);
//    return t
//},
//Array.prototype.skip = function (e) {
//    for (var t = [], n = e; n < this.length; n++) t.push(this[n]);
//    return t
//},
//Array.prototype.dive = function (e) {
//    for (var t = [], n = 0; n < this.length; n++) e.indexOf(this[n]) == -1 && t.push(this[n]);
//    return t
//},
//Array.prototype.distinct = function () {
//    for (var e = {}, t = [], n = this.length, i, a, r = 0; r < n; r++) i = this[r],
//    a = typeof i + i,
//    e[a] === undefined && (t.push(i), e[a] = 1);
//    return t
//},
//Array.prototype.select = function (e) {
//    var t = [];
//    return this.each(function (n, i) {
//        e(n, i) && t.push(n)
//    }),
//    t
//},
//Array.prototype.remove = function (e) {
//    var t = [],
//        n;
//    return this.each(function (n, i) {
//            e(n, i) && t.push(i)
//        }),
//    n = this,
//    t.reverse().each(function (e) {
//            n.splice(e, 1)
//        }),
//    n
//},
//Array.prototype.removeElement = function (e) {
//    return this.remove(function (t) {
//        return t == e
//    })
//},
//Array.prototype.removeAt = function () {
//    return this.remove(function (e, t) {
//        return t == t
//    })
//},
//Array.prototype.indexOf = function (e) {
//    var t = -1;
//    return this.each(function (n, i) {
//        if (n == e) return t = i,
//        !1
//    }),
//    t
//},
//Array.prototype.contain = function (e) {
//    return this.indexOf(e) >= 0
//},
//DateFormatStr = {
//    dateTime1: "YYYY-MM-DD hh:mm:ss",
//    dateTime2: "YYYY/MM/DD hh:mm:ss",
//    dateTime3: "MM-DD hh:mm:ss",
//    longDate: "YYYY/MM/DD",
//    shortDate: "YY/M/D",
//    longTime: "hh:mm:ss",
//    shortTime: "h:m:s",
//    isoDate: "YYYY-MM-DD",
//    isoTime: "hh:mm:ss",
//    isoDateTime: "YYYY-MM-DD'T'hh:mm:ss",
//    isoUtcDateTime: "UTC:YYYY-MM-DD'T'hh:mm:ss'Z'"
//},
//Date.prototype.Format = function (e) {
//    var t = e,
//        n = ["日", "一", "二", "三", "四", "五", "六"];
//    return t = t.replace(/yyyy|YYYY/, this.getFullYear()),
//    t = t.replace(/yy|YY/, this.getYear() % 100 > 9 ? (this.getYear() % 100).toString() : "0" + this.getYear() % 100),
//    t = t.replace(/MM/, this.getMonth() > 8 ? (this.getMonth() + 1).toString() : "0" + (this.getMonth() + 1).toString()),
//    t = t.replace(/M/g, this.getMonth() + 1),
//    t = t.replace(/w|W/g, n[this.getDay()]),
//    t = t.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate()),
//    t = t.replace(/d|D/g, this.getDate()),
//    t = t.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : "0" + this.getHours()),
//    t = t.replace(/h|H/g, this.getHours()),
//    t = t.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : "0" + this.getMinutes()),
//    t = t.replace(/m/g, this.getMinutes()),
//    t = t.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : "0" + this.getSeconds()),
//    t = t.replace(/s|S/g, this.getSeconds())
//},
//Date.prototype.DateAdd = function (e, t) {
//    var n = this;
//    switch (e) {
//    case "sec":
//        return new Date(Date.parse(n) + 1e3 * t);
//    case "min":
//        return new Date(Date.parse(n) + 6e4 * t);
//    case "hour":
//        return new Date(Date.parse(n) + 36e5 * t);
//    case "day":
//        return new Date(Date.parse(n) + 864e5 * t);
//    case "week":
//        return new Date(Date.parse(n) + 6048e5 * t);
//    case "qua":
//        return new Date(n.getFullYear(), n.getMonth() + t * 3, n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds());
//    case "month":
//        return new Date(n.getFullYear(), n.getMonth() + t, n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds());
//    case "year":
//        return new Date(n.getFullYear() + t, n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds())
//    }
//    return undefined
//}


