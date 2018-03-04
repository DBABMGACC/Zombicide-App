const shuffle = require('shuffle-array');

let party = startingParty(3);
let tiles = startingTiles();
let mission = missionType();
let cure = cureAmount(3,6);

console.log(`Your starting party is: ${party}\r\n
(Escape Applicable) Your starting tiles are: ${tiles}\r\n
(Escape Applicable) Your starting mission is: ${mission}\r\n
You need ${cure} objectives to find the cure!`);



function startingTiles(){
    let tileArray = ["5D","4D","4B","5B","6B","2B",
                    "5M","4M","3M","6M","1M","8M",
                    "2M","7M","5F","7B","2C","6C",
                    "4C","5C","1B","3B","1C","3C",
                    "4E","5E"];

    return shuffle(tileArray).slice(0,2);
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