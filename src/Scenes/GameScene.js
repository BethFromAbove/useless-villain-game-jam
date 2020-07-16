import 'phaser';

// Default hero attack cooldowns, weird numbers so they dont end up
// syncing.
var defaultWizardCooldown = 2812;
var defaultRangerCooldown = 2278;
var defaultFighterCooldown = 1533;
var defaultRogueCooldown = 1805;
var defaultBardCooldown = 1237;

var maxDemonHealth = 100;
var maxDemonPower = 200;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
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

    this.hero1 = null;
    this.hero2 = null;
    this.hero3 = null;
    this.hero4 = null;
    this.hero5 = null;

    this.hero1FiredAt = Date.now();
    this.hero2FiredAt = Date.now();
    this.hero3FiredAt = Date.now();
    this.hero4FiredAt = Date.now();
    this.hero5FiredAt = Date.now();

    // Collection of projectiles
    this.projectiles = new Phaser.GameObjects.Group(this);

    this.heroes = new Phaser.GameObjects.Group(this);
    this.demonFireballs = new Phaser.GameObjects.Group(this);

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

    this.physics.add.overlap(this.demon, this.projectiles, this.projectileHitDemon, null, this);
    this.physics.add.overlap(this.demonFireballs, this.heroes, this.killHero, null, this);

    this.debugMode = false;
    this.input.on('pointerdown', () => {
      if (this.debugMode) {
        // eslint-disable-next-line no-console
        console.log(this.cameras.main.scrollX + this.input.x, this.cameras.main.scrollY + this.input.y);
      }
    });

    // Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

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
    this.anims.create({
      key: 'demon-attack',
      frames: this.anims.generateFrameNumbers('demonAttack', { start: 0, end: 7 }),
      yoyo: true,
      frameRate: 20
    });
    this.anims.create({
      key: 'demon-fireball',
      frames: this.anims.generateFrameNumbers('demonFireball', { start: 0, end: 4 }),
      frameRate: 15,
      repeat: -1
    });

    // Wizard animations
    this.anims.create({
      key: 'wizard-idle',
      frames: this.anims.generateFrameNumbers('wizard', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'wizard-attack',
      frames: this.anims.generateFrameNumbers('wizardAttack', { start: 0, end: 3 }),
      duration: 500
    });

    // Ranger animations
    this.anims.create({
      key: 'ranger-idle',
      frames: this.anims.generateFrameNumbers('ranger', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'ranger-attack',
      frames: this.anims.generateFrameNumbers('rangerAttack', { start: 0, end: 3 }),
      duration: 500
    });

    // Fighter animations
    this.anims.create({
      key: 'fighter-idle',
      frames: this.anims.generateFrameNumbers('fighter', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'fighter-attack',
      frames: this.anims.generateFrameNumbers('fighterAttack', { start: 0, end: 3 }),
      duration: 500
    });

    // Rogue animations
    this.anims.create({
      key: 'rogue-idle',
      frames: this.anims.generateFrameNumbers('rogue', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'rogue-attack',
      frames: this.anims.generateFrameNumbers('rogueAttack', { start: 0, end: 3 }),
      duration: 500
    });

    // Bard animations
    this.anims.create({
      key: 'bard-idle',
      frames: this.anims.generateFrameNumbers('bard', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'bard-attack',
      frames: this.anims.generateFrameNumbers('bardAttack', { start: 0, end: 3 }),
      duration: 500
    });

    // Projectile animations
    this.anims.create({
      key: 'fireball-default',
      frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
      frameRate: 15,
      repeat: -1
    });
    this.anims.create({
      key: 'arrow-default',
      frames: [ { key: 'arrow', frame: 0 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'dagger-default',
      frames: [ { key: 'dagger', frame: 0 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'note1-default',
      frames: [ { key: 'note1', frame: 0 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'note2-default',
      frames: [ { key: 'note2', frame: 0 } ],
      frameRate: 20
    });

    // Level up animation
    this.anims.create({
      key: 'level-up-inc',
      frames: this.anims.generateFrameNumbers('levelUpInc', { start: 0, end: 5 }),
      frameRate: 15
    });
    this.anims.create({
      key: 'level-up-dec',
      frames: this.anims.generateFrameNumbers('levelUpDec', { start: 0, end: 5 }),
      frameRate: 15
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

    this.hero1 = this.createWizard(((0/2) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero2 = this.createRanger(((1/2) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));

    this.hero1Cooldown = defaultWizardCooldown;
    this.hero2Cooldown = defaultRangerCooldown;

    this.add.image(0, 0, 'foreground').setOrigin(0, 0).setDepth(7);

    this.add.image(68, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.healthBar = this.add.image(68, 573, 'healthBar').setOrigin(0, 0).setDepth(9);
    this.add.image(57, 570, 'healthBarFrame').setOrigin(0, 0).setDepth(10);
    this.add.image(432, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.powerBar = this.add.image(432, 573, 'powerBar').setOrigin(0, 0).setDepth(9);
    this.add.image(420, 570, 'powerBarFrame').setOrigin(0, 0).setDepth(10);
  }

  addLevel2() {
    this.add.image(0, 0, 'floor').setOrigin(0, 0);
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'lava').setOrigin(0, 0);

    this.addDemon();

    this.hero1 = this.createWizard (((0/3) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero2 = this.createFighter(((1/3) * this.canvas.width) + (this.randWidth() / 4), (420 + (Math.random() * 40)));
    this.hero3 = this.createRogue  (((2/3) * this.canvas.width) + (this.randWidth() / 4), (320 + (Math.random() * 40)));

    this.hero1Cooldown = defaultWizardCooldown;
    this.hero2Cooldown = defaultFighterCooldown;
    this.hero3Cooldown = defaultRogueCooldown;

    this.add.image(0, 0, 'foreground').setOrigin(0, 0).setDepth(7);

    this.add.image(68, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.healthBar = this.add.image(68, 573, 'healthBar').setOrigin(0, 0).setDepth(9);
    this.add.image(57, 570, 'healthBarFrame').setOrigin(0, 0).setDepth(10);
    this.add.image(432, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.powerBar = this.add.image(432, 573, 'powerBar').setOrigin(0, 0).setDepth(9);
    this.add.image(420, 570, 'powerBarFrame').setOrigin(0, 0).setDepth(10);
  }

  addLevel3() {
    this.add.image(0, 0, 'floor').setOrigin(0, 0);
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'lava').setOrigin(0, 0);

    this.addDemon();

    this.hero1 = this.createBard(((0/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero2 = this.createBard(((1/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero3 = this.createBard(((2/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero4 = this.createBard(((3/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero5 = this.createBard(((4/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));

    this.hero1Cooldown = defaultBardCooldown;
    this.hero2Cooldown = defaultBardCooldown;
    this.hero3Cooldown = defaultBardCooldown;
    this.hero4Cooldown = defaultBardCooldown;
    this.hero5Cooldown = defaultBardCooldown;

    this.add.image(0, 0, 'foreground').setOrigin(0, 0).setDepth(7);

    this.add.image(68, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.healthBar = this.add.image(68, 573, 'healthBar').setOrigin(0, 0).setDepth(9);
    this.add.image(57, 570, 'healthBarFrame').setOrigin(0, 0).setDepth(10);
    this.add.image(432, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.powerBar = this.add.image(432, 573, 'powerBar').setOrigin(0, 0).setDepth(9);
    this.add.image(420, 570, 'powerBarFrame').setOrigin(0, 0).setDepth(10);
  }

  addLevel4() {
    this.add.image(0, 0, 'floor').setOrigin(0, 0);
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.add.image(0, 0, 'lava').setOrigin(0, 0);

    this.addDemon();

    this.hero1 = this.createWizard (((0/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero2 = this.createRanger (((1/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));
    this.hero3 = this.createFighter(((2/5) * this.canvas.width) + (this.randWidth() / 4), (420 + (Math.random() * 40)));
    this.hero4 = this.createRogue  (((3/5) * this.canvas.width) + (this.randWidth() / 4), (320 + (Math.random() * 40)));
    this.hero5 = this.createBard   (((4/5) * this.canvas.width) + (this.randWidth() / 4), (220 + (Math.random() * 40)));

    this.hero1Cooldown = defaultWizardCooldown;
    this.hero2Cooldown = defaultRangerCooldown;
    this.hero3Cooldown = defaultFighterCooldown;
    this.hero4Cooldown = defaultRogueCooldown;
    this.hero5Cooldown = defaultBardCooldown;

    this.add.image(0, 0, 'foreground').setOrigin(0, 0).setDepth(7);

    this.add.image(68, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.healthBar = this.add.image(68, 573, 'healthBar').setOrigin(0, 0).setDepth(9);
    this.add.image(57, 570, 'healthBarFrame').setOrigin(0, 0).setDepth(10);
    this.add.image(432, 573, 'barBackground').setOrigin(0, 0).setDepth(8);
    this.powerBar = this.add.image(432, 573, 'powerBar').setOrigin(0, 0).setDepth(9);
    this.add.image(420, 570, 'powerBarFrame').setOrigin(0, 0).setDepth(10);
  }

  addDemon(x = 400, y = 500) {
    this.demon = this.physics.add.sprite(x, y, 'demon').anims.play('demon-idle', true);
    this.physics.world.enable(this.demon);
    this.demon.body.setCollideWorldBounds(true);
    this.demon.setDepth(5);
    this.demonHealth = maxDemonHealth;
    this.demonPower = 0;
  }

  createWizard(x = 0, y = 220) {
    var wizard = this.physics.add.sprite(0, 260, 'wizard').anims.play('wizard-idle', true);
    wizard.name = 'wizard';
    this.physics.world.enable(wizard);
    wizard.body.setCollideWorldBounds(true);
    this.tweens.add({
      targets: wizard,
      duration: 2000,
      y: y,
      x: x
    });
    this.heroes.add(wizard);
    return wizard;
  }

  createRanger(x = 0, y = 220) {
    var ranger = this.physics.add.sprite(0, 260, 'ranger').anims.play('ranger-idle', true);
    ranger.name = 'ranger';
    this.physics.world.enable(ranger);
    ranger.body.setCollideWorldBounds(true);
    this.tweens.add({
      targets: ranger,
      duration: 2000,
      y: y,
      x: x
    });
    this.heroes.add(ranger);
    return ranger;
  }

  createFighter(x = 0, y = 220) {
    var fighter = this.physics.add.sprite(0, 260, 'fighter').anims.play('fighter-idle', true);
    fighter.name = 'fighter';
    this.physics.world.enable(fighter);
    fighter.body.setCollideWorldBounds(true);
    this.tweens.add({
      targets: fighter,
      duration: 2000,
      y: y,
      x: x
    });
    this.heroes.add(fighter);
    return fighter;
  }

  createRogue(x = 0, y = 220) {
    var rogue = this.physics.add.sprite(0, 260, 'rogue').anims.play('rogue-idle', true);
    rogue.name = 'rogue';
    this.physics.world.enable(rogue);
    rogue.body.setCollideWorldBounds(true);
    this.tweens.add({
      targets: rogue,
      duration: 2000,
      y: y,
      x: x
    });
    this.heroes.add(rogue);
    return rogue;
  }

  createBard(x = 0, y = 220) {
    var bard = this.physics.add.sprite(0, 260, 'bard').anims.play('bard-idle', true);
    bard.name = 'bard';
    this.physics.world.enable(bard);
    bard.body.setCollideWorldBounds(true);
    this.tweens.add({
      targets: bard,
      duration: 2000,
      y: y,
      x: x
    });
    this.heroes.add(bard);
    return bard;
  }

  update() {
    //check victory condition
    if ((this.demonHealth <= 0) && !this.gameEnded) {
      //end the game
      this.gameEnded = true;
      this.demon.anims.play('demon-faint', true);
      this.demon.anims.stopOnFrame(8);
      this.demon.body.setVelocityX(0);
      this.demon.once('animationcomplete', this.gameEnd);
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

      //demon power
      this.demonPower++;
      if (this.demonPower >= maxDemonPower) {
        this.demonAttack();
        this.demonPower = 0;
      }
      this.powerBar.setScale(Math.max(this.demonPower/maxDemonPower, 0), 1);

      // Heroes attack at different intervals
      var now = Date.now();

      if ((this.hero1 !== null) && (now > (this.hero1FiredAt + this.hero1Cooldown))) {
        this.attack(this.hero1);
        this.hero1FiredAt = now;
      }
      if ((this.hero2 !== null) && (now > (this.hero2FiredAt + this.hero2Cooldown))) {
        this.attack(this.hero2);
        this.hero2FiredAt = now;
      }
      if ((this.hero3 !== null) && (now > (this.hero3FiredAt + this.hero3Cooldown))) {
        this.attack(this.hero3);
        this.hero3FiredAt = now;
      }
      if ((this.hero4 !== null) && (now > (this.hero4FiredAt + this.hero4Cooldown))) {
        this.attack(this.hero4);
        this.hero4FiredAt = now;
      }
      if ((this.hero5 !== null) && (now > (this.hero5FiredAt + this.hero5Cooldown))) {
        this.attack(this.hero5);
        this.hero5FiredAt = now;
      }
    }

    // Kill projectiles that are off screen
    this.projectiles.children.each((p) => {
      if (this.offscreen(p)) {
        p.destroy();
      }
    });

    // Kill fireballs that are off screen
    this.demonFireballs.children.each((f) => {
      if (this.offscreen(f)) {
        f.destroy();
      }
    });
  }

  /* Predicate to determine if a sprite has gone off screen.
  */
  offscreen(s) {
    return (s.x < 0 || s.x > this.canvas.width || s.y < 0 || s.y > this.canvas.height);
  }

  demonAttack() {
    this.demon.anims.play('demon-attack', true);
    this.demon.once('animationcomplete', () => {this.demon.anims.play('demon-idle')});

    var demonFireball = this.physics.add.sprite((this.demon.x + 60), this.demon.y, 'demonFireball').anims.play('demon-fireball', true);
    demonFireball.body.setVelocityY(-300);
    this.demonFireballs.add(demonFireball);
  }

  killHero(fireball, hero) {
    var scene = this;
    fireball.destroy();
    scene.demon.body.setVelocityX(0);

    hero.setTint(0xff0000);
    scene.gameEnded = true;

    var timer = scene.time.delayedCall(1000, () => {
      //replay level
      var text = scene.add.image(70, -100, 'dontKillText').setOrigin(0, 0);
      scene.tweens.add({
        targets: text,
        duration: 2000,
        y: 300,
        completeDelay: 1500,
        onCompleteParams: [text],
        onComplete: (tween, target, text) => {
          text.destroy();
          var target = 'Game';
          scene.cameras.main.fadeOut(500);
          scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
              scene.scene.start(target);
              scene.scene.get(target).events.once(
                Phaser.Scenes.Events.CREATE,
                () => scene.scene.get(target).cameras.main.fadeIn(500),
                );
            },
            );
        }
      })
    }, [], this);  // delay in ms 
  }

  /* Attack with a hero.
  */
  attack(hero) {
    hero.anims.play(hero.name + '-attack', true);
    hero.once('animationcomplete', () => {hero.anims.play(hero.name + '-idle', true)});
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
      break;
      case 'bard':
      this.fireProjectile(hero, 'note1');
      this.fireProjectile(hero, 'note1');
      this.fireProjectile(hero, 'note2');
      break
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
      case 'note1':
      case 'note2':
      velocityY = 60;
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
      case 'note1':
      case 'note2':
      this.demonHealth -= 1;
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
    var scene = this.scene;

    //play animation for hero level up
    scene.heroes.children.each((h) => {
      var levelUpSprite = this.scene.physics.add.sprite(h.x, (h.y - 100), 'levelUpInc').anims.play('level-up-inc', true);
      levelUpSprite.once('animationcomplete', () => {
        levelUpSprite.setTexture('levelUpDec').anims.play('level-up-dec', true);
        levelUpSprite.once('animationcomplete', () => {
          levelUpSprite.destroy();
          scene.tweens.add({
            targets: h,
            duration: 2000,
            y: 260,
            x: 800,
            onCompleteParams: [h],
            onComplete: (tween, target, hero) => {hero.destroy()}
          });
        });
      });
    });

    var text = scene.add.image(170, -100, 'goodWorkText').setOrigin(0, 0);
    scene.tweens.add({
      targets: text,
      duration: 2000,
      y: 300,
      completeDelay: 1500,
      onCompleteParams: [text],
      onComplete: (tween, target, text) => {
        text.destroy();
        scene.model.level++;
        if (scene.model.level <= 4) {
          var target = 'Game';
          scene.cameras.main.fadeOut(500);
          scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
              scene.scene.start(target);
              scene.scene.get(target).events.once(
                Phaser.Scenes.Events.CREATE,
                () => scene.scene.get(target).cameras.main.fadeIn(500),
                );
            });
        } else {
          var target = 'End';
          scene.cameras.main.fadeOut(500);
          scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
              scene.scene.start(target);
              scene.scene.get(target).events.once(
                Phaser.Scenes.Events.CREATE,
                () => scene.scene.get(target).cameras.main.fadeIn(500),
                );
            });
        }
      }
    })
  }
}
