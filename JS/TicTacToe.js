//Setting the variables for whose turn it is and an array for the move locations
let activePlayer = "X";
let selectedSquares = [];

//Storing the placement of X's and O's
function placeXOrO(squareNumber) {
    //Using this condition to check if a square has already been chosen, preventing a square from being selected twice
    if (!selectedSquares.some(Element => Element.includes(squareNumber))) {
        let select = document.getElementById(squareNumber);
        //Turn check for X or O placement
        if (activePlayer === "X") {
            select.style.backgroundImage = 'url("images/x.png")';
        }
        else {
            select.style.backgroundImage = 'url("images/o.png")';
        }
        //Adding the square selection and who made the move to the array
        selectedSquares.push(squareNumber + activePlayer);
        checkWinConditions();
        if (activePlayer === "X") {
            activePlayer = "O";
        }
        else {
            activePlayer = "X";
        }
        //Placement sound effect
        audio('./media/place.mp3');
        //If it's the computer's turn, this check will disable the player's click
        if(activePlayer === "O") {
            disableClick();
            setTimeout(function (){ computersTurn(); }, 1000)
        }
        return true
    }
    //Condition for computer's move, creates a random move
    function computersTurn() {
        let success = false;
        let pickASquare;
        //Condition to retry the move if the random number is a square that has already been chosen
        while(!success){
            pickASquare = String(Math.floor(Math.random() * 9));
            if (placeXOrO(pickASquare)){
                placeXOrO(pickASquare);
                success = true;
            };
        }
    }
}

//Array check to determine if these specific combinations of squares have been chosen
function checkWinConditions() {
    if      (arrayIncludes('0X', '1X', '2X')) { drawWinLine(50, 100, 558, 100) }
    else if (arrayIncludes('3X', '4X', '5X')) { drawWinLine(50, 304, 558, 304) }
    else if (arrayIncludes('6X', '7X', '8X')) { drawWinLine(50, 508, 558, 508) }
    else if (arrayIncludes('0X', '3X', '6X')) { drawWinLine(100, 50, 100, 558) }
    else if (arrayIncludes('1X', '4X', '7X')) { drawWinLine(304, 50, 304, 558) }
    else if (arrayIncludes('2X', '5X', '8X')) { drawWinLine(508, 50, 508, 558) }
    else if (arrayIncludes('6X', '4X', '2X')) { drawWinLine(100, 508, 510, 90) }
    else if (arrayIncludes('0X', '4X', '8X')) { drawWinLine(100, 100, 520, 520) }
    else if (arrayIncludes('0O', '1O', '2O')) { drawWinLine(50, 100, 558, 100) }
    else if (arrayIncludes('3O', '4O', '5O')) { drawWinLine(50, 304, 558, 304) }
    else if (arrayIncludes('6O', '7O', '8O')) { drawWinLine(50, 508, 558, 508) }
    else if (arrayIncludes('0O', '3O', '6O')) { drawWinLine(100, 50, 100, 558) }
    else if (arrayIncludes('1O', '4O', '7O')) { drawWinLine(304, 50, 304, 558) }
    else if (arrayIncludes('2O', '5O', '8O')) { drawWinLine(508, 50, 508, 558) }
    else if (arrayIncludes('6O', '4O', '2O')) { drawWinLine(100, 508, 510, 90) }
    else if (arrayIncludes('0O', '4O', '8O')) { drawWinLine(100, 100, 520, 520) }
    
    //Check if all squares have been selected and there's no winner, indicating a tie
    else if (selectedSquares.length >= 9) {
        audio('./media/tie.mp3');
        setTimeout(function () {resetGame(); }, 1000);
    }

    //Setting three variables to check to see if any of the arrayIncludes combinations are fully true
    function arrayIncludes(squareA, squareB, squareC) {
        const a = selectedSquares.includes(squareA)
        const b = selectedSquares.includes(squareB)
        const c = selectedSquares.includes(squareC)
        if (a === true && b === true && c === true) { return true }
    }
}

//Disabling clicking inside the squares for 1 second
function disableClick() {
    body.style.pointerEvents = 'none';
    setTimeout(function() {body.style.pointerEvents = 'auto';}, 1000);
}

//Plays an audio file based on the URL path variable it receives
function audio(audioURL) {
    let audio = new Audio(audioURL);
    audio.play();
}

//Determining the coordinates of the winning line to be drawn
function drawWinLine(coordX1, coordY1, coordX2, coordY2) {
    const canvas = document.getElementById('win-lines');
    const c = canvas.getContext('2d');
    let x1 = coordX1,
        y1 = coordY1,
        x2 = coordX2,
        y2 = coordY2,
        x = x1,
        y = y1;
    //Setting up the animation by creating a loop, reseting the line path, and defining the coordinates
    function animateLineDrawing() {
        const animationLoop = requestAnimationFrame(animateLineDrawing);
        c.clearRect(0, 0, 608, 608)
        c.beginPath();
        c.moveTo(x1, y1)
        c.lineTo(x, y)
        c.lineWidth = 10;
        c.strokeStyle = 'rgba(68, 118, 255, 0.75)';
        c.stroke();
        //condition to check if the line has been fully drawn by checking the end x and y points
        if (x1 <= x2 && y1 <= y2) {
            if (x < x2) { x += 10; }
            if (y < y2) { y += 10; }
            if (x >= x2 && y >= y2) { cancelAnimationFrame(animationLoop); }
        }
        //Additional check specific to the 6, 4, 2 win condition
        if (x1 <= x2 && y1 >= y2) {
            if (x < x2) { x += 10; }
            if (y > y2) { y -= 10; }
            if (x >= x2 && y <= y2) { cancelAnimationFrame(animationLoop); }
        }
    }

    //Clearing the canvas when the winning line is drawn
    function clear() {
        const animationLoop = requestAnimationFrame(clear);
        c.clearRect(0, 0, 608, 608);
        cancelAnimationFrame(animationLoop);
    }
    //Disables clicking while an audio file is playing
    disableClick();
    audio('./media/wingame.mp3');
    animateLineDrawing();
    setTimeout(function () { clear(); resetGame(); }, 1000);
}

//Resetting the game once the game has completed
function resetGame() {
    //Setting the loop to go through each square and reset the icons
    for (let i = 0; i < 9; i++) {
        let square = document.getElementById(String(i))
        square.style.backgroundImage = ''
    }
    //Resetting the array to start fresh
    selectedSquares = []
}