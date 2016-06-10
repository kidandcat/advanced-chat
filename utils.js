(function(utils) {

    utils.observe = function(origin, destiny) {
        return _observe(origin, destiny, true, false);
    }

    utils.Nobserve = function(origin, destiny) {
        return _observe(origin, destiny, false, false);
    }

    utils.observeEval = function(origin, destiny) {
        return _observe(origin, destiny, true, true);
    }

    utils.NobserveEval = function(origin, destiny) {
        return _observe(origin, destiny, false, true);
    }

    function _observe(origin, destiny, compare, eva) {
        var success = function(c) {};
        var error = function(c) {};
        //Promise


        var done = false;
        var timer = setInterval(function() {
            if (compare) {
                if ((eva)?eval(origin):origin === destiny && !done) {
                    done = true;
                    clearInterval(timer);
                    success(origin);
                }
            } else {
                if ((eva)?eval(origin):origin !== destiny && !done) {
                    done = true;
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
