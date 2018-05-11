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

// start generate
build(true);

// build function
function build(continueGenerate) {
    if(continueGenerate) {
        build(genetate.next().value);
    } else {
        return console.log('done');
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
        const obj = {player: false, enemy: false};
        i = roadPart.offsetWidth;
    }
        roadPartOffset = i;
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
    let speed = 10;
    const userScoreTable = document.querySelector('#user-score');
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
function setUserControl() {
    document.querySelector('#left-button').addEventListener('click', (e)=> {
        player.style.left = `${positionLeft}px`;
    }) 
    document.querySelector('#right-button').addEventListener('click', (e)=> {
        player.style.left = `${positionRight}px`;
    })
    document.onkeydown = checkKey;

    // keydown detect 
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
            roadParts[0].appendChild(enemy); 
            setTimeout(()=> {
                enemy.remove();
            },2000)
        } else if( random === 2 ) {
            roadParts[1].appendChild(enemy); 
            setTimeout(()=> {
                enemy.remove();
            },2000)
        } else {
            const enemy2 = enemy.cloneNode();
            const smoke = document.createElement("div");   
            smoke.classList.add('smoke');    
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
        const obj = {y: car.offsetTop, x: car.offsetLeft};
        if(obj.x < startLeftDangerZone) {
            obj.left = true;
            obj.right = false;
        } else {
            obj.right = true;
            obj.left = false;
        }
        damageArray.push(obj); 
    }
    for(let enemyPos of damageArray) {
        if(playerY < enemyPos.y + 10 && playerY  > enemyPos.y) {
            if(enemyPos.left) {
                if(playerX < startLeftDangerZone) {

                }
            } else {

            }
        }
        // where find solution 
        /* clearInterval(triggerDamageInterval);
        clearInterval(scoreTriggerInterval);
        clearInterval(spawnCarsInterval);
        gameOver(); */
    }
   },100)
}

// game over
function gameOver() {
    console.log(false);
}
