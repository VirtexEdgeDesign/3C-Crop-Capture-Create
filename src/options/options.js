var uploadsCollection = {};

// Saves options to chrome.storage
function save_options() {
  //Img Type and Quality
  var imgType = document.getElementById('img_type_combobox').value;
  var imgQuality = document.getElementById('img_quality_combobox').value;

  chrome.storage.sync.set(
    {
      value_imgType: imgType.trim(),
      value_imgQuality: imgQuality.trim(),
      uploadToImgur: document.getElementById('chkbx_useImgur').checked
    },
    function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 1000);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // set default values and set values if available
  chrome.storage.sync.get(
    {
      value_imgType: 'png',
      value_imgQuality: '100%',
      uploadToImgur: false
    },
    function(items) {
      console.log(items);
      document.getElementById('img_type_combobox').value = items.value_imgType;
      document.getElementById('img_quality_combobox').value =
        items.value_imgQuality;
      document.getElementById('chkbx_useImgur').checked = items.uploadToImgur;
      // set combo box status
      imgTypeChangeHandler();

      // upload to imgur when sharing elsewhere?
      uploadToImgur: true;
    }
  );
  //First Set up Event Listeners To Catch Variable Changes
  document
    .getElementById('img_type_combobox')
    .addEventListener('change', imgTypeChangeHandler);
  document.getElementById('save').addEventListener('click', save_options);

  //Do Conditional Processing
  //changeHandler();
}

document.addEventListener('DOMContentLoaded', restore_options);

function imgTypeChangeHandler() {
  if (document.getElementById('img_type_combobox').value === 'jpeg ') {
    document.getElementById('img_quality_combobox').disabled = false;
  } else {
    document.getElementById('img_quality_combobox').disabled = true;
  }
}
window.onload = function(e) {
  console.log('loaded');
};
