import 'phaser';
import Demon from '../Objects/Demon';

var player;
var cursors;
var scoreText;
var score;
var stars;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }


  create() {
    const { config } = this.game;

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

    this.debugMode = false;
    this.input.on('pointerdown', () => {
      if (this.debugMode) {
        // eslint-disable-next-line no-console
        console.log(this.cameras.main.scrollX + this.input.x, this.cameras.main.scrollY + this.input.y);
      }
    });



    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      velocityY: 50
    });

    stars.children.iterate(function(star){
      star.x = Phaser.Math.Between(0, 750);
      star.y = Phaser.Math.Between(-300, 300);
    })

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

    this.physics.add.overlap(this.demon, stars, this.collectStar, null, this);

    this.cameras.main.fadeIn(500);
  }

  toggleDebugMode() {
    this.debugMode = !this.debugMode;
  }

  addLevel1() {
    this.levelBackground = this.add.image(0, 0, 'background-level1').setOrigin(0, 0);
    this.addDemon();
    
  }

  addLevel2() {
    this.levelBackground = this.add.image(0, 0, 'background-level2').setOrigin(0, 0);
  }

  addLevel3() {
    this.levelBackground = this.add.image(0, 0, 'background-level3').setOrigin(0, 0);
  }

  collectStar(player, star)
  {
    //star.disableBody(true, true);
    star.y = Phaser.Math.Between(-1000, 0);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

  }

  addDemon(x = 100, y = 350) {
    this.demon = new Demon(this, x, y);
    this.demon = this.physics.add.sprite(x, y, 'demon').anims.play('idle', true);

    this.physics.world.enable(this.demon);
    console.log(this.demon);
    this.demon.body.setCollideWorldBounds(true);
  }

  update() {

    stars.children.iterate(function(star){
      if (star.y > 600) {
        star.y = Phaser.Math.Between(-1000, 0);
        star.x = Phaser.Math.Between(-50, 750);
      }
    });

    if (cursors.left.isDown)
    {
      this.demon.body.setVelocityX(-160);
      this.demon.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
      this.demon.body.setVelocityX(160);
      this.demon.anims.play('right', true);
    }
    else
    {
      this.demon.body.setVelocityX(0);
      this.demon.anims.play('idle');
    }

  }

}
