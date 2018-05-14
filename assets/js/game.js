const roads = [];
const player = document.querySelector('#player');
const roadParts = Array.from(document.getElementsByClassName('road-part'));
let positionLeft;
let positionRight;
let roadPartOffset;
let score = 0;
let triggerDamageInterval;
let scoreTriggerInterval;
let spawnCarsInterval;
const genetate = generator();

document.querySelector('#start-play').addEventListener('click', () => {
    build(true);
})

// build function
function build(continueGenerate) {
    if(continueGenerate) {
        build(genetate.next().value);
    } else {
        player.style.opacity = '1';
        document.querySelector('#start-menu').style.display = 'none';
        document.querySelector('#buttons').style.display = 'flex';
        document.querySelector('#score').style.display = 'flex';
    }
}

// generator
function* generator() {
    yield startBuildRoads(); 
    yield setPlayerPosition();
    yield startTriggerScore();
    yield setUserControl();
    yield spawnEnemyCars();
    yield setEffectDamage();
}

// build road
function startBuildRoads() {
    let i;
    for (roadPart of roadParts) {
        roadPart.style.width = `calc( 100% / ${roadParts.length} )`;
    }
    roadPartOffset = roadParts[0].offsetWidth;
    return true;
}

// set player position
function setPlayerPosition() {
    const w = roadPartOffset;
    positionLeft = (w / 2) - (player.offsetWidth / 2);
    positionRight = w + (w / 2) - (player.offsetWidth / 2);
    player.style.left = `${positionRight}px`;
    return true;
}

// start trigger score
function startTriggerScore() {
    let i = 0;
    const userScoreTable = document.querySelector('#user-score');
    const bestScore = localStorage.getItem('best_score');
    document.querySelector('#best-score').innerHTML = `Best: ${bestScore}`;
    scoreTriggerInterval = setInterval(()=> {
        i++;
        if( i < window.innerHeight) {
            score++;
            userScoreTable.innerHTML = `Score: ${score}`;
        } else {
            i = 0;
        }
    }, 10);   
    return true;
}

// set user controller
function setUserControl(disable) {
    if(!disable) {
        document.querySelector('#left-button').addEventListener('click', rideLeft) 
        document.querySelector('#right-button').addEventListener('click', rideRight)
        document.onkeydown = checkKey;
        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '37') {
                player.style.left = `${positionLeft}px`;
            }
            if (e.keyCode == '39') {
                player.style.left = `${positionRight}px`;
            }
        }
        return true;
    } else {
        document.onkeydown = checkKey;
        function checkKey(e) {
            e = e || window.event;
            if (e.keyCode == '37') {
                return false;
            }
            if (e.keyCode == '39') {
               return false;
            }
        }
    }
    //  control functions
    function rideLeft() {
        player.style.left = `${positionLeft}px`;
    }
    function rideRight() {
        player.style.left = `${positionRight}px`;
    }
}


// start spawn enemy
function spawnEnemyCars() {
    spawnCarsInterval = setInterval(()=>{
        spawn();
    },1000)
    function spawn() {
        const enemy = document.createElement("div");   
        enemy.classList.add('enemy');    
        const smoke = document.createElement("div");   
        smoke.classList.add('smoke');    
        enemy.appendChild(smoke);   
        const random = Math.floor(Math.random()*3)+1;;
        if(random === 1 ) {
            enemy.classList.add('left');
            roadParts[0].appendChild(enemy); 
            setTimeout(()=> {
                enemy.remove();
            },2000)
        } else if( random === 2 ) {
            enemy.classList.add('right');
            roadParts[1].appendChild(enemy); 
            setTimeout(()=> {
                enemy.remove();
            },2000)
        } else {

            const enemy2 = enemy.cloneNode();
            const smoke = document.createElement("div");   
            smoke.classList.add('smoke');    
            enemy.classList.add('left');
            enemy2.classList.add('right');
            enemy2.appendChild(smoke);   
            roadParts[0].appendChild(enemy); 
            roadParts[1].appendChild(enemy2); 
            setTimeout(()=> {
                enemy.remove();
                enemy2.remove();
            },2000)
        }
    }
    return true;
}

// set damage effects
function setEffectDamage() {
    triggerDamageInterval = setInterval(()=> {
    const enemyCars = Array.from(document.getElementsByClassName('enemy'));
    const playerX  = player.offsetLeft;
    const playerY = player.offsetTop;
    const damageArray = [];
    const startLeftDangerZone = positionLeft + 60;
    const startRightDangerZone = positionRight - 60;
    for(let car of enemyCars) {
        const obj = {y: car.offsetTop, x: car.offsetLeft, el: car};
        if(car.classList.contains('left')) {
            obj.left = true;
        } 
        if(car.classList.contains('right')) {
            obj.right = true;
        }
        damageArray.push(obj); 
    }
    if( playerX < startLeftDangerZone ) {
     const enemyCar = damageArray.find( (el) => el.left === true );
     if(enemyCar && playerY < enemyCar.y + 126 && playerY > enemyCar.y) {
        clearInterval(triggerDamageInterval);
        clearInterval(scoreTriggerInterval);
        clearInterval(spawnCarsInterval);
        gameOver(enemyCar);
     }
    } else if (playerX > startRightDangerZone){
        const enemyCar = damageArray.find( (el) => el.right === true );
        if(enemyCar && playerY < enemyCar.y + 126 && playerY > enemyCar.y) {
           clearInterval(triggerDamageInterval);
           clearInterval(scoreTriggerInterval);
           clearInterval(spawnCarsInterval);
           gameOver(enemyCar);
        }
    }
   },100)
}

// game over
function gameOver(enemyCar) {
    const fire = document.createElement("div");
    fire.classList.add('burn');
    player.appendChild(fire);
    player.style.left = '170px';
    if(enemyCar.right) {
        enemyCar.el.style.transform = 'rotate(-90deg)';
        player.style.transform = 'rotate(100deg)';
        enemyCar.el.style.left = '500px';
    } else {
        enemyCar.el.style.transform = 'rotate(-90deg)';
        player.style.transform = 'rotate(260deg)';
        enemyCar.el.style.left = '-500px';
    }
    document.querySelector('#restart-menu').style.display = 'flex';
    
    setTimeout(() => {
        document.querySelector('#game-widnow').style.animation = 'none';
        document.querySelector('#game-wrapper').style.animation = 'none';
        document.querySelector('#buttons').style.display = 'none';
        document.querySelector('#score').style.display = 'none';
        document.querySelector('#restart-menu').style.opacity = '1';
    }, 1000);
    setUserControl(true);
    checkUserScore(score);
    
    function checkUserScore(currentScore) {
        const restartMenuScore = document.querySelector('#total-score-title');
        const bestScore = parseInt(localStorage.getItem('best_score'), null);
        if(bestScore) {
            if(currentScore > bestScore) {
                localStorage.setItem('best_score', currentScore.toString());
                document.querySelector("#best-score").innerHTML = `Best: ${currentScore}`;
                restartMenuScore.innerHTML = `New best score: ${currentScore}`;
            } else {
                restartMenuScore.innerHTML = `Score: ${currentScore}`;
                return false;
            }
        } else {
            restartMenuScore.innerHTML = `New best score: ${currentScore}`;
            localStorage.setItem('best_score', currentScore.toString());
        }
    }
}

function restartGame() {
    console.log('restart'); 
}
