"use strict";

// let socket = io.connect("http://52.25.225.108");
let socket = io.connect("",{
  // TODO:  Remove this in production
  reconnection : false
});

let PortBroadcast = undefined;
let ContentBroadcast = undefined;


/* Get unique id of extension  if not exists */
let __chrome_unique_id = undefined;
let __storage = undefined;
chrome.storage.local.get((data)=>{
  // console.log(data);
  __storage = data;
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
    __phone_fcm_id: data.fcm,
    __phone_unique_id: data.phoneId
  });
  PortBroadcast.postMessage({
    isPaired: true,
    __chrome_unique_id: __chrome_unique_id
  })
});

let packets = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
  console.log(request);
  if(request.type==="request-authentication"){
    if(!__storage.__phone_fcm_id){
      chrome.storage.local.get((data)=>{
        __storage = data;
        socket.emit('initiate-authentication', {
      fcm: __storage.__phone_fcm_id,
      url: request.url,
      chromeId: __storage.__chrome_unique_id
    });
      });
    }else{

    socket.emit('initiate-authentication', {
      fcm: __storage.__phone_fcm_id,
      url: request.url.split(".")[1],
      chromeId: __storage.__chrome_unique_id
    });
    }
  }
});
/* End of getting unique id */

chrome.extension.onConnect.addListener((port)=>{
  if(port.name==='PairingInquirer'){
    PortBroadcast = port;
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

socket.on('mobile-authentication', (data)=>{

});


// Clear cookies when first installed
chrome.runtime.onInstalled.addListener(()=>{
  // let newURL = "chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/static/front.html";
  // chrome.tabs.create({url: newURL});
});

// encryptPassword("abcdef");

// console.log(Random.getMobileField());