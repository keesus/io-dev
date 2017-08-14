
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

var $window = $(window);
var $body = $("body");
var $slide = $('.slide');

var QueryString = (function() {
    var pairs = location.search.slice(1).split('&');
    var result = {};
    
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
})();

var mobileKeyWords = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
var isMobile = false;
var nextEventDate;
var currentDate = new Date();
var dday;

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});



var adjustWindow = function () {

    var winH = $window.height();

    $slide.height(winH);
    $('.bleWrapper .mobileBle').height(winH);
};



var eventData;
var prefix = hostURL.prefix;



$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: prefix+"/eventInfo",
        dataType: 'application/json',
        headers : {'Content-Type':'application/json'},
        complete : function (data) {

            var isMAX = JSON.parse(data.responseText).data.max==JSON.parse(data.responseText).data.userCnt;

            if (data.status === 200) {
                if (JSON.parse(data.responseText).error === "no event") {
                    //이벤트가 없을때
                    //pc
                    $('.normalHeader').addClass("hidden");
                    $('nav.navbar.navbar-default.navbar-fixed-top').css("display","none !important");
                    $('a.buyBtn').addClass('hidden');
                    $('.buyFree').addClass('notVisible');
                    //mobile
                    $('.navbar-toggle').addClass('hidden');
                    $('.mContainer .row.buyWrapper .buyBtn').addClass('hidden');
                } else {

                    //이벤트가 있을때
                    if (isMAX) {
                        //pc
                        $('.normalHeader').addClass("hidden");
                        $('nav.navbar.navbar-default.navbar-fixed-top').css("display","none !important");
                        $('a.buyBtn').addClass('hidden');
                        $('.buyFree').removeClass('notVisible');

                        //mobile
                        $('.navbar-toggle').addClass('hidden');
                        $('.mContainer .row.buyWrapper .buyBtn').addClass('hidden');
                    } else {
                        //pc
                        $('.noEventHeader').addClass('hidden');
                        $('a.smsBtn').addClass('hidden');
                        $('.row.payDate').addClass('hidden');
                        $('section.row.noneSlideSMS').addClass('hidden');
                        $('section.smsWrapper').addClass("hidden");
                        $('.buyFree').addClass('notVisible');
                        //mobile
                        $('.smsSenderWrp').addClass('hidden');
                        $('.mContainer .row.payDate').addClass('hidden');
                        $('.mContainer .row.buyWrapper .smsBtn').addClass('hidden');
                        eventData = JSON.parse(data.responseText).data;
                    }

                }
            } else {
                alert("이벤트 정보 호출도중 에러가 발생했습니다.");
            }
        }
    });

    $.ajax({
        type: "GET",
        url: prefix + "/next",
        dataType: "application/json",
        headers: {'Content-Type':'application/json'},
        complete: function (data) {
            var date = JSON.parse(data.responseText).data.nextEventDate;
            nextEventDate = new Date(date.substring(0,4)*1, date.substring(5,7)*1-1, date.substring(8,10)*1);
            dday = Math.floor((nextEventDate.getTime() - currentDate.getTime())/(1000 * 60 * 60 * 24)) +1;

            $('.dDate').text(" "+dday+"일");
            $('.nextEventDate').text("이벤트 당일("+(nextEventDate.getMonth()+1)+"/"+nextEventDate.getDate()+")");
            $('.date span').text((nextEventDate.getMonth()+1)+"/"+nextEventDate.getDate());

            $('#nextEvent').text(date.substring(5,7) + '월 ' + (date.substring(8,10)*1) + '일 오전 11시');
            $('#mNextEvent').text(date.substring(5,7) + '월 ' + (date.substring(8,10)*1) + '일 오전 11시');
        }
    })

    $(".intro").imagesLoaded().done(function () {
        adjustWindow();

        // Fade in sections
        $body.removeClass('loading').addClass('loaded');
        $(".webWp").removeClass("hidden");
        $(".mContainer").removeClass("hidden");
    });

    $('#utm_source').val(QueryString.utm_source);
    $('#utm_medium').val(QueryString.utm_medium);
    $('#utm_campaign').val(QueryString.utm_campaign);
});

