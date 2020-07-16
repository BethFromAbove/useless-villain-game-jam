import 'phaser';
import Button from '../Objects/Button';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    const { config } = this.game;
    this.add.image(config.width / 2, config.height / 2, 'creditsBackground');
    this.menuButton = new Button(this, 550, 500, 'menuButtonUp', 'menuButtonDown', 'Title');
  }
}
