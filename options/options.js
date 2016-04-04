// Saves options to chrome.storage
function save_options() {
  
  //Img Type and Quality
  var imgType = document.getElementById('img_type_combobox').value;
  var imgQuality = document.getElementById('img_quality_combobox').value;
  
  chrome.storage.sync.set({
    value_imgType: imgType,
    value_imgQuality: imgQuality
  }, function() {
    
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    
    status.textContent = 'Options saved.';
    
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  
  // Use default value color = 'Entire Page' and likesColor = true.
  chrome.storage.sync.get({
    value_imgType: 'png',
    value_imgQuality: '100%'
  }, function(items) {
    document.getElementById('img_type_combobox').value = items.value_imgType;
    document.getElementById('img_quality_combobox').value = items.value_imgQuality;
  
});
  
  
//First Set up Event Listeners To Catch Variable Changes
//document.getElementById('auto_capture_checkbox').addEventListener('change', changeHandler);
document.getElementById('save').addEventListener('click', save_options);

  
  
  //Do Conditional Processing
  //changeHandler();
}


document.addEventListener('DOMContentLoaded', restore_options);


    
function changeHandler(){
  //console.log(document.getElementById('auto_capture_checkbox').checked);
  if(document.getElementById('auto_capture_checkbox').checked===true){
    document.getElementById("auto_capture_combobox").disabled=false;
  }
  else{
    document.getElementById("auto_capture_combobox").disabled=true;
  }
}