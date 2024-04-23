var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var ball;
var cursors;

// Define shoot speed
const shootSpeed = 80000; // Adjust the value as needed

let aimingLine;
let shooting = false;
let charge = 0;

function preload() {
    this.load.image('ball', 'assets/basketball.png');
    this.load.image('hoop', 'assets/hoop.png');
      // Load aiming line image
      this.load.image('aimingLine', 'assets/aiming_line.png');
}

function create() {
      // Create basketball ball sprite
      ball = this.physics.add.sprite(300, 450, 'ball').setScale(0.25);

      // Create basketball hoop sprite
      hoop = this.physics.add.sprite(900, 250, 'hoop').setScale(0.5);

    // Set bounds to the world
    this.physics.world.setBounds(0, 0, 800, 600);

    // Prevent the camera from moving out of bounds
    this.cameras.main.setBounds(0, 0, 800, 600);

    // Make the camera follow the ball
    this.cameras.main.startFollow(ball, true);

    cursors = this.input.keyboard.createCursorKeys();
}


function update() {
    // Shooting logic
    if (this.input.activePointer.isDown) {
        shooting = true;
        charge += 1; // Increase charge
        // Display aiming line
        if (!aimingLine) {
            aimingLine = this.add.sprite(ball.x, ball.y, 'aimingLine');
        }
        const directionX = this.input.activePointer.worldX - ball.x;
        const directionY = this.input.activePointer.worldY - ball.y;
        const length = Math.sqrt(directionX ** 2 + directionY ** 2);
        const normalizedDirectionX = directionX / length;
        const normalizedDirectionY = directionY / length;
        aimingLine.setRotation(Math.atan2(normalizedDirectionY, normalizedDirectionX));
        aimingLine.setScale(charge * 0.05, 0.1);
    } else if (shooting) {
        // Shoot the ball
        const directionX = this.input.activePointer.worldX - ball.x;
        const directionY = this.input.activePointer.worldY - ball.y;
        const length = Math.sqrt(directionX ** 2 + directionY ** 2);
        const normalizedDirectionX = directionX / length;
        const normalizedDirectionY = directionY / length;
        ball.setVelocityX(normalizedDirectionX * shootSpeed * charge / 100);
        ball.setVelocityY(normalizedDirectionY * shootSpeed * charge / 100);
        // Reset charge and remove aiming line
        charge = 0;
        shooting = false;
        if (aimingLine) {
            aimingLine.destroy();
            aimingLine = null;
        }
    } else {
        // Stop the ball if no input is detected
        ball.setVelocity(0);
    }
}