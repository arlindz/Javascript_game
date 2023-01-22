export class Damage {
    constructor(game, targetHit, damage, x, y) {
        this.game = game;
        this.targetHit = targetHit;
        this.x = x;
        this.initialY = y;
        this.y = y;
        this.damage = damage;
        this.markedForDeletion = false;
    }
    update() {
        if (!this.game.player.dead) this.x += this.targetHit.vx;
        this.y--;
        if (this.initialY - this.y > 50) this.markedForDeletion = true;
    }
    draw(context) {
        context.font = '20px helvetica';
        context.fillText("-" + this.damage, this.x, this.y);
        context.font = '12px helvetica';
    }
}