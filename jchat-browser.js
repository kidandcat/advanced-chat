jchat = (function(conf) {
    var obj = {};
    var state = 'down';
    var container;
    obj.config = {};
    obj.utils = {};




    /*  *  *  *  *  *  *
     *  begin CONFIG   *
     *  *  *  *  *  *  */
    conf = conf || {};
    obj.config.title = conf.title || 'Chat live';
    obj.config.socketUrl = conf.socketUrl || 'http://192.168.0.12:8282';
    /*  *  *  *  *  *
     *  end CONFIG  *
     *  *  *  *  *  */





    /*  *  *  *  *  *
     *  begin INIT  *
     *  *  *  *  *  */
    loadSocketLibrary().then(function(){
      loadSocketConnection();
      containerCreator();
      firstShow();
    });
    /*  *  *  *  *
     *  end INIT *
     *  *  *  *  */





    /*  *  *  *  *  *  *
     *  begin SOCKET   *
     *  *  *  *  *  *  */
    function loadSocketLibrary(){
      var success = function(c){};
      var error = function(c){};
      //Promise

      var url = obj.config.socketUrl + '/socket.io/socket.io.js';
      var elem = document.createElement('script');
      elem.src = url;
      document.querySelector('head').appendChild(elem);
      utils.observeN(window.io, null).then(function(){
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



    function loadSocketConnection(){
      var success = function(c){};
      var error = function(c){};
      //Promise

      obj.connection = io(obj.config.socketUrl);


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


    function registerSocketListeners(){
      obj.remote = {};
      obj.remote.login = function(nick, sala){
          obj.connection.emit('chat:login', { nick: nick, room: sala });
      }

      obj.remote.send = function(msg){
          obj.connection.emit('chat:msg', { msg: msg });
      }

      obj.connection.on('chat:msg', function(data){
          obj.remoteMessage(data.message, data.user);
      });

    }
    /*  *  *  *  *  *
     *  end SOCKET  *
     *  *  *  *  *  */





     /*  *  *  *  *  *  *  *
      *  begin FUNCTIONS   *
      *  *  *  *  *  *  *  */
      obj.sendMessage = function(message){

      }

      obj.remoteMessage = function(message, user){

      }

      obj.localMessage = function(message){

      }

      obj.login = function(data){

      }
     /*  *  *  *  *  *  *
      *  end FUNCTIONS  *
      *  *  *  *  *  *  */





    /*  *  *  *  *  *
     *  begin HTML  *
     *  *  *  *  *  */
    function containerCreator() {
        container = document.createElement('div');
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
    }

    function addBody() {
        body = document.createElement('div');
        body.style.position = 'absolute';
        body.style.width = '100%';
        body.style.height = '22em';
        body.style.bottom = 0;
        body.style['background-color'] = "white";
        body.style['box-sizing'] = 'border-box';
        body.style.border = '0.2em solid #1f79b2';
        container.appendChild(body);
    }

    function addBottom() {
        bottom = document.createElement('div');
        bottom.style.position = 'absolute';
        bottom.style.width = '100%';
        bottom.style.height = '4em';
        bottom.style.bottom = 0;
        bottom.style['box-sizing'] = 'border-box';
        bottom.style.border = '0.2em solid #1f79b2';
        bottom.style.display = 'flex';
        bottom.appendChild(getInput());
        bottom.appendChild(getInputButton());
        container.appendChild(bottom);
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

    function getInput() {
        var input = document.createElement('textarea');
        input.style.flex = '1';
        input.style.outline = 'none';
        input.style.border = 'none';
        input.style.height = '100%';
        input.style.width = '100%';
        input.style['box-sizing'] = 'border-box';
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
});

jchat();
