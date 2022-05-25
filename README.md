# Phone-Input
Custom input control for a phone number in HTML forms.
Uses a scanner to acquire tokens on input.
Runs a parser to validate token order.
Turns background red on incorrect token or syntax.

How to implement in HTML:
  `< input type="tel" pattern="['('][0-9]{3}[')'][' '][0-9]{3}['\-'][0-9]{4}" oninput="CheckPhoneInput(event)" required>
  <script src="path/phone-input.js"></script>`

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

