const shuffle = require('shuffle-array');
const fs = require('fs');
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

console.log(finalArr);
// ADD ZOMBIE SPAWN FEATURE


// let tiles = startingTiles();
// console.log(tiles);

// function startingTiles(){
//     let tileArray = ["5D","4D","4B","5B","6B","2B",
//                     "5M","4M","3M","6M","1M","8M",
//                     "2M","7M","5F","7B","2C","6C",
//                     "4C","5C","1B","3B","1C","3C",
//                     "4E","5E"];

//     return shuffle(tileArray).slice(0,2);
// }

