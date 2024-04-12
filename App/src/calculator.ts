import { turnLEDOnOff } from "./utils";

export type calculatorButtons = "7" | "8" | "9" | "4" | "5" | "6" | "1" | "2" | "3" | "00" | "0" | "." | "/" | "-" | "=" | "C" | "CE";

export class Calculator {

  private screenText: string = "0";
  private lastOperation: string = "";
  private textLimit: number = 11;

  buttonClick(button: calculatorButtons, scene: any) {
    if(!((this.screenText.charAt(this.screenText.length - 1) && 
    ['+', '-', 'x', '÷', "=", "."].includes(this.screenText.charAt(this.screenText.length - 1)))
    && ['+', '-', 'x', '÷', "=", "."].includes(button))
    ) {
      if(this.screenText == "Infinity" || this.screenText == "NaN" || this.screenText == "error") {
        this.clearScreen();
      }
      if( this.screenText !== "0") {
        if(button == "CE") {
          this.clearScreen();
        }
        else if(button == "C") {
          this.deleteLastChar();
        }
        if(button == "=") {
          this.screenText = this.getResult(scene).toString();
        }
        if(this.screenText.length <= this.textLimit) {
           if(button != "C" && button != "CE" && button != "=") {
            this.screenText += button;
          }
        } 
      } else if(button != "C" && button != "CE" && button != "="){
        this.screenText = button
      }
    } else if(button == "=") {
          this.screenText = this.getResult(scene).toString();
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

  setTextLimit(limit: number) {
    this.textLimit = limit;
  }

  getResult(scene: any) {
    let finalText = this.screenText.replace("x", "*").replace("÷", "/");
    let result;
    try {
      result = eval(finalText);
    }
    catch {
      result = "error";
      turnLEDOnOff("led3", true, scene);

      setTimeout(() => {
        turnLEDOnOff("led3", false, scene);
      }, 1000);
    }
    // result should only show 3 decimal places and only if it has decimal places
    if(result % 1 != 0) {
      result = result.toFixed(3);
    }
    this.lastOperation = this.screenText + "=" + result;
    return result;
  }

  getLastOperation() {
    return this.lastOperation;
  }

  getTextLimit() {
    return this.textLimit;
  }

}