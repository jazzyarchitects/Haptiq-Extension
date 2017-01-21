"use strict";

let socket = io.connect("http://52.25.225.108");

/* Get unique id of extension  if not exists */
let __chrome_unique_id = undefined;
chrome.storage.local.get('__chrome_unique_id', (data)=>{
  if(data.__chrome_unique_id===undefined){
    socket.emit('join', {});
  }else{
    __chrome_unique_id = data.__chrome_unique_id;
    socket.emit('join', {
      id: __chrome_unique_id
    });
  }
});


socket.on('join-with', (data)=>{
  chrome.storage.local.set({'__chrome_unique_id': data});
  __chrome_unique_id = data;
  socket.emit('join', {
      id: __chrome_unique_id
    });
});

socket.on('pairing', (data)=>{
  console.log("pairing received");
  if(data.chromeId !== __chrome_unique_id){
    return;
  }
  chrome.storage.local.set({
    __chrome_unique_id: __chrome_unique_id,
    __phone_fcm_id: data.fcmId,
    __phone_unique_id: data.phoneId
  });
});

/* End of getting unique id */

chrome.extension.onConnect.addListener((port)=>{
  if(port.name==='PairingInquirer'){
    chrome.storage.local.get((data)=>{
      port.postMessage({
        isPaired: !(!data.__phone_unique_id || !data.__phone_fcm_id),
        __chrome_unique_id: __chrome_unique_id
      });
    });
    port.onMessage.addListener((msg)=>{
      // console.log(msg);
    });
  }
});
