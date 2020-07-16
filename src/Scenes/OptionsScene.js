import 'phaser';
import Button from '../Objects/Button';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }


  create() {
    this.model = this.sys.game.globals.model;
    const { config } = this.game;


    this.add.image(config.width / 2, config.height / 2, 'paperBackground');

    this.musicButton = this.add.image(490, 300, 'checkedBox').setInteractive({ useHandCursor: true });

    this.soundButton = this.add.image(490, 380, 'checkedBox').setInteractive({ useHandCursor: true });

    this.musicButton.on('pointerdown', () => {
      this.model.musicOn = !this.model.musicOn;
      this.updateAudio();
    });

    this.soundButton.on('pointerdown', () => {
      this.model.soundOn = !this.model.soundOn;
      this.updateAudio();
    });

    this.updateAudio();

    this.menuButton = new Button(this, 550, 500, 'menuButtonUp', 'menuButtonDown', 'Title');
    this.updateAudio();
  }

  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('uncheckedBox');
      this.game.registry.get('bgMusic').stop();
      this.model.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture('checkedBox');
      if (this.model.bgMusicPlaying === false) {
        this.game.registry.get('bgMusic').play();
        this.model.bgMusicPlaying = true;
      }
    }

    if (this.model.soundOn === false) {
      this.soundButton.setTexture('uncheckedBox');
    } else {
      this.soundButton.setTexture('checkedBox');
    }
  }
}
