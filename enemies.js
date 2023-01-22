import { Idle, Hurt, Dead, Defending, Running, EnemyAttackOne, EnemyRunningAttack, Pulled, Walking } from './enemy_states.js';
import { Aura } from './particles.js';

export class Enemy {
   constructor(game) {
      this.frameX = 0;
      this.fps = 10;
      this.frameInterval = 1000 / this.fps * game.enemyFrameIntMul;
      this.currentTime = 0;
   }
}

export class Knight extends Enemy {
   constructor(game, x, maxSpeed, level) {
      super(game);
      this.game = game;
      this.whMul = 1.5;
      this.images = [enemy_idle, enemy_hurt, enemy_dead, enemy_defending, enemy_running, enemy_attack1, enemy_attack2];
      this.image = this.images[0];
      this.maxSpeedRef = maxSpeed * game.enemySpeedMul;
      this.maxFrame = 5;
      this.width = 67;
      this.height = 86;
      this.vx = 0;
      this.maxSpeed = maxSpeed * game.enemySpeedMul;
      this.x = x;
      this.y = this.game.ground - this.height * this.whMul;
      this.hp = Math.pow((100 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
      this.defense = 1;
      this.distance = this.x - this.game.player.x;
      this.weaponX = this.x - this.width * this.whMul / 3;
      this.weaponY = this.y - this.height * this.whMul / 3;
      this.weaponWidth = 40;
      this.weaponHeight = 70;
      this.damage = 2;
      this.damageMul = Math.pow((1.5 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
      this.states = [new Idle(this), new Hurt(this), new Dead(this),
      new Defending(this), new Running(this), new EnemyAttackOne(this), new EnemyRunningAttack(this),
      new Pulled(this)];
      this.currentState = this.states[0];
      this.currentState.enter();
      this.pullable = true;
      this.xpOffering = 20*Math.pow(5, this.game.currentStage)*this.game.level;
      this.hitboxX = this.x + this.width * this.whMul / 3;
      this.hitboxY = this.y + this.height * this.whMul / 3;
      this.hitboxWidth = this.width * this.whMul / 1.5;
      this.hitboxHeight = this.whMul / 1.5 * this.height;
      this.coinOffering = 3;
   }
   update(input, deltaTime, player, context) {
      this.currentState.handleInput(input, player, context);
      this.x += this.vx;
      this.hitboxX += this.vx
      this.weaponX += this.vx;
      if (this.currentTime >= this.frameInterval * this.game.enemyFrameIntMul) {
         if (this.frameX == 0) {
            if (this.states.indexOf(this.currentState) != 2) this.frameX = this.maxFrame;
            else {
               this.frameX = 0;
               this.frameInterval = 3000;
            }
         } else this.frameX--;
         this.currentTime = 0;
      } else this.currentTime += deltaTime;

      this.distance = this.x - this.game.player.x;
   }
   draw(context) {

      if (this.game.debugMode) {
         context.strokeRect(this.weaponX, this.weaponY, this.weaponWidth, this.weaponHeight);
         context.strokeRect(this.x + this.width * this.whMul / 3, this.y + this.height * this.whMul / 3, this.width * this.whMul / 1.5, this.whMul / 1.5 * this.height);
      }
      if (this.hp > 0) context.fillText("HP: " + this.hp, Math.floor(this.x + this.width * this.whMul * 0.4285), this.y + this.height * this.whMul * 0.2);
      context.drawImage(
         this.image,
         this.frameX * this.width,
         0,
         this.width,
         this.height,
         this.x,
         this.y,
         this.width * this.whMul,
         this.height * this.whMul);
   }
   setState(state) {
      this.currentState = this.states[state];
      this.currentState.enter();
   }
   inRange() {
      return (this.weaponX < this.game.player.x + this.game.player.width * 1.5 &&
         this.weaponX + this.weaponWidth > this.game.player.x &&
         this.weaponY + this.weaponHeight > this.game.player.y &&
         this.weaponY < this.game.player.y + this.game.player.height)
   }
}
export class RedKnight extends Knight {
   constructor(game, x, maxSpeed, level) {
      super(game, x, maxSpeed);
      this.whMul = 3;
      this.coinOffering = 3;
      this.hp = Math.pow((300 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
      this.damageMul = Math.pow((4 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
      this.maxSpeed = 1 * game.enemySpeedMul;
      this.maxSpeedRef = this.maxSpeed;
      this.weaponX = this.x;
      this.weaponY = this.y;
      this.images = [redknight_idle, redknight_hurt, redknight_dead,
         redknight_defending, redknight_walking, redknight_attack1, redknight_attack2];
      this.image = this.images[0];
      this.states = [new Idle(this), new Hurt(this), new Dead(this),
      new Defending(this), new Walking(this), new EnemyAttackOne(this), new EnemyRunningAttack(this),
      new Pulled(this)];
      this.currentState = this.states[0];
      this.currentState.enter();
      this.pullable = false;
      this.y = this.game.ground - this.height * this.whMul;
      this.xpOffering = 100*Math.pow(5, this.game.currentStage)*this.game.level;
      this.hitboxX = this.x + this.width * this.whMul / 3;
      this.hitboxY = this.y + this.height * this.whMul / 3;
      this.hitboxWidth = this.width * this.whMul / 1.5;
      this.hitboxHeight = this.whMul / 1.5 * this.height;
   }
   inRange() {
      return (this.weaponX < this.game.player.x + this.game.player.width * 1.5 &&
         this.weaponX + this.weaponWidth > this.game.player.x &&
         this.weaponY + this.weaponHeight > this.game.player.y &&
         this.weaponY < this.game.player.y + this.game.player.height);
   }
}
export class UltraKnight extends Knight {
   constructor(game, x, maxSpeed, level) {
      super(game, x, maxSpeed);
      this.whMul = 2;
      this.hp = Math.pow((650 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
      this.damageMul = Math.pow((10 * Math.pow(1.1, level)).toFixed(), this.game.currentStage) * this.game.level;
      this.maxSpeed = 6 * game.enemySpeedMul;
      this.maxSpeedRef = this.maxSpeed;
      this.weaponX = this.x;
      this.weaponY = this.y;
      this.coinOffering = 3;
      this.xpOffering = 1000*Math.pow(5, this.game.currentStage)*this.game.level;
      this.y = this.game.ground - this.height * this.whMul;
      this.aura = []
      this.pullable = false;
   }
   update(input, deltaTime, player, context) {
      this.currentState.handleInput(input, player, context);
      this.x += this.vx;
      this.weaponX += this.vx;
      this.hitboxX += this.vx
      if (this.currentTime >= this.frameInterval * this.game.enemyFrameIntMul) {
         if (this.frameX == 0) {
            if (this.states.indexOf(this.currentState) != 2) this.frameX = this.maxFrame;
            else {
               this.frameX = 0;
               this.frameInterval = 3000;
            }
         } else this.frameX--;
         this.currentTime = 0;
      } else this.currentTime += deltaTime;

      this.distance = this.x - this.game.player.x;
   }
   draw(context) {
      if (this.game.debugMode) {
         context.strokeRect(this.weaponX, this.weaponY, this.weaponWidth, this.weaponHeight);
         context.strokeRect(this.x + this.width * this.whMul / 3, this.y + this.height * this.whMul / 3, this.width * this.whMul / 1.5, this.whMul / 1.5 * this.height);
      }
      if (this.hp > 0) context.fillText("HP: " + this.hp, Math.floor(this.x + this.width * this.whMul * 0.4285), this.y + this.height * this.whMul * 0.2);
      context.drawImage(
         this.image,
         this.frameX * this.width,
         0,
         this.width,
         this.height,
         this.x,
         this.y,
         this.width * this.whMul,
         this.height * this.whMul);
   }
   inRange() {
      return (this.weaponX < this.game.player.x + this.game.player.width * 1.5 &&
         this.weaponX + this.weaponWidth > this.game.player.x + this.game.player.width * 0.5 &&
         this.weaponY + this.weaponHeight > this.game.player.y &&
         this.weaponY < this.game.player.y + this.game.player.height)
   }
}