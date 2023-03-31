// 1. Deposit money from user
//2. Determine number of lines to bet on
//3. Collect a bet amount and spin the wheel
//4. Check if user won
//5. give the user their winnings
//6. play again
//7. do continue watching https://www.youtube.com/watch?v=E3XxeE7NF30

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}; //A JSON object
const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}
const deposit = () => {
    while(true) {
        const depositAmount = prompt("Enter a deposit amount: "); // this prompt function returns string by default
        const numberDepositAmount = parseFloat(depositAmount);
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        }
        else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while(true) {
        const lines = prompt("Enter number of lines to bet on (1-3): "); // this prompt function returns string by default
        const numberOfLines = parseFloat(lines);
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        }
        else{
            return numberOfLines;
        }
    }
};
const getBet = (balance,lines) => {
    while(true) {
        const bet = prompt("Enter the bet per line: "); // this prompt function returns string by default
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > (balance/lines)){
            console.log("Invalid bet, try again.");
        }
        else{
            return numberBet;
        }
    }
}
const spin = () => {
    const symbols = []; // in this case, we cannot change the value inside the 'symbols' variable.
    // However, we can still manipulate the array without violating the principle of the const keyword.
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i=0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i=0;i < COLS;i++){
        reels.push([]);
        const reelSymbols = [...symbols]; // this gives another array to manipulate with the list of available symbols including possibility to remove them as well to avoid re-using.
        for (let j=0;j<ROWS;j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex,1); // remove the element at the particular index

        }
    }
    return reels;
};

const transpose = (reels) =>{
    const transpose_reels = [];
    for (let i=0; i < ROWS; i++){
        transpose_reels.push([])
        for (let j=0;j<COLS;j++){
            transpose_reels[i].push(reels[j][i]);
        }
    }
    return transpose_reels;
};

const printTransposedReels = (transposed_reels) => {
    for (const row of transposed_reels){
        let rowString = "";
        for (const [i,symbol] of row.entries()){
            rowString += symbol;
            if(i !== row.length -1){
                rowString += " | ";
            }
        }
    }
}

const getWinnings = (rows,bet,lines) => {
    let winnings = 0;
    for (let row=0; row < lines; row++){
        const symbols = rows[row]; // note here, the symbols is all the symbols in the particular row
        let allSame = true;
        for (const symbol of symbols){
            if (symbol !== symbols[0]){ // if any symbol in that row is not equal to the first symbol of the row, that itself means the row is now all same.
                allSame =false;
                break;
            }
        }
        if (allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game= () => {
    let balance = deposit();
    while (true) {
        console.log("You have a balance of $ "+ balance.toString())

        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const transposed_reels = transpose(reels);
        printTransposedReels(transposed_reels);
        const winnings = getWinnings(transposed_reels, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $ " + winnings.toString());
        if (balance <= 0){
            console.log("No balance");
            break;
        }
        let playAgain = prompt("Do you want to play again (y/n)? ");
        while(playAgain !== "y" && playAgain !== "n"){
            console.log("Invalid entry.");
            playAgain = prompt("Do you want to play again (y/n)? ");
        }
        if (playAgain !== "y")
            break;
    }
};

game();