/**
 * Created by 1001188 on 2016. 3. 28..
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

var isClickEula = false;
var mobileKeyWords = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
var isMobile = false;

var QueryString = (function() {
    var pairs = location.search.slice(1).split('&');
    var result = {};

    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
})();

for (var word in mobileKeyWords){
    if (navigator.userAgent.match(mobileKeyWords[word]) != null){
        isMobile = true;
    }
}

var eventData;

var equalToMax = function () {
    alert('신청이 마감되었습니다. 다음에 신청해주세요');
};

var prefix = hostURL.prefix;

function digit_check(evt){
    var code = evt.which?evt.which:event.keyCode;
    if(code < 48 || code > 57){
        return false;
    }
}

/*$('._cardNumber').keydown(function(evt) {
  var code = evt.which?evt.which:event.keyCode;
    if((code >= 48 && code <= 57) || code == 8 || (code >= 96 && code <= 105)){
        return true;
    } else {
        return false;
    }
});*/

$(document).ready(function (e) {

    var select = $("select#color");
    
    $("select#color").val("");
    $("#first").val("");
    $("#second").val("");
    $("#third").val("");
    $("#fourth").val("");
    $("select#year").val("");
    $("select#month").val("");

    if ($("input:checkbox[id='eulaYN']").is(":checked")) {
        $('.eulaCheck + label').trigger('click');
    }

    $('.navigator .first').css("background-color","#eaeaea");
    $('.navigator .fourth').css("background-color","#767bfe");
    
    $.ajax({
        type: 'GET',
        url: prefix + '/eventInfo',
        dataType: 'application/json',
        headers: {'Content-Type': 'application/json'},
        complete: function(data) {
            if(data.status === 200) {
                eventData = JSON.parse(data.responseText).data;
                var endAt = eventData.endAt.substr(0,4) + '년 ' + eventData.endAt.substr(5,2) + '월 ' + eventData.endAt.substr(8,2) + '일';
                $("#endAt").text(endAt);
                $("#mEndAt").text(endAt);
                $('main').removeClass('hidden');
            } else {
                alert('이벤트 정보 호출도중 에러가 발생했습니다.');
            }
        }
    });

    select.change(function(){
        var select_name = $(this).children("option:selected").text();
        $(this).siblings("label").text(select_name);
    });

    var monthSelector = $("select#month");

    monthSelector.change(function(){
        var select_name = $(this).children("option:selected").text();
        $(this).siblings("label").text(select_name);
    });

    var yearSelect = $("select#year");

    yearSelect.change(function(){
        var select_name = $(this).children("option:selected").text();
        $(this).siblings("label").text(select_name);
    });

    $('[data-toggle="tooltip"]').tooltip({
        'container':'body'
    });


    $('#first').autotab({ target: '#second', format: 'numeric' });
    $('#second').autotab({ target: '#third', format: 'numeric', previous: '#first' });
    $('#third').autotab({ target:'#fourth', previous:'#second', format: 'numeric' });
    $('#fourth').autotab({previous:'#third', format:'numeric'});
    
    switch(QueryString.plan) {
        case '1' :
            $('._alert p .price').text("월 결제 요금(1,800원)");
        break;
        case '2' :
            $('._alert p .price').text("1년 결제 요금(17,000원)");
        break;
        case '3' :
            $('._alert p .price').text("2년 결제 요금(28,000원)");
        break;
        case '4' :
            $('._alert p .price').text("3년 결제 요금(35,500원)");
        break;
        default :
            $('._alert p .price').text("월 결제 요금(1,800원)");
        break;
    }

    $('#utm_source').val(QueryString.utm_source);
    $('#utm_medium').val(QueryString.utm_medium);
    $('#utm_campaign').val(QueryString.utm_campaign);
});

$('.eulaCheck + label').on('click', function (e) {
    if ($("input:checkbox[id='eulaYN']").is(":checked")) {
        isClickEula = false;
    } else {
        isClickEula = true;
    }
});


$('.next').on('click', function (e) {

    var cardCmpNumber = $("select#color").val();
    var cardNumber = $("#first").val()+$("#second").val()+$("#third").val()+$("#fourth").val();
    var expDate = $("select#year").val().substr(2,2)+$("select#month").val();
    var customerId = QueryString.id;
    var checkCard = function (sc) {
        
        $.ajax({
            type: 'POST',
            url: prefix + '/check/cardNumber',
            dataType: 'application/json',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                cardNumber: cardNumber,
                cardExpDate : expDate
            }),
            complete: function (data) {

                if (JSON.parse(JSON.parse(data.responseText).data).result_cd == "3001") {
                    if (isMobile) {
                        $('#mCompleteModal').modal('show');
                    } else {
                        $('#completeModal').modal('show');
                    }
                    setTimeout(sc,3000);
                } else {
                    alert("카드번호가 올바르지 않습니다. \n 다른 카드번호를 입력해 주세요");
                }
            }
        })

    };

    var completeRequest = function() {
        $.ajax({
            type: 'POST',
            url: prefix + '/request/1/' + QueryString.type,
            dataType: 'application/json',
            headers : {'Content-Type': 'application/json'},
            data : JSON.stringify({
                'eventId': eventData.eventId,
                'customerId': customerId,
                'paymentPlanId': QueryString.plan,
                'cardName': cardCmpNumber,
                'cardNumber': cardNumber,
                'cardExpiredAt': expDate,
                'deliveryAt': eventData.deliveryAt
            }),
            complete: function (data) {
                if(data.status !== 200) {
                    alert(JSON.parse(data.responseText).reason);
                } else {
                    var path =
                    location.href="/pay" + "/complete.html?id=" + QueryString.id + "&type=" + QueryString.type + "&plan=" + QueryString.plan;
                }
            }
        });
    };
    
    if (cardNumber.length !== 16 && cardNumber.length !== 15) {
        alert("카드 정보를 모두 입력해 주세요");
        return;
    }

    if (cardCmpNumber === "" || cardNumber === "" || expDate === "") {
        alert("카드 정보를 모두 입력해 주세요");
        return;
    }

    if (!isClickEula) {
        alert("이용 약관에 동의해 주세요");
        return;
    }

    if (eventData.maxByType[QueryString.type]*1 > eventData.requestCount[QueryString.type]) {
        trackFifthButtonEvent();
        $.ajax({
            type: 'POST',
            url: prefix + '/eventinfo/card',
            dataType: 'application/json',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                'cardNumber' : cardNumber,
                'cardCmpNumber' : cardCmpNumber,
                'customerId' : customerId,
                'type' : QueryString.type,
                'cardExpiredAt' : expDate,
                'eventid':eventData.eventId,
                'utm_source': $('#utm_source').val(),
                'utm_medium': $('#utm_medium').val(),
                'utm_campaign': $('#utm_campaign').val()
            }),
            complete: function(data) {
              if(data.status !== 200) {
                    alert(JSON.parse(data.responseText).reason);
                } else {
                    completeRequest();
                }
            }
        });
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

function trackFifthButtonEvent() {
  ga('send', 'event', {
    eventCategory: 'conversion',
    eventAction: 'submit_creditcard_information_5',
    eventLabel: "카드 정보를 모두 입력했을 때"
  });
}
