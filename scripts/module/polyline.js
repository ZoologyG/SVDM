define(['d3'], function(d3) {

    var polygon = function (id,data) {
        // 设置变量接收数据
        // var dataset = data;

         var dataset = [
            {'timeHour':0,'unitSum':'35%'},
            {'timeHour':1,'unitSum':'30%'},
            {'timeHour':2,'unitSum':'40%'},
            {'timeHour':3,'unitSum':'45%'},
            {'timeHour':4,'unitSum':'50%'},
            {'timeHour':5,'unitSum':'55%'},
            {'timeHour':6,'unitSum':'60%'},
            {'timeHour':7,'unitSum':'70%'},
            {'timeHour':8,'unitSum':'75%'},
            {'timeHour':9,'unitSum':'80%'},
            {'timeHour':10,'unitSum':'75%'},
            {'timeHour':11,'unitSum':'70%'},
            {'timeHour':12,'unitSum':'65%'},
            {'timeHour':13,'unitSum':'60%'},
            {'timeHour':14,'unitSum':'55%'},
            {'timeHour':15,'unitSum':'50%'},
            {'timeHour':16,'unitSum':'45%'},
            {'timeHour':17,'unitSum':'50%'},
            {'timeHour':18,'unitSum':'55%'},
            {'timeHour':19,'unitSum':'60%'},
            {'timeHour':20,'unitSum':'65%'},
            {'timeHour':21,'unitSum':'70%'},
            {'timeHour':22,'unitSum':'55%'},
            {'timeHour':23,'unitSum':'60%'}
        ];

        //获取容器宽高
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;

        //svg留边空白
        var margin = {};
        margin.left = width*0.05208333;
        margin.right = width*0.0625;
        margin.top = height*0.12277904;
        margin.bottom = height*0.10539863;

        // 去边宽高
        var _width = width - margin.left - margin.right;
        var _height = height - margin.top - margin.bottom;
        
        // x轴比例尺数据
        var xDate = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        var timeHours = dataset.map(function(o,i){
            return o.timeHour + '';
        });
        // console.log("timehours",timeHours)
        // y轴比例尺数据
        var unitSums = dataset.map(function(o,i){
            return parseFloat(o.unitSum.replace(/%/, ""));
        });
        // console.log("unitsums",unitSums)
        //定义画布
        var svg = d3.select(id)
            .append("svg");

        //横坐标轴比例尺
        var xScale = d3.scale.ordinal()
                    .domain(xDate)
                    .rangeRoundPoints([0,_width]);
        // 估测步长,按指定24小时算
        var step = _width/24*0.8;

        //纵坐标轴比例尺
        var yScale = d3.scale.linear()
                    .domain([0,100])
                    .range([_height,0]);

        // // 定义横轴网格线
        // var xInner = d3.svg.axis()
        //             .scale(xScale)
        //             .tickSize(-160,0,0)//调整网格线长度
        //             .orient("bottom")
        //             .ticks(unitSums.length);

        // // 添加横轴网格线
        // svg.append("g")
        //     .attr("class","inner_line")
        //     .attr("transform","translate(0," + 220 + ")")
        // // 用来把纵的网格线上移的
        //     .call(xInner)
        //     .selectAll("text")
        //     .text("");

        //定义纵轴网格线
        var yInner = d3.svg.axis()
                    .scale(yScale)
                    .tickSize(_width,0,0)
                    .tickFormat("")
                    .orient("right")
                    .ticks(5);
        //添加纵轴网格线
        var yBar=svg.append("g")
                    .attr("class","inner_line")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")")
                    .call(yInner);

        //定义横向坐标轴
        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom")

        //添加横坐标轴并通过编号获取对应的横轴标签
        svg.append("g")
                    .attr("class","x axis")
                    .attr("transform","translate("+ margin.left + "," + (_height+margin.top) + ")")
                    .call(xAxis)
                    .append('text')
                    .text('/时')
                    .style('font-size','20rem')
                    .style('fill','#E8E8E8')
                    .attr('dx',function(d,i){
                        return _width + margin.right*0.2;
                    })
                    .attr('dy','1.5em');

        //定义纵向坐标轴
        var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left")
                    .ticks(5);//这个是细分度
        //添加纵轴
        svg.append("g")
                .attr("class", "y axis")
                .attr("transform","translate("+ margin.left +","+ margin.top +")")
                .call(yAxis);
                // .append('text')
                // .text('%')
                // .style('font-size','20rem')
                // .style('fill','#E8E8E8')
                // .attr('dx',function(d,i){
                //     return  -margin.left*0.5;
                // })
                // .attr('dy','-1.5em');


        // 添加折线
        var linef = d3.svg.line()
                    .x(function(d,i){return xScale(timeHours[i]);})
                    .y(function(d,i){return yScale(unitSums[i]);})
                    .interpolate('cardinal');
        var path = svg.append("path")
                    .transition()
                    .delay(2500)
                    .duration(1000)
                    .ease('linear')
                    .attr("d", linef(dataset))
                    .style("fill","#DA1F3E")
                    .style("fill","none")
                    .style("stroke-width",2)
                    .style("stroke","#DA1F3E")
                    .attr("transform","translate("+ margin.left +","+ margin.top +")");

        //添加系列的小圆点
        svg.selectAll("ellipse")
        .data(dataset)
        .enter()
        .append("ellipse")
        .attr("cx", function(d,i) {
            return xScale(timeHours[i]);
        })
        .attr("cy", function(d) {
            return 0;
        })
        .transition()
        .delay(function(d,i){
            return i*100
        })
        .duration(1000)
        .ease('linear')
        .attr("cy", function(d,i) {
            return yScale(unitSums[i]);
        })
        .attr("rx",7)
        .attr("ry",5)
        .attr("fill","#DA1F3E")
        .attr("stroke","#F3F4F5")
        .attr("stroke-width","1")
        .attr("transform","translate("+ margin.left +","+ margin.top +")");

         //添加legends
         var legends = svg.append('g')
            .attr('class','legends')
            .attr("transform","translate("+ _width*0.82 +",-" + step*0.1 + ")");

        legends.append('line')
            .attr('x1',step)
            .attr('y1',step*0.6)
            .attr('x2',step*2)
            .attr('y2',step*0.6)
            .style('stroke','#84DF56')
            .style('stroke-width','3');
        legends.append('ellipse')
            .attr('cx',step*1.5)
            .attr('cy',step*0.6)
            .attr('rx',7)
            .attr('ry',5)
            .attr("fill","#84DF56")
            .attr("stroke","#F3F4F5")
            .attr("stroke-width","1");
        legends.append('text')
            .text("昨日")
            .attr("x", step*2)
            .attr("y", 0)
            .attr("dx", step*2)
            .attr("dy", "1.1em")
            .style('fill','#84DF56')
            .style("text-anchor", "end")
            .attr("font-size","25rem");
        legends.append('line')
            .attr('x1',step*5)
            .attr('y1',step*0.6)
            .attr('x2',step*6)
            .attr('y2',step*0.6)
            .style('stroke','#DA1F3E')
            .style('stroke-width','3');
        legends.append('ellipse')
            .attr('cx',step*5.5)
            .attr('cy',step*0.6)
            .attr('rx',7)
            .attr('ry',5)
            .attr("fill","#F58345")
            .attr("stroke","#F3F4F5")
            .attr("stroke-width","1");
        legends.append('text')
            .text("今日")
            .attr("x", step*3.5)
            .attr("y", 0)
            .attr("dx", step*4.5)
            .attr("dy", "1.1em")
            .style('fill','#DA1F3E')
            .style("text-anchor", "end")
            .attr("font-size","25rem");
    };
    return polygon;
});