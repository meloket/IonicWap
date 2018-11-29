//window.alert = function(name) {
//	var iframe = document.createElement("IFRAME");
//	iframe.style.display = "none";
////	iframe.setAttribute("src", 'data:text/plain,');
//	document.documentElement.appendChild(iframe);
//	window.frames[0].window.alert(name);
//	iframe.parentNode.removeChild(iframe);
//}
//
//window.confirm = function(message) {
//	var iframe = document.createElement("IFRAME");
//	iframe.style.display = "none";
////	iframe.setAttribute("src", 'data:text/plain,');
//	document.documentElement.appendChild(iframe);
//	var alertFrame = window.frames[0];
//	var result = alertFrame.window.confirm(message);
//	iframe.parentNode.removeChild(iframe);
//	return result;
//};

// ///////////////////////////////公共部分///////////////////////////////////////////
var mark = 0;

function commoninit(){
	response();//rem适配
	window.onresize = function () {
		response();
	};
	
	//侧滑
	menuFn();
	//遮罩层
	$('.loading-wrapper').fadeOut();
	window.clearInterval(onetime);//关掉定时器
	window.clearInterval(boxtime);//关掉定时器
	menu.init();
	foot.init();
	head.init();
}
/**
 * 侧滑
 */
function menuFn(){   
	var dd = 0;
    $('.menu_open').bind('click',function(e) {
        if ($('#container').hasClass('pull') == false) {
            if (dd == 0) {
                $('#container,#menu,#header,#us_panel,#us_panel1,#container1').addClass('push');
                dd = 1;
                $('#container,#header,#us_panel,#us_panel1,#container1').bind('touchmove',
                function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                });
                //$('#us_panel').addClass('hide');
            } else {
                $('#container,#menu,#header,#us_panel,#us_panel1,#container1').removeClass('push');
                dd = 0;
                $('#container,#header,#us_panel').unbind('touchmove');
            };
        }
        return false;
    });
	
	$('body').click(function() {
        $('#container,#menu,#header,#us_panel,#us_panel1,#container1').removeClass('push');
		 dd = 0;
        $('#container,#header,#us_panel,#us_panel1,#container1').unbind('touchmove');
    });
}


// rem适配
function response() {
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var deviceWidth = document.documentElement.clientWidth;
			document.documentElement.style.fontSize = 20 * (deviceWidth / 640) + '%';
		};
	if (!document.addEventListener) return;
	window.addEventListener(resizeEvt, recalc, false);
	document.addEventListener('DOMContentLoaded', recalc, false);
}


/**
 * 遮罩层打开
 */
function load_open() {
	layer.load(1, {
		shade: [0.4,'#fff'] //0.1透明度的白色背景
	});
}
/**
 * 遮罩层关闭
 */
function load_close(){
	layer.closeAll();
}

$(function() {
	pushHistory();
	window.addEventListener("popstate", function(e) {
		pushHistory();
	}, false);
	function pushHistory() {
		var state = {
			title : "title",
			url : "#"
		};
		window.history.pushState(state, "title", "#");
	}
});


//////////////////////////////主页js内容//////////////////////////////////////
/**
 * main 主页初始化
 */
function maininit(){
	slide();// banner触屏滑动
	//定时器
	$(".cptime1").each(function(k,v){
		var lottery = $(this).attr("data-lottery");
		//_countTime(lottery);
		findLoteryTime(lottery);
	});
	mainBtnInit();//主页按钮初始化
	
	getNotice1();
}

function getNotice1(){
	$.ajax({
		url : "lottery/getNotice.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="4"){
				$("#noticeContent").empty();
				$("#noticeContent").append(data.message);
				$("#noticeContent span").click(function() {
					layer.alert($.trim($(this).attr("content")));
				});
			}
		},
		error : function(x, h, e) {
			
		}
	});
}

var secObj = new Object();

function  findLoteryTime (lottery){
	window.clearTimeout( secObj[lottery]);
	var sec = parseInt($(".time-"+lottery).attr("data-sec")); 
	//secObj[lottery] = sec;
	var c = 0;

	$.post("lottery/findTime.do",{"lottery" : lottery}, function (data) {
		if(typeof data!='undefined') {
		  var obj = JSON.parse(data);
			sec = parseInt(obj.CTIME);
			if(sec<=0 || (isNaN(sec)&&c<3)) {
				//setTimeout(findLoteryTime(lottery),2000);
				c++;
			}else{
				_countTime1(sec,lottery);
			}
		}
	});
}

function  _countTime1(sec,lottery){
	$(".time-"+lottery).attr("data-sec",sec);
	$(".time-"+lottery).html(ftime(sec));
	
	
	if(sec<=0 || isNaN(sec)) {
		findLoteryTime (lottery);
	}else{
		sec--;
		secObj[lottery] = setTimeout("_countTime1('"+sec+"','"+lottery+"')",1000);
	}
}


function _countTime(lottery){
	//var sec = parseInt($(".time-"+lottery).attr("data-sec"));
//	console.log(sec);
	if(sec<=0 || isNaN(sec)) {
//		console.log(lottery);
//		$.post("lottery/findTime.do",{"lottery" : lottery}, function (data) {
//			if(typeof data!='undefined') {
//			  var obj = JSON.parse(data);
//				sec = parseInt(obj.CTIME);
//			}
//		});
	}
	sec --;
	$(".time-"+lottery).attr("data-sec",sec);
	$(".time-"+lottery).html(ftime(sec));
	
	setTimeout("_countTime('"+lottery+"')",1000);
}
var ftime = function(t){
	if(t<=0) return "开奖...";
	var h = Math.floor(t/3600);
	var m = Math.floor((t-3600*h)/60);
	var s = t%60;
	return  (h>0 ? (h<10 ? "0"+h : h)+":" : "")+(m<10 ? "0"+m : m)+ ":"+(s<10 ? "0"+s : s);
};

// banner触屏滑动
function slide() {
	if(document.getElementById('slideBox')) {
		TouchSlide({
			slideCell : "#slideBox",
			titCell : ".hd ul", // 开启自动分页 autoPage:true ，此时设置 titCell
			mainCell : ".bd ul",// 为导航元素包裹层
			effect : "leftLoop",
			interTime: 4000,
			autoPage : true,// 自动分页
			autoPlay : true// 自动播放
		});
	}
}

/**
 * 主页按钮初始化
 */
function clickLettoryBtn(lottery){
	mark = lottery;
	load_open();
	$.post("lottery/findOneLottery.do",{"lottery" : lottery},function (data) {
		load_close();
		if(data.message==1){
			layer.alert("维护中...");
		}else{
			$("#subContentId").html(data.message);
			getHyje();//得到金额
			commoninit();//公共部分初始化
			if(data.status=="6"){
				getloginpage();
			}else{
				if(lottery=="more"){
		  	  		moreLotterinit();//更多彩种初始化
		  		}else{
		  			lotteryCommonInit();//彩票公共初始化
					lotteryDateInit();
		  		}
			}
		}
	}, "json");
}

/**
 * 彩票按钮
 */
function lotteryBtn(){
	$(".kd-game").on("click",function(){
		var lottery = $(this).find(".cptime1").attr("data-lottery");
		getintoLottery(lottery);
	});
	
	$("#refresh").on("click",function(){
		load_open();
		lotteryDateInit();
		load_close();
	});
}

function getintoLottery(lottery){
	load_open();
	$.post("lottery/findOneLottery.do",{"lottery" : lottery},function (data) {
		load_close();
		if(data.message==1){
			layer.alert("维护中...");
		}else{
			if(data.status=="4"){
				$("#subContentId").html(data.message);
				getHyje();//得到金额
				commoninit();//公共部分初始化
				lotteryCommonInit();//彩票公共初始化
				lotteryDateInit();
			}else if(data.status=="6"){
				getloginpage();
			}
		}
	}, "json");
}

function signin(){
	$.post("lottery/signin.do",function (data) {
		tips.signinAlert(data.message);
	}, "json");
}

/**
 * 主页按钮初始化
 */
function mainBtnInit(){
	//充值
	$("#cz").on("click",function(){
		$.ajax({
			url : "lottery/cztx.do",
			type : "POST",
			dataType : "json",
			success : function(data) {
				if(data.status=="6"){
		  			getloginpage();
		  			load_close();
		  		}else if(data.status=="1"){
		  			load_close();
		  			alert(data.message);
		  		}else{
		  			$("#subContentId").empty();
		  	  		$("#subContentId").append(data.message);
		  	  		commoninit();
		  	  		zjgl.cztx.init();
		  	  		load_close();
		  		}
			},
			error : function(x, h, e) {
				load_close();
			}
		});
	});
	//提现
	$("#tx").on("click",function(){
		$.ajax({
			url : "lottery/cztx.do",
			type : "POST",
			dataType : "json",
			success : function(data) {
				if(data.status=="6"){
		  			getloginpage();
		  			load_close();
		  		}else if(data.status=="1"){
		  			load_close();
		  			alert(data.message);
		  		}else{
		  			$("#subContentId").empty();
		  	  		$("#subContentId").append(data.message);
		  	  		commoninit();
		  	  		zjgl.cztx.init();
		  	  		$("#container1 ul li").removeClass("router-link-exact-active");
		  	  		$("#container1 ul li").removeClass("active");
		  	  		$("#container1 ul li").eq(1).addClass("router-link-exact-active");
		  	  		$("#container1 ul li").eq(1).addClass("active");
		  	  		$("#cz1").hide();
		  	  		$("#tx1").show();
		  	  		load_close();
		  		}
			},
			error : function(x, h, e) {
				load_close();
			}
		});
	});
	
	
	//注册
	$("#register").on("click",function(){
		$.post("lottery/registerpage.do",function (data) {
			$("#subContentId").html(data);
	  		commoninit();
	  		registerpage.init();
		});
	});
	
	//签到
	$("#zy-qd").on("click",function(){
		signin();
	});
	
	//试玩
	$("#freeTrail").on("click",function(){
		$.post("lottery/freeTrail.do",function (data) {
			if(data.status=="4"){
				var obj = JSON.parse(data.message);
		  		$("#ServerUserId").val(obj.hybm==null?'':obj.hybm);
		  		$("#ServerUserName").val(obj.hymc==null?'':obj.hymc);
		  		if($("#ServerUserId").val()!=''){
		  			clientinit();
		  		}
				$("#right-ye").attr("login", "1");
		  		$("#right-ye").html('<img src="mobil2/images/vip.png" style="float:right;margin-top:8px;"/><em style="text-align: left;float: left;font-style: normal; font-size: 14px;line-height: 21px;">余额<br/>2000</em>');
		  		tips.loginAlert();
		  		$("#register").hide();
		  		$("#freeTrail").hide();
		  		$("#cz").show();
		  		$("#tx").show();
			}else{
				alert("试玩失败");
			}
		}, "json");
	});
	
	//客服
	$("#kf").on("click",function(){
		load_open();
		getKf();
	});
	
	$("ul#headerImageContent li").on("click",function(){
		var isevent = $(this).attr("isevent");
		if(isevent==1){
			load_open();
			getYhhd();
		}
	});
}

//查询会员金额
function getHyje(){
	$.post("lottery/getHyje.do",function (data) {
		$("#zhzje").html(data);
	});
}

//各种提示信息
var tips = {
		//登录提示
		loginAlert : function(){
			layer.open({
	            type: 1,
	            skin: "role_btn9",
	            area:'90%',
	            shadeClose: true,
	            content: $("#zysw_box"),
	            time : 3000
	        });
		},
		//签到提示
		signinAlert : function(message){
			$("#signinAlert span").html(message);
			layer.open({
	            type: 1,
	            skin: "role_btn9",
	            area:'90%',
	            shadeClose: true,
	            content: $("#signinAlert"),
	            time : 3000
	        });
		},
		//提示注册
		registerAlert : function(){
			layer.open({
	            type: 1,
	            skin: "role_btn9",
	            area:'90%',
	            shadeClose: true,
	            content: $("#registerAlert"),
	            time : 3000
	        });
		},
		alert : function(message, time){
			if(time==undefined){
				time = 3000;
			}
			$("#content").html(message);
			layer.open({
	            type: 1,
	            skin: "role_btn9",
	            area:'90%',
	            shadeClose: true,
	            content: $("#alert"),
	            time : time
	        });
		},
		alertNoShade : function(message){
			$("#xxp").text(message);
			layer.open({
				type : 1,
				skin : 'role_btn16', // 样式类名
				title : '',
				area : 'auto',
				closeBtn : 0, // 不显示关闭按钮
				time : 6000,
				shade : 0,
				offset: '50px',
				content : $("#xx")
			});
		},
		alertNoShadeNoTime : function(message){
			$("#xxp").text(message);
			layer.open({
				type : 1,
				skin : 'role_btn16', // 样式类名
				title : '',
				area : 'auto',
				closeBtn : 1, // 不显示关闭按钮
				shade : 0,
				offset: '50px',
				content : $("#xx")
			});
		}
};

/*
 * 登录页
 */
