// Copyright (c) 2012,2013 Peter Coles - http://mrcoles.com/ - All rights reserved.
// Use of this source code is governed by the MIT License found in LICENSE


//
// Events
//
var screenshot, contentURL = '';
var settings={};
//
// Set up Event Handlers and Views as well as load in settings
//
document.addEventListener('DOMContentLoaded', function() {

  //Hide <div> tags
  hide('capturing_page');
  hide('loader');
  hide('uh-oh');
  hide('invalid');
  
  hide('wrap');
  //document.getElementById("loader").style.visibility = "hidden";
  //hide('bar');
  
    // Use default value color = 'Entire Page' and likesColor = true.
  chrome.storage.sync.get({
    value_imgType: 'png',
    value_imgQuality: '100%'
  }, function(items) {
    console.log(items.value_imgType);
    console.log(items.value_imgQuality);
    settings.type = items.value_imgType;
    settings.quality = parseInt(items.value_imgQuality);
  });
  
  
chrome.extension.onRequest.addListener(onMessage);

  
  //Get Element ID's
  var btnCaptureFullPage = document.getElementById('btnCaptureFullPage');
  var btnCurrentPageView = document.getElementById('btnCurrentPageView');
  var btnCaptureSelection = document.getElementById('btnCaptureSelection');
  var btnOptions = document.getElementById('btnOptions');
  
  /*
      chrome.tabs.query({active: true, highlighted: true}, function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {file: 'capture_crop.js'}, function() {});
      }); 
    */  
    
    
btnOptions.addEventListener('click', function() {
  chrome.runtime.openOptionsPage(function() {
    });
  });
      
  //********************************************************************//
  //Code to Capture the entire Page (intiially from Peter Cole)
  //********************************************************************//
  btnCaptureFullPage.addEventListener('click', function() {
    
    show('capturing_page');
    show('loader');
    show('wrap');
    chrome.tabs.getSelected(null, function(tab) {

      if (testURLMatches(tab.url)) {
        var loaded = false;
      
        chrome.tabs.executeScript(tab.id, {file: 'js/capture_fullpage.js'}, function() {
          loaded = true;
          show('loading');
          sendScrollMessage(tab);
        }); 

        window.setTimeout(function() {
          if (!loaded) {
            show('uh-oh');
            }
          }, 1000);
        } else {
          hide('capturing_page');
          hide('loader');
          show('invalid');
        }
      });
    });
  
  
  //********************************************************************//
  //Captures only the current view of the page
  //********************************************************************//
  btnCurrentPageView.addEventListener('click', function() {
    show('loader');
    chrome.tabs.query({active: true, highlighted: true}, function(tabs) {
      if (testURLMatches(tabs[0].url)) {
        $('bar').style.width = parseInt(0.25 * 100, 10) + '%';
        //Screen shot the selected tab, and then send the raw PNG data to the OpenPage Method
          chrome.tabs.captureVisibleTab(null, {format: settings.type, quality: settings.quality}, function(data) {
            $('bar').style.width = parseInt(0.5 * 100, 10) + '%';

            //Get the Current Tab Size
            var coords = {
			        w: tabs[0].width,
			        h: tabs[0].height,
			        x: 0,
			        y: 0
		        };  
		        
		        //Send the data too the open page method
		        openViewWithCoords(data, coords);
  		    });
      } else {
        hide('capturing_page');
        show('invalid');
      }
    });
  });
  
  
  //********************************************************************//
  //Captures a specified cropped version
  //********************************************************************//
  btnCaptureSelection.addEventListener('click', function() {


    //show('capturing_page');
    //show('loading');
    
      chrome.tabs.query({active: true, highlighted: true}, function(tabs) {
            if (testURLMatches(tabs[0].url)) {
        chrome.tabs.executeScript(tabs[0].id, {file: 'js/capture_crop.js'}, function() {
            sendMessage({msg:'StartCropCapture', settings:settings});
          }); 
            } else {
              hide('capturing_page');
              show('invalid');
            }
        });
      });
    });


function onMessage(request, sender, callback) {
 
    if (request.msg == 'capturePage') {
        capturePage(request, sender, callback);
    } 
    else {
        console.error('Unknown message received from content script: ' + request.msg);
    }
}

//
// console object for debugging
//
var log = (function() {
    var parElt = document.getElementById('wrap'),
        logElt = document.createElement('div');
    logElt.id = 'log';
    logElt.style.display = 'block';
    parElt.appendChild(logElt);

    return function() {
        var a, p, results = [];
        for (var i=0, len=arguments.length; i<len; i++) {
            a = arguments[i];
            try {
                a = JSON.stringify(a, null, 2);
            } catch(e) {}
            results.push(a);
        }
        p = document.createElement('p');
        p.innerText = results.join(' ');
        p.innerHTML = p.innerHTML.replace(/ /g, '&nbsp;');
        logElt.appendChild(p);
    };
})();

