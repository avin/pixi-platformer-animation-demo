export default class {

    constructor(game) {
        this.game = game;
        this.displayObject = null;
        this.textureSrc = "dist/resources/images/bakgrounds/Stations/Map Station.bmp";
        this.textureSize = {x: 256, y: 193};

        //Коэфициент скорости движения на экране
        this.worldMoveCoefficient = 0.5;

        this._initDisplayObject()
    }

    /**
     * Инициализация графического объекта
     * @private
     */
    _initDisplayObject() {
        PIXI.loader
            .add(this.textureSrc)
            .load(() => {
                this.displayObject = new PIXI.extras.TilingSprite(
                    PIXI.loader.resources[this.textureSrc].texture,
                    this.textureSize.x, this.textureSize.y
                );

                this.displayObject.position.x = 0;
                this.displayObject.position.y = 0;

                this.displayObject.tilePosition.x = 0;
                this.displayObject.tilePosition.y = 0;

                this.game.stage.addChild(this.displayObject);
            });
    }

    /**
     * Обновление модели
     */
    update() {
        //Двигаем в зависимости от положения игрока
        if (this.displayObject) {
            this.displayObject.tilePosition.x = -this.game.models.player.position.x * this.worldMoveCoefficient;
        }
    }

}