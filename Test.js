function numberPlayers(){
    var text;
var numberPlayers = prompt ("Number of players:");
    if (numberPlayers == null || numberPlayers == "") {
        text =  "User cancelled the prompt";
    } else {
        text  =  "Good luck and hope  you " + numberPlayers + " have fun!";
    }
document.getElementById("playerAmount").innerHTML = text;
}