
require.config({
    baseUrl: './scripts',
    paths: {
		'd3':'lib/d3',
		'jquery':'lib/jquery',
		'map':'module/map',
		'polyline':'module/polyline',		
		'chart':'module/chart',
		'dbchart':'module/dbchart',
		'pie1':'module/pie1',
		'pie2':'module/pie2',
		'pie3':'module/pie3',
        'radar':'module/radar',
		'getColor':'module/getColor',
		'pieCaption':'module/pieCaption',
		'table':'module/table'
	}
});

// 设定全局刷新时间间隔
var DelayTime = 20000;

// 统计信息total_info
require(['d3','jquery'],function(d3,$){
	$.ajax({
		type: "post",
		url : "svdm/bigscreen/count",
		dataType : "json",
		success : function(data){
			if (data.status == 200) {
				d3.selectAll('#total_info li p:first-child')
				.data(data.result)
				.text(function(d,i){
					return d.num;
				});
				d3.selectAll('#total_info li p:last-child')
				.data(data.result)
				.text(function(d,i){
					return d.unit;
				})
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
})

// 公司风险分析
require(['d3','jquery'],function(d3,$){
	//设置变量接收数据
	var pagenum = 1;
	var total = 1;
	// 初始化渲染
	ajaj();
	// 设置定时器，每隔20秒发起一次ajax，获取下一页数据
	setInterval(function(){
		ajaj();
	},8000);
	// 声明ajax请求函数
	function ajaj () {
		// 第0页修正
		if (pagenum == 0) {pagenum = total};
		// 发起请求
		if (pagenum<=total) {
			$.ajax({
				type: "post",
				url : "svdm/bigscreen/unitAnalysis",
				data :{"pagenum":pagenum} ,
				dataType : "json",
				success : function(data){
					// var data = {
					// 	"status": 200,
					// 	"total": 1,
					// 	"result": [
					// 		{"count": 2.56,"name": "新乡市润达汽车运限公司"},
					// 		{"count": 40.3,"name": "新乡市润车运输有限公司"},
					// 		{"count": 50,"name": "新乡市润汽车运输有限公司"},
					// 		{"count": 60,"name": "新乡市润达汽车运输有限公司"},
					// 		{"count": 70.5,"name": "新乡市达汽车运输有限公司"}
					// 	]
					// }
					if (data.status==200) {
						// console.log('公司风险分析',data)
						d3.selectAll('#tableGsfxfx .tbody p span:first-child')
							.text('')
							.data(data.result)
							.text(function(d,i){
								if (d.name.length>13) {
									return d.name.slice(0,13) + '...';
								} else {
									return d.name;
								}
							})
							.style('color',function(d,i){
								if (d.count<=40) {
									return '#0AF056'
								} else if (d.count<=80) {
									return '#FDE309'
								} else {
									return '#F6152A'
								}
							});
						d3.selectAll('#tableGsfxfx .tbody p span:last-child')
							.text('')
							.data(data.result)
							.text(function(d,i){
								return d.count + '%';
							})
							.style('color',function(d,i){
								if (d.count<=40) {
									return '#0AF056'
								} else if (d.count<=80) {
									return '#FDE309'
								} else {
									return '#F6152A'
								}
							});
						total = data.total;
						pagenum = (++pagenum)%total;
					} else if (data.status==201) {
						console.log('公司风险分析：数据为空')
					} else {
						console.log('公司风险分析：非200,201的其他异常');
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});
		}
	}
})

// 车辆风险预警
require(['d3','jquery'],function(d3,$){
	//设置变量接收数据
	var pagenum = 1;
	var total = 1;
	// 初始化渲染
	ajaj();
	// 设置定时器，每隔20秒发起一次ajax，获取下一页数据
	setInterval(function(){
		ajaj();
	},13000);
	// 声明ajax请求函数
	function ajaj () {
		// 第0页修正
		if (pagenum == 0) {pagenum = total};
		// 发起请求
		if (pagenum<=total) {
			$.ajax({
				type: "post",
				url : "svdm/bigscreen/carWarning",
				data :{"pagenum":pagenum} ,
				dataType : "json",
				success : function(data){
					if (data.status==200) {
						var wd = d3.selectAll('#tableClfxyj table tbody tr td:first-child')
							.text('')
							.data(data.result)
							.text(function(d,i){
								return d.plateNo;
							});
						d3.selectAll('#tableClfxyj table tbody tr td:last-child')
						.text('')
						.data(data.result)
						.text(function(d,i){
							return d.weightName;
						});
						total = data.total;
						pagenum = (++pagenum)%total;
					} else if (data.status==201) {
						console.log('车辆风险预警：数据为空');
					} else {
						console.log('车辆风险预警：非200,201的其他异常');
					}
				}
			});
		}
	}
})

// 中国地图
require(['map'],function(map){
	// 请求map路径数据
	d3.json("./jsons/china.geojson",function(error, data) {
		if (error) {
			return console.error(error);
		} else {
			map("#map",data);
		}
	});
})

// 车辆行驶风险预测-折线图
require(['polyline','jquery'],function(polyline,$){
	//初始化加载
	ajaj();
	//设置定时轮询
	setInterval(function(){
		ajaj();
	},14000)
	//轮询请求函数
	function ajaj(){
		$.ajax({
			type: "post",
			url : "svdm/bigscreen/unitSumGroupByHour",
			success : function(data){
				var _data = JSON.parse(data);
				// console.log('polyline_data',_data)
				// if (_data.status==200){
				// 	if(_data.result.length<2){
				// 		console.log('车辆行驶风险预测：数据太少，无法绘制折线');
				// 		// d3.select('#polygonClxs svg').remove();
				// 		// polyline('#polygonClxs',_data.result);
				// 	} else {
				// 		d3.select('#polygonClxs svg').remove();
				// 		polyline('#polygonClxs',_data.result);
				// 	}
				// } else if (_data.status==201){
				// 	console.log('车辆行驶风险预测：数据为空');
				// } else {
				// 	console.log('车辆行驶风险预测：非200、201的其他报错！');
				// }
				d3.select('#polygonClxs svg').remove();
				polyline('#polygonClxs',_data.result);
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				console.log(errorThrown);
			}
		});
	}
})

// 公司违法信息统计-柱形图
require(['chart','jquery'],function(chart,$){
	//设置变量接收数据
	var pagenum = 1;
	var total = 1;
	// 初始化渲染
	ajaj();
	// 设置定时器，每隔20秒发起一次ajax，获取下一页数据
	setInterval(function(){
		ajaj();
	},15000);
	// 声明ajax请求函数
	function ajaj () {
		// 第0页修正
		if (pagenum == 0) {pagenum = total};
		// 发起请求
		if (pagenum<=total) {
			$.ajax({
				type: "post",
				url : "svdm/bigscreen/carIllegal",
				data :{"pagenum":pagenum} ,
				dataType : "json",
				success : function(data){
					d3.select('#chart1 svg').remove();
					chart('#chart1',data.result);
					total = data.total;
					pagenum = (++pagenum)%total;
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});
		}
	}
})

// 实时概况-柱波图
require(['dbchart','jquery'],function(dbchart,$){
	//初始化加载
	ajaj();
	// //设置定时轮询
	// setInterval(function(){
	// 	ajaj();
	// },18000)
	//轮询请求函数
	function ajaj(){
		$.ajax({
			type: "post",
			url : "svdm/bigscreen/realMinute",
			dataType : "json",
			success : function(data){
				if(data.length<2){
					console.log('车辆行驶风险预测：数据太少，无法绘制折线');
				} else {
					d3.select('#dbchartSsgk svg').remove();
					dbchart('#dbchartSsgk',data);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				console.log(errorThrown);
			}
		});
	}
})

// 今日车辆类型统计 ： 车辆来源-pie1； 车辆类型-pie2； 客运、货运、危险品 危险级别统计-pie3
require(['pie1','pie2','pie3','pieCaption','jquery'],function(pie1,pie2,pie3,pieCaption,$){
	//初始化加载
	ajaj_pie1();
	//设置定时轮询
	setInterval(function(){
		ajaj_pie1();
	},17000)
	//轮询请求函数
	function ajaj_pie1(){
		// 获取pie1饼图数据-车辆来源
		$.ajax({
			type: "post",
			url : "svdm/bigscreen/carSource",
			dataType : "json",
			success : function(data){
				// console.log('pie1_data',data);
				if (data.status == 200){
					d3.select("#pieClly svg").remove();
					pie1("#pieClly",data);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				console.log(errorThrown);
			}
		});
	};

	//初始化加载
	ajaj_pie2();
	//设置定时轮询
	setInterval(function(){
		ajaj_pie2();
	},18000)
	//轮询请求函数
	function ajaj_pie2(){
		// 获取pie2饼图数据-车辆类型
		$.ajax({
			type: "post",
			url : "svdm/bigscreen/fiveType",
			dataType : "json",
			success : function(data){
				// 调用pie2模块，传入获取到的值
				// console.log('pie2_data',data);
				d3.select("#pieCllx svg").remove();
				pie2("#pieCllx",data.result.map(function(d,i){
					return d.cnt;
				}));
				d3.select("#pieExpCllx svg").remove();
				pieCaption("#pieExpCllx",data.result.map(function(d,i){
					return d.type;
				}));
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				console.log(errorThrown);
			}
		});
	};

	ajaj_pie3();
	//设置定时轮询
	setInterval(function(){
		ajaj_pie3();
	},600000)
	//轮询请求函数
	function ajaj_pie3(){
		// 获取pie3饼图数据-客运、货运、危险品
		$.ajax({
			type: "post",
			url : "svdm/bigscreen/carRiskLevel",
			dataType : "json",
			data :{} ,
			success : function(data){
				// console.log('pie3_data',data);
				if (data[0].status==200){
					d3.select("#conKy svg").remove();
					pie3("#conKy",data[0]);
				} //客运
				if (data[2].status==200){
					d3.select("#conWxp svg").remove();
					pie3("#conWxp",data[2]);
				} //危险品
				if (data[1].status==200){
					d3.select("#conHy svg").remove();
					pie3("#conHy",data[1]);
				} //货运
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				console.log(errorThrown);
			}
		});
	};
})

// 当日交通安全态势分析-雷达图
require(['radar','jquery'],function(radar,$){
	//初始化加载
	ajaj();
	//设置定时轮询
	setInterval(function(){
		ajaj();
	},18000)
	//轮询请求函数
	function ajaj(){
		// 获取雷达图数据
		$.post("svdm/bigscreen/radar",function(data){
			var _data = JSON.parse(data);
			// console.log("rada_data",_data)
			if (_data.status == 200){
				d3.select("#radarDrjtaq svg").remove();
				radar("#radarDrjtaq",_data.result[0]);
			} else if (_data.status == 201) {
				console.log('当日交通安全态势分析：数据为空');
			} else {
				console.log('当日交通安全态势分析：非200、201的其他报错！');
			}
		})
	};
})

// 车辆违法类型统计
require(['table','jquery'],function(table,$){
	//设置变量接收数据
	var pagenum = 1;
	var total = 1;
	// 初始化渲染
	ajaj();
	// 设置定时器，每隔20秒发起一次ajax，获取下一页数据
	setInterval(function(){
		ajaj();
	},17000);
	// 声明ajax请求函数
	function ajaj () {
		// 第0页修正
		if (pagenum == 0) {pagenum = total};
		// 发起请求
		if (pagenum<=total) {
			$.ajax({
				type: "post",
				url : "svdm/bigscreen/illegalType",
				data :{"pagenum":pagenum} ,
				dataType : "json",
				success : function(data){
					// console.log('table_left_data',data)
					d3.select('#hChartL svg').remove();
					table('#hChartL',data);
					total = data.total;
					pagenum = (++pagenum)%total;
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});
		}
	}
})

// 公司预警信息统计
require(['table','jquery'],function(table,$){
	//设置变量接收数据
	var pagenum = 1;
	var total = 1;
	// 初始化渲染
	ajaj();
	// 设置定时器，每隔20秒发起一次ajax，获取下一页数据
	setInterval(function(){
		ajaj();
	},16000);
	// 声明ajax请求函数
	function ajaj () {
		// 第0页修正
		if (pagenum == 0) {pagenum = total};
		// 发起请求
		if (pagenum<=total) {
			$.ajax({
				type: "post",
				url : "svdm/bigscreen/unitWarning",
				data :{"pagenum":pagenum} ,
				dataType : "json",
				success : function(data){
					// console.log('table_right_data',data)
					d3.select('#hChartR svg').remove();
					table('#hChartR',data);
					total = data.total;
					pagenum = (++pagenum)%total;
				},
				error : function(XMLHttpRequest, textStatus, errorThrown){
					console.log(errorThrown);
				}
			});
		}
	}
})