export default class Dice {
    constructor(diceValues) {
      if (diceValues.length < 6 || !diceValues.every(Number.isInteger)) {
        throw new Error("Each dice must have six integer values.");
      }
      this.values = diceValues;
    }
  }