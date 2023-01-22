export class InputHandler
{
   constructor(game)
   {
      this.keys = [];
      window.addEventListener('keydown', e => {
         if((e.key == 'ArrowLeft' || e.key == 'ArrowRight' ||
          e.key == 'ArrowUp' || e.key.toLowerCase() == 'j'||
         e.key.toLowerCase() == 'k'||e.key.toLowerCase() == 'l'
         ||e.key.toLowerCase() == 'h') && this.keys.indexOf(e.key.toLowerCase()) == -1)
         this.keys.push(e.key.toLowerCase());
         if(e.key == 'd') game.debugMode = !game.debugMode;
      });
      window.addEventListener('keyup', e => {
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight'||
        e.key == 'ArrowUp' || e.key.toLowerCase() == 'j'||
         e.key.toLowerCase() == 'k'||e.key.toLowerCase() == 'l'
         ||e.key.toLowerCase() == 'h')
         this.keys.splice(this.keys.indexOf(e.key.toLowerCase()), 1);
      });
   }
}