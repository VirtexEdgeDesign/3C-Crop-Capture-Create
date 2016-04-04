
var ghostElement, edgeElement, elGrayLeft, elGrayTop, elGrayRight,  elGrayBottom, startPos, gCoords;
var settings;
var FirstLoop = 0;
function onMessageForCropped(request, sender, callback) {
    if (request.msg == 'StartCropCapture'){
      //This message maybe recieved multiple times, only makes sure it's caught the first time.
      if(FirstLoop === 0){
	        FirstLoop++;
	        settings = request.settings;
		      startScreenshot();
        }
      }
      return true;
}
chrome.extension.onRequest.addListener(onMessageForCropped);


function startScreenshot() {
	document.addEventListener('mousedown', mouseDown, false);
	//document.addEventListener('keydown', keyDown, false);
	
	
	
	var colour = 'Black';
	var opacity = '0.65';
	//********************************************//
	/*         Selection Elements                 */         
	//********************************************//
	elGrayLeft = document.createElement('elGrayLeft');
	elGrayLeft.style.background = colour;
	elGrayLeft.style.opacity = opacity;
	elGrayLeft.style.position = 'absolute';
	elGrayLeft.style.left = "0px";
	elGrayLeft.style.top = "0px";
	elGrayLeft.style.width = 10000 +'px';
	elGrayLeft.style.height =10000 +'px';
	elGrayLeft.style.zIndex = "1000000";
	document.body.appendChild(elGrayLeft);
	
	elGrayTop = document.createElement('elGrayTop');
	elGrayTop.style.background = colour;
	elGrayTop.style.opacity = opacity;
	elGrayTop.style.position = 'absolute';
	elGrayTop.style.left = "0px";
	elGrayTop.style.top = "0px";
	elGrayTop.style.width = "0px";
	elGrayTop.style.height = "0px";
	elGrayTop.style.zIndex = "1000000";
	document.body.appendChild(elGrayTop);
	
	elGrayRight = document.createElement('elGrayRight');
	elGrayRight.style.background = colour;
	elGrayRight.style.opacity = opacity;
	elGrayRight.style.position = 'absolute';
	elGrayRight.style.left = "0px";
	elGrayRight.style.top = "0px";
	elGrayRight.style.width = "0px";
	elGrayRight.style.height = "0px";
	elGrayRight.style.zIndex = "1000000";
	document.body.appendChild(elGrayRight);
	
	elGrayBottom = document.createElement('elGrayBottom');
	elGrayBottom.style.background = colour;
	elGrayBottom.style.opacity = opacity;
	elGrayBottom.style.position = 'absolute';
	elGrayBottom.style.left = "0px";
	elGrayBottom.style.top = "0px";
	elGrayBottom.style.width = "0px";
	elGrayBottom.style.height = "0px";
	elGrayBottom.style.zIndex = "1000000";
	document.body.appendChild(elGrayBottom);
}

function endScreenshot(coords) {
	document.removeEventListener('mousedown', mouseDown, false);
	
	//Message Fired in the 'backgroun.js' file
	chrome.extension.sendMessage({name: 'background.takeScreenShot.currentView', coords: coords, settings:settings}, function(response) {
            return true;
	});
	return true;
}

// 
// end messages
//
function mouseDown(e) {
	e.preventDefault();
	//console.log("mouseDown");

	startPos = {x: e.pageX, y: e.pageY};
	
	
	ghostElement = document.createElement('ghostElement');
	//ghostElement.style.background = 'DarkOrange';
	//ghostElement.style.border = 'medium dotted black';
	ghostElement.style.opacity = '0.5';
	ghostElement.style.position = 'absolute';
	ghostElement.style.left = e.pageX + 'px';
	ghostElement.style.top = e.pageY + 'px';
	ghostElement.style.width = "0px";
	ghostElement.style.height = "0px";
	ghostElement.style.zIndex = "1000000";
	document.body.appendChild(ghostElement);
	
	
	edgeElement = document.createElement('edgeElement');
	edgeElement.style.background = 'clear';
	edgeElement.style.border = '2px dashed #111';
	edgeElement.style.opacity = '1';
	edgeElement.style.position = 'absolute';
	edgeElement.style.left = e.pageX + 'px';
	edgeElement.style.top = e.pageY + 'px';
	edgeElement.style.width = "0px";
	edgeElement.style.height = "0px";
	edgeElement.style.zIndex = "1000000";
	document.body.appendChild(edgeElement);
	
	document.addEventListener('mousemove', mouseMove, false);
	document.addEventListener('mouseup', mouseUp, false);
	
	return false;
}

function mouseMove(e) {
	e.preventDefault();
	//console.log("mouseMove");

	var nowPos = {x: e.pageX, y: e.pageY};
	var diff = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};
	
	elGrayLeft.style.width = startPos.x + 'px';
	elGrayLeft.style.height = document.documentElement.scrollHeight+'px';
	
	elGrayTop.style.left = startPos.x + 'px';
	elGrayTop.style.top = "0px";
	elGrayTop.style.width =  diff.x + 'px';
	elGrayTop.style.height = startPos.y + 'px';
	
	
	elGrayRight.style.left = startPos.x + diff.x + 'px';
	elGrayRight.style.top = "0px";
	elGrayRight.style.width = document.documentElement.scrollWidth+'px';
	elGrayRight.style.height = document.documentElement.scrollHeight+'px';
	
	elGrayBottom.style.left = startPos.x + 'px';
	elGrayBottom.style.top = startPos.y + diff.y + 'px';
	elGrayBottom.style.width = diff.x + 'px';
	elGrayBottom.style.height = document.documentElement.scrollHeight+'px';
	
	ghostElement.style.width = diff.x + 'px';
	ghostElement.style.height = diff.y + 'px';
	
	
	
	edgeElement.style.left = startPos.x - 2  + 'px';
	edgeElement.style.top = startPos.y - 2 + 'px';
	edgeElement.style.width = diff.x + 4 + 'px';
	edgeElement.style.height = diff.y + 4 + 'px';
	
	return false;
}

function mouseUp(e) {
	e.preventDefault();
	
	//console.log("mouseUp");
	var nowPos = {x: e.pageX, y: e.pageY};
	var diff = {x: nowPos.x - startPos.x, y: nowPos.y - startPos.y};

	document.removeEventListener('mousemove', mouseMove, false);
	document.removeEventListener('mouseup', mouseUp, false);
	
	
	elGrayLeft.parentNode.removeChild(elGrayLeft);
	elGrayTop.parentNode.removeChild(elGrayTop);
	elGrayRight.parentNode.removeChild(elGrayRight);
	elGrayBottom.parentNode.removeChild(elGrayBottom);
	
	edgeElement.parentNode.removeChild(edgeElement);
	ghostElement.parentNode.removeChild(ghostElement);
	
	setTimeout(function() {
		var coords = {
			w: diff.x,
			h: diff.y,
			x: startPos.x - window.scrollX,
			y: startPos.y - window.scrollY
		};
		gCoords = coords;

		endScreenshot(coords);

	}, 10);
	
	return false;
}