var loginpage = {
		init : function(){
			/*
			 * 登录
			 */
			$("#login").on("click", function(){
				if(!loginpage.validation()){
					return;
				}
				load_open();
				$.ajax({
					url : "lottery/login.do",
					data:{"hydlmc":$("#username").val(),"hymm":$("#password").val()},
					type : "POST",
					dataType : "json",
					success : function(data) {
						load_close();
						if(data.status=="4"){
							var obj = JSON.parse(data.message);
					  		$("#ServerUserId").val(obj.hybm==null?'':obj.hybm);
					  		$("#ServerUserName").val(obj.hymc==null?'':obj.hymc);
					  		if($("#ServerUserId").val()!=''){
					  			clientinit();
					  		}
							if(mark==0){//首页
								index(1);
							}else if(mark==2){//资金管理
								load_open();
								getCztxInFooter();
							}else if(mark==3){//我的地盘
								wddp();
							}else if(mark==31){//代理推广
								load_open();
								getDltg();
							}else if(mark==32){//下注记录
								load_open();
								getXzjl();
							}else if(mark==33){//消息记录
								load_open();
								getXxjl();
							}else{
								clickLettoryBtn(mark);
							}
						}else if(data.status=="1"){
							alert(data.message);
						}
					},
					error : function(x, h, e) {
						
					}
				});
			});
			
			/*
			 * 马上注册
			 */
			$("#register").on("click", function(){
				$.post("lottery/registerpage.do",function (data) {
					$("#subContentId").html(data);
			  		commoninit();
			  		registerpage.init();
				});
			});
			
			/*
			 * 免费试玩
			 */
			$("#freeTrail").on("click", function(){
				$.post("lottery/freeTrailPage.do",function (data) {
					var obj = JSON.parse(data.message);	
					if(data.status=="4"){
						$("#ServerUserId").val(obj.hybm==null?'':obj.hybm);
						$("#ServerUserName").val(obj.hymc==null?'':obj.hymc);
						if($("#ServerUserId").val()!=''){
							clientinit();
						}
					    if(mark==0){//首页
							index();
						}else if(mark==2){//资金管理
							load_open();
							getCztxInFooter();
						}else if(mark==3){//我的地盘
							wddp();
						}else if(mark==31){//代理推广
							load_open();
							getDltg();
						}else if(mark==32){//下注记录
							load_open();
							getXzjl();
						}else if(mark==33){//消息记录
							load_open();
							getXxjl();
						}else{
							clickLettoryBtn(mark);
						}
					    tips.loginAlert();
					}
				}, "json");
			});
			
			/*
			 * 找回密码
			 */
			$("#wjmm").on("click", function(){
				load_open();
				getWjmm();
			});
			
			$("footer li").removeClass("active");
		},
		validation : function(){
			if($("#username").val()==""){
				tips.alert("用户名不能为空");
				return false;
			}
			if($("#password").val()==""){
				tips.alert("密码不能为空");
				return false;
			}
			return true;
		},
		//忘记密码
		wjmm : {
			init : function(){
				$("#back, .kd-button.hollow").on("click", function(){
					getloginpage();
				});
				
				/*
				 * 重新加载验证码
				 */
				$("#checkcodeImage").on("click", function(){
					$(this).attr("src", "zhmm/getCheckcodeImage.do?"+Math.random());
				});
				
				$("#next1").on("click", function(){
					if(loginpage.wjmm.validation1()){
						$.ajax({
							url : "lottery/wjmm1.do",
							type : "POST",
							data : {hydlmc : $("#username").val(), checkcode : $("#checkcode").val()},
							dataType : "json",
							success : function(data) {
								if(data.status=="4"){
									var obj = JSON.parse(data.message);
									if(obj.aqwt1!=undefined){
										$("#aqwt").append('<label class="kd-field-title" style="margin-bottom:5px;">'+
												 obj.aqwt1 +
												 '</label>'+
												 '<label class="kd-field-title">答案</label>'+
												 '<div class="kd-textinput text"><input type="text" id="aqwt1da" placeholder="请输入您设定的安全问题答案"></div>');
										loginpage.wjmm.aqwt = 1;
									}else{
										$("#aqwt").append('<label class="kd-field-title" style="font-weight: 700; color: red;font-size:14px;">您没有设置安全问题，无法通过安全问题找回密码！</label>');
										$("#next2").hide();
										loginpage.wjmm.aqwt = 0;
									}
									if(obj.email==undefined){
										$("#email").append('<label class="kd-field-title" style="font-weight: 700; color: red;font-size:14px;">您没有设置邮箱，无法通过邮箱找回密码！</label>');
										loginpage.wjmm.email = 0;
									}else{
										loginpage.wjmm.email = 1;
									}
									$("#checkcodeImage2").attr("src", "zhmm/getCheckcodeImage.do?"+Math.random());
									$("#step1").hide();
									$("#step2").show();
								}else{
									tips.alert(data.message);
								}
							},
							error : function(x, h, e) {
								
							}
						});
					}
				});
				
				$("#next2").on("click", function(){
					if(loginpage.wjmm.validation2()){
						$.ajax({
							url : "lottery/wjmm2.do",
							type : "POST",
							data : {type : $("#type").val(), aqwt1da : $("#aqwt1da").val(), checkcode : $("#checkcode2").val()},
							dataType : "json",
							success : function(data) {
								if(data.status=="4"){
									$("#checkcodeImage3").attr("src", "zhmm/getCheckcodeImage.do?"+Math.random());
									$("#step2").hide();
									$("#step3").show();
									if($("#type").val()=="2"){
										$("#emailcode").show();
									}else{
										$("#emailcode").hide();
									}
									tips.alert(data.message);
								}else if(data.status=="6"){
									getloginpage();
									tips.alert(data.message);
								}else{
									tips.alert(data.message);
								}
							},
							error : function(x, h, e) {
								
							}
						});
					}
				});
				
				$("#checkcodeImage2").on("click", function(){
					$(this).attr("src", "zhmm/getCheckcodeImage.do?"+Math.random());
				});
				
				$("#type").on("change", function(){
					$("#aqwt").toggle();
					$("#email").toggle();
					if($(this).val()=="1"){
						if(loginpage.wjmm.aqwt==0){
							$("#next2").hide();
						}else{
							$("#next2").show();
						}
					}else{
						if(loginpage.wjmm.email==0){
							$("#next2").hide();
						}else{
							$("#next2").show();
						}
					}
				});
				
				$("#next3").on("click", function(){
					if(loginpage.wjmm.validation3()){
						$.ajax({
							url : "lottery/wjmm3.do",
							type : "POST",
							data : {np1 : $("#np1").val(), np2 : $("#np2").val(), type : $("#type").val(), emailcode : $("#emailcode").val(), checkcode : $("#checkcode3").val()},
							dataType : "json",
							success : function(data) {
								if(data.status=="4"){
									if(mark==0){//首页
										index(1);
									}else if(mark==2){//资金管理
										load_open();
										getCztxInFooter();
									}else if(mark==3){//我的地盘
										wddp();
									}else if(mark==31){//代理推广
										load_open();
										getDltg();
									}else if(mark==32){//下注记录
										load_open();
										getXzjl();
									}else if(mark==33){//消息记录
										load_open();
										getXxjl();
									}else{
										clickLettoryBtn(mark);
									}
								}else if(data.status=="6"){
									getloginpage();
									tips.alert(data.message);
								}else{
									tips.alert(data.message);
								}
							},
							error : function(x, h, e) {
								
							}
						});
					}
				});
				
				$("#checkcodeImage3").on("click", function(){
					$(this).attr("src", "zhmm/getCheckcodeImage.do?"+Math.random());
				});
				
				$("footer li").removeClass("active");
			},
			validation1 : function(){
				if($("#username").val().trim()==""){
					tips.alert("账号不能为空");
					return false;
				}
				if($("#checkcode").val().trim()==""){
					tips.alert("验证码不能为空")
					return false;
				}
				return true;
			},
			validation2 : function(){
				if($("#checkcode2").val().trim()==""){
					tips.alert("验证码不能为空")
					return false;
				}
				return true;
			},
			validation3 : function(){
				var reg = /^\w{6,20}$/;
				if(!reg.test($("#np1").val())){
					tips.alert("密码格式不正确");
					return false;
				}
				if($("#np1").val()!=$("#np2").val()){
					tips.alert("两次密码不一致");
					return false;
				}
				if($("#checkcode3").val().trim()==""){
					tips.alert("验证码不能为空")
					return false;
				}
				return true;
			},
			aqwt : 1,
			email : 1
		}
};

/*
 * 注册页
 */
var registerpage = {
		init : function(){
			/*
			 * 开户条约
			 */
			$("#readRule").on("click", function(){
				layer.open({
					type: 1,
					skin: "role_btn5",
					title: '规则条例及隐私声明',
					area:'90%',
					shadeClose: true,
					content: $("#rule")
				});
			});
			
			/*
			 * 马上注册
			 */
			$("#register").on("click", function(){
				if(!$("#checkboxFiveInput1").prop("checked")){
					tips.alert("请勾选开户条约");
					return;
				}
				if(!registerpage.validation()){
					return;
				}
				load_open();
				$.ajax({
					url : "lottery/register.do",
					data:{"hydlmc":$("#hydlmc").val(),"hymm":$("#hymm").val(),"qq":$("#qq").val()},
					type : "POST",
					dataType : "json",
					success : function(data) {
						load_close();
						if(data.status=="4"){
							var obj = JSON.parse(data.message);
					  		$("#ServerUserId").val(obj.hybm==null?'':obj.hybm);
					  		$("#ServerUserName").val(obj.hymc==null?'':obj.hymc);
					  		if($("#ServerUserId").val()!=''){
					  			clientinit();
					  		}
							if(mark==0){//首页
								index();
							}else if(mark==2){//资金管理
								load_open();
								getCztxInFooter();
							}else if(mark==3){//我的地盘
								wddp();
							}else if(mark==31){//代理推广
								load_open();
								getDltg();
							}else if(mark==32){//下注记录
								load_open();
								getXzjl();
							}else if(mark==33){//消息记录
								load_open();
								getXxjl();
							}else{
								clickLettoryBtn(mark);
							}
							tips.loginAlert();
						}else if(data.status=="1"){
							load_close();
							layer.alert(data.message);
						}
					},
					error : function(x, h, e) {
						
					}
				});
			});
			
			/*
			 * 立即登录
			 */
			$("#login").on("click", function(){
				getloginpage();
			});
			
			$("footer li").removeClass("active");
		},
		validation : function(){
			var reg = /^[0-9a-zA-Z]{2,20}$/;
			if(!reg.test($("#hydlmc").val())){
				tips.alert("用户名格式不正确");
				return false;
			}
			reg = /^\w{6,20}$/;
			if(!reg.test($("#hymm").val())){
				tips.alert("密码格式不正确");
				return false;
			}
			if($("#hymm").val()!=$("#hymm1").val()){
				tips.alert("两次密码不一致");
				return false;
			}
			reg = /^\d{5,11}$/;
			if(!reg.test($("#qq").val())){
				tips.alert("QQ格式不正确");
				return false;
			}
			return true;
		}
};

/*
 * 侧边菜单
 */
var menu = {
		init : function(){
			$("#menu ul li").on("click", function(){
				$("#menu ul li").removeClass("menu_cur");
				$(this).addClass("menu_cur");
			});
			
			$("#index").on("click", function(){
				mark = 0;
				index();
			});
			
			$("#yhhd").on("click", function(){
				load_open();
				getYhhd();
			});
			
			$("#dltg1").on("click", function(){
				mark = 31;
				load_open();
				getDltg();
			});
			
			$("#xzjl1").on("click", function(){
				mark = 32;
				load_open();
				getXzjl();
			});
			
			$("#signin").on("click", function(){
				signin();
			});
			
			$("#xtxx").on("click", function(){
				mark = 33;
				load_open();
				getXxzx();
			});
		},
		yhhd : {
			init : function(){
				$("#back").on("click", function(){
					if(mark==0){//首页
						index();
					}else if(mark==2){//资金管理
						load_open();
						getCztxInFooter();
					}else if(mark==3){//我的地盘
						wddp();
					}else if(mark==31){//代理推广
						load_open();
						getDltg();
					}else if(mark==32){//下注记录
						load_open();
						getXzjl();
					}else if(mark==33){//消息记录
						load_open();
						getXxjl();
					}else{
						clickLettoryBtn(mark);
					}
				});
			}
		}
};

/*
 * 底部菜单
 */
var foot = {
		init : function(){
			$("footer ul li").on("click", function(){
				$("footer ul li").removeClass("active");
				$(this).addClass("active");
				if(typeof(member.dltg.clipboard.destroy)=='function'){
					member.dltg.clipboard.destroy();
				}
				if(typeof(clipboard1)!='undefined'){
					clipboard1.destroy();
				}
				if(typeof(clipboard1_xm)!='undefined'){
					clipboard1_xm.destroy();
				}
				if(typeof(clipboard1_zh)!='undefined'){
					clipboard1_zh.destroy();
				}
				if(typeof(clipboard2)!='undefined'){
					clipboard2.destroy();
				}
				if(typeof(clipboard2_xm)!='undefined'){
					clipboard2_xm.destroy();
				}
				if(typeof(clipboard2_zh)!='undefined'){
					clipboard2_zh.destroy();
				}
				var p = $(this).find("p").html();
				if(p=="首页"){
					mark = 0;
					index();
				}else if(p=="游戏大厅"){
					clickLettoryBtn("more");
				}else if(p=="资金管理"){
					mark = 2;
					load_open();
					getCztxInFooter();
				}else if(p=="我的地盘"){
					mark = 3;
					wddp();
				}
			});
		}
};

/*
 * 我的地盘
 */
