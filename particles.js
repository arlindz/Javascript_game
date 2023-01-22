class Particle
{
    constructor(game)  
    {
        this.game = game;
        this.markedForDeletion = false;
    }
    update()
    {
         this.x -= this.speedX - this.game.player.vx;
         this.angle+=this.angleV;
         this.speedX = Math.sin(this.angle);
         this.y -= this.speedY;
         this.size*=0.97;
         if(this.size < 0.5) this.markedForDeletion = true;
    }
    
}
export class Aura extends Particle
{
    constructor(game, x, y)
    {
        super(game);
        this.x = x+Math.random()*this.game.player.width*2;
        this.y = y+this.game.player.height*1.6;
        this.size = Math.random()*3+3;
        this.angle = 0;
        this.angleV = Math.random()*0.6-0.3;
        this.speedX = Math.sin(this.angle);
        this.speedY = Math.random()+1;
        this.color = Math.random() < 0.5?'black':'red';
    }
    draw(context)
    {
         context.beginPath();
         context.arc(this.x, this.y, this.size, 0, Math.PI*2);
         context.fillStyle = this.color;
         context.fill();
         context.fillStyle = 'black';
    }
}
export class Pull extends Particle
{
    constructor(game, x, y)
    {
        super(game);
        this.x = x+Math.floor((Math.random()*500))-250;
        this.y = y+Math.floor((Math.random()*150))-75;
        this.size = Math.random()*3+3;
        this.angleV = Math.random()*0.6-0.3;
        this.speedX = (this.game.player.x+this.game.player.width-this.x+100)*0.03;
        this.speedY = (this.game.player.y+this.game.player.height-20-this.y)*0.03;
        this.color = 'black';
    }
    draw(context)
    {
         context.beginPath();
         context.arc(this.x, this.y, this.size, 0, Math.PI*2);
         context.fillStyle = this.color;
         context.fill();
         context.fillStyle = 'black';
    }
    update()
    {
        this.x+=this.speedX;
        this.y+=this.speedY;
        this.size *= 0.9;
        if(this.size < 0.5) this.markedForDeletion = true;
    }
}