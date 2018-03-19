define(['d3'],function (d3) {
    
    // 获取自定义数组中的色值
    var getColor = function (idx) {
            var palette = [
                '#E2FC03', '#867BF1', '#5ab1ef', '#ffb980', '#d87a80',
                '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
            ];
            return palette[idx % palette.length];
        };

    return getColor;
})