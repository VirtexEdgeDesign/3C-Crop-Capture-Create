var settings = {};
var tbMain;
var tbEditor;
var tbEditor_Marker;
var tbEditor_Shape;
var tbShare;
var canvas;
var CanvasToSave;
var SelectedItem;

var text_fontFamily;
var tlbx_main_colour;

var uploader = new uploadr('9ed02ae300080e5');

// Get the modal_imgur_upload
var modal_imgur_upload = document.getElementById('modal-share-imgur');
var modal_share_general = document.getElementById('modal-share-general');
var modal_share_prompt = document.getElementById('modal-share-prompt');
//modal_share_prompt.style.display = 'block';

// Get the <span> element that closes the modal
var closespan = document.getElementsByClassName('close')[0];
closespan.onclick = function() {
  modal_share_general.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == modal_imgur_upload) {
    modal_imgur_upload.style.display = 'none';
  }
};

function onLoad() {
  tbMain = document.getElementById('tbMain');
  tbMain.style.top = '0';
  tbEditor = document.getElementById('tbEditor');
  tbEditor_Marker = document.getElementById('tbEditor_Marker');
  tbEditor_Shape = document.getElementById('tbEditor_Shape');
  tbShare = document.getElementById('tbShare');

  $('#dlg_editor_text').hide();

  CloseAllToolbars();

  //Set Text Values
  tlbx_main_colour = document.getElementById('tlbx_main_colour');
  text_fontFamily = document.getElementById('text_fontFamily');

  settings.type = 'png';
  settings.quality = 100;
  settings.useImgurAccount = false;
  var parameters = location.search.substring(1).split('&');

  var temp = parameters[0].split('=');
  l = unescape(temp[1]);

  temp = parameters[1].split('=');
  x = unescape(temp[1]);

  document.getElementById('canvas_main').src = l;

  temp = parameters[2].split('=');
  y = unescape(temp[1]);

  temp = parameters[3].split('=');
  w = unescape(temp[1]);

  temp = parameters[4].split('=');
  h = unescape(temp[1]);

  var canvas_main = document.getElementById('canvas_main');

  var context = canvas_main.getContext('2d');
  context.width = '0px';
  context.height = '0px';
  var imageObj = new Image();

  imageObj.onload = function() {
    var sourceX = x;
    var sourceY = y;
    var sourceWidth = w;
    var sourceHeight = h;
    canvas_main.width = w;
    canvas_main.height = h;
    var destWidth = w;
    var destHeight = h;
    var destX = 0;
    var destY = 0;

    canvas_main.style.left = '50%';
    canvas_main.style.top = '50%';
    canvas_main.style.position = 'absolute';
    var lft = '-' + w / 2 + 'px';
    var tp = '-' + h / 2 + 'px';
    canvas_main.style.margin = tp + ' 0 0 ' + lft;

    context.drawImage(
      imageObj,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      destWidth,
      destHeight
    );
    var rect = canvas_main.getBoundingClientRect();
    //console.log(rect.top, rect.right, rect.bottom, rect.left);

    //Fix Top if it's cut off
    if (rect.top < 48) {
      canvas_main.style.top = '63px';
      tp = 0;
    }

    //Fix Left if it's cut off
    if (rect.left < 1) {
      canvas_main.style.left = '15px';
      lft = 0;
    }
    canvas_main.style.margin = tp + ' 0 15 ' + lft;

    //Set Parent Div too expand screen.
    /*
        var div_main = document.getElementById('div_main');
        
	      div_main.style.position = "absolute";
        div_main.style.top = canvas.style.top - 15 + 'px';
        div_main.style.left = canvas.style.left- 15 + 'px';
        div_main.style.width = canvas.width + 30 + 'px';
        div_main.style.height = canvas.height + 30 + 'px';
        console.log(div_main);
        */
    var c = document.getElementById('cntnr');
    c.style.top = canvas_main.style.top;
    c.style.left = canvas_main.style.left;
    c.style.margin = canvas_main.style.margin;

    var url = canvas_main.toDataURL();

    //context.clearRect(0, 0, canvas.width, canvas.height);

    canvas = new fabric.Canvas('c'); // create a rectangle object
    canvas.on('mouse:down', function(options) {
      //console.log(options.e.clientX, options.e.clientY);

      if (options.target) {
        options.target.perPixelTargetFind = true;
        options.target.targetFindTolerance = 4;

        SelectedItem = options.target;
        $('#dlg_editor_text').show();
        $('#dlg_editor_text').draggable();

        //First Hide All Areas
        $('#tlbx_text').hide();

        tlbx_main_colour.value = SelectedItem.fill;
        document.getElementById('tlbx_border_size').value = parseInt(
          SelectedItem.strokeWidth
        );
        //Set Which Items to Show and which too hide.
        switch (SelectedItem.type) {
          case 'i-text':
            $('#tlbx_text').show();
            break;
          case 'path':
            $('#tlbx_text').hide();
            tlbx_main_colour.value = SelectedItem.stroke;
            break;
        }
      } else {
        CloseAllDialogs();
      }
    });

    // Do some initializing stuff
    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: 'rgba(0,153, 255,0.95)',
      cornerColor: 'rgba(255,153,0,0.95)',
      cornerSize: 12,
      padding: 5
    });

    canvas.setHeight(h);
    canvas.setWidth(w);
    canvas.renderAll();
  };
  imageObj.src = l;

  //Get Settings
  chrome.storage.sync.get(
    {
      value_imgType: 'png',
      value_imgQuality: '100%',
      uploadToImgur: false
    },
    function(items) {
      //Only set the settings if they've been saved already.
      if (items.value_imgType !== '') {
        settings.type = items.value_imgType;
        settings.quality = parseInt(items.value_imgQuality);
        settings.useImgurAccount = items.uploadToImgur;
      }
      if (
        settings.useImgurAccount == false ||
        settings.useImgurAccount == true
      ) {
        // do nothing
      } else {
        settings.useImgurAccount = false;
      }
    }
  );
}
$('#dlg_editor_text').show();
$('#dlg_editor_text').draggable();

