import 'phaser';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { config } = this.game;

    // this.add.image(config.width / 2, config.height / 2, 'background');

    // Game - Head to Rocket Select page
    this.gameButton = new Button(this, 475, 330, 'playButton', 'playButtonPressed', 'Game');

    // Options
    this.optionsButton = new Button(this, 625, 330, 'optionsButton', 'optionsButtonPressed', 'Options');

    // About
    this.aboutButton = new Button(this, 475, 415, 'aboutButton', 'aboutButtonPressed', 'About');

    // credits
    this.creditsButton = new Button(this, 625, 415, 'creditsButton', 'creditsButtonPressed', 'Credits');

    this.model = this.sys.game.globals.model;

    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.game.registry.get('bgMusic').play();
      this.model.bgMusicPlaying = true;
    }

    
  }

  update() {
    
  }
}
