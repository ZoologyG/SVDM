define(['d3'],function(d3){

    // 传入容器id
    var table = function(id,data){

        // 获取容器宽度，高度
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;

        // 请求获取来的数据
        var dataset = data;

        // 设置变量获取x轴，y轴数据
        var weights = [];
        var counts = [];
        var xDomain = [];
        if (id == '#hChartL') {
            weights = dataset.result.map(function(d,i){
                return d.weight_name;
            });
        } else if (id == '#hChartR') {
            weights = dataset.result.map(function(d,i){
                return d.unit_name;
            });
        } else {
            console.log(id + "x坐标轴参数不存在")
        }
        counts = dataset.result.map(function(d,i){
            return d.count;
        })
        xDomain = [0,d3.max(counts)*1.2];

        // 定义svg放入容器中
        var svg = d3.selectAll(id).append('svg')

        // 定义x轴比例尺
        var xScale = d3.scale.linear()
                .domain(xDomain)
                .range([0,width/2]);

        // 定义y轴比例尺
        var yScale = d3.scale.ordinal()
                    .domain([0,1,2,3,4,5])
                    .rangeRoundBands([0,height],0.33,0.25);

        var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");
        
        var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

        // 横向坐标轴
        // svg.append("g")
        // .attr("class","x axis")
        // // .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) + ")")
        // .call(xAxis);

        // 纵向坐标轴
        // svg.append("g")
        // .attr("class","y axis")
        // .attr("transform","translate(" + width/2 + ",0)")
        // .call(yAxis);


        //定义纵轴网格线
        var yInner = d3.svg.axis()
            .scale(yScale)
            .tickSize(width,0,0)
            .tickFormat("")
            .orient("right")
            .ticks(5);
        //添加纵轴网格线
        var yInnerBar = svg.append("g")
            .attr("class", "inner_line")
            .attr("transform", "translate("+ 0 +","+ yScale.rangeBand()*0.7 + ")")
            .call(yInner);

        // 添加矩形
        svg.append('g')
            .attr('class','rects')
            .attr("transform","translate(" + width/2 + "," + 0 + ")")
            .selectAll('rect')
            .data(counts)
            .enter()
            .append('rect')
			.style('fill',function(d,i){
                return id=='#hChartL'?'#DAC61F':'#DA1F3E';
            })
            .attr('x',function(d,i){
                return 0;
            })
            .attr('y',function(d,i){
                return yScale(i);
            })
            .attr('width',0)
            .attr('height',function(d,i){
                return yScale.rangeBand()
            })
            .transition()
            .delay(function(d,i){
                return i*250
            })
            .duration(1000)
            .ease('linear')
            .attr('width',function(d,i){
                return xScale(d);
            });
            
        // 绑定数据到指定text标签上
        var ids = svg.append('g')
                .attr('class','ids')
                .attr('transform', 'translate(' + (yScale.rangeBand()*0.4) + ',' + 0 + ')')
                .selectAll('text')
                .data(weights);
        // text标签update部分,插入文字，文字行数为6，多不
        ids.enter()
            .append('text')
            .text(function(d,i){
                return i+1;
            })
            .attr('x',function(d,i){
                return '0.28em';
            })
            .attr('y',function(d,i){
                return yScale(i);
            })
            .attr('dy','1.2em')
            .style('fill','#1CA3CB')
            .style('font-size','22rem')
            .style('text-anchor','middle');

        //绑定数据到name 
        var names = svg.append('g')
                    .attr('class','names')
                    .attr('transform', 'translate(' + yScale.rangeBand()*4 + ',' + 0 + ')')
                    .selectAll('text')
                    .data(weights);
        names.enter()
            .append('text')
            .text(function(d,i){
                return d;
            })
            .attr('x',function(d,i){
                return '0.55em';
            })
            .attr('y',function(d,i){
                return yScale(i);
            })
            .attr('dy','1.2em')
            .style('fill','#1CA3CB')
            .style('font-size','22rem')
            .style('text-anchor','middle');

        //绑定数据到name 
        var names = svg.append('g')
                    .attr('class','counts')
                    .attr('transform', 'translate(' + width*0.7 + ',' + 0 + ')')
                    .selectAll('text')
                    .data(counts);
        names.enter()
            .append('text')
            .text(function(d,i){
                return d;
            })
            .attr('x',function(d,i){
                return '0.55em';
            })
            .attr('y',function(d,i){
                return yScale(i);
            })
            .attr('dy','1.3em')
            // .style('fill','#1CA3CB')
            .style('fill',function(d,i){
                return id=='#hChartL'?'purple':'#DAC61F';
            })
            .style('font-size','22rem')
            .style('text-anchor','middle');
 
    };
    return table;
})