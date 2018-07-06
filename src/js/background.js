var imgData = null;
var IsUploadFinished = false;
var success = false;
var info = null;
var token_imgur = null;
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  //console.log(request);
  if (request.name == 'background.takeScreenShot.currentView') {
    chrome.tabs.captureVisibleTab(
      null,
      {
        format: request.settings.type.trim(),
        quality: request.settings.quality
      },
      function(dataUrl) {
        openViewPage(dataUrl, request.coords);
        sendResponse({ screenshotUrl: dataUrl });
      }
    );
  }
  // handling Imgur OAuth and Uploading
  else if (request.name == 'msg.imgur.oauth') {
    token_imgur = request.auth_token;
  } else if (request.name == 'msg.imgur.hasToken') {
    var status = {
      hasToken: token_imgur != null,
      token: token_imgur
    };
    sendResponse(status);
    //clear the token from the background script
    token_imgur = null;
  } else {
    console.log(
      sender.tab
        ? 'from a content script:' + sender.tab.url
        : 'from the extension'
    );
  }

  return true;
});

var contentURL = '';
function openViewPage(dataURI, coords) {
  //sendLogMessage("opening URL page...");
  // standard dataURI can be too big, let's blob instead
  // http://code.google.com/p/chromium/issues/detail?id=69227#c27

  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // create a blob for writing to a file
  var blob = new Blob([ab], { type: mimeString });

  // come up with file-system size with a little buffer
  var size = blob.size + 1024 / 2;

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
    var filesString =
      'filesystem:chrome-extension://' +
      chrome.i18n.getMessage('@@extension_id') +
      '/temporary/' +
      name;
    //window.open(filesString);
    window.open(
      '../editor/editor.html?files=' +
        filesString +
        '&cropX=' +
        coords.x +
        '&cropY=' +
        coords.y +
        '&cropH=' +
        coords.w +
        '&cropW=' +
        coords.h +
        '&submit=Send+data'
    );
  }

  function errorHandler() {
    show('uh-oh');
  }

  // create a blob for writing to a file
  window.webkitRequestFileSystem(
    window.TEMPORARY,
    size,
    function(fs) {
      fs.root.getFile(
        name,
        { create: true },
        function(fileEntry) {
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = onwriteend;
            fileWriter.write(blob);
          }, errorHandler);
        },
        errorHandler
      );
    },
    errorHandler
  );
  return true;
}
