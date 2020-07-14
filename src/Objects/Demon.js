import 'phaser';

export default class Demon extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;
        this.x = x;
        this.y = y;

        //  Player animations, turning, walking left and walking right.
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('demon', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'idle',
            frames: [ { key: 'demon', frame: 4 } ],
            frameRate: 20
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('demon', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

    }
}