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

var customerId;
var isAuth = false;
var eventData;
var prefix = hostURL.prefix;

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
  $('.navigator .third').css('background-color', '#767bfe');

  $('#phoneNumber').val("");
  $('#name').val("");
  $('#addr1').val("");
  $('#addr2').val("");
  $('#message').val("");
  $('#auth').val("");
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
        alert('이벤트 정보를 호출도중 에러가 발생했습니다.');
      }
    }
  });

  $('#utm_source').val(QueryString.utm_source);
  $('#utm_medium').val(QueryString.utm_medium);
  $('#utm_campaign').val(QueryString.utm_campaign);
});


var equalToMax = function () {
  alert("신청이 마감되었습니다. 다음에 신청해주세요");
};

$('.phoneNumber').keydown(function (evt) {
  var code = evt.which ? evt.which : event.keyCode;
  if ((code >= 48 && code <= 57) || code == 8) {
    return true;
  } else {
    return false;
  }
});

$('._authno').on('click', function (e) {

  var phoneRegExp = /^01([016789])([1-9]{1})([0-9]{2,3})([0-9]{4})$/;
  var phoneNumber = $('#phoneNumber').val() + "";

  if (phoneNumber != null && phoneNumber != '') {

    if (phoneNumber.length == 11 || phoneNumber.length == 10) {

      var regExp_ctn = /^01([016789])([1-9]{1})([0-9]{2,3})([0-9]{4})$/;

      if (!regExp_ctn.test(phoneNumber)) {
        alert("핸드폰 번호를 정확하게 입력해 주세요");
        return;
      }
    } else {
      alert("핸드폰 번호를 정확하게 입력해 주세요");
      return;
    }
  } else {
    alert("핸드폰 번호를 정확하게 입력해 주세요");
    return;
  }
  if (!phoneRegExp.test(phoneNumber)) {
    alert("핸드폰 번호를 정확하게 입력해 주세요");
    return;
  }

  $.ajax({
    type: 'POST',
    url: prefix + '/auth/number',
    contentType: 'application/json',
    data: JSON.stringify({'phoneNumber': phoneNumber}),
    complete: function(data) {
      if(data.status === 200) {
        alert('전송에 성공했습니다.');
        customerId = data.responseJSON.data.customerId;

        $('.phoneBox').addClass('hidden');
        $('.authBox').removeClass('hidden');
      } else {
        alert(JSON.parse(data.responseText).reason);
      }
    }
  });
});

/* 인증번호 확인 버튼 */
$('._confirm').on('click', function (e) {

  var authNumber = $('#auth').val();
  var phoneNumber = $('#phoneNumber').val();

  $.ajax({
    type: 'GET',
    url: prefix + '/auth/startApp?authNumber=' + authNumber + '&customerId=' + customerId,
    headers: {'Content-Type': 'application/json'},
    complete: function(data) {
      if (data.status === 200) {
        isAuth = true;
        customerId = JSON.parse(data.responseText).data.customerId;
        alert('인증에 성공했습니다.');
      } else {
        alert(JSON.parse(data.responseText).reason);
      }
    }
  });
});


var postcode;
// 우편번호 찾기 찾기 화면을 넣을 element
var element_wrap = document.getElementById('addrWrap');
element_wrap.style.display = 'none';

