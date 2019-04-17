document.body.onload = loadHandler;

var blogPosts = [];

function loadHandler() {
  var post = getAllUrlParams(window.location.href).post;
  console.log("post: " + post);

  var checking = true;
  var i = 0;
  while (checking) {
    if (checkUrl("../Pages/blogPages/" + i + ".html")) {
      blogPosts.push("../Pages/blogPages/" + i + ".html");
    } else {
      checking = false;
    }
    i++;
  }

  console.log(blogPosts);

  if (post == 0) {
    makeCards();
  } else {
    loadPost(post);
  }
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}


function loadPost(post) {
  var file = "../Pages/blogPages/1.html";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              var allText = rawFile.responseText;

              parser = new DOMParser();
              doc = parser.parseFromString(allText, "text/html");

              console.log("got here! - 0");

              var metaTags = doc.getElementsByTagName('meta');

              for (var i = 0; i < metaTags.length; i++) {
                if (metaTags[i].getAttribute('name') == "post") {
                  document.getElementById("content").innerHTML = allText;
                }
              }
          }
      }
  }
  rawFile.send(null);
}

function getMeta(metaName) {
  var OUT;
  var file = "../Pages/blogPages/1.html";
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              var allText = rawFile.responseText;

              parser = new DOMParser();
              doc = parser.parseFromString(allText, "text/html");


              var metaTags = doc.getElementsByTagName('meta');

              for (var i = 0; i < metaTags.length; i++) {
                if (metaTags[i].getAttribute('name') == metaName) {
                  OUT = metaTags[i].getAttribute('content').toString();
                }
              }
          }
      }
  }
  rawFile.send(null);
  return OUT;
}

function makeCards() {
  //for loop through all posts
  var card =
  `<div class="col-sm-12 col-md-4">
      <div class="card mb-4">
          <a class="card-body text-center" href="?post=${getMeta("post")}#" style="cursor: pointer;">
              <h5 class="card-title">${getMeta("title")}</h5>
              <img src="${getMeta("thumbnail")}" alt="pic" style="width: 80%; margin-top: 5px; margin-bottom: 10px;">
          </a>
      </div>
  </div>`;
  document.getElementById("cards").innerHTML = card;
}

function checkUrl(url) {
      var request = false;
      if (window.XMLHttpRequest) {
              request = new XMLHttpRequest;
      } else if (window.ActiveXObject) {
              request = new ActiveXObject("Microsoft.XMLHttp");
      }

      if (request) {
              request.open("GET", url);
              if (request.status == 200) { return true; }
      }

      return false;
}
