"use strict";

let app = angular.module('haptiq', ['ngMaterial']);

app.controller('MainController', ($scope)=>{

  $scope.accounts = [{
    url: 'www.facebook.com',
    id: 'jibinmathews7',
    modifiedOn: new Date()
  },{
    url: 'www.facebook.com',
    id: 'jibinmathews7',
    modifiedOn: new Date()
  },{
    url: 'www.facebook.com',
    id: 'jibinmathews7',
    modifiedOn: new Date()
  },{
    url: 'www.facebook.com',
    id: 'jibinmathews7',
    modifiedOn: new Date()
  }];

  $scope.isAuthenticated = true;

  $scope.init = ()=>{



    chrome.runtime.onMessage.addListener((request, sender)=>{
      console.log("manage page runtine onMessage");
      console.log(request);
    });

  };

});


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

app.filter('dateFixer', ()=>{
  return (date)=>{

    let d = new Date(date);
    let string = d.getDate()+"-"+months[d.getMonth()]+"-"+d.getFullYear();
    return string;
  }
});