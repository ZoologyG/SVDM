define(['d3'], function(d3) {

    var pie1 = function (id,data) {
        
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
		var height = oDiv[0][0].clientHeight;
		
		// var data = {
		// 	"status": 200,
		// 	"result": {
		// 		"local": 59775,
		// 		"Field": 251
		// 	}
		// }

		// 数据格式转化
		function dataFormat (){
			return	[
				{label:"本地车",value:data.result.local},
				{label:"外地车",value:data.result.Field}
			]
		}

		var dataset = dataFormat ();

		var total = dataset[0].value + dataset[1].value;
		var colors = ["#84DF56", "#F58345"];

		function percentage(cur,total) { 
			return (Math.round(cur / total * 10000) / 100 + "%");// 小数点后两位百分比
		}

        var svg = d3.select(id)
			.append("svg")
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
		
		svg.append("g")
			.attr("class", "slices");
		svg.append("g")
			.attr("class", "labels");
		svg.append("g")
			.attr("class", "lines");

		// 设置pie半径
		var	radius = width/2;

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) {
				return d.value;
			});
		
		var arc = d3.svg.arc()
			.outerRadius(radius * 0.8)
			.innerRadius(radius * 0.4);
		
		var outerArc = d3.svg.arc()
			.outerRadius(radius * 0.95)
			.innerRadius(radius * 0.95);

		var key = function(d){ return d.data.label; };

		var color = d3.scale.ordinal()
			.domain(dataset)
			.range(colors);
			
		change(dataFormat());

		function change(data) {
		
			/* ------- PIE SLICES -------*/
			var slice = svg.select(".slices").selectAll("path.slice")
				.data(pie(data), key);
		
			slice.enter()
				.insert("path")
				.style("fill", function(d) { return color(d.data.label); })
				.attr("class", "slice")

			// slice.transition()
			// 	.delay(500)
			// 	.duration(1000)
			// 	.ease('linear')
			// 	.attrTween("d", function(d) {
			// 		this._current = this._current || d;
			// 		var interpolate = d3.interpolate(this._current, d);
			// 		this._current = interpolate(0);
			// 		return function(t) {
			// 			return arc(interpolate(t));
			// 		};
			// 	})

			slice.transition()                   //设置动画  
				.ease('linear')                 //动画效果  
				.duration(1000)                 //持续时间  
				.attrTween('d',tweenPie)        //两个属性之间平滑的过渡。  
				.transition()  
				.ease("linear")  
				.delay(function(d,i){return 1000+i*50}) //设置了一个延迟时间，让每一个内半径不在同一个时间缩小。  
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
				b.innerRadius=radius*.3;  
				//然后内半径由0开始过渡  
				var i=d3.interpolate({innerRadius:0},b);  
				return function(t){return arc(i(t));};  
			}  
		
			slice.exit()
				.remove();
		
			/* ------- TEXT LABELS -------*/
		
			var text = svg.select(".labels").selectAll("text")
				.data(pie(data), key);
		
			text.enter()
				.append("text")
				// .attr('class','local')
				.attr("dx", "0em")
				.attr("dy", "-0.5em")
				.style("fill",function(d,i){
					if (d.data.label == '本地车') {
						return '#F58345';
					} else if (d.data.label == '外地车') {
						return '#84DF56';
					} else {
						return '#F58345';
					}
				})
				// .style("font-size","18rem")
				.text(function(d) {
					return d.data.label + percentage(d.data.value,total);
				});
			
			function midAngle(d){
				return d.startAngle + (d.endAngle - d.startAngle)/2;
			}
		
			text.transition()
				.style("font-size","0rem")
				.delay(1200)
				.duration(1000)
				.style("font-size","18rem")
				.attrTween("transform", function(d) {
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
						return "translate("+ pos +")";
					};
				})
				.styleTween("text-anchor", function(d){
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						return midAngle(d2) < Math.PI ? "end":"start";
					};
				});
				
			text.exit().remove();
		
			/* ------- SLICE TO TEXT POLYLINES -------*/
		
			var polyline = svg.select(".lines").selectAll("polyline")
				.data(pie(data), key);
			
			polyline.enter()
				.append("polyline");
		
			polyline.transition()
				.delay(1000)
				.duration(1000)
				.attrTween("points", function(d){
					this._current = this._current || d;
					var interpolate = d3.interpolate(this._current, d);
					this._current = interpolate(0);
					return function(t) {
						var d2 = interpolate(t);
						var pos = outerArc.centroid(d2);
						pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
						return [arc.centroid(d2), outerArc.centroid(d2), pos];
					};			
				});
			
			polyline.exit()
				.remove();
		};
    };
    return pie1;
});