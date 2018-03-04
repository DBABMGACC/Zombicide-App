const shuffle = require('shuffle-array');
const promise = require('promise');
const fs = require('fs');

// Pseudo MainLine Logic
let detailObject = detailGenerator();
let missionPath = generateEscapePath();
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
return `Your starting party is: ${detailObject.Party}\r\n
Your starting tile is: ${detailObject.Tile}\r\n
Your mission path is: ${missionPath}\r\n
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

    return shuffle(charArray).slice(0,size).join(", ");
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
function tileGenerator(missionPath){
    let joinedPath = [];
    let pathTiles = tileGrabber((missionPath.length))

    for (var i = 0; i < missionPath.length; i++){
        joinedPath.push(`Mission: ${missionPath[i]}, Tile: ${pathTiles[i].Name}\r\n`)
    }
    return joinedPath;
}

// Reads the CSV containing all tile's info, and splits each tile into an object we are able to work with, all tile properties included
function tileInfo(){
    let finalArr = [];
    let testString = fs.readFileSync('./tileInfo.csv',"utf8");
    testString = testString.split("\r\n");

    let newArr = testString.map(e => {
        return e.split(",");
    });

    for (var i = 1; i < newArr.length; i++){
        finalArr.push(
            {
                Name: `${newArr[i][0]}`,
                External: `${newArr[i][1]}`,
                Spawn: `${newArr[i][2]}`,
                Rooms: `${newArr[i][3]}`,
                Orientation: `${Math.floor(Math.random()*4) + 1}`,
                Zombies: `${zombieCreator()}`
            }
        )
    }
return finalArr;
}

// tileGrabber gets handed a length, then shuffles and returns a number of random tiles equal to the length it was handed
function tileGrabber(length){
    let tileArray = tileInfo();
    return shuffle(tileArray).slice(0,length);
}

// Attempts to generate an escape mission path, if that path length is less than 3 or larger than 7, it generates a new path and pipes the
// generated path to tileGenerator.
function generateEscapePath(){
    let missionPath = [];
    let mission = "";
    let missionCounter = 1;

    while(mission !== "Escape"){
        let tempMisson = missionType();

        missionPath.push(tempMisson);
        mission = tempMisson;
        missionCounter++;
    }

    if(missionPath.length > 7 || missionPath.length < 3){
        return generateEscapePath();
    }
    else{
        return tileGenerator(missionPath);
    }
}

function zombieCreator(){
    let randomNum = (Math.floor(Math.random()*100) + 1);

    switch(true){

        case randomNum <= 60:
            return `Walkers: ${(Math.floor(Math.random()*5))}`;
            break;

        case (randomNum > 60 && randomNum <= 85):
            return `Fatties: ${(Math.floor(Math.random()*3))}`;
            break;

        case (randomNum > 85 && randomNum <= 100):
            return `Runners: ${(Math.floor(Math.random()*2))}`;
            break;

        default: console.log("ERROR");
    }
}