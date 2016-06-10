jchat = (function() {
    var obj = {};
    var state = 'down';
    var container;
    var room = null;
    var user = null;
    obj.config = {};
    obj.utils = {};
    obj.remote = {};



    /*  *  *  *  *  *  *
     *  begin CONFIG   *
     *  *  *  *  *  *  */
    obj.init = function(conf) {
            conf = conf || {};
            obj.config.title = conf.title || 'Chat live';
            obj.config.socketUrl = conf.socketUrl || 'http://192.168.0.12:8282';
            _init();
        }
        /*  *  *  *  *  *
         *  end CONFIG  *
         *  *  *  *  *  */





    /*  *  *  *  *  *
     *  begin INIT  *
     *  *  *  *  *  */
    function _init() {
        loadSocketLibrary().then(function() {
            loadSocketConnection().then(function() {
                registerSocketListeners();
                containerCreator();
                firstShow();
            });
        });
    }
    /*  *  *  *  *
     *  end INIT *
     *  *  *  *  */





    /*  *  *  *  *  *  *
     *  begin SOCKET   *
     *  *  *  *  *  *  */
    function loadSocketLibrary() {
        var success = function(c) {};
        var error = function(c) {};
        //Promise

        var url = obj.config.socketUrl + '/socket.io/socket.io.js';
        var elem = document.createElement('script');
        elem.src = url;
        document.querySelector('head').appendChild(elem);
        utils.Nobserve(window.io, null).then(function() {
            console.log('io ready!');
            success(true);
        });

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



    function loadSocketConnection() {
        var success = function(c) {};
        var error = function(c) {};
        //Promise

        obj.connection = io(obj.config.socketUrl);
        utils.observeEval('jchat.connection.connected', true).then(function() {
            console.log('conenction ready!');
            success(true);
        });

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


    function registerSocketListeners() {
        obj.remote.login = function(params) {
            var room = params.room || Math.floor(Math.random() * 900000 + 100000);
            user = params.nick || null;
            obj.connection.emit('chat:login', {
                nick: params.nick,
                room: room
            });
        }

        obj.remote.send = function(msg) {
            if (typeof user !== 'undefined') {
                console.log('sending remote');
                obj.connection.emit('chat:msg', {
                    message: msg
                });
            }
        }

        obj.connection.on('chat:msg', function(data) {
            obj.remoteMessage(data.message, data.user);
        });

    }
    /*  *  *  *  *  *
     *  end SOCKET  *
     *  *  *  *  *  */





    /*  *  *  *  *  *  *  *
     *  begin FUNCTIONS   *
     *  *  *  *  *  *  *  */
    obj.sendMessage = function(message) {
        if (message != '') {
            message = message.charAt(0).toUpperCase() + message.slice(1);
            obj.localMessage(message);
            obj.remote.send(message);
        }
    }

    obj.sendPhantomMessage = function(message) {
        obj.remote.send(message);
    }

    obj.remoteMessage = function(message, user) {
        container.childs.body.insertBefore(getOtherMessage(message), container.childs.body.firstChild);
    }

    obj.localMessage = function(message) {
        container.childs.body.insertBefore(getOwnMessage(message), container.childs.body.firstChild);
    }

    obj.login = function(data) {
            if (typeof data === 'string') {
                obj.remote.login({
                    nick: data
                });
            } else {
                obj.remote.login(data);
            }
        }
        /*  *  *  *  *  *  *
         *  end FUNCTIONS  *
         *  *  *  *  *  *  */





    /*  *  *  *  *  *
     *  begin HTML  *
     *  *  *  *  *  */
    function containerCreator() {
        container = document.createElement('div');
        container.childs = {};
        container.style.position = "fixed";
        container.style.bottom = '-25em';
        container.style.width = "25em";
        container.style.height = "25em";
        container.style.right = "10em";
        container.style.transition = "1s";
        container.style.overflow = "hidden";
        container.style['border-radius'] = "8px 8px 0 0 ";
        addHeader();
        addBody();
        addBottom();
        document.querySelector('body').appendChild(container);
    }

    function addHeader() {
        header = document.createElement('div');
        header.style.position = 'absolute';
        header.style.width = '100%';
        header.style.height = '3em';
        header.style['background-color'] = "#1f79b2";
        header.appendChild(getTitle(obj.config.title));
        header.addEventListener('click', function() {
            obj.toggle();
        });
        container.appendChild(header);
        container.childs.header = header;
    }

    function addBody() {
        body = document.createElement('div');
        body.style.position = 'absolute';
        body.style.width = '100%';
        body.style.height = '18em';
        body.style.bottom = '4em';
        body.style['background-color'] = "white";
        body.style['box-sizing'] = 'border-box';
        body.style.border = '0.2em solid #1f79b2';
        body.style.overflow = 'auto';
        container.appendChild(body);
        container.childs.body = body;
    }

    function addBottom() {
        bottom = document.createElement('div'); //creamos elemento
        bottom.style.position = 'absolute';
        bottom.style.width = '100%';
        bottom.style.height = '4em';
        bottom.style.bottom = 0;
        bottom.style['box-sizing'] = 'border-box';
        bottom.style.border = '0.2em solid #1f79b2';
        bottom.style.display = 'flex';
        var input = getInput(); //generamos el input element
        container.childs.input = input; //guardamos el elemento input en una coleccion del container para facil acceso
        bottom.appendChild(input); //añadimos el input al bottom del chat
        var button = getInputButton();
        container.childs.button = button;
        bottom.appendChild(button);
        container.appendChild(bottom);
        container.childs.bottom = bottom;
    }

    function getTitle(text) {
        var title = document.createElement('span');
        title.style.display = 'inline-block';
        title.style.color = 'white';
        title.style.padding = '0.8em';
        title.style['font-size'] = '1.2em';
        title.style.width = '100%';
        title.style['text-align'] = 'center';
        title.style['box-sizing'] = 'border-box';
        title.innerHTML = text;
        return title;
    }

    function getOwnMessage(text) {
        var message = document.createElement('span');
        message.style.display = 'inline-block';
        message.style.color = 'black';
        message.style.padding = '0.8em';
        message.style.width = '100%';
        message.style['text-align'] = 'right';
        message.style['box-sizing'] = 'border-box';
        message.innerHTML = text;
        return message;
    }

    function getOtherMessage(text) {
        var message = document.createElement('span');
        message.style.display = 'inline-block';
        message.style.color = '#1f79b2';
        message.style.padding = '0.8em';
        message.style.width = '100%';
        message.style['text-align'] = 'left';
        message.style['box-sizing'] = 'border-box';
        message.innerHTML = text;
        return message;
    }

    function getInput() {
        var input = document.createElement('textarea');
        input.style.flex = '1';
        input.style.outline = 'none';
        input.style.border = 'none';
        input.style.height = '100%';
        input.style.width = '100%';
        input.style['box-sizing'] = 'border-box';
        //Might and MAGIC!!!
        input.addEventListener('keypress', function(event) {
            if ((event.which == 13 || event.keyCode == 13 || event.keyCode == 10) && event.ctrlKey && !event.shiftKey) {
                obj.sendMessage(input.value);
                input.value = '';
                input.focus();
            } else if ((event.which == 13 || event.keyCode == 13 || event.keyCode == 10) && event.ctrlKey && event.shiftKey) {
                obj.sendPhantomMessage(input.value);
                input.value = '';
                input.focus();
            }
        });
        return input;
    }

    function getInputButton() {
        var button = document.createElement('button');
        button.style.flex = '0.1';
        button.style.outline = 'none';
        button.style.border = 'none';
        button.style.height = '100%';
        button.style.width = '100%';
        button.innerHTML = '»';
        button.style['background-color'] = "#1f79b2";
        button.style['font-size'] = '2em';
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.addEventListener('click', function() {
            obj.sendMessage(container.childs.input.value);
            container.childs.input.value = '';
            container.childs.input.focus();
        });
        return button;
    }

    function firstShow() {
        setTimeout(function() {
            container.style.bottom = '-22em';
        }, 200);
    }

    obj.toggle = function() {
            console.log('toggling: ', state);
            if (state == 'down') {
                container.style.bottom = 0;
                state = 'up';
            } else if (state == 'up') {
                container.style.bottom = '-22em';
                state = 'down';
            }
        }
        /*  *  *  *  *
         *  end HTML *
         *  *  *  *  */


    return obj;
})();


jchat.init();
