import { NecromancerRunning, NecromancerAttacking, NecromancerHurt, NecromancerDeath } from "./enemy_states.js";
class vertEnemy {
    constructor(game, x, speed) {
        this.game = game;
        this.frameY = 0;
        this.fps = 10;
        this.frameInterval = 1000 / this.fps * game.enemyFrameIntMul;
        this.x = x;
        this.maxSpeed = speed;
        this.vx = 0;
        this.maxSpeedRef = speed;
        this.currentTime = 0;
    }
}

export class Necromancer extends vertEnemy {
    constructor(game, x, speed, level) {
        super(game, x, speed);
        this.whMul = 0.6;
        this.images = [necromancer_running, necromancer_attacking, necromancer_hurt, necromancer_death];
        this.image = this.images[0];
        this.width = 378;
        this.height = 415;
        this.damage = 2;
        this.damageMul = Math.pow((15 * Math.pow(1.05, level)).toFixed(), this.game.currentStage) * this.game.level;
        this.maxFrame = 7;
        this.hp = Math.pow((120 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
        this.y = this.game.ground - this.height * this.whMul * 0.92;
        this.distance = this.x - game.player.x;
        this.weaponWidth = 120;
        this.weaponHeight = 90;
        this.weaponX = this.x + this.width * this.whMul / 4 - this.weaponWidth / 5;
        this.weaponY = this.y + this.height * this.whMul / 2;
        this.modifierX = 0;
        this.modifierY = 0;
        this.states = [new NecromancerRunning(this), new NecromancerAttacking(this), new NecromancerHurt(this), new NecromancerDeath(this)];
        this.state = this.states[0];
        this.state.enter();
        this.hitboxX = this.x + this.width * this.whMul / 4;
        this.hitboxY = this.y + this.height * this.whMul / 5 * 2;
        this.hitboxWidth = this.width * this.whMul / 2;
        this.hitboxHeight = this.height * this.whMul / 2;
        this.defense = 1;
        this.xpOffering = 50 * Math.pow(5, this.game.currentStage) * this.game.level;
        this.coinOffering = 3;
    }
    update(input, deltaTime, player, context) {
        this.state.handleInput(input, player, context);
        this.x += this.vx;
        this.weaponX += this.vx;
        this.hitboxX += this.vx
        if (this.currentTime >= this.frameInterval) {

            if (this.frameY === this.maxFrame) {
                if (this.state == this.states[3]) this.frameY == this.maxFrame
                else this.frameY = 0;
            } this.frameY++;
            this.currentTime = 0;
        } else this.currentTime += deltaTime;
        this.distance = this.x - player.x;
    }
    draw(context) {
        if (this.game.debugMode) {
            context.strokeRect(this.weaponX, this.weaponY, this.weaponWidth, this.weaponHeight);
            context.strokeRect(this.hitboxX, this.hitboxY, this.hitboxWidth, this.hitboxHeight);
        }
        if (this.hp > 0) context.fillText("HP: " + this.hp, this.hitboxX + this.hitboxWidth * 0.5, this.hitboxY);
        context.drawImage(this.image, 0, this.frameY * this.height, this.width, this.height, this.x + this.modifierX, this.y + this.modifierY, this.width * this.whMul, this.height * this.whMul);
    }
    setState(state) {
        this.state = this.states[state];
        this.state.enter();
    }
    inRange() {
        return (this.weaponX < this.game.player.x + this.game.player.width * 1.5 &&
            this.weaponX + this.weaponWidth > this.game.player.x &&
            this.weaponY + this.weaponHeight > this.game.player.y &&
            this.weaponY < this.game.player.y + this.game.player.height);
    }
}