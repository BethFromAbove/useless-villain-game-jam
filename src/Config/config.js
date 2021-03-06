import 'phaser';
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';

export default {
  type: Phaser.AUTO,
  autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
  dom: {
    createContainer: true,
  },
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
        arcade: {
            debug: false
        }
  },
};
