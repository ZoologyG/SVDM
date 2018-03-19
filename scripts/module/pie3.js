define(["d3"],function(d3){
	
	// 容器id，如（"#myid"），饼图外半径outerRadius，饼图内半径innerRadius
	var pie = function (id,data) {

		// 获取目标容器宽高
		var oDiv = d3.select(id);
		var width = oDiv[0][0].offsetWidth;
		var height = oDiv[0][0].offsetHeight;

		// 数据格式：{cnt: 33730, oneTwo: 10119, treeFour: 16865, five: 6746}
		var dataset = [data.result.oneTwo,data.result.treeFour,data.result.five];
		var levels = ['oneTwo', 'treeFour', 'five']

		// 设置svg宽高等于目标容器宽高
		var svg = d3.select(id).append("svg")
					
		// 设置布局（饼图数据转换）
		var pie = d3.layout.pie()
					.sort(function(d){
						return true;
					});

		//定义基数：基础半径，基础事件间隔
		const basicRadius = height*0.4, basicTime = 1000;
		//定义外半径，外半径
		const outerRadius = basicRadius*0.8,innerRadius = outerRadius*0.85;
		// 定义内半径递增量,时间间隔
		const incremntValue = (outerRadius - innerRadius)/dataset.length;

		//定义路径
		const arc = d3.svg.arc()
			.outerRadius(outerRadius);
		//定义了另一种路径函数
		const arc2 = d3.svg.arc()
			.outerRadius(outerRadius + incremntValue);

		const arcs = svg.selectAll("g")
			.data(pie(dataset))
			.enter()
			.append("g")
			.attr("transform", "translate(" + (width/2)  + "," + (height*0.4) + ")") // 将饼图中心(SVG起点)移至中间

			//绘制
			arcs.append("path")
				.attr("fill", function(d, i) {
					return getColor(i);
				})
				.attr("d", function(d,i) {
					arc.innerRadius(innerRadius + incremntValue*(dataset.length - i - 1));
					return arc(d);
				})
			arcs.append("text")
				.attr("text-anchor", "middle")
				.attr("dy","-0.1em")
				.attr("font-size","43rem")
				.attr("fill","white")
				.attr("display","none")
				.text(function(d) {
					return d.value;
				})
		// 定时器间隔时间
		const intervalTime = basicTime * dataset.length;

		// 设置动画函数
		function animate(incremntValue,basicTime) {
			arcs.select('path')
				.transition()
				.delay(function(d,i){
					return i*basicTime
				})
				.duration(basicTime)
				.ease('linear')
				.attr('d',function(d,i){
					arc2.innerRadius(innerRadius + incremntValue*(dataset.length - i));
					return arc2(d);
				})
				.transition()
				.delay(function(d,i){
					return (i+1)*basicTime;
				})
				.duration(basicTime*0.2)
				.ease('linear')
				.attr('d',function(d,i){
					arc.innerRadius(innerRadius + incremntValue*(dataset.length - i - 1));
					return arc(d);
				})
			arcs.select('text')
				.transition()
				.delay(function(d,i){
					return i*basicTime
				})
				.duration(basicTime)
				.ease('linear')
				.attr("display","block")
				.transition()
				.delay(function(d,i){
					return (i+1)*basicTime;
				})
				.duration(basicTime*0.2)
				.ease('linear')
				.attr("display","none")
		}

		// 添加底部文字
		svg.append("text")
			.attr("transform",function(d){
				return "translate(" + width/2 + "," + height*0.55 + ")";
			})
			.attr("text-anchor","middle")
			.transition()
			.delay(1500)
			.text(data.type)
			.style('fill','white')
			.style('font-size','37rem')
		svg.append("text")
			.attr("transform",function(d){
				return "translate(" + width/2 + "," + height*0.9 + ")";
			})
			.attr("text-anchor","middle")
			.transition()
			.delay(1500)
			.text(data.result.cnt + '辆')
			.style('fill','white')
			.style('font-size','37rem')

		//设置定时器
		const interval = setInterval(function(){
			animate(incremntValue,basicTime);
		},intervalTime)			
		
		// 自定义颜色族
		function getColor(idx) {
			var palette = [
				'#0AF056', '#FDE309', '#F6152A'
			];
			return palette[idx % palette.length];
		};
		
		// 定义百分比函数
		function percentage(index,arr) { 
			var sum = 0;
			for (let i = 0; i < arr.length; ++i ) {
				sum += arr[i]
			}
			return (Math.round(arr[index] / sum * 10000) / 100.00 + "%");// 小数点后两位百分比
		}
	};
	
	return pie;
})