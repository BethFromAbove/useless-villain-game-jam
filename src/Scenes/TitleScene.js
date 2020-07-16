import 'phaser';
import Button from '../Objects/Button';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    const { config } = this.game;
    this.model = this.sys.game.globals.model;

    if (this.model.musicOn === true && this.model.currentMusic === 'bossFight') {
      this.game.registry.get('bossFight').stop();
      this.game.registry.get('bgMusic').play();
      this.model.currentMusic = 'bgMusic';
    }
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.game.registry.get('bgMusic').play();
      this.model.bgMusicPlaying = true;
    }

    this.add.image(config.width / 2, config.height / 2, 'titleBackground');

    // Game - Head to Rocket Select page
    this.gameButton = new Button(this, 440, 460, 'playButtonUp', 'playButtonDown', 'Instructions');

    // Options
    this.optionsButton = new Button(this, 555, 520, 'optionsButtonUp', 'optionsButtonDown', 'Options');

    // credits
    this.creditsButton = new Button(this, 620, 425, 'creditsButtonUp', 'creditsButtonDown', 'Credits');
  }
}
