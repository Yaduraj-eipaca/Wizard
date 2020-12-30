var assets = require('../Config/assets');
var c = require('../Config/canvas');

var initialised = false;
var counter = 0;
var changeState = false;
var nextState = undefined;
var gameLoop = undefined;
var text = "Loading";
var arrow;

function loadAssets(){
  arrowPic = new Image();
  arrowPic.src = "./GFX/arrow.png";
  arrowPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("arrow",arrowPic);
  ladderPic = new Image();
  ladderPic.src = "./GFX/ladder.png";
  ladderPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("ladder",ladderPic);
  senseSpellMsgPic = new Image();
  senseSpellMsgPic.src = "./GFX/SenseNewSpellMsg.png";
  senseSpellMsgPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("senseSpellMsg",senseSpellMsgPic);
  newSpellMsgPic = new Image();
  newSpellMsgPic.src = "./GFX/newSpellMsg.png";
  newSpellMsgPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("newSpellMsg",newSpellMsgPic);
  noManaMsgPic = new Image();
  noManaMsgPic.src = "./GFX/notEnoughManaMsg.png";
  noManaMsgPic.addEventListener("load",function(){assets.addAsset()},false)
  assets.newAsset("noManaMsg",noManaMsgPic);
}

function updateState(){
  if(counter < 3){
    text += '.';
    counter++;
  } else {
    counter = 0;
    text = "Loading";
  }
  if(assets.getAssetsNum() === assets.getAssetsLength() && assets.getAssetsLength() > 0){
    console.log('assets loaded');
    clearInterval(gameLoop);
    changeState = true;
    nextState = "menuState";
  }
};

module.exports = {
  isInitialised: function(){
    return initialised;
  },
  isFinished: function(){
    return changeState;
  },
  getNextState: function(){
    return nextState;
  },
  setInitialised: function(bool){
    initialised = bool;
  },
  init: function() {
    console.log("loading state initialised");
    changeState = false;
    initialised = true;
    loadAssets();
    gameLoop = setInterval(function(){
      updateState();
    },200)
  },
  draw: function() {
    c.ctx.clearRect(0,0,c.width,c.height);
    c.ctx.font="20px Arial";
    c.ctx.fillStyle = '#000';
    c.ctx.textAlign = "left";
    c.ctx.fillText(text,20,c.height/2-20);
  },
}