function CloseAllToolbars() {
  tbEditor.style.top = '-64px';
  tbEditor_Marker.style.top = '-64px';
  tbEditor_Shape.style.top = '-64px';
  tbShare.style.top = '-64px';
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function() {
  //document.querySelector('button').addEventListener('click', clickHandler);
  onLoad();

  document.addEventListener(
    'keydown',
    function(e) {
      if (e.keyCode == 46) {
        //console.log('delete');
        canvas.getActiveObject().remove();
      }
    },
    false
  );

  //Generic Options
  $('#tlbx_main_colour').on('change', function() {
    // fires only after clicking OK

    if (SelectedItem.type == 'path') SelectedItem.stroke = $(this).val();
    else SelectedItem.fill = $(this).val();

    canvas.renderAll();
  });

  //Generic Options
  $('#tlbx_main_opacity').on('change mousemove', function() {
    // fires only after clicking OK
    SelectedItem.opacity = $(this).val() / 100;
    canvas.renderAll();
  });

  //Generic Options
  $('#tlbx_border_colour').on('change', function() {
    // fires only after clicking OK
    SelectedItem.stroke = $(this).val();
    canvas.renderAll();
  });

  //Generic Options
  $('#tlbx_border_size').on('change mousemove', function() {
    // fires only after clicking OK
    SelectedItem.strokeWidth = parseInt($(this).val());
    canvas.renderAll();
  });

  //Text Box Changing
  /****************************************************************/

  //Handler for Font Change
  text_fontFamily.addEventListener(
    'change',
    function() {
      SelectedItem.fontFamily = text_fontFamily.value;
      canvas.renderAll();
    },
    false
  );

  var saveButton = document.getElementById('btn_saveImage');

  // returns the base64 of fabricjs and image layers flattened together.
  function finaliseImg(callback) {
    var canvas_main = document.getElementById('canvas_main');

    var filetype = 'image/png';
    if (settings.type == 'jpeg') {
      filetype = 'image/jpeg';
    }

    //First Create a New Canvas that will have the original base image.
    CanvasToSave = document.createElement('canvas');

    //Now Get the canvas of the Fabric.js Canvas
    canvas.deactivateAll().renderAll();

    CanvasToSave.width = canvas_main.width;
    CanvasToSave.height = canvas_main.height;

    var xi = canvas_main.width;
    var yi = canvas_main.height;
    //Create a New Image
    var imgToSave = new Image();
    imgToSave.onload = function() {
      //Now get the Canvas Contaxt.
      var ctxToSave = CanvasToSave.getContext('2d');

      //Save the Original Canvas into this one.
      ctxToSave.drawImage(canvas_main, 0, 0, xi, yi);

      var TempCanvas = document.createElement('canvas');
      var img = new Image();
      img.onload = function() {
        var ctx1 = CanvasToSave.getContext('2d');
        ctx1.drawImage(img, 0, 0, xi, yi);

        var image = CanvasToSave.toDataURL(filetype, settings.quality);

        // call the passed in callback
        callback(image);
      };
      img.src = canvas.toDataURL(filetype, settings.quality);
    };
    imgToSave.src = canvas_main.toDataURL(filetype, settings.quality);
  }

  saveButton.onclick = function() {
    finaliseImg(saveImgToDisk);
  };

  //Main Toolbar Button Events
  /****************************************************************************/
  //START EDITOR button
  document.getElementById('btn_startEditor').onclick = function() {
    tbEditor.style.top = '0px';

    tbMain.style.top = '-64px';
  }; //CLOSE EDITOR button
  document.getElementById('btn_closeEditor').onclick = function() {
    CloseAllToolbars();
    tbMain.style.top = '0px';
    canvas.isDrawingMode = false;
  };

  document.getElementById('btn_shareImage').onclick = function() {
    CloseAllToolbars();
    tbShare.style.top = '0px';
    tbMain.style.top = '-64px';
  };

  // recursively check if the background script has recieved the token
  function getPlatformAuthToken(platform, onRecieved) {
    setTimeout(function() {
      chrome.runtime.sendMessage(
        {
          name: 'msg.' + platform + '.hasToken'
        },
        function(result) {
          if (result.hasToken) {
            onRecieved(result.token);
          } else {
            getPlatformAuthToken(platform, onRecieved);
          }
        }
      );
    }, 50);
  }

  document.getElementById('btn_shareTooImgur').onclick = function() {
    modal_imgur_upload.style.display = 'block';

    document.getElementById('div-uploading').style.display = 'block';
    document.getElementById('div-sucess').style.display = 'none';
    document.getElementById('div-error').style.display = 'none';

    document.getElementById('model_imgur_title').innerHTML =
      'Authenticating with Imgur';
    document.getElementById('progressbar_text').innerHTML = 'Authenticating';

    setTimeout(function() {
      uploadImgToImgur(function(result) {
        // get the image path
        var path = 'https://imgur.com/' + result.data.id;

        // get the
        document.getElementById('model_imgur_title').innerHTML = 'All Done!';
        document.getElementById('progressbar_text').innerHTML = 'Success!';
        document.getElementById('div-uploading').style.display = 'none';
        document.getElementById('div-sucess').style.display = 'block';

        document.getElementById('success_text').href = path;
        document.getElementById('success_text').innerHTML =
          'imgur.com/' + result.data.id;

        setTimeout(function() {
          window.open(path);
        }, 700);
      });
    }, 250);
  };
  var uploadResults = null;
  // this function assumes theres a valid token and uploadCollection the image to imgur
  function uploadImage(callback) {
    // no sense in reuploading an image if it's already been uploaded
    if (uploadResults != null) {
      callback(uploadResults);
    } else {
      document.getElementById('model_imgur_title').innerHTML =
        'Uploading to Imgur';
      document.getElementById('progressbar_text').innerHTML = 'Uploading';
      // finalise the img
      finaliseImg(function(imgsrc) {
        // now upload the image to imgur
        uploader.uploadImg(
          imgsrc.replace(/.*,/, ''),
          function(result) {
            //
            if (result.success == true) {
              uploadResults = result;
              callback(result);
            } else {
              alert(
                'Error uploading image.\nCheck the console for more details.'
              );
            }
          },
          'Uploaded with Capture Crop Create',
          '#ThreeC #CaptureCropCreate'
        );
      });
    }
  }
  // uploadCollection an image to the active imgur account
  function uploadImgToImgur(callback) {
    // now finally get the imgur auth token
    setTimeout(function() {
      if (uploader.token == '') {
        uploader.requestAuthToken();

        // the request has been sent, now start the listener
        getPlatformAuthToken('imgur', function(token) {
          // set the auth token
          uploader.setAuthToken(token);
          uploadImage(callback);
        });
      } else {
        uploadImage(callback);
      }
    }, 250);
  }

  function showShareModal() {
    modal_share_general.style.display = 'block';
    document.getElementById('modal_share_uploading').style.display = 'block';
    document.getElementById('modal_share_success').style.display = 'none';
  }
  function onShareSuccess() {
    modal_share_general.style.display = 'block';
    document.getElementById('modal_share_uploading').style.display = 'none';
    document.getElementById('modal_share_success').style.display = 'block';
  }

  function shareImage(onUploadCallback) {
    // add img to img collection
    if (settings.useImgurAccount) {
      onUploadCallback();
    } else {
      modal_share_prompt.style.display = 'block';
      $('#btn_useImgur').click(function() {
        settings.useImgurAccount = true;
        chrome.storage.sync.set(
          {
            uploadToImgur: settings.useImgurAccount
          },
          function() {
            onUploadCallback();
            modal_share_prompt.style.display = 'none';
          }
        );
      });
      $('#btn_dontUseImgur').click(function() {
        modal_share_prompt.style.display = 'none';
      });
    }
  }

  document.getElementById('btn_postToTwitter').onclick = function() {
    shareImage(function() {
      showShareModal();
      uploadImgToImgur(function(result) {
        var share = new postr();
        share.toTwitter(
          'this is a new tweet!',
          '3c,capturecropcreate,virtexedge',
          'https://imgur.com/' + result.data.id
        );
        onShareSuccess();
      });
    });
  };
  document.getElementById('btn_postToFacebook').onclick = function() {
    shareImage(function() {
      showShareModal();
      uploadImgToImgur(function(result) {
        var share = new postr();
        share.toFacebook(
          'https://imgur.com/' + result.data.id,
          result.data.link
        );
        onShareSuccess();
      });
    });
  };

  document.getElementById('btn_postToPinterest').onclick = function() {
    shareImage(function() {
      showShareModal();
      uploadImgToImgur(function(result) {
        var share = new postr();
        share.toPinterest(
          'hello pinterest! #capturecropcreate #threeC',
          'https://imgur.com/' + result.data.id,
          result.data.link
        );
        onShareSuccess();
      });
    });
  };
  document.getElementById('btn_postToReddit').onclick = function() {
    shareImage(function() {
      showShareModal();
      uploadImgToImgur(function(result) {
        var share = new postr();
        share.toReddit(
          'shareing to reddit',
          'https://imgur.com/' + result.data.id,
          result.data.link
        );
        onShareSuccess();
      });
    });
  };

  document.getElementById('btn_closeShare').onclick = function() {
    CloseAllToolbars();
    tbMain.style.top = '0px';
    canvas.isDrawingMode = false;
  };

  //Editor Marker Toolbar Button Events
  /****************************************************************************/
  //START EDITOR MARKER button
  document.getElementById('btn_editor_marker').onclick = function() {
    CloseAllToolbars();
    tbEditor_Marker.style.top = '0px';
  };
  document.getElementById('btn_editor_marker_pencil').onclick = function() {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 1;
  };
  document.getElementById('btn_editor_marker_brush').onclick = function() {
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
  };

  //CLOSE EDITOR MARKER button
  document.getElementById('btn_editor_marker_close').onclick = function() {
    CloseAllToolbars();
    tbEditor.style.top = '0px';
    canvas.isDrawingMode = false;
  };

  //Shape Toolbar Button Events
  /****************************************************************************/
  document.getElementById('btn_editor_shape').onclick = function() {
    CloseAllToolbars();
    tbEditor_Shape.style.top = '0px';
  };

  document.getElementById('btn_editor_shape_line').onclick = function() {
    // create a line object
    var line = new fabric.Line([0, 0, 120, 0], {
      left: 10,
      top: 10,
      stroke: 'rgba(0,0,0,1)',
      strokeWidth: 5
    });

    line.perPixelTargetFind = true;
    line.targetFindTolerance = 4;

    // "add" line onto canvas
    canvas.add(line);
  };

  document.getElementById('btn_editor_shape_circle').onclick = function() {
    // create a circle object
    var circ = new fabric.Circle({
      left: 10,
      top: 10,
      radius: 100,
      fill: 'lightblue',
      stroke: 'rgba(0,0,0,1)',
      strokeWidth: 2
    });

    circ.perPixelTargetFind = true;
    circ.targetFindTolerance = 4;

    // "add" circle onto canvas
    canvas.add(circ);
  };

  document.getElementById('btn_editor_shape_sqaure').onclick = function() {
    // create a rectangle object
    var rect = new fabric.Rect({
      left: 10,
      top: 10,
      fill: 'red',
      width: 200,
      height: 200,
      stroke: 'rgba(0,0,0,1)',
      strokeWidth: 2
    });

    // "add" rectangle onto canvas
    canvas.add(rect);
  };

  document.getElementById('btn_editor_shape_triangle').onclick = function() {
    // create a rectangle object
    var tri = new fabric.Triangle({
      left: 10,
      top: 10,
      fill: 'red',
      width: 200,
      height: 200,
      stroke: 'rgba(0,0,0,1)',
      strokeWidth: 2
    });

    // "add" rectangle onto canvas
    canvas.add(tri);
  };

  //CLOSE Shape MARKER button
  document.getElementById('btn_editor_shape_close').onclick = function() {
    CloseAllToolbars();
    tbEditor.style.top = '0px';
  };

  //Text Toolbar Button Events
  /****************************************************************************/
  document.getElementById('btn_editor_text').onclick = function() {
    //First Disable DrawingMode just incase.
    canvas.isDrawingMode = false;

    var newText = new fabric.IText('New Text', {
      fontFamily: 'Impact',
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
      shadow: 'rgba(0,0,0,0.3) 5px 5px 5px'
    });

    newText.on('selected', function() {
      CloseAllDialogs();

      SelectedItem = newText;
      text_fontFamily.value = SelectedItem.fontFamily;
      $('#dlg_editor_text').show();
    });

    canvas.add(newText);
  };

  document.getElementById('btn_moveBackwards16').onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendBackwards(activeObject);
    }
  };

  document.getElementById('btn_moveToBack16').onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.sendToBack(activeObject);
    }
  };

  document.getElementById('btn_moveForward16').onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringForward(activeObject);
    }
  };

  document.getElementById('btn_moveToFront16').onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.bringToFront(activeObject);
    }
  };

  $('#btn_review').click(function() {
    window.open(
      'https://chrome.google.com/webstore/detail/3c-cut-crop-capture/mjcdmlibiooblijamnolhajjigcmhglp/reviews'
    );
  });
  //Help button
  document.getElementById('btn_help').onclick = function() {
    window.open(
      'https://github.com/VirtexEdgeDesign/3C-Crop-Capture-Create/wiki/FAQ'
    );
  };

  //Settings Button
  document.getElementById('btn_settings').onclick = function() {
    chrome.runtime.openOptionsPage(function() {
      console.log('Done!');
    });
  };

  //About Button
  document.getElementById('btn_about').onclick = function() {
    window.open(
      'https://virtexedgedesign.wordpress.com/3c-crop-capture-create/'
    );
  };

  //Virtex Button
  document.getElementById('btn_vrtx').onclick = function() {
    window.open('https://virtexedgedesign.wordpress.com/');
  };
});

window.onload = function() {};

var contentURL = '';
function saveImgToDisk(dataURI) {
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

  var fileExt = '.png';
  if (settings.type == 'jpeg') {
    fileExt = '.jpeg';
  }

  name = '3Cscreencapture' + name + '-' + Date.now() + fileExt; //'.png';

  function onwriteend() {
    // open the file that now contains the blob
    var filesString =
      'filesystem:chrome-extension://' +
      chrome.i18n.getMessage('@@extension_id') +
      '/temporary/' +
      name;
    var link = document.createElement('a');

    link.download = name;

    link.href = filesString;
    link.click();
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

function CloseAllDialogs() {
  $('#dlg_editor_text').hide();
}
