export class Background
{
     constructor(game)
     {
         this.game = game;
         this.image = document.getElementById("background");
         this.width = 1280;
         this.height = 720;
     }
     draw(context)
     {
        context.drawImage(this.image,0,0,this.game.width,this.game.height);
     }
}