

define(['d3'],function(d3){

    var dbchart = function (id,data) {
        const _self = this;
         // 设置变量接收数据,数据结构：[{'time':null,'car_cnt':null,'company_cnt':null}]
        var dataset = data;
        //模拟后台json数据
        var dataset_push = [];

        // 设置画布大小，等于容器大小
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;
        
        //svg留边空白
        var margin = {};
        margin.left = width*0.05208333;
        margin.right = width*0.0625;
        margin.top = height*0.22277904;
        margin.bottom = height*0.17539863;

        // 去边宽高
        var _width = width - margin.left - margin.right;
        var _height = height - margin.top - margin.bottom;

        //定义x轴比例尺
        // var xData = dataset.map(function(d) { 
        //     return d.time; 
        // });
        var xData = [0,1,2,3,4,5,6,7,8,9];
        var x = d3.scale.ordinal()
                .domain(xData)
                .rangeRoundBands([0, _width],0.7,0.2);
        // 左侧y轴比例尺-company_cnt
        var ylData = dataset.map(function(d) { 
            return d.company_cnt; 
        });
        var yl = d3.scale.linear()
                // .domain([0, d3.max(ylData)*1.2])
                .domain([0, 40])
                .range([height - margin.top - margin.bottom, 0]);
        // 右侧y轴比例尺-car_cnt
        var yrData = dataset.map(function(d) { 
            return d.car_cnt; 
        });
        var yr = d3.scale.linear()
                // .domain([0,d3.max(yrData)*1.2])
                .domain([0,1500])
                .range([height - margin.top - margin.bottom, 0]);

        // 创建底部x轴
        var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");
        // 创建左侧y轴-yl
        var yAxisLeft = d3.svg.axis()
                        .scale(yl)
                        .ticks(4)
                        .orient("left");

        // 创建右侧y轴-yr
        var yAxisRight = d3.svg.axis()
                        .scale(yr)
                        .ticks(4)
                        .orient("right");
        // 目标容器下创建svg
        var svg = d3.select(id)
                    .append("svg")
                    .append("g")
                    .attr("class", "graph")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // 创建底部横轴 x
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _height + ")")
            .call(xAxis);

        // 创建左侧纵轴 yl
        svg.append("g")
            .attr("class", "y axis axisLeft")
            .attr("transform", "translate(0,0)")
            .call(yAxisLeft)
            .append("text")
            .attr("y", 0)
            .attr("dy", "-1em")
            .style('fill','#82EBF2')
            .style("text-anchor", "end")
            .text("风险")
            .attr("font-size","22rem");

        // 创建右侧纵轴 yr
        svg.append("g")
            .attr("class", "y axis axisRight")
            .attr("transform", "translate(" + _width + ",0)")
            .call(yAxisRight)
            .append("text")
            .attr("y", 0)
            .attr("dy", "-1em")
            .style("text-anchor", "start")
            .text("预警")
            .attr("font-size","22rem");

        //定义纵轴网格线
        var yInner = d3.svg.axis()
            .scale(yl)
            .tickSize(_width,0,0)
            .tickFormat("")
            .orient("right")
            .ticks(5);
        //添加纵轴网格线
        var yInnerBar = svg.append("g")
            .attr("class", "inner_line")
            .attr("transform", "translate("+ 0 +",0)")
            .call(yInner);

        // 添加矩形
        var rects = svg.append('g').attr('class','rects')
        // 创建矩形顶部文字
        var rectTopText = svg.append('g').attr("transform", "translate(-" + x.rangeBand()*0.5 + ",-" + x.rangeBand()*0.8 + ")")
        // 创建矩形底部文字
        var xAxisText = svg.append('g').attr("transform", "translate(-" + x.rangeBand()*0.5 + "," + _height + ")")
        // 创建系列小圆点
        var ellipses = svg.append('g').attr('class','ellipses')
        // 创建折线
        var poyline = svg.append('g').attr('class','poyline')
        
        // 定义初始化矩形，用于占位
        rects.selectAll(".rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "rect")
            .style('fill','#84DF56')
            .attr("x", function(d,i) { return x(i);})
            .attr("y", function(d) { return yr(d.car_cnt); })
            .attr("width", x.rangeBand())
            .attr("height", function(d,i) { return _height - yr(d.car_cnt);});
        // 定义初始化矩形头部文字，用于占位
        rectTopText.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .attr('x',function(d,i){
                return x(i);
            })
            .attr('y',function(d,i){
                return 0;
                // return -((x.rangeBand())*3);
            })
            .attr('dx',function(d,i){
                return (x.rangeBand())*0.5;
            })
            .attr('dy',function(d,i){
                return x.rangeBand()*0.5;
            })
            .text(function(d,i){
                return d.car_cnt;
            })
            .attr('font-size','22rem')
            .style('fill','#81E9F0')
            .style('text-anchor','start');
        // 添加x轴底部文字
        xAxisText.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .attr('x',function(d,i){
                return x(i);
            })
            .attr('y',function(d,i){
                return 10;
                // return -((x.rangeBand())*3);
            })
            .attr('dx',function(d,i){
                return (x.rangeBand());
            })
            .attr('dy',function(d,i){
                return x.rangeBand()*0.5;
            })
            .text(function(d,i){
                return d.time;
            })
            .attr('font-size','22rem')
            .style('fill','#81E9F0')
            .style('text-anchor','middle');
        // 添加折线
        var linef = d3.svg.line()
                    .x(function(d,i){return x(i);})
                    .y(function(d){return yl(d.company_cnt);})
                    .interpolate("cardinal");//cardinal
        poyline.append("path")
                    .attr("d", linef(dataset))
                    .style("fill","#F58345")
                    .style("fill","none")
                    .style("stroke-width",2)
                    .style("stroke","#F58345")
                    .attr("transform","translate("+ x.rangeBand()*0.5 +",0)");
                    // .attr("transform","translate("+ margin.left +","+ margin.top +")");
        //添加系列的小圆点
        ellipses.selectAll("ellipse")
            .data(dataset)
            .enter()
            .append("ellipse")
            .attr("cx", function(d,i) {
                return x(i);
            })
            .attr("cy", function(d) {
                return yl(d.company_cnt);
            })
            .attr("rx",7)
            .attr("ry",5)
            .attr("fill","#F58345")
            .attr("stroke","#F3F4F5")
            .attr("stroke-width","1")
            .attr("transform","translate("+ x.rangeBand()*0.5 +",0)");

        //定义ajax请求数据到缓存数据dataset_push中
        function ajaj(){
            $.ajax({
                type: "post",
                url : "svdm/bigscreen/realMinute",
                dataType : "json",
                success : function(data){
                    dataset_push = dataset_push.concat(data)
                },
                error : function(XMLHttpRequest, textStatus, errorThrown){
                    console.log(errorThrown);
                }
            });
        }

        //定时请求数据，轮询
        ajaj();
        var interval_ajaj = setInterval(function(){
            ajaj();
        },10000)
        // 定义单条数据添加至DOM的重绘函数
        function appendSingleData () {
        // dataset_push新增一条数据
            if(dataset_push.length==0){
                dataset_push.push({"time":"data","company_cnt":0,"car_cnt":0});
            }
            var data = dataset_push.shift();
            dataset.push(data);
            dataset.shift();
        // 矩形左移
            // 选中第一个rect并使rect高度height渐变为0
            rects.select('rect')
                .transition()
                .remove();
            //尾部追加一个rect用于存放新数据
            rects.append('rect')
                .data([data])
                .attr("x", width)
                .attr("width", x.rangeBand())
                .attr('y',function(d) { return yr(d.car_cnt); })
                .attr('height',function(d,i) { return _height - yr(d.car_cnt);})
                .attr('fill','#84DF56');
            // 所有元素左移
            rects.selectAll('rect')
                .transition()
                .delay(function(d,i){
                    return 200;
                })
                .duration(function(d,i){
                    return 200;
                })
                .ease('linear')
                .attr("x", function(d,i) { return x(i-1);});
            // 坑：第一个删除的元素已经在DOM中删除，但还是存在于d3集合中
            rects.select('rect').remove()
        // 矩形头部文字左移
            // 选中第一个rect并使rect高度height渐变为0
            rectTopText.select('text')
                .transition()
                .remove();
            //尾部追加一个rect用于存放新数据
            rectTopText.append('text')
                .data([data])
                .attr("x", width)
                .attr('y',function(d,i){
                    return 0;
                    // return -((x.rangeBand())*3);
                })
                .attr('dx',function(d,i){
                    return (x.rangeBand())*0.3;
                })
                .attr('dy',function(d,i){
                    return x.rangeBand()*0.5;
                })
                .text(function(d,i){
                    return d.car_cnt;
                })
                .attr('font-size','22rem')
                .style('fill','#81E9F0')
                .style('text-anchor','start');
            // 所有元素左移
            rectTopText.selectAll('text')
                .transition()
                .delay(function(d,i){
                    return 200;
                })
                .duration(function(d,i){
                    return 200;
                })
                .ease('linear')
                .attr("x", function(d,i) { return x(i-1);});
            // 坑：第一个删除的元素已经在DOM中删除，但还是存在于d3集合中
            rectTopText.select('text').remove()
        // x轴文字
            // 选中第一个rect并使rect高度height渐变为0
            xAxisText.select('text')
                .transition()
                .remove();
            //尾部追加一个rect用于存放新数据
            xAxisText.append('text')
                .data([data])
                .attr("x", width)
                .attr('y',function(d,i){
                    return 10;
                    // return -((x.rangeBand())*3);
                })
                .attr('dx',function(d,i){
                    return (x.rangeBand());
                })
                .attr('dy',function(d,i){
                    return x.rangeBand()*0.5;
                })
                .text(function(d,i){
                    return d.time;
                })
                .attr('font-size','22rem')
                .style('fill','#81E9F0')
                .style('text-anchor','middle');
            // 所有元素左移
            xAxisText.selectAll('text')
                .transition()
                .delay(function(d,i){
                    return 200;
                })
                .duration(function(d,i){
                    return 200;
                })
                .ease('linear')
                .attr("x", function(d,i) { return x(i-1);});
            // 坑：第一个删除的元素已经在DOM中删除，但还是存在于d3集合中
            xAxisText.select('text').remove()
        // 添加折线
        poyline.select("path")
                    .transition()
                    .delay(200)
                    .duration(200)
                    .ease('linear')
                    .attr("d", linef(dataset))
                    .style("fill","#F58345")
                    .style("fill","none")
                    .style("stroke-width",2)
                    .style("stroke","#F58345")
                    .attr("transform","translate("+ x.rangeBand()*0.5 +",0)");
                    // .attr("transform","translate("+ margin.left +","+ margin.top +")");

        //添加系列的小圆点
            // 选中第一个rect并使rect高度height渐变为0
            ellipses.select('ellipse')
                .transition()
                .remove();
            //尾部追加一个rect用于存放新数据
            ellipses.append('ellipse')
                .data([data])
                .attr("cx", function(d,i) {
                    return width;
                })
                .attr("cy", function(d) {
                    return yl(d.company_cnt);
                })
                .attr("rx",7)
                .attr("ry",5)
                .attr("fill","#F58345")
                .attr("stroke","#F3F4F5")
                .attr("stroke-width","1")
                .attr("transform","translate("+ x.rangeBand()*0.5 +",0)");
            // 所有元素左移
            ellipses.selectAll('ellipse')
                .transition()
                .delay(function(d,i){
                    return 200;
                })
                .duration(function(d,i){
                    return 200;
                })
                .ease('linear')
                .attr("cx", function(d,i) { return x(i-1);})
                .attr("transform","translate("+ x.rangeBand()*0.5 +",0)");
            // 坑：第一个删除的元素已经在DOM中删除，但还是存在于d3集合中
            ellipses.select('ellipse').remove();
        }

        // 循环绘制
        setInterval(function(){
            // console.log(dataset_push)
            appendSingleData();
        },1000)

        // // 添加折线
        // var linef = d3.svg.line()

        //             .x(function(d,i){return x(i);})
        //             .y(function(d){return yl(d.company_cnt);})
        //             .interpolate("cardinal");
        // var path = svg.append("path")
        //             .transition()
        //             .delay(2500)
        //             .duration(1000)
        //             .ease('linear')
        //             .attr("d", linef(dataset))
        //             .style("fill","#F58345")
        //             .style("fill","none")
        //             .style("stroke-width",2)
        //             .style("stroke","#F58345")
        //             .attr("transform","translate("+ x.rangeBand()*0.5 +",0)");
        //             // .attr("transform","translate("+ margin.left +","+ margin.top +")");

        //添加图例legend
        const legend = svg.append('g')
                        .attr('class','legend')
                        .attr("transform","translate("+ _width*0.73 +",-" + x.rangeBand()*3 + ")");
        legend.append('rect')
                .attr('width',x.rangeBand())
                .attr('height',x.rangeBand())
                .style('fill','#84DF56');
        legend.append('text')
                .text("车辆预警")
                .attr("x", x.rangeBand()*1.5)
                .attr("y", 0)
                .attr("dx", x.rangeBand()*3)
                .attr("dy", "1.1em")
                .style('fill','#84DF56')
                .style("text-anchor", "end")
                .style("font-size","25rem");
        legend.append('line')
                .attr('x1',x.rangeBand()*5)
                .attr('y1',x.rangeBand()*0.6)
                .attr('x2',x.rangeBand()*6)
                .attr('y2',x.rangeBand()*0.6)
                .style('stroke','#F58345')
                .style('stroke-width','3')
        legend.append('ellipse')
                .attr('cx',x.rangeBand()*5.5)
                .attr('cy',x.rangeBand()*0.6)
                .attr('rx',5)
                .attr('ry',3)
                .attr("fill","#F58345")
                .attr("stroke","#F3F4F5")
                .attr("stroke-width","1")
        legend.append('text')
                .text("公司风险")
                .attr("x", x.rangeBand()*4.5)
                .attr("y", 0)
                .attr("dx", x.rangeBand()*5)
                .attr("dy", "1.1em")
                .style('fill','#F48245')
                .style("text-anchor", "end")
                .attr("font-size","25rem");

        // 定义一个随机数据函数
        function rndNum(min,max){
            var rnd = Math.random();
            var range = max - min;
            var num = min + Math.round(rnd * range); //四舍五入
            return num;
        }
    };
    return dbchart;
})