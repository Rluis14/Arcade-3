// variable set for the game
const arcade = {
    playerName: null,
    gameSessionActive: false,
    magicBallActive: false,
    bnhActive: false,
    gessingGameActive: false,
    wins: 0,
    gamesPlayed: 0
}

// error texts
const errors = {
  emptyInput: 'Error: No input detected, Please write a question.',
  nullInput: 'Error: Function was canceld',
  invalidYesNo: 'Error: Only "Yes" or "No" allowed.',
  invalidName: 'Error: Name is invalid. Please try entering more than one chracter.',
  invalidEntry: 'Error: Invalid Entry. Please try again.',
  invalidNumber: 'Error: Invalid number. Please try again',
}

// promts
const prompts = {
  game: {
    enterName: 'Hi welcome, what is your name?',
    endSession: 'Would you like to choose another game to play? YES or NO',
    endGame: 'Would you like to continue playing the game? YES or NO'
  },
  gg: {
    guessNumber: 'Guess a number between 1 and 10.',
    tooLow: 'Guess was too low, Please try again, Good luck!.',
    tooHigh: 'Guess was too high, Please try again, Good luck!.'
  },
  magicBall: { 
    questionText: 'Ask any question related to yes or no to the Magic Eight Ball.'
  },
  bnh: { 
    choose: 'Who do you choose: Bear, Ninja or hunter?',
  }
}
// store input globally and erros for all games
let userInput = undefined;
let inputError = false;

// Reload
const reloadPage = () => {
  window.location.reload();
}

// this function will start a loop unless yes or no is inputed
const continuePrompt = (message) => { 
  userInput = `${userInput}`; // Checking if its a string

  // loop until input is yes or no
  while(userInput?.toLowerCase() !== 'yes' && userInput?.toLowerCase() !== 'no') {
    // error message
    const errorMessage = inputError ? errors.invalidYesNo : '';
    userInput = prompt(`${message}\n${errorMessage}`);
    inputError = userInput?.toLowerCase() !== 'yes' && userInput?.toLowerCase() !== 'no';
  }
}

// runs every time a game is started
const startSession = (game) => { 

  // Loop runs if there is no input for the name
  while(!arcade.playerName || arcade.playerName?.trim() === '') {
    // error message
    const errorMessage = inputError ? errors.invalidName : ''
    userInput = prompt(`${prompts.game.enterName}\n${errorMessage}`);
    inputError = !userInput || userInput?.trim() === '';
    arcade.playerName = !inputError ? userInput : null;
  }

  // initialize the boolean
  // this will allow the game loop to run
  arcade[game] = true;
}
// Madel is based on percentage
const getMedal = (winPercentage) => {
  switch (true) {
    case (winPercentage >= 76): return 'Silicon';
    case (winPercentage >= 51): return 'Iron';
    case (winPercentage >= 26): return 'Bronze';
    case (winPercentage <= 25): return 'Stone';
  }
}

const getTableResults = (winPercentage) => {
  const {gamesPlayed, wins} = arcade;
  let results = '<tr>';
      results += `<td>${gamesPlayed}</td>`;
      results += `<td>${wins}</td>`;
      results += `<td>${winPercentage.toFixed(2)}%</td>`;
      results += '</tr>';

  return results;
}

const endSession = (game) => { // runs to stop a game
  arcade[game] = false; 
  userInput = undefined;

  // ask to continue the global session
  continuePrompt(`${arcade.playerName}, ${prompts.game.endSession}`);

  inputError = false; // reset input error

  // disable/enable global sessione
  arcade.gameSessionActive = userInput === 'yes';

  // hide game buttons and show reload button
  if(!arcade.gameSessionActive) {
    // get table with results and add the html
    const winPercentage = (arcade.wins / arcade.gamesPlayed) * 100;
    document.getElementById('info-table').innerHTML = getTableResults(winPercentage);
    // get medal based on win percentage
    const medal = getMedal(winPercentage);
    // change img src attribute to load medal image
    document.getElementById('medal-image').setAttribute('src', `images/medal_${medal}.jpg`);
    document.getElementById('medal-text').innerHTML = `You win the ${medal} medal.`;
    document.getElementById('game-selection').style.display = 'none';
    document.getElementById('game-reload').style.display = 'block';
    
  }
}




const playMagicBall = function() {
  startSession('magicBallActive'); // starts this game session

  let giveAnswer = false;

  const answers = [

    'Absolutely!',
    'No doubt about it.',
    'It\'s a resounding yes.',
    'The stars say yes.',
    'All signs point to yes.',
    'You can bank on it.',
    'Definitely in your favor.',
    'The odds are excellent.',
    'It\'s looking bright.',
    'Count on it!',
  ]

  while(arcade.magicBallActive) { 
    if(userInput === null) {
      alert(errors.nullInput); 
      userInput = undefined; 
      giveAnswer = false; 

    // input is empty
    } else if(userInput?.trim() === '') {
      alert(errors.emptyInput); // show error
      userInput = undefined; // reset user input
      giveAnswer = false; // reset answer
    
    // is answer mode, and the question is valid 
    } else if(giveAnswer) {
      const index = Math.floor(Math.random() * 20);
      alert(answers[index]); // show answer
      giveAnswer = false; // reset mode
      userInput = undefined;

      //Counter of games played
      arcade.gamesPlayed ++;
      // Counter of games won
      // Every answer is counted
      arcade.wins ++;

      continuePrompt(`${arcade.playerName}, ${prompts.game.endGame}`);
      if(userInput?.toLowerCase() === 'no') {
        endSession('magicBallActive');
      }

    // input is valid, assume is a question
    } else {
      // prompt and save user input
      userInput = prompt(`${prompts.magicBall.questionText}`);
      // set answer to true
      giveAnswer = true;
    }
    
  }
}

