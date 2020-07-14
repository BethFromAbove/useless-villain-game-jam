import 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    const { matter } = this;

    this.ending = false;

    this.model = this.sys.game.globals.model;
    switch (this.model.level) {
      case 1:
        this.addLevel1();
        break;
      case 2:
        this.addLevel2();
        break;
      case 3:
        this.addLevel3();
        break;
      case 4:
        this.addLevel4();
        break;
      default:
        break;
    }

    matter.world.setBounds(0, -40, this.levelBackground.width, this.levelBackground.height);
    this.graphics = this.add.graphics();
    matter.add.mouseSpring();


    this.debugMode = false;
    this.input.on('pointerdown', () => {
      if (this.debugMode) {
        // eslint-disable-next-line no-console
        console.log(this.cameras.main.scrollX + this.input.x, this.cameras.main.scrollY + this.input.y);
      }
    });

    this.cameras.main.fadeIn(500);
  }

  toggleDebugMode() {
    this.debugMode = !this.debugMode;
  }

  addLevel1() {
    this.levelBackground = this.add.image(0, 0, 'background-level1').setOrigin(0, 0);
  }

  addLevel2() {
    this.levelBackground = this.add.image(0, 0, 'background-level2').setOrigin(0, 0);
  }

  addLevel3() {
    this.levelBackground = this.add.image(0, 0, 'background-level3').setOrigin(0, 0);
  }

  update() {

  }

}
