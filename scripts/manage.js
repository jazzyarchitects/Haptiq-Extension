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




