const shuffle = require('shuffle-array');
const fs = require('fs');



let myPath = escapePath();
console.log(myPath.join(""));


// ADD RANDOMIZATION TO EACH TILE PIECE INFO UNDER TILEGENERATOR!!!!!!!!!
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
function csvReader(){
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
                Internal: `${newArr[i][2]}`,
                Rooms: `${newArr[i][3]}`
            }
        )
    }
return finalArr;
}

// tileGrabber gets handed a length, then shuffles and returns a number of random tiles equal to the length it was handed
function tileGrabber(length){
    let tileArray = csvReader();
    return shuffle(tileArray).slice(0,length);
}

// Attempts to generate an escape mission path, if that path length is less than 3 or larger than 7, it generates a new path and pipes the
// generated path to tileGenerator.
function escapePath(){
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
        return escapePath();
    }
    else{
        return tileGenerator(missionPath);
    }
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