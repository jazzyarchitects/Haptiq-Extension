"use strict";


let url = window.location.hostname;
let useridField, passwordField, submitButton, imageButton;

let __chrome_unique_id, __phone_fcm_id, __phone_unique_id;
let targetForm = null;
let shouldShow = true;

chrome.storage.local.get((data)=>{
  console.log(data);
  __chrome_unique_id = data.__chrome_unique_id;
  __phone_fcm_id = data.__phone_fcm_id;
  __phone_unique_id = data.__phone_unique_id;

  if(__phone_fcm_id!==undefined){
    if(document.getElementById("imageAuthenticationStatus")===undefined || document.getElementById("imageAuthenticationStatus")===null){
      return;
    }
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
function draw(skip){
  console.log("skip: "+skip);
  skip = skip || 0;
  let forms = document.getElementsByTagName('form');
  console.log(forms);

  if(forms.length<=0){
    setTimeout(draw, 2000);
    return;
  }

  targetForm = forms[0];

  if(skip>=forms.length){
    return;
  }

  for(let i=skip;i<forms.length;i++){
    console.log(forms[i]);
    if(!forms[i].name){
      forms[i].name = "";
    }
    console.log(typeof(forms[i].name));
    let id = forms[i].getAttribute("id") || "";
    if(( forms[i].name && typeof(forms[i].name)!=="object" && forms[i].name.toLowerCase().indexOf("login")!==-1) ||
      (forms[i].name && typeof(forms[i].name)!=="object" && forms[i].name.toLowerCase().indexOf("signin")!==-1) ||
      forms[i].className.toLowerCase().indexOf("login")!==-1 ||
      id.toLowerCase().indexOf("login") !== -1){
      targetForm = forms[i];
      break;
    }
  }

  console.log(targetForm);
  // get username field
  useridField = targetForm.querySelectorAll("input[type='text'], input[type='email']");
  console.log("User field");
  console.log(useridField);
  if(useridField.length<1){
    return draw(skip+1);
  }

  if(useridField.length >= 1){
    useridField = useridField[0];
  }


  // get password fields
  passwordField = targetForm.querySelectorAll("input[type='password']");
  console.log("Password field");
  console.log(passwordField);

  if(passwordField.length<1){
    shouldShow = false;
    return draw(skip+1);
  }

  if(passwordField.length >= 1){
    passwordField = passwordField[0];
  }

  //test
  // useridField.value = "jibinmathews7@gmail.com";
  // passwordField.value = "123456789";

  submitButton = targetForm.querySelectorAll("input[type='submit'], button[type='submit']");
  console.log(submitButton);


  if(submitButton.length<=0){
    let submitButton = targetForm.querySelectorAll("button");
  }

  let submitButtonHolder = submitButton[0].parentNode;

  // console.log(submitButton[0].clientHeight);

  imageButton = document.createElement('img');
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

    imageButton.addEventListener('click', ()=>{
      chrome.runtime.sendMessage({
        type: "request-authentication",
        url: url
      });
    });

  if(document.location.pathname.indexOf("search")===-1 && shouldShow){
    if(document.getElementById("imageAuthenticationStatus")!==undefined){
      document.body.appendChild(imageButton);
    }
  }
}


draw();

document.body.addEventListener('click', ()=>{
  console.log("draw");
  draw();
});

// chrome.extension.onMessage.addListener((request, sender)=>{
//   let object = request.message;
//   console.log(request);
//   console.log(object);
//   if(!object.userId || !object.password){
//     return;
//   }
//   useridField.value = object.userid;
//   passwordField.value = object.password;
//   submitButton[0].click();
// });

chrome.runtime.onMessage.addListener((request, sender)=>{
  console.log("Runtime");
  let object = request.message;
  console.log(request);
  // console.log(object);
  // if(!object.userid || !object.password){
  //   return;
  // }
  useridField.value = request.userid;
  passwordField.value = request.password;
  submitButton[0].disabled = false;
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
