"use strict";

var str = `<!DOCTYPE html>
<html>
<head>
  <title>Haptiq Secure Management</title>
  <!-- Angular Material Library -->
  <script src="../bower_components/angular-material/angular-material.min.js"></script>
  <link rel="stylesheet" href="chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/styles/manage.css" />
  <script type="text/javascript" src="scripts/manage.js"></script>
</head>
<body>

  <div class="fingerprint-authentication">
    <div>
      <center><img src="chrome-extension://jeknnconpjppjhdbdcchkoeeoamcejff/images/ic_action_fingerprint.png" /></center>
      <p>Authenticate yourself to access this page.<br />Scan your fingerprint on your phone</p>
    </div>
  </div>
</div>
</md-content>
</div>
</body>
</html>`;


chrome.runtime.sendMessage({
  type: "browser-authentication"
}, function(response){
  // console.log(response);
  if(response.authentication === true){
    // All good
  }else{
    setUnauthenticated();
  }
});

function setUnauthenticated(){
  // if(document.URL.indexOf("github.com")!==-1){
    document.body.innerHTML = str;
  // }
}