const playBNH = () => {
  startSession('bnhActive'); // starts this game 

  userInput = undefined;
  const choicesArr = ['bear', 'ninja', 'hunter']; // choices array
  const outcomes = []; 

  alert(`Hi ${arcade.playerName}, Let\'s play!!`);

  while (arcade.bnhActive) {
    // the user canceled the prompt  
    if(userInput === null) {
      alert(errors.nullInput); // show error alert
      userInput = undefined;

    // input is empty
    } else if(userInput?.trim() === '') {
      alert(errors.invalidEntry); 
      userInput = undefined;

    // input is yes
    } else if(userInput?.toLowerCase() === 'yes') {
      userInput = undefined; // input var to default

    // input is no
    } else if(userInput?.toLowerCase() === 'no') {
      // get win and lose counts
      const wins = outcomes.filter(session => session.outcome === 'User').length;
      const loses = outcomes.filter(session => session.outcome === 'Computer').length;

      let endOutcome;

      // outcome is tie
      if(wins === loses) {
        endOutcome = 'It\'s a tiee!';
      
      // outcome has a winner
      } else {
        endOutcome = wins > loses ? 'You winn!!' : 'You lose :(';
      }

      let endGameText = '';

      if(outcomes.length) {
        // set outcome texts
        endGameText = `The game is over ${arcade.playerName}.`;
        endGameText += `\nYou won ${wins} times and lose ${loses} times.`;
        endGameText += `\n${endOutcome}`;
        alert(endGameText);
      } 
      
      endSession('bnhActive'); // stop game

    // the default state, show prompts
    } else if(userInput === undefined) {
      userInput = prompt(prompts.bnh.choose);
    
    // the input is not present in the choices
    } else if(!choicesArr.includes(userInput.toLocaleLowerCase())) {
      alert(errors.invalidEntry); 
      userInput = undefined;
    
    // assume is a valid choice
    } else {
      
      // loop to show counter
      for(let count = 3;count >= 0;count--) {
        alert(count); // show counter
      }

      // save player choice with forced case
      const playerChoice = userInput.toLocaleLowerCase();
      const index = Math.floor(Math.random() * 3);
      const computerChoice = choicesArr[index];
      let outcome = 'Tie';

      // If not a tie, determine the winner
      if(playerChoice !== computerChoice) {
        switch (playerChoice) {
          case 'bear':
            outcome = computerChoice === choicesArr[1] ? 'User' : 'Computer';
            break;
          case 'ninja':
            outcome = computerChoice === choicesArr[2] ? 'User' : 'Computer';
            break;
          case 'hunter':
            outcome = computerChoice === choicesArr[0] ? 'User' : 'Computer';
            break;
          default:
            outcome = 'Error';
        }
      }

      // Store both outcome
      const playerChoiceText = arcade.playerName + ', you chose: ' + playerChoice + '!';
      const computerChoiceText = 'The computer chose: ' + computerChoice + '!';
      
      let finalOutcomeText = '';

      if(outcome === 'Tie') {
        finalOutcomeText = 'It\'s a tie!';
      } else if(outcome === 'Error') {
        finalOutcomeText = 'Invalid choice, please try again!';
      } else {
        finalOutcomeText = outcome === 'User' ? 'You winn!!' : 'You lose :(';
        // Increment the counter of games won
        arcade.wins = outcome === 'User' ? arcade.wins + 1 : arcade.wins;
      }

      // save the outcome
      outcomes.push({
        player: playerChoice,
        computer: computerChoice,
        outcome
      });

      // round outcome
      alert(`${playerChoiceText}\n${computerChoiceText}\n${finalOutcomeText}`);

      // counter of games played
      arcade.gamesPlayed ++;

      // prompt to play again yes or no 
      continuePrompt(`${arcade.playerName}, ${prompts.game.endGame}`);
    }
  }
}




function playGuessingGame() {
  startSession('gessingGameActive'); // starts this game session

  while(arcade.gessingGameActive) {
    // calculate random number
    let randomNumber = Math.floor(Math.random() * 10) +1;
    // keep track of attempts
    let guessAttempts = 1;
    userInput = null;

    console.log(randomNumber);

    // loop until guessed number
    while (parseInt(userInput) !== randomNumber) {
      // this will run the first time, or in case of invalid inputs
      if (!userInput || isNaN(parseInt(userInput))) {
        const errorMessage = inputError ? errors.invalidNumber : ''
        userInput = prompt(`${prompts.gg.guessNumber}\n${errorMessage}`);
        inputError = isNaN(parseInt(userInput));

      // this will run with valid inputs
      } else {
        userInput = parseInt(prompt(randomNumber > parseInt(userInput) ? prompts.gg.tooLow : prompts.gg.tooHigh));
        inputError = isNaN(parseInt(userInput));
        // increment attempt number each cycle
        guessAttempts++;
      }
    }

    //counter of games played
    arcade.gamesPlayed ++;
    //counter of games won
    arcade.wins ++;

    // after breaking out of the loop, show the winning message!
    alert(`You guessed it in ${guessAttempts} guesses! Awsome Job!`);
    
    continuePrompt(`${arcade.playerName}, ${prompts.game.endGame}`);

    if(userInput?.toLowerCase() === 'no') {
      endSession('gessingGameActive');
    }

    
  }
}