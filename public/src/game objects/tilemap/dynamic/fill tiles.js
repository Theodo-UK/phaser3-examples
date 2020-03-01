var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var controls;
var marker;
var map;
var pollutionStatus;
var pollutionValue = 0;
var POLLUTION_TICKER = 1000

var trees = []
var poos = [1, 2, 3]

function getUpdatedPolutionValue() {
    // Get absorbed polution from trees
    var treePolutionAbsorbed = trees.length;
    // Get produced polution from poo
    var pooPolutionProduced = poos.length;

    var pollutionUpdate = pooPolutionProduced - treePolutionAbsorbed;

    pollutionValue += pollutionUpdate
    pollutionStatus.setText('Polution level: ' + pollutionValue);
}

function preload ()
{
    this.load.image('tiles', 'assets/tilemaps/tiles/map5.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tiles = map.addTilesetImage('Desert', 'tiles');
    var layer = map.createDynamicLayer('Ground', tiles, 0, 0);

    marker = this.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.strokeRect(0, 0,  map.tileWidth,  map.tileHeight);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    pollutionStatus = this.add.text(16, 16, 'Polution level: ' + pollutionValue, {
        fontFamily: 'Arial',
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: 'rgba(0,0,0,0.3)',
        fill: '#ff0000'
    });
    pollutionStatus.setScrollFactor(0);
    setInterval(getUpdatedPolutionValue, 1000);
}

function update (time, delta)
{
    controls.update(delta);

    var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    var pointerTileX = map.worldToTileX(worldPoint.x);
    var pointerTileY = map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    marker.x = map.tileToWorldX(pointerTileX);
    marker.y = map.tileToWorldY(pointerTileY);

    if (this.input.manager.activePointer.isDown)
    {
        var tile = map.getTileAtWorldXY(worldPoint.x, worldPoint.y);
        if (tile.index === 30) {
            if (!trees.find(tree => tree.x === pointerTileX && tree.y === pointerTileY )) {
                trees.push({x: pointerTileX, y: pointerTileY})
            }
            map.fill(48, pointerTileX, pointerTileY, 1, 1);
        }
        // Fill the tiles within an area with sign posts (tile id = 46)
    }

}