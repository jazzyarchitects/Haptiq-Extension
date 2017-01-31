"use strict";

// let socket = io.connect("http://52.25.225.108");
let socket = io.connect("",{
  // TODO:  Remove this in production
  reconnection : false
});


/* 
*   Variable declaration 
*/
let __chrome_unique_id = undefined;
let __storage = undefined;
let secret = {};
let QRPopup = undefined;



/*
* Helper function declarations
*/
const getStorage = ()=>{
  return new Promise((resolve)=>{
    chrome.storage.local.get((data)=>{
      console.log("Storage");
      console.log(data);
      resolve(data);
    });
  });
};

const setStorage = (object)=>{
  chrome.storage.local.set(object);
};

const requestAuthentication = (url)=>{
  socket.emit('initiate-authentication', {
    chromeId: __storage.__chrome_unique_id,
    fcm: __storage.__phone_fcm_id,
    url: url
  });
};

/* 
* Initial Connection
* ================== 
* Connect to socket server with assigned chromeId.
* If not assigned then request is from the server.
* Reconnect when assigned
*/

getStorage()
.then((data)=>{
  __storage = data;
  // If chrome id is not assigned, get it from server. Else connect to server with assigned chromeid
  if(data.__chrome_unique_id===undefined){
    socket.emit('join', {});
  }else{
    __chrome_unique_id = data.__chrome_unique_id;
    socket.emit('join', {
      id: __chrome_unique_id
    });
  }
})

socket.on('join-with', (data)=>{
  setStorage({'__chrome_unique_id': data});

  __chrome_unique_id = data;

  // Reconnect with server with assigned chromeid
  socket.emit('join', {
    id: __chrome_unique_id
  });
});


/*
*  Pairing Phone and Chrome Extension
*  ==================================
*  Generate a barcode with chromeId as data and a (secret key to authorize pairing request via server).
*  When chrome receives pairing request from phone, check secret key to see if request authenticated.
*  if authenticated, store FCMid and Phoneid in storage.
*  Send a set of random field names to phone which will be used to send password from android to chrome over socket and store this in localstorage.
*  Pairing complete
*/
chrome.extension.onConnect.addListener((popup)=>{
  if(popup.name==='PairingInquirer'){

    // Send QR code and secret to popup if not paired
    getStorage()
    .then((data)=>{
      let isPaired = !(!data.__phone_unique_id || !data.__phone_fcm_id);
      __storage = data;
      __storage.isPaired = isPaired;
      if(!isPaired){
        let secretKey = Random.getQRCode();
        console.log('Secret Key: '+secretKey);
        secret.pairingSecret = secretKey;
        popup.postMessage({
          isPaired: isPaired,
          __chrome_unique_id: __chrome_unique_id,
          secret: secretKey
        });
      }else{
        popup.postMessage({
          isPaired: true
        });
      }
    });
    QRPopup = popup;

  }
});

socket.on('pairing', (data)=>{
  if(data.secretKey !== secret.secretKey){
    return socket.emit('error', {
      when: 'Pairing',
      what: 'Secret Key does not match'
    });
  }
  setStorage({
    __phone_fcm_id: data.fcm,
    __phone_unique_id: data.phoneId
  });
  __storage.__phone_unique_id = data.phoneId;
  __storage.__phone_fcm_id = data.fcm;
  QRPopup.postMessage({
    event: 'Pairing complete'
  });
  sendFieldsToPhone();
});

function sendFieldsToPhone(){
  let password1 = Random.getMobileField();
  let password2 = Random.getMobileField();
  let user1 = Random.getMobileField();
  let rp1 = Random.getMobileField();
  let rp2 = Random.getMobileField();
  let ru = Random.getMobileField();

  socket.emit('gift', {
    'first': password1,
    'second': password2,
    'uFirst': user1,
    'gift1': rp1,
    'gift2': rp2,
    'gift3': ru
  });

  setStorage({
    'oY2m6Bac': password1,
    'Ly9VU7JW': password2,
    'yjAmV49M': uFirst,
    'ki8vgYK6': rp1,
    'hPvCQW4h': rp2,
    'e2s7Xlbm': ru
  });
}



/*
* Mobile Authentication
* =====================
* Whenever a content script requests authentication, send an authentication event to Server to send FCM to phone.
* Receive password from phone.
* Decrypt password 
* Send to content script along with userid
*/
chrome.runtime.onMessage.addListener((request, sender, response)=>{
  if(request.type === 'request-authentication'){
    if(!__storage.__phone_fcm_id){
      getStorage()
      .then((data)=>{
        __storage = data;
        requestAuthentication();
      });
    }else{
      requestAuthentication();
    }
  }
});

socket.on('mobile-authentication', (data)=>{
  getStorage((storage)=>{
    let packet = Auth.decodePassword(storage['oY2m6Bac'], storage['Ly9VU7JW'], storage['yjAmV49M'], data);

    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
      chrome.tabs.sendMessage(tabs[0].id, packet, (response)=>{
        // Nothing here still
      });
    });
  });
});


/*
* Encryption
* ==========
* Encrypt userid and password
* Send them using secret keys sent during mobile pairing
*/

chrome.runtime.onMessage.addListener((request, sender, response)=>{
  if(request.type === 'encryption'){
    getStorage()
    .then((storage)=>{
      let auth = Auth.encodePacket(request.password, request.userid);
      let data = {
        chromeId: storage.__chrome_unique_id,
        fcmId: storage.__phone_fcm_id,
        phoneId: storage.__phone_unique_id
      };
      data[storage['ki8vgYK6']] = auth.p1;
      data[storage['hPvCQW4h']] = auth.p2;
      data[storage['e2s7Xlbm']] = auth.u;
      socket.emit('gift2', data);
    });
  }
});




/*
* Installation Scripts
* ====================
* Function to execute on first installation 
*/
chrome.runtime.onInstalled.addListener(()=>{
  // let newURL = "chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/static/front.html";
  // chrome.tabs.create({url: newURL});
});
