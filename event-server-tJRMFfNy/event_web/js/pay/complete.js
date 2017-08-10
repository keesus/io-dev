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

$(document).ready(function() {
    
    switch(QueryString.type) {
        case "2" :
            $('.contents.type').text("2버튼 스위처");
            break;
        case "1" :
            $('.contents.type').text("1버튼 스위처");
            break;
    }

    switch(QueryString.plan) {
        case "1" :
            $('.contents.plan').html("1,800원/월<span>(첫달 무료+배송비 무료)</span>");
            break;
        case "2" :
            $('.contents.plan').html("17,000원/1년<span>(첫달 무료+배송비 무료)</span>");
            break;
        case "3" :
            $('.contents.plan').html("28,000원/2년<span>(첫달 무료+배송비 무료)</span>");
            break;
        case "4" :
            $('.contents.plan').html("35,500원/3년<span>(첫달 무료+배송비 무료)</span>");
            break;
    }

    $.ajax({
        type: "GET",
        url: prefix+"/userInfo/"+QueryString.id,
        dataType: 'application/json',
        headers : {'Content-Type':'application/json'},
        complete : function (data) {
            var userData;

            if (data.status === 200) {
                userData = JSON.parse(data.responseText).data;
                $('._userName').text(userData[0].name);
                $('._userPhone').text(userData[0].phoneNumber);
                $('._userAddress').text(userData[0].addr1 +" "+ userData[0].addr2);
            } else {
                alert(JSON.parse(data.responseText).reason);
            }
        }
    });
});
