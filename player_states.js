import { Aura, Pull } from './particles.js';
import { Damage } from './damage.js';
const states =
{
   IDLE: 0,
   RUNNING: 1,
   JUMPING_START: 2,
   JUMPING_END: 3,
   ATTACK_ONE: 4,
   ATTACK_TWO: 5,
   CHARGING: 6,
   UNIVERSALPULL: 7,
   DEAD: 8
};

class State {
   constructor(state) {
      this.state = state;
   }
}
export class Death extends State {
   constructor(player) {
      super("DEAD");
      this.player = player;
   }
   enter() {
      this.player.frameX = 0;
      this.player.image = this.player.images[5];
      this.player.maxFrame = 7;
      this.player.width = 80;
      this.player.frameInterval = 150;
      this.player.y = 0;
   }
   handleInput(input) {
   }
}
export class Idle extends State {
   constructor(player) {
      super("IDLE");
      this.player = player;
   }
   enter() {
      this.player.frameX = 0;
      this.player.image = this.player.images[states.IDLE];
      this.player.maxFrame = 3;
      this.player.width = 64;
      this.player.frameInterval = 100;
   }
   handleInput(input) {
      if (input.includes("arrowright") || input.includes("arrowleft")) this.player.setState(states.RUNNING);
      else if (input.includes("k")) this.player.setState(states.CHARGING);
      else if (input.includes('l')) this.player.setState(states.UNIVERSALPULL);
      else if (input.includes("arrowup")) this.player.setState(states.JUMPING_START);
      else if (input.includes("j")) this.player.setState(states.ATTACK_ONE);
   }
}
export class Running extends State {
   constructor(player) {
      super("RUNNING");
      this.player = player;
   }
   enter() {
      this.player.frameX = 0;
      this.player.image = this.player.images[states.RUNNING];
      this.player.maxFrame = 7;
      this.player.width = 80;
      this.player.frameInterval = 100;
   }
   handleInput(input) {
      if (input.length == 0) this.player.setState(states.IDLE);
      else if (input.includes('k') && input.length == 1) {
         this.player.particles.push(new Aura(this.player.game, this.player.x, this.player.y));
         this.player.setState(states.IDLE);
      }
      else if (input.includes('k')) this.player.particles.push(new Aura(this.player.game, this.player.x, this.player.y));
      else if (input.includes("arrowup")) this.player.setState(states.JUMPING_START);
      else if (input.includes("j")) this.player.setState(states.ATTACK_ONE);
   }
}
export class JumpingStart extends State {
   constructor(player) {
      super("JUMPING_START");
      this.player = player;
   }
   enter() {
      this.player.frameX = 0;
      this.player.image = this.player.images[states.JUMPING_START];
      this.player.maxFrame = 3;
      this.player.width = 64;
      this.frameInterval /= 14;
   }
   handleInput(input) {
      if (this.player.vy > this.player.game.gravity) this.player.setState(states.JUMPING_END);
   }
}
export class JumpingEnd extends State {
   constructor(player) {
      super("JUMPING_END");
      this.player = player;
   }
   enter() {
      this.player.frameX = 0;
      this.player.image = this.player.images[states.JUMPING_END];
      this.player.maxFrame = 2;
      this.player.frameInterval *= 18;
   }
   handleInput(input) {
      if (this.player.onGround()) this.player.setState(states.IDLE);
   }
}
export class AttackOne extends State {
   constructor(player) {
      super("ATTACK_ONE");
      this.player = player;
   }
   enter() {
      this.player.frameX = 0;
      this.player.image = this.player.images[states.ATTACK_ONE];
      this.player.maxFrame = 4;
      this.player.width = 96;
      this.player.game.input.keys = [];
      for (let i = 0; i < this.player.game.enemies.length; i++)
         if (this.player.hasCollided(this.player.game.enemies[i]) && this.player.game.enemies[i].hp > 0) {
            this.player.game.enemies[i].hp -= this.player.damage * this.player.charge * this.player.game.enemies[i].defense;
            this.player.game.enemies[i].hp = this.player.game.enemies[i].hp.toFixed();
            if (this.player.game.enemies[i].hp < 0) this.player.game.enemies[i].hp = 0;
            this.player.game.damageDealt.push(new Damage(this.player.game,
               this.player.game.enemies[i],
               Math.round(this.player.damage * this.player.charge * this.player.game.enemies[i].defense),
               this.player.game.enemies[i].hitboxX + this.player.game.enemies[i].hitboxWidth * 0.5,
               this.player.game.enemies[i].hitboxY + this.player.game.enemies[i].hitboxHeight * 0.1));
            this.player.charge = 1;
         }
   }
   handleInput(input) {
      if (input.includes("arrowleft") || input.includes("arrowright")) this.player.setState(states.RUNNING);
      else if (this.player.frameX == 4 && this.player.currentTime > 80) this.player.setState(states.IDLE);
      else if (this.player.frameX == 4 && input.includes("j")) this.player.setState(states.ATTACK_TWO);
   }
}
export class AttackTwo extends State {
   constructor(player) {
      super("ATTACK_ONE");
      this.player = player;
   }
   enter() {
      this.player.frameX = 5;
      this.player.image = this.player.images[states.ATTACK_ONE];
      this.player.maxFrame = 7;
      this.player.width = 96;
      this.player.frameInterval *= 2;
      for (let i = 0; i < this.player.game.enemies.length; i++)
         if (this.player.hasCollided(this.player.game.enemies[i]) && this.player.game.enemies[i].hp > 0) {
            this.player.game.enemies[i].hp -= this.player.damage * this.player.charge * this.player.game.enemies[i].defense;
            this.player.game.enemies[i].hp = this.player.game.enemies[i].hp.toFixed();
            if (this.player.game.enemies[i].hp < 0) this.player.game.enemies[i].hp = 0;
            this.player.game.damageDealt.push(new Damage(this.player.game,
               this.player.game.enemies[i],
               Math.round(this.player.damage * this.player.charge * this.player.game.enemies[i].defense),
               this.player.game.enemies[i].hitboxX + this.player.game.enemies[i].hitboxWidth * 0.5,
               this.player.game.enemies[i].hitboxY + this.player.game.enemies[i].hitboxHeight * 0.1));
            this.player.charge = 1;
         }
   }
   handleInput(input) {
      if (input.includes("arrowleft") || input.includes("arrowright")) this.player.setState(states.RUNNING);
      else if (this.player.currentTime >= this.player.frameInterval) this.player.setState(states.IDLE);
   }
}
export class Charging extends State {
   constructor(player) {
      super("CHARGING");
      this.player = player;
   }
   enter() {
      this.player.frameX = this.player.frameX % 3;
      this.player.image = this.player.images[states.IDLE];
      this.player.maxFrame = 3;
      this.player.width = 64;
      this.player.frameInterval = 100;
   }
   handleInput(input) {
      this.player.particles.push(new Aura(this.player.game, this.player.x, this.player.y))
      if (!input.includes('k')) this.player.setState(states.IDLE);
      else if (input.includes("arrowleft") || input.includes("arrowright")) this.player.setState(states.RUNNING);
   }
}
export class UniversalPull extends State {
   constructor(player) {
      super("UNIVERSAL_PULL");
      this.player = player;
   }
   enter() {
      this.player.frameX = this.player.frameX % 3;
      this.player.image = this.player.images[states.IDLE];
      this.player.maxFrame = 3;
      this.player.width = 64;
      this.player.frameInterval = 100;
   }
   handleInput(input) {
      const dice = Math.random();
      for (let i = 0; i < 5; i++)
         this.player.particles.push(new Pull(this.player.game,
            dice < 0.5 ? Math.floor(Math.random() * this.player.width * 2) + this.player.x : Math.random() < 0.5 ? this.player.x : this.player.x + this.player.width * 2,
            dice > 0.5 ? Math.floor(Math.random() * this.player.height * 2) + this.player.y : Math.random() < 0.5 ? this.player.y : this.player.y + this.player.height * 2));
      if (!input.includes('l')) this.player.setState(states.IDLE);
      else if (input.includes("arrowleft") || input.includes("arrowright")) this.player.setState(states.RUNNING);
   }
}