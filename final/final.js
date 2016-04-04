	function onLoad()
	{
		var parameters = location.search.substring(1).split("&");

		var temp = parameters[0].split("=");
		l = unescape(temp[1]);

		//document.getElementById("log").innerHTML = l;
		document.getElementById('frme').href = l;
		document.getElementById('myCanvas').src = l;
		
		 var link = document.createElement("a");
    link.download = "name.png";
    link.href = l;
    link.click();
		
		 var canvas = document.getElementById('myCanvas');

      var context = canvas.getContext('2d');
      
      var img = new Image();
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };
      img.src = l;
      
      close();
	}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  //document.querySelector('button').addEventListener('click', clickHandler);
 onLoad();

});


window.onload = function(){

};