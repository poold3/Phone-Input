/*
Control input for a phone number:
    How to implement in HTML:
        <input type="tel" pattern="['('][0-9]{3}[')'][' '][0-9]{3}['\-'][0-9]{4}" oninput="CheckPhoneInput(event)" required>
        <script src="path/phone-input.js"></script>

    Regex accepted: ['('][0-9]{3}[')'][' '][0-9]{3}['\-'][0-9]{4} -> (123) 456-7890

    Tokens:
        Number: 0-9;
        Left-Paren: '(';
        Right-Paren: ')';
        Space: ' ';
        Dash: '-';

    Grammar:
        Input -> Front Middle Ending;
        Front -> Left-Paren Number{3} Right-Paren | Number{3};
        Middle -> Space Number{3} | Number{3};
        Ending -> Dash Number{4} | Number{4}

        **For rule options without Left-Paren, Right-Paren, Space, and Dash, the missing tokens will be manually added to the input value to match the regex.
        **This just means that the user can type in only numbers and the program will match the regex for the user
*/
const EOI = "End of Input";
const IPC = "Invalid Phone Character";
const IPS = "Invalid Phone Syntax";
const PHONELENGTH = 14; 


class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }

    getType() {
        return this.type;
    }

    getValue() {
        return this.value;
    }
}

//Scanner
function GetTokens(input) {
    let tokens = [];

    //iterate through each character in the input string
    //assign each character as a token and add it to the array
    while (input.length > 0) {
        if (input[0] === "(") {
            tokens.push(new Token("Left-Paren", "("));
        }
        else if (input[0] === ")") {
            tokens.push(new Token("Right-Paren", ")"));
        }
        else if (input[0] === "-") {
            tokens.push(new Token("Dash", "-"));
        }
        else if (input[0] === " ") {
            tokens.push(new Token("Space", " "));
        }
        else if (!Number.isNaN(Number(input[0]))) {
            tokens.push(new Token("Number", input[0]));
        }
        //If the character doesn't match any of the above tokens, it is an invalid character for a phone number. Throw an error!
        else {
            throw IPC;
        }

        //Remove first character from the input string after it has been added as a token
        input = input.slice(1);
    }
    return tokens;
}

//Parser
function GetNewValue(tokens) {
    let newValue = "";

    function throwError() {
        throw IPS;
    }
    
    //Matches the current token with the expected token. If a match, advance the token. If not, throw an error.
    function match(token) {
        //If there are no more tokens, throw
        if (tokens.length <= 0) {
            throw newValue;
        }

        else if (tokens[0].getType() === token) {
            //If the token is in the correct place, add the token value to the new input string value
            newValue += tokens[0].getValue();

            //Advance tokens
            tokens.shift();
            if (tokens.length <= 0 && newValue.length < PHONELENGTH) {
                throw newValue;
            }
        }

        else {
            throwError();
        }

    }
    
    //Grammar rule for the front of a phone number
    //Either begins with a Left-Paren or a number. Nothing else.
    function Front() {
        if (tokens[0].getType() === "Left-Paren") {
            match("Left-Paren");
            match("Number");
            match("Number");
            match("Number");
            if (tokens[0].getType() === "Right-Paren") {
                match("Right-Paren");
            }
            else {
                newValue += ")"; 
            }
            
        }
        //If there are no Parenthesis, add them to the new input value manually
        else if (tokens[0].getType() === "Number") {
            newValue += "("; 
            match("Number");
            match("Number");
            match("Number");
            newValue += ")"; 
        }
        else {
            throwError();
        }

    }

    //Grammar rule for the middle of a phone number
    function Middle() {
        if (tokens[0].getType() === "Space") {
            match("Space");
            match("Number");
            match("Number");
            match("Number");
        }
        else if (tokens[0].getType() === "Number") {
            newValue += " "; 
            match("Number");
            match("Number");
            match("Number");
        }
        else {
            throwError();
        }

    }

    //Grammar rule for the end of a phone number
    function Ending() {
        if (tokens[0].getType() === "Dash") {
            match("Dash");
            match("Number");
            match("Number");
            match("Number");
            match("Number");
        }
        else if (tokens[0].getType() === "Number") {
            newValue += "-"; 
            match("Number");
            match("Number");
            match("Number");
            match("Number");
        }
        else {
            throwError();
        }

    }

    Front();
    Middle();
    Ending();

    return newValue;
}


function CheckPhoneInput(event) {
    //get the phone input value
    let element = event.target;
    let value = element.value.toString();

    //Make sure input is max of 14 characters
    if (value.length > 14) {
        value = value.substring(0, 14);
    }
    
    //Do not run scanner/parser on empty input
    if (value.length > 0) {
        try {
            //Get Tokens from scanner
            let tokens = GetTokens(value);

            //Get the new input value to be inserted from the parser
            let newValue = GetNewValue(tokens);

            //Insert newValue into phone input value
            element.value = newValue;
            element.style.backgroundColor = "white";
        }
        catch(err) {
            //Only show errors that are not due to End of Input
            if (err === IPC || err === IPS) {
                console.log(err);
                element.style.backgroundColor = "#ff9999";
            }
            else {
                element.value = err;
                element.style.backgroundColor = "white";
            }
            return;
        }
    }
    else {
        element.style.backgroundColor = "white";
    }
}
