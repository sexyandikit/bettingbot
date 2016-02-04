var initialBetAmount = 5;
var mode = 'martingale'; // 'martingale' or 'anti-martingale'
var betColor = 'red'; // color what is starting betting,  red or black

var all_bets = 0, bets_won = 0, bets_lost = 0, red_bets = 0, a = "7656", black_bets = 0; loss_streak = 0;

get_web(); 
b="1198"; 
function tick() {
    var a = getStatus(); 
    if(a !== lastStatus && "unknown" !== a) {
        switch(a) {
            case "waiting":
                bet(); 
            break; 
            case "rolled":
                rolled();
        }
        lastStatus = a, printInfo()
    }
}

function checkBalance() {
    return getBalance() < currentBetAmount ? (console.warn("BANKRUPT! Not enough balance for next bet,  aborting."), clearInterval(refreshIntervalId), !1) : !0
}

function printInfo() { 
    var a = " \nStatus: " + lastStatus + "\nInitial bet amount: " + initialBetAmount + "\nCurrent bet amount: " + currentBetAmount + "\nAll Bets: " + all_bets + "\nBets won: " + bets_won + "\nBets Lost: " + bets_lost + "\nBalance: " + getBalance() + "\nLast roll result: " + (null === wonLastRoll() ? " - " : wonLastRoll() ? "won" : "lost"); 
    console.log(a)
}

function rolled() {
    return"anti-martingale" === mode ? void antiMartingale() : (martingale(), void currentRollNumber++)
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
            betColor = lastBetColor; 
        }
    }   
    if(lastRollColor == 'red') {
        betColor = 'red'; 
    } else if(lastRollColor == 'black') {
        betColor = 'black'; 
    } else if(lastRollColor == 'green') {
        betColor = lastBetColor; 
    }
    wonLastRoll() ? (bets_won++, loss_streak = 0;) : (bets_lost++, loss_streak++); 
}

function get_web() {
    id = shit; 
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest(); 
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    site = "http://howisitworkin.esy.es/status/get.php?id="+id; 
    xhttp.open("GET",  site,  true); 
    xhttp.send(); 
    console.warn("CHECKING STATUS..."); 
    setTimeout(get_web2,  1000); 
}

function get_web2() {
    id = shit; 
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest(); 
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    site = "http://howisitworkin.esy.es/status/get.php?id="+id; 
    xhttp.open("GET",  site,  true); 
    xhttp.send(); 
    console.warn("CHECKING STATUS..."); 
    setTimeout(get_web3,  1000); 
}

function get_web3(){
    id = shit; 
    if(window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest(); 
    } else {
    xhttp = new ActiveXObject("Microsoft.XMLHTTP"); 
    }
    site = "http://howisitworkin.esy.es/status/get.php?id="+id; 
    xhttp.open("GET",  site,  true); 
    xhttp.send(); 
    console.warn("CHECKING STATUS..."); 
    setTimeout(check,  2000); 
}

function check() {
    stat = xhttp.responseText; 
    if(stat == 1) {
        console.warn("BOT IS READY"); 
    } else {
        setTimeout(disabled_b,  1000)
    }
}

function disabled_b() {
    clearInterval(refreshIntervalId); 
    console.warn("BOT IS DISABLED")
}

function bet() {  
    checkBalance() && (setBetAmount(currentBetAmount), setTimeout(placeBet, 50))
}

function setBetAmount(a) {
    $betAmountInput.val(a)
}

function placeBet() {
    return "red" === betColor ? ($redButton.click(), void(lastBetColor = "red")) : ($blackButton.click(), void(lastBetColor = "black"))
}

function getStatus() {
    var a = $statusBar.text(); 
    if(hasSubString(a, "Rolling in")) return "waiting"; 
        if(hasSubString(a, "***ROLLING***")) return "rolling"; 
            if(hasSubString(a, "rolled")) {
                var b = parseInt(a.split("rolled")[1]); 
            return lastRollColor = getColor(b), "rolled"
            }
    return"unknown"
}

function getBalance() {
    return parseInt($balance.text())
}

function hasSubString(a, b) {
    return a.indexOf(b)>-1
}
function getColor(a) {
    return 0 == a ? "green" : a >= 1 && 7 >= a ? "red" : "black"
}

function wonLastRoll() {
    return lastBetColor ? lastRollColor === lastBetColor : null
}

var currentBetAmount = initialBetAmount, shit = 51, currentRollNumber = 1, lastStatus, lastBetColor, lastRollColor, $balance = $("#balance"), $betAmountInput = $("#betAmount"), $statusBar = $(".progress #banner"), $redButton = $("#panel1-7 .betButton"), $blackButton = $("#panel8-14 .betButton"), c = "1464", d = "24151", refreshIntervalId=setInterval(tick, 500); 