function foldDaumPostcode() {
  // iframe을 넣은 element를 안보이게 한다.
  element_wrap.style.display = 'none';
}
$('._postno').on('click', function (e) {
  // 현재 scroll 위치를 저장해놓는다.
  var currentScroll = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
  daum.postcode.load(function () {
    new daum.Postcode({
      oncomplete: function (data) {
        if (data.postcode.length <= 0) {
          postcode = data.zonecode;
        } else {
          postcode = data.postcode;
        }

        $(this).addClass('hidden');
        $('._address').removeClass('hidden');

        if (data.addressType === "J") {
          $('._address').val(data.jibunAddress);
        } else {
          $('._address').val(data.roadAddress);
        }

        // iframe을 넣은 element를 안보이게 한다.
        // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
        element_wrap.style.display = 'none';

        // 우편번호 찾기 화면이 보이기 이전으로 scroll 위치를 되돌린다.
        document.body.scrollTop = currentScroll;
      },
      // 우편번호 찾기 화면 크기가 조정되었을때 실행할 코드를 작성하는 부분. iframe을 넣은 element의 높이값을 조정한다.
      onresize : function(size) {
        element_wrap.style.height = size.height+'px';
      },
      width : '100%',
      height : '100%'
    }).embed(element_wrap);
    // iframe을 넣은 element를 보이게 한다.git
    element_wrap.style.display = 'block';
  });
});

$('#name').on('focus', function (e) {

  $('.alert.name').addClass('hidden');
});

$('#phoneNumber').on('focus', function (e) {

  if ($('#name').val() === "") {
    $('.alert.name').removeClass('hidden');
  }

  $('.alert.phone').addClass('hidden');
});

$('#addr1').on('focus', function (e) {

  if ($('#name').val() === "") {
    $('.alert.name').removeClass('hidden');
  }

  if ($('#phoneNumber').val() === "") {
    $('.alert.phone').removeClass('hidden');
  }
  $('.alert.address').addClass('hidden');
});

$('#addr2').on('focus', function (e) {

  if ($('#name').val() === "") {
    $('.alert.name').removeClass('hidden');
  }

  if ($('#phoneNumber').val() === "") {
    $('.alert.phone').removeClass('hidden');
  }

  if ($('#addr1').val() === "") {
    $('.alert.address').removeClass('hidden');
  }

});


/* 다음버튼 */
$('.next').on('click', function (e) {

  var name = $('#name').val();
  var address1 = $('#addr1').val();
  var address2 = $('#addr2').val();
  var fullAddress = address1 + ' ' + address2;
  var phoneNumber = $('#phoneNumber').val();
  var authNumber = $('#auth').val();

  if (eventData.max * 1 > eventData.userCount) {
    if (name === '' || address1 === '' || address2 === '' || phoneNumber === '' || authNumber === '') {
      alert('정보를 모두 입력해 주십시오');
    } else {
      trackFourthButtonEvent();
      if (isAuth) {
        $.ajax({
          type: 'POST',
          url: prefix + '/event/user',
          data: JSON.stringify({
            'name': name,
            'customerId': customerId,
            'address1': address1,
            'address2': address2,
            'fullAddress': fullAddress,
            'postNo': postcode
          }),
          headers: {'Content-Type': 'application/json'},
          complete: function (data) {
            if (data.status === 200) {
              var path = "/pay" + "/card.html?id=" + customerId + "&type=" + QueryString.type + "&plan=" + QueryString.plan;
              var campaignPath = "&utm_source=" + QueryString.utm_source + "&utm_medium=" + QueryString.utm_medium + "&utm_campaign=" + QueryString.utm_campaign;

              if (QueryString.utm_source !== undefined)
                path = path + campaignPath;

              location.href = path;
            } else {
              alert(JSON.parse(data.responseText).reason);
            }
          }
        });
      } else {
        alert('인증번호 인증을 거치지 않았습니다.\n 인증번호 인증 후 다음페이지로 넘어 갈 수 있습니다.');
      }
    }
  } else {
    equalToMax();
  }

});


(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
  function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
  e=o.createElement(i);
  r=o.getElementsByTagName(i)[0];
  e.src='https://www.google-analytics.com/analytics.js';
  r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
ga('create','UA-67524903-3','auto');
ga('send', 'pageview');

function trackFourthButtonEvent() {
  ga('send', 'event', {
    eventCategory: 'conversion',
    eventAction: 'submit_delivery_information_4',
    eventLabel: "사용자 정보를 모두 입력했을 때"
  });
}

