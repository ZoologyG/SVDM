define(['d3'], function(d3) {
    var pieCaption = function (id,data) {
        // 获取原始数据
        var dataset = data;

        //设置画布大小，等于容器大小
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;

        // 设置矩形宽高
        var rectWidth = width*0.15;
        var rectHeight = height*0.2;

        // 设置颜色族
        colors = ['#e111da', '#115ae1','#e14c11', '#06b930','#867BF1'];

        var svg = d3.select(id)
                    .append('svg')
                    .attr('width',width)
                    .attr('height',height);
        svg.append('g')
            .selectAll('rect') 
            .data(dataset)
            .enter()
            .append('rect')
            .attr('x',0)
            .attr('y',function(d,i){
                    return i*rectHeight;
            })
            .attr('width',rectWidth)
            .attr('height',rectHeight*0.8)
            .style('fill',function(d,i){
                return colors[i];
            });

        svg.append('g')
            .selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .attr('x',rectWidth)
            .attr('y',function(d,i){
                    return i*rectHeight;
            })
            .attr('dx',rectWidth)
            .attr('dy','25rem')
            .style('fill',function(d,i){
                return '#E8E8E8';
            })
            .style('font-size','25rem')
            .text(function(d,i){
                return d;
            })
    };
    return pieCaption;
});