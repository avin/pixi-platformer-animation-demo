import _ from 'lodash';
import Background from './Backgorund.es6';
import Ground from './Ground.es6';
import Player from './Player.es6';

export default class {

    constructor(options) {

        // Constants
        this.GAME_STATES = {
            GAME_START: 0,
            GAME_OVER: 1,
            PLAY: 2,
            PAUSE: 3,
        };

        this.options = {
            graphics: {
                width: _.get(options, 'width', 256),
                height: _.get(options, 'height', 224),
                scale:  _.get(options, 'scale', 2),
                antialias:  true,
            }
        };

        //Приемник нажатий клавиш
        this.listener = new window.keypress.Listener();

        //Внутреигровой таймер
        this.timer = 0;

        //Массив игровых моделей
        this.models = {};

        //Массив временных интервалов
        this.intervals = [];

        //Состояние игры
        this.gameState = null;

        this._initGraphic();
        this._initControl();
    }

    /**
     * Инициализация графики
     * @private
     */
    _initGraphic() {
        // create a renderer instance.
        this.renderer = PIXI.autoDetectRenderer(this.options.graphics.width, this.options.graphics.height, {
            antialias: this.options.graphics.antialias,
        });

        //Растягиваем канву
        this.renderer.view.style.width = `${this.options.graphics.width * this.options.graphics.scale}px`;
        this.renderer.view.style.height = `${this.options.graphics.height * this.options.graphics.scale}px`;

        // add the renderer view element to the DOM
        document.body.appendChild(this.renderer.view);

        //Create a container object called the `stage`
        this.stage = new PIXI.Container();

        requestAnimationFrame(this._loop.bind(this));
    }

    /**
     * Инициализация управления
     * @private
     */
    _initControl() {
        this.listener.register_many([
            {
                "keys": "d",
                "is_exclusive": true,
                "on_keydown": () => {
                    this.models.player.moveRight();
                },
                "on_keyup": (e) => {
                    this.models.player.stopRight();
                },
            },
            {
                "keys": "a",
                "is_exclusive": true,
                "on_keydown": () => {
                    this.models.player.moveLeft();
                },
                "on_keyup": (e) => {
                    this.models.player.stopLeft();
                },
            },
            {
                "keys": "w",
                "is_exclusive": true,
                "on_keydown": () => {
                    this.models.player.jump();
                },
                "on_keyup": (e) => {
                    this.models.player.stopJump();
                },
            },
        ]);
    }

    /**
     * Внутри-игровой цикл событий
     * @private
     */
    _loop() {
        requestAnimationFrame(this._loop.bind(this));

        //Рендерим картинку
        this.renderer.render(this.stage);

        //Обновляем состояния моделей
        if (this.gameState == this.GAME_STATES.PLAY) {
            this.timer++;

            _.each(this.models, (model) => {
                if (_.isFunction(model.update)) {
                    model.update()
                }
            });
        }
    }

    /**
     * Обнуление внутренних массивов и счетчиков
     * @private
     */
    _reset() {
        //Убираем все графиеские элементы со сцены
        while (this.stage.children[0]) {
            this.stage.removeChild(this.stage.children[0]);
        }

        //Отключаем все интрвальныей действия
        _.each(this.intervals, (intervalId) => {
            clearInterval(intervalId);
        });
    }

    /**
     * Начать новую игру
     */
    newGame() {
        this._reset();
        this.gameState = this.GAME_STATES.PLAY;

        //Инициализируем модели сцены
        this.models.background = new Background(this);
        this.models.ground = new Ground(this);
        this.models.player = new Player(this);

    }

    /**
     * Поставить на паузу
     */
    pauseGame() {

    }

    /**
     * Снять с паузы
     */
    resumeGame() {

    }

    /**
     * Игра проиграна
     */
    gameOverGame() {

    }
}