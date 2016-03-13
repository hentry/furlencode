/**
*
*/
var fa = {};
(function () {

    fa.url = 'http://192.168.2.109:3000/tracker';
    fa.userId = assignUserId();

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }

        function assignUserId() {
            var userId = getCookie('userId')
            if (userId) {
                return userId;
            } else {
                setCookie("userId", guid(), 365);
            }
        }
        function guid() {

          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        }
    /**
    *
    */
    var Ajax = {
    	Utils: {
    		toQueryString: function(obj) {
    			var arr = [],
    				str = '';
    			for (var prop in obj) {
    				var query = prop + '=' + obj[prop];
    				arr.push(query);
    			}
    			str = arr.join('&');
    			return str;
    		},
    		serialize: function(element) {
    			if (element.nodeName.toLowerCase() !== 'form') {
    				console.warn('serialize() needs a form');
    				return;
    			}
    			var elems = element.elements;
    			var serialized = [],
    				i, len = elems.length,
    				str = '';
    			for (i = 0; i < len; i += 1) {
    				var element = elems[i];
    				var type = element.type;
    				var name = element.name;
    				var value = element.value;
    				switch (type) {
    					case 'text':
    					case 'textarea':
    					case 'select-one':
    					case 'hidden':
    						str = name + '=' + value;
    						serialized.push(str);
    						break;
    					case 'radio':
    					case 'checkbox':
    						if (element.checked) {
    							str = name + '=' + value;
    							serialized.push(str);
    						}
    						break;
    					default:
    						break;
    				}
    			}
    			return serialized.join('&');
    		},
    		getQueryString: function(element) {
    			if (element.nodeName.toLowerCase() !== 'a') {
    				console.warn('getQueryString() needs an a element');
    				return;
    			}
    			var str = element.href;
    			var query = str.split('?');
    			return query[1];
    		}
    	},
    	xhr: function() {
    		var instance = new XMLHttpRequest();
    		return instance;
    	},
    	getResponseType: function(resp) {

    		var type = '';
    		if (resp.indexOf('text/xml') != -1 || resp.indexOf('application/xml') != -1) {
    			type = 'xml';
    		}
    		if (resp.indexOf('application/json') != -1) {
    			type = 'json';
    		}
    		if (resp.indexOf('text/html') != -1 || resp.indexOf('text/plain') != -1) {
    			type = 'text';
    		}
    		return type;
    	},
    	post: function(options) {

    		var xhttp = this.xhr(),
    			responseType,
    			data;
    		options.complete = options.complete || function() {};
    		options.type = 'POST';
    		options.url = options.url || location.href;
    		options.data = options.data || null;
    		if (typeof options.data === 'object') {
    			data = Ajax.Utils.toQueryString(options.data);
    		} else {
    			data = options.data;
    		}
    		xhttp.open(options.type, options.url, true);
    		if (data.length > 0) {
    			xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    			xhttp.send(data);
    		} else {
    			xhttp.send(null);
    		}
    		xhttp.onreadystatechange = function() {
    			var stat = xhttp.status,
    				state = xhttp.readyState;
    			if (stat == 200 && state == 4) {
    				var headers = xhttp.getAllResponseHeaders();
    				var type = Ajax.getResponseType(headers);
    				var responseType;
    				switch (type) {
    					case 'xml':
    						responseType = xhttp.responseXML;
    						break;
    					case 'json':
    					case 'text':
    						responseType = xhttp.responseText;
    						break;
    					default:
    						responseType = xhttp.responseText;
    						break;
    				}
    				options.complete(responseType);
    			}
    		};
    	},
    	get: function(options) {

    		var xhttp = this.xhr(),
    			data;
    		options.complete = options.complete || function() {};
    		options.type = 'GET';
    		options.url = options.url || location.href;
    		options.data = options.data || null;
    		if (typeof options.data === 'object') {
    			data = Ajax.Utils.toQueryString(options.data);
    		} else {
    			data = options.data;
    		}
    		xhttp.open(options.type, options.url + '?' + data, true);
    		xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    		xhttp.send(null);
    		xhttp.onreadystatechange = function() {
    			var stat = xhttp.status,
    				state = xhttp.readyState;
    			if (stat == 200 && state == 4) {
    				var headers = xhttp.getAllResponseHeaders();
    				var type = Ajax.getResponseType(headers);
    				var responseType;
    				switch (type) {
    					case 'xml':
    						responseType = xhttp.responseXML;
    						break;
    					case 'json':
    					case 'text':
    						responseType = xhttp.responseText;
    						break;
    					default:
    						responseType = xhttp.responseText;
    						break;
    				}
    				options.complete(responseType);
    			}
    		};
    	},
    	getJSON: function(options, callback) {

    		var xhttp = this.xhr(),
    		    data;
    		options.url = options.url || location.href;
    		options.data = options.data || null;
    		callback = callback || function() {};
    		options.type = options.type || 'json';
    		if (typeof options.data === 'object') {
    			data = Ajax.Utils.toQueryString(options.data);
    		} else {
    			data = options.data;
    		}
    		var url = options.url;
    		if (options.type == 'jsonp') {
    			window.jsonCallback = callback;
    			var $url = url.replace('callback=?', 'callback=jsonCallback');
    			var script = document.createElement('script');
    			script.src = $url;
    			document.body.appendChild(script);
    		}
    		xhttp.open('GET', options.url, true);
    		xhttp.send(data);
    		xhttp.onreadystatechange = function() {
    			if (xhttp.status == 200 && xhttp.readyState == 4) {
    				console.log(xhttp.responseText);
    				callback(JSON.parse(xhttp.responseText));
    			}
    		};
    	}
    };

    function initializeDomEvents () {

        document.addEventListener("click" , function (event) {
            console.log(this, event, {'x' : event.x, 'y' : event.y, 'pageWidth' : document.body.clientWidth,'pageHeight' : document.body.clientHeight, 'screenWidth' : screen.width, 'screenHeight' : screen.height});
            fa.trackEvent('click', {'x' : event.x, 'y' : event.y, 'pageWidth' : document.body.clientWidth,'pageHeight' : document.body.clientHeight, 'screenWidth' : screen.width, 'screenHeight' : screen.height});
        });
    };

    var count = 0;
    function startTimer () {


        setInterval(function () {
            count = count + 1;
        }, 1000);
    }

    window.onbeforeunload = function () {
        fa.trackEvent('sessionOver', {timings : count});
    };

    /**
    *   This is the method to instantiate the frugal-analytics event
    */
    fa.instantiate = function (options) {
//        fa.userId = options.userId;
        fa.trackEvent('Create', {});
        fa.appId = options.appId;
        initializeDomEvents();
        startTimer();
     };

     /**
     *  This is the method to track events based on the event
     */
     fa.trackEvent = function (eventName, data) {
        data.userAgent = navigator.userAgent;
        Ajax.post({
            url : fa.url,
            data : {
                userId : fa.userId,
                event : eventName,
                data : data ? JSON.stringify(data) : JSON.stringify({}),
                createdAt : new Date().getTime(),
                page : window.location.pathname+window.location.hash,
                url : window.location.host,
                referrer : document.referrer
            }
        });
     };
})(fa);