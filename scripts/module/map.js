define(['d3','jquery'], function(d3,$) {
    var map = function (id,map) {
        var oDiv = d3.select(id);
        var width = oDiv[0][0].clientWidth;
        var height = oDiv[0][0].clientHeight;
        // 添加svg到指定容器中
        var svg = oDiv.append("svg")
            .append("g")
            .attr("transform", "translate(0,0)");
        // 布局（数据转化）
        var projection = d3.geo.mercator()
                            .center([107, 31])
                            .scale(width*0.8)
                            .translate([width/2, height*2/3]);
        // 定义路径生成器
        var path = d3.geo.path()
                        .projection(projection);

        // 绘制地图
        svg.selectAll("path")
            .data( map.features )
            .enter()
            .append("path")
            .attr("stroke","#6A7B97")
            .attr("stroke-width",1)
            .attr("fill","#215698")
            .attr("d", path )
            .on("mouseover",function(d,i){
                d3.select(this)
                    .attr("fill","yellow");
            })
            .on("mouseout",function(d,i){
                d3.select(this)
                    .attr("fill","#215698");
            });

            // 初始化加载
            ajaj();
            // 每20s轮询一次
            setInterval(function(){
                ajaj();
            },20000) 

            function ajaj() {
                $.post('svdm/bigscreen/mapData',function(data){
                    var _data = JSON.parse(data);
                    // 测试数据
                    // var _data ={
                    //     status:200,
                    //     result:[
                    //         {"riskLevel": 0,"color":"#0AF056","lineName": "豫G97156","startPosition": [120,32],"endPosition": [116,55]},
                    //         {"riskLevel": 0,"color":"#FDE309","lineName": "jiG97156","startPosition": [116,38],"endPosition": [116,34]},
                    //         {"riskLevel": 0,"color":"#F6152A","lineName": "sG97156","startPosition": [115,37],"endPosition": [116,38]}
                    //     ]}
    
                    if (_data.status==200) {
                        // 对路线数组中的数据进行筛选
                        _data.result.map(function(v,i,arr){
                            if (!(v.startPosition[0] && v.startPosition[1] && v.endPosition[0] && v.endPosition[1])){
                                arr.splice(i,1);
                            }
                        })
                        //添加连线
                        svg.selectAll('line')
                            .data(_data.result)
                            .enter()
                            .append('line')
                            // .attr('class',function(d,i){
                            //     return i + ':' + d.lineName;
                            // })
                            .attr('x1',function(d,i){
                                return projection(d.startPosition)[0]
                            })
                            .attr('y1',function(d,i){
                                return projection(d.startPosition)[1]
                            })
                            .attr('x2',function(d,i){
                                return projection(d.endPosition)[0]
                            })
                            .attr('y2',function(d,i){
                                return projection(d.endPosition)[1]
                            })
                            .style('stroke',function(d,i){
                                return d.color;
                            })
                            .style('stroke-width',1);
                            // .interpolate("basis");
    
                        // 添加起始点小圆圈
                        svg.selectAll("circle.start-position")
                            .data(_data.result)
                            .enter()
                            .append("circle")
                            .attr('class','start-position')
                            .attr("cx", function(d,i) {
                                return projection(d.startPosition)[0];
                            })
                            .attr("cy", function(d,i) {
                                return projection(d.startPosition)[1];
                            })
                            .attr("r",1.5)
                            .attr("fill",function(d,i){
                                return d.color;
                            });
    
                         // 添加终止点小圆圈
                         svg.selectAll("circle.end-position")
                            .data(_data.result)
                            .enter()
                            .append("circle")
                            .attr('class','end-position')
                            .attr("cx", function(d,i) {
                                return projection(d.endPosition)[0];
                            })
                            .attr("cy", function(d,i) {
                                return projection(d.endPosition)[1];
                            })
                            .attr("r",1.5)
                            .attr("fill",function(d,i){
                                return d.color;
                            });
    
                    } else if (_data.status==201) {
                        console.log('地图：路线数据为空')
                    } else {
                        console.log('非200、201的其他报错')
                    }
                });
            }
    };
    return map;
});