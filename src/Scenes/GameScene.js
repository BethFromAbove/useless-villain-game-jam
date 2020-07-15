import 'phaser';

// Default hero attack cooldowns, weird numbers so they dont end up
// syncing.
var defaultWizardCooldown = 2812;
var defaultRangerCooldown = 2278;
var defaultFighterCooldown = 1533;
var defaultRogueCooldown = 1805;

var maxDemonHealth = 1000;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.wizardCooldown = defaultWizardCooldown;
    this.rangerCooldown = defaultRangerCooldown;
    this.fighterCooldown = defaultFighterCooldown;
    this.rogueCooldown = defaultRogueCooldown;
  }

  /* Grab a reference to the canvas in our scene's preload so we can
   * determine the size of the game.
   */
   preload() {
    this.canvas = this.sys.game.canvas;
  }

  randWidth() {
    return (Math.random() * this.canvas.width);
  }

  randHeight() {
    return (Math.random() * this.canvas.height);
  }

  create() {
    const { config } = this.game;

    this.gameEnded = false;

    this.createAnims();

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

    // Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Collection of projectiles
    this.projectiles = new Phaser.GameObjects.Group(this);

    this.physics.add.overlap(this.demon, this.projectiles, this.projectileHitDemon, null, this);

    this.cameras.main.fadeIn(500);
  }

  createAnims() {
    //  Demon animations
    this.anims.create({
      key: 'demon-idle',
      frames: this.anims.generateFrameNumbers('demon', { start: 0, end: 7 }),
      frameRate: 7,
      repeat: -1
    });
    this.anims.create({
      key: 'demon-faint',
      frames: this.anims.generateFrameNumbers('demonFaint', { start: 0, end: 7 }),
      frameRate: 7
    });

    // Wizard animations
    this.anims.create({
      key: 'wizard-idle',
      frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'wizard-attack',
      frames: [ { key: 'wizard', frame: 4 } ],
      duration: 500
    });

    // Ranger animations
    this.anims.create({
      key: 'ranger-idle',
      frames: this.anims.generateFrameNumbers('ranger', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'ranger-attack',
      frames: [ { key: 'ranger', frame: 4 } ],
      duration: 500
    });

    // Fighter animations
    this.anims.create({
      key: 'fighter-idle',
      frames: this.anims.generateFrameNumbers('fighter', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'fighter-attack',
      frames: [ { key: 'fighter', frame: 4 } ],
      duration: 500
    });

    // Rogue animations
    this.anims.create({
      key: 'rogue-idle',
      frames: this.anims.generateFrameNumbers('rogue', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'rogue-attack',
      frames: [ { key: 'rogue', frame: 4 } ],
      duration: 500
    });

    // Projectile animations
    this.anims.create({
      key: 'fireball-default',
      frames: [ { key: 'fireball', frame: 4 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'arrow-default',
      frames: [ { key: 'arrow', frame: 4 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'dagger-default',
      frames: [ { key: 'dagger', frame: 4 } ],
      frameRate: 20
    });
  }

  toggleDebugMode() {
    this.debugMode = !this.debugMode;
  }

  addLevel1() {
    this.add.image(0, 0, 'floor').setOrigin(0, 0);
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'lava').setOrigin(0, 0);
    this.addDemon();
    this.addWizard (((0/4) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.addRanger (((1/4) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.addFighter(((2/4) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.addRogue  (((3/4) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.add.image(0, 0, 'foreground').setOrigin(0, 0);
    this.healthBar = this.add.image(220, 570, 'healthBar').setOrigin(0, 0);
    this.add.image(220, 570, 'healthBarFrame').setOrigin(0, 0);
    this.powerBar = this.add.image(420, 570, 'powerBar').setOrigin(0, 0);
    this.add.image(420, 570, 'powerBarFrame').setOrigin(0, 0);
  }

  addLevel2() {
    this.levelBackground = this.add.image(0, 0, 'background-level2').setOrigin(0, 0);
    this.addDemon();
  }

  addLevel3() {
    this.levelBackground = this.add.image(0, 0, 'background-level3').setOrigin(0, 0);
    this.addDemon();
  }

  addDemon(x = 400, y = 500) {
    this.demon = this.physics.add.sprite(x, y, 'demon').anims.play('demon-idle', true);
    this.physics.world.enable(this.demon);
    this.demon.body.setCollideWorldBounds(true);
    this.demonHealth = maxDemonHealth;
  }

  addWizard(x = 50, y = 100) {
    this.wizard = this.physics.add.sprite(x, y, 'wizard').anims.play('wizard-idle', true);
    this.wizard.name = 'wizard';
    this.physics.world.enable(this.wizard);
    this.wizard.body.setCollideWorldBounds(true);
    this.wizardFiredAt = Date.now();
  }

  addRanger(x = 100, y = 100) {
    this.ranger = this.physics.add.sprite(x, y, 'ranger').anims.play('ranger-idle', true);
    this.ranger.name = 'ranger';
    this.physics.world.enable(this.ranger);
    this.ranger.body.setCollideWorldBounds(true);
    this.rangerFiredAt = Date.now();
  }

  addFighter(x = 150, y = 100) {
    this.fighter = this.physics.add.sprite(x, y, 'fighter').anims.play('fighter-idle', true);
    this.fighter.name = 'fighter';
    this.physics.world.enable(this.fighter);
    this.fighter.body.setCollideWorldBounds(true);
    this.fighterFiredAt = Date.now();
  }

  addRogue(x = 200, y = 100) {
    this.rogue = this.physics.add.sprite(x, y, 'rogue').anims.play('rogue-idle', true);
    this.rogue.name = 'rogue';
    this.physics.world.enable(this.rogue);
    this.rogue.body.setCollideWorldBounds(true);
    this.rogueFiredAt = Date.now();
  }

  update() {
    //check victory condition
    if ((this.demonHealth <= 0) && !this.gameEnded) {
      //end the game
      this.gameEnded = true;
      this.demon.anims.play('demon-faint', true);
      this.demon.on('animationcomplete', this.gameEnd);
    }

    if (!this.gameEnded) {
      // Move Demon based on arrow keys
      if (this.cursors.left.isDown) {
        this.demon.body.setVelocityX(-300);
      }
      else if (this.cursors.right.isDown) {
        this.demon.body.setVelocityX(300);
      }
      else {
        this.demon.body.setVelocityX(0);
      }

      // Heroes attack at different intervals
      var now = Date.now();
      if (now > (this.wizardFiredAt + this.wizardCooldown)) {
        this.attack(this.wizard);
        this.wizardFiredAt = now;
      }
      if (now > (this.rangerFiredAt + this.rangerCooldown)) {
        this.attack(this.ranger);
        this.rangerFiredAt = now;
      }
      if (now > (this.fighterFiredAt + this.fighterCooldown)) {
        this.attack(this.fighter);
        this.fighterFiredAt = now;
      }
      if (now > (this.rogueFiredAt + this.rogueCooldown)) {
        this.attack(this.rogue);
        this.rogueFiredAt = now;
      }
    }

    // Kill projectiles that are off screen
    this.projectiles.children.each((p) => {
      if (this.offscreen(p)) {
        p.destroy();
      }
    });
  }

  /* Predicate to determine if a sprite has gone off screen.
  */
  offscreen(s) {
    return (s.x < 0 || s.x > this.canvas.width || s.y < 0 || s.y > this.canvas.height);
  }

  /* Attack with a hero.
  */
  attack(hero) {
    hero.anims.play(hero.name + '-attack', true);
    hero.on('animationcomplete', () => {hero.anims.play(hero.name + '-idle', true)});
    switch (hero.name) {
      case 'wizard':
      this.fireProjectile(hero, 'fireball');
      break;
      case 'ranger':
      this.fireProjectile(hero, 'arrow');
      break;
      case 'fighter':
      this.fighterAttack(hero);
      break;
      case 'rogue':
      this.rogueAttack(hero);
    }
  }
  
  /* Fire a projectile with a ranged hero. Different projectiles have
   * different speeds. All projectiles whould have a bit of random
   * x-axis drift.
   */
   fireProjectile(hero, projectileKey) {
    var velocityY = 200;
    switch (projectileKey) {
      case 'fireball':
      velocityY = 150;
      break;
      case 'arrow':
      velocityY = 450;
      break;
      case 'dagger':
      velocityY = 300;
      break;
    }

    var projectile = this.physics.add.sprite(hero.x, hero.y, projectileKey).anims.play(projectileKey + '-default', true);
    projectile.name = projectileKey;
    projectile.body.setVelocityY(velocityY + ((0.5 - Math.random()) * 100));
    projectile.body.setVelocityX((0.5 - Math.random()) * 150);
    this.projectiles.add(projectile);
  }

  projectileHitDemon(demon, projectile) {
    switch (projectile.name) {
      case 'fireball':
      this.demonHealth -= 10;
      break;
      case 'arrow':
      this.demonHealth -= 50;
      break;
      case 'dagger':
      this.demonHealth -= 20;
      break;
    }
    this.healthBar.setScale(Math.max(this.demonHealth/maxDemonHealth, 0), 1);
    projectile.destroy();
  }

  fighterAttack(hero) {
    this.stab(hero, 25);
    this.fighterCooldown = defaultFighterCooldown;

    // Decent chance of quicker cooldown
    if (Math.random() <= 0.5) {
      this.fighterCooldown = 1000;
    }
  }

  rogueAttack(hero) {
    // Mostly stabbing, sometimes a sparay of daggers.
    if (Math.random() <= 0.75) {
      this.stab(hero, 150);
    } else {
      this.fireProjectile(hero, 'dagger');
      this.fireProjectile(hero, 'dagger');
      this.fireProjectile(hero, 'dagger');
    }

    // Low chance of much quicker cooldown
    this.rogueCooldown = defaultRogueCooldown;
    if (Math.random() <= 0.2) {
      this.rogueCooldown = 700;
    }
  }

  /* Stab with a melee hero. Rogues and Fighters have different
   * effective ranges as well as different easing functions.
   */
   stab(hero, range) {
    var easingFn = 'Power0';
    var damage = 0;
    switch (hero.name) {
      case 'fighter':
      easingFn = Phaser.Math.Easing.Elastic.InOut;
      damage = 30;
      break;
      case 'rogue':
      easingFn = Phaser.Math.Easing.Expo.In;
      damage = 45;
      break;
    }

    this.tweens.add({
      targets: hero,
      duration: 300,
      y: hero.y + range,
      ease: easingFn,
      yoyo: true,
      onYoyo: this.checkStab,
      onYoyoParams: [hero.x, damage],
      onYoyoScope: this
    });
    // @TODO: check if in line with Demon and reduce health according
    // to hero strength or something.
  }

  checkStab(tween, target, x, damage) {
    if (((this.demon.x - 100) < x) && (x < (this.demon.x + 100))) {
      this.demonHealth -= damage;
      this.healthBar.setScale(Math.max(this.demonHealth/maxDemonHealth, 0), 1);
    }
  }

  gameEnd() {
    //play animation for hero level up
    //callback function to transition to next screen
  }
}
