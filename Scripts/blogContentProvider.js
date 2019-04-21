document.body.onload = loadHandler;

var blogPosts = [];

function loadHandler() {
  var post = getAllUrlParams(window.location.href).post;

  if (post == 0 || post == null) {
    setTimeout(function(){makeCards()}, 1500);
  } else {
    loadPost(post);
  }
  var checking = true;
  var i = 1;
  while (checking) {
    if (checkUrl("../Pages/blogPages/" + i + ".html")) {
      blogPosts.push("../Pages/blogPages/" + i + ".html");
    } else {
      checking = false;
    }
    i++;
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
  var file = "../Pages/blogPages/"+post+".html";
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
                if (metaTags[i].getAttribute('name') == "post") {
                  document.getElementById("content").innerHTML = allText;
                  setTimeout(topFunction, 50);
                }
              }
          }
      }
  }
  rawFile.send(null);
}

function getMeta(metaName, file) {
  var OUT;
  //var file = "../Pages/blogPages/1.html";
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
  document.getElementById("cards").innerHTML = "";
  for (var i = 0; i < blogPosts.length; i++) {
    var card =
    `
    <!-- Begin Card -->
    <div class="row no-gutters bg-light position-relative">
      <div class="col-md-6 mb-md-0 p-md-4">
        <img src="${getMeta("thumbnail", blogPosts[i])}" class="w-100" alt="thumbnail">
      </div>
      <div class="col-md-6 position-static p-4 pl-md-0">
        <h5 class="mt-0">${getMeta("title", blogPosts[i])}</h5>
        <p>${getMeta("teaseText", blogPosts[i])}</p>
        <a href="${"?post=" + getMeta("post", blogPosts[i]) + "#"}" class="btn btn-info stretched-link">Read</a>
      </div>
    </div>
    <!-- End Card -->
    `;
    document.getElementById("cards").innerHTML += card;
  }
}

function checkUrl(url) {
  var request;
  if(window.XMLHttpRequest)
      request = new XMLHttpRequest();
  else
      request = new ActiveXObject("Microsoft.XMLHTTP");
  request.open('GET', url, false);
  request.send(); // there will be a 'pause' here until the response to come.
  // the object request will be actually modified
  if (request.status === 404) {
      return false;
  }
  else {
    return true;
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
