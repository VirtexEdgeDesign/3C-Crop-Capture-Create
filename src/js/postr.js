//uploadr is a javascript library for handling imgur uploads
function postr() {}
postr.prototype.toTwitter = function(
  text,
  hastags = '',
  url = '',
  userTags = ''
) {
  var shareURL = 'http://twitter.com/share?'; //url base
  //params
  var params = {
    text: text,
    via: userTags,
    hashtags: hastags,
    url: url
  };
  for (var prop in params)
    shareURL += '&' + prop + '=' + encodeURIComponent(params[prop]);
  window.open(
    shareURL,
    '',
    'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
  );
};
postr.prototype.toFacebook = function(url) {
  var shareURL = 'https://www.facebook.com/sharer/sharer.php?'; //url base
  //params
  var params = {
    u: url
  };
  for (var prop in params)
    shareURL += '&' + prop + '=' + encodeURIComponent(params[prop]);
  window.open(
    shareURL,
    '',
    'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
  );
};

postr.prototype.toPinterest = function(description, url, media) {
  var shareURL = 'https://www.pinterest.com/pin/create/button/?'; //url base
  //params
  var params = {
    description: description,
    url: url,
    media: media
  };
  for (var prop in params)
    shareURL += '&' + prop + '=' + encodeURIComponent(params[prop]);
  window.open(
    shareURL,
    '',
    'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
  );
};

postr.prototype.toReddit = function(title, url) {
  var shareURL = 'https://www.reddit.com/submit?'; //url base
  //params
  var params = {
    title: title,
    url: url
  };
  for (var prop in params)
    shareURL += '&' + prop + '=' + encodeURIComponent(params[prop]);
  window.open(
    shareURL,
    '',
    'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0'
  );
};
