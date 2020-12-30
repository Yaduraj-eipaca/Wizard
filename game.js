var c = require('./Config/canvas');
var keys = require('./Config/keys');
var m = require('./Config/mouse');
var loadingState = require('./States/loadingState');
var menuState = require('./States/menuState');
var gameState = require('./States/gameState');
var announceState = require('./States/announceState');

var states = {
  'loadingState' : loadingState,
  'menuState' : menuState,
  'gameState' : gameState,
  'announceState': announceState,
}

var currState = states['loadingState'];

function gameLoop(){
  window.requestAnimationFrame(gameLoop,c.canvas);
  if(currState.init){
    if(!currState.isInitialised()){
      currState.init();
    }
  }
  if(currState.draw){
    currState.draw();
  }
  if(currState.isFinished()){
    var nextState = currState.getNextState();
    currState.setInitialised(false);
    currState = states[nextState];
    keys.reset();
  }
}

module.exports = {
  init: function() {
    keys.init();
    m.init();
    gameLoop();
  }
}
