#modJS  forked from https://github.com/fex-team/mod


## About modJS
Simple and lightly JavaScript Module loader.
- support define , as AMD
- support require, as AMD
- suport  require.loadJS 
- support require.loadCSS


## Usage

**define** (id, factory)

write your code as commmonJS, and use a wrapper for browser.

or 

define('moduleName',function(require,exports,module){
    //your commonJS code
    ...
})

factory has 3 arguments：**require**, **exports**, **module**


 **require** (id)

> var a = require('modA');

 **require.loadJS** (names, onload, onerror) 

> require('lib/base.js',function(){
        //success
    },function(){
        //onerror
    });


When load file error or request timeout, onerror will be executed.
Default timeout(5000ms) can be reseted by 
> require.timeout = 6000; 


 **require.loadCss** ({url: cssfile})
Load CSS file and insert into DOM.

 **require.loadCss** ({content: csstext})

Load CSS context

## other 
auto define wrapper：[fis-postprocessor-jswrapper](https://github.com/fex-team/fis-postprocessor-jswrapper)
