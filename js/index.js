'use strict';
$('.close_img').click(function () {
    // window.dobot.close();
});
//点击小圆点,实现页面的切换
var max_pages = 5;
var cur_page = 0;
var spa = $('.dots .dotils span');
spa.click(function () {
    var index = $(this).index();
    $(this).addClass('cil_cor').siblings().removeClass('cil_cor');
    $('#iframe').attr('src','index/' + (index + 1) + 'page.html');
    cur_page = index;
    // console.log("cur_page:",cur_page);
});

//点击左右箭头,实现页面之间的跳转

$('.bgc_blkr').click(function () {
    var src = ['index/1page.html','index/2page.html','index/3page.html','index/4page.html','index/5page.html'];

    if(cur_page<(max_pages-1))
    {
        cur_page++;
        $('#iframe').attr('src',src[cur_page]);

    }

});