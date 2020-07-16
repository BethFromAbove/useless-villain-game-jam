import 'phaser';
import Button from '../Objects/Button';

export default class EndScene extends Phaser.Scene {
  constructor() {
    super('End');
  }

  create() {
    const { config } = this.game;
    this.sys.game.globals.model.level = 1;
    this.add.image(config.width / 2, config.height / 2, 'endBackground');
    this.menuButton = new Button(this, 550, 500, 'menuButtonUp', 'menuButtonDown', 'Title');
  }
}
