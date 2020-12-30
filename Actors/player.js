var entity = require('./entity');
var keys = require('../Config/keys');
var c = require('../Config/canvas');
var assets = require('../Config/assets');
var helpers = require('../Config/helpers');
var m = require('../Config/mouse');
var magicMissile = require('./Attacks/magicMissile');
var gustOfWind = require('./Attacks/gustOfWind');
var fireBomb = require('./Attacks/fireBomb');
var Message = require('./message');

var upPressed = false;
var downPressed = false;
var rClicked = false;
var mClicked = false;
var ePressed = false;

var attacks = {
  'magicMissile' : magicMissile,
  'gustOfWind' : gustOfWind,
  'fireBomb' : fireBomb,
}

var message = Message.getMessage();

player = entity.newEntity();
player.color = "blue";
player.alive = true;
player.leavingMap = false;
player.deadFor = 0;
player.jumping = false;
player.kneeling = false;
player.kneelingFor = 0;
player.touchingShrine = false;
player.getsUpIn = 0;
player.onGround = false;
player.touchingLadder = false;
player.whichLadder = {};
player.onLadder = false;
player.touchingPlatform = false;
player.whichPlatform = {};
player.vector = {x:0,y:0};
player.fallingVel = 0;
player.direction = 0;
player.mana = 20;
player.maxMana = 20;
player.lastManaTick = 0;
player.manaRegenTime = 60;
player.manaRegenActive = false;
player.energyShards = 0;
player.width = 24;
player.height = 54;
player.x = 30;
player.y = c.height - player.height - 50;
player.prevY;
player.attacks = ['magicMissile','gustOfWind','fireBomb']
player.currAttack = 0
player.missiles = [];
player.stab = entity.newEntity();
player.stab.height = 7;
player.stab.width = 45;
player.stab.active = false;
player.stab.activeTime = 40;
player.stab.activeFor = 0;
player.stab.update = function(x,y,width,height,direction){
  if(this.activeFor === this.activeTime){
    this.active = false;
    this.activeFor = 0;
  } else {
    if(!direction){
      this.x = x+width/2;
      this.y = y+(height/2-this.height/2);
    } else {
      this.x = x-(this.width-width/2);
      this.y = y+(height/2-this.height/2);
    }
    this.activeFor++
  }
}

player.draw = function(ctx) {
  ctx.fillRect(this.x,this.y,this.width,this.height);
  ctx.save();
  ctx.translate(player.x+12, player.y+12);
  var mouseCoords = m.getCoords();
  var mx = mouseCoords.x;
  var my = mouseCoords.y;
  var dx = mx-player.x+12;
  var dy = my-player.y+12;
  var rotation = helpers.getRotation(dx,dy)
  if(!player.direction){
    if(rotation < -1){
      rotation = -1;
    }
    if(rotation > 1) {
      rotation = 1;
    }
  } else {
    rot = rotation* 180 / Math.PI
    if(!(rot<-110&&rot>-180)&&rot<0){
      rotation = -2;
    }
    if(!(rot>110&&rot<180)&&rot>0){
      rotation = 2;
    }
  }
  if(player.onLadder){
    rotation = -1.57;
  }
  ctx.rotate(rotation);
  ctx.drawImage(assets.getAsset('arrow'),-10,-10,20,20);
  ctx.restore();
  if(player.stab.active){
    player.stab.draw(ctx);
  }
  if(player.missiles.length > 0) {
    for (var i = 0; i < player.missiles.length; i++) {
      player.missiles[i].draw(ctx);
    }
  }
}

