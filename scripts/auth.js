"use strict";

class Auth{

  static encodePacket(password, userid){
    let part1 = "";
    let part2 = "";

    let encrypted = Crypto.encryptPassword(password);

    for(let i = 0;i<encrypted.length;i++){
      if(Math.floor(i%2)===0){
        part1 += encrypted[i];
      }else{
        part2 += encrypted[i];
      }
    }

    let encryptedUser = Crypto.encryptUser(userid);

    return {
      p1: part1,
      p2: part2,
      u: encryptedUser
    };

  }

  static decodePacket(key1, key2, key3, data){
    let part1 = data[key1];
    let part2 = data[key2];

    let str = "";

    let len1 = part1.length;
    let len2 = part2.length;
    
    let i = 0;
    let c1=0, c2=0;
    while(true){
      if(i>len1+len2+10){
        break;
      }
      if(Math.floor(i%2)===0){
        str += part1[c1];
        c1++;
      }else{
        str += part2[c2];
        c2++;
      }

      i++;
    }

    let password = Crypto.decryptPassword(str);
    let user = Crypto.decryptUser(data[key3]);

    return {
      user: user,
      password: password
    };
  }
}