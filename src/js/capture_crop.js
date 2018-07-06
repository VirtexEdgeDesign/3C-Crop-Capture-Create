function getValue(val) {
  return parseInt(val.replace('px', ''));
}

function sObject() {
  this.el = null;
  this.cursor = '';
  this.grabx = null;
  this.graby = null;
  this.width = null;
  this.height = null;
  this.left = null;
  this.top = null;
}
// gripper control
function grippr(resizr, location) {
  this.cntrl = document.createElement('div');
  resizr.wrapper.appendChild(this.cntrl);
  this.resizr = resizr;
  size = 8;
  this.cntrl.grpr = this;
  this.cntrl.style.width = size + 'px';
  this.cntrl.style.height = size + 'px';
  this.cntrl.style.position = 'absolute';
  this.cntrl.style.top = -1 * size / 2 - 2 + 'px';
  this.cntrl.style.left = -1 * size / 2 - 2 + 'px';
  this.cntrl.style.backgroundColor = 'white';
  this.cntrl.style.border = 'thin solid black';
  this.cntrl.style.borderRadius = '2px';

  this.name = location;
  //
  this.cntrl.onmouseenter = function(e) {
    document.body.style.cursor = this.grpr.name + '-resize';
  };
  this.cntrl.onmouseleave = function(e) {
    document.body.style.cursor = 'default';
  };
  this.cntrl.onmousedown = function(e) {
    this.grpr.onMouseDown();
  };
  this.cntrl.onmouseup = function(e) {
    this.grpr.onMouseUp();
  };
  this.isDown = false;
}

grippr.prototype.onMouseDown = function() {
  this.isDown = true;
  this.resizr.currentGripper = this;
};
grippr.prototype.onMouseUp = function() {
  this.isDown = false;
  this.resizr.currentGripper = null;
};
grippr.prototype.dispose = function() {
  this.cntrl.parentNode.removeChild(this.cntrl);
};

var resizerID = '';
function resizr(resizerid, initX = 10, initY = 10, initW = 300, initH = 200) {
  resizerID = resizerid + 'jsresizer';
  this.wrapper = document.createElement('div');
  this.wrapper.setAttribute('id', resizerID);
  document.body.appendChild(this.wrapper);

  this.wrapper.resizr = this;
  this.wrapper.style.position = 'absolute';
  this.wrapper.style.left = initX + 'px';
  this.wrapper.style.top = initY + 'px';
  this.wrapper.style.width = initW + 'px';
  this.wrapper.style.height = initH + 'px';
  this.wrapper.style.zIndex = '1000000';

  //this.wrapper.style.top = '0px';
  this.wrapper.style.border = 'thin dashed black';

  this.n = new grippr(this, 'n');
  this.s = new grippr(this, 's');
  this.e = new grippr(this, 'e');
  this.w = new grippr(this, 'w');

  this.ne = new grippr(this, 'ne');
  this.nw = new grippr(this, 'nw');
  this.se = new grippr(this, 'se');
  this.sw = new grippr(this, 'sw');

  this.currentGripper = null;
  this.isMouseDown = false;

  this.setGripperPos();
  this.wrapper.onmousedown = function(e) {
    this.resizr.onMouseDown(e);
  };

  document.onmousemove = function(e) {
    var wrapper = document.getElementById(resizerID);
    wrapper.resizr.onMouseMove(e);
  };
  document.onmouseup = function(e) {
    var wrapper = document.getElementById(resizerID);
    wrapper.resizr.onMouseUp(e);
  };
}
resizr.prototype.getBounds = function() {
  return this.wrapper.getBoundingClientRect();
};
resizr.prototype.setGripperPos = function() {
  // sides
  this.n.cntrl.style.top = -1 * size / 2 - 2 + 'px';
  this.n.cntrl.style.left =
    getValue(this.wrapper.style.width) / 2 + -1 * size / 2 - 2 + 'px';
  this.s.cntrl.style.top =
    getValue(this.wrapper.style.height) + -1 * size / 2 - 2 + 'px';
  this.s.cntrl.style.left =
    getValue(this.wrapper.style.width) / 2 + -1 * size / 2 - 2 + 'px';
  this.e.cntrl.style.top =
    getValue(this.wrapper.style.height) / 2 + -1 * size / 2 - 2 + 'px';
  this.e.cntrl.style.left =
    getValue(this.wrapper.style.width) + -1 * size / 2 - 2 + 'px';
  this.w.cntrl.style.top =
    getValue(this.wrapper.style.height) / 2 + -1 * size / 2 - 2 + 'px';
  this.w.cntrl.style.left = -1 * size / 2 - 2 + 'px';

  // corners
  this.ne.cntrl.style.top = -1 * size / 2 - 2 + 'px';
  this.ne.cntrl.style.left =
    getValue(this.wrapper.style.width) + -1 * size / 2 - 2 + 'px';
  this.nw.cntrl.style.top = -1 * size / 2 - 2 + 'px';
  this.nw.cntrl.style.left = -1 * size / 2 - 2 + 'px';
  this.se.cntrl.style.left =
    getValue(this.wrapper.style.width) + -1 * size / 2 - 2 + 'px';
  this.se.cntrl.style.top =
    getValue(this.wrapper.style.height) + -1 * size / 2 - 2 + 'px';
  this.sw.cntrl.style.left = -1 * size / 2 - 2 + 'px';
  this.sw.cntrl.style.top =
    getValue(this.wrapper.style.height) + -1 * size / 2 - 2 + 'px';
};

