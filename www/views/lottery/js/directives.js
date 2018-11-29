angular.module('ionicz.lottery')

.directive('myPopover', function() {
	return {
		restrict: 'C',
		scope: true,
		link: function(scope, element, attrs) {
			element.find('a').bind('click', function() {
				scope.popover.hide();
			});
		}
	}
})

.directive('scrollbarX', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			if(element.attr('scrollbar-x') == 'false') {
				element.removeClass('scroll-x');
			}
		}
	}
})

/**
 * 下注项指令
 * 该指令实现以下功能：
 * 1：根据元素上填写的data-id填充该玩法的赔率显示在页面；
 * 2：记忆选中状态，如果之前是选中状态，切换回来默认选中；
 * 3：点击事件，点击切换选中和未选中
 */
.directive('bet', function(Lottery) {
	return {
		restrict: 'C',
		scope: true,
		link: function(scope, element, attrs) {
			var dataId = element.attr('data-id');
			var oddsElement = angular.element(element[0].querySelector('.bet-item'));
			var play = Lottery.getPlay(dataId);
			if(!play) {
				oddsElement.html('--');
			}
			else {
				if(scope.isExist(dataId)) {
					element.addClass('bet-choose');
					element.addClass('highlight');
				}
				
				oddsElement.html(play.odds);
				
				element.bind('click', function() {
					if(scope.shareData.lotteryState != 1) {
						return;
					}
					var selected = element.hasClass('bet-choose');
					// 如果已经是选中状态，移除
					if(selected) {
						scope.removeDataId(dataId);
					}
					else {
						scope.addDataId(dataId);
					}
					
					element.toggleClass('bet-choose highlight');
				});
			}
		}
	}
})

.directive('subBet', function(Lottery) {
	return {
		restrict: 'C',
		scope: false,
		link: function(scope, element, attrs) {
			var dataId = element.attr('data-id');
			
			var play = Lottery.getPlay(dataId);
			if(play) {
				var oddsElement = angular.element(element[0].querySelector('.bet-item'));
				oddsElement.html(play.odds);
			}
			
			element.bind('click', function() {
				if(scope.shareData.lotteryState != 1) {
					return;
				}
				var selected = element.hasClass('bet-choose');
				var flag = false;
				// 如果已经是选中状态，移除
				if(selected) {
					flag = scope.removeNum(dataId);
				}
				else {
					flag = scope.addNum(dataId);
				}
				
				if(flag) {
					element.toggleClass('bet-choose');
				}
			});
		}
	}
})



