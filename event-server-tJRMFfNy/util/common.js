/**
 * Created by Rachel on 2016. 5. 24..
 */

var common = {

    checkParamsAreEmpty : function(params) {
        
        var paramIsEmpty = false;
        params.forEach(function(param) {
            if(param === undefined || param === null || param == 'undefined' || param == 'null')
                paramIsEmpty = true;
        });

        return paramIsEmpty;
    }

};


module.exports = common;
