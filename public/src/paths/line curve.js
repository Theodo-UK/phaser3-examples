var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var path;
var line;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();

    path = { t: 0, vec: new Phaser.Math.Vector2() };

    line = new Phaser.Curves.Line(new Phaser.Math.Vector2(100, 100), new Phaser.Math.Vector2(600, 400));

    this.tweens.add({
        targets: path,
        t: 1,
        ease: 'Sine.easeInOut',
        duration: 2000,
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    graphics.clear();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.lineBetween(line.v1.x, line.v1.y, line.v2.x, line.v2.y);

    line.getPoint(path.t, path.vec);

    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(path.vec.x - 8, path.vec.y - 8, 16, 16);
}