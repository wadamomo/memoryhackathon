// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card]

// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons
const stars = document.querySelectorAll(".fa-star");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

 // stars list
 let starsList = document.querySelectorAll(".stars li");

 // close icon in modal
 let closeicon = document.querySelector(".close");

 // declare modal
 let modal = document.getElementById("popup1")

 // array for opened cards
var openedCards = [];


// shuffles cards
// @param {array}
// @returns shuffledarray
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


// shuffles cards when page is refreshed / loads
document.body.onload = startGame();

document.querySelector(".restart").addEventListener("click", function() {
    playAgain();
});
document.getElementById("play-again").addEventListener("click", function() {
    playAgain();
});
// function to start a new play 
function startGame(){
    // shuffle deck

    document.getElementsByClassName('popup')[0].style.display = 'none';
    document.getElementsByClassName('deck')[0].style.display = 'block';
    document.getElementsByClassName('score-panel')[0].style.display = 'block';
    document.getElementById("my-canvas").style.display = 'none';

    cards = shuffle(cards);
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cards, function(item) {
            deck.appendChild(item);
        });
        cards[i].classList.remove("show", "open", "match", "disabled");
        cards[i].childNodes[1].childNodes[0].classList.remove("shown");
    }

    document.querySelector('#marq').style.display = "none";

    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.color = "#FFD700";
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0; 
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}


// toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};


// add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
	// setTimeout(() => {this.classList.add("shown")}, 1)
	setTimeout(() => {this.childNodes[1].childNodes[0].classList.add("shown")}, 1)
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
			matched();
        } else {
            setTimeout(() => {openedCards[0].childNodes[1].childNodes[0].classList.add("hidden")}, 1000)
            setTimeout(() => {openedCards[1].childNodes[1].childNodes[0].classList.add("hidden")}, 1000)
            setTimeout(() => {openedCards[0].childNodes[1].childNodes[0].classList.remove("shown")}, 1000)
            setTimeout(() => {openedCards[1].childNodes[1].childNodes[0].classList.remove("shown")}, 1000)
            setTimeout(() => {openedCards[0].childNodes[1].childNodes[0].classList.remove("hidden")}, 1000)
            setTimeout(() => {openedCards[1].childNodes[1].childNodes[0].classList.remove("hidden")}, 1000)
            unmatched();
        }
    }
};


// when cards match
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// description when cards don't match
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
    },1100);
}


// disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for( i= 0; i < 3; i++){
            if(i > 1){
                // stars[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 1){
        console.log(document.querySelector('#loser').childNodes[1]);
        document.querySelector('#marq').style.display = "inline";
    }
}


// game timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

let hasRenderedConfetti = false;

// congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    if (matchedCard.length == 2){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // show congratulations modal
        modal.classList.add("show");

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("totalTime").innerHTML = finalTime;
        
        // add play again lisener

        document.getElementsByClassName('popup')[0].style.display = 'block';
        document.getElementsByClassName('deck')[0].style.display = 'none';
        document.getElementsByClassName('score-panel')[0].style.display = 'none';
        document.getElementById("my-canvas").style.display = 'block';

        if (!hasRenderedConfetti) {
            var confettiSettings = { target: 'my-canvas' };
            var confetti = new window.ConfettiGenerator(confettiSettings);
            confetti.render();    
            hasRenderedConfetti = true;
        }
        
        $(".deck").attr("display","none");
        //closeicon on modal
        closeModal();
    };
}


// close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// for user to play Again 
function playAgain(){
    modal.classList.remove("show");
    startGame();
}


// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
	card.addEventListener("click",congratulations);
};
