// share to imgur
document.body.style.background = 'gray';

// First, parse the query string
var params = {},
  queryString = location.hash.substring(1),
  regex = /([^&=]+)=([^&]*)/g,
  m;
while ((m = regex.exec(queryString))) {
  params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}

setTimeout(function() {
  // now send a string to the background script telling it there is a imgur oauth token available
  chrome.runtime.sendMessage(
    {
      name: 'msg.imgur.oauth',
      auth_token: params.access_token
    },
    function(response) {
      console.log(response.farewell);
    }
  );

  window.close();
}, 250);
