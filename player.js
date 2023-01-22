import { Idle, Running, JumpingStart, JumpingEnd, AttackOne, AttackTwo, Charging, UniversalPull, Death } from "./player_states.js"
import { Knight, RedKnight, UltraKnight } from "./enemies.js";
import { Necromancer } from "./creatures_.js";
import { SandevistanClone } from "./sandevistan.js";

export class Player {
    constructor(game, stats, cStats) {
        this.game = game;
        this.height = 80;
        this.width = 64;
        this.x = 100;
        this.combatStats = cStats;
        this.y = this.game.height - this.height * 2 - 140;
        this.states = [new Idle(this), new Running(this), new JumpingStart(this),
        new JumpingEnd(this), new AttackOne(this), new AttackTwo(this), new Charging(this),
        new UniversalPull(this), new Death(this)];
        this.currentState = this.states[0];
        this.images = [player_idle, player_running, player_jump_start, player_jump_end, player_attack, player_dead];
        this.image = this.images[0];
        this.frameX = 0;
        this.currentTime = 0;
        this.fps = 10;
        this.maxFrame = 3;
        this.frameInterval = 1000 / this.fps;
        this.vx = 0;
        this.vxMul = 1;
        this.maxVx = cStats[1];
        this.vy = 0;
        this.maxVy = -20;
        this.currentState.enter();
        this.damage = this.combatStats[2];
        this.baseDamage = this.damage;
        this.weaponX = this.x + 130;
        this.weaponY = this.game.height - this.height * 1.5 - 49;
        this.weaponHitBoxH = 70;
        this.weaponHitBoxW = 40;
        this.hp = this.combatStats[0];
        this.maxHp = this.combatStats[0];
        this.baseHp = this.hp;
        this.charge = 1;
        this.particles = [];
        this.enemyTimer = 0;
        this.enemyInterval = 300;
        this.knights = 0;
        this.redKnights = 0;
        this.dice = Math.random();
        this.xp = cStats[3];
        this.level = cStats[5];
        this.maxXp = cStats[4];
        this.levelUpMul = 1.1;
        this.ultraKnights = 0;
        this.sandevistanOn = false;
        this.necromancers = 0;
        this.boss = document.getElementById("youll_never_guess_this")
        this.avatar = bell;
        this.sandevistanInterval = 30;
        this.sandevistanTime = 0;
        this.sandevistanClones = [];
        this.stats = stats;
        this.dead = false;
    }
    update(input, deltaTime) {
        if (this.hp <= 0 && !this.dead) {
            this.setState(8);
            this.dead = true;
        }
        if (this.frameX >= this.maxFrame && this.dead) {
            this.game.gameFinished = true;
            return;
        }
        if (!this.dead) {
            if (this.sandevistanTime >= this.sandevistanInterval) {
                if (input.includes('h')) {
                    this.sandevistanClones.unshift(new SandevistanClone(this));
                    this.sandevistanTime = 0;
                }
            } else this.sandevistanTime += deltaTime;
            if (input.includes('h')) {
                this.game.enemySpeedMul = 0.25;
                this.game.enemyFrameIntMul = 4;
                this.sandevistanOn = true;
            } else {
                this.game.enemySpeedMul = 1;
                this.game.enemyFrameIntMul = 1;
                this.sandevistanOn = false;
            }
            if (this.weaponX != this.x + 130) this.weaponX = this.x + 130;
        }
        while (this.xp >= this.maxXp) {
            this.game.playerLevelUpPoints++;
            console.log(this.game.playerLevelUpPoints);
            this.xp -= this.maxXp;
            this.level++;
            this.maxXp = Math.floor(this.maxXp * 1.15);
        }

        if (this.enemyInterval <= this.enemyTimer) {
            this.dice = Math.random();
            if (this.dice < 0.3 && this.redKnights < this.game.waves[this.game.wave - 1][1]) {
                this.game.enemies.push(new RedKnight(this.game, Math.random() * this.game.width, 1, this.game.wave));
                this.redKnights++;
            }
            else if (this.knights < this.game.waves[this.game.wave - 1][0]) {
                console.log(this.game.waves[this.game.wave - 1][0]);
                this.game.enemies.push(new Knight(this.game, Math.random() * this.game.width, Math.floor(Math.random() * 2 + 2), this.game.wave));
                this.knights++;
            } else if (this.redKnights < this.game.waves[this.game.wave - 1][1]) {
                this.game.enemies.push(new RedKnight(this.game, Math.random() * this.game.width, 1, this.game.wave));
                this.redKnights++;
            } else if (this.ultraKnights < this.game.waves[this.game.wave - 1][2]) {
                this.game.enemies.push(new UltraKnight(this.game, Math.random() * this.game.width, 1, this.game.wave));
                this.ultraKnights++;
            } else if (this.necromancers < this.game.waves[this.game.wave - 1][3]) {
                this.game.enemies.push(new Necromancer(this.game, Math.random() * this.game.width, 1, this.game.wave));
                this.necromancers++;
            }
            this.enemyTimer = 0;
            if (this.redKnights >= this.game.waves[this.game.wave - 1][1]
                && this.knights >= this.game.waves[this.game.wave - 1][0]
                && this.game.enemies.length == 0) {
                this.game.wave++;
                this.knights = 0;
                this.redKnights = 0;
                this.ultraKnights = 0;
                this.necromancers = 0;
            }
            if (this.game.wave > this.game.maxWave) this.game.gameFinished = true;
        } else this.enemyTimer += deltaTime;

        this.currentState.handleInput(input);
        this.particles = this.particles.filter((particle) => {
            return particle.markedForDeletion == false;
        });
        this.particles.forEach(particle => {
            particle.update();
        });
        if (!this.dead) {
            this.x += this.vx;
            this.weaponX += this.vx;
            this.y += this.vy
            this.weaponY += this.vy;
        }
        if (input.includes("arrowup") && this.onGround()) {
            this.vy = this.maxVy;
            this.vxMul = 0.5;
        }

        if (!this.onGround()) this.vy += this.game.gravity;
        else if (this.vy != this.maxVy) {
            this.vy = 0;
            this.vxMul = 1;
        }

        if (input.includes("arrowright")) this.vx = this.maxVx * this.vxMul;
        else if (input.includes("arrowleft")) this.vx = -this.maxVx * this.vxMul;
        else this.vx = 0;

        if (this.x < -40) this.x = -40;
        else if (this.x > this.game.width - this.width - 30)
            this.x = this.game.width - this.width - 30;
        if (this.currentTime >= this.frameInterval) {
            if (this.maxFrame <= this.frameX) {
                for (let i = 2; i < 6; i++)
                    if (this.currentState != this.states[i]) this.frameX = 0;
                    else this.frameX = this.maxFrame;

            } else {
                this.frameX++;
            }
            if ((this.currentState == this.states[6] || this.game.input.keys.includes("k") && this.charge <= 20)) this.charge += 0.15;
            this.currentTime = 0;
        } else this.currentTime += deltaTime;

        if (this.y >= this.game.height - this.height * 2 - 120 && !this.dead) this.y = this.game.height - this.height * 2 - 120;
        else this.y = this.game.height - this.height * 2 - 90;


        if (this.weaponY >= this.game.height - this.height * 1.5 - 120) this.weaponY = this.game.height - this.height * 1.5 - 120;

        this.sandevistanClones = this.sandevistanClones.filter(clone => {
            return clone.markedForDeletion == false;
        });
        for (let i = 0; i < this.sandevistanClones.length; i++)
            this.sandevistanClones[i].update(deltaTime);
    }
    draw(context) {
        for (let i = 0; i < this.sandevistanClones.length; i++)
            this.sandevistanClones[i].draw(context);


        if (this.game.debugMode) {
            context.strokeRect(this.weaponX, this.weaponY, this.weaponHitBoxW, this.weaponHitBoxH);
            context.strokeRect(this.x + this.width * 0.5, this.y + this.height * 0.5, this.width, this.height);
        }

        if (this.game.input.keys.includes('l') && !this.game.input.keys.includes('k')) this.particles.forEach(particle => {
            particle.draw(context);
        });

        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width * 2, this.height * 2);
        if (this.game.input.keys.includes('k')) this.particles.forEach(particle => {
            particle.draw(context);
        });
        context.drawImage(this.avatar, 300, 0, 120, 100);
        context.globalAlpha = 0.6;
        context.fillRect(300, 70, 120, 30);
        context.globalAlpha = 1;