$(window).on("resize", function () {
});





$(".question").on('click', function (e) {


    var isVisibility = $($(this).find('.fold')).hasClass('hidden');

    console.log(isVisibility);

    if (isVisibility) {
        $($(this).find('.fold')).removeClass('hidden');
        $($(this).find('.unfold')).addClass('hidden');
        $(this).css("background-color","#eaeaea");
        $(this).css("font-weight","bold");
    } else {
        
        $($(this).find('.fold')).addClass('hidden');
        $($(this).find('.unfold')).removeClass('hidden');
        $(this).css("background-color","#f2f2f2");
        $(this).css("font-weight","normal");
    }

});



var moveToDeviceSelector = function (e) {
    var path = "/pay"+"/free.html";
    var campaignPath = "?utm_source=" + QueryString.utm_source + "&utm_medium=" + QueryString.utm_medium + "&utm_campaign=" + QueryString.utm_campaign;
    
    if(QueryString.utm_source !== undefined)
      path = path + campaignPath;

    location.href = path;
};

var equalToMax = function () {
    alert("신청이 마감되었습니다. 다음에 신청해주세요");
};


$(".buyFree").on("click", function () {

    if (eventData.max*1 > eventData.userCount) {
        moveToDeviceSelector();
    } else {
        equalToMax();
    }
});



$(".buyBtn").on("click",  function () {

    if (eventData.max*1 > eventData.userCount) {
        moveToDeviceSelector();
    } else {
        equalToMax();
    }
});

$(".submit").on('click', function(e) {
    
    
    
    if ($('.phoneNumber').val().length > 0) {

        $.ajax({
            type: "POST",
            url: prefix+"/tempMember/insert",
            dataType: 'application/json',
            headers : {'Content-Type':'application/json'},
            data : JSON.stringify({
                phoneNumber: $('.phoneNumber').val(),
                campaign : QueryString.utm_campaign
            }),
            complete : function (data) {
                var result = JSON.parse(data.responseText).data.result;
                if(result == 'success') {
                    alert('등록 되었어요! 이벤트 신청 전 sms 보내드릴게요 :)');
                    $('.dimmed').addClass('hidden');
                } else if(result == 'duplicated') {
                    alert('등록 되었어요! 이벤트 신청 전 sms 보내드릴게요 :)');
                    $('.dimmed').addClass('hidden');
                }
            }
        });
    } else {
        alert("폰번호를 입력해 주세요");
    }
});
$(".mSubmit").on('click', function(e) {

    if ($('.mPhoneNumber').val().length > 0) {

        $.ajax({
            type: "POST",
            url: prefix+"/tempMember/insert",
            dataType: 'application/json',
            headers : {'Content-Type':'application/json'},
            data : JSON.stringify({
                phoneNumber: $('.mPhoneNumber').val(),
                campaign : QueryString.utm_campaign
            }),
            complete : function (data) {
                var result = JSON.parse(data.responseText).data.result;
                if(result == 'success') {
                    alert('등록 되었어요! 이벤트 신청 전 sms 보내드릴게요 :)');
                    $('.dimmed').addClass('hidden');
                } else if(result == 'duplicated') {
                    alert('등록 되었어요! 이벤트 신청 전 sms 보내드릴게요 :)');
                    $('.dimmed').addClass('hidden');
                }
            }
        });
    } else {
        alert("폰번호를 입력해 주세요");
    }
});



for (var word in mobileKeyWords){

    if (navigator.userAgent.match(mobileKeyWords[word]) != null){
        isMobile = true;
    }
}



