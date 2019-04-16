document.body.onload = addElement;

function addElement () {
  var file = "../Pages/blogPages/example.html";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              var allText = rawFile.responseText;
              document.getElementById("content").innerHTML = allText;
          }
      }
  }
  rawFile.send(null);
}