var member = {
		//初始化
		init : function(){
			$("#dltg").on("click", function(){
				load_open();
				getDltg();
			});
			
			$("#cztx").on("click", function(){
				load_open();
				getCztx();
			});
			
			$("#xzyx").on("click", function(){
				clickLettoryBtn("more");
			});
			
			$("#xxzx").on("click", function(){
				load_open();
				getXxzx();
			});
			
			$("#xgzl").on("click", function(){
				load_open();
				getXgzl();
			});
			
			$("#yhkxx").on("click", function(){
				load_open();
				getYhkxx();
			});
			
			$("#kjjl").on("click", function(){
				layer.open({
		            type: 1,
		            skin: "role_btn",
		            title: "选择彩种",
		            area: ['100%','100%'],
		            shadeClose: true,
		            content: $("#J_pop_setting1")
		        });
			});
			
			$("#J_pop_setting1 li.kd-game").on("click", function(){
				load_close();
				load_open();
				var cpzl = $(this).attr("cpzl");
				getKjjl(5, 1, "", "", cpzl, "");
			});
			
			$("#jrzd").on("click", function(){
				load_open();
				getJrzd();
			});
			
			$("#xzjl").on("click", function(){
				load_open();
				getXzjl();
			});
			
			$("#zhls").on("click", function(){
				load_open();
				getZhls();
			});
			
			$("#gryk1").on("click", function(){
				getGryk1();
			});
			
			$("#dlyk").on("click", function(){
				getDlyk();
			});
			
			$("#logout").on("click", function(){
				logout();
			});
		},
		//代理推广
		dltg : {
			init : function(){
				member.dltg.clipboard  = new Clipboard("#copy");
				member.dltg.clipboard.on("success",function (element) {//复制成功的回调
		            tips.alert("已复制到剪切板");
		        });
				member.dltg.clipboard.on("error",function (element) {//复制失败的回调
		            tips.alert("复制失败");
		        });
				
				$('#qrcode').qrcode({width:200,height:200,correctLevel:0,text:$("#link").text()});
				var dataImg = $("canvas")[0].toDataURL('image/png');
				$("#qrcode").empty();
				$("#imgdiv").css("display", "block");
		        $("#img").prop("src", dataImg);
		        $("#save").prop("href", dataImg);
				
				$("#back").on("click", function(){
					member.dltg.clipboard.destroy();
					wddp();
				});
				
				$("#tgzx").on("click", function(){
					member.dltg.clipboard.destroy();
					$.ajax({
						url : "lottery/tgzx.do",
						type : "POST",
						dataType : "json",
						success : function(data) {
							if(data.status=="6"){
					  			getloginpage();
					  			load_close();
					  		}else if(data.status=="1"){
					  			load_close();
					  			tips.alert(data.message);
					  		}else{
					  			$("#subContentId").empty();
					  	  		$("#subContentId").append(data.message);
					  	  		commoninit();
					  	  		member.dltg.tgzx.init();
					  	  		load_close();
					  		}
						},
						error : function(x, h, e) {
							load_close();
						}
					});
				});
			},
			tgzx : {
				init : function(){
					$("#back, .continue").on("click", function(){
						load_open();
						getDltg();
					});
				}
			},
			clipboard : {}
		},
		//充值/提现
		cztx : {
			init : function(cpzl){
				member.cztx.flag = cpzl;
				
				$("#back").on("click", function(){
					clipboard1.destroy();
					clipboard1_xm.destroy();
					clipboard1_zh.destroy();
					clipboard2.destroy();
					clipboard2_xm.destroy();
					clipboard2_zh.destroy();
					if(cpzl==undefined){
						wddp();
					}else{
						getintoLottery(cpzl);
					}
				});
				
				$("#container1 ul.nostyle.account-sub-nav.kd-row-middle li").on("click", function(){
					var index = $(this).index();
					if(index==0){
						$("#container1 ul li").removeClass("router-link-exact-active");
						$("#container1 ul li").removeClass("active");
						$("#container1 ul li").eq(0).addClass("router-link-exact-active");
						$("#container1 ul li").eq(0).addClass("active");
						$("#tx1").hide();
						$("#jyjl").hide();
						$("#cz1").show();
					}else if(index==1){
						$("#container1 ul li").removeClass("router-link-exact-active");
						$("#container1 ul li").removeClass("active");
						$("#container1 ul li").eq(1).addClass("router-link-exact-active");
						$("#container1 ul li").eq(1).addClass("active");
						$("#cz1").hide();
						$("#jyjl").hide();
						$("#tx1").show();
					}else{
						getJyjl();
					}
				});
				
//				$("div.type-title.kd-container.Collapsing").on("click", function(){
//					if($(this).hasClass("current")){
//						$(this).removeClass("current");
//						$(this).next().hide();
//					}else{
//						$(this).addClass("current");
//						$("div.type-body.coll_body").hide();
//						$(this).next().show();
//					}
//				});
				$("div.Collapsing.topup_czbs").on("click", function(){
					if($(this).hasClass("current")){
						$(this).removeClass("current");
						$(this).next().hide();
						$(".kd-form .topup_czbs").removeClass("topup_top");
					}else{
						$(this).addClass("current");
						$("div.type-body.coll_body").hide();
						$(this).next().show();
						$(this).addClass("topup_top");
					}
				});
				
				$("#tx").on("click", function(){
					if(!member.cztx.validation()){
						return;
					}
					$.ajax({
						url : "lottery/getPoundage.do",
						data : {
							"txje" : $("#txje").val()
						},
						type : 'post',
						cache : false,
						dataType : 'text',
						success : function(data) {
							var money = parseFloat(data);
							if((money!=0&&confirm("将收取"+data+"元手续费，确定继续提现操作？"))||money==0){
								load_open();
								$.ajax({
									url : "lottery/tx.do",
									data : {
										"txje" : $("#txje").val(),
										"hyzfmm" : $("#hyzfmm").val(),
										"yhkxxsn" : $("#yhkxxsn").val()
									},
									type : 'post',
									cache : false,
									dataType : 'json',
									success : function(data) {
										load_close();
										if(data.status=="6"){
											getloginpage();
										}else if(data.status=="4"){
											alert(data.message);
											load_open();
											getCztx(member.cztx.flag);
										}else{
											tips.alert(data.message);
										}
									},
									error : function() {
										
									}
								});
							}
						},
						error : function() {
							
						}
					});
				});
			},
			validation : function(){
				var reg = /^\d{1,15}(\.\d{1,4})?$/;
				if(!reg.test($("#txje").val())){
					tips.alert("提现金额格式错误");
					return false;
				}
				reg = /^\w{6,20}$/;
				if(!reg.test($("#hyzfmm").val())){
					tips.alert("支付密码格式错误");
					return false;
				}
				return true;
			},
			//交易记录
			jyjl: {
				init : function(){
					$("#back").on("click", function(){
						load_open();
						getCztx(member.cztx.flag);
					});
					
					$("#container1 ul li").on("click", function(){
						var index = $(this).index();
						$("#container1 ul li").removeClass("router-link-exact-active");
						$("#container1 ul li").removeClass("active");
						$("#container1 ul li").eq(index).addClass("router-link-exact-active");
						$("#container1 ul li").eq(index).addClass("active");
						$(".czjy_jl").hide();
						$(".czjy_jl").eq(index).show();
					});
					
					$("#filter_czjl").on("click", function(){
						layer.open({
				            type: 1,
				            skin: "role_btn7",
				            title: '过滤',
				            area:'90%',
				            btn:"确定",
				            shadeClose: true,
				            content: $("#cz"),
				            yes:function(index){
				            	layer.close(index);
				            	load_open();
				            	var qssj = $("#qssj").val();
								var jzsj = $("#jzsj").val();
								var czlx = $("#czlx").val();
								var czzt = $("#czzt").val();
								getCzjl(member.cztx.jyjl.czjl.pagesize, 1, qssj, jzsj, czlx, czzt);
				            }
				        });
					});
					
					$("#filter_txjl").on("click", function(){
						layer.open({
				            type: 1,
				            skin: "role_btn7",
				            title: '过滤',
				            area:'90%',
				            btn:"确定",
				            shadeClose: true,
				            content: $("#tx"),
				            yes:function(index){
				            	layer.close(index);
				            	load_open();
				            	var qssj = $("#qssj_txjl").val();
								var jzsj = $("#jzsj_txjl").val();
								var txzt = $("#txzt").val();
								getTxjl(member.cztx.jyjl.txjl.pagesize, 1, qssj, jzsj, txzt);
				            }
				        });
					});
				},
				czjl : {
					pagesize : 5,
					init : function(){
						$("#first_czjl").on("click", function(){
							load_open();
							var pagenum = 1;
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
						
						$("#last_czjl").on("click", function(){
							load_open();
							var pagenum = tn_czjl==0?1:tn_czjl;
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
						
						$("#prev_czjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_czjl==0||tn_czjl==1){
								pagenum = 1;
							}else{
								if(pn_czjl>1){
									pagenum = pn_czjl - 1;
								}else{
									pagenum = 1;
								}
								
							}
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
						
						$("#next_czjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_czjl==0||tn_czjl==1){
								pagenum = 1;
							}else{
								if(pn_czjl<tn_czjl){
									pagenum = pn_czjl + 1;
								}else{
									pagenum = pn_czjl;
								}
								
							}
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
					}
				},
				txjl : {
					pagesize : 5,
					init : function(){
						$("#first_txjl").on("click", function(){
							load_open();
							var pagenum = 1;
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
						
						$("#last_txjl").on("click", function(){
							load_open();
							var pagenum = tn_txjl==0?1:tn_txjl;
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
						
						$("#prev_txjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_txjl==0||tn_txjl==1){
								pagenum = 1;
							}else{
								if(pn_txjl>1){
									pagenum = pn_txjl - 1;
								}else{
									pagenum = 1;
								}
								
							}
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
						
						$("#next_txjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_txjl==0||tn_txjl==1){
								pagenum = 1;
							}else{
								if(pn_txjl<tn_txjl){
									pagenum = pn_txjl + 1;
								}else{
									pagenum = pn_txjl;
								}
								
							}
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
					}
				}
			},
			flag : 1
		},
		//消息中心
		xxzx : {
			init : function(){
				$("#back").on("click", function(){
					wddp();
				});
				
				$("#xxzt li").on("click", function(){
					var pagenum = 1;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var xxzt = $(this).attr("xxzt");
					getXxzx(member.xxzx.pagesize, pagenum, qssj, jzsj, xxlx, xxzt);
				});
				
				$(".cop").on("click", function(){
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var xxzt = $(this).attr("xxzt");
					var sn = $(this).attr("sn");
					if(xxzt=="0"){
						markXx(qssj, jzsj, xxlx, sn);
					}else{
						delXx(qssj, jzsj, xxlx, sn);
					}
				});
				
				$("#markAll").on("click", function(){
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var s = $(".cop");
					var sn = "";
					for(var i=0;i<s.length;i++){
						if(i==0){
							sn += $(s[i]).attr("sn");
						}else{
							sn += ","+$(s[i]).attr("sn");
						}
					}
					markAll(qssj, jzsj, xxlx, sn);
				});
				
				$("#delAll").on("click", function(){
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var s = $(".cop");
					var sn = "";
					for(var i=0;i<s.length;i++){
						if(i==0){
							sn += $(s[i]).attr("sn");
						}else{
							sn += ","+$(s[i]).attr("sn");
						}
					}
					delAll(qssj, jzsj, xxlx, sn);
				});
				
				$("#first").on("click", function(){
					load_open();
					var pagenum = 1;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var xxzt = $("#xxzt li.active").attr("xxzt");
					getXxzx(member.xxzx.pagesize, pagenum, qssj, jzsj, xxlx, xxzt);
				});
				
				$("#last").on("click", function(){
					load_open();
					var pagenum = tn==0?1:tn;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var xxzt = $("#xxzt li.active").attr("xxzt");
					getXxzx(member.xxzx.pagesize, pagenum, qssj, jzsj, xxlx, xxzt);
				});
				
				$("#prev").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn>1){
							pagenum = pn - 1;
						}else{
							pagenum = 1;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var xxzt = $("#xxzt li.active").attr("xxzt");
					getXxzx(member.xxzx.pagesize, pagenum, qssj, jzsj, xxlx, xxzt);
				});
				
				$("#next").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn<tn){
							pagenum = pn + 1;
						}else{
							pagenum = pn;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var xxlx = $("#xxlx").val();
					var xxzt = $("#xxzt li.active").attr("xxzt");
					getXxzx(member.xxzx.pagesize, pagenum, qssj, jzsj, xxlx, xxzt);
				});
				
				$("#filter").on("click", function(){
					layer.open({
			            type: 1,
			            skin: "role_btn7",
			            title: '过滤',
			            area:'90%',
			            btn:"确定",
			            shadeClose: true,
			            content: $(".promptbox-wrapper"),
			            yes:function(index){
			            	var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var xxlx = $("#xxlx").val();
							var xxzt = $("#xxzt li.active").attr("xxzt");
			            	layer.close(index);
			            	load_open();
							getXxzx(member.xxzx.pagesize, 1, qssj, jzsj, xxlx, xxzt);
			            }
			        });
				});
			},
			pagesize : 5
		},
		//修改资料
		xgzl : {
			init : function(){
				$("#back").on("click", function(){
					wddp();
				});
				
				$("#container1 ul li").on("click", function(){
					var index = $(this).index();
					$("#container1 ul li").removeClass("router-link-exact-active");
					$("#container1 ul li").removeClass("active");
					$("#container1 ul li").eq(index).addClass("router-link-exact-active");
					$("#container1 ul li").eq(index).addClass("active");
					$("form").hide();
					$("form").eq(index).show();
				});
				
				$("#saveZl").on("click", function(){
					if(!member.xgzl.validation1()){
						return;
					}
					var inputs = $("input.info");
					if(inputs.length==0){
						tips.alert("已填写的信息无法修改", 3000);
						return;
					}
					var json = "{";
					for(var i=0;i<inputs.length;i++){
						if(i==0){
							json += $(inputs[i]).attr("id")+" : '"+$(inputs[i]).val()+"'";
						}else{
							json += ", "+$(inputs[i]).attr("id")+" : '"+$(inputs[i]).val()+"'";
						}
					}
					json += "}";
					var para = eval('(' + json + ')');
					$.ajax({
						url : "lottery/updateZl.do",
						type : "POST",
						data : para,
						dataType : "json",
						success : function(data) {
							if(data.status=="6"){
								getloginpage();
							}else{
								tips.alert(data.message);
							}
						},
						error : function(x, h, e) {
							
						}
					});
				});
				
				$("#savePassword").on("click", function(){
					if(!member.xgzl.validation2()){
						return;
					}
					$.ajax({
						url : "lottery/updatePassword.do",
						type : "POST",
						data : {op : $("#oldpassword_in_edit").val(), np : $("#password_in_edit").val(), rnp : $("#confirmed_password_in_edit").val()},
						dataType : "json",
						success : function(data) {
							if(data.status=="6"){
								getloginpage();
							}else{
								tips.alert(data.message);
							}
						},
						error : function(x, h, e) {
							
						}
					});
				});
				
				$("#next1").on("click", function(){
					if(!member.xgzl.validation3()){
						return;
					}
					$.ajax({
						url : "lottery/checkPassword.do",
						type : "POST",
						data : {hymm : $("#aqwt_mm").val()},
						dataType : "json",
						success : function(data) {
							if(data.status=="6"){
								getloginpage();
							}else{
								if(data.message=="0"){
									tips.alert("密码错误");
								}else if(data.message=="1"){
									$("form").hide();
									$("#aqwt").show();
								}else{
									tips.alert(data.message);
								}
							}
						},
						error : function(x, h, e) {
							
						}
					});
				});
				
				$("#next2").on("click", function(){
					if(!member.xgzl.validation4()){
						return;
					}
					$.ajax({
						url : "lottery/updateAqwt.do",
						type : "POST",
						data : {aqwt1 : $("#aqwt1").val(), aqwt1da : $("#secure_code_in_finding").val()},
						dataType : "json",
						success : function(data) {
							if(data.status=="6"){
								getloginpage();
							}else if(data.status=="4"){
								alert(data.message);
								wddp();
								load_close();
							}
						},
						error : function(x, h, e) {
							
						}
					});
				});
			},
			validation1 : function(){
				var reg = /^[1-9]\d{10}$/;
				if(!$("#tel").prop("readonly")&&$("#tel").val().trim()!=""&&!reg.test($("#tel").val())){
					tips.alert("手机号码格式错误");
					return false;
				}
				reg = /^.{1,15}$/;
				if(!$("#hymc").prop("readonly")&&$("#hymc").val().trim()!=""&&!reg.test($("#hymc").val())){
					tips.alert("姓名格式错误");
					return false;
				}
				reg = /^[1-9]\d{4,10}$/;
				if(!$("#qq").prop("readonly")&&$("#qq").val().trim()!=""&&!reg.test($("#qq").val())){
					tips.alert("qq号码格式错误");
					return false;
				}
				reg = /^.+@.+$/;
				if(!$("#email").prop("readonly")&&$("#email").val().trim()!=""&&!reg.test($("#email").val())){
					tips.alert("电子邮箱格式错误");
					return false;
				}
				return true;
			},
			validation2 : function(){
				var reg = /^\w{6,20}$/;
				if(!reg.test($("#oldpassword_in_edit").val())){
					tips.alert("原始密码格式错误");
					return false;
				}
				if(!reg.test($("#password_in_edit").val())){
					tips.alert("新密码格式错误");
					return false;
				}
				if($("#oldpassword_in_edit").val()==$("#password_in_edit").val()){
					tips.alert("新密码不能与旧密码相同");
					return false;
				}
				if($("#confirmed_password_in_edit").val()!=$("#password_in_edit").val()){
					tips.alert("密码不一致");
					return false;
				}
				return true;
			},
			validation3 : function(){
				var reg = /^\w{6,20}$/;
				if(!reg.test($("#aqwt_mm").val())){
					tips.alert("登录密码格式错误");
					return false;
				}
				return true;
			},
			validation4 : function(){
				var reg = /^\w{6,20}$/;
				if(!reg.test($("#aqwt_mm").val())){
					tips.alert("登录密码格式错误");
					return false;
				}
				return true;
			}
		},
		//银行卡信息
		yhkxx : {
			init : function(){
				$("#back").on("click", function(){
					wddp();
				});
				
				$("#container1 ul li").on("click", function(){
					var index = $(this).index();
					$("#container1 ul li").removeClass("router-link-exact-active");
					$("#container1 ul li").removeClass("active");
					$("#container1 ul li").eq(index).addClass("router-link-exact-active");
					$("#container1 ul li").eq(index).addClass("active");
					$("form").hide();
					$("form").eq(index).show();
				});
				
				$("#saveYhkxx").on("click", function(){
					if(!member.yhkxx.validation1()){
						return;
					}
					load_open();
					$.ajax({
						url : "lottery/updateYhkxx.do",
						type : "POST",
						data : {yhkh : $("#yhkh").val(), yhmc : $("#yhmc").val()},
						dataType : "json",
						success : function(data) {
							load_close();
							if(data.status=="6"){
								getloginpage();
							}else if(data.status=="4"){
								tips.alert(data.message);
								$("#saveYhkxx").remove();
							}
						},
						error : function(x, h, e) {
							
						}
					});
				});
				
				$("#saveZjmm").on("click", function(){
					if(!member.yhkxx.validation2()){
						return;
					}
					$.ajax({
						url : "lottery/updateZjmm.do",
						type : "POST",
						data : {op : $("#op").val(), p1 : $("#oldpassword_in_edit").val(), p2 : $("#password_in_edit").val()},
						dataType : "json",
						success : function(data) {
							if(data.status=="6"){
								getloginpage();
							}else{
								tips.alert(data.message);
							}
						},
						error : function(x, h, e) {
							
						}
					});
				});
			},
			validation1 : function(){
				var reg = /^.{1,40}$/;
				if($("#khm").val()==""){
					tips.alert("请在修改资料中设置真实姓名");
					return false;
				}
				if(!reg.test($("#yhkh").val())){
					tips.alert("卡号格式错误");
					return false;
				}
				reg = /^.{1,25}$/;
				if(!reg.test($("#yhmc").val())){
					tips.alert("开户银行格式错误");
					return false;
				}
				reg = /^.*\d.*$/;
				if(reg.test($("#yhmc").val())){
					tips.alert("开户银行不能有数字");
					return false;
				}
				return true;
			},
			validation2 : function(){
				var reg = /^\w{6,20}$/;
				if(!reg.test($("#oldpassword_in_edit").val())){
					tips.alert("密码格式不正确");
					return false;
				}
				if($("#oldpassword_in_edit").val()==$("#op").val()){
					tips.alert("新密码不能与旧密码相同");
					return false;
				}
				if($("#oldpassword_in_edit").val()!=$("#password_in_edit").val()){
					tips.alert("密码不一致");
					return false;
				}
				return true;
			}
		},
		//开奖记录
		kjjl : {
			init : function(cpzl, flag){
				member.kjjl.flag = flag;
				
				$("#back").on("click", function(){
					if(flag==undefined){
						wddp();
					}else{
						getintoLottery(cpzl);
					}
				});
				
				$("#first").on("click", function(){
					load_open();
					var pagenum = 1;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var cpqh = $("#cpqh").val();
					getKjjl(member.kjjl.pagesize, pagenum, qssj, jzsj, cpzl, cpqh, member.kjjl.flag);
				});
				
				$("#last").on("click", function(){
					load_open();
					var pagenum = tn==0?1:tn;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var cpqh = $("#cpqh").val();
					getKjjl(member.kjjl.pagesize, pagenum, qssj, jzsj, cpzl, cpqh, member.kjjl.flag);
				});
				
				$("#prev").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn>1){
							pagenum = pn - 1;
						}else{
							pagenum = 1;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var cpqh = $("#cpqh").val();
					getKjjl(member.kjjl.pagesize, pagenum, qssj, jzsj, cpzl, cpqh, member.kjjl.flag);
				});
				
				$("#next").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn<tn){
							pagenum = pn + 1;
						}else{
							pagenum = pn;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var cpqh = $("#cpqh").val();
					getKjjl(member.kjjl.pagesize, pagenum, qssj, jzsj, cpzl, cpqh, member.kjjl.flag);
				});
				
				$("#filter").on("click", function(){
					layer.open({
			            type: 1,
			            skin: "role_btn7",
			            title: '过滤',
			            area:'90%',
			            btn:"确定",
			            shadeClose: true,
			            content: $(".promptbox-wrapper"),
			            yes:function(index){
			            	var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var cpzl = $("#cpzl").val();
							var cpqh = $("#cpqh").val();
			            	layer.close(index);
			            	load_open();
							getKjjl(member.kjjl.pagesize, 1, qssj, jzsj, cpzl, cpqh, member.kjjl.flag);
			            }
			        });
				});
			},
			pagesize : 5,
			flag : 1
		},
		//今日注单
		jrzd : {
			init : function(cpzl, flag){
				member.jrzd.flag = flag;
				
				$("#back").on("click", function(){
					if(flag==undefined){
						wddp();
					}else{
						getintoLottery(cpzl);
					}
				});
				
			},
			flag : 1
		},
		//下注记录
		xzjl : {
			init : function(cpzl, flag){
				member.xzjl.flag = flag;
				
				$("#back").on("click", function(){
					if(flag==undefined){
						wddp();
					}else{
						getintoLottery(cpzl);
					}
				});
				
				$("#first").on("click", function(){
					load_open();
					var pagenum = 1;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var tzzt = $("#tzzt").val();
					getXzjl(member.xzjl.pagesize, pagenum, qssj, jzsj, cpzl, tzzt, member.xzjl.flag);
				});
				
				$("#last").on("click", function(){
					load_open();
					var pagenum = tn==0?1:tn;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var tzzt = $("#tzzt").val();
					getXzjl(member.xzjl.pagesize, pagenum, qssj, jzsj, cpzl, tzzt, member.xzjl.flag);
				});
				
				$("#prev").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn>1){
							pagenum = pn - 1;
						}else{
							pagenum = 1;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var tzzt = $("#tzzt").val();
					getXzjl(member.xzjl.pagesize, pagenum, qssj, jzsj, cpzl, tzzt, member.xzjl.flag);
				});
				
				$("#next").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn<tn){
							pagenum = pn + 1;
						}else{
							pagenum = pn;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var cpzl = $("#cpzl").val();
					var tzzt = $("#tzzt").val();
					getXzjl(member.xzjl.pagesize, pagenum, qssj, jzsj, cpzl, tzzt, member.xzjl.flag);
				});
				
				$("#filter").on("click", function(){
					layer.open({
			            type: 1,
			            skin: "role_btn7",
			            title: '过滤',
			            area:'90%',
			            btn:"确定",
			            shadeClose: true,
			            content: $(".promptbox-wrapper"),
			            yes:function(index){
			            	var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var cpzl = $("#cpzl").val();
							var tzzt = $("#tzzt").val();
			            	layer.close(index);
			            	load_open();
							getXzjl(member.xzjl.pagesize, 1, qssj, jzsj, cpzl, tzzt, member.xzjl.flag);
			            }
			        });
				});
				
				$(".cd").on("click", function(){
					if(confirm("确定撤单？")){
						load_open();
						var sn = $(this).attr("sn");
						var cpzl = $(this).attr("cpzl");
						$.ajax({
							url : "lottery/cd.do",
							type : "POST",
							dataType : "json",
							data : {sn : sn, cpzl : cpzl},
							success : function(data) {
								var qssj = $("#qssj").val();
								var jzsj = $("#jzsj").val();
								var cpzl = $("#cpzl").val();
								var tzzt = $("#tzzt").val();
								alert(data.message);
								getXzjl(member.xzjl.pagesize, 1, qssj, jzsj, cpzl, tzzt, member.xzjl.flag);
							},
							error : function(x, h, e) {
								load_close();
							}
						});
					}
				});
			},
			pagesize : 20,
			flag : 1
		},
		//账户流水
		zhls : {
			init : function(){
				$("#back").on("click", function(){
					wddp();
				});
				
				$("#first").on("click", function(){
					load_open();
					var pagenum = 1;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var zblx = $("#zblx").val();
					getZhls(member.zhls.pagesize, pagenum, qssj, jzsj, zblx);
				});
				
				$("#last").on("click", function(){
					load_open();
					var pagenum = tn==0?1:tn;
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var zblx = $("#zblx").val();
					getZhls(member.zhls.pagesize, pagenum, qssj, jzsj, zblx);
				});
				
				$("#prev").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn>1){
							pagenum = pn - 1;
						}else{
							pagenum = 1;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var zblx = $("#zblx").val();
					getZhls(member.zhls.pagesize, pagenum, qssj, jzsj, zblx);
				});
				
				$("#next").on("click", function(){
					load_open();
					var pagenum;
					if(tn==0||tn==1){
						pagenum = 1;
					}else{
						if(pn<tn){
							pagenum = pn + 1;
						}else{
							pagenum = pn;
						}
						
					}
					var qssj = $("#qssj").val();
					var jzsj = $("#jzsj").val();
					var zblx = $("#zblx").val();
					getZhls(member.zhls.pagesize, pagenum, qssj, jzsj, zblx);
				});
				
				$("#filter").on("click", function(){
					layer.open({
			            type: 1,
			            skin: "role_btn7",
			            title: '过滤',
			            area:'90%',
			            btn:"确定",
			            shadeClose: true,
			            content: $(".promptbox-wrapper"),
			            yes:function(index){
			            	var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var zblx = $("#zblx").val();
			            	layer.close(index);
			            	load_open();
			            	getZhls(member.zhls.pagesize, 1, qssj, jzsj, zblx);
			            }
			        });
				});
			},
			pagesize : 5
		},
		//个人盈亏
		gryk : {
			init : function(){
				$("#back").on("click", function(){
					wddp();
				});
				
				$("#search").on("click", function(){
					load_open();
					getDlyk($("#kssj").val(), $("#jssj").val(), $("#hydlmc").val());
				});
			}
		},
		//代理盈亏
		dlyk : {
			init : function(){
				$("#back").on("click", function(){
					wddp();
				});
				
				$("#search").on("click", function(){
					load_open();
					getDlyk($("#kssj").val(), $("#jssj").val(), $("#hydlmc").val());
				});
			}
		}
};

