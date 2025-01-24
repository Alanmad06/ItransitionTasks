

import readline from "readline";
import calculateProbability from "./calculateProbability.js";
import tableProbabilities from "./tableProbabilities.js";
import HMACUtil from "./HMACUtil.js";
import Dice from "./Dice.js";
import Player from "./Player.js";
import Computer from "./Computer.js";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



class Game {
  constructor(args) {
    this.validateInput(args);
    this.diceSet = args.map((arg) => new Dice(arg));
    this.diceSetAux =[]
    this.user = new Player("User");
    this.computer = new Computer();
    this.tableProbabilities = new tableProbabilities();
    this.whoStarts = null;
  }

  validateInput(args) {
    if (args.length < 3) {
      this.exitWithError(
        "Provide at least 3 dice, each with six integer values."
      );
    }
    if (!args.every((arg) => arg.length === 6 && arg.every(Number.isInteger))) {
      this.exitWithError("Each dice must have six integer values.");
    }
  }

  exitWithError(message) {
    console.error(`ERROR: ${message}`);
    process.exit(1);
  }

  determineFirstMove() {
    const key = HMACUtil.generateKey();
    const randomChoice = Math.floor(Math.random() * 2).toString();
    const hmac = HMACUtil.generateHMAC(randomChoice, key);

    console.log("HMAC:", hmac);
    rl.question("Guess my choice (0 or 1): ", (input) => {
      if (HMACUtil.verifyHMAC(hmac, input, key)) {
        console.log("You guessed right! You start.");
        this.whoStarts = "User";
      } else {
        console.log("You guessed wrong! Computer starts.");
        this.whoStarts = "Computer";
      }
      console.log("KEY :", key);
      this.startGame();
    });
  }

  initializeProbabilities() {
    this.tableProbabilities.setHeaders([
      "User dice ",
      ...this.diceSet.map((dice, index) => dice.values),
    ]);
    this.tableProbabilities.setData(
      this.diceSet.map((dice, index) => {
        const userDice = dice.values;
        return [
          userDice,
          ...this.diceSet.map((dice) => {
            const computerDice = dice.values;
            const probability = calculateProbability.calculateProbability(
              userDice,
              computerDice
            );
            if (computerDice === userDice) {
              return ["-"];
            }
            return [probability];
          }),
        ];
      })
    );

    this.tableProbabilities.setColumnWidths();
    this.tableProbabilities.setHorizontalLine();
    this.tableProbabilities.buildTable();
  }

  startGame() {
    this.initializeProbabilities();

    if (this.whoStarts === "User") {
      this.userChooseDice(false);
    } else {
      this.computerChooseDice(false);
    }
  }

  userChooseDice(alreadyChosen) {
    console.log("Choose your dice:");
    this.diceSet.forEach((dice, index) =>
      console.log(`${index}: ${dice.values}`)
    );

    rl.question("Your selection: ", (input) => {
      const selection = parseInt(input);
      if (
        !isNaN(selection) &&
        selection >= 0 &&
        selection < this.diceSet.length
      ) {
        this.user.chooseDice(this.diceSet, selection);
        console.log(
          `You chose dice at index ${selection}: ${this.user.getDice().values}`
        );
        if(alreadyChosen){
          this.playRound();
        }else{
          this.computerChooseDice(true);
        }
      } else {
        console.log("Invalid selection. Try again.");
        this.userChooseDice(false);
      }
    });
  }

  computerChooseDice(alreadyChosen) {
    const computerSelection = this.computer.chooseRandomDice(this.diceSet);
    console.log(
      `Computer chose dice at index ${computerSelection}: ${this.computer.dice.values}`
    );
    (alreadyChosen) ? this.playRound() : this.userChooseDice(true)
 
  }

  playRound() {
    this.playTurn("Computer");
  }

  handleSpecialCommands(input,turn) {
    if (input === "?") {
      this.tableProbabilities.showTable();
      this.playTurn(turn);
    } else if (input.toLowerCase() === "x") {
      console.log("Exiting the game.");
      process.exit(0);
    } else {
      return false;
    }
    return true;
  }

  playTurn(currentPlayer) {
    const player = currentPlayer === "User" ? this.user : this.computer;
    const opponent = currentPlayer === "User" ? this.computer : this.user;

    console.log(`${currentPlayer}'s turn!`);
    const key = HMACUtil.generateKey();
    const randomIndex = Math.floor(Math.random() * 6).toString();
    const hmac = HMACUtil.generateHMAC(randomIndex, key);

    console.log("HMAC:", hmac);
    rl.question(
      `${currentPlayer}, make your move (0-5, ? for help, X to exit): `,
      (input) => {
        if (this.handleSpecialCommands(input,currentPlayer)) return;

        const userMove = parseInt(input);
        if (isNaN(userMove) || userMove < 0 || userMove > 5) {
          console.log("Invalid move. Try again.");
          this.playTurn(currentPlayer);
        } else {
          const result = (parseInt(randomIndex) + userMove) % 6;
          console.log(`${randomIndex} + ${userMove} % 6 = ${result}`);
          console.log("Result:", result);
          const throwValue = player.dice.values[result];
          currentPlayer === "User"
            ? this.user.setValue(throwValue)
            : this.computer.setValue(throwValue);
          console.log(`${currentPlayer} throws: ${throwValue}`);
          console.log("KEY :", key);

          if (currentPlayer === "Computer") {
            this.playTurn("User");
          } else {
            this.determineWinner();
          }
        }
      }
    );
  }

  determineWinner() {
    const player1Throw = this.computer.getValue();
    const player2Throw = this.user.getValue();
    if (player1Throw === player2Throw) {
      console.log("It's a draw!");
    } else if (player1Throw > player2Throw) {
      console.log("Computer wins! ", `${player1Throw} > ${player2Throw}`);
    } else {
      console.log("User wins!", `${player2Throw} > ${player1Throw}`);
    }
    process.exit(0);
  }
}

const args = process.argv.slice(2).map((arg) => arg.split(",").map(Number));
const game = new Game(args);
game.determineFirstMove();
