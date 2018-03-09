const shuffle = require('shuffle-array');
const promise = require('promise');
const fs = require('fs');

// Pseudo MainLine Logic

let detailObject = detailGenerator();
let missionPath = generateEscapePath(detailObject);
console.log(newGame(detailObject,missionPath));




function detailGenerator(){
   let detailObject = 
        {
            Party: startingParty(3),
            Mission: missionType(),
            Cure: cureAmount(3,6)
        }  
    return detailObject;
}

function newGame(detailObject,myPath){
return `Your starting party is: ${detailObject.Party.replace(/,/g, '')}\r\n
Your mission path is:\r\n${missionPath}\r\n
You need ${detailObject.Cure} objectives to find the cure!`
}

function startingParty(groupSize){
    let size = groupSize;
    let charArray = ["Josh","Wanda","Ned","Amy","Phil","Doug",
                    "Mary","Ben","Bones",
                    "Johnson","Neema","Derek","Elsa","Raoul"];
    let weapons = [];
    let partyWithWeapons = [];
    let party = shuffle(charArray).slice(0,size);

    for ( var i = 0; i < groupSize; i++){
        weapons.push(weaponType());
    }

    for (var i= 0; i < groupSize; i++){
        partyWithWeapons.push(`\r\n${party[i]} with a ${weapons[i]}`)
    }
    return partyWithWeapons.join(",");
}

function missionType(){
    let randomNum = (Math.floor(Math.random()*100) + 1);

    switch(true){

        case randomNum <= 25:
            return "Search";
            break;

        case (randomNum > 25 && randomNum <= 45):
            return "Neutralize";
            break;

        case (randomNum > 45 && randomNum <= 55):
            return "Rescue";
            break;

        case (randomNum > 55 && randomNum <= 65):
            return "Battle Royale";
            break;

        case (randomNum > 65 && randomNum <= 75):
            return "Barricade";
            break;

        case (randomNum > 75 && randomNum <= 80):
            return "Survive";
            break;

        case (randomNum > 80 && randomNum <= 85):
            return "Nest";
            break;

        case (randomNum > 85):
            return "Escape";
            break;

        default: console.log("ERROR");
    }
}

