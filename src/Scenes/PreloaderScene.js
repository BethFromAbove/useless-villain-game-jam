import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    // add logo image
    const logo = this.add.image(400, 120, 'logo');
    logo.setScale(0.45);

    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100, 10)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // load images here

    this.load.spritesheet('demon', 'assets/demonRest.png', { frameWidth: 200, frameHeight: 200 });
    this.load.spritesheet('demonFaint', 'assets/demonfaint.png', { frameWidth: 200, frameHeight: 200 });
    this.load.spritesheet('demonAttack', 'assets/demonHandRaise.png', { frameWidth: 200, frameHeight: 200 });
    this.load.spritesheet('demonFireball', 'assets/demonfire.png', { frameWidth: 42, frameHeight: 86 });

    this.load.spritesheet('wizard', 'assets/Wizardwalking.png', { frameWidth: 70, frameHeight: 137 });
    this.load.spritesheet('ranger', 'assets/rangerwalking.png', { frameWidth: 71, frameHeight: 120 });
    this.load.spritesheet('fighter', 'assets/knightwalking.png', { frameWidth: 76, frameHeight: 113 });
    this.load.spritesheet('rogue', 'assets/rougewalking.png', { frameWidth: 72, frameHeight: 113 });
    this.load.spritesheet('bard', 'assets/bardwalking.png', { frameWidth: 73, frameHeight: 121 });

    this.load.spritesheet('wizardAttack', 'assets/wizardspellsprite.png', { frameWidth: 88, frameHeight: 138 });
    this.load.spritesheet('rangerAttack', 'assets/bowsprite.png', { frameWidth: 84, frameHeight: 125 });
    this.load.spritesheet('fighterAttack', 'assets/swordsprite.png', { frameWidth: 110, frameHeight: 114 });
    this.load.spritesheet('rogueAttack', 'assets/rougewalking.png', { frameWidth: 72, frameHeight: 113 });
    this.load.spritesheet('bardAttack', 'assets/bardplayingsprite.png', { frameWidth: 75, frameHeight: 140 });

    this.load.spritesheet('fireball', 'assets/wizardspell.png', { frameWidth: 27, frameHeight: 28 });
    this.load.image('arrow', 'assets/Arrow.png');
    this.load.image('dagger', 'assets/dagger.png');
    this.load.image('note1', 'assets/music1.png');
    this.load.image('note2', 'assets/note2.png');

    this.load.spritesheet('levelUpInc', 'assets/LevelUpapp.png', { frameWidth: 86, frameHeight: 93 });
    this.load.spritesheet('levelUpDec', 'assets/LevelUpdis.png', { frameWidth: 86, frameHeight: 93 });

    this.load.image('floor', 'assets/Floor.png');
    this.load.image('background', 'assets/Background.png');
    this.load.image('lava', 'assets/Lava.png');
    this.load.image('foreground', 'assets/Foreground.png');

    this.load.image('paperBackground', 'assets/Paperonbackground.png');
    this.load.image('instructionsBackground', 'assets/MainMenu.png');
    this.load.image('optionsBackground', 'assets/OptionsBackground.png');
    this.load.image('endBackground', 'assets/EndLetter.png');
    this.load.image('creditsBackground', 'assets/CreditsBackground.png');

    this.load.image('barBackground', 'assets/barbackground.png');
    this.load.image('healthBar', 'assets/greenbar.png');
    this.load.image('healthBarFrame', 'assets/powerbarframe.png');
    this.load.image('powerBar', 'assets/powerbar.png');
    this.load.image('powerBarFrame', 'assets/powerbarframe.png');

    this.load.image('goodWorkText', 'assets/keepitup.png');
    this.load.image('adventureresApproachText', 'assets/AdventurersApproach.png');
    this.load.image('dontKillText', 'assets/dontkillheroes.png');

    this.load.image('backButtonUp', 'assets/BackButtonUp.png');
    this.load.image('backButtonDown', 'assets/BackButtonDown.png');
    this.load.image('optionsButtonUp', 'assets/OptionsButtonUp.png');
    this.load.image('optionsButtonDown', 'assets/OptionsButtonDown.png');
    this.load.image('creditsButtonUp', 'assets/CreditsButtonUp.png');
    this.load.image('creditsButtonDown', 'assets/CreditsButtonDown.png');
    this.load.image('playButtonUp', 'assets/PlayButtonUp.png');
    this.load.image('playButtonDown', 'assets/PlayButtonDown.png');
    this.load.image('menuButtonUp', 'assets/MenuButtonUP.png');
    this.load.image('menuButtonDown', 'assets/MenuButtonDown.png');

    this.load.image('checkedBox', 'assets/CheckedBox.png');
    this.load.image('uncheckedBox', 'assets/UnCheckedBox.png');

    this.load.image('logo', 'assets/logo.png');

    // Audio
    this.load.audio('bgMusic', ['assets/audio/theme.mp3']);
    

    // remove progress bar when complete
    this.load.on('complete', () => {
      this.game.registry.set('bgMusic', this.sound.add('bgMusic', { volume: 0.5, loop: true }));
      this.ready();
    });
  }

  ready() {
    this.cameras.main.fadeOut(1000);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.scene.start('Title');
        this.scene.get('Title').cameras.main.fadeIn(1000);
      },
    );
  }
}
