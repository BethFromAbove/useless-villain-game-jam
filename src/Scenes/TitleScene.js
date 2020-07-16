import 'phaser';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { config } = this.game;

    this.add.image(config.width / 2, config.height / 2, 'paperBackground');

    // Game - Head to Rocket Select page
    this.gameButton = new Button(this, 475, 230, 'playButtonUp', 'playButtonDown', 'Instructions');

    // Options
    this.optionsButton = new Button(this, 500, 300, 'optionsButtonUp', 'optionsButtonDown', 'Options');

    // credits
    this.creditsButton = new Button(this, 520, 370, 'creditsButtonUp', 'creditsButtonDown', 'Credits');

    this.model = this.sys.game.globals.model;

    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.game.registry.get('bgMusic').play();
      this.model.bgMusicPlaying = true;
    }
  }

  update() {
    
  }
}
