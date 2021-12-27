var SunriseHills = SunriseHills || {};

SunriseHills.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

SunriseHills.game.state.add('Boot', SunriseHills.Boot);
SunriseHills.game.state.add('Preload', SunriseHills.Preload);
SunriseHills.game.state.add('MainMenu', SunriseHills.MainMenu);
SunriseHills.game.state.add('Game', SunriseHills.Game);

SunriseHills.game.state.start('Boot');
