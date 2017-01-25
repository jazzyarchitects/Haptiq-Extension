function deleteallcookies()
{
  var i;
  var mydate=newDate();
  mydate.setTime(mydate.getTime()-1);
  var cookies=document.cookie.split("; ");
  for(i=0;i<cookies.length;i++)
  {
    var d=window.location.hostname.split(".");
    while(d.length>0)
    {
      var cookieBase=encodeURIComponent(cookies[i].split(";")[0].split("=")[0])+'=; expires
    }
  {
    document.cookie=cookieBase+'/';
    w
  }
}
var x=document.getElementById("remove_button");
