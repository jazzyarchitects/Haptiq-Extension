"use strict";

const allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()~_+<>?';

class Random {
  static __getRandomString(length){
    length = length || 32;
    if (length <= 13) {
      length += 13;
    }
    let s = "";
    s += (new Date()).getTime().toString();
    for (let i = 0; i < length - 13; i++) {
      s += allowed[Math.floor(Math.random() * allowed.length)];
    }
    let str = "";
    let a = s.split("");
    let n = s.length;
    for (let i = 0; i < n; i++) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }

    str = a.join("");
    
    /* To check if scrambling algorithm works */
    /*
    console.log(s);
    console.log(str);

    let aa = s.split('');
    let ss = str.split('');

    let aaa = {};
    let sss = {};

    for(let i = 0; i < aa.length;i++){
      if(!aaa[aa[i]]){
        aaa[aa[i]]=0;
      }
      aaa[aa[i]]++;
    }

    for(let i = 0; i < ss.length;i++){
      if(!sss[ss[i]]){
        sss[ss[i]]=0;
      }
      sss[ss[i]]++;
    }

    for(let key of Object.keys(aaa)){
      sss[key] = sss[key] - aaa[key];
    }

    console.log(aaa);
    console.log(sss);

    */

    return str;
  }

  static getQRCode() {
    return this.__getRandomString(32);
  }

  static getMobileField(){
    return this.__getRandomString(10);
  }
}