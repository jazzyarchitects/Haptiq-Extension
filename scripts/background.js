"use strict";

let socket = io.connect("http://52.25.225.108");

/* Get unique id of extension  if not exists */
chrome.storage.local.get('__chrome_unique_id', (data)=>{
  console.log("Stored __chrome_unique_id: "+JSON.stringify(data));
  if(data.__chrome_unique_id===undefined){
    socket.emit('join', {});
  }
});


socket.on('join-with', (data)=>{
  console.log("Got unique id: "+ data);
  chrome.storage.local.set({'__chrome_unique_id': data});
});

/* End of getting unique id */

chrome.extension.onConnect.addListener((port)=>{
  console.log(port);
});
