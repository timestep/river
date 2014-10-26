var torrentStream = require('torrent-stream');
var gui = require('nw.gui');
var win = gui.Window.get();

var init = function () {
  var getLink = document.getElementById('getLink');
  getLink.onclick = getMagnet;
}

var getMagnet = function () {
  var magnetLink = document.getElementById('magnetLink').value;
  console.log(magnetLink);
  if (magnetLink.match(/magnet:\?xt=urn:/) != null) {
    startEngine(torrentStream(magnetLink));
  } else {
    alert('Not a valid Magnet Link');
  }
}

var startEngine = function (engine) {
  engine.on('ready', function() {
    engine.files.forEach(function(file) {
      console.log('filename:', file.name);
      console.log(file);
      // var stream = file.createReadStream();
      // stream is readable stream to containing the file content
    });
  });
}

document.onreadystatechange = (function () {
  if(document.readyState == "complete"){
    init();
  }
})

