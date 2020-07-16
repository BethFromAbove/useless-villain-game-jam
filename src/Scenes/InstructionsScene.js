import 'phaser';
import Button from '../Objects/Button';

export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super('Instructions');
  }

  create() {
    const { config } = this.game;
    this.add.image(config.width / 2, config.height / 2, 'instructionsBackground');
    this.gameButton = new Button(this, 550, 500, 'playButtonUp', 'playButtonDown', 'Game', true);
  }
}