//
// utility methods
//
function $(id) { return document.getElementById(id); }
function show(id) { $(id).style.display = 'block'; }
function hide(id) { $(id).style.display = 'none'; }

//
// URL Matching test - to verify we can talk to this URL
//
var matches = ['http://*/*', 'https://*/*', 'ftp://*/*', 'file://*/*'],
    noMatches = [/^https?:\/\/chrome.google.com\/.*$/];
function testURLMatches(url) {
    // couldn't find a better way to tell if executeScript
    // wouldn't work -- so just testing against known urls
    // for now...
    var r, i;
    for (i=noMatches.length-1; i>=0; i--) {
        if (noMatches[i].test(url)) {
            return false;
        }
    }
    for (i=matches.length-1; i>=0; i--) {
        r = new RegExp('^' + matches[i].replace(/\*/g, '.*') + '$');
        if (r.test(url)) {
            return true;
        }
    }
    return false;
}



function sendMessage(msg) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, msg, function(response) {console.log(response);});
	});
}

function sendScrollMessage(tab) {
    contentURL = tab.url;
    screenshot = {};
    chrome.tabs.sendRequest(tab.id, {msg: 'scrollPage'}, function(coords) {
        // We're done taking snapshots of all parts of the window. Display
        // the resulting full screenshot image in a new browser tab.
        sendLogMessage(coords);
        openViewWithCoords(screenshot.canvas.toDataURL(), coords);
    });
}

function sendLogMessage(data) {
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {msg: 'logMessage', data: data}, function() {});
    });
}



function capturePage(data, sender, callback) {
    var canvas;

    $('bar').style.width = parseInt(data.complete * 100, 10) + '%';

    // Get window.devicePixelRatio from the page, not the popup
    var scale = data.devicePixelRatio && data.devicePixelRatio !== 1 ?
        1 / data.devicePixelRatio : 1;

    // if the canvas is scaled, then x- and y-positions have to make
    // up for it
    if (scale !== 1) {
        data.x = data.x / scale;
        data.y = data.y / scale;
        data.totalWidth = data.totalWidth / scale;
        data.totalHeight = data.totalHeight / scale;
    }


    if (!screenshot.canvas) {
        canvas = document.createElement('canvas');
        canvas.width = data.totalWidth;
        canvas.height = data.totalHeight;
        screenshot.canvas = canvas;
        screenshot.ctx = canvas.getContext('2d');

        // sendLogMessage('TOTALDIMENSIONS: ' + data.totalWidth + ', ' + data.totalHeight);

        // // Scale to account for device pixel ratios greater than one. (On a
        // // MacBook Pro with Retina display, window.devicePixelRatio = 2.)
        // if (scale !== 1) {
        //     // TODO - create option to not scale? It's not clear if it's
        //     // better to scale down the image or to just draw it twice
        //     // as large.
        //     screenshot.ctx.scale(scale, scale);
        // }
    }

    // sendLogMessage(data);

    chrome.tabs.captureVisibleTab(
        null, {format: 'png', quality: 100}, function(dataURI) {
            if (dataURI) {
                var image = new Image();
                image.onload = function() {
                    sendLogMessage('img dims: '+  data.x+ ', ' +  data.y +', ' + image.width + ', ' + image.height);
                    screenshot.ctx.drawImage(image, data.x, data.y);
                    callback(true);
                };
                image.src = dataURI;
            }
        });
}

function openViewWithCoords(dataURI, coords) {
		//sendLogMessage("opening URL page...");
    // standard dataURI can be too big, let's blob instead
    // http://code.google.com/p/chromium/issues/detail?id=69227#c27

    //$('bar').style.width = parseInt(1 * 100, 10) + '%';
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // create a blob for writing to a file
    var blob = new Blob([ab], {type: mimeString});

    // come up with file-system size with a little buffer
    var size = blob.size + (1024/2);

    // come up with a filename
    var name = contentURL.split('?')[0].split('#')[0];
    if (name) {
        name = name
            .replace(/^https?:\/\//, '')
            .replace(/[^A-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^[_\-]+/, '')
            .replace(/[_\-]+$/, '');
        name = '-' + name;
    } else {
        name = '';
    }
    name = 'screencapture' + name + '-' + Date.now() + '.png';

    function onwriteend() {
        // open the file that now contains the blob
        var filesString = 'filesystem:chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/temporary/' + name;
        //window.open(filesString);
		    window.open("../editor/editor.html?files="+filesString+"&cropX="+coords.x+"&cropY="+coords.y+"&cropH="+coords.w+"&cropW="+coords.h+"&submit=Send+data");
    }

    function errorHandler() {
        show('uh-oh');
    }

    // create a blob for writing to a file
    window.webkitRequestFileSystem(window.TEMPORARY, size, function(fs){
        fs.root.getFile(name, {create: true}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = onwriteend;
                fileWriter.write(blob);
            }, errorHandler);
        }, errorHandler);
    }, errorHandler);
    return true;
}