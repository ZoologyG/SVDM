define(['d3','getColor'],function(d3,getColor){
    
    var radar = function (id,d) {

        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;

        // 创建一个分组用来组合要画的图表元素
        var svg = d3.select(id).
                    append('svg')
                    .attr('transform', 'rotate(-18)');

        var main = svg.append('g')
        .classed('main', true)
        .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');//rotate(-18)

        // 定义数据放大倍数
        const Multiply = 1;
        // 模拟数据
        var data = {
            fieldNames: ['行驶行为','天气情况','路况数据','车辆情况','管理水平'],
            values: [
                [d.driver_analysis*Multiply,
                d.weather_condition_analysis*Multiply,
                d.road_condition_analysis*Multiply,
                d.vehicle_conditions_analysis*Multiply,
                d.management_situation_analysis*Multiply]
            ]
        };
         // 雷达半径
         var radius = d3.min([width/2,height/2])*0.7,
         // 指标的个数，即fieldNames的长度
                 total = data.fieldNames.length,
         // 需要将网轴分成几级，即网轴上从小到大有多少个正多边形
                 level = 4;
         // 网轴的范围，类似坐标轴
         var rangeMin = 0;
         // 动态获取最大值
         var rangeMax = d3.max(data.values[0])*1.5;
         // 每项指标所在的角度
         var arc =2 * Math.PI;        
         var onePiece = arc/total;
         // 计算网轴的正多边形的坐标
         var polygons = {
             webs: [],
             webPoints: []
         };
         for(var k=level;k>0;k--) {
             var webs = '',
                     webPoints = [];
             var r = radius/level * k;
             for(var i=0;i<total;i++) {
                 var x = r * Math.cos(i * onePiece),
                         y = r * Math.sin(i * onePiece);
                 webs += x + ',' + y + ' ';
                 webPoints.push({
                     x: x,
                     y: y
                 });
             }
             polygons.webs.push(webs);
             polygons.webPoints.push(webPoints);
         }
         // 绘制网轴
         var webs = main.append('g')
                 .classed('webs', true);
         webs.selectAll('polygon')
                 .data(polygons.webs)
                 .enter()
                 .append('polygon')
                 .attr('points', function(d) {
                     return d;
                 });
         // 添加纵轴
         var lines = main.append('g')
                 .classed('lines', true);
         lines.selectAll('line')
                 .data(polygons.webPoints[0])
                 .enter()
                 .append('line')
                 .attr('x1', 0)
                 .attr('y1', 0)
                 .attr('x2', function(d) {
                     return d.x;
                 })
                 .attr('y2', function(d) {
                     return d.y;
                 });
         // 计算雷达图表的坐标
         var areasData = [];
         var values = data.values;
         for(var i=0;i<values.length;i++) {
             var value = values[i],
                     area = '',
                     points = [];
             for(var k=0;k<total;k++) {
                 var r = radius * (value[k] - rangeMin)/(rangeMax - rangeMin);
                 var x = r * Math.cos(k * onePiece),
                         y = r * Math.sin(k * onePiece);
                 area += x + ',' + y + ' ';
                 points.push({
                     x: x,
                     y: y
                 })
             }
             areasData.push({
                 polygon: area,
                 points: points
             });
         }
         // 添加g分组包含所有雷达图区域
         var areas = main.append('g')
                 .classed('areas', true);
         // 添加g分组用来包含一个雷达图区域下的多边形以及圆点
         areas.selectAll('g')
                 .data(areasData)
                 .enter()
                 .append('g')
                 .attr('class',function(d, i) {
                     return 'area' + (i+1);
                 });
         for(var i=0;i<areasData.length;i++) {
             // 依次循环每个雷达图区域
             var area = areas.select('.area' + (i+1)),
                     areaData = areasData[i];
             // 绘制雷达图区域下的多边形
			 area.append('polygon')
                    .attr('stroke', function(d, index) {
                        return getColor(i);
                    })
                    .attr('fill', function(d, index) {
                        return getColor(i);
                    })
                    .attr('points',[0,0,0,0,0,0])
                    .transition()
                    .delay(function(d,i){
                        return 250
                    })
                    .duration(1000)
                    .ease('linear')
                    .attr('points', areaData.polygon);
             // 绘制雷达图区域下的点
             var circles = area.append('g')
                     .classed('circles', true);
             circles.selectAll('circle')
                    .data(areaData.points)
                    .enter()
                    .append('circle')
                    .attr('r', 0)
                    .attr('stroke', function(d, index) {
                        return getColor(i);
                    })
                    .attr('cx', function(d) {
                        return 0;
                    })
                    .attr('cy', function(d) {
                        return 0;
                    })
                    .transition()
                    .delay(function(d,i){
                        return 250
                    })
                    .duration(1000)
                    .ease('linear')
                    .attr('cx', function(d) {
                        return d.x;
                    })
                    .attr('cy', function(d) {
                        return d.y;
                    })
         }
         // 计算文字标签坐标
         var textPoints = [];
         var textRadius = radius*1.3;
         for(var i=0;i<total;i++) {
             var x = textRadius * Math.cos(i * onePiece - 0.1*Math.PI),
                 y = textRadius * Math.sin(i * onePiece - 0.1*Math.PI);
             textPoints.push({
                 x: x,
                 y: y
             });
         }
         // 绘制文字标签
         var texts = main.append('g')
                 .classed('texts', true)
                 .attr('transform','rotate(18)');
         texts.selectAll('text')
                 .data(textPoints)
                 .enter()
                 .append('text')
                 .attr('x', function(d) {
                     return d.x;
                 })
                 .attr('y', function(d) {
                     return d.y;
                 })
                 .attr('dy', function(d) {
                    return '0.5em';
                 })
                 .style('text-anchor','middle')
                 .text(function(d,i) {
                     return data.fieldNames[i];
                 });
                 
    };
    return radar;
})