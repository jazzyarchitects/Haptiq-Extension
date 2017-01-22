"use strict";


let url = window.location.hostname;

let __chrome_unique_id, __phone_fcm_id, __phone_unique_id;
let targetForm = null;
let shouldShow = true;

chrome.storage.local.get((data)=>{
  console.log(data);
  __chrome_unique_id = data.__chrome_unique_id;
  __phone_fcm_id = data.__phone_fcm_id;
  __phone_unique_id = data.__phone_unique_id;

  if(__phone_fcm_id!==undefined){
    document.getElementById("imageAuthenticationStatus").setAttribute("src", "chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/images/authenticated48.png");
    document.getElementById("imageAuthenticationStatus").addEventListener('click', ()=>{
      chrome.runtime.sendMessage({
        type: "request-authentication",
        url: url
      });
    });
  }

});


//get form element
function draw(){
  let forms = document.getElementsByTagName('form');
  console.log(forms);
  targetForm = forms[0];

  for(let i=0;i<forms.length;i++){
    console.log(forms[i]);
    if(forms[i].name.toLowerCase().indexOf("login")!==-1 ||
      forms[i].name.toLowerCase().indexOf("signin")!==-1 ||
      forms[i].className.toLowerCase().indexOf("login")!==-1){
      targetForm = forms[i];
      break;
    }
  }

  // get username field
  let useridField = targetForm.querySelectorAll("input[type='text'], input[type='email']");

  if(useridField.length<1){
    return;
  }

  if(useridField.length >= 1){
    useridField = useridField[0];
  }


  // get password fields
  let passwordField = targetForm.querySelectorAll("input[type='password']");
  console.log(passwordField);

  if(passwordField.length<1){
    shouldShow = false;
    return;
  }

  if(passwordField.length >= 1){
    passwordField = passwordField[0];
  }

  //test
  useridField.value = "jibinmathews7@gmail.com";
  passwordField.value = "123456789";

  let submitButton = targetForm.querySelectorAll("input[type='submit'], button[type='submit']");
  console.log(submitButton);

  let submitButtonHolder = submitButton[0].parentNode;

  // console.log(submitButton[0].clientHeight);

  let imageButton = document.createElement('img');
  let src = "chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/images/authenticated48.png";
  if(__phone_fcm_id===undefined){
    src = "chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/images/unauthenticated48.png";
  }
  imageButton.setAttribute("src", src);
  imageButton.setAttribute("id", "imageAuthenticationStatus");
  imageButton.setAttribute("title", "Haptiq Login");
  imageButton.style["z-index"] = 99999;
  imageButton.style.position = "absolute";
  console.log(getOffset(submitButton[0]).left);
  console.log(submitButton[0].clientWidth);
  imageButton.style.left = (getOffset(submitButton[0]).left + submitButton[0].clientWidth+3)+"px";
  imageButton.style.top = getOffset(submitButton[0]).top+"px";
  imageButton.style["border-radius"] = "5px";
  imageButton.style.border = "1px solid rgba(255,255,255,0.3)";
  imageButton.style.height = submitButton[0].clientHeight+"px";
  imageButton.style.cursor = "pointer";

  if(__phone_fcm_id!==undefined && shouldShow){
    imageButton.addEventListener('click', ()=>{
      chrome.runtime.sendMessage({
        type: "request-authentication",
        url: url
      });
    });
  }

  if(document.location.pathname.indexOf("search")===-1 && shouldShow){
    if(document.getElementById("imageAuthenticationStatus")!==undefined){
      document.body.appendChild(imageButton);
    }
  }
}


draw();

document.addEventListener('click', ()=>{
  draw();
});

chrome.runtime.onMessage.addListener((request, sender)=>{
  let object = request.message;
  if(!object.userId || !object.password){
    return;
  }
  useridField.value = object.userId;
  passwordField.value = object.password;
  submitButton[0].click();
});


  // submi.tButton[0].click();


// });

function getOffset(el) {
  el = el.getBoundingClientRect();
  console.log(el);
  return {
    left: el.left,
    top: el.top + window.scrollY
  }
}
