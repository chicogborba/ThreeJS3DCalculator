export type calculatorButtons = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "00" | "0" | "." | "/" | "-" | "+=";

export class Calculator {

  private screenText: string = "";

  buttonClick(button: calculatorButtons) {
    this.screenText += button;
    console.log(this.screenText);
  }

  getScreenText() {
    return this.screenText;
  }

}