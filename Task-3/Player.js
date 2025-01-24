export default class Player {
    constructor(name) {
      this.name = name;
      this.dice = null;
      this.value = null;
    }
  
    chooseDice(diceSet, selection) {
      this.dice = diceSet.splice(selection, 1)[0];
    }
  
    setValue(value) {
      this.value = value;
    }
  
    getValue() {
      return this.value;
    }
  
    getDice() {
      return this.dice;
    }
  }

