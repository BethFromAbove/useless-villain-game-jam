import 'phaser';
import Button from '../Objects/Button';

export default class InstructionsScene extends Phaser.Scene {
	create() {
	    const { config } = this.game;
	    this.model = this.sys.game.globals.model;

	    this.add.image(config.width / 2, config.height / 2, 'background-instructions');

	    this.menuButton = new Button(this, 480, config.height * 0.85, 'backButton', 'backButtonPressed', 'BalloonSelect');
	    this.gameButton = new Button(this, 630, config.height * 0.85, 'playButton', 'playButtonPressed', 'Game', true);

    	const model = this.sys.game.globals.model;
	}

	update() {
		
	}
}
