const shuffle = require('shuffle-array');
const promise = require('promise');
const fs = require('fs');

// Pseudo MainLine Logic
let finalTileInfo = tileInfo();
let openTiles = finalTileInfo;
let detailObject = detailGenerator();
let missionPath = generateEscapePath(detailObject,openTiles.slice());
console.log(newGame(detailObject,missionPath));




function detailGenerator(){
   let detailObject = 
        {
            Party: startingParty(3),
            Tile: startingTile(),
            Mission: missionType(),
            Cure: cureAmount(3,6)
        }  
    return detailObject;
}




function newGame(detailObject,myPath){
return `Your starting party is: ${detailObject.Party.replace(/,/g, '')}\r\n
Your starting tile is: ${detailObject.Tile}\r\n
Your mission path is:\r\n${missionPath}\r\n
You need ${detailObject.Cure} objectives to find the cure!`
}


function startingTile(){
    let tileArray = ["5D","4D","4B","5B","6B","2B",
                    "5M","4M","3M","6M","1M","8M",
                    "2M","7M","5F","7B","2C","6C",
                    "4C","5C","1B","3B","1C","3C",
                    "4E","5E"];

    return shuffle(tileArray).slice(0,1);
}

function startingParty(groupSize){
    let size = groupSize;
    let charArray = ["Josh","Wanda","Ned","Amy","Phil","Doug",
                    "Angry Mary","Red Cap Ben","Bones",
                    "Padre Johnson","Neema","Derek","Elsa","Raoul"];
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

        case (randomNum > 45 && randomNum <= 65):
            return "Rescue";
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
function tileGenerator(missionPath,openTiles){
    let joinedPath = [];
    let pathTiles = tileGrabber((missionPath.length),openTiles)

    for (var i = 0; i < missionPath.length; i++){
        joinedPath.push(`Mission: ${missionPath[i]}, Tile: ${pathTiles[i].Name}, Orientation: ${pathTiles[i].Orientation}, Zombies: ${pathTiles[i].Zombies}\r\n`);
    }
    return joinedPath.join("");
}

// Reads the CSV containing all tile's info, and splits each tile into an object we are able to work with, all tile properties included
function tileInfo(){
    let ourCoin = ((Math.floor(Math.random()*100) + 1))
    let tileInfo = "";

    if(ourCoin % 2 === 0){
        tileInfo = fs.readFileSync('./array1.csv',"utf8");
        return getPath(tileInfo);
    }
    else{
        tileInfo = fs.readFileSync('./array2.csv',"utf8");
        return getPath(tileInfo);
    }
}

// tileGrabber gets handed a length, then shuffles and returns a number of random tiles equal to the length it was handed
function tileGrabber(length){
    let tileArray = tileInfo();
    return shuffle(tileArray).slice(0,length);
}

// Attempts to generate an escape mission path, if that path length is less than 3 or larger than 7, it generates a new path and pipes the
// generated path to tileGenerator.
function generateEscapePath(detailObject,openTiles){
    let missionPath = [];
    let possibleTokens = 0;
    let cureCount = detailObject.Cure;

    while(possibleTokens !== cureCount){
        let tempMission = missionType();
        if(tempMission === "Search" || tempMission === "Neutralize"){
            possibleTokens++;
            missionPath.push(tempMission);
        }
        else if (tempMission === "Rescue"){
            possibleTokens++;
            let theRescue = generateRescue(detailObject);
            missionPath.push(`${tempMission} ${theRescue}`);
        }
        else{
            missionPath.push(tempMission);
        }
    }
     return tileGenerator(missionPath);
}

// FIX THIS, ITS RETURNING WITH WEAPONS!!!!!!!
function generateRescue(detailObject){
    let allPeople = fs.readFileSync('./characters.csv',"utf8");
    let party = detailObject.Party.split(",");
    

}

function zombieCreator(){
    let randomNum = (Math.floor(Math.random()*100) + 1);

    switch(true){

        case randomNum <= 60:
            return `Walkers: ${(Math.floor(Math.random()*5)+1)}`;
            break;

        case (randomNum > 60 && randomNum <= 85):
            return `Fatties: ${(Math.floor(Math.random()*3)+1)}`;
            break;

        case (randomNum > 85 && randomNum <= 100):
            return `Runners: ${(Math.floor(Math.random()*2)+1)}`;
            break;

        default: console.log("ERROR");
    }
}

function getPath(tileInfo){
    let finalTileInfo = [];

    tileInfo = tileInfo.split("\r\n");

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
                sisterTile: `${tileFrame[i][4]}`,
                Orientation: `${Math.floor(Math.random()*4) + 1}`,
                Zombies: `${tempZombies}`

            }
        )
    }
    return finalTileInfo;
}

function weaponType(){
    let randomNum = (Math.floor(Math.random()*100) + 1);
    // pan, pistol, fireaxe, crowbar, shotgun, rifle, machete, baseball bat
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