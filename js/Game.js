var SunriseHills = SunriseHills || {};

function droptest() {
  console.log('drop stuff');
  if (this.inventory.children.length == 0) {
    console.log("nothing to drop. the backpack is emply");
    return;
  }
  dItem = this.inventory.getChildAt(0);
  console.log("dropping "+dItem.namelabel);
  this.dropItem(dItem);
};

//title screen
SunriseHills.Game = function(){};

SunriseHills.Game.prototype = {
  create: function() {
  	//set world dimensions
    //this.game.world.setBounds(0, 0, 1920, 2560);
    this.game.world.setBounds(0, 0, 3840, 5120);


    //background
  //  this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
      this.background = this.add.image(0, 0, 'town1').scale.setTo(2,2);
      //this.background = this.add.image(0, 0, 'town1').scale.setTo(4,4);

    // add the info signs to the map
    this.generateSigns();

    this.inventory = [];

    this.generateItems();

    this.game.add.button( 310, 1100, 'caroline', droptest, this,0,1,2,3 );

    this.game.add.image(0,0, 'inventoryframe');
    //adding bakery
    this.bakery = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bakery');
    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'caroline');
    this.player.scale.setTo(2);
    this.player.anchor.setTo(0.5,0.5);
    this.player.animations.add('walkleft', [7,6,8,6], 5, true);
    this.player.animations.add('walkright', [9,11,10,11], 5, true);
    this.player.animations.add('walkforward', [1,0,2,0], 5, true);
    this.player.animations.add('walkback', [4,3,5,3], 5, true);
    this.player.animations.add('standforward', [0], 5, true);
    this.player.animations.add('standback', [3], 5, true);
    this.player.animations.add('standleft', [6], 5, true);
    this.player.animations.add('standright', [11], 5, true);

    // set the initial animation for the player sprite
    this.player.animations.play('standforward');

    //player initial score of zero
    this.playerScore = 0;

    //enable player physics
    this.game.physics.arcade.enable(this.player);
    this.playerSpeed = 120;
    this.player.body.collideWorldBounds = true;

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();

    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');
    console.log(this.explosionSound);
    this.collectSound = this.game.add.audio('collect');
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {

      if (this.msgBox) {
        this.msgBox.destroy();
        this.msgBox = false;
      }
      //move on the direction of the input
      this.player.body.moves = true;
      this.clickedX = this.game.input.activePointer.worldX;
      this.clickedY = this.game.input.activePointer.worldY;
      this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);

      //figure out which sprite direction to set
      var angle = this.player.body.angle;

      if ((angle > -2.355) && ( angle < -0.785))
        { this.player.animations.play('walkback'); this.standing = "standback";}
      else if ((angle < 0.785) && ( angle >= -0.785))
        { this.player.animations.play('walkright'); this.standing = "standright";}
      else if ((angle >= 0.785) && ( angle < 2.355))
        { this.player.animations.play('walkforward'); this.standing = "standforward";}
      else
        { this.player.animations.play('walkleft'); this.standing = "standleft";}

    }
    //if moving, see if we got there
    if ((this.player.body.moves) &&
        (this.game.physics.arcade.distanceToXY(this.player, this.clickedX, this.clickedY) < 5))
        {
          this.player.animations.play(this.standing);
          this.player.body.moves = false;
        }

    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);

    //player bumps into a sign
    this.game.physics.arcade.collide(this.player, this.signs, this.showSign, null, this);

    //player bumps into an utem on the map
    this.game.physics.arcade.collide(this.player, this.mapItems, this.pickupItem, null, this);


  },
  generateItems: function() {
    // create the game item collectables
    //locaiton can be map, store, inventory, hidden
    this.items  =[
      {name:'chicken',x:370, y:1500, buy:20, sell:10, location:'map', image:'consumables', tiles:[10,33,10,34], desc:'Which came first?!? THIS GUY!!!' },
      {name:'chicken',x:270, y:1650, buy:20, sell:10, location:'map', image:'consumables', tiles:[10,10,10,10,10,34,10,33,10,], desc:'Which came first?!? THIS GUY!!!' },
      {name:'coffee',x:900, y:200, buy:15, sell:8, location:'map', image:'consumables', tiles:[3], desc:'Coffeecoffeecoffeecoff-' },
      {name:'egg',x:570, y:2000, buy:10, sell:5, location:'map', image:'consumables', tiles:[2], desc:'Which came first?!? not this guy :-( !!!' },
      {name:'choclate egg',x:570, y:2000, buy:10, sell:5, location:'inventory', image:'consumables', tiles:[2], desc:'Which came first?!? not this guy :-( !!!' },
      {name:'the bakery',x:900, y:200, buy:15, sell:8, location:'map', image:'bakery', tiles:[1], desc:'cookies-' }
    ];
    // inventory itemList
    this.inventory = this.game.add.group();
    // on map items list
    this.mapItems = this.game.add.group();
    this.mapItems.enableBody = true;
    this.mapItems.physicsBodyType = Phaser.Physics.ARCADE;

    // all items listene

    this.itemList = this.game.add.group();


    for (var i=0; i<this.items.length; i++) {
      itemSprite = this.game.add.sprite(this.items[i].x, this.items[i].y, this.items[i].image);
      itemSprite.scale.setTo(2);
      itemSprite.anchor.setTo(0.5,0.5);
      //itemSprite.body.immovable﻿ = true;
      //itemSprite.body.moves = false;

      itemSprite.animations.add('view', this.items[i].tiles, 5, true);
      itemSprite.animations.play('view');
      itemSprite.namelabel = this.items[i].name;
      itemSprite.itemnum = i;
      itemSprite.visible = false;
      //this.itemList.add(this.items[i].sprite);
      if (this.items[i].location === "map") this.addToMap(itemSprite);
      if (this.items[i].location === "inventory") this.addToInventory(itemSprite);

    }

  },
  addToMap: function( sprite) {
    sprite.visible = true;
    this.mapItems.add(sprite);
  },
  removeFromMap: function (sprite) {
    sprite.visible = false;
    this.mapItems.remove(sprite);
  },
  addToInventory: function(sprite) {
    this.inventory.add(sprite);
    //deubg
    this.showInventory();
  },
  removeFromInventory: function(sprite) {
    this.inventory.remove(sprite);
  },
  logItem: function(item) {
    console.log("item: "+ item +item.namelabel);
  },
  showInventory: function() {
    console.log("what's in inventory");
    this.inventory.forEach(this.logItem, this);
    console.log("end of inventory");

  },
  generateSigns: function() {

    var signsData =[
      {x:800, y:200, text:'A hollow voice says "plough" in the distance.' },
      {x:900, y:600, text:'This is the day, that the Lord has made.' },
      {x:1300, y:900, text:'On the fifth day of christmas, my true love gave to me...' },
      {x:70, y:600, text:'This lot is slated for: "Engineering Office" or "Luxury Shop".' },
      {x:1250, y:1200, text:'Welcome to Sunrise Hills' }

    ];

    this.signs = this.game.add.group();
    this.signs.enableBody = true;
    this.signs.physicsBodyType = Phaser.Physics.ARCADE;
    sLen = signsData.length;

    for (i = 0; i < sLen; i++) {
      var sign;
      //add this to a loop
      sign = this.signs.create(signsData[i].x, signsData[i].y, 'info');
      sign.scale.setTo(.1,.1);
      sign.body.immovable﻿ = true;
      sign.text = signsData[i].text;
    }


  },
  showSign: function(player, sign) {
    //show sprite
    this.player.animations.play(this.standing);
    this.player.body.moves = false;

    this.signSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'signscroll');
    this.showMessageBox(this.game, sign);
    //console.log("show the sign: "+sign.text);

  },
  showMessageBox(game, sign, w = 300, h = 300) {
    //just in case the message box already exists
    //destroy it
    console.log("show the sign: "+sign.text);
    var text = sign.text;
    if (this.msgBox) {
          this.msgBox.destroy();
    }
    //make a group to hold all the elements
    var msgBox = game.add.group();
    //make the back of the message box
    var back = game.add.sprite(0,0, "signscroll");
    //make the close button
    //var closeButton = game.add.sprite(0, 0, "closeButton");
    //make a text field
    var text1 = game.add.text(0,0, text);
    //set the textfeild to wrap if the text is too long
    text1.wordWrap = true;
    //make the width of the wrap 90% of the width
    //of the message box
    text1.wordWrapWidth = w * .9;
    //
    //
    //set the width and height passed
    //in the parameters
    back.width = w;
    back.height = h;
    //
    //
    //
    //add the elements to the group
    msgBox.add(back);
    //msgBox.add(closeButton);
    msgBox.add(text1);
    //

    //set the message box in the center of the screen
    msgBox.x = game.width / 2 - msgBox.width / 2;
    msgBox.y = game.height / 2 - msgBox.height / 2;
    msgBox.x = sign.world.x;
    msgBox.y = sign.world.y;
    //
    //set the text in the middle of the message box
    text1.x = back.width / 2 - text1.width / 2;
    text1.y = back.height / 2 - text1.height / 2;
    //make a state reference to the messsage box
    this.msgBox = msgBox;
  },

  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(100, 150)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
    }

  },
  generateAsteriods: function() {
    // this.asteroids = this.game.add.group();
    //
    // //enable physics in them
    // this.asteroids.enableBody = true;
    //
    // //phaser's random number generator
    // var numAsteroids = this.game.rnd.integerInRange(150, 200)
    // var asteriod;
    //
    // for (var i = 0; i < numAsteroids; i++) {
    //   //add sprite
    //   asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
    //   asteriod.scale.setTo(this.game.rnd.integerInRange(10, 40)/10);
    //
    //   //physics properties
    //   asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
    //   asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
    //   asteriod.body.immovable = true;
    //   asteriod.body.collideWorldBounds = true;
    // }
  },
  hitAsteroid: function(player, asteroid) {
    //play explosion sound
    // this.explosionSound.play();
    //
    // //make the player explode
    // var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    // emitter.makeParticles('playerParticle');
    // emitter.minParticleSpeed.setTo(-200, -200);
    // emitter.maxParticleSpeed.setTo(200, 200);
    // emitter.gravity = 0;
    // emitter.start(true, 1000, null, 100);
    // this.player.kill();
    //
    // this.game.time.events.add(800, this.gameOver, this);
  },
  gameOver: function() {
    //pass it the score as a parameter
    this.game.state.start('MainMenu', true, false, this.playerScore);
  },
  pickupItem: function(player,item){
    this.addToInventory(item);
    this.removeFromMap(item);
  },
  dropItem: function(item) {
    this.removeFromInventory(item);
    item.x = this.player.x+50;
    item.y = this.player.y+50;
    this.addToMap(item);
  },
  showInventory: function() {

  },
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove sprite
    collectable.destroy();
  },
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  }
};

/*
TODO

-audio
-asteriod bounch
*/
