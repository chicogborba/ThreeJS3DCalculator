export type calculatorButtons = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "00" | "0" | "." | "/" | "-" | "=" | "C" | "CE";

export class Calculator {

  private screenText: string = "0";
  private hasOverflow: boolean = false;

  buttonClick(button: calculatorButtons) {
    if( this.screenText !== "0") {
        if(button == "CE") {
          this.clearScreen();
        }
        else if(button == "C") {
          this.deleteLastChar();
        }
      if(this.screenText.length <= 10) {
        if(button == "=") {
          this.screenText = this.getResult().toString();
        } else if(button != "C" && button != "CE") {
          this.screenText += button;
        }
      } else {
        this.hasOverflow = true;
      }
    } else if(button != "C" && button != "CE"){
      this.screenText = button
    }
  }

  clearScreen() {
    this.screenText = "0";
  }

  deleteLastChar() {
    this.screenText = this.screenText.slice(0, -1);
  }


  getScreenText() {
    return this.screenText;
  }

  setScreenText(text: string) {
    this.screenText = text;
  }

  getResult() {
    let finalText = this.screenText.replace("x", "*").replace("÷", "/");
    let result = eval(finalText);
    // result should only show 3 decimal places and only if it has decimal places
    if(result % 1 != 0) {
      return result.toFixed(3);
    }
    return result;
  }

}