if (!isMobile) {

    $('a.smsBtn').attr("href","#smsPC");

    $('#fullpage').fullpage({
                anchors: ['introAnchor','ble','belcro','ng','morning','afternoon','night','pricePlanAnchor','noneSlideFree','faqAnchor','spec','size','footer'],
                autoScrolling: true,
                css3: true,
                fitToSection: false,
                scrollOverflow: true,
                afterLoad: function(anchorLink, index){
                    //section 3
                    if(anchorLink == 'morning' || anchorLink == 'afternoon' || anchorLink === 'night'){

                        $('#staticImg').removeClass('hidden');
                    }

                    if (anchorLink === 'night') {
                    }

                    $('#staticImg .timer').toggleClass("morningMock",anchorLink==='morning');
                    $('#staticImg .timer').toggleClass("afternoonMock",anchorLink==='afternoon');
                    $('#staticImg .timer').toggleClass("nightMock",anchorLink==='night');
                    $('._m').toggleClass("backgroundActive",anchorLink==='morning');
                    $('._a').toggleClass("backgroundActive",anchorLink==='afternoon');
                    $('._n').toggleClass("backgroundActive",anchorLink==='night' || anchorLink==='priceplan');
                },
                onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){
                },
                onLeave: function(index, nextIndex, direction){
                    if (index === 5 && direction === 'down') {
                        $('._m').addClass("backgroundHide");
                    } else if (index === 4 && direction === 'down') {
                    } else if (index === 7 && direction === 'down') {
                        $("#staticImg").addClass('hidden');
                        $.fn.fullpage.setAutoScrolling(false);
                    } else if (index === 5 && direction === 'up') {
                        $("#staticImg").addClass('hidden');
                    } else if (index === 8 && direction === "up") {
                        $.fn.fullpage.setAutoScrolling(true);
                    }
                }
            });
}

$('.chat').on('click',function (e) {
    location.href="http://bit.ly/iokatalk";
});
$('.facebook').on('click',function (e) {
    location.href="https://www.facebook.com/switcher.io/";
});
$('.insta').on('click', function (e) {
    location.href="https://www.instagram.com/io_switcher";
});

$('.bedCol.morning .next').on('click', function (e) {

    $('.mContainer .bedWrapper .bedCol.morning').animate({
        opacity:0
    },1000, function () {
        $('.mContainer .bedWrapper .bedCol.morning').css({"visibility":"hidden"});
    })
});

$('.bedCol.afternoon .next').on('click', function (e) {

    $('.mContainer .bedWrapper .bedCol.afternoon').animate({
        opacity:0
    },1000, function () {
        $('.mContainer .bedWrapper .bedCol.afternoon').css({"visibility":"hidden"});
    })
});

$('.bedCol.afternoon .previous').on('click', function (e) {


    $('.mContainer .bedWrapper .bedCol.morning').css({"visibility":"visible"}).animate({
        opacity:1
    },1000, function () {
    })
});

$('.bedCol.night .previous').on('click', function (e) {


    $('.mContainer .bedWrapper .bedCol.afternoon').css({"visibility":"visible"}).animate({
        opacity:1
    },1000, function () {
    })
});


function playVideoAndPauseOthers(frame) {
        $('iframe[src*="http://www.youtube.com/embed/"]').each(function(i) {
            var func = this === frame ? 'playVideo' : 'pauseVideo';
            this.contentWindow.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
        });
    }
    
$('.modal.fade').click(function (e) {
    console.log('click');
    if(isMobile) {
        $('#m-popup-youtube-player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');    
    } else {
        $('#popup-youtube-player')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');    
    }
    
})

$('strong.down').on('click', function(e) {
    location.href=location.href.split("#")[0]+"#ble"; 
});

$('.mPlayBtn').on('click', function(e) {
   $('#m-popup-youtube-player').attr('width',$(window).width()-20); 
});

window.onhashchange = function (e) {
};


$(".testBtn").on('click', function(e) {
    var path = "/pay"+"/test_device.html";
    location.href = path;
});