var zjgl = {
		cztx : {
			init : function(){
				$("#back").on("click", function(){
					clipboard1.destroy();
					clipboard1_xm.destroy();
					clipboard1_zh.destroy();
					clipboard2.destroy();
					clipboard2_xm.destroy();
					clipboard2_zh.destroy();
					index();
				});
				
				$("#container1 ul.nostyle.account-sub-nav.kd-row-middle li").on("click", function(){
					var index = $(this).index();
					if(index==0){
						$("#container1 ul li").removeClass("router-link-exact-active");
						$("#container1 ul li").removeClass("active");
						$("#container1 ul li").eq(0).addClass("router-link-exact-active");
						$("#container1 ul li").eq(0).addClass("active");
						$("#tx1").hide();
						$("#jyjl").hide();
						$("#cz1").show();
					}else if(index==1){
						$("#container1 ul li").removeClass("router-link-exact-active");
						$("#container1 ul li").removeClass("active");
						$("#container1 ul li").eq(1).addClass("router-link-exact-active");
						$("#container1 ul li").eq(1).addClass("active");
						$("#cz1").hide();
						$("#jyjl").hide();
						$("#tx1").show();
					}else{
						getJyjlInFooter();
					}
				});
				
//				$("div.type-title.kd-container.Collapsing").on("click", function(){
//					if($(this).hasClass("current")){
//						$(this).removeClass("current");
//						$(this).next().hide();
//					}else{
//						$(this).addClass("current");
//						$("div.type-body.coll_body").hide();
//						$(this).next().show();
//					}
//				});
				$("div.Collapsing.topup_czbs").on("click", function(){
					if($(this).hasClass("current")){
						$(this).removeClass("current");
						$(this).next().hide();
						$(".kd-form .topup_czbs").removeClass("topup_top");
					}else{
						$(this).addClass("current");
						$("div.type-body.coll_body").hide();
						$(this).next().show();
						$(this).addClass("topup_top");
					}
				});
				
				$("#tx").on("click", function(){
					if(!member.cztx.validation()){
						return;
					}
					$.ajax({
						url : "lottery/getPoundage.do",
						data : {
							"txje" : $("#txje").val()
						},
						type : 'post',
						cache : false,
						dataType : 'text',
						success : function(data) {
							var money = parseFloat(data);
							if((money!=0&&confirm("将收取"+data+"元手续费，确定继续提现操作？"))||money==0){
								load_open();
								$.ajax({
									url : "lottery/tx.do",
									data : {
										"txje" : $("#txje").val(),
										"hyzfmm" : $("#hyzfmm").val(),
										"yhkxxsn" : $("#yhkxxsn").val()
									},
									type : 'post',
									cache : false,
									dataType : 'json',
									success : function(data) {
										load_close();
										if(data.status=="6"){
											getloginpage();
										}else if(data.status=="4"){
											alert(data.message);
											load_open();
											getCztx();
										}else{
											tips.alert(data.message);
										}
									},
									error : function() {
										
									}
								});
							}
						},
						error : function() {
							
						}
					});
				});
			},
			validation : function(){
				var reg = /^\d{1,15}(\.\d{1,4})?$/;
				if(!reg.test($("#txje").val())){
					tips.alert("提现金额格式错误");
					return false;
				}
				reg = /^\w{6,20}$/;
				if(!reg.test($("#hyzfmm").val())){
					tips.alert("支付密码格式错误");
					return false;
				}
				return true;
			},
			//交易记录
			jyjl: {
				init : function(){
					$("#back").on("click", function(){
						load_open();
						getCztxInFooter();
					});
					
					$("#container1 ul li").on("click", function(){
						var index = $(this).index();
						$("#container1 ul li").removeClass("router-link-exact-active");
						$("#container1 ul li").removeClass("active");
						$("#container1 ul li").eq(index).addClass("router-link-exact-active");
						$("#container1 ul li").eq(index).addClass("active");
						$(".czjy_jl").hide();
						$(".czjy_jl").eq(index).show();
					});
					
					$("#filter_czjl").on("click", function(){
						layer.open({
				            type: 1,
				            skin: "role_btn7",
				            title: '过滤',
				            area:'90%',
				            btn:"确定",
				            shadeClose: true,
				            content: $("#cz"),
				            yes:function(index){
				            	layer.close(index);
				            	load_open();
				            	var qssj = $("#qssj").val();
								var jzsj = $("#jzsj").val();
								var czlx = $("#czlx").val();
								var czzt = $("#czzt").val();
								getCzjl(member.cztx.jyjl.czjl.pagesize, 1, qssj, jzsj, czlx, czzt);
				            }
				        });
					});
					
					$("#filter_txjl").on("click", function(){
						layer.open({
				            type: 1,
				            skin: "role_btn7",
				            title: '过滤',
				            area:'90%',
				            btn:"确定",
				            shadeClose: true,
				            content: $("#tx"),
				            yes:function(index){
				            	layer.close(index);
				            	load_open();
				            	var qssj = $("#qssj_txjl").val();
								var jzsj = $("#jzsj_txjl").val();
								var txzt = $("#txzt").val();
								getTxjl(member.cztx.jyjl.txjl.pagesize, 1, qssj, jzsj, txzt);
				            }
				        });
					});
				},
				czjl : {
					pagesize : 5,
					init : function(){
						$("#first_czjl").on("click", function(){
							load_open();
							var pagenum = 1;
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
						
						$("#last_czjl").on("click", function(){
							load_open();
							var pagenum = tn_czjl==0?1:tn_czjl;
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
						
						$("#prev_czjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_czjl==0||tn_czjl==1){
								pagenum = 1;
							}else{
								if(pn_czjl>1){
									pagenum = pn_czjl - 1;
								}else{
									pagenum = 1;
								}
								
							}
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
						
						$("#next_czjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_czjl==0||tn_czjl==1){
								pagenum = 1;
							}else{
								if(pn_czjl<tn_czjl){
									pagenum = pn_czjl + 1;
								}else{
									pagenum = pn_czjl;
								}
								
							}
							var qssj = $("#qssj").val();
							var jzsj = $("#jzsj").val();
							var czlx = $("#czlx").val();
							var czzt = $("#czzt").val();
							getCzjl(member.cztx.jyjl.czjl.pagesize, pagenum, qssj, jzsj, czlx, czzt);
						});
					}
				},
				txjl : {
					pagesize : 5,
					init : function(){
						$("#first_txjl").on("click", function(){
							load_open();
							var pagenum = 1;
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
						
						$("#last_txjl").on("click", function(){
							load_open();
							var pagenum = tn_txjl==0?1:tn_txjl;
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
						
						$("#prev_txjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_txjl==0||tn_txjl==1){
								pagenum = 1;
							}else{
								if(pn_txjl>1){
									pagenum = pn_txjl - 1;
								}else{
									pagenum = 1;
								}
								
							}
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
						
						$("#next_txjl").on("click", function(){
							load_open();
							var pagenum;
							if(tn_txjl==0||tn_txjl==1){
								pagenum = 1;
							}else{
								if(pn_txjl<tn_txjl){
									pagenum = pn_txjl + 1;
								}else{
									pagenum = pn_txjl;
								}
								
							}
							var qssj = $("#qssj_txjl").val();
							var jzsj = $("#jzsj_txjl").val();
							var txzt = $("#txzt").val();
							getTxjl(member.cztx.jyjl.txjl.pagesize, pagenum, qssj, jzsj, txzt);
						});
					}
				}
			}
		}
};

/*
 * 头部
 */
var head = {
		init : function(){
			var istrue = true;
			$("#right-ye").on("click",function(){
				if($(this).attr("login")=="0"){
					getloginpage();
				}else{
//					$("#right-xs").toggle();
					istrue = !istrue;
					$("#right-xs").css("display",istrue?"none":"block");
				}
			});
			
		    $("#container1").click(function(){
		    	$("#right-xs").css("display","none");
		    	istrue=true;
		    });
			
			$("#right-xs li").on("click",function(){
				var a = $(this).find("a").html();
				if(a=="我的地盘"){
					mark = 3;
					wddp();
				}else if(a=="安全退出"){
					logout();
				}
			});
		}
};

/*
 * 忘记密码
 */
function getWjmm(){
	$.ajax({
		url : "lottery/wjmm.do",
		type : "POST",
		dataType : "html",
		success : function(data) {
			load_close();
			$("#subContentId").empty();
	  		$("#subContentId").append(data);
	  		commoninit();
	  		loginpage.wjmm.init();
		},
		error : function(x, h, e) {
			
		}
	});
}

//进入首页
function index(flag){
	$.post("lottery/redirectMain.do",function(data){
		var obj = JSON.parse(data);
  		$("#subContentId").empty();
  		$("#subContentId").append(obj.data);
  		$("#ServerUserId").val(obj.hybm==null?'':obj.hybm);
  		$("#ServerUserName").val(obj.hymc==null?'':obj.hymc);
  		commoninit();
	    maininit();
	    if(flag==1){
	    	tips.loginAlert();
	    }
  	});
}

//进入登录页
function getloginpage(){
	$.ajax({
		url : "lottery/loginpage.do",
		type : "POST",
		dataType : "html",
		success : function(data) {
			$("#subContentId").html(data);
	  		commoninit();
	  		loginpage.init();
		},
		error : function(x, h, e) {
			
		}
	});
}

//进入我的地盘
function wddp(){
	$.post("lottery/memberpage.do",function(data){
  		if(data.status=="6"){
  			getloginpage();
  		}else{
  			$("#subContentId").empty();
  	  		$("#subContentId").append(data.message);
  	  		commoninit();
  	  	    lotteryPage();//彩种页面
  	        lotteryBtn();//彩票按钮初始化
	  		member.init();
  		}
  	}, "json");
}

//优惠活动
function getYhhd(){
	$.ajax({
		url : "lottery/yhhd.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		menu.yhhd.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//代理推广
function getDltg(){
	$.ajax({
		url : "lottery/dltg.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.dltg.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入充值/提现
function getCztx(cpzl){
	$.ajax({
		url : "lottery/cztx.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.cztx.init(cpzl);
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入充值/提现
function getCztxInFooter(){
	$.ajax({
		url : "lottery/cztx.do?type=1",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		zjgl.cztx.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入交易记录
function getJyjl(){
	$.ajax({
		url : "lottery/jyjl.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.cztx.jyjl.init();
	  	  		getCzjl();
	  	  		getTxjl();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function getJyjlInFooter(){
	$.ajax({
		url : "lottery/jyjl.do?type=1",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		zjgl.cztx.jyjl.init();
	  	  		getCzjl();
	  	  		getTxjl();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//充值记录
function getCzjl(pagesize, pagenum, qssj, jzsj, czlx, czzt){
	if(pagesize==undefined){
		pagesize = 5;
	}
	if(pagenum==undefined){
		pagenum = 1;
	}
	if(qssj==undefined){
		qssj = "";
	}
	if(jzsj==undefined){
		jzsj = "";
	}
	if(czlx==undefined){
		czlx = "";
	}
	if(czzt==undefined){
		czzt = "";
	}
	$.ajax({
		url : "lottery/czjl.do",
		type : "POST",
		data : {pagesize : pagesize, pagenum : pagenum, qssj : qssj, jzsj : jzsj, czlx : czlx, czzt : czzt},
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#czjl").empty();
	  	  		$("#czjl").append(data.message);
	  	  		member.cztx.jyjl.czjl.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//提现记录
function getTxjl(pagesize, pagenum, qssj, jzsj, txzt){
	if(pagesize==undefined){
		pagesize = 5;
	}
	if(pagenum==undefined){
		pagenum = 1;
	}
	if(qssj==undefined){
		qssj = "";
	}
	if(jzsj==undefined){
		jzsj = "";
	}
	if(txzt==undefined){
		txzt = "";
	}
	$.ajax({
		url : "lottery/txjl.do",
		type : "POST",
		data : {pagesize : pagesize, pagenum : pagenum, qssj : qssj, jzsj : jzsj, txzt : txzt},
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#txjl").empty();
	  	  		$("#txjl").append(data.message);
	  	  		member.cztx.jyjl.txjl.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入修改资料
function getXgzl(){
	$.ajax({
		url : "lottery/xgzl.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.xgzl.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入银行卡信息
function getYhkxx(){
	$.ajax({
		url : "lottery/yhkxx.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.yhkxx.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入消息中心
function getXxzx(pagesize, pagenum, qssj, jzsj, xxlx, xxzt){
	if(pagesize==undefined){
		pagesize = 5;
	}
	if(pagenum==undefined){
		pagenum = 1;
	}
	if(qssj==undefined){
		qssj = "";
	}
	if(jzsj==undefined){
		jzsj = "";
	}
	if(xxlx==undefined){
		xxlx = "";
	}
	if(xxzt==undefined){
		xxzt = 0;
	}
	$.ajax({
		url : "lottery/xxzx.do",
		type : "POST",
		data : {pagesize : pagesize, pagenum : pagenum, qssj : qssj, jzsj : jzsj, xxlx : xxlx, xxzt : xxzt},
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  			load_close();
	  		}else if(data.status=="1"){
	  			load_close();
	  			tips.alert(data.message);
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.xxzx.init();
	  	  		load_close();
	  		}
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function markXx(qssj, jzsj, xxlx, sn){
	$.ajax({
		url : "lottery/markXx.do",
		type : "POST",
		dataType : "json",
		data : {sn : sn},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			getXxzx(member.xxzx.pagesize, 1, qssj, jzsj, xxlx, 0);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function markAll(qssj, jzsj, xxlx, sn){
	$.ajax({
		url : "lottery/markXxs.do",
		type : "POST",
		dataType : "json",
		data : {sn : sn},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			getXxzx(member.xxzx.pagesize, 1, qssj, jzsj, xxlx, 0);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function delXx(qssj, jzsj, xxlx, sn){
	$.ajax({
		url : "lottery/delXx.do",
		type : "POST",
		dataType : "json",
		data : {sn : sn},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			getXxzx(member.xxzx.pagesize, 1, qssj, jzsj, xxlx, 1);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function delAll(qssj, jzsj, xxlx, sn){
	$.ajax({
		url : "lottery/delXxs.do",
		type : "POST",
		dataType : "json",
		data : {sn : sn},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			getXxzx(member.xxzx.pagesize, 1, qssj, jzsj, xxlx, 1);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入开奖记录
function getKjjl(pagesize, pagenum, qssj, jzsj, cpzl, cpqh, flag){
	if(pagesize==undefined){
		pagesize = 5;
	}
	if(pagenum==undefined){
		pagenum = 1;
	}
	if(qssj==undefined){
		qssj = "";
	}
	if(jzsj==undefined){
		jzsj = "";
	}
	if(cpzl==undefined){
		cpzl = "";
	}
	if(cpqh==undefined){
		cpqh = "";
	}
	$.ajax({
		url : "lottery/kjjl.do",
		type : "POST",
		dataType : "json",
		data : {pagesize : pagesize, pagenum : pagenum, qssj : qssj, jzsj : jzsj, cpzl : cpzl, cpqh : cpqh},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.kjjl.init(cpzl, flag);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入今日注单
function getJrzd(cpzl, flag){
	if(cpzl==undefined){
		cpzl = "";
	}
	$.ajax({
		url : "lottery/jrzd.do",
		type : "POST",
		dataType : "json",
		data : {cpzl : cpzl},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.jrzd.init(cpzl, flag);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入下注记录
function getXzjl(pagesize, pagenum, qssj, jzsj, cpzl, tzzt, flag){
	if(pagesize==undefined){
		pagesize = 20;
	}
	if(pagenum==undefined){
		pagenum = 1;
	}
	if(qssj==undefined){
		qssj = "";
	}
	if(jzsj==undefined){
		jzsj = "";
	}
	if(cpzl==undefined){
		cpzl = "";
	}
	if(tzzt==undefined){
		tzzt = "";
	}
	$.ajax({
		url : "lottery/xzjl.do",
		type : "POST",
		dataType : "json",
		data : {pagesize : pagesize, pagenum : pagenum, qssj : qssj, jzsj : jzsj, cpzl : cpzl, tzzt : tzzt},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.xzjl.init(cpzl, flag);
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

//进入账号流水
function getZhls(pagesize, pagenum, qssj, jzsj, zblx){
	if(pagesize==undefined){
		pagesize = 5;
	}
	if(pagenum==undefined){
		pagenum = 1;
	}
	if(qssj==undefined){
		qssj = "";
	}
	if(jzsj==undefined){
		jzsj = "";
	}
	if(zblx==undefined){
		zblx = "";
	}
	$.ajax({
		url : "lottery/zhls.do",
		type : "POST",
		dataType : "json",
		data : {pagesize : pagesize, pagenum : pagenum, qssj : qssj, jzsj : jzsj, zblx : zblx},
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.zhls.init();
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function getDlyk(kssj, jssj, hydlmc){
	if(kssj == undefined){
		kssj = "";
	}
	if(jssj == undefined){
		jssj = "";
	}
	if(hydlmc == undefined){
		hydlmc = "";
	}
	$.ajax({
		url : "lottery/dlyk.do",
		type : "POST",
		data : {kssj : kssj, jssj : jssj, hydlmc : hydlmc},
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
	  			getloginpage();
	  		}else{
	  			$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.dlyk.init();
	  		}
			load_close();
		},
		error : function(x, h, e) {
			load_close();
		}
	});
}

function getGryk1(){
	$.ajax({
		url : "lottery/gryk1.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
				getloginpage();
			}else if(data.status=="4"){
				$("#subContentId").empty();
	  	  		$("#subContentId").append(data.message);
	  	  		commoninit();
	  	  		member.gryk.init();
			}
		},
		error : function(x, h, e) {
			
		}
	});
}

function dlykmx(hybm){
	$.ajax({
		url : "lottery/gryk.do",
		type : "POST",
		data : {hybm : hybm},
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
				getloginpage();
			}else if(data.status=="4"){
				$("#gryk div").html(data.message);
				layer.open({
    				type: 1,
    				skin: "role_btn5",
    				title: '个人盈亏',
    				area: ['320px', '400px'],
    				shadeClose: true,
    				content: $("#gryk")
    			});
			}
		},
		error : function(x, h, e) {
			
		}
	});
}

//退出登录
function logout(){
//	if(confirm("确认退出？")){
//		load_open();
//		webSeocketClose();
//		$("#ServerUserId").val("");
//		$("#ServerUserName").val("");
//		$.ajax({
//			url : "lottery/logout.do",
//			type : "POST",
//			dataType : "html",
//			success : function(data) {
//				load_close();
////				mark = 0;
////				$("#subContentId").html(data);
////		  		commoninit();
////		  		loginpage.init();
//				location.reload();
//			},
//			error : function(x, h, e) {
//				load_close();
//			}
//		});
//	}
	layer
			.open({
				type : 1,
				skin : "role_btn1",
				title : '提示',
				area : "70%",
				shadeClose : true,
				content : $("#confirm"),
				btn : [ "确定", "取消" ],
				yes : function(index) {
					layer.close(index);
					load_open();
					webSeocketClose();
					$("#ServerUserId").val("");
					$("#ServerUserName").val("");
					$.ajax({
						url : "lottery/logout.do",
						type : "POST",
						dataType : "html",
						success : function(data) {
							load_close();
//							mark = 0;
//							$("#subContentId").html(data);
//					  		commoninit();
//					  		loginpage.init();
							location.reload();
						},
						error : function(x, h, e) {
							load_close();
						}
					});
				},
				btn2 : function(index) {
					layer.close(index);
				}
			});
}

function logout1(){
	$("#ServerUserId").val("");
	$("#ServerUserName").val("");
	webSeocketClose();
	$.ajax({
		url : "lottery/logout.do",
		type : "POST",
		dataType : "html",
		success : function(data) {
//			mark = 0;
//			$("#subContentId").html(data);
//	  		commoninit();
//	  		loginpage.init();
			location.reload();
		},
		error : function(x, h, e) {
			
		}
	});
}

//////////////////////////更多彩种////////////////////////////////////////
/**
 * 更多彩种初始化
 */
function moreLotterinit(){
	getNotice1();
	
	lotteryBtn();//彩票按钮
	
	//进入主页
	$(".logo1").on("click",function(){
		index();
	});
	
	$(".cztx").on("click",function(){
		load_open();
		getCztx();
	});
}

function getApp(){
	$.ajax({
		url : "lottery/getApp.do",
		type : "POST",
		dataType : "html",
		success : function(data) {
			$("#subContentId").html(data);
	  		commoninit();
	  		$("#back").on("click", function(){
	  			if($("#frame").is(":hidden")){
	  				index();
	  			}else{
	  				$(".scroll").show();
	  				$("#frame").hide();
	  			}
			});
	  		load_close();
		},
		error : function(x, h, e) {
			
		}
	});
}

function getKf(){
	$.ajax({
		url : "lottery/getKf.do",
		type : "POST",
		dataType : "html",
		success : function(data) {
			$("#subContentId").html(data);
	  		commoninit();
	  		$("#back").on("click", function(){
				index();
			});
	  		load_close();
		},
		error : function(x, h, e) {
			
		}
	});
}

///////////////////////////////////////彩票公共部分/////////////////////////////////////////////////////////
var localArray=[];
var onetime=null;

/**
 * 彩票页面公共部门初始化
 */
function lotteryCommonInit(){ 
	var cpbm = $("#cpbm").val();
	getSscTextWf3(cpbm);
	
    // 右上角菜单 弹层
//    $('#J_reorder').on('click', function (e) {
//        if ($('#J_pop_setting').is(':visible')) {
//            var is_pop = false;
//            $('#J_pop_setting').hide();
//        }else {
//            e.stopPropagation();
//            $('#J_pop_setting').show();
//            if (!$(this).children().hasClass('hide')) {
//                $(this).children().addClass('hide');
//            }
//        }
//    });
    
	lotteryPage();//彩种页面
    
    lotteryBtn();//彩票按钮初始化
    // 点击其他地方需要关闭的 弹层
//    $(document).on('click', function (e) {
//        $('#J_pop_setting').hide();
//    });
    //金额位置下拉
    var istrue=true;
    $("#right-ye").on("click",function(){
        istrue=!istrue;
        $("#right-xs").css("display",istrue?"none":"block");
    });
    
    $("#container").click(function(){
    	$("#right-xs").css("display","none");
    	istrue=true;
    });
    //金额位置下拉后点击变色
    $(".pop-setting1 li").on("touchstart click", function () {
        $(".pop-setting1 li").removeClass("color-br-gray");
        $(this).addClass("color-br-gray");
    });
    
  //游戏规则弹框
    $('#yxgz').on('click', function () {
        three();
    });
    function three() {
        layer.open({
            type: 1,
            skin: "role_btn1",
            title: '游戏规则',
            area:'90%',
            btn:"确定",
            shadeClose: true,
            content: $("#guize_box")
        });
    }
    
    // tab切换==玩法1切换
    $(".scroll ul li").click(function () {
    	var flag = $(this).attr("isactives");
    	if(flag==1){
            $(this).addClass('active').siblings().removeClass('active');
            var index = $(this).index();
            number = index;
            $('.content_lc .bet-view').hide();
            $('.content_lc .bet-view:eq(' + index + ')').show();
    	}else{
    		layer.alert("此玩法在维护中……请选择其它玩法");
    	}
    });

    
    chipSz();//筹码设置

    showChip();//筹码选择
    
    chipFz();//筹码付值
    //清空
    $(".button-clear").on("click",function(){
    	clearData();
    });
    
    betBtn();//下注
}


/**
 * 彩种页面
 */
function lotteryPage(){
    $('#J_reorder').on('click', function () {
    	layer.open({
            type: 1,
            skin: "role_btn16",
            title: '彩票分类',
            area:'100%',
            btn:"关闭",
            shadeClose: true,
            content: $("#J_pop_setting")
        });
    });
}

/*
 * 个人盈亏
 */
function getGryk(){
	$.ajax({
		url : "lottery/gryk.do",
		type : "POST",
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
				getloginpage();
			}else if(data.status=="4"){
				$("#gryk div").html(data.message);
				layer.open({
    				type: 1,
    				skin: "role_btn5",
    				title: '个人盈亏',
    				area: ['320px', '400px'],
    				shadeClose: true,
    				content: $("#gryk")
    			});
			}
		},
		error : function(x, h, e) {
			
		}
	});
}

function getGrykUl(hybm){
	$.ajax({
		url : "lottery/grykul.do",
		type : "POST",
		data : {grykkssj : $("#grykkssj").val(), grykjssj : $("#grykjssj").val(), hybm : hybm},
		dataType : "json",
		success : function(data) {
			if(data.status=="6"){
				getloginpage();
			}else if(data.status=="4"){
				$("#grykContent").html(data.message);
			}
		},
		error : function(x, h, e) {
			
		}
	});
}

//清空数据
function clearData(){
	$(".lottery-bet .row .bet").removeClass("bet-choose");
	$("#doc-ipt-email-1").val("");
	$(".smallround").removeClass("menus-choose");
	$(".box_zs").html(0);
	$(".pm-body .lottery-ball").removeClass("solid");
}

/**
 * 筹码设置
 */
function chipSz() {
    $('#chip_btn').on('click', function () {
    	layer.open({
            type: 1,
            skin: "role_btn1",
            title: '请选择1~3个筹码',
            area: ['270','227'],
            shadeClose: true,
            content: $("#chip-model"),
            btn:"确定",
            yes:function(index){
            	$("#chipshwb").empty();
            	$("#chipshwb").append($(".am-modal-bd .ng-scope .chip_choosed").parent()[0].outerHTML)
            		          .append($(".am-modal-bd .ng-scope .chip_choosed").parent()[1].outerHTML)
            		          .append($(".am-modal-bd .ng-scope .chip_choosed").parent()[2].outerHTML);
            	chipFz();
            	layer.close(index);
    		}
        });
    });
}

/**
 * 筹码选择
 */
function showChip() {
    $(".am-modal-bd .ng-scope .chip").unbind("click").bind("click", function () {
        var cm = $(".chip-hide").size();
        if (cm <= 7 && $(this).hasClass('chip-hide')) {
            $(".chip_choosed").eq(3).toggleClass("chip_choosed chip-hide");
            $(this).toggleClass("chip_choosed chip-hide");
        } else {
            $(this).toggleClass("chip_choosed chip-hide");
        }
    });
}
/**
 * 筹码付值
 */
function chipFz(){
    //筹码付值
    $("#chipshwb .chip_choosed").on("click",function(){
    	var money = $("#doc-ipt-email-1").val();
    	var chip = $(this).attr("chips-data");
    	$("#doc-ipt-email-1").val(Number(money)+Number(chip));
    });
}
/**
 *  下注
 */
function betBtn(){
    $('#doc-prompt-toggle').click(function () {
    	localArray=[];
        var money = Number($("#doc-ipt-email-1").val());
        if (money <= 0) {
            layer.alert("请输入下注金额");
            return false;
        }
        if ($(".bet-choose").length <= 0) {
            layer.alert('请选择您要下注的选项');
            return false;
        }
        var pourList = '';
        var pourCount = 0;
        var cpbm = $("#cpbm").val();
        if(cpbm==20 || cpbm==21 || cpbm ==22 || cpbm == 23 || cpbm==43 || cpbm==44){
        	$(".bet-choose").each(function () {
                var title = $(this).attr("title");
                var odds = $(this).find(".bet-item").html();
                var item = $(this).find(".bet-content").html();
                pourCount++;
                var localData = new Object();
                localData.wfmc2 = $(this).attr("title");
                localData.wfmc3 = $(this).find(".bet-content").attr("title");
                localData.wfbm3 = $(this).find(".bet-item").attr("id");
                localData.pl = $(this).find(".bet-item").html();
                localData.tzhm = $(this).find(".bet-content").attr("title");
                localData.zs = 1;
                localData.price = money;
                localArray.push(localData);
            });
        }else{
        	$(".bet-choose").each(function () {
                var title = $(this).attr("title");
                var odds = $(this).find(".bet-item").html();
                var item = $(this).find(".bet-content").html();
                pourCount++;
                var localData = new Object();
                localData.wfmc2 = $(this).attr("title");
                localData.wfmc3 = $(this).find(".bet-content").html();
                localData.wfbm3 = $(this).find(".bet-item").attr("id");
                localData.hm ="";
                var wfbm3 = localData.wfbm3;
                switch(wfbm3){
                	case '401101001':
                	case '401101002':
                	case '401101003':
                	case '401201001':
                	case '401201002':
                	case '401201003':
                	case '401301001':
                	case '401301002':
                	case '401301003':
                	case '401301004':
                	case '401401001':
                	case '401401002':
                	case '401401003':
                	case '401401004':
                	case '401501001':
                	case '401501002':
                	case '401501003':
                	case '401501004':
                	case '401501005':
                	case '401501006':
                	case '401501007':
                	case '401501008':
                	case '401501009':
                	case '401501010':
                	case '401501011':
                		if($("#box"+wfbm3).find(".solid").length>0){
                         	var str = "";
                         	var num = 0;
                         	var len = $("#box"+wfbm3).find(".solid").length;
                         	$("#box"+wfbm3).find(".solid").each(function(){
                         		num ++;
                         		if(len == num ){
                         			str += $(this).html();
                         		}else{
                         			str += $(this).html()+",";
                         		}
                         	});
                         	localData.hm =str; 
                         }
                		localData.pl = $(this).find(".bet-item").html();
	                    localData.tzhm = $(this).find(".bet-content").html();
	                    localData.zs = $("#box"+wfbm3).find(".box_zs").html();
	                    localData.price = money;
	                    localArray.push(localData);
                		break;
                	default:
                		localData.pl = $(this).find(".bet-item").html();
	                    localData.tzhm = $(this).find(".bet-content").html();
	                    localData.zs = 1;
	                    localData.price = money;
	                    localArray.push(localData);
                		break;
                }
            });
        }
        layerOpenBox(localArray);
    });
}



/**
 * 彩票提交内容
 * @param localArray
 * @returns {String}
 */
function contentfn(localArray){
	var zhzje = Number($("#zhzje").html());
	var temp = "<table><thead><tr></th><th width='40%'></th><th width='20%'></th><th width='25%'></th><th width='12%'></th></tr></thead><tbody>";
	var allM=0;
	var zzs=0;
	var price=0;
	$.each(localArray,function(index,item){
		if(!isNaN(item.price) && item.price != 0 && item.price!=""){
			price = item.price;
			allM += Number(item.zs)*Number(item.price);
			zzs += Number(item.zs);
		}
		temp += "<tr>";
		temp += "<td>"+item.wfmc2+"-"+item.wfmc3+"</td><td><strong class='red'>"+item.pl+"*1</strong></td><td><input type='text' style='font-size:13px;padding:0;' onkeydown='return onlyNumber(event,this);' onkeyup='updatePirce(this.value,"+index+");' maxlength='6' value='"+price+"'></td><td><a href='javascript:;' onclick='deleteDate("+index+")'>删除</a></td>";
		temp += '</tr>';
	});
	temp += "</tbody></table>";
	if(allM>zhzje){
		temp += "<div class='tzdhk_box' style='padding:0 10px;'><div>注数：<strong class='red' id='infoLength'>"+zzs+"</strong>&nbsp;&nbsp;&nbsp;&nbsp;<span>总金额：<strong class='red' id='allM'>"+allM+"</strong><br/><span class='notMoney' style='color:#3c763d'>(余额不足，当前余额为<strong class='red refreshM'>"+zhzje+"</strong><i class='img-login-refresh icon'></i>,请前往<a href='javascript:javascript:getCztx();' style='color:red;text-decoration:underline'>充值</a>)</span></span></div></div>";
	}else{
		temp += "<div class='tzdhk_box' style='padding:0 10px;'><div>注数：<strong class='red' id='infoLength'>"+zzs+"</strong>&nbsp;&nbsp;&nbsp;&nbsp;<span>总金额：<strong class='red' id='allM'>"+allM+"</strong></div></div>";
		
	}
	return temp;
}

/**
 * 输入数字
 */
function onlyNumber(e,t){
	var code = null;
	//只能输入数字
	 if($.browser.msie){
		 code = event.keyCode;
	 }else{
		 code = e.which;
	 }
	 //48 - 57 上排数字键    96 - 105 数字键盘   8 删除键
	 if (((code > 47) && (code < 58)) || (code == 8) || (code >= 96 && code <= 105)) {  
         return true;  
     } else {  
         return false;  
     }  
}

function updatePirce(a,b){
	localArray[b].price=a;
	var zzs=0;
	var allM=0;
	$.each(localArray,function(index,item){
		if(!isNaN(item.price) && item.price != 0 && item.price!=""){
			price = item.price;
			allM += Number(item.zs)*Number(item.price);
			zzs +=Number(item.zs);
		}
	});
	$("#infoLength").empty();
	$("#infoLength").append(zzs);
	$("#allM").empty();
	$("#allM").append(allM);
}
//删除投注
function deleteDate(index){
	localArray.splice(index, 1);
	if(localArray.length<=0){
		layer.closeAll();
	}else{
		$("#model_body").empty();
		$("#model_body").append(contentfn(localArray));
	}
}
//投注明细
function layerOpenBox(localArray){
	var content = contentfn(localArray);
	layer.open({
		type : 1, //page层
		skin: "role_btn1",
        area: '90%',
		title : '下注明细(请确认注单)',
		shade : 0.6, //遮罩透明度
		scrollbar : false,
		moveType : 0, //拖拽风格，0是默认，1是传统拖动
		shift : 1, //0-6的动画形式，-1不开启
		content : "<div id='model_body'>"+content+"</div>",
		btn: ['确定', '取消'],
		yes:function(index){
			submitfn(index,localArray);
			localArray=[];
			clearData();
		},
		btn2:function(index){
			layer.close(index);
			localArray=[];
			clearData();
		},
		cancel:function(index){
			layer.close(index);
			localArray=[];
			clearData();
		}
	});
}
//提交
function submitfn(layerindex,localArray){
	var tzzje = 0;
	var flag = true;
	$.each(localArray,function(index,item){
		if(isNaN(item.price) || item.price <= 0 || item.price=="" ){
			layer.alert("金额输入有错误，请重新输入");
			flag=false;
		}else{
			tzzje += Number(item.zs)*Number(item.price);
		}
	});
	if(!flag){
		return;
	}
	var zhzje = $("#zhzje").text();
	if(tzzje>zhzje){
		layer.alert("金额不足！！");
		return;
	}
	var cpqh = $(".curIssueNumberId").html();
	var cpbm = $("#cpbm").val();
	var jsonrow = JSON.stringify(localArray);
	load_open();
	$.post("lottery/save.do",{"jsonrow":jsonrow,"tzzje":tzzje,"cpbm":cpbm,"cpqh":cpqh},function(json){
		load_close();
		if(json==1){
			   getHyje();//得到会员金额
			   div_tzcg();
		   }else if(json==2){
			   layer.alert("投注还没开始，请耐心等待");//投注还没开始，请耐心等待
		   }else if(json==3){
			   layer.alert("投注失败！！期号错误，请跟管理员联系！");//投注失败！！期号错误，请跟管理员联系！
		   }else if(json==4){
			   layer.alert("非法号码！");
		   }else if(json==6){
			   layer.alert("投注失败,健康娱乐，请投少点");
		   }else if(json==7){
			   layer.alert("投注失败");
		   }else if(json==8){
			   getloginpage();
		   }else if(json==9){
			   layer.alert("金额错误，请与管理员联系！");
		   }else{
			   layer.alert("投注错误，重新刷新或与管理员联系");
		   }
	});
}

/**
 * 投注成功弹出层
 */
function div_tzcg() {
    layer.open({
        type: 1,
        skin: "role_btn2",
        title: '提醒',
        area: ['85%'],
        shadeClose: true,
        content: $("#tjcg"),
        time : 1000
    });
}

/**
 * 彩票数据初始化（期号、时间、开奖号码）
 */
function lotteryDateInit(){
	var cpbm = $("#cpbm").val();
	getCpqhAndTime(cpbm);
}

function setCpqhKjhm(message){
	var messages = message.split("|");
	$(".per-period").html(messages[1]+"期");
	var obj = messages[2].split(",");
	var str='';
	var cpbm = $("#cpbm").val(); 
	if(cpbm==17 || cpbm==18 || cpbm == 19){
		str = "<span class='round data-"+obj[0]+"'>"+obj[0]+"</span>"
			 +"<span class='round data-"+obj[1]+"'>"+obj[1]+"</span>"
			 +"<span class='round data-"+obj[2]+"'>"+obj[2]+"</span>"
		     +"<span class='round data-"+obj[3]+"'>"+obj[3]+"</span>"
		     +"<span class='round data-"+obj[4]+"'>"+obj[4]+"</span>";
	}else if(cpbm==20 || cpbm==21 || cpbm == 22 || cpbm==23 || cpbm==43 || cpbm ==44){
		str = "<span class='round-10 data-"+obj[0]+"' style='width:37px;height:37px;line-height:37px;background-size:37px'>"+obj[0]+"</span>"
			 +"<span class='round-10 data-"+obj[1]+"' style='width:37px;height:37px;line-height:37px;background-size:37px'>"+obj[1]+"</span>"
		     +"<span class='round-10 data-"+obj[2]+"' style='width:37px;height:37px;line-height:37px;background-size:37px'>"+obj[2]+"</span>";
	}else if(cpbm==37 || cpbm==42){
		str = "<span class='round-6 data-"+obj[0]+"'>"+obj[0]+"</span>"
			 +"<span class='round-6 data-"+obj[1]+"'>"+obj[1]+"</span>"
		     +"<span class='round-6 data-"+obj[2]+"'>"+obj[2]+"</span>"
		     +"<span class='round-6 data-"+obj[3]+"'>"+obj[3]+"</span>"
		     +"<span class='round-6 data-"+obj[4]+"'>"+obj[4]+"</span>"
		     +"<span class='round-6 data-"+obj[5]+"'>"+obj[5]+"</span>"
		     +"<span class='round-6 data-"+obj[6]+"'>"+obj[6]+"</span>"
		     +"<span class='round-6 data-"+obj[7]+"'>"+obj[7]+"</span>"
		     +"<span class='round-6 data-"+obj[8]+"'>"+obj[8]+"</span>"
		     +"<span class='round-6 data-"+obj[9]+"'>"+obj[9]+"</span>";
	}else if(cpbm==39){
		str = "<span class='round data-"+obj[0]+"'>"+obj[0]+"</span>"
			 +"<span class='round data-"+obj[1]+"'>"+obj[1]+"</span>"
		     +"<span class='round data-"+obj[2]+"'>"+obj[2]+"</span>"
		     +"<span class='round data-"+obj[3]+"'>"+obj[3]+"</span>"
		     +"<span class='round data-"+obj[4]+"'>"+obj[4]+"</span>"
		     +"<span class='round data-"+obj[5]+"'>"+obj[5]+"</span>"
		     +"<span class='round data-"+obj[6]+"'>"+obj[6]+"</span>"
		     +"<span class='round data-"+obj[7]+"'>"+obj[7]+"</span>";
	}else if(cpbm==41 || cpbm==45){
		str = "<span class='round data-1'>"+obj[0]+"</span>"
			 +"<span class='round data-1'>"+obj[1]+"</span>"
		     +"<span class='round data-1'>"+obj[2]+"</span>"
		     +"<span class='round data-none'>=</span>"
		     +"<span class='round data-1'>"+(Number(obj[0])+Number(obj[1])+Number(obj[2]))+"</span>";
	}
	$("#result-balls").html(str);
}

//取得开奖期号和时间
function getCpqhAndTime1(cpbm) {
	window.clearInterval(onetime);
	$.post("lottery/findCpqhAndTime.do", {"cpbm" : cpbm}, function(data) {
		var obj = JSON.parse(data);
		$(".curIssueNumberId").html(obj.CPQH);
		timer(parseInt(obj.CTIME), obj.CPQH,cpbm);// 倒计时总秒数量;
	});
}
//取得开奖期号和时间
function getCpqhAndTime(cpbm) {
	window.clearInterval(onetime);
	$.post("lottery/findCpqhAndTime.do", {"cpbm" : cpbm}, function(data) {
		var obj = JSON.parse(data);
		var str = "";
		var str1 = "";
		$(".per-period").html(obj.KJQH + "期");
		if(cpbm==17 || cpbm==18 || cpbm == 19){
			if (obj.HM1 != null) {
				str = "<span class='round data-"+obj.HM1+"'>"+obj.HM1+"</span>"
					 +"<span class='round data-"+obj.HM2+"'>"+obj.HM2+"</span>"
					 +"<span class='round data-"+obj.HM3+"'>"+obj.HM3+"</span>"
				     +"<span class='round data-"+obj.HM4+"'>"+obj.HM4+"</span>"
				     +"<span class='round data-"+obj.HM5+"'>"+obj.HM5+"</span>";
			}else{
					str += "<span style='width:100%'> 正在开奖中……</span>";
			}
		}else if(cpbm==20 || cpbm==21 || cpbm == 22 || cpbm==23 || cpbm==43 || cpbm ==44){
			if (obj.HM1 != null) {
				str = "<span class='round-10 data-"+obj.HM1+"' style='width:37px;height:37px;line-height:37px;background-size:37px'>"+obj.HM1+"</span>"
					 +"<span class='round-10 data-"+obj.HM2+"' style='width:37px;height:37px;line-height:37px;background-size:37px'>"+obj.HM2+"</span>"
				     +"<span class='round-10 data-"+obj.HM3+"' style='width:37px;height:37px;line-height:37px;background-size:37px'>"+obj.HM3+"</span>";
			}else{
					str += "<span style='width:100%'> 正在开奖中……</span>";
			}
		}else if(cpbm==37 || cpbm==42){
			if (obj.HM1 != null) {
				str = "<span class='round-6 data-"+obj.HM1+"'>"+obj.HM1+"</span>"
					 +"<span class='round-6 data-"+obj.HM2+"'>"+obj.HM2+"</span>"
				     +"<span class='round-6 data-"+obj.HM3+"'>"+obj.HM3+"</span>"
				     +"<span class='round-6 data-"+obj.HM4+"'>"+obj.HM4+"</span>"
				     +"<span class='round-6 data-"+obj.HM5+"'>"+obj.HM5+"</span>"
				     +"<span class='round-6 data-"+obj.HM6+"'>"+obj.HM6+"</span>"
				     +"<span class='round-6 data-"+obj.HM7+"'>"+obj.HM7+"</span>"
				     +"<span class='round-6 data-"+obj.HM8+"'>"+obj.HM8+"</span>"
				     +"<span class='round-6 data-"+obj.HM9+"'>"+obj.HM9+"</span>"
				     +"<span class='round-6 data-"+obj.HM10+"'>"+obj.HM10+"</span>";
			}else{
				str += "<span style='width:100%'> 正在开奖中……</span>";
			}
		}else if(cpbm==39){
			if (obj.HM1 != null) {
				str = "<span class='round data-"+obj.HM1+"'>"+obj.HM1+"</span>"
					 +"<span class='round data-"+obj.HM2+"'>"+obj.HM2+"</span>"
				     +"<span class='round data-"+obj.HM3+"'>"+obj.HM3+"</span>"
				     +"<span class='round data-"+obj.HM4+"'>"+obj.HM4+"</span>"
				     +"<span class='round data-"+obj.HM5+"'>"+obj.HM5+"</span>"
				     +"<span class='round data-"+obj.HM6+"'>"+obj.HM6+"</span>"
				     +"<span class='round data-"+obj.HM7+"'>"+obj.HM7+"</span>"
				     +"<span class='round data-"+obj.HM8+"'>"+obj.HM8+"</span>";
			}else{
				str += "<span style='width:100%'> 正在开奖中……</span>";
			}
		}else if(cpbm==40){
			if (obj.HM1 != null) {
				str = "<span class='round bcolor-"+obj.COLOR1+"'>"+obj.HM1+"<p>"+obj.SX1+"</p></span>"
					 +"<span class='round bcolor-"+obj.COLOR2+"'>"+obj.HM2+"<p>"+obj.SX2+"</p></span>"
				     +"<span class='round bcolor-"+obj.COLOR3+"'>"+obj.HM3+"<p>"+obj.SX3+"</p></span>"
				     +"<span class='round bcolor-"+obj.COLOR4+"'>"+obj.HM4+"<p>"+obj.SX4+"</p></span>"
				     +"<span class='round bcolor-"+obj.COLOR5+"'>"+obj.HM5+"<p>"+obj.SX5+"</p></span>"
				     +"<span class='round bcolor-"+obj.COLOR6+"'>"+obj.HM6+"<p>"+obj.SX6+"</p></span>"
				     +"<span class='round bcolor-blue'>+<p style='color:transparent'>+</p></span>"
				     +"<span class='round bcolor-"+obj.COLOR7+"'>"+obj.HM7+"<p>"+obj.SX7+"</p></span>";
				
			}else{
				str += "<span style='width:100%'> 正在开奖中……</span>";
			}
		}else if(cpbm==41 || cpbm==45){
			if (obj.HM1 != null) {
				str = "<span class='round data-1'>"+obj.HM1+"</span>"
					 +"<span class='round data-1'>"+obj.HM2+"</span>"
				     +"<span class='round data-1'>"+obj.HM3+"</span>"
				     +"<span class='round data-none'>=</span>"
				     +"<span class='round data-1'>"+(Number(obj.HM1)+Number(obj.HM2)+Number(obj.HM3))+"</span>";
			}else{
				str += "<span style='width:100%'> 正在开奖中……</span>";
			}
		}
		$("#result-balls").html(str);
		$("#result-detail").html();
		$(".curIssueNumberId").html(obj.CPQH);
		timer(parseInt(obj.CTIME), obj.CPQH,cpbm);// 倒计时总秒数量;
	});
}

//倒计时
function timer(intDiff, cpqh,cpbm) {
	onetime = window.setInterval(function() {
		var day = 0, hour = 0, minute = 0, second = 0;// 时间默认值
//		console.log(intDiff);
		if(intDiff<=0) $('#close-time').html("开奖...");
		var h = Math.floor(intDiff/3600);
		var m = Math.floor((intDiff-3600*h)/60);
		var s = intDiff%60;
		$('#close-time').html((h>0 ? (h<10 ? "0"+h : h)+":" : "")+(m<10 ? "0"+m : m)+ ":"+(s<10 ? "0"+s : s));
		intDiff--;
		if (intDiff >= 300) {
			if (intDiff == 2400) {
				getCpqhAndTime1(cpbm);// 取得开奖期号和时间
			} else if (intDiff == 1600) {
				getCpqhAndTime1(cpbm);// 取得开奖期号和时间
			} else if (intDiff == 800) {
				getCpqhAndTime1();// 取得开奖期号和时间
			} else if (intDiff == 300) {
				getCpqhAndTime1(cpbm);// 取得开奖期号和时间
			}
		} else if (intDiff == 0) {
			getCpqhBox(cpqh,cpbm);// 倒计时提示框
			setTimeout(getCpqhAndTime1(cpbm),5000);// 取得开奖期号和时间
		}
	}, 1000);
}

function getCpqhBox(cpqh,cpbm) {
	layer.open({
	        type: 1,
	        skin: "role_btn88",
	        area: '60%',
	        btn:'知道了',
	        shadeClose: true,
	        content: $("#djs-tk").empty().append("<p style='color:#666;'>第<i style='font-style:normal;'>"+cpqh+"</i>期<br/>投注截止</p>"+
	        		"<em style='display:block;color:#999;font-size:50px;font-style:normal;padding:30px 0;' id='cqssc_qhjzdt'></em>"+
	        		"<p style='font-size:12px;'>投注时请注意当前期号</p>"),
			success: function(layero, index){
				 timerForBox();
			 },
			end:function(layero, index){
				$('#djs-tk').empty();
				window.clearInterval(boxtime);
			},
			time : 5000
		// 10秒后自动关闭
		});
}

var boxtime=null;
//倒计时==框倒计时
function timerForBox() {
	var intDiff = 5;
	boxtime = window.setInterval(function() {
		var second = 0;// 时间默认值
		if (intDiff > 0) {
			second = Math.floor(intDiff);
		}
		intDiff--;
		$('#cqssc_qhjzdt').empty();
		$('#cqssc_qhjzdt').append("<i>" + second + "</i>");
		if (intDiff == 0) {
			window.clearInterval(boxtime);
			$("#djs-tk").empty();
		}
	}, 1000);
}

/**
 * 得到开奖记录
 * @param cpbm
 */
function getKjhmList(cpbm) {
	$.ajax({
		url : "lottery/findKjhmNoPage.do",
		data:{"cpbm":cpbm},
		type : "POST",
		dataType : "html",
		success : function(data) {
			$(".kj_box").html(data);
		},
		error : function(x, h, e) {

		}
	});
};


/**
 * 得到彩票玩法3文本
 */
function getSscTextWf3(cpbm){
	load_open();
	$.post("lottery/getSscTextWf3.do", {"cpbm" : cpbm}, function(data) {
		load_close();
		$(".content_lc").html(data);
		initButtonWf3Text(); // 选择下注项
	});
}

function initButtonWf3Text(){
	var cpbm = $("#cpbm").val();
	if(cpbm==40){
	    lhcButtonInit();//六合彩按钮初始化
	}else{
	    // 选择下注项
	    $(".lottery-bet .row .bet").click(function () {
	    	var _index = $(this).parents(".bet-view").attr("data-index");
	    	var flag = $(".smallround:eq(" + _index + ")").parents(".nav").attr("isactives");
	    	if(flag==1){
	    	    $(this).toggleClass("bet-choose");
	 	        $(".pour-num").html($(".bet-choose").length <= 0 ? 0 : $(".bet-choose").length);
	 	        $(this).parents(".bet-view").find(".bet-choose").length > 0 ? $(".smallround:eq(" + _index + ")").addClass("menus-choose") : $(".smallround:eq(" + _index + ")").removeClass("menus-choose");
	    	}else{
	    		layer.alert("此类玩法正在维护中……。请选择其它玩法");
	    	}
	       
	    });
	}
}

//////////////////////////////////////六合彩////////////////////////////////////////////////////

//递归函数
function f(n){
	if(n<=1){
		return 1;
	}else{
		return n*f(n-1);
	}
}
/**
 * 六合彩按钮初始化
 */
function lhcButtonInit(){
	$('.lottery-bet .row .bet').on('click', function () {
		var _index = $(this).parents(".bet-view").attr("data-index");
    	var flag = $(".smallround:eq(" + _index + ")").parents(".nav").attr("isactives");
    	if(flag==1){
			var wfbm3 = $(this).find(".bet-item").attr("id");
			switch(wfbm3){
		    	case '401101001':
		    	case '401101002':
		    	case '401101003':
		    	case '401201001':
		    	case '401201002':
		    	case '401201003':
		    	case '401301001':
		    	case '401301002':
		    	case '401301003':
		    	case '401301004':
		    	case '401401001':
		    	case '401401002':
		    	case '401401003':
		    	case '401401004':
		    	case '401501001':
		    	case '401501002':
		    	case '401501003':
		    	case '401501004':
		    	case '401501005':
		    	case '401501006':
		    	case '401501007':
		    	case '401501008':
		    	case '401501009':
		    	case '401501010':
		    	case '401501011':
		    		box(wfbm3);
		    		var wfpl2 = $(this).find(".bet-item").attr("wfpl2");
		    		$("#box"+wfbm3).parents(".role_btn10").find(".box_pl").html(wfpl2);
		            var b = $("#box"+wfbm3).parents(".role_btn10").find(".box_zs").html();
		            if(b==0){
		            	$("#box"+wfbm3).parents(".role_btn10").find(".layui-layer-btn .layui-layer-btn0").addClass("buttoncolor");
		            }else{
		            	$("#box"+wfbm3).parents(".role_btn10").find(".layui-layer-btn .layui-layer-btn0").removeClass("buttoncolor");
		            }
		    		break;
		    	default:
		    		$(this).toggleClass("bet-choose");
			        $(".pour-num").html($(".bet-choose").length <= 0 ? 0 : $(".bet-choose").length);
			        var _index = $(this).parents(".bet-view").attr("data-index");
			        $(this).parents(".bet-view").find(".bet-choose").length > 0 ? $(".smallround:eq(" + _index + ")").addClass("menus-choose") : $(".smallround:eq(" + _index + ")").removeClass("menus-choose");
				}
			}else{
				layer.alert("此类玩法正在维护中……。请选择其它玩法");
			}
    });
   
    
    $(".pm-body .lottery-ball").click(function () {
        $(this).toggleClass("solid");
        var a = $(this).parents(".role_btn10").find(".pm-body .lottery-ball.solid").length;
        var b = 0;
        var c = $(this).parents(".role_btn10").find(".promptbox").attr("id");
        if(c=="box401101001"){//平码
        	 if(a>=2){
             	b = f(a)/(f(a-2)*f(2));
             	if(b>=35){
             		pmts();
                 	return;
             	}
             }
        }else if(c=="box401101002"){
        	 if(a>=3){
             	b = f(a)/(f(a-3)*f(3));
             	if(b>=35){
             		pmts();
                 	return;
             	}
             }
        }else if(c=="box401101003"){
        	 if(a>=3){
             	b = f(a)/(f(a-3)*f(3));
             	if(b>=35){
             		pmts();
                 	return;
             	}
             }
        }else if(c=="box401201001"){//定肖中特
        	 if(a>=4){
              	b = f(a)/(f(a-4)*f(4));
              }
        }else if(c=="box401201002"){
	       	 if(a>=5){
	           	b = f(a)/(f(a-5)*f(5));
	          }
	    }else if(c=="box401201003"){
	    	if(a>=6){
	          	b = f(a)/(f(a-6)*f(6));
	          }
	    }else if(c=="box401301001"){//平特肖
	    	if(a>=1){
	          	b = f(a)/(f(a-1)*f(1));
	          }
	    }else if(c=="box401301002"){
	    	if(a>=2){
	          	b = f(a)/(f(a-2)*f(2));
	          }
	    }else if(c=="box401301003"){
	    	if(a>=3){
	          	b = f(a)/(f(a-3)*f(3));
	          }
	    }else if(c=="box401301004"){
	    	if(a>=4){
	          	b = f(a)/(f(a-4)*f(4));
	          }
	    }else if(c=="box401401001"){//平特尾
	    	if(a>=1){
	          	b = f(a)/(f(a-1)*f(1));
	          }
	    }else if(c=="box401401002"){
	    	if(a>=2){
	          	b = f(a)/(f(a-2)*f(2));
	          }
	    }else if(c=="box401401003"){
	    	if(a>=3){
	          	b = f(a)/(f(a-3)*f(3));
	          }
	    }else if(c=="box401401004"){
	    	if(a>=4){
	          	b = f(a)/(f(a-4)*f(4));
	          }
	    }else if(c=="box401501001"){//不中
	    	if(a>=5){
	          	b = f(a)/(f(a-5)*f(5));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501002"){//不中
	    	if(a>=6){
	          	b = f(a)/(f(a-6)*f(6));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501003"){//不中
	    	if(a>=7){
	          	b = f(a)/(f(a-7)*f(7));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501004"){//不中
	    	if(a>=8){
	          	b = f(a)/(f(a-8)*f(8));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501005"){//不中
	    	if(a>=9){
	          	b = f(a)/(f(a-9)*f(9));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501006"){//不中
	    	if(a>=10){
	          	b = f(a)/(f(a-10)*f(10));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501007"){//不中
	    	if(a>=11){
	          	b = f(a)/(f(a-11)*f(11));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501007"){//不中
	    	if(a>=11){
	          	b = f(a)/(f(a-11)*f(11));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501008"){//不中
	    	if(a>=12){
	          	b = f(a)/(f(a-12)*f(12));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501009"){//不中
	    	if(a>=13){
	          	b = f(a)/(f(a-13)*f(13));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501010"){//不中
	    	if(a>=14){
	          	b = f(a)/(f(a-14)*f(14));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }else if(c=="box401501011"){//不中
	    	if(a>=15){
	          	b = f(a)/(f(a-15)*f(15));
	          	if(b>=1000){
	          		ptbzts();
                 	return;
             	}
	          }
	    }
        $(this).parents(".role_btn10").find(".box_zs").html(b);
        if(b==0){
        	$(this).parents(".role_btn10").find(".layui-layer-btn .layui-layer-btn0").addClass("buttoncolor");
        }else{
        	$(this).parents(".role_btn10").find(".layui-layer-btn .layui-layer-btn0").removeClass("buttoncolor");
        }
        
    });
}
/**
 * 六合彩号码选择提示框
 * @param wfbm3
 */
function  box(wfbm3) {
    layer.open({
        type: 1,
        skin: "role_btn10",
        area:'90%',
        shadeClose: true,
        content: $("#box"+wfbm3),
        btn:["确定","取消"],
        yes:function(index){
        	var b = $("#box"+wfbm3).parents(".role_btn10").find(".box_zs").html();
        	if(b==0){
        		$("#"+wfbm3).parents(".bet").removeClass("bet-choose");
        		$(".pour-num").html($(".bet-choose").length <= 0 ? 0 : $(".bet-choose").length);
        		var _index = $("#"+wfbm3).parents(".bet-view").attr("data-index");
    	        $("#"+wfbm3).parents(".bet-view").find(".bet-choose").length > 0 ? $(".smallround:eq(" + _index + ")").addClass("menus-choose") : $(".smallround:eq(" + _index + ")").removeClass("menus-choose");
        	}else{
        		$("#"+wfbm3).parents(".bet").addClass("bet-choose");
    	        $(".pour-num").html($(".bet-choose").length <= 0 ? 0 : $(".bet-choose").length);
    	        var _index = $("#"+wfbm3).parents(".bet-view").attr("data-index");
    	        $("#"+wfbm3).parents(".bet-view").find(".bet-choose").length > 0 ? $(".smallround:eq(" + _index + ")").addClass("menus-choose") : $(".smallround:eq(" + _index + ")").removeClass("menus-choose");
            	layer.close(index);
        	}
        },
	    btn2:function(index){
	    	$("#box"+wfbm3).parents(".role_btn10").find(".box_zs").html(0);
	    	$("#box"+wfbm3).parents(".role_btn10").find(".pm-body .lottery-ball").removeClass("solid");
	    	$("#"+wfbm3).parents(".bet").removeClass("bet-choose");
    		$(".pour-num").html($(".bet-choose").length <= 0 ? 0 : $(".bet-choose").length);
    		var _index = $("#"+wfbm3).parents(".bet-view").attr("data-index");
	        $("#"+wfbm3).parents(".bet-view").find(".bet-choose").length > 0 ? $(".smallround:eq(" + _index + ")").addClass("menus-choose") : $(".smallround:eq(" + _index + ")").removeClass("menus-choose");
			layer.close(index);
		}
    });
}

/**
 * 平码提示
 */
function pmts(){
	layer.open({
        type: 1,
        skin: "role_btn12",
        area:'90%',
        shadeClose: true,
        content: $("#pmts_box"),
        time : 1000
    });
};
/**
 * 平特不中提示
 */
function ptbzts(){
	layer.open({
        type: 1,
        skin: "role_btn12",
        area:'90%',
        shadeClose: true,
        content: $("#ptbzts_box"),
        time : 1000
    });
};
///////////////////////////////////////////////////////////充值////////////////////////////////////////////////////////////////////////////
//提交充值
function submitCz(zfbm,czfw,online){
	var czfws = czfw.split("-");
	var money = $(".coll_body:visible .number input").val();
	if(Number(money)>=Number(czfws[0]) && Number(money)<=Number(czfws[1])){
			load_open();
			$.post("yhzx/selectCZXQmb.do", {"SJD":"SJD","yh":zfbm,"czje":money}, function(result){
				load_close();
				var obj = JSON.parse(result);
				if(online==0){
//					if(obj.ewm != null && obj.ewm !='' && obj.ewm != undefined){
//						$("#hymc3").html(obj.hymc);
//						$("#zfmc3").html(obj.zfmc);
//						$("#skr3").html(obj.skr);
//						$("#skzh3").html(obj.skzh);
//						$("#czdh3").html(obj.czdh);
//						$("#copy3_xm").attr("data-clipboard-text", obj.skr);
//						$("#copy3_zh").attr("data-clipboard-text", obj.skzh);
//						$("#copy3").attr("data-clipboard-text", obj.czdh);
//						$("#czje3").html(obj.czje);
//						$("#ewm").removeAttr("src");
//						$("#ewm").attr("src",obj.ewm);
//						$("#save").attr("href",obj.ewm);
//						$("#czdiv1").hide();
//						$("#czdiv3").show();
//						layer.alert("充值申请已提交成功！");
//					}else{
//						$("#hymc2").html(obj.hymc);
//						$("#zfmc2").html(obj.zfmc);
//						$("#khyh2").html(obj.khyh);
//						$("#skr2").html(obj.skr);
//						$("#skzh2").html(obj.skzh);
//						$("#czdh2").html(obj.czdh);
//						$("#copy2_xm").attr("data-clipboard-text", obj.skr);
//						$("#copy2_zh").attr("data-clipboard-text", obj.skzh);
//						$("#copy2").attr("data-clipboard-text", obj.czdh);
//						$("#czje2").html(obj.czje);
//						$("#czdiv1").hide();
//						$("#czdiv2").show();
//						layer.alert("充值申请已提交成功，请把订单号填写附言中！");
//					}
					layer.alert("充值申请已提交成功！");
				}else{
					$("#hymc4").html(obj.hymc);
					$("#ddmc4").html(obj.ddmc);
					$("#czdh4").html(obj.czdh);
					$("#czje4").html(obj.czje);
					$("#spms4").html(obj.spms);
					$("#czdiv1").hide();
					$("#czdiv4").show();
				}
			});
	}else{
		layer.alert("输入范围错误，请重新输入");
	}
}

function czdivfn(){
	$("#czdiv1").show();
	$("#czdiv2").hide();
	$("#czdiv3").hide();
};
