//uploadr is a javascript library for handling imgur uploads
function uploadr(clientid) {
  this.clientid = clientid;
  this.token = '';
}
uploadr.prototype.requestAuthToken = function() {
  window.open(
    'https://api.imgur.com/oauth2/authorize?response_type=token&client_id=' +
      this.clientid
  );
};

uploadr.prototype.setAuthToken = function(token) {
  this.token = token;
};

uploadr.prototype.uploadImg = function(
  base64Src,
  callback,
  title = '',
  description = ''
) {
  $.ajax({
    url: 'https://api.imgur.com/3/image',
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + this.token,
      Accept: 'application/json'
    },
    data: {
      title: title,
      description: description,
      image: base64Src,
      type: 'base64'
    },
    success: function(result) {
      callback(result);
    },
    error: function(e) {
      console.log('uploadr: error uploading file...');
      console.log(e);
      callback(result);
    }
  });
};

uploadr.prototype.dataURItoBlob = function(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else byteString = unescape(dataURI.split(',')[1]);
  // separate out the mime component
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
};

// uploads an image to imgur anominously
uploadr.prototype.uploadImgAnon = function(base64Src, callback) {
  // create the file blob
  var file = this.dataURItoBlob(base64Src);
  var fd = new FormData();
  // Append the file
  fd.append('image', file);

  // Create the XHR Request
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.imgur.com/3/image.json');
  xhr.onload = function() {
    // parse response
    callback(JSON.parse(xhr.responseText));
  };
  // set the client id. (Get your own key from http://api.imgur.com/)
  xhr.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);

  // finally, send the form data
  xhr.send(fd);
};
