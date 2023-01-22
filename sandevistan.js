export class SandevistanClone
{
    constructor(player)
    {
        this.player = player;
        this.opacity = 0.4;
        this.image = this.player.image;
        this.frameX = this.player.frameX;
        this.x = this.player.x;
        this.y = this.player.y
        this.interval = player.sandevistanInterval;
        this.currentTime = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime)
    {
         if(this.currentTime >= 3*this.interval)this.opacity-= 0.05;
         else this.currentTime += deltaTime;

         if(this.opacity <= 0.2) this.markedForDeletion = true;
    }
    draw(context)
    {
         context.globalAlpha = this.opacity;

         context.drawImage(this.image, 
             this.frameX*this.player.width, 0, this.player.width, this.player.height,
             this.x, 
             this.y, 
             this.player.width*2, 
             this.player.height*2);

         context.globalAlpha = 1;
    }
}