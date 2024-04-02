export type calculatorButtons = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "00" | "0" | "." | "/" | "-" | "=";

export class Calculator {

  private screenText: string = "0";
  private hasOverflow: boolean = false;

  buttonClick(button: calculatorButtons) {
    if( this.screenText !== "0") {
      if(this.screenText.length <= 10) {
        if(button == "=") {
          this.screenText = this.getResult().toString();
        } else {
          this.screenText += button;
        }
      } else {
        this.hasOverflow = true;
      }
    } else {
      this.screenText = button
    }
  }

  getScreenText() {
    return this.screenText;
  }

  getResult() {
    return eval(this.screenText);
  }

}