function cureAmount(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

// tileGenerator gets handed a mission path, then calls tileGrabber to grab the number of needed tiles, and pairs them together
// by iterating over the length of the path
function tileGenerator(missionPath){
    let joinedPath = [];
    let token = "";
    let enemies = "";
    let pathTiles = tileGrabber(missionPath);
    
    for (var i = 0; i < missionPath.length; i++){
        if(missionPath[i].substring(0,3) === "Neu" || missionPath[i].substring(0,3) === "Sea" || missionPath[i].substring(0,3) === "Bat"){
            token = ((Math.floor(Math.random()*(pathTiles[i][0].Rooms)) + 1));
        }
        else{
            token = "N/A";
        }
        if(i === 0){
            joinedPath.push(`Starting Tile: ${pathTiles[0][0].Name}
            \r\n`)
        }
        else{
            joinedPath.push(`Mission: ${missionPath[i]}, Tile: ${pathTiles[i][0].Name}, Token Location: ${token}, Orientation: ${pathTiles[i][0].Orientation}, Zombie Spawn Location: ${(Math.floor(Math.random()*(pathTiles[i][0].Spawn))+1)}, Zombies: ${pathTiles[i][0].Zombies}
            \r\n`);
        }
    }
    return joinedPath.join("");
}

// Reads the CSV containing all tile's info, and splits each tile into an object we are able to work with, all tile properties included
function getTiles(){
    let ourCoin = ((Math.floor(Math.random()*100) + 1))
    let tiles = "";

    if(ourCoin % 2 === 0){
        tiles = fs.readFileSync('./array1.csv',"utf8");
        return getTileInfo(tiles);
    }
    else{
        tiles = fs.readFileSync('./array2.csv',"utf8");
        return getTileInfo(tiles);
    }
}

// tileGrabber gets handed a length, then shuffles and returns a number of random tiles equal to the length it was handed
function tileGrabber(missionPath){
    let missionLength = missionPath.length;
    let tileArray = fs.readFileSync('./arrayTest.csv',"utf8");
    tileArray = getTileInfo(tileArray);
    let x;
    let tempTiles = [];
    let finalTileArray = [];

    for (var i = 0; i < missionLength+1; i++){
        x = shuffle(tileArray).slice(0,1);
        finalTileArray.push(x);
        tempTiles.push(x[0].Name);
        tileArray = tileArray.filter(e => {
            return (tempTiles.indexOf(e.Name) === -1 && tempTiles.indexOf(e.SisterTile) === -1);
        })
    }
    console.log("FTA Length: "+finalTileArray.length)
    return finalTileArray;
   // return shuffle(tileArray).slice(0,missionLength);
}

// Attempts to generate an escape mission path, if that path length is less than 3 or larger than 7, it generates a new path and pipes the
// generated path to tileGenerator.
function generateEscapePath(detailObject){
    let missionPath = [];
    let possibleTokens = 0;
    let i = -1;
    let tempMission = "";
    let possibleEnemies = (detailObject.Party.split(",").length)-1;
    let cureCount = detailObject.Cure;

    while(possibleTokens !== cureCount){
        i++;
        if( i === 0){
            tempMission = "Rescue";
        }
        else{
            tempMission = missionType();
        }
        
        if(tempMission === "Search" || tempMission === "Neutralize"){
            possibleTokens++;
            missionPath.push(tempMission);
        }
        else if(tempMission === "Battle Royale"){
            let theEnemies = generatePeople(detailObject,possibleEnemies)
            theEnemies = theEnemies.join(` with a ${enemyWeapon()} and a ${enemyWeapon()} for `);
            possibleTokens++;
            missionPath.push(`${tempMission} against ${theEnemies}`);
        }
        else if (tempMission === "Rescue"){
            let theRescue = generatePeople(detailObject,1);
            missionPath.push(`${tempMission} ${theRescue}`);
        }
        else{
            missionPath.push(tempMission);
        }
    }
    console.log(missionPath);
     return tileGenerator(missionPath);
}


function generatePeople(detailObject,number){
    let allPeople = fs.readFileSync('./characters.csv',"utf8").split("\r\n");
    let party = detailObject.Party.split(",");
    let possibleRescues = [];
    
        let splitParty = party.map(e => {
            return e.split(" ");
        })
        let filterParty = splitParty.map(e => {
            return e[0].replace(/(?:\\[rn]|[\r\n]+)+/g, "");
        })
        
        possibleRescues = allPeople.filter( e=> {
        return (filterParty.indexOf(e) === -1);
        })
    return shuffle(possibleRescues).slice(0,number);
}

function zombieCreator(){
    let randomNum = (Math.floor(Math.random()*100) + 1);

    switch(true){

        case randomNum <= 60:
            return `${(Math.floor(Math.random()*5)+1)} Walkers`;
            break;

        case (randomNum > 60 && randomNum <= 85):
            return `${(Math.floor(Math.random()*3)+1)} Fatties`;
            break;

        case (randomNum > 85 && randomNum <= 100):
            return `${(Math.floor(Math.random()*2)+1)} Runners`;
            break;

        default: console.log("ERROR");
    }
}

function getTileInfo(tiles){
    let finalTileInfo = [];

    tileInfo = tiles.split("\r\n");

    let tileFrame = tileInfo.map(e => {
        return e.split(",");
    });

    for (var i = 1; i < tileFrame.length; i++){
        let tempZombies = zombieCreator();
        finalTileInfo.push(
            {
                Name: `${tileFrame[i][0]}`,
                External: `${tileFrame[i][1]}`,
                Spawn: `${tileFrame[i][2]}`,
                Rooms: `${tileFrame[i][3]}`,
                SisterTile: `${tileFrame[i][4]}`,
                Orientation: `${Math.floor(Math.random()*4) + 1}`,
                Zombies: `${tempZombies}`

            }
        )
    }
    return finalTileInfo;
}

function weaponType(){
    let randomNum = (Math.floor(Math.random()*100) + 1);

    switch(true){

        case randomNum <= 15:
            return `Pan`;
            break;

        case (randomNum > 15 && randomNum <= 25):
            return `Pistol`;
            break;

        case (randomNum > 25 && randomNum <= 41):
            return `Fireaxe`;
            break;

        case (randomNum > 41 && randomNum <= 57):
            return `Crowbar`;
            break;

        case (randomNum > 57 && randomNum <= 73):
            return `Machete`;
            break;

        case (randomNum > 73 && randomNum <= 90):
            return `Baseball Bat`;
            break;

        case (randomNum > 90 && randomNum <= 95):
            return `Shotgun`;
            break;

        case (randomNum > 95 && randomNum <= 100):
            return `Rifle`;
            break;    

        default: console.log("ERROR");
    }
}

function enemyWeapon(){
    let randomNum = (Math.floor(Math.random()*100) + 1);

    switch(true){

        case randomNum <= 10:
            return `Pan`;
            break;

        case (randomNum > 10 && randomNum <= 25):
            return `Pistol`;
            break;

        case (randomNum > 25 && randomNum <= 41):
            return `SMG`;
            break;

        case (randomNum > 41 && randomNum <= 57):
            return `Sawed-Off Shotgun`;
            break;

        case (randomNum > 57 && randomNum <= 68):
            return `Machete`;
            break;

        case (randomNum > 68 && randomNum <= 77):
            return `Rifle`;
            break;

        case (randomNum > 77 && randomNum <= 90):
            return `Shotgun`;
            break;

        case (randomNum > 90 && randomNum <= 100):
            return `${mvpWeapon()}`;
            break;    

        default: console.log("ERROR");
    }
}

function mvpWeapon(){
    let randomNum = (Math.floor(Math.random()*100) + 1);
    // Evil Twins, Ma's Shotgun, Golden Ak-47, Pink M4, Daisho, Spas-12, Desert Eagle, Tompson
    switch(true){

        case randomNum <= 13:
            return `Evil Twins`;
            break;

        case (randomNum > 13 && randomNum <= 26):
            return `Ma's Shotgun`;
            break;

        case (randomNum > 26 && randomNum <= 39):
            return `Golden AK-47`;
            break;

        case (randomNum > 39 && randomNum <= 52):
            return `Pink M4`;
            break;

        case (randomNum > 52 && randomNum <= 65):
            return `Daisho`;
            break;

        case (randomNum > 65 && randomNum <= 78):
            return `SPAS-12`;
            break;

        case (randomNum > 78 && randomNum <= 91):
            return `Desert Eagle`;
            break;

        case (randomNum > 91 && randomNum <= 100):
            return `Thompson`;
            break;    

        default: console.log("ERROR");
    }
}