resizr.prototype.onMouseDown = function(e) {
  var el = this.wrapper;
  this.isMouseDown = true;
  this.sobject = new sObject();
  this.sobject.el = el;
  this.sobject.cursor = this.currentGripper;
  this.sobject.grabx = e.clientX;
  this.sobject.graby = e.clientY;
  this.sobject.width = el.offsetWidth;
  this.sobject.height = el.offsetHeight;
  this.sobject.left = el.offsetLeft;
  this.sobject.top = el.offsetTop;
};

resizr.prototype.onMouseMove = function(e) {
  if (this.isMouseDown == true && this.sobject != null) {
    var cursor = this.sobject.cursor.name;
    //this.wrapper.style.cursor = cursor;
    //console.log(this.getBounds());

    if (cursor.indexOf('e') != -1)
      this.sobject.el.style.width =
        Math.max(8, this.sobject.width + e.clientX - this.sobject.grabx) + 'px';

    if (cursor.indexOf('s') != -1)
      this.sobject.el.style.height =
        Math.max(8, this.sobject.height + e.clientY - this.sobject.graby) +
        'px';

    if (cursor.indexOf('w') != -1) {
      this.sobject.el.style.left =
        Math.min(
          this.sobject.left + e.clientX - this.sobject.grabx,
          this.sobject.left + this.sobject.width - 8
        ) + 'px';
      this.sobject.el.style.width =
        Math.max(8, this.sobject.width - e.clientX + this.sobject.grabx) + 'px';
    }
    if (cursor.indexOf('n') != -1) {
      this.sobject.el.style.top =
        Math.min(
          this.sobject.top + e.clientY - this.sobject.graby,
          this.sobject.top + this.sobject.height - 8
        ) + 'px';
      this.sobject.el.style.height =
        Math.max(8, this.sobject.height - e.clientY + this.sobject.graby) +
        'px';
    }

    this.setGripperPos();

    var event = new CustomEvent('onResizerChanged', {
      detail: {
        resizr: this,
        bounds: this.getBounds()
      },
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(event);
  }
};
resizr.prototype.onMouseUp = function(e) {
  this.currentGripper = null;
  this.isMouseDown = false;
  this.sobject = null;
  this.onResizerFinished();
};

resizr.prototype.onResizerFinished = function() {
  var event = new CustomEvent('onResizerFinished', {
    detail: {
      resizr: this,
      bounds: this.getBounds()
    },
    bubbles: true,
    cancelable: true
  });
  document.dispatchEvent(event);
};

resizr.prototype.dispose = function() {
  this.wrapper.parentNode.removeChild(this.wrapper);
  this.n.dispose();
  this.ne.dispose();
  this.nw.dispose();
  this.s.dispose();
  this.se.dispose();
  this.sw.dispose();
  this.e.dispose();
  this.w.dispose();
  document.onmousemove = function(e) {};
  document.onmouseup = function(e) {};
};

var ghostElement,
  edgeElement,
  elGrayLeft,
  elGrayTop,
  elGrayRight,
  elGrayBottom,
  startPos = null,
  gCoords;
var IsInitialising = true;
var crop_sizer, crop_btn_capture, crop_btn_cancel;
var settings;
var FirstLoop = 0;
function onMessageForCropped(request, sender, callback) {
  if (request.msg == 'StartCropCapture') {
    //This message maybe recieved multiple times, only makes sure it's caught the first time.
    if (FirstLoop === 0) {
      FirstLoop++;
      settings = request.settings;
      startScreenshot();
    }
  }
  return true;
}
chrome.extension.onRequest.addListener(onMessageForCropped);

function startScreenshot() {
  if (IsInitialising) {
    document.addEventListener('mousedown', mouseDown, false);
    //document.addEventListener('keydown', keyDown, false);
    document.body.style.cursor = 'crosshair';

    var colour = 'Black';
    var opacity = '0.4';
    //********************************************//
    /*         Selection Elements                 */

    //********************************************//
    elGrayLeft = document.createElement('elGrayLeft');
    elGrayLeft.style.background = colour;
    elGrayLeft.style.opacity = opacity;
    elGrayLeft.style.position = 'absolute';
    elGrayLeft.style.left = '0px';
    elGrayLeft.style.top = '0px';
    elGrayLeft.style.width = document.documentElement.scrollWidth + 'px';
    elGrayLeft.style.height = document.documentElement.scrollHeight + 'px';
    elGrayLeft.style.zIndex = '1000000';
    document.body.appendChild(elGrayLeft);

    elGrayTop = document.createElement('elGrayTop');
    elGrayTop.style.background = colour;
    elGrayTop.style.opacity = opacity;
    elGrayTop.style.position = 'absolute';
    elGrayTop.style.left = '0px';
    elGrayTop.style.top = '0px';
    elGrayTop.style.width = '0px';
    elGrayTop.style.height = '0px';
    elGrayTop.style.zIndex = '1000000';
    document.body.appendChild(elGrayTop);

    elGrayRight = document.createElement('elGrayRight');
    elGrayRight.style.background = colour;
    elGrayRight.style.opacity = opacity;
    elGrayRight.style.position = 'absolute';
    elGrayRight.style.left = '0px';
    elGrayRight.style.top = '0px';
    elGrayRight.style.width = '0px';
    elGrayRight.style.height = '0px';
    elGrayRight.style.zIndex = '1000000';
    document.body.appendChild(elGrayRight);

    elGrayBottom = document.createElement('elGrayBottom');
    elGrayBottom.style.background = colour;
    elGrayBottom.style.opacity = opacity;
    elGrayBottom.style.position = 'absolute';
    elGrayBottom.style.left = '0px';
    elGrayBottom.style.top = '0px';
    elGrayBottom.style.width = '0px';
    elGrayBottom.style.height = '0px';
    elGrayBottom.style.zIndex = '1000000';
    document.body.appendChild(elGrayBottom);
  }
}

function endScreenshot(coords) {
  //Message Fired in the 'backgroun.js' file
  chrome.extension.sendMessage(
    {
      name: 'background.takeScreenShot.currentView',
      coords: coords,
      settings: settings
    },
    function(response) {
      return true;
    }
  );
  return true;
}

//
// end messages
//
function mouseDown(e) {
  e.preventDefault();
  //console.log("mouseDown");

  startPos = { x: e.pageX, y: e.pageY };

  ghostElement = document.createElement('ghostElement');
  //ghostElement.style.background = 'DarkOrange';
  //ghostElement.style.border = 'medium dotted black';
  ghostElement.style.opacity = '0.5';
  ghostElement.style.position = 'absolute';
  ghostElement.style.left = e.pageX + 'px';
  ghostElement.style.top = e.pageY + 'px';
  ghostElement.style.width = '0px';
  ghostElement.style.height = '0px';
  ghostElement.style.zIndex = '1000000';
  //document.body.appendChild(ghostElement);

  edgeElement = document.createElement('edgeElement');
  edgeElement.style.background = 'clear';
  edgeElement.style.border = '2px dashed #111';
  edgeElement.style.border = 'thin dashed black';
  edgeElement.style.opacity = '1';
  edgeElement.style.position = 'absolute';
  edgeElement.style.left = e.pageX + 'px';
  edgeElement.style.top = e.pageY + 'px';
  edgeElement.style.width = '0px';
  edgeElement.style.height = '0px';
  edgeElement.style.zIndex = '1000000';
  document.body.appendChild(edgeElement);

  document.addEventListener('mousemove', mouseMove, false);
  document.addEventListener('mouseup', mouseUp, false);

  return false;
}

function setGrayBoundaries(bnds) {
  elGrayLeft.style.width = bnds.x + 'px';
  elGrayLeft.style.height = document.documentElement.scrollHeight + 'px';

  elGrayTop.style.left = bnds.x + 'px';
  elGrayTop.style.top = '0px';
  elGrayTop.style.width = bnds.width + 'px';
  elGrayTop.style.height = bnds.y + 'px';

  elGrayRight.style.left = bnds.x + bnds.width + 'px';
  elGrayRight.style.top = '0px';
  elGrayRight.style.width = document.documentElement.scrollWidth + 'px';
  elGrayRight.style.height = document.documentElement.scrollHeight + 'px';

  elGrayBottom.style.left = bnds.x + 'px';
  elGrayBottom.style.top = bnds.y + bnds.height + 'px';
  elGrayBottom.style.width = bnds.width + 'px';
  elGrayBottom.style.height =
    document.documentElement.scrollHeight - bnds.y + bnds.height + 'px';

  ghostElement.style.width = bnds.width + 'px';
  ghostElement.style.height = bnds.height + 'px';

  edgeElement.style.left = bnds.x - 2 + 'px';
  edgeElement.style.top = bnds.y - 2 + 'px';
  edgeElement.style.width = bnds.width + 2 + 'px';
  edgeElement.style.height = bnds.height + 2 + 'px';
}

function mouseMove(e) {
  e.preventDefault();
  //console.log("mouseMove");

  var nowPos = { x: e.pageX, y: e.pageY };
  var diff = { x: nowPos.x - startPos.x, y: nowPos.y - startPos.y };
  var bounds = {
    x: startPos.x,
    y: startPos.y,
    width: diff.x,
    height: diff.y
  };
  setGrayBoundaries(bounds);
  return false;
}

function removeElements() {
  elGrayLeft.parentNode.removeChild(elGrayLeft);
  elGrayTop.parentNode.removeChild(elGrayTop);
  elGrayRight.parentNode.removeChild(elGrayRight);
  elGrayBottom.parentNode.removeChild(elGrayBottom);

  crop_btn_capture.parentNode.removeChild(crop_btn_capture);
  crop_btn_cancel.parentNode.removeChild(crop_btn_cancel);
  document.removeEventListener('onResizerChanged', onResizerChanged, false);
  crop_sizer.dispose();
}
function mouseUp(e) {
  e.preventDefault();
  //document.body.style.cursor = 'default';

  //console.log("mouseUp");
  var nowPos = { x: e.pageX, y: e.pageY };
  var diff = { x: nowPos.x - startPos.x, y: nowPos.y - startPos.y };

  document.removeEventListener('mousemove', mouseMove, false);
  document.removeEventListener('mouseup', mouseUp, false);
  document.removeEventListener('mousedown', mouseDown, false);
  IsInitialising = false;

  edgeElement.parentNode.removeChild(edgeElement);

  var coords = {
    w: diff.x,
    h: diff.y,
    x: startPos.x - window.scrollX,
    y: startPos.y - window.scrollY
  };
  gCoords = coords;

  crop_sizer = new resizr(
    'reszier',
    startPos.x,
    startPos.y,
    coords.w,
    coords.h
  );

  var rule =
    '\
    .ui-btn-capture {\
      background-image: linear-gradient(to bottom, #ff00aa, #b8008a);\
      border-radius: 8px;\
      box-shadow: 0px 0px 10px black;\
      text-shadow: 1px 1px 0px #000000;\
      font-family: Verdana, Geneva, Tahoma, sans-serif;\
      color: #ffffff;\
      font-size: 14px;\
      padding: 3px 20px 5px 20px;\
      text-decoration: none;\
      border: 1px solid #740157;\
      position: absolute;\
      width: 100px;\
      height: 28px;\
  }\
  .ui-btn-capture:hover {\
      background-image: linear-gradient(to bottom, #3cb0fd, #3498db);\
      text-decoration: none;\
      border: 1px solid #084a75;\
  }\
  .ui-btn-capture[data-btn="cancel"]:hover {\
      background-image: linear-gradient(to bottom, #e92e1d, #8d0000);\
      border: 1px solid #530000;\
  }\
  ';
  var css = document.createElement('style'); // Creates <style></style>
  css.type = 'text/css'; // Specifies the type
  if (css.styleSheet) css.styleSheet.cssText = rule;
  // Support for IE
  else css.appendChild(document.createTextNode(rule)); // Support for the rest
  document.getElementsByTagName('head')[0].appendChild(css); // Specifies where to place the css

  crop_btn_capture = document.createElement('button');
  crop_btn_capture.className = 'ui-btn-capture';
  crop_btn_capture.innerHTML = 'Capture';
  crop_btn_capture.style.zIndex = '1000000';
  crop_btn_capture.style.top = startPos.y + coords.h + 10 + 'px';
  crop_btn_capture.style.left = startPos.x + coords.w - 100 - 10 + 'px';
  document.body.appendChild(crop_btn_capture);

  crop_btn_cancel = document.createElement('button');
  crop_btn_cancel.className = 'ui-btn-capture';
  crop_btn_cancel.innerHTML = 'Cancel';
  crop_btn_cancel.style.zIndex = '1000000';
  crop_btn_cancel.setAttribute('data-btn', 'cancel');
  crop_btn_cancel.style.top = startPos.y + coords.h + 10 + 'px';
  crop_btn_cancel.style.left = startPos.x + coords.w - 100 * 2 - 25 + 'px';
  document.body.appendChild(crop_btn_cancel);

  crop_btn_capture.onclick = function(e) {
    var finalBounds = crop_sizer.getBounds();

    removeElements();

    setTimeout(function() {
      var coords = {
        x: finalBounds.x,
        y: finalBounds.y,
        w: finalBounds.width,
        h: finalBounds.height
      };
      endScreenshot(coords);
    }, 50);
  };

  crop_btn_cancel.onclick = function(e) {
    removeElements();
  };

  document.addEventListener('onResizerChanged', onResizerChanged, false);

  return false;
}

function onResizerChanged(e) {
  // take into account scroll
  bounds = e.detail.bounds;
  bounds.x = bounds.x + window.scrollX;
  bounds.y = bounds.y + window.scrollY;
  setGrayBoundaries(bounds);

  //console.log(crop_btn_capture.style.width);
  crop_btn_capture.style.top = bounds.bottom + 10 + 'px';
  crop_btn_capture.style.left = bounds.right - 100 - 10 + 'px';
  crop_btn_cancel.style.top = bounds.bottom + 10 + 'px';
  crop_btn_cancel.style.left = bounds.right - 100 * 2 - 25 + 'px';
}