        context.strokeRect(301, 1, 118, 98);
        context.drawImage(health_bar, 420, 0, 300, 50);
        context.drawImage(small_bar, 710, 0, 180, 50);
        context.drawImage(small_bar, 423, 46, 180, 50)
        context.drawImage(health_rectangle, 488, 7, this.hp > 0 ? (205 * this.hp / this.maxHp) : 0, 34)
        context.drawImage(xp_rectangle, 773, 7, 90 * this.xp / this.maxXp, 29);
        context.drawImage(star_symbol, 725, 12, 39, 23);
        context.drawImage(charge_rectangle, 487, 58, this.charge / 20 * 90, 25);
        context.drawImage(lightning_symbol, 445, 58, 30, 25);

        context.fillStyle = 'white';
        context.fillText("LVL " + this.level, 345, 88);
        context.fillStyle = 'black';
        if (this.hp >= 0) context.fillText("HP: " + this.hp + "/" + this.maxHp, 540, 29);
        else context.fillText("HP: " + 0 + "/" + this.maxHp, 540, 29);
        context.fillText("EXP: " + this.xp + "/" + this.maxXp, 785, 28);
        context.font = '11px helvetica'
        context.fillText("Charge: " + this.charge.toFixed(1), 500, 75);
        context.font = '12px helvetica';
    }

    onGround() {
        return this.y >= this.game.height - this.height * 2 - 120;
    }
    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }
    hasCollided(enemy) {
        return (this.weaponX + this.weaponHitBoxW > enemy.hitboxX &&
            this.weaponX < enemy.hitboxX + enemy.hitboxWidth &&
            this.weaponY + this.weaponHitBoxH > enemy.hitboxY &&
            this.weaponY < enemy.hitboxY + enemy.hitboxHeight);
    }
    levelUp() {
        this.xp = this.xp - this.maxXp;
        this.maxHp = Math.floor(this.maxHp * this.levelUpMul);
        this.hp = this.maxHp;
        this.damage = Math.floor(this.damage * this.levelUpMul);
        this.level++;
        this.maxXp = Math.floor(this.maxXp * 1.1);
        this.stats[1]++;
    }
    enterNewWave() {
        const refHp = this.baseHp;
        const refDmg = this.baseDamage;

        for (let i = 0; i < this.stats[2] + this.level - 1; i++)
            this.baseHp = Math.floor(this.baseHp * this.levelUpMul);

        this.maxHp = this.baseHp;
        this.hp = this.baseHp;

        for (let i = 0; i < this.stats[3] + this.level - 1; i++)
            this.baseDamage = Math.floor(this.baseDamage * this.levelUpMul);

        this.damage = this.baseDamage;
        this.baseDamage = refDmg;
        this.baseHp = refHp;
    }
}