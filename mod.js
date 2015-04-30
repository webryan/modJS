/**
 * file: mod.js
 * ver: 1.0.10
 * update: 2015/04/16
 *
 * https://github.com/fex-team/mod
 * modify by: henryguo, http://github.com/webryan
 * info: mod.js的使用场景是配合fis，在集成系统中使用，和require/seajs的异步加载理念是不同的。 
 *      从工程的角度来讲，我们可以考虑全部使用同步逻辑来进行处理。
 * 
 */
var require, define;

(function(global) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        resMap = {},
        pkgMap = {};

    function alias(id) {
        return id.replace(/\.js$/i, '');
    }

    function loadFile(url, onsucc, onerror) {
        if (url in scriptsMap) return;
        scriptsMap[url] = true;

        var script = document.createElement('script'),onload;
        onsucc = onsucc || function(){};

        if (onerror) {
            var tid = setTimeout(onerror, require.timeout);

            script.onerror = function() {
                clearTimeout(tid);
                onerror();
            };

            onload = function () {
                clearTimeout(tid);
                onsucc();
            };
        }else{
            onload = onsucc;
        }

        if ('onload' in script) {
            script.onload = onload;
        } else {
            script.onreadystatechange = function() {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    onload();
                }
            };
        } 

        script.type = 'text/javascript';
        script.src = url;
        head.appendChild(script);
        script = null;
    }

    define = function(id, factory) {
        id = alias(id);
        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for (var i = 0, n = queue.length; i < n; i++) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    // sync call only
    // eg: var a = require('a');
    require = function(id) {

        id = alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod.exports;
        }

        // init module
        var factory = factoryMap[id];
        if (!factory) {
            throw '[ModJS] Cannot find module `' + id + '`';
        }

        mod = modulesMap[id] = {
            exports: {}
        };

        // factory: function OR value
        var ret = (typeof factory == 'function') ? factory.apply(mod, [require, mod.exports, mod]) : factory;

        if (ret) {
            mod.exports = ret;
        }
        return mod.exports;
    };

    //load JS or use script tag before using require
    require.loadJS = loadFile; 
    require.loadCSS = function(cfg) {
        if (cfg.content) {
            var sty = document.createElement('style');
            sty.type = 'text/css';

            if (sty.styleSheet) { // IE
                sty.styleSheet.cssText = cfg.content;
            } else {
                sty.innerHTML = cfg.content;
            }
            head.appendChild(sty);
        } else if (cfg.url) {
            var link = document.createElement('link');
            link.href = cfg.url;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }
    };

    require.timeout = 5000;

})(this);
