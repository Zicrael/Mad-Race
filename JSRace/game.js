const roads = [];
let score = 0;
function buildRoadParts() {
    const roadParts = Array.from(document.getElementsByClassName('road-part'));
    for (roadPart of roadParts) {
        roadPart.style.width = `calc( 100% / ${roadParts.length} )`;
        const obj = {player: false, enemy: false};
    }
    startRoadMove();
}
function startRoadMove() {
    let i = 0;
    let speed = 10;
    const road = document.getElementsByClassName('game-widnow')[0];
    const grass = document.getElementsByClassName('game-wrapper')[0];
    const userScoreTable = document.getElementsByClassName('user-score')[0];
    setInterval(()=> {
        i++;
        if( i < window.innerHeight) {
            road.style.backgroundPositionY = `${i}px`;
            score++;
            grass.style.backgroundPositionY = `${i}px`;
            userScoreTable.innerHTML = `Score: ${score}`;
        } else {
            i = 0;
        }
    }, 1);   
}

buildRoadParts();