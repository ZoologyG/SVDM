define(['d3'],function(d3){

    var chart = function(id,data){
        var dataset = data;
    
        
        //画布大小
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;
 
        //在 body 里添加一个 SVG 画布	
        var svg = d3.select(id)
            .append("svg")

        //画布周边的空白
        var padding = {};
        padding.left = width*0.08;
        padding.right = width*0.03897686;
        padding.top = height*0.03461538;
        padding.bottom = height*0.21153846;

        var _width = width - padding.left - padding.right;
        var _height = height - padding.top - padding.bottom;

        //x轴的比例尺
        var xData = dataset.map(function(d,i){
            return d.car_owner;
        });
        var xScale = d3.scale.ordinal()
            .domain(xData)
            .rangeRoundBands([0, width - padding.left - padding.right],0.637);
       
        //y轴的比例尺
        var yData = dataset.map(function(d,i){
            return d.count;
        });
        var yScale = d3.scale.linear()
            .domain([0,250])
            .range([height - padding.top - padding.bottom, 0]);

        //定义x轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
            
        //定义y轴
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

        //添加x轴
        var x = svg.append("g")
            .attr("class","xAxis")
            .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
            .call(xAxis);

        x.selectAll('.tick text')
            .style('text-anchor','start')
            .style('transform','translate(0.5em)rotate(45deg)');
                
        //添加y轴
        svg.append("g")
            .attr("class","yAxis")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .call(yAxis);

         //定义纵轴网格线
         var yInner = d3.svg.axis()
                        .scale(yScale)
                        .tickSize(_width)
                        .tickFormat("")
                        .orient("right")
                        .ticks(5);
         //添加纵轴网格线
         var yInnerBar = svg.append("g")
                        .attr("class", "inner_line")
                        .attr("transform","translate(" + padding.left + "," + padding.top + ")")
                        .call(yInner);

        //添加矩形元素
        var rects = svg.selectAll(".MyRect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class","MyRect")
            .attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .style("fill","#20BBE9")
            .attr("x", function(d,i){
                return xScale(d.car_owner);
            })
            .attr("width", xScale.rangeBand())
            .attr("y",function(d){
                return yScale(0);
            })
            .attr("height", function(d){
                return 0;
            })
            .transition()
            .delay(function(d,i){
                return i * 250;
            })
            .duration(1000)
            .ease("linear")
            .attr("y",function(d){
                return yScale(d.count);
            })
            .attr("height", function(d){
                return height - padding.top - padding.bottom - yScale(d.count);
            });
			
        // //添加文字元素
        // var texts = svg.selectAll(".xText")
        //     .data(dataset)
        //     .enter()
        //     .append("text")
        //     .attr("class","xText")
        //     // .attr("transform","translate(" + padding.left + "," + padding.top + ")")
        //     .attr("x", function(d,i){
        //         return xScale(d.car_owner) + xScale.rangeBand()*0.3;
        //     })
        //     .attr("y",function(d){
        //         // var min = yScale.domain()[0];
        //         return _height;
        //     })
        //     .attr("dx",function(){
        //         return 0;
        //     })
        //     .attr("dy",function(d){
        //         return '1.5em';
        //     })
        //     .text(function(d){
        //         return d.car_owner;
        //     })
        //     .style('font-size','16rem')
        //     .style('fill','#7DE3EA')
        //     .style('text-anchor','start')
        //     .attr('transform-origin',function(d,i){
        //         return '('+ (xScale(d.car_owner) + xScale.rangeBand()*0.3) + ',' + _height +')';
        //     })
        //     .attr('transform','rotate(45)');
           
            // .transition()
            // .delay(function(d,i){
            //     return i * 200;
            // })
            // .duration(2000)
            // .ease("bounce")
            // .attr("y",function(d){
            //     return yScale(d);
            // });
    };

    return chart;
})