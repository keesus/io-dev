/**
 * Created by Rachel on 2017. 2. 8..
 */

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

var mobileKeyWords = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
var isMobile = false;

var pageNumber;
var prefix = hostURL.prefix;

var adjustWindow = function () {

  var winH = $window.height();

  $slide.height(winH);
  $('.bleWrapper .mobileBle').height(winH);
};

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

$(document).ready(function () {

  $('.normalHeader').addClass("hidden");
  $('nav.navbar.navbar-default.navbar-fixed-top').css("display","none !important");
  $('.buyFree').addClass('notVisible');
  //mobile
  $('.navbar-toggle').addClass('hidden');
  $('.mContainer .row.buyWrapper .buyBtn').addClass('hidden');

  $(".intro").imagesLoaded().done(function () {
    adjustWindow();
    $body.removeClass('loading').addClass('loaded');
    $(".webWp").removeClass("hidden");
    $(".mContainer").removeClass("hidden");
  });

  $(location).attr('href');
  var path = window.location.pathname.split('/');
  pageNumber = path[path.length-1];

  $.ajax({
    type: 'PUT',
    url: prefix + '/purchases/' + pageNumber,
    dataType: 'application/json',
    headers: {'Content-Type': 'application/json'},
    complete: function(data) {
      if(data.status === 200) {
      } else {
        alert('이벤트 정보 호출도중 에러가 발생했습니다.');
      }
    }
  });

  var date = new Date();
  date.setDate(date.getDate() + 5);

  $('#nextEvent').text((date.getMonth()+1) + '월 ' + date.getDate() + '일 오전 11시');
  $('#mNextEvent').text((date.getMonth()+1) + '월 ' + date.getDate() + '일 오전 11시');
});

for (var word in mobileKeyWords){
  if (navigator.userAgent.match(mobileKeyWords[word]) != null){
    isMobile = true;
  }
}

if (!isMobile) {

  $('a.smsBtn').attr("href","#smsPC");

  $('#fullpage').fullpage({
    anchors: ['intro','ble','belcro','ng','morning','afternoon','night','priceplan','noneSlideFree','faq','spec','size','footer'],
    autoScrolling: true,
    css3: true,
    fitToSection: false,
    scrollOverflow: true,
    afterLoad: function(anchorLink, index){
      //section 3
      if(anchorLink == 'morning'){
        $('#staticImg').removeClass('hidden');
      }

      $('#staticImg .timer').toggleClass("morningMock",anchorLink==='morning');
      $('._m').toggleClass("backgroundActive",anchorLink==='morning');
    },
    onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){
    },
    onLeave: function(index, nextIndex, direction){

      if (index === 5 && direction === 'down') {
        $('._m').addClass("backgroundHide");
        $("#staticImg").addClass('hidden');
      } else if (index === 4 && direction === 'down') {
      } else if (index === 5 && direction === 'up') {
        $("#staticImg").addClass('hidden');
      }
    }
  });
}

$('.bedCol.morning .next').on('click', function (e) {

  $('.mContainer .bedWrapper .bedCol.morning').animate({
    opacity:0
  },1000, function () {
    $('.mContainer .bedWrapper .bedCol.morning').css({"visibility":"hidden"});
  })
});

function playVideoAndPauseOthers(frame) {
  $('iframe[src*="http://www.youtube.com/embed/"]').each(function(i) {
    var func = this === frame ? 'playVideo' : 'pauseVideo';
    this.contentWindow.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
  });
}

$('.modal.fade').click(function (e) {

});

$('strong.down').on('click', function(e) {
  location.href=location.href.split("#")[0]+"#ble";
});

$('.mPlayBtn').on('click', function(e) {
  $('#m-popup-youtube-player').attr('width',$(window).width()-20);
});

window.onhashchange = function (e) { };

$(".submit").on('click', function (error) {
  if ($('.phoneNumber').val().length > 0) {
    $.ajax({
      type: 'POST',
      url: prefix + '/purchases/' + pageNumber,
      dataType: 'application/json',
      headers : {'Content-Type':'application/json'},
      data : JSON.stringify({
        phoneNumber: $('.phoneNumber').val(),
        pageNumber : pageNumber
      }),
      complete : function (data) {
        alert('등록 되었어요! 이벤트 신청 전 sms 보내드릴게요 :)');
        $("#endBuyModal").modal('hide');
      }
    });
  } else {
    alert('폰번호를 입력해 주세요');
  }
});

$(".mSubmit").on('click', function (error) {
  if ($('.mPhoneNumber').val().length > 0) {
    $.ajax({
      type: 'POST',
      url: prefix + '/purchases/' + pageNumber,
      dataType: 'application/json',
      headers : {'Content-Type':'application/json'},
      data : JSON.stringify({
        phoneNumber: $('.mPhoneNumber').val(),
        pageNumber : pageNumber
      }),
      complete : function (data) {
        alert('등록 되었어요! 이벤트 신청 전 sms 보내드릴게요 :)');
        $("#mEndBuyModal").modal('hide');
      }
    });
  } else {
    alert('폰번호를 입력해 주세요');
  }
});