player.controlKeys = function(){
  if(keys.isPressed('w') && !this.jumping && this.onGround && !upPressed && !this.touchingLadder){
    upPressed = true;
    this.jumping = true;
    this.onGround = false;
    this.vector.y = -22;
  }
  if(keys.isPressed('w') && !keys.isPressed('a') && !keys.isPressed('d') &&
   this.touchingLadder && !upPressed){
    upPressed = true;
    this.onLadder = true;
  }
  if(keys.isPressed('w') && this.onLadder){
    this.x = (this.whichLadder.x+(this.whichLadder.width/2))-this.width/2
    this.vector.y = -2;
  }
  if(!keys.isPressed('w')){
    upPressed = false;
    this.jumping = false
    this.vector.y = 0;
  }
  if(keys.isPressed('s') && this.onGround && !keys.isPressed('d') && !keys.isPressed('a') && !this.touchingLadder){
    this.kneeling = true;
  }
  if(keys.isPressed('s') && !this.onLadder && this.touchingLadder){
    this.onLadder = true;
  }
  if(keys.isPressed('s') && this.onLadder){
    this.x = (this.whichLadder.x+(this.whichLadder.width/2))-this.width/2
    this.vector.y = 2;
  }
  if(!keys.isPressed('s')){
    this.kneeling = false;
  }
  if(keys.isPressed('a') && !keys.isPressed('d') && !this.kneeling && !(this.touchingPlatform && this.onLadder)){
    player.direction = 1;
    if(!this.jumping){
      this.vector.x = -3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = -1;
    } else {
      this.vector.x = -5;
    }
  }
  if(keys.isPressed('d') && !keys.isPressed('a') && !this.kneeling && !(this.touchingPlatform && this.onLadder)){
    player.direction = 0;
    if(!this.jumping){
      this.vector.x = 3;
    } else if(!this.onGround && !this.jumping) {
      this.vector.x = 1;
    } else {
      this.vector.x = 5;
    }
  }
  if(!keys.isPressed('a') && !keys.isPressed('d')){
    this.vector.x = 0;
  }
  if(keys.isPressed('e') && !ePressed){
    ePressed = true;
    player.currAttack++;
    if(player.currAttack === player.attacks.length){
      player.currAttack = 0;
    }
  }
  if(!keys.isPressed('e')){
    ePressed = false;
  }
}

player.controlMouse = function() {
  if(m.isRclicked() && !rClicked && !player.onLadder){
    rClicked = true;
    if(!player.stab.active){
      player.stab.active = true;
    }
  }
  if(!m.isRclicked()) {
    rClicked = false;
  }
  if(m.isClicked() && !mClicked && !player.onLadder && player.attacks.length > 0) {
    mClicked = true;
    var clickCoords = m.getClickedCoords()
    var missile = attacks[player.attacks[player.currAttack]];
    mx = clickCoords.x;
    my = clickCoords.y;
    var newMissile = missile.newMissile(player.x,player.y,player.width,mx,my,player.direction);
    if(newMissile.manaCost <= player.mana){
      if(message.active && message.image === 'noManaMsg'){
        message.reset();
      }
      player.mana -= newMissile.manaCost;
      player.missiles.push(newMissile);
    } else {
      message.reset();
      message.setMsg('noManaMsg');
      message.active = true;
    }
  }
  if(!m.isClicked()){
    mClicked = false;
  }
}

player.updateMissiles = function(){
  if(player.missiles.length > 0) {
    for (var i = 0; i < player.missiles.length; i++) {
      type = player.missiles[i].type;
      attacks[type].updateMissile(player.missiles[i]);
    }
  }
}

player.handleKneeling = function(){
  if(this.kneeling){
    this.height = 27;
    if(this.kneelingFor === 0){
      this.y += 27;
    }
    this.kneelingFor++;
  } else {
    this.height = 54;
    if(this.kneelingFor != 0){
      this.y -= 27;
    }
    this.kneelingFor = 0;
  }
  if(this.getsUpIn > 0){
    this.getsUpIn--;
    if(this.getsUpIn === 0){
      this.kneeling = false;
      this.kneelingFor = 0;
    }
  }
}

player.updateMana = function(){
  if(this.lastManaTick >= this.manaRegenTime){
    if(this.mana<this.maxMana){
      this.mana++;
    }
    this.lastManaTick = 0;
  } else {
    this.lastManaTick+=1;
  }
}

player.resetAttacks = function(){
  this.attacks = [];
}
player.addAttack = function(attack){
  this.attacks.push(attack)
}

player.update = function(grav){
  this.controlKeys();
  this.controlMouse();
  this.updateMissiles();
  player.stab.update(player.x,player.y,player.width,player.height,player.direction);
  this.handleKneeling();
  if(this.manaRegenActive){
    this.updateMana();
  }

  if(this.attacks.length === 1) {
    this.currAttack = 0;
  }

  if(this.y===0){
    this.vector.y = 0;
  }
  if(this.jumping){
    this.vector.y++;
    if(this.vector.y >= 0) {
      this.vector.y = 0;
      this.jumping = false;
    }
  }

  if(!this.onGround){
    this.fallingVel += 0.2;
  } else {
    this.fallingVel = 0;
  }

  if(!this.onLadder){
    this.y += grav+this.fallingVel;
  }
  this.y += this.vector.y;

  this.x += this.vector.x;

  if(this.onLadder){
    if(this.y+this.height> this.whichLadder.y+this.whichLadder.height){
      this.onLadder = false;
    }
  }

  if(this.prevY<this.y){
    this.onGround = false;
  }
  this.prevY = this.y;
}

module.exports = {
  getPlayer: function() {
    return player;
  }
}
