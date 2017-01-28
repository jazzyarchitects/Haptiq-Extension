"use strict";

let isPaired = false;
let __chrome_unique_id = undefined;








let backgroundCommunicator = chrome.extension.connect({
  name: 'PairingInquirer'
});

backgroundCommunicator.postMessage('fetchPairingStatus');
backgroundCommunicator.onMessage.addListener((data)=>{
  console.log("Popup Message Receieved:");
  console.log(data);
  isPaired = data.isPaired;
  __chrome_unique_id = data.__chrome_unique_id;
  
  change();
});




function change(){
  if(isPaired){
    removeClassElements("notPaired");
    return;
  }else{
    removeClassElements("paired");
  }

  if(__chrome_unique_id===undefined){
    setTimeout(change, 0.5*1000);
  }

  document.getElementById("qrcode").innerHTML = null;
  let qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 150,
    height : 150,
    colorDark:"#000000",
    colorLight:"#ffffff"
  });
  qrcode.makeCode(JSON.stringify({
    chromeId: __chrome_unique_id,
    secretKey: code
  }));

  // Remove title tooltip when hovered over
  document.getElementById("qrcode").removeAttribute("title");

  setTimeout(change, 30*1000);
}

function startShowingQRCode(){
  change();
}

// Call qr generator after DOM loading
setTimeout(startShowingQRCode, 0);




function removeClassElements(className){
  let elements = document.getElementsByClassName(className);
  for(let i = 0; i < elements.length; i++){
    elements[i].remove();
  }
}
