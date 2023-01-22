import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import wavesData from './wavesData.js';
// import { url } from './inspector.js';

let gameRef;

window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;
    let waves = wavesData;
    let currentStage = 1;
    let pStats = [0, 0, 0, 0, 0];
    let pcStats = [120, 10, 40, 0, 100, 1];
    let currentGame;

    //[[2,0,0,0],[4,0,0,0],[7,0,0,0],[0,1,0,0],[2,1,0,0],[6,1,0,2],[0,0,1,2],[2,2,0,3],[25,0,0,4],[12,2,0,5],[15,3,1,6],[30,5,10,8]];
    class Game {
        constructor(width, height, wave, playerStats, playerCombatStats, currentStage, level) {
            this.currentStage = currentStage;
            this.level = level
            this.width = width;
            this.height = height;
            this.gravity = 0.75;
            this.player = new Player(this, playerStats, playerCombatStats);
            this.input = new InputHandler(this);
            this.background = new Background(this);
            this.debugMode = false;
            this.enemySpeedMul = 1;
            this.enemyFrameIntMul = 1;
            this.ground = this.height - 150;
            this.enemies = [];
            this.damageDealt = [];
            this.waveImage = document.getElementById('waves');
            this.coinImage = document.getElementById('coin_image');
            this.waves = wave
            this.maxWave = wave.length;
            this.gameFinished = false;
            this.wave = 1;
            this.playerLevelUpPoints = 0;
            this.audio = document.getElementById('the_trek');
            this.menuImage = menu;
        }
        update(deltaTime, context) {
            if (this.gameFinished) return;

            context.font = '12px helvetica';
            for (let i = 0; i < this.enemies.length; i++)
                this.enemies[i].update(this.input.keys, deltaTime, this.player, context);

            this.player.update(this.input.keys, deltaTime);
            this.damageDealt = this.damageDealt.filter(damage => {
                return damage.markedForDeletion == false;
            });
            for (let i = 0; i < this.damageDealt.length; i++)
                this.damageDealt[i].update();
        }
        draw(context) {
            if (this.gameFinished) return;
            context.fillStyle = 'black';

            this.background.draw(context);

            for (let i = 0; i < this.enemies.length; i++)
                this.enemies[i].draw(context);

            this.player.draw(context);

            for (let i = 0; i < this.damageDealt.length; i++)
                this.damageDealt[i].draw(context);
            context.font = "40px helvetica";
            context.drawImage(this.waveImage, 10, 10, 250, 70);
            context.drawImage(this.coinImage, 10, 90, 80, 30);
            context.fillStyle = 'white';
            context.fillText("Wave: " + this.wave, 60, 60);
            context.font = "15px helvetica";
            context.fillText(this.player.stats[0], 55, 112);
            context.font = "15px helvetica";
        }
    }


    for (let i = 0; i < 3; i++) {
        document.getElementById("stage" + i).addEventListener("click", function () {
            currentStage = i + 1;
            for (let j = 1; j < 13; j++)
                document.getElementById("stageLevel" + j).innerHTML = document.getElementById("stageName" + i).innerHTML;
        });
    }
    let reference = 0;
    for (let i = 1; i < 13; i++)
        document.getElementById("level" + i).addEventListener('click', function () {
            currentGame = new Game(canvas.width, canvas.height, waves[currentStage - 1][i - 1], pStats, pcStats, currentStage, i);
            document.getElementById("levelsMenu").style.display = 'none';
            document.getElementById("canvas1").style.display = "block";
            reference = 0;
            animate(0);
        });
    function animate(timeStamp) {
        if (currentGame.gameFinished) {
            document.getElementById('canvas1').style.display = 'none';
            document.getElementById('levelsMenu').style.display = 'inline';
            if (!currentGame.player.dead) {
                pcStats[3] = currentGame.player.xp;
                pcStats[4] = currentGame.player.maxXp;
                pcStats[5] = currentGame.player.level;
                pStats[1] += currentGame.playerLevelUpPoints;
            } else {
                let def = [120, 10, 40, 0, 100, 1];
                for (let i = 0; i < def.length; i++)
                    pcStats[i] = def[i];
                pStats[1] = 0;
            }
            return;
        }
        let deltaTime = timeStamp - reference;
        reference = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentGame.update(deltaTime, ctx);
        currentGame.draw(ctx);
        requestAnimationFrame(animate);
    }

    const playerStats = ["HP", "Speed", "Damage"];
    document.getElementById('back1').addEventListener('click', function () {
        document.getElementById('mainMenu').style.display = 'inline';
        document.getElementById('levelsMenu').style.display = 'none';
    });
    document.getElementById('playGameButton').addEventListener('click', function () {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('levelsMenu').style.display = 'inline';
    });
    document.getElementById('characterButton').addEventListener('click', function () {
        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('characterMenu').style.display = 'inline';
        document.getElementById('levelPoints').innerHTML = "Points: " + pStats[1];
        for (let i = 0; i < playerStats.length; i++) {
            document.getElementById("stat" + i).innerHTML = playerStats[i];
            document.getElementById("stat" + i + i).innerHTML = pcStats[i];
        }
    });

    document.getElementById('back0').addEventListener('click', function () {
        document.getElementById('mainMenu').style.display = 'inline';
        document.getElementById('characterMenu').style.display = 'none';
    });
    const dataUrl = 'http://127.0.0.1:3000/hello';
    let data = 0;
    const getAPi = async () => {
        try {
            const res = await fetch(dataUrl, {
                mode: 'no-cors'
            });
            data = await res.json();
            console.log(data);
        }
        catch (e) {
            console.log(e);
        }
    }
    getAPi();

    for (let i = 0; i < playerStats.length; i++) {
        document.getElementById("upgrade" + i).addEventListener("click", function () {

            getAPi();

            // axios.get(dataUrl).then((response) => console.log("response:", response))
            // const Http = new XMLHttpRequest();
            // //const url='https://jsonplaceholder.typicode.com/posts';
            // Http.open("GET", dataUrl);
            // Http.send();

            // Http.onreadystatechange = (e) => {
            //     console.log("Http.responseText", Http.responseText)
            // }

            if (pStats[1] == 0) return;
            pcStats[i] = Math.floor(pcStats[i] * 1.1);
            pStats[1]--;
            pStats[i + 2]++;
            document.getElementById('stat' + i + i).innerHTML = pcStats[i];
            console.log(pcStats[i]);
            document.getElementById('levelPoints').innerHTML = "Points: " + pStats[1];
        });
    }
});



