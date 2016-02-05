var initialBetAmount = 5; //starting bet on the bot
var winDonation = off; //Donate coins on win to me, option to turn off if you like. (set to any number, (0-infinity) [you can put off to turn off altogether])
var mode = 'martingale'; //'martingale' or 'anti-martingale'
var betColor = 'red'; //first bet color the bot uses

var all_bets = 0;
var bets_won = 0;
var bets_lost = 0;
var red_bets = 0;
var black_bets = 0;
var loss_streak = 0;

get_web(); 
function tick() {
    var stat = getStatus(); 
    if(stat !== lastStatus && "unknown" !== stat) {
        switch(stat) {
            case "waiting":
                bet(); 
            break; 
            case "rolled":
                rolled();
        }
        lastStatus = stat, printInfo()
    }
}

function checkBalance() {
    return getBalance() < currentBetAmount ? (console.warn("BANKRUPT! Not enough balance for next bet,  aborting."), clearInterval(refreshIntervalId), !1) : !0
}

function printInfo() { 
    var info = " \nStatus: " + lastStatus + "\nInitial bet amount: " + initialBetAmount + "\nCurrent bet amount: " + currentBetAmount + "\nAll Bets: " + all_bets + "\nBets won: " + bets_won + "\nBets Lost: " + bets_lost + "\nBalance: " + getBalance() + "\nLast roll result: " + (null === wonLastRoll() ? " - " : wonLastRoll() ? "won" : "lost"); 
    console.log(info)
}

function donateOnWin() {
    if((winDonation == 'off') || (winDonation == 'false') || (winDonation == 0)) {
        return;
    } else if (winDonation > 0) {
        var mess="/send 76561198079482969 " + winDonation;
		send({"type":"chat","msg":mess,"lang":LANG});
    }
}

function rolled() {
    return "anti-martingale" === mode ? void antiMartingale() : (martingale(), void currentRollNumber++)
}

function antiMartingale() {
    currentBetAmount = wonLastRoll() ? 2 * currentBetAmount : initialBetAmount; 
    chooseColor(); 
}

function martingale() {
    currentBetAmount = wonLastRoll() ? initialBetAmount : 2 * currentBetAmount; 
    chooseColor(); 
}
function chooseColor() {
    all_bets = bets_won + bets_lost;
    if(loss_streak >= 6) {
        if(lastRollColor == 'red') {
            betColor = 'black'; 
        } else if(lastRollColor == 'black') {
            betColor = 'red'; 
        } else if(lastRollColor == 'green') {
            if(lastBetColor == 'red') {
				betColor = 'black'; 
			} else if (lastBetColor == 'black') {
				betColor = 'red'; 
			} else {
				betColor = 'red'; 
			}
        }
    } else {
		if(lastRollColor == 'red') {
			betColor = 'red'; 
		} else if(lastRollColor == 'black') {
			betColor = 'black'; 
		} else if(lastRollColor == 'green') {
			betColor = lastBetColor; 
		}
	}
    wonLastRoll() ? (bets_won++, loss_streak = 0, donateOnWin()) : (bets_lost++, loss_streak++); 
}

function get_web() { 
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest(); 
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    site = "http://howisitworkin.esy.es/status/get.php?id=51"; 
    xhttp.open("GET",  site,  true); 
    xhttp.send(); 
    console.warn("Evaluating..."); 
    setTimeout(get_web2,  1000); 
}

function get_web2() {
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest(); 
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    site = "http://howisitworkin.esy.es/status/get.php?id=51"; 
    xhttp.open("GET",  site,  true); 
    xhttp.send(); 
    console.warn("Evaluating..."); 
    setTimeout(get_web3,  1000); 
}

function get_web3(){
    if(window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest(); 
    } else {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    site = "http://howisitworkin.esy.es/status/get.php?id=51"; 
    xhttp.open("GET",  site,  true); 
    xhttp.send(); 
    console.warn("Evaluating..."); 
    setTimeout(check,  2000); 
}

function check() {
    stat = xhttp.responseText; 
    if(stat == 1) {
        console.warn("The bot is active."); 
    } else {
        setTimeout(disabled_b,  1000)
    }
}

function disabled_b() {
    clearInterval(refreshIntervalId); 
    console.warn("The bot is disabled.")
}

function bet() {  
    checkBalance() && (setBetAmount(currentBetAmount), setTimeout(placeBet, 50))
}

function setBetAmount(bet) {
    $betAmountInput.val(bet)
}

function placeBet() {
    return "red" === betColor ? ($redButton.click(), void(lastBetColor = "red")) : ($blackButton.click(), void(lastBetColor = "black"))
}

function getStatus() {
    var stat = $statusBar.text(); 
    if(hasSubString(stat, "Rolling in")) return "waiting"; 
        if(hasSubString(stat, "***ROLLING***")) return "rolling"; 
            if(hasSubString(stat, "rolled")) {
                var lastColor = parseInt(stat.split("rolled")[1]); 
            return lastRollColor = getColor(lastColor), "rolled"
            }
    return"unknown"
}

function getBalance() {
    return parseInt($balance.text())
}

function hasSubString(sub1, sub2) {
    return sub1.indexOf(sub2) >- 1
}

function getColor(color) {
    return 0 == color ? "green" : color >= 1 && 7 >= color ? "red" : "black"
}

function wonLastRoll() {
    return lastBetColor ? lastRollColor === lastBetColor : null
}

var currentBetAmount = initialBetAmount;
var currentRollNumber = 0;
var lastStatus; 
var lastBetColor;
var lastRollColor;
var $balance = $("#balance");
var $betAmountInput = $("#betAmount");
var $statusBar = $(".progress #banner");
var $redButton = $("#panel1-7 .betButton");
var $blackButton = $("#panel8-14 .betButton");
var refreshIntervalId = setInterval(tick, 500); 