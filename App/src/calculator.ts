export type calculatorButtons = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "00" | "0" | "." | "/" | "-" | "=" | "C" | "CE";

export class Calculator {

  private screenText: string = "0";
  private hasOverflow: boolean = false;

  buttonClick(button: calculatorButtons) {
    if( this.screenText !== "0") {
      if(this.screenText.length <= 10) {
        if(button == "CE") {
          this.clearScreen();
        }
        else if(button == "C") {
          this.deleteLastChar();
        }
        if(button == "=") {
          this.screenText = this.getResult().toString();
        } else if(button != "C" && button != "CE") {
          this.screenText += button;
        }
      } else {
        this.hasOverflow = true;
      }
    } else {
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
    return eval(this.screenText);
  }

}