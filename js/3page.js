/**
 * Created by navy on 2017/6/28.
 */
'use strict';
//点击close按钮,关闭整个页面
$('.close_img').click(function () {
    // window.dobot.close();
});
$('.dot_t').addClass('cil_cor');
//点击左右箭头,实现页面之间的调整
$('.bgc_blkl').click(function () {
    window.location.href = "index/2page.html";
});
$('.bgc_blkr').click(function () {
    window.location.href = "index/4page.html";
});
$('.dot_f').click(function () {
    window.location.href = "index/index.html";
});
$('.dot_s').click(function () {
    window.location.href = "index/2page.html";
});
$('.dot_fo').click(function () {
    window.location.href = "index/4page.html";
});
$('.dot_fi').click(function () {
    window.location.href = "index/5page.html";
});