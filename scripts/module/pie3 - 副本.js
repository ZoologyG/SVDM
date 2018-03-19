define(["d3"],function(d3){
	
	// 容器id，如（"#myid"），饼图外半径outerRadius，饼图内半径innerRadius
	var pie = function (id,data) {

		// 获取目标容器宽高
		var _oDiv = d3.select(id);
		var _width = _oDiv[0][0].offsetWidth;
		var _height = _oDiv[0][0].offsetHeight;

		// 数据格式：{cnt: 33730, oneTwo: 10119, treeFour: 16865, five: 6746}
		console.log(data)
		var dataset = [data.result.oneTwo,data.result.treeFour,data.result.five];

		function percentage(index,arr) { 
			var sum = 0;
			for (let i = 0; i < arr.length; ++i ) {
				sum += arr[i]
			}
			return (Math.round(arr[index] / sum * 10000) / 100.00 + "%");// 小数点后两位百分比
		}

		// 设置svg宽高等于目标容器宽高
		var svg = d3.select(id).append("svg")
					
		// 设置布局（饼图数据转换）
		var pie = d3.layout.pie()
					.sort(function(d){
						return true;
					});

		var baseR = _height*0.4;
		var _outerRadius = baseR*0.8;	//外半径

		// 设置弧生成器
		var arc = d3.svg.arc()	//弧生成器
					.outerRadius(_outerRadius);	//设置外半径

		//绘制图形
		var arcs = svg.selectAll("g")
					.data(pie(dataset))
					.enter()
					.append("g")
					.attr("transform","translate("+ (_width/2) +","+ (_height*0.4) +")")
					.append("path")
					.attr("fill",function(d,i){
						return getColor(i);
					})
					.transition()                   //设置动画  
					.ease('linear')                 //动画效果  
					.duration(2000)                 //持续时间  
					.attrTween('d',function(d,i){
						return tweenPie(d,i)
					})        //两个属性之间平滑的过渡。  
					.transition()  
					.ease("linear")  
					.delay(function(d,i){return 2000+i*50}) //设置了一个延迟时间，让每一个内半径不在同一个时间缩小。  
					.duration(750)  
					.attrTween('d',function(d,i){
						return tweenDonut(d,i)
					});

		function tweenPie(b,index){  
			//这里将每一个的弧的开始角度和结束角度都设置成了0  
			//然后向他们原始的角度(b)开始过渡，完成动画。  
			b.innerRadius=0;      
			var i=d3.interpolate({startAngle:0,endAngle:0},b);  
			//下面的函数就是过渡函数，他是执行多次最终达到想要的状态。  
			return function(t){
				return arc(i(t));
			};  
		}  
		function tweenDonut(b,index){  
			if (index==0) {
						//设置内半径不为0 
						b.innerRadius=_outerRadius*0.95;
						//然后内半径由0开始过渡  
						var i0=d3.interpolate({innerRadius:0},b);  
						return function(t){
							return arc(i0(t));
						};  
						
					} else if (index==1) {
						b.innerRadius=_outerRadius*0.9; 
						var i1=d3.interpolate({innerRadius:0},b);  
						return function(t){
							return arc(i1(t));
						}; 
					} else if (index==2) {
						b.innerRadius=_outerRadius*0.85;   
						var i2=d3.interpolate({innerRadius:0},b); 
						return function(t){
							return arc(i2(t));
						}; 
					} else {
						console.log('超出弧生成器上限，请添加弧生成器')
					}
			// return function(t){return arc0(i0(t));};  
		}  

		function getColor(idx) {
			var palette = [
				'#0AF056', '#FDE309', '#F6152A'
			];
			return palette[idx % palette.length];
		};

		svg.append("text")
			.attr("transform",function(d){
				return "translate(" + _width/2 + "," + _height*0.4 + ")";
			})
			.attr("text-anchor","middle")
			.transition()
			.delay(1500)
			.text(percentage(2,dataset))
			.style('fill','white')
			.style('font-size','43rem')
		svg.append("text")
			.attr("transform",function(d){
				return "translate(" + _width/2 + "," + _height*0.55 + ")";
			})
			.attr("text-anchor","middle")
			.transition()
			.delay(1500)
			.text(data.type)
			.style('fill','white')
			.style('font-size','37rem')
		svg.append("text")
			.attr("transform",function(d){
				return "translate(" + _width/2 + "," + _height*0.9 + ")";
			})
			.attr("text-anchor","middle")
			.transition()
			.delay(1500)
			.text(data.result.cnt + '辆')
			.style('fill','white')
			.style('font-size','37rem')

		// arcs.append("text")//每个g元素都追加一个path元素用绑定到这个g的数据d生成路径信息
		// 	.attr("transform",function(d){ 
		// 		return "translate("+arc.centroid(d)+")";//计算每个弧形的中心点（几何中心）
		// 	})
		// 	.attr("text-anchor","middle")
		// 	.text(function(d){
		// 		return d.value;//这里已经转为对象了
		// 	});
	};
	
	return pie;
})