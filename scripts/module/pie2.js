define(["d3"],function(d3){
	
	// 容器id，如（"#myid"），饼图外半径outerRadius，饼图内半径innerRadius
	var pie = function (id,data) {
		// 获取原始数据
		var dataset = data;

		// 获取目标容器宽高
		var _oDiv = d3.select(id);
		var _width = _oDiv[0][0].offsetWidth;
		var _height = _oDiv[0][0].offsetHeight;

		function percentage(currentPart) { 
			var total = dataset[0]+dataset[1]+dataset[2]+dataset[3];
			return (Math.round(currentPart / total * 10000) / 100 + "%");// 小数点后两位百分比
		}

		// 设置svg宽高等于目标容器宽高
		var svg = d3.select(id).append("svg")
					
		// 设置布局（饼图数据转换）
		var pie = d3.layout.pie()
					.sort(function(d){
						return 1;
					})
		var piedata = pie(dataset);	//转换后的数据

		// 设置基半径
		var baseR = _width/2;
		
		var _outerRadius = baseR*0.8;	//外半径
		var _innerRadius = baseR*0.4;	//内半径，为0则中间没有空白

		var arc = d3.svg.arc()	//弧生成器
					.innerRadius(_innerRadius)	//设置内半径
					.outerRadius(_outerRadius);	//设置外半径
		
		colors = ['#e111da', '#115ae1','#e14c11', '#06b930','#867BF1'];

		var arcs = svg.selectAll("g")
					.data(piedata)
					.enter()
					.append("g")
					.attr("transform","translate("+ (_width/2) +","+ (_height/2) +")");
		arcs.append("path")
			.attr("fill",function(d,i){
				return colors[i];
			})
			.transition()                   //设置动画  
            .ease('linear')                 //动画效果  
            .duration(2000)                 //持续时间  
            .attrTween('d',tweenPie)        //两个属性之间平滑的过渡。  
            .transition()  
            .ease("linear")  
            .delay(function(d,i){return 2000+i*50}) //设置了一个延迟时间，让每一个内半径不在同一个时间缩小。  
            .duration(750)  
            .attrTween('d',tweenDonut);  

		function tweenPie(b){  
			//这里将每一个的弧的开始角度和结束角度都设置成了0  
			//然后向他们原始的角度(b)开始过渡，完成动画。  
			b.innerRadius=0;      
			var i=d3.interpolate({startAngle:0,endAngle:0},b);  
			//下面的函数就是过渡函数，他是执行多次最终达到想要的状态。  
			return function(t){return arc(i(t));};  
		}  

		function tweenDonut(b){  
			//设置内半径不为0  
			b.innerRadius=baseR*.3;  
			//然后内半径由0开始过渡  
			var i=d3.interpolate({innerRadius:0},b);  
			return function(t){return arc(i(t));};  
		}  
		
		arcs.append("text")
			.attr("transform",function(d){
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr('dy','0.5em')
			.attr("text-anchor","middle")
			.transition()
			.delay(2000)
			.text(function(d,i){
				return percentage(dataset[i]);
			})
			.style('fill','white')
			.style('font-size','22rem')
	};
	
	return pie;
})