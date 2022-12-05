var SunriseHills = SunriseHills || {};

//loading the game assets
SunriseHills.Preload = function(){};

SunriseHills.Preload.prototype = {
  preload: function() {
  	//show loading screen
  	this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    this.splash.anchor.setTo(0.5);

    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

  	//load game assets
  	this.load.image('space', 'assets/images/space.png');
    this.load.image('town1','assets/images/town1.png');
  	this.load.image('rock', 'assets/images/rock.png');
    this.load.image('info', 'assets/images/info.png');
    this.load.image('inventoryframe','assets/images/inventoryframe.png');
    this.load.image('bakery', 'assets/images/Bakery_smalltown.png');
    this.load.image('theatre', 'assets/images/theatre_smalltown.png');

    this.load.spritesheet('power', 'assets/images/power.png', 12, 12);

    this.load.image('signscroll', 'assets/images/signscroll.png');
    this.load.spritesheet('caroline', 'assets/images/caroline.png', 32, 64);
    // load spritesheets for colectable items
    this.load.spritesheet('consumables', 'assets/images/consumables.png', 32, 32);

  	this.load.image('playerParticle', 'assets/images/player-particle.png');
    this.load.audio('collect', 'assets/audio/collect.ogg');
    this.load.audio('explosion', 'assets/audio/explosion.ogg');
  },
  create: function() {
  	this.state.start('MainMenu');
  }
};