.directive('realdshow', function($rootScope,  $filter, $timeout, $interval, $log, Tools, Lottery, My) {
	return {
		restrict: 'C',
		scope: true,
		template: 
		'<div class="col-sm-12" ng-repeat="betstatus in BetStatusList">' +
			'<div class="timeBox" data="{{betstatus.uid}}" style="width:100%; text-align: center; padding-top:20px">' +
				'<span>{{betstatus.actiontime}}</span>' +
			'</div>' +
			'<div class="robotmsg row {{betstatus.uid}}" style="display:flex">' +
				'<div class="col-sm-2 col-md-2">' +
					'<img src="{{base_url}}/assets/img/{{betstatus.imghead}}" alt="" width="50px" height="50px">' +
				'</div>' +
				'<div class="col-sm-10 col-md-10" style="margin: 0; padding: 10;">' +
					'<span>{{betstatus.username}}<em class="levelImg5"></em></span>' +
					'<table class="c_table">' +
						'<thead class="{{betstatus.mybet_cls}}">' +
							'<tr style="height: 33px; border-bottom: 1px solid #eee;">' +
								'<th>期号</th>' + 
								'<th>玩法</th>' +
								'<th>金额</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
							'<tr style="height: 33px; border-bottom: 1px solid #eee;">' +
								'<td>{{betstatus.actionno}}</td>' +
								'<td class="orderTwoTd" style="color: rgb(243, 89, 106);">{{betstatus.groupname}}_{{betstatus.actiondata}}</td>' +
								'<td style="color: rgb(243, 89, 106);">' +
									'<span>{{betstatus.money}}</span>' +
									'<s class="qian_icon"></s>' +
								'</td>' +
							'</tr>' +
							'<tr style="background-color: #fbfbfb; border: 0; height: 33px;">' +
								'<td colspan="2">' +
									'<div class="total">共&nbsp;<span style="color:#f00">{{betstatus.totalnum}}</span>&nbsp;注，金额&nbsp;<span style="color:#f00">{{betstatus.money}}</span>&nbsp;<s class="qian_icon"></s></div>' +
								'</td>' +
								'<td>' +
									'<button type="button" ng-click="openDlg({{betstatus}})" class="followbet ivu-btn" data-toggle="modal" data-taget="#modal_dlg_gentou"><span>跟投</span></button>' +
									'<button type="button" class="followbet ivu-btn" ng-show="{{betstatus.mybet}}"><span>撤单</span></button>' +
								'</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>' +
				'</div>' +
			'</div>' +
		'</div>',

		replace: true,
		link: function(scope, element, attrs) {


			var counter = 0;
			var gameId = scope.gameId;
			var preTime = null;

			scope.BetStatusList = [];
			var scroller = document.getElementById("a_scr");


			console.log(scope.BetStatusList);

			function ConvertUnixToDateTime(unixtimestamp){
				var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				var date = new Date(unixtimestamp*1000);
				// Year
				var year = date.getFullYear();
				var month = months_arr[date.getMonth()];
				var day = date.getDate();
				var hours = date.getHours();
				var minutes = "0" + date.getMinutes();
				var seconds = "0" + date.getSeconds();

				// Display date time in MM-dd-yyyy h:m:s format
				var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
				
				return convdataTime;
			}


			function startMainTimer() {
				mainTimer = $interval(function() {
					$log.debug('-----------mainTimer----------');

					Lottery.getRealStatus(function(data) {

						 console.log(data);
						// $scope.unbalancedMoney = data.unbalancedMoney;

						for(var i=0; i<data.length; i++){
							var mecheck = false;
							var mecheckcls = "no";
							var imgname = "head5.png";
							if(My.getUserId() == data[i].uid){
								mecheck = true;
								mecheckcls = "c_table_thead_me";
								imgname = "head6.png";
							}
							scope.BetStatusList.push({imghead: imgname, mybet_cls: mecheckcls, mybet: mecheck, uid: data[i].uid, betid: data[i].id, username: data[i].username, money: data[i].money, totalnum: data[i].totalNums, actionno: data[i].actionNo, groupname: data[i].Groupname, actiondata: data[i].actionData, actiontime: ConvertUnixToDateTime(data[i].actionTime)});
						}
						
						
					}, gameId, preTime);
					

					Lottery.getServerCurrenttime(function(data){
						preTime = parseInt(data);
						console.log(preTime);
					});	

					scroller.scrollTop = scroller.scrollHeight;

					// scope.BetStatusList.push({id: "v", money: counter+1});
					// counter++;
					// scroller.scrollTop = scroller.scrollHeight;
				}, 3000);
			};

			scope.$on('lotteryInited', function($scope) {
				$log.debug('------------lotteryInited------------');
				counter = 0;
				Lottery.getServerCurrenttime(function(data){
					preTime = parseInt(data);
					console.log(preTime);
				});
				startMainTimer();
			});
			
			scope.$on('lotteryDestroy', function($scope) {
				$log.debug('------------lotteryDestroy------------');
				$interval.cancel(mainTimer);
			});

			// var dataId = element.attr('data-id');
			
			// var play = Lottery.getPlay(dataId);
			// if(play) {
			// 	var oddsElement = angular.element(element[0].querySelector('.bet-item'));
			// 	oddsElement.html(play.odds);
			// }
			
			// element.bind('click', function() {
			// 	if(scope.shareData.lotteryState != 1) {
			// 		return;
			// 	}
			// 	var selected = element.hasClass('bet-choose');
			// 	var flag = false;
			// 	// 如果已经是选中状态，移除
			// 	if(selected) {
			// 		flag = scope.removeNum(dataId);
			// 	}
			// 	else {
			// 		flag = scope.addNum(dataId);
			// 	}
				
			// 	if(flag) {
			// 		element.toggleClass('bet-choose');
			// 	}
			// });
		}
	}
})

