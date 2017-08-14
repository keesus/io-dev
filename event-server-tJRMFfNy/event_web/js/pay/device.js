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

var eventData;
var prefix = hostURL.prefix;
var DESKTOP_MIN_WIDTH = 992;

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
    $.ajax({
        type: 'GET',
        url: prefix + '/eventInfo',
        dataType: 'application/json',
        headers: {'Content-Type':'application/json'},
        complete: function(data) {
            if(data.status === 200) {
                eventData = JSON.parse(data.responseText).data;
                $('main').removeClass('hidden');
            } else {
                alert('이벤트 정보를 호출 도중 에러가 발생했습니다.');
            }
        }
    });

  $('#utm_source').val(QueryString.utm_source);
  $('#utm_medium').val(QueryString.utm_medium);
  $('#utm_campaign').val(QueryString.utm_campaign);
});

var moveToDeviceSelector = function(type) {
  var path = "/pay" + "/plan.html?type=" + type;
  var campaignPath = "&utm_source=" + QueryString.utm_source + "&utm_medium=" + QueryString.utm_medium + "&utm_campaign=" + QueryString.utm_campaign;
  
  if(QueryString.utm_source !== undefined)
    path = path + campaignPath;

  location.href = path;
};

var equalToMax = function() {
    alert("신청이 마감되었습니다. 다음에 신청해주세요");
};

$('#group1 + label').on('click', function (e) {
    if (eventData.max*1 > eventData.userCount) {

        moveToDeviceSelector('1');
    } else {
        equalToMax();
    }
});

$('#group2 + label').on('click', function (e) {
    alert('2구 스위처는 신청이 마감되었습니다');
});

$('.oneBtn').on('click', function(e) {


  if(eventData.maxByType['1'] * 1 > eventData.requestCount['1']) {
    var width = $(window).width();
    if(width >= DESKTOP_MIN_WIDTH){
      $(function () {
        $('#type1CheckModal').modal('toggle');
      });
    } else {
      $(function () {
        $('#mType1CheckModal').modal('toggle');
      });
    }
  } else {
    equalToMax();
  }
});

$('.twoBtn').on('click', function(e) {
    if (eventData.maxByType['2'] * 1 > eventData.requestCount['2']) {
      var width = $(window).width();
      if(width >= DESKTOP_MIN_WIDTH){
        $(function () {
          $('#type2CheckModal').modal('toggle');
        });
      } else {
        $(function () {
          $('#mType2CheckModal').modal('toggle');
        });
      }
    } else {
        equalToMax();
    }
});

$('#type1CheckPrev').on('click', function(e) {
  $(function () {
    $('#type1CheckModal').modal('toggle');
  });
});

$('#type1CheckNext').on('click', function(e) {
  moveToDeviceSelector('1');
});

$('#type2CheckPrev').on('click', function(e) {
  $(function () {
    $('#type2CheckModal').modal('toggle');
  });
});

$('#type2CheckNext').on('click', function(e) {
  moveToDeviceSelector('2');
});

$('#mType1CheckPrev').on('click', function(e) {
  $(function () {
    $('#mType1CheckModal').modal('toggle');
  });
});

$('#mType1CheckNext').on('click', function(e) {
  moveToDeviceSelector('1');
});

$('#mType2CheckPrev').on('click', function(e) {
  $(function () {
    $('#mType2CheckModal').modal('toggle');
  });
});

$('#mType2CheckNext').on('click', function(e) {
  moveToDeviceSelector('2');
});



