"use strict";

const SECRET = '!#bbdkQE3749&DN'

function _decryptPackets(packet1, packet2){
  let password = "";
  let key = "";

  let userId = packet1.userId;

  let first = undefined, second = undefined;

  let a = Number(packet1.password[0]);

  // Determine the packet order
  if(a%2===0){
    first = packet1; // password starts with this
    second = packet2; // key starts with this
  }else{
    first = packet2;
    second = packet1;
  }

  // Remove determining digit
  first.password = first.password.substr(1, first.password.length);
  first.key = first.key.substr(1, first.key.length);

  second.password = second.password.substr(1, second.password.length);
  second.key = second.key.substr(1, second.key.length);

  for(let i=0;;){
    if(first.password[i]!==undefined){
      password += first.password[i];
    }
    if(second.password[i]!==undefined){
      password += second.password[i];
    }
    if(first.password[i]===undefined && second.password[i]===undefined){
      break;
    }
    i++;
  }

  console.log("password:" +password);

  for(let i=0;;){
    if(second.key[i]!==undefined){
      key += second.key[i];
    }
    if(first.password[i]!==undefined){
      key += first.key[i];
    }
    if(first.key[i]===undefined && second.key[i]===undefined){
      break;
    }
    i++;
  }

  console.log("key: "+key);

  let decryptedKey = CryptoJS.AES.decrypt(key, SECRET);

  var object = JSON.parse(decryptedKey.toString(CryptoJS.enc.Utf8));
    console.log(object);

  let decryptedPassword = CryptoJS.AES.decrypt(password, decryptedKey);

  return decryptedPassword;

}


function encryptPassword(password){
  console.log(password);
  let crypted = CryptoJS.AES.encrypt(password, "123456789");
  console.log(crypted.toString());
  decryptPassword(crypted.toString());
}

function decryptPassword(password){
  console.log(password);
  let decrypted = CryptoJS.AES.decrypt(password, "123456789");
  console.log(decrypted.toString(CryptoJS.enc.Utf8));
}