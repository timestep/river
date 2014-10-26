var torrentStream = require('torrent-stream');
var gui = require('nw.gui');
var win = gui.Window.get();
var http = require('http');

// gui.App.setCrashDumpDir('')

var init = function () {
  var getLink = document.getElementById('getLink');
  getLink.onclick = function (argument) {
    getMagnet();
  }
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
  var count = 0;
  var items = document.getElementById('files');

  engine.on('ready', function() {
    engine.files.forEach(function(file) {
      console.log('filename:', file.name);
      console.log(file);
      var newFile = document.createElement("li");
      newFile.appendChild(document.createTextNode(file.name))
      newFile.setAttribute("id",count+"-file-"+file.name);
      newFile.setAttribute("class","file_link");
      newFile.file = file;
      items.appendChild(newFile);
      ++count;

      newFile.onclick = function () {
        debugger;
        startStream(this.file);
      }
      // var stream = file.createReadStream();
      // stream is readable stream to containing the file content
    });
  });
}

var startStream = function (file) {

  http.createServer(function (req,res) {
    var stream = file.createReadStream();
    stream.pipe(res);
  }).listen(1337);


}

document.onreadystatechange = (function () {
  if(document.readyState == "complete"){
    init();

    win.on('close',function () {
      this.hide();
      this.close(true);
    });

  }
})