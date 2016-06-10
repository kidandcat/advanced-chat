(function(utils) {

    utils.observe = function(origin, destiny) {
        return _observe(origin, destiny, true);
    }

    utils.observeN = function(origin, destiny) {
        return _observe(origin, destiny, false);
    }

    function _observe(origin, destiny, compare) {
        var success = function(c) {};
        var error = function(c) {};
        //Promise

        var timer = setInterval(function() {
            if (compare) {
                if (origin === destiny) {
                    clearInterval(timer);
                    success(origin);
                }
            } else {
                if (origin !== destiny) {
                    clearInterval(timer);
                    success(origin);
                }
            }
        }, 200);

        //Promise
        return {
            then: function(cb) {
                success = cb;
                return this;
            },
            error: function(cb) {
                error = cb;
                return this;
            }
        };
    }

    return utils;
})(typeof exports === "undefined" ? utils = {} : exports);
