"use strict";

let isPaired = false;

const allowed = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567980!@#$%^&*()_+-={}[]<>|";

function randomString(length){
  let result="";
  for(let i=length;i>0;i--){
    result = result + allowed[Math.floor(Math.random()*allowed.length)];
  }
  return result;
}


function change(){
  if(isPaired){
    let elements = document.getElementsByClassName("notPaired");
    for(let i=0;i<elements.length;i++){
      elements[i].remove();
    }
    return;
  }

  let code = randomString(32);
  console.log(code);
  document.getElementById("qrcode").innerHTML = null;
  let qrcode = new QRCode(document.getElementById("qrcode"), {
    width : 150,
    height : 150,
    colorDark:"#000000",
    colorLight:"#ffffff"
  });
  qrcode.makeCode(code);

  // Remove title tooltip when hovered over
  document.getElementById("qrcode").removeAttribute("title");

  setTimeout(change, 5*1000);
}

function startShowingQRCode(){
  change();
}

// Call qr generator after DOM loading
setTimeout(startShowingQRCode, 0);

let popup =