.directive('perio', function($rootScope, $filter, $timeout, $interval, $log, Tools, Lottery) {
	
	var diffTime = $rootScope.diffTime;
	var lotteryStyle = {};
	var tpl = {};
	var getNextIssueUrl = function(gameId) {
		return base_url + Tools.staticPath() + 'data/NextIssue.js?gameId=' + gameId + '&_' + Math.random();
	};
	
	var getCurIssueUrl = function(gameId) {
		return base_url + Tools.staticPath() + 'data/CurIssue.js?gameId=' + gameId + '&_' + Math.random();
	};

	
	
	return {
		restrict: 'C',
		scope: true,
		template: 

		'<div class="col-sm-12" style="background-color:#fff">' + 
			  '<div class="" style="vertical-align: middle;">' +
				  '<div class="dis_inline" ng-show="codeHtml.length > 0">' +
					  '<div style="padding:5px 20px 5px 20px">' +
						  '<span>第 <span style="color:#448ed0;">{{preIssue}}</span> 期</span><br>' +
						  '<span>投注截止</span>' +
					  '</div>' +
				  '</div>' +
  
				  '<div class="dis_inline timer" style="line-height: 1.0; text-align:center" ng-show="codeHtml.length > 0">' +
					  '<div style="margin-top:10px; color:#f00">封盘</div>' +
					  '<div ng-bind-html = "endTimeHtml">' + 
						//   '<span class="digit_label">0</span>' +
						//   '<span class="digit_label">4</span>' +
						//   '<span style="font-size:28px">:</span>' +
						//   '<span class="digit_label">2</span>' +
						//   '<span class="digit_label">9</span>' +
						//   '<span style="font-size:28px">:</span>' +
						//   '<span class="digit_label">6</span>' +
						//   '<span class="digit_label">3</span>' +
					  '</div>' +
				  '</div>' +
				  '<div class="dis_inline timer" style="line-height: 1.0; text-align:center; padding-left:20px" ng-show="curIssue">' +
					  '<div style="margin-top:10px; color:#0f0">开奖</div>' +
					  '<div ng-bind-html = "lotteryTimeHtml">' +
						//   '<span class="digit_label">0</span>' +
						//   '<span class="digit_label">4</span>' +
						//   '<span style="font-size:28px">:</span>' +
						//   '<span class="digit_label">2</span>' +
						//   '<span class="digit_label">9</span>' +
						//   '<span style="font-size:28px">:</span>' +
						//   '<span class="digit_label">6</span>' +
						//   '<span class="digit_label">3</span>' +
					  '</div>' +
				  '</div>' +

				  '<div class="dis_inline" ng-show="codeHtml.length > 0">' +
					  '<div style="padding:5px 20px 5px 20px">' +
							'<span>第 <span style="color:#448ed0;">{{curIssue}}</span> 期</span><br>' +
							'<span>开奖结果</span>' +
					  '</div>' +
				  '</div>' +

				  '<div class="dis_inline">' +
						'<div style="padding:5px 20px 5px 20px">' +
							'<span>余额: </span>' +
							'<i class="icon-wallet-gold"></i>' +
							'<span class="balance"> {{My.getMoney()}}</span>' +
						'</div>' +
				  '</div>' +

				  '<div class="dis_inline" style="float:right; margin:10px; color:#000" ng-show="curIssue">' +
					  '<div class="row" style="text-align:center; vertical-align: middle;">' +
						  '<div class="lottery-nums" ng-bind-html="codeHtml"></div>' +
					  '</div>' +
				  '</div>' +
			  '</div>' +
		  '</div>',
		replace: true,
		link: function(scope, element, attrs) {
			$log.debug('---------perio link-----------, ' + scope.gameId);
			
			var mainTimer = null;
			var nextIssueTimer = null;
			var curIssueTimer = null;

			scope.curIssue = null;
			scope.preIssue = null;
			//scope.timer = 10;
			
			var gameId = scope.gameId;

			// alert("DIRECTIVE_1: " + gameId);
			
			var filterEndHtml = function(endDiffSecond) {
				if(endDiffSecond < 0) {
					endDiffSecond = 0;
				}
				//scope.endTimeHtml = "<p>ok</p>";
				var timestr = $filter('tick')(endDiffSecond, '已封盘');
				// scope.endTimeHtml = "<span class='digit_label'>"+timestr.charAt("0")+"</span><span class='digit_label'>" +timestr.charAt("1")+ "</span><span class='timedot'>:</span><span class='digit_label'>" +timestr.charAt("3")+ "</span><span class='digit_label'>" +timestr.charAt("4")+ "</span><span class='timedot'>:</span><span class='digit_label'>" +timestr.charAt("6")+ "</span><span class='digit_label'>" +timestr.charAt("7")+ "</span>"; //$filter('tick')(endDiffSecond, '已封盘');
				scope.endTimeHtml = "<br><span class='digit_labels'>"+timestr+"</span>";
			};
			
			var filterLotteryHtml = function(lotteryDiffSecond) {
				if(lotteryDiffSecond < 0) {
					lotteryDiffSecond = 0;
				}
				var timestr1 = $filter('tick')(lotteryDiffSecond, '开奖中');
				// scope.lotteryTimeHtml = "<span class='digit_label'>"+timestr1.charAt("0")+"</span><span class='digit_label'>" +timestr1.charAt("1")+ "</span><span class='timedot'>:</span><span class='digit_label'>" +timestr1.charAt("3")+ "</span><span class='digit_label'>" +timestr1.charAt("4")+ "</span><span class='timedot'>:</span><span class='digit_label'>" +timestr1.charAt("6")+ "</span><span class='digit_label'>" +timestr1.charAt("7")+ "</span>"; //$filter('tick')(lotteryDiffSecond, '开奖中');
				scope.lotteryTimeHtml = "<br><span class='digit_labels'>"+timestr1+"</span>";
			};
			
			var processCode = function (scope, nums) {
				$log.debug('processCode, ' + nums);
				if(!nums) {
					return;
				}
				
				if(!angular.isArray(nums)) {
					nums = nums.split(',');
				}
				
				if(nums.length < 3) {
					return;
				}
				
				scope.codeHtml = $filter('codeHtml')(nums, gameId, 'lottery');
			};
			
			function stop() {
				scope.shareData.lotteryState = 0;
				scope.reset();
			}

			function startNextTimer() {
				$interval.cancel(nextIssueTimer);
				
				Lottery.getNextIssueJS(function(data) {

					var oScript = document.createElement("script");
					var oScriptText = document.createTextNode(data);
					oScript.appendChild(oScriptText);
					document.body.appendChild(oScript);

					console.log("GETNEXTISSUE: " + getNextIssueUrl(gameId));
					console.log(nextIssueData);
					// eval("alert('HHHHHHHHHHHHHHHHHH')");
					if(!nextIssueData) {
						return;
					}
					
					var curIssue = parseInt(nextIssueData.issue);
					scope.shareData.curIssue = curIssue;
					scope.curIssue = curIssue;
					scope.preIssue = parseInt(nextIssueData.preIssue);
					
                	var nowTime = moment().add(diffTime, 's');
                	var lotteryTime = moment(nextIssueData.lotteryTime);
                	var endTime = moment(nextIssueData.endtime);
                	var endDiffSecond = endTime.diff(nowTime, 's'); // 封盘倒计时
                	var lotteryDiffSecond = lotteryTime.diff(nowTime, 's'); // 开奖倒计时
                	
                	// 如果半小时都还没有获取到下一期数据，则算做是未开盘状态
                	if(endDiffSecond < -60 * 30) {
                		$interval.cancel(nextIssueTimer);
                		scope.endTimeHtml = $filter('tick')(endDiffSecond, '未开盘');
                		scope.lotteryTimeHtml = $filter('tick')(endDiffSecond, '未开盘');
                		scope.shareData.lotteryState = -1;
                		return;
                	}
                	
                	// 如果当前时间距离封盘时间大于10分钟且不是六合彩，则当作封盘处理
                	if(endDiffSecond > 60 * 10 && gameId != 70) {
                		scope.shareData.lotteryState = 0;
                	}
                	else if(endDiffSecond <= 0) {
            			stop();
            		}
                	else {
                		scope.shareData.lotteryState = 1;
                	}
                	
                	/*if(lotteryDiffSecond == 0) {
                		startCurIssueTimer();
            		}*/
                	
                	filterEndHtml(endDiffSecond);
                	filterLotteryHtml(lotteryDiffSecond);

                	/**
                	 * 开始倒计时
                	 */
                	nextIssueTimer = $interval(function() {
                		lotteryDiffSecond--;
                		$log.debug('-----------next $interval----------');
                		//scope.timer--;
                		if(endDiffSecond <= 0) {
                			stop();
                		}
                		else {
                			endDiffSecond--;
                			filterEndHtml(endDiffSecond);
                		}
                		
                		filterLotteryHtml(lotteryDiffSecond);
                		
                		if(lotteryDiffSecond <= 0) {
                    		startNextTimer();
                		}
                	}, 1000);
					
				}, gameId);


				// var httpRequest = new XMLHttpRequest();
				// httpRequest.open('GET', 'http://localhost/wap/staticdata/NextIssue.js?gameId=' + gameId);
				// httpRequest.send();
				// var returnval = httpRequest.responseText;

				// console.log("SUCCESS_OTHER: " + returnval);
				
				//Tools.lazyLoad([getNextIssueUrl(gameId)], function() {
					
				//});
			};
			
			// function startNextTimer() {
			// 	$interval.cancel(nextIssueTimer);
				
			// 	console.info("getNextIssueUrl: " + getNextIssueUrl(gameId));
			// 	Tools.lazyLoad([getNextIssueUrl(gameId)], function() {
			// 		console.log("NEXT_ISSUE_DATA: ");
			// 		// console.log(nextIssueData);
			// 		console.log("NEXT_END");
			// 		if(!nextIssueData) {
			// 			alert("CAN'T ACCESS TO SERVER!")
			// 			return;
			// 		}
					
			// 		var curIssue = parseInt(nextIssueData.issue);
			// 		scope.shareData.curIssue = curIssue;
			// 		scope.curIssue = curIssue;
			// 		scope.preIssue = parseInt(nextIssueData.preIssue);
					
            //     	var nowTime = moment().add(diffTime, 's');
            //     	var lotteryTime = moment(nextIssueData.lotteryTime);
            //     	var endTime = moment(nextIssueData.endtime);
            //     	var endDiffSecond = endTime.diff(nowTime, 's'); // 封盘倒计时
            //     	var lotteryDiffSecond = lotteryTime.diff(nowTime, 's'); // 开奖倒计时
                	
            //     	// 如果半小时都还没有获取到下一期数据，则算做是未开盘状态
            //     	if(endDiffSecond < -60 * 30) {
            //     		$interval.cancel(nextIssueTimer);
            //     		scope.endTimeHtml = $filter('tick')(endDiffSecond, '未开盘');
            //     		scope.lotteryTimeHtml = $filter('tick')(endDiffSecond, '未开盘');
            //     		scope.shareData.lotteryState = -1;
            //     		return;
            //     	}
                	
            //     	// 如果当前时间距离封盘时间大于10分钟且不是六合彩，则当作封盘处理
            //     	if(endDiffSecond > 60 * 10 && gameId != 70) {
            //     		scope.shareData.lotteryState = 0;
            //     	}
            //     	else if(endDiffSecond <= 0) {
            // 			stop();
            // 		}
            //     	else {
            //     		scope.shareData.lotteryState = 1;
            //     	}
                	
            //     	/*if(lotteryDiffSecond == 0) {
            //     		startCurIssueTimer();
            // 		}*/
                	
            //     	filterEndHtml(endDiffSecond);
            //     	filterLotteryHtml(lotteryDiffSecond);

            //     	/**
            //     	 * 开始倒计时
            //     	 */
            //     	nextIssueTimer = $interval(function() {
            //     		lotteryDiffSecond--;
            //     		$log.debug('-----------next $interval----------');
            //     		//scope.timer--;
            //     		if(endDiffSecond <= 0) {
            //     			stop();
            //     		}
            //     		else {
            //     			endDiffSecond--;
            //     			filterEndHtml(endDiffSecond);
            //     		}
                		
            //     		filterLotteryHtml(lotteryDiffSecond);
                		
            //     		if(lotteryDiffSecond <= 0) {
            //         		startNextTimer();
            //     		}
            //     	}, 1000);
			// 	});
			// };


			function getCurIssue() {
				$log.debug('获取下一期的开奖数据');

				Lottery.getCurIssueJS(function(data) {

					var oScript = document.createElement("script");
					var oScriptText = document.createTextNode(data);
					oScript.appendChild(oScriptText);
					document.body.appendChild(oScript);

					console.log("GET_CURRENT_: ");
					console.log(curIssueData);

					if(!curIssueData) {
						return;
					}
					
					processCode(scope, curIssueData.nums);
					$log.debug('scope.curIssue: ' + scope.curIssue + ', curIssueData.issue: ' + curIssueData.issue);
					
					if(scope.curIssue - curIssueData.issue <= 1) {
						$log.debug('获取到开奖数据，清除定时器');
						scope.preIssue = curIssueData.issue;
						$interval.cancel(curIssueTimer);
					}
					else {
						$log.debug('未获取到开奖数据');
					}

				}, gameId);
			};
			
			// function getCurIssue() {
			// 	$log.debug('获取下一期的开奖数据');
				
			// 	Tools.lazyLoad([getCurIssueUrl(gameId)], function() {
			// 		if(!curIssueData) {
			// 			return;
			// 		}
					
			// 		processCode(scope, curIssueData.nums);
			// 		$log.debug('scope.curIssue: ' + scope.curIssue + ', curIssueData.issue: ' + curIssueData.issue);
					
			// 		if(scope.curIssue - curIssueData.issue <= 1) {
			// 			$log.debug('获取到开奖数据，清除定时器');
			// 			scope.preIssue = curIssueData.issue;
			// 			$interval.cancel(curIssueTimer);
			// 		}
			// 		else {
			// 			$log.debug('未获取到开奖数据');
			// 		}
			// 	});
			// };
			
			function startMainTimer() {
				mainTimer = $interval(function() {
					$log.debug('-----------mainTimer----------');
					//scope.timer = 10;
					startNextTimer();
					// alert("AAAAAAAAAAA");
				}, 10000);
			};
			
			/**
			 * 开启获取开奖数据定时器
			 */
			function startCurIssueTimer() {
				$log.debug('开启获取开奖数据定时器');
				$interval.cancel(curIssueTimer);
				curIssueTimer = $interval(function() {
					$log.debug('-----------cur $interval----------');
					getCurIssue();
				}, 2000, 60);
			};
			
			scope.$watch('curIssue', function(newValue) {
				if(!newValue) {
					return;
				}
				$log.debug('$watch curIssue, newValue: ' + newValue + ', scope.preIssue: ' + scope.preIssue);
				if(newValue - scope.preIssue >= 2) {
					$log.debug('下一期数据已经生成，30秒后获取这期的开奖结果');
					$timeout(startCurIssueTimer, 1000, false);
				}
			});
			
			scope.$on('lotteryInited', function($scope) {
				console.log('------------lotteryInited------------');
				// alert("Directive_Lottery");
				numStyle = Lottery.getNumStyle(gameId, 'lottery');
				tpl = Lottery.getTpl(gameId);
				element.parent().addClass(tpl.group);
				scope.shareData.lotteryState = 1;
				
				// 开启获取下一期倒计时
				startNextTimer();
				// 先获取一次当前期开奖号码
				getCurIssue();
				// 开启总计时器，10秒刷新一次
				startMainTimer();
			});
			
			scope.$on('lotteryDestroy', function($scope) {
				$log.debug('------------lotteryDestroy------------');
				$interval.cancel(mainTimer);
				$interval.cancel(nextIssueTimer);
				$interval.cancel(curIssueTimer);
			});
		}
	}
})

