
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
//wrapper
function grippr(resizr, location) {
    this.cntrl = document.createElement('div');
    resizr.wrapper.appendChild(this.cntrl);
    this.resizr = resizr
    size = 8;
    this.cntrl.grpr = this
    this.cntrl.style.width = size + 'px';
    this.cntrl.style.height = size + 'px';
    this.cntrl.style.position = 'absolute';
    this.cntrl.style.top = -1 * size / 2 - 2 + 'px';
    this.cntrl.style.left = -1 * size / 2 - 2 + 'px';
    this.cntrl.style.backgroundColor = "white"
    this.cntrl.style.border = "thin solid black";
    this.cntrl.style.borderRadius = "2px";

    this.name = location
    //
    this.cntrl.onmouseenter = function (e) {
        document.body.style.cursor = this.grpr.name + '-resize';
    };
    this.cntrl.onmouseleave = function (e) {
        //console.log('left');
        document.body.style.cursor = 'default';
    };
    this.cntrl.onmousedown = function (e) {
        this.grpr.onMouseDown();
    };
    this.cntrl.onmouseup = function (e) {
        this.grpr.onMouseUp();
    };
    this.isDown = false;
}

grippr.prototype.onMouseDown = function () {
    //console.log(this.name + "-down")
    this.isDown = true
    this.resizr.currentGripper = this
}
grippr.prototype.onMouseUp = function () {
    //console.log(this.name + "-up")
    this.isDown = false
    this.resizr.currentGripper = null
}

var resizerID = '';
function resizr(resizerid, initW = 300, initH = 200) {
    resizerID = resizerid + 'jsresizer';
    this.wrapper = document.createElement('div');
    this.wrapper.setAttribute('id', resizerID);
    document.body.appendChild(this.wrapper);

    this.wrapper.resizr = this
    this.wrapper.style.width = initW + 'px';
    this.wrapper.style.height = initH + 'px';
    this.wrapper.style.position = 'absolute';
    //this.wrapper.style.top = '0px';
    this.wrapper.style.border = "thin dashed black";

    this.n = new grippr(this, 'n');
    this.s = new grippr(this, 's');
    this.e = new grippr(this, 'e');
    this.w = new grippr(this, 'w');

    this.ne = new grippr(this, 'ne');
    this.nw = new grippr(this, 'nw');
    this.se = new grippr(this, 'se');
    this.sw = new grippr(this, 'sw');



    this.currentGripper = null
    this.isMouseDown = false

    this.setGripperPos();
    this.wrapper.onmousedown = function (e) {
        this.resizr.onMouseDown(e);
    };

    document.onmousemove = function (e) {
        var wrapper = document.getElementById(resizerID)
        wrapper.resizr.onMouseMove(e);
    };
    document.onmouseup = function (e) {
        var wrapper = document.getElementById(resizerID)
        wrapper.resizr.onMouseUp(e)
    };

}
resizr.prototype.getBounds = function () {
    return this.wrapper.getBoundingClientRect();
}
resizr.prototype.setGripperPos = function () {

    // sides
    this.n.cntrl.style.top = (-1 * size / 2) - 2 + 'px';
    this.n.cntrl.style.left = getValue(this.wrapper.style.width) / 2 + (-1 * size / 2) - 2 + 'px';
    this.s.cntrl.style.top = getValue(this.wrapper.style.height) + (-1 * size / 2) - 2 + 'px';
    this.s.cntrl.style.left = getValue(this.wrapper.style.width) / 2 + (-1 * size / 2) - 2 + 'px';
    this.e.cntrl.style.top = getValue(this.wrapper.style.height) / 2 + (-1 * size / 2) - 2 + 'px';
    this.e.cntrl.style.left = getValue(this.wrapper.style.width) + (-1 * size / 2) - 2 + 'px';
    this.w.cntrl.style.top = getValue(this.wrapper.style.height) / 2 + (-1 * size / 2) - 2 + 'px';
    this.w.cntrl.style.left = (-1 * size / 2) - 2 + 'px';

    // corners
    this.ne.cntrl.style.top = (-1 * size / 2) - 2 + 'px';
    this.ne.cntrl.style.left = getValue(this.wrapper.style.width) + (-1 * size / 2) - 2 + 'px';
    this.nw.cntrl.style.top = (-1 * size / 2) - 2 + 'px';
    this.nw.cntrl.style.left = (-1 * size / 2) - 2 + 'px';
    this.se.cntrl.style.left = getValue(this.wrapper.style.width) + (-1 * size / 2) - 2 + 'px';
    this.se.cntrl.style.top = getValue(this.wrapper.style.height) + (-1 * size / 2) - 2 + 'px';
    this.sw.cntrl.style.left = (-1 * size / 2) - 2 + 'px';
    this.sw.cntrl.style.top = getValue(this.wrapper.style.height) + (-1 * size / 2) - 2 + 'px';
}


resizr.prototype.onMouseDown = function (e) {
    var el = this.wrapper;
    this.isMouseDown = true
    this.sobject = new sObject();
    this.sobject.el = el;
    this.sobject.cursor = this.currentGripper;
    this.sobject.grabx = e.clientX;
    this.sobject.graby = e.clientY;
    this.sobject.width = el.offsetWidth;
    this.sobject.height = el.offsetHeight;
    this.sobject.left = el.offsetLeft;
    this.sobject.top = el.offsetTop;
}
resizr.prototype.onMouseMove = function (e) {
    if (this.isMouseDown == true && this.sobject != null) {
        var cursor = this.sobject.cursor.name;
        //this.wrapper.style.cursor = cursor;
        console.log(this.getBounds())

        if (cursor.indexOf("e") != -1)
            this.sobject.el.style.width = Math.max(8, this.sobject.width + e.clientX - this.sobject.grabx) + "px";

        if (cursor.indexOf("s") != -1)
            this.sobject.el.style.height = Math.max(8, this.sobject.height + e.clientY - this.sobject.graby) + "px";

        if (cursor.indexOf("w") != -1) {
            this.sobject.el.style.left = Math.min(this.sobject.left + e.clientX - this.sobject.grabx, this.sobject.left + this.sobject.width - 8) + "px";
            this.sobject.el.style.width = Math.max(8, this.sobject.width - e.clientX + this.sobject.grabx) + "px";
        }
        if (cursor.indexOf("n") != -1) {
            this.sobject.el.style.top = Math.min(this.sobject.top + e.clientY - this.sobject.graby, this.sobject.top + this.sobject.height - 8) + "px";
            this.sobject.el.style.height = Math.max(8, this.sobject.height - e.clientY + this.sobject.graby) + "px";
        }

        this.setGripperPos();
    }
}
resizr.prototype.onMouseUp = function (e) {
    this.currentGripper = null;
    this.isMouseDown = false;
    this.sobject = null;
    this.onResizerFinished();
}

resizr.prototype.onResizerFinished = function () {
    var event = new CustomEvent(
        "onResizerFinished",
        {
            detail: {
                resizr: this,
                bounds: this.getBounds()
            },
            bubbles: true,
            cancelable: true
        });
    document.dispatchEvent(event);
}