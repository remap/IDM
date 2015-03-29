// Node js test for ndn-opt consumer

var Consumer = require('./consumer.js').Consumer;
var Config = require('./config.js').Config;

// Right now for node_path setup:
// export NODE_PATH=/Users/zhehaowang/projects/ndn/ndn-clones

var Face = require('ndn-js').Face;
var Name = require('ndn-js').Name;

function displayCallback(trackData)
{
  var data = trackData;
  console.log("x " + data.x + " y " + data.y);
}

function run()
{ 
  var face;
  if (Config.hostName != "") {
    if (Config.wsPort != 0) {
      face = new Face({host: Config.hostName, port: Config.wsPort});
    }
    else {
      face = new Face({host: Config.hostName});
    }
  }
  else {
    face = new Face();
  }
  
  var rootPrefix = new Name(Config.rootPrefix);
  var spaceName = new Name(Config.spaceName);
  
  var consumer = new Consumer(face, rootPrefix, spaceName, displayCallback);
  consumer.start();
}

run();