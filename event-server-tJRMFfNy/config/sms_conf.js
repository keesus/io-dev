/**
 * Created by baecheolmin on 2016. 1. 5..
 */

module.exports = (function () {

    /*
    * SMS 전송 OPEN API 사용 (https://www.bluehouselab.com/sms/issued/)
    * 로그인 아이디 : cjfls0904@gmail.com
    * 로그인 패스워드 : (개인문의)
    * */
    return {
        apiKey : 'f7070dceb2ef11e5b2b70cc47a1fcfae',
        appid  : 'IO_SWITCHER',
        sender : '0262129272',
        prefix : '[SWITCHER] 인증번호는',
        end    : '입니다.'
    }
}) ();