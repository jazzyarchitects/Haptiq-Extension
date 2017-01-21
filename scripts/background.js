"use strict";

let socket = io.connect("http://52.25.225.108");

/* Get unique id of extension  if not exists */
let __chrome_unique_id = undefined;
chrome.storage.local.get('__chrome_unique_id', (data)=>{
  console.log("Stored __chrome_unique_id: "+JSON.stringify(data));
  if(data.__chrome_unique_id===undefined){
    socket.emit('join', {});
  }else{
    __chrome_unique_id = data.__chrome_unique_id;
  }
});


socket.on('join-with', (data)=>{
  chrome.storage.local.set({'__chrome_unique_id': data});
  __chrome_unique_id = data;
});

/* End of getting unique id */

chrome.extension.onConnect.addListener((port)=>{
  if(port.name==='PairingInquirer'){
    chrome.storage.local.get((data)=>{
      port.postMessage({isPaired: (data.fcmId !== null && data.phoneId !== null)});
    });
    port.onMessage.addListener((msg)=>{
      // console.log(msg);
    });
  }
});
