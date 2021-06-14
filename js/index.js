'use strict';
$('.close_img').click(function () {
    // window.dobot.close();
});
//点击小圆点,实现页面的切换
var max_pages = 5;
var cur_page = 0;
var spa = $('.dots .dotils span');

function optin_ligt() {
    spa.click(function () {
        var index = $(this).index();
        $(this).addClass('cil_cor').siblings().removeClass('cil_cor');
        $('#iframe').attr('src','index/' + (index + 1) + 'page.html');
        $('.content').text(display_str[index]);
        cur_page = index;
    });
}
optin_ligt();

//点击左右箭头,实现页面之间的跳转
var src = ['index/1page.html','index/2page.html','index/3page.html','index/4page.html','index/5page.html'];
var display_str=
    [
        "步骤一:插入USB电缆,并点击Dobot Studio的连接,然后你就可以通过studio操作机械臂了",
        "步骤二:您可以通过Dobot Studio控制圆盘控制机械臂到你想要的位置，并点击存点保存这个目标位置",
        "步骤三:当然你也还可以通过按住小臂的解锁按钮，拖动机械臂到目标位置，松开按钮后会自动记录一个点",
        "步骤四:当你想操作的点都设置好之后，点击开始回放按键，机械臂移动您设置的点",
        "步骤五:也许这些功能以及不能满足你的好奇心了,您可以打开高级模式，实现更多功能,详细设置参考帮助"
    ];
$('.bgc_blkr').click(function () {

    if(cur_page<(max_pages-1))
    {
        cur_page++;
        $('#iframe').attr('src',src[cur_page]);
        spa.eq(cur_page).addClass('cil_cor').siblings().removeClass('cil_cor');
        $('.content').text(display_str[cur_page]);
    }

});

$('.bgc_blkl').click(function () {
    if(cur_page > 0){
        cur_page--;
        $('#iframe').attr('src',src[cur_page]);
        spa.eq(cur_page).addClass('cil_cor').siblings().removeClass('cil_cor');
        $('.content').text(display_str[cur_page]);
    }
});