/**
 * Created by 1001188 on 2016. 3. 31..
 */


var eventData;
var prefix = hostURL.prefix;

var QueryString = (function() {
    var pairs = location.search.slice(1).split('&');
    var result = {};

    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
})();

$(document).ready(function () {

    $('.contentWrapper').css('margin-top',(($(window).height()/2) - ($('.contentWrapper').height()/2) - 100) + 'px');

    $.ajax({
        type: 'GET',
        url: prefix + '/eventInfo',
        dataType: 'application/json',
        headers: {'Content-Type':'application/json'},
        complete: function(data) {
            if (data.status === 200) {
                eventData = JSON.parse(data.responseText).data;
                $('main').removeClass('hidden');
            } else {
                alert('이벤트 정보 호출도중 에러가 발생했습니다.');
            }
        }
    });

    $('#utm_source').val(QueryString.utm_source);
    $('#utm_medium').val(QueryString.utm_medium);
    $('#utm_campaign').val(QueryString.utm_campaign);
});


var moveToDeviceSelector = function (e) {
    var path = "/pay"+"/device.html";
    var campaignPath = "?utm_source=" + QueryString.utm_source + "&utm_medium=" + QueryString.utm_medium + "&utm_campaign=" + QueryString.utm_campaign;
    
    if(QueryString.utm_source !== undefined)
        path = path + campaignPath;

    location.href = path;
};

var equalToMax = function () {
    alert('신청이 마감되었습니다. 다음에 신청해주세요');
};

$(".goToDevice").on("click", function () {
    if (eventData.max*1 > eventData.userCount) {
        moveToDeviceSelector();
    } else {
        equalToMax();
    }
});
