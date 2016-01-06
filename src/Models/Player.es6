export default class {

    constructor(game) {

        //Направления взгляда
        this.DIMENTIONS = {
            RIGHT: 0,
            LEFT: 1,
        };

        //Состояния анимации
        this.ANIMATION_INDEXES = {
            WALK_RIGHT: 0,
            WALK_LEFT: 1,
            JUMP_RIGHT_UP: 2,
            JUMP_RIGHT_DOWN: 3,
            JUMP_LEFT_UP: 4,
            JUMP_LEFT_DOWN: 5,
            STAY_LEFT: 6,
            STAY_RIGHT: 7,
        };

        this.game = game;
        this.displayObject = null;
        this.textureSrc = "dist/resources/images/sprites/samus.json";
        this.textureSize = {x: 26, y: 37};

        this.position = {x: 0, y: 0};
        this.moveVector = {x: 0, y: 0};

        this.maxMoveVectorY = 2;
        this.minMoveVectorY = -2;

        this.gravity = -0.05;

        this.dimention = this.DIMENTIONS.RIGHT;

        this.state = {
            move: {
                left: false,
                right: false,
                up: false
            }
        };

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
                //Создаем анимационные блоки из спрайтов
                let walkRightAnimationSprites = [];
                let walkLeftAnimationSprites = [];
                let jumpRightUpAnimationSprites = [];
                let jumpRightDownAnimationSprites = [];
                let jumpLeftUpAnimationSprites = [];
                let jumpLeftDownAnimationSprites = [];
                let stayRightAnimationSprites = [];
                let stayLeftAnimationSprites = [];

                for (let i = 0; i <= 9; i++) {
                    walkLeftAnimationSprites.push(PIXI.Texture.fromFrame(`walk_left_${i}.png`));
                    walkRightAnimationSprites.push(PIXI.Texture.fromFrame(`walk_right_${i}.png`));
                }

                for (let i = 0; i <= 4; i++) {
                    jumpRightUpAnimationSprites.push(PIXI.Texture.fromFrame(`jump_right_up_${i}.png`));
                    jumpLeftUpAnimationSprites.push(PIXI.Texture.fromFrame(`jump_left_up_${i}.png`));
                }

                for (let i = 0; i <= 3; i++) {
                    jumpRightDownAnimationSprites.push(PIXI.Texture.fromFrame(`jump_right_down_${i}.png`));
                    jumpLeftDownAnimationSprites.push(PIXI.Texture.fromFrame(`jump_left_down_${i}.png`));
                }


                for (let i = 0; i <= 2; i++) {
                    stayRightAnimationSprites.push(PIXI.Texture.fromFrame(`stay_right_${i}.png`));
                    stayLeftAnimationSprites.push(PIXI.Texture.fromFrame(`stay_left_${i}.png`));
                }

                let walkRightAnimation = new PIXI.extras.MovieClip(walkRightAnimationSprites);
                walkRightAnimation.anchor.x = 0.5;
                walkRightAnimation.anchor.y = 1;
                walkRightAnimation.animationSpeed = 0.2;
                walkRightAnimation.visible = false;

                let walkLeftAnimation = new PIXI.extras.MovieClip(walkLeftAnimationSprites);
                walkLeftAnimation.anchor.x = 0.5;
                walkLeftAnimation.anchor.y = 1;
                walkLeftAnimation.animationSpeed = 0.2;
                walkLeftAnimation.visible = false;

                let jumpRightUpAnimation = new PIXI.extras.MovieClip(jumpRightUpAnimationSprites);
                jumpRightUpAnimation.anchor.x = 0.5;
                jumpRightUpAnimation.anchor.y = 1;
                jumpRightUpAnimation.animationSpeed = 0.1;
                jumpRightUpAnimation.loop = false;
                jumpRightUpAnimation.visible = false;

                let jumpRightDownAnimation = new PIXI.extras.MovieClip(jumpRightDownAnimationSprites);
                jumpRightDownAnimation.anchor.x = 0.5;
                jumpRightDownAnimation.anchor.y = 1;
                jumpRightDownAnimation.animationSpeed = 0.1;
                jumpRightDownAnimation.loop = false;
                jumpRightDownAnimation.visible = false;

                let jumpLeftUpAnimation = new PIXI.extras.MovieClip(jumpLeftUpAnimationSprites);
                jumpLeftUpAnimation.anchor.x = 0.5;
                jumpLeftUpAnimation.anchor.y = 1;
                jumpLeftUpAnimation.animationSpeed = 0.1;
                jumpLeftUpAnimation.loop = false;
                jumpLeftUpAnimation.visible = false;

                let jumpLeftDownAnimation = new PIXI.extras.MovieClip(jumpLeftDownAnimationSprites);
                jumpLeftDownAnimation.anchor.x = 0.5;
                jumpLeftDownAnimation.anchor.y = 1;
                jumpLeftDownAnimation.animationSpeed = 0.1;
                jumpLeftDownAnimation.loop = false;
                jumpLeftDownAnimation.visible = false;

                let stayRightAnimation = new PIXI.extras.MovieClip(stayRightAnimationSprites);
                stayRightAnimation.anchor.x = 0.5;
                stayRightAnimation.anchor.y = 1;
                stayRightAnimation.animationSpeed = 0.05;
                stayRightAnimation.visible = false;

                let stayLeftAnimation = new PIXI.extras.MovieClip(stayLeftAnimationSprites);
                stayLeftAnimation.anchor.x = 0.5;
                stayLeftAnimation.anchor.y = 1;
                stayLeftAnimation.animationSpeed = 0.05;
                stayLeftAnimation.visible = false;

                // create an explosion MovieClip
                this.displayObject = new PIXI.Container();

                this.displayObject.addChildAt(walkRightAnimation, this.ANIMATION_INDEXES.WALK_RIGHT);
                this.displayObject.addChildAt(walkLeftAnimation, this.ANIMATION_INDEXES.WALK_LEFT);
                this.displayObject.addChildAt(jumpRightUpAnimation, this.ANIMATION_INDEXES.JUMP_RIGHT_UP);
                this.displayObject.addChildAt(jumpRightDownAnimation, this.ANIMATION_INDEXES.JUMP_RIGHT_DOWN);
                this.displayObject.addChildAt(jumpLeftUpAnimation, this.ANIMATION_INDEXES.JUMP_LEFT_UP);
                this.displayObject.addChildAt(jumpLeftDownAnimation, this.ANIMATION_INDEXES.JUMP_LEFT_DOWN);
                this.displayObject.addChildAt(stayLeftAnimation, this.ANIMATION_INDEXES.STAY_LEFT);
                this.displayObject.addChildAt(stayRightAnimation, this.ANIMATION_INDEXES.STAY_RIGHT);

                this.displayObject.position.x = this.game.options.graphics.width / 2;
                this.displayObject.position.y = 193;

                this.game.stage.addChild(this.displayObject);
            });
    }

    /**
     * Прыгнуть
     */
    jump() {
        this.state.move.up = true;
    }

    /**
     * Движение вправо
     */
    moveRight() {
        this.state.move.right = true;

        //Только если на платформе
        if (this.position.y <= 0) {
            this.moveVector.x = +1;
        }
    }

    /**
     * Движение влево
     */
    moveLeft() {
        this.state.move.left = true;
    }


    stopJump() {
        this.state.move.up = false;
    }

    stopLeft() {
        this.state.move.left = false;
    }

    stopRight() {
        this.state.move.right = false;
    }

    /**
     * Обновление модели
     */
    update() {

        //Задаем вектора движения
        //Вверх
        if (this.state.move.up) {
            //Только если на платформе
            if (this.position.y <= 0) {
                this.moveVector.y = this.maxMoveVectorY;
            }
        }
        //Влево
        if (this.state.move.left == true && this.state.move.right == false) {
            //Только если на платформе
            if (this.position.y <= 0) {
                this.moveVector.x = -1;

            }

        }
        //Вправо
        if (this.state.move.left == false && this.state.move.right == true) {
            //Только если на платформе
            if (this.position.y <= 0) {
                this.moveVector.x = +1;
            }
        }

        //Двигаем в игровых координатах X
        this.position.x += this.moveVector.x;

        //Движение по Y только если не ниже платформы
        if (this.position.y >= 0) {
            let newPositionY = this.position.y + this.moveVector.y;
            if (newPositionY > 0) {
                this.position.y = newPositionY;
            } else {
                this.position.y = 0
            }

        }

        //Действие гравитации на вектор Y
        if (this.moveVector.y > this.minMoveVectorY) {
            this.moveVector.y += this.gravity;
        }

        //Определяем направление взгляда
        if (this.moveVector.x > 0){
            this.dimention = this.DIMENTIONS.RIGHT;
        } if (this.moveVector.x < 0) {
            this.dimention = this.DIMENTIONS.LEFT;
        }

        //Двигаем графический объект
        if (this.displayObject) {
            this.displayObject.position.y = 193 - this.position.y;

            //Перематываем на старт все скрытые анимации
            _.each(this.displayObject.children, (animation, animationId) => {
                if (animation.visible === false){
                    animation.gotoAndPlay(0);
                }
            });


            //Анимируем спрайты на земле
            if (this.position.y <= 0) {
                if (this.moveVector.x > 0){
                    //Двигаемся вправо
                    _.each(this.displayObject.children, (animation, animationId) => {
                        animation.visible = animationId == this.ANIMATION_INDEXES.WALK_RIGHT;
                    });
                } if (this.moveVector.x < 0) {
                    //Двигаемся влево
                    _.each(this.displayObject.children, (animation, animationId) => {
                        animation.visible = animationId == this.ANIMATION_INDEXES.WALK_LEFT;
                    });
                } else if (this.moveVector.x == 0) {
                    //Стоим на месте
                    if (this.dimention == this.DIMENTIONS.RIGHT){
                        _.each(this.displayObject.children, (animation, animationId) => {
                            animation.visible = animationId == this.ANIMATION_INDEXES.STAY_RIGHT;
                        });
                    } else if (this.dimention == this.DIMENTIONS.LEFT) {
                        _.each(this.displayObject.children, (animation, animationId) => {
                            animation.visible = animationId == this.ANIMATION_INDEXES.STAY_LEFT;
                        });
                    }
                }
            }
            //Анимируем спрайты в воздухе
            else {
                //Поднимаемся
                if (this.moveVector.y > 0){
                    if (this.dimention == this.DIMENTIONS.RIGHT){
                        _.each(this.displayObject.children, (animation, animationId) => {
                            animation.visible = animationId == this.ANIMATION_INDEXES.JUMP_RIGHT_UP;
                        });

                    } else if (this.dimention == this.DIMENTIONS.LEFT) {
                        _.each(this.displayObject.children, (animation, animationId) => {
                            animation.visible = animationId == this.ANIMATION_INDEXES.JUMP_LEFT_UP;
                        });

                    }
                }
                //Опускаемся
                else {

                    if (this.dimention == this.DIMENTIONS.RIGHT){
                        _.each(this.displayObject.children, (animation, animationId) => {
                            animation.visible = animationId == this.ANIMATION_INDEXES.JUMP_RIGHT_DOWN;
                        });
                    } else if (this.dimention == this.DIMENTIONS.LEFT) {
                        _.each(this.displayObject.children, (animation, animationId) => {
                            animation.visible = animationId == this.ANIMATION_INDEXES.JUMP_LEFT_DOWN;
                        });
                    }
                }

            }


        }

        if (this.position.y <= 0) {
            this.moveVector.x = 0;
        }
    }

}