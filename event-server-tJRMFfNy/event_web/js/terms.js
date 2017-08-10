/**
 * Created by 1001188 on 2016. 3. 30..
 */
var mobileKeyWords = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
var isMobile = false;

for (var word in mobileKeyWords){
    if (navigator.userAgent.match(mobileKeyWords[word]) != null){
        isMobile = true;
    }
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$('.service a').click(function (e) {
    e.preventDefault();
    $(this).tab('show')
})

$('.chat').on('click',function (e) {
    location.href="http://bit.ly/iokatalk";
});
$('.facebook').on('click',function (e) {
    location.href="https://www.facebook.com/switcher.io/";
});
$('.insta').on('click', function (e) {
    location.href="https://www.instagram.com/io_switcher";
});

var type = getUrlVars()["type"];

if (isMobile) {
    $('._mPolicy').trigger('click');  
} else {
    $('._mPolicy').trigger('click');     
}
