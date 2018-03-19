
// 页面现行加载rem计算方法，再添加样式文件，否则css中rem设置会导致样式重绘，导致闪屏！
(function(){
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 3840 + 'px';
    console.log('1rem: ',document.documentElement.style.fontSize)
})();

