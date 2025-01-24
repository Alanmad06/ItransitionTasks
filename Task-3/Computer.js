import Player from "./Player.js";

export default class Computer extends Player {
  constructor() {
    super("Computer");
  }

  chooseRandomDice(diceSet) {
    const randomIndex = Math.floor(Math.random() * diceSet.length);
    this.chooseDice(diceSet, randomIndex);
    return randomIndex;
  }

  makeMove(diceValues) {
    const randomIndex = Math.floor(Math.random() * 6);
    return diceValues[randomIndex];
  }
}
