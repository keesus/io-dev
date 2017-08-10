/**
 * Created by 1001188 on 2016. 3. 28..
 */
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

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

var eventData;

var prefix = hostURL.prefix;
var DESKTOP_MIN_WIDTH = 992;

var QueryString = (function () {
  var pairs = location.search.slice(1).split('&');
  var result = {};

  pairs.forEach(function (pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
})();

$(document).ready(function () {
  $('.navigator .first').css('background-color', '#eaeaea');
  $('.navigator .second').css('background-color', '#767bfe');

  $.ajax({
    type: 'GET',
    url: prefix + '/eventInfo',
    dataType: 'application/json',
    headers: {'Content-Type': 'application/json'},
    complete: function (data) {
      if (data.status === 200) {
        eventData = JSON.parse(data.responseText).data;
        $('main').removeClass('hidden');
      } else {
        alert("이벤트 정보를 호출 도중 에러가 발생했습니다.");
      }
    }
  });

  $('#utm_source').val(QueryString.utm_source);
  $('#utm_medium').val(QueryString.utm_medium);
  $('#utm_campaign').val(QueryString.utm_campaign);


  var switcher_model = getParameterByName('type');

  if(switcher_model == 2) {
    $(".price.lease").text("2,800원/월");
    $(".price.purchase").text("43,400원");
  }
});

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var equalToMax = function () {
  alert("신청이 마감되었습니다. 다음에 신청해주세요");
};

$('.main .intro .planInfo .pricePlan li').on('mouseover', function (e) {

  $($(this).find('.choice')).css("background-color", "rgba(0,0,0,0.3)");
});

var plan = 0;
$('.choice').on('click', function(e) {
  var width = $(window).width();

  if (eventData.max * 1 > eventData.userCount) {
    // if ($(this).hasClass('one')) {
    //   plan = 2;
    //   setPlanModal('1년', '1년 마다 17,000원 결제', width);
    // }
    //
    // if ($(this).hasClass('two')) {
    //   plan = 3;
    //   setPlanModal('2년', '2년 마다 28,000원 결제', width);
    // }
    //
    // if ($(this).hasClass('three')) {
    //   plan = 4;
    //   setPlanModal('3년', '3년 마다 35,500원 결제', width);
    // }

    if ($(this).hasClass('month')) {
      plan = 1;
      setPlanModal('렌탈', '렌탈로 쓰시겠어요?', '매달 1,800원 결제', width);
    }

    if ($(this).hasClass('lease')) {
      plan = 5;
      setPlanModal('리스', '죄송해요', '현재 리스 상품은 준비 중 입니다.', width);
    }

    if ($(this).hasClass('purchase')) {
      plan = 6;
      setPlanModal('일시불', '죄송해요', '현재 일시불 상품은 준비 중 입니다.', width);
    }
  } else {
    equalToMax();
  }
});

$('#planCheckPrev').on('click', function(e) {
  $(function () {
    $('#planCheckModal').modal('hide');
  });
});

$('#planCheckNext').on('click', function(e) {
  var path = "/pay/" + "user.html?type=" + QueryString.type + "&plan=" + plan;
   var campaignPath = "&utm_source=" + QueryString.utm_source + "&utm_medium=" + QueryString.utm_medium + "&utm_campaign=" + QueryString.utm_campaign;

   if (QueryString.utm_source !== undefined)
   path = path + campaignPath;

   location.href = path;
});

$('#mPlanCheckPrev').on('click', function(e) {
  $(function () {
    $('#mPlanCheckModal').modal('hide');
  });
});

$('#mPlanCheckNext').on('click', function(e) {
  var path = "/pay/" + "user.html?type=" + QueryString.type + "&plan=" + plan;
  var campaignPath = "&utm_source=" + QueryString.utm_source + "&utm_medium=" + QueryString.utm_medium + "&utm_campaign=" + QueryString.utm_campaign;

  if (QueryString.utm_source !== undefined)
    path = path + campaignPath;

  location.href = path;
});

$('.choice.month').on('click', function(e) {
  ga('send', 'event', {
    eventCategory: 'bm_test',
    eventAction: 'click_rental',
    eventLabel: 'BM 테스트 렌탈 버튼 클릭'
  });
});

$('.choice.lease').on('click', function(e) {
  ga('send', 'event', {
    eventCategory: 'bm_test',
    eventAction: 'click_lease',
    eventLabel: 'BM 테스트 리스 버튼 클릭'
  });
});

$('.choice.purchase').on('click', function(e) {
  ga('send', 'event', {
    eventCategory: 'bm_test',
    eventAction: 'click_purchase',
    eventLabel: 'BM 테스트 일시불 버튼 클릭'
  });
});

var setPlanModal = function(plan, title, desc, width) {
  if(plan === '렌탈') {
    if(width >= DESKTOP_MIN_WIDTH) {
      $(function () {
        $('#planCheckNext').show();
        $("#modalPlan").text(title);
        $("#modalPlanDesc").text(desc);
        $("#modalPlanNext").text(plan);
        $("#planCheckPrev .prev").text("잘못 선택했어요");
        $("#planCheckPrev .prev").css({"float": "left", "margin-left":"20px"});
        $('#planCheckModal').modal('toggle');
      });
    } else {
      $(function () {
        $('#mPlanCheckNext').show();
        $("#mModalPlan").text(title);
        $("#mModalPlanDesc").text(desc);
        $("#mModalPlanNext").text(plan);
        $("#mPlanCheckPrev .prev").text("잘못 선택했어요");
        $("#mPlanCheckPrev .prev").css({"float": "left", "margin-left":"20px"});
        $('#mPlanCheckModal').modal('toggle');
      });
    }
  } else {
    if(width >= DESKTOP_MIN_WIDTH) {
      $(function () {
        $('#planCheckNext').hide();
        $("#modalPlan").text(title);
        $("#modalPlanDesc").text(desc);
        $("#planCheckPrev .prev").text("돌아가기");
        $("#planCheckPrev .prev").css({"float": "none", "text-align":"center", "margin-left":"0"});
        $('#planCheckModal').modal('toggle');
      });
    } else {
      $(function () {
        $('#mPlanCheckNext').hide();
        $("#mModalPlan").text(title);
        $("#mModalPlanDesc").text(desc);
        $("#mPlanCheckPrev .prev").text("돌아가기");
        $("#mPlanCheckPrev .prev").css({"float": "none", "text-align":"center", "margin-left":"0"});
        $('#mPlanCheckModal').modal('toggle');
      });
    }
  }
}