.directive('lotteryTimer', function($rootScope, $filter, $interval, $log, Tools) {
	var diffTime = $rootScope.diffTime;
	var mainTimer = null;
	var allIssueTimer = null;
	var timeMap = {};
	return {
		restrict: 'EC',
		scope: false,
		template: '<div class="item" ng-repeat="game in gameList track by game.id"><a href="#/lottery/index/{{game.id}}"><h3>{{game.name}}</h3><span>{{texts[game.id]}}<ion-spinner ng-show="!texts[game.id]" class="spinner spinner-ios"></ion-spinner></span></a></div>',
		replace: true,
		link: function(scope, element, attrs) {
			scope.texts = {};
			
			var startTimer = function() {
				$interval.cancel(allIssueTimer);

				console.log("AAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLL");
				
				Tools.lazyLoad([Tools.staticPath() + 'data/' + 'allNextIssue.js?_' + Math.random()], function() {
					if(!allNextIssueData) {
						return;
					}
					
					for(var gameId in allNextIssueData) {
						var issueDate = allNextIssueData[gameId];
						var nowTime = moment().add(diffTime, 's');
	                	var lotteryTime = moment(issueDate.lotteryTime);
	                	var lotteryDiffSecond = lotteryTime.diff(nowTime, 's'); // 开奖倒计时
	                	timeMap[gameId] = lotteryDiffSecond;
					}
					
					allIssueTimer = $interval(function() {
						var isRestart = false;
                		for(var gameId in timeMap) {
                			var lotteryDiffSecond = timeMap[gameId];
                			if(lotteryDiffSecond < -60 * 30) {
                				scope.texts[gameId] = '未开盘';
                			}
                			else {
                				scope.texts[gameId] = $filter('tick')(lotteryDiffSecond, '开奖中');
                			}
                			lotteryDiffSecond--;
                			timeMap[gameId] = lotteryDiffSecond;
                			if(lotteryDiffSecond == 0) {
                				isRestart = true;
    	                	}
                		}
                		if(isRestart) {
                			startTimer();
                		}
                	}, 1000);
				});
			}
			
			startTimer();
			
			mainTimer = $interval(function() {
				startTimer();
        	}, 10000);
			
			scope.$on('lotteryListDestroy', function($scope) {
				$log.debug('------------lotteryListDestroy------------');
				$interval.cancel(mainTimer);
				$interval.cancel(allIssueTimer);
			});
		}
	}
})

.directive('zodiac', function($interpolate) {
	// 所有生肖集合
	var zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
	// 当前年份，后续应该是从后端获取
	var animalsYear = '狗';
	
	return {
		restrict: 'A',
		scope: true,
		link: function(scope, element, attrs) {
			var text = attrs['zodiac'];
			var max = attrs['max'] || 49;
			var zodiacIndex = zodiacs.indexOf(animalsYear); // 8
			var index = zodiacs.indexOf(text); // 10
			if(zodiacIndex < index) {
				zodiacIndex += 12;
			}

			
			
			
			var tmp = $interpolate('<span class="round-3 ball_e_label ball_{{num|lhcColor}}">{{num}}</span>');
			// <span class="round-3 ball_e_label ball_r">40</span>
			var html = '';
			var m = (zodiacIndex - index) + 1;
			var num = m;
			while(num <= max) {
				var di = num;
				if(num<10){
					num = '0' + num;
				}
				html += tmp({num: num});
				num = di;
				num += 12;
			}
			element.append(html);
		}
	}
})
;