var torrentStream = require('torrent-stream');
var gui = require('nw.gui');
var win = gui.Window.get();
var http = require('http');
// gui.App.setCrashDumpDir('')

var mediaExtensions = [
  'avi','mkv','wmv','mp4'
]

Array.prototype.last = function () {
  return this[this.length-1];
}

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
  var description = document.getElementById('description');
  var itemDescirption = document.getElementById('itemDescirption');
  itemDescirption.style.display = 'inherit';
  engine.on('ready', function() {
    document.getElementById('link').style.display = 'none';
    engine.files.forEach(function(file) {

      //TODO: HIDE non media files

      console.log('filename:', file.name);
      console.log(file);

      var ext = file.name.split('.').last()

      if(mediaExtensions.indexOf(ext) !== -1){
        var newFile = document.createElement("li");
        newFile.appendChild(document.createTextNode(file.name))
        newFile.setAttribute("id",count+"-file-"+file.name);
        newFile.setAttribute("class","file_link");
        newFile.file = file;
        items.appendChild(newFile);
        ++count;

        newFile.onclick = function () {
          //TODO: REmove files from list;
          items.style.visibility = "hidden";
          itemDescirption.style.display = 'none';
          description.style.display = "inherit"

          startStream(this.file);
        }
      }
      
      // var stream = file.createReadStream();
      // stream is readable stream to containing the file content
    });
  });
}

var startStream = function (file) {

  //add description how to load the stream;

  http.createServer(function (req,res) {
    var stream = file.createReadStream();
    console.log(stream);
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