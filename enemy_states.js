import { Damage } from './damage.js';

const states = 
{
    IDLE: 0,
    HURT: 1,
    DEAD: 2,
    DEFENDING: 3,
    RUNNING: 4,
    ATTACKONE: 5,
    RUNNINGATTACK:6,
    PULLED:7,
}
const creaturesStates=
{
   RUNNING: 0,
   ATTACKING:1,
   HURT:2,
   DEATH:3
}
class State 
{
    constructor(enemy)
    {
       this.enemy = enemy;
    }
}
export class Idle extends State
{
     constructor(enemy)
     {
        super(enemy);
     }
     enter()
     {
        this.enemy.frameX = 3;
        this.enemy.maxFrame = 3;
        this.enemy.image = this.enemy.images[states.IDLE];
        this.enemy.frameInterval = 100*this.enemy.game.enemyFrameIntMul;
        this.enemy.width = 67;
        this.enemy.defense = 1;
        this.enemy.states[6].hasHit = false;
        this.enemy.vx = 0;
        this.enemy.maxSpeed = this.enemy.maxSpeedRef;
     }
     handleInput(input, player,context)
     {
        if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
        else if(input.includes('l')&&this.enemy.pullable) this.enemy.setState(states.PULLED);
        else if((this.enemy.distance > 300 || this.enemy.distance < -100) && player.onGround()) this.enemy.setState(states.RUNNING);
        else if(input.includes('j') && player.hasCollided(this.enemy) &&!input.includes('k'))this.enemy.setState(states.HURT);
        else if(player.hasCollided(this.enemy))
        {
            if(Math.random()<0.5)this.enemy.setState(states.DEFENDING);
            else this.enemy.setState(states.RUNNING)
        }
     }
}
export class Hurt extends State
{
    constructor(enemy)
    {  
       super(enemy);  
    }
    enter()
     {
        this.enemy.frameX = 0;
        this.enemy.maxFrame = 1;
        this.enemy.image = this.enemy.images[states.HURT];
        this.enemy.frameInterval *= 3;
     }
     handleInput(input, player,context)
     {
        if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
        else if(this.enemy.frameX == this.enemy.maxFrame && this.enemy.currentTime > 80) this.enemy.setState(states.IDLE);
     }
}
export class Dead extends State
{
    constructor(enemy)
    {  
       super(enemy);  
    }
    enter()
     {
        this.enemy.frameX = 5;
        this.enemy.maxFrame = 5;
        this.enemy.image = this.enemy.images[states.DEAD];
        this.enemy.frameInterval = 200*this.enemy.game.enemyFrameIntMul;
        this.enemy.width = 80;
        this.enemy.vx = 0;
        this.enemy.game.player.xp+=this.enemy.xpOffering*this.enemy.game.wave;
        this.enemy.game.player.stats[0] += this.enemy.coinOffering*this.enemy.game.wave;
     }
     handleInput(input, player,context)
     {
        if(this.enemy.currentTime > 2000)
           this.enemy.game.enemies.splice(this.enemy.game.enemies.indexOf(this.enemy),1);
     }
}
export class Defending extends State
{
    constructor(enemy)
    {  
       super(enemy);  
    }
    enter()
     {
        this.enemy.frameX = 0;
        this.enemy.maxFrame = 0;
        this.enemy.image = this.enemy.images[states.DEFENDING];
        this.enemy.frameInterval = 500*this.enemy.game.enemyFrameIntMul;
        this.enemy.states[6].hasHit = false;
        this.enemy.defense = 0.7;
        this.enemy.vx = 0;
     }
     handleInput(input, player,context)
     {
        if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
        else if(input.includes('l')&&this.enemy.pullable) this.enemy.setState(states.PULLED);
        else if((this.enemy.distance > 150 || this.enemy.distance < 50) && 
        player.onGround() && this.enemy.currentTime > 480) this.enemy.setState(states.RUNNING);
        else if(this.enemy.inRange() && !(input.includes("j")) && this.enemy.currentTime>480) this.enemy.setState(states.ATTACKONE);
     }
}
export class Running extends State
{
    constructor(enemy)
    {  
       super(enemy);  
       this.random = Math.random();
    }
    enter()
     {
        this.enemy.frameX = 6;
        this.enemy.maxFrame = 6;
        this.enemy.image = this.enemy.images[states.RUNNING];
        this.enemy.frameInterval = 100*this.enemy.game.enemyFrameIntMul;
        this.enemy.width = 72;
        this.enemy.defense = 1;
        this.enemy.states[6].hasHit = false;
        this.random = this.enemy.distance< 250?0:Math.random();
        if(this.enemy.distance > 0 && !this.enemy.inRange()) this.enemy.vx = -this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
        else if(this.enemy.distance < 0 && !this.enemy.inRange()) this.enemy.vx = this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
     }
     handleInput(input, player,context)
     {
        if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
        else if(input.includes('l')&&this.enemy.pullable) this.enemy.setState(states.PULLED);
        else if(this.random < 0.5){
           if(this.enemy.inRange()) this.enemy.setState(states.ATTACKONE);
           else if(!player.onGround())this.enemy.setState(states.IDLE);
           else if(this.enemy.weaponX - this.enemy.game.player.x > this.enemy.game.player.width*0.2 && player.onGround()) this.enemy.vx = -this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
           else if(this.enemy.weaponX - this.enemy.game.player.x < this.enemy.game.player.width*0.8 && player.onGround()) this.enemy.vx = this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
         }else if(this.enemy.distance < 300 && this.enemy.distance > 250)this.enemy.setState(states.RUNNINGATTACK);
     }
}
export class EnemyAttackOne extends State
{
    constructor(enemy)
    {  
       super(enemy);  
       this.hitOnce = false;
    }
    enter()
     {
        this.hitOnce = false;
        this.enemy.frameX = 4;
        this.enemy.maxFrame = 4;
        this.enemy.image = this.enemy.images[states.ATTACKONE];
        this.enemy.width = 80;
        this.enemy.frameInterval = 150*this.enemy.game.enemyFrameIntMul;
        this.enemy.states[6].hasHit = false;
        this.enemy.vx = 0;
        this.enemy.defense = 1;
        this.enemy.currentTime = 0;
     }
     handleInput(input, player,context)
     {
        this.enemy.frameInterval = 150*this.enemy.game.enemyFrameIntMul;
        if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
        else if(player.hp <= 0)this.enemy.setState(states.IDLE);
        else if(input.includes('l')&&this.enemy.pullable) this.enemy.setState(states.PULLED);
        else if(player.hasCollided(this.enemy) && input.includes("j") && this.enemy.frameX >= 3) this.enemy.setState(states.DEFENDING);
        else if(input.includes('j') && player.hasCollided(this.enemy))this.enemy.setState(states.HURT);
        else if(this.enemy.frameX == 0 && this.enemy.currentTime > 130 && this.enemy.inRange()) this.enemy.setState(states.ATTACKONE);
        else if(!this.enemy.inRange()) this.enemy.setState(states.IDLE);

        if(this.enemy.currentTime > 100*this.enemy.game.enemyFrameIntMul &&this.enemy.frameX == 0 && this.enemy.inRange() && this.hitOnce == false)
        {
         this.enemy.game.player.hp -= this.enemy.damage*this.enemy.damageMul;
         this.enemy.game.damageDealt.push(new Damage(this.enemy.game, 
         this.enemy.game.player,
         this.enemy.damage*this.enemy.damageMul,
         this.enemy.game.player.x+this.enemy.game.player.width,
         this.enemy.game.player.y+this.enemy.game.player.height*0.2));
         this.hitOnce = true;
        }
     }
}
export class EnemyRunningAttack extends State
{
    constructor(enemy)
    {
          super(enemy);
          this.hitOnce = false;
    }
    enter()
    {
       this.enemy.frameX = 5;
       this.enemy.maxFrame = 5;
       this.enemy.image = this.enemy.images[states.RUNNINGATTACK];
       this.enemy.width = 76;
       this.enemy.vx = -6*this.enemy.game.enemySpeedMul;
       this.enemy.frameInterval = 150*this.enemy.game.enemyFrameIntMul;
       this.hitOnce = false;
    }
    handleInput(input, player,context)
    {
      this.enemy.frameInterval = 150*this.enemy.game.enemyFrameIntMul;
       this.enemy.vx = -6*this.enemy.game.enemySpeedMul;
       if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
       else if(this.enemy.game.player.hp <= 0)this.enemy.setState(states.IDLE);
       else if(this.enemy.frameX == 0)
       {
          if(this.enemy.distance > 150 || this.enemy.distance < 50)this.enemy.setState(states.RUNNING);
          else this.enemy.setState(states.DEFENDING);
       }
       if(this.hitOnce == false && this.enemy.inRange())
       {
         this.enemy.game.player.hp-=this.enemy.damage*3*this.enemy.damageMul;
        this.enemy.game.damageDealt.push(new Damage(this.enemy.game, 
        this.enemy.game.player,
        this.enemy.damage*3*this.enemy.damageMul,
        this.enemy.game.player.x+this.enemy.game.player.width,
        this.enemy.game.player.y+this.enemy.game.player.height*0.2));
        this.hitOnce = true;
       }
    }
}
export class Pulled extends State
{
       constructor(enemy)
       {  
          super(enemy);  
       }
       enter()
        {
           this.enemy.frameX = 0;
           this.enemy.maxFrame = 0;
           this.enemy.image = this.enemy.images[states.HURT];
           this.enemy.frameInterval *= 3;
           this.enemy.defense = 1;
           this.enemy.maxSpeed *= 3;
        }
        handleInput(input, player,context)
        {
           if(!input.includes('l')&&this.enemy.pullable)this.enemy.setState(states.IDLE);
           else if(player.weaponX +player.weaponHitBoxW < this.enemy.x) this.enemy.vx = -this.enemy.maxSpeed;
           else if(player.weaponX +player.weaponHitBoxW > this.enemy.x+this.enemy.width*0.5) this.enemy.vx = this.enemy.maxSpeed;
        }
}
export class Walking extends State
{
   constructor(enemy)
   {  
      super(enemy);  
      this.random = Math.random();
   }
   enter()
    {
       this.enemy.states[6].hasHit = false;
       this.random = this.enemy.distance< 250?0:Math.random();
       this.enemy.frameX = 6;
       this.enemy.maxFrame = 6;
       this.enemy.image = this.enemy.images[states.RUNNING];
       this.enemy.frameInterval = 100*this.enemy.game.enemyFrameIntMul;
       this.enemy.width = 66;
       this.enemy.defense = 1;
       if(this.enemy.distance > 0 && !this.enemy.inRange()) this.enemy.vx = -this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
       else if(this.enemy.distance < 0 && !this.enemy.inRange()) this.enemy.vx = this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
    }
    handleInput(input, player,context)
    {
       if(this.enemy.hp <= 0)this.enemy.setState(states.DEAD);
       else if(input.includes('l')&&this.enemy.pullable) this.enemy.setState(states.PULLED);
       else if(this.random < 0.5){
          if(player.hasCollided(this.enemy) && Math.abs(this.enemy.weaponX - this.enemy.game.player.x) > this.enemy.game.player.width*0.3&&
          Math.abs(this.enemy.weaponX - this.enemy.game.player.x) < this.enemy.game.player.width*0.7)
          {
             if(Math.random()<0.5)this.enemy.setState(states.ATTACKONE);
             else this.enemy.setState(states.DEFENDING);
          }  
          else if(!player.onGround())this.enemy.setState(states.IDLE);
          else if(this.enemy.weaponX - this.enemy.game.player.x > this.enemy.game.player.width*0.3 && player.onGround()) this.enemy.vx = -this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
          else if(this.enemy.weaponX - this.enemy.game.player.x < this.enemy.game.player.width*0.7 && player.onGround()) this.enemy.vx = this.enemy.maxSpeed*this.enemy.game.enemySpeedMul;
        }else if(this.enemy.distance < 300 && this.enemy.distance > 250)this.enemy.setState(states.RUNNINGATTACK);
    }
}
export class NecromancerRunning extends State
{
   constructor(enemy)
   {
       super(enemy);
   }
   enter()
   {
       this.enemy.frameY = 0; 
       this.enemy.maxFrame = 7;
       this.enemy.image = this.enemy.images[creaturesStates.RUNNING];
       this.enemy.height = 415;
       this.enemy.width = 382;
       this.enemy.modifierX = 0;
       this.enemy.modifierY = 0;
   }
   handleInput(input, player, context)
   {
      if(this.enemy.hp <= 0) this.enemy.setState(creaturesStates.DEATH);
      else if(this.enemy.inRange())this.enemy.setState(creaturesStates.ATTACKING);
      else if(input.includes('j') && player.hasCollided(this.enemy))
      {
          if(this.enemy.hp <= 0)this.enemy.setState(creaturesStates.DEATH);
          else this.enemy.setState(creaturesStates.HURT);
      }
      else if(!this.enemy.inRange())
      {
         if(this.enemy.distance > 0) this.enemy.vx = -this.enemy.maxSpeed;
         else if(this.enemy.distance < 0) this.enemy.vx = this.enemy.maxSpeed;
      }
   }
}
export class NecromancerAttacking extends State
{
    constructor(enemy)
    {
       super(enemy);
       this.hitOnce = false;
    }
    enter()
    {
       this.hitOnce = false;
       this.enemy.frameY = 0;
       this.enemy.maxFrame = 18;
       this.enemy.image = this.enemy.images[creaturesStates.ATTACKING];
       this.enemy.height = 435;
       this.enemy.width = 482;
       this.enemy.modifierX = 0;
       this.enemy.modifierY = 53;
       this.enemy.vx = 0;
    }
    handleInput(input, player, context)
    {
       if(this.enemy.hp <= 0) this.enemy.setState(creaturesStates.DEATH);
       else if(this.enemy.frameY < 5 && input.includes('j')&& player.hasCollided(this.enemy))this.enemy.setState(creaturesStates.HURT);
       else if(!this.enemy.inRange())this.enemy.setState(creaturesStates.RUNNING);
       else if(this.enemy.frameY == 11 && !this.hitOnce)
       {
          player.hp -= this.enemy.damage*this.enemy.damageMul;
          this.enemy.game.damageDealt.push(new Damage(this.enemy.game, 
            this.enemy.game.player,
            this.enemy.damage*this.enemy.damageMul,
            this.enemy.game.player.x+this.enemy.game.player.width,
            this.enemy.game.player.y+this.enemy.game.player.height*0.2));;
            this.hitOnce = true;
       }else if(this.enemy.frameY == 18) this.hitOnce = false;
    }
}
export class NecromancerHurt extends State
{
    constructor(enemy)
    {
       super(enemy);
       this.inputLengthRef;
       this.subtracted = false;
    }
    enter()
    {
       this.inputLengthRef = this.enemy.game.input.keys.length; 
       this.enemy.frameY = 0;
       this.enemy.maxFrame = 5;
       this.enemy.image = this.enemy.images[creaturesStates.HURT];
       this.enemy.height = 427;
       this.enemy.width = 438;
       this.enemy.modifierX = 23;
       this.enemy.modifierY = 48;
       this.enemy.vx = 0;
    }
    handleInput(input, player, context)
    {
       if(this.enemy.hp <= 0) this.enemy.setState(creaturesStates.DEATH);
       else if(this.enemy.frameY == 5 && this.enemy.currentTime > 80)
       {
          if(this.enemy.inRange())this.enemy.setState(creaturesStates.ATTACKING);
          else this.enemy.setState(creaturesStates.RUNNING);
       }else if(input.includes('j') && this.inputLengthRef != input.length && player.hasCollided(this.enemy)) 
       {
           if(this.enemy.hp <= 0) this.enemy.setState(creaturesStates.DEATH);
           else this.enemy.setState(creaturesStates.HURT);
       }
        
       if(!input.includes('j'))
       {
          this.inputLengthRef--;
          this.subtracted = true;
       }else if(this.subtracted == false && input.includes('j'))
       {
          this.inputLengthRef++;
          this.subtracted = true; 
       }
    }
}
export class NecromancerDeath extends State
{
    constructor(enemy)
    {
       super(enemy);
    }
    enter()
    {
       this.enemy.frameY = 0;
       this.enemy.maxFrame = 7;
       this.enemy.image = this.enemy.images[creaturesStates.DEATH];
       this.enemy.height = 427;
       this.enemy.width = 438;
       this.enemy.modifierX = 23;
       this.enemy.modifierY = 60;
       this.enemy.vx = 0;
       this.enemy.game.player.stats[0] += this.enemy.coinOffering*this.enemy.game.wave;
       this.enemy.game.player.xp+=this.enemy.xpOffering*this.enemy.game.wave;
    }
    handleInput(input, player, context)
    {
       if(this.enemy.frameY == this.enemy.maxFrame)
       {
          this.enemy.frameInterval = 3000;
          if(this.enemy.currentTime > 2500)this.enemy.game.enemies.splice(this.enemy.game.enemies.indexOf(this.enemy),1);
       }
    }
}