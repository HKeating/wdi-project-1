console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $highScore = $('.highScore');
  let $sausage;
  let $sAudio;
  let scoreTracker;
  let obstacles;
  let scoreAndColl;
  let scrolling;
  const currentBonuses = [];
  let highScore = 0;
  let bonusCount = 0;
  let currentPos = 0;
  let diffChange;
  let score = 0;
  let difficulty = 4000;
  //init function
  homePage();
  //global keydown event listeners
  function begin() {
    clearBoard();
    $(document).on('keydown', function(e) {
      switch(e.which) {
        case 83:
          startGame();
          break;
        case 82:
          reset();
          break;
        case 32:
          jump();
          break;
      }
    });
    startPage();
  }

  //Start function, creates jumping element, sets up jump event listener and begins intervals generating obstacles, and updating score and checking for collision. Also initialises atBottom().
  function startGame() {
    clearBoard();
    createSausage();
    createObstacles();
    scoreBoard();
    obstacles = setInterval(() => {
      createObstacles();
    }, difficulty / 2);
    scoreAndColl = setInterval(() => {
      scoreUp();
      collisionCheck();
      bonusCheck();
    }, 100);
    atBottom();
    diffChange = setInterval(() => {
      difficulty = difficulty * 0.9;
      clearInterval(scrolling);
      bgScroll();
    }, 5000);
  }
  //clear queued animations and stop current animation. Animate jump of 50px, then check for top/bottom position
  function jump() {
    $('#sausagePic').attr('src', 'images/sausage-rise.png');
    $sausage.clearQueue();
    $sausage.stop();
    $sausage.animate({ top: '-=55px'}, 200, 'easeOutQuad');
    $sAudio[0].play();
    setTimeout(function() {
      $('#sausagePic').attr('src', 'images/sausage-fall.png');
    }, 200);
    atTop();
    atBottom();
  }
  //at all times sausage will animate towards bottom of screen
  function atBottom() {
    if ($sausage.position().top < 1000) {
      $sausage.animate({ top: 490}, (1000 - edges($($sausage))[0]), 'easeInQuad');
    }
  }
  //stops animations if jump is attempted when sausage less than 70px from top
  function atTop() {
    if($sausage.position().top < 60) {
      $sausage.clearQueue();
      $sausage.stop();
    }
  }
  //update scoreboard with current score
  function scoreUp() {
    const $currentScore = $('.currentScore');
    score = score +1;
    $($currentScore).text(score);
  }
  //create sausage element, position it
  function createSausage() {
    $sausage = newDiv();
    $sAudio = newAudio();
    $($sAudio).attr('src', 'audio/jumps/sausagejump2.wav');
    $($sausage).addClass('sausage');
    $($sausage).css('left', ($($board).css('left')+10));
    $($sausage).css('top', 250);
    $($sausage).html('<img id="sausagePic" src="images/sausage-fall.png">');
  }
  //create obstacles, one top one bottom, give them classes, append to gameboard.
  function createObstacles() {
    const $obstacleTop = newDiv();
    const $obstacleBottom = newDiv();
    $($obstacleTop).addClass('obstacleTop');
    $($obstacleBottom).addClass('obstacleBottom');
    //create random number to set obstacle position, set obstacle heights and top position to have gap of 150px to fly through at all times.
    const randomNum = Math.floor(Math.random()*200);
    $($obstacleTop).css('height', 275 - randomNum);
    $($obstacleBottom).css('height', 75 + randomNum);
    $($obstacleBottom).css('top', (520 - (75+randomNum)));
    //animate obstacle from right to left, then remove after time duration
    animateLeft($obstacleTop);
    animateLeft($obstacleBottom);
    if (randomNum % 2 == 0) {
      const $newBonus = createBonus();
      $($newBonus).css('top', (350 - randomNum));
      currentBonuses.push($newBonus);
      animateLeft($newBonus);
    }
  }
  function createBonus() {
    const $bonus = newDiv();
    $($bonus).addClass('bonus');
    $($bonus).html('<img id="bonusCoin" src="images/coinspin-small.gif">');
    return $bonus;
  }
  //animate an element until its left position is equal to that of the board, then remove it
  function animateLeft(a) {
    a.animate({left: ($($board).css('left')) }, difficulty, 'linear');
    setTimeout(function() {
      a.remove();
    }, difficulty);
  }
  //find top right bottom and left positions of an element
  function edges(a) {
    const $top = $(a).offset().top;
    const $left = $(a).offset().left;
    const $bot = $top + $(a).outerHeight(true);
    const $right = $left + $(a).outerWidth(true);
    const $zInd = $(a).css('z-index');
    const $pos = [$top, $left, $bot, $right, $zInd];
    return $pos;
  }
  //collision check, runs edges() on sausage and both obstacles, then checks for overlap. runs gameOver() if there is
  function collisionCheck() {
    const $ob1 = edges($($board).find('.obstacleTop'));
    const $ob2 = edges($($board).find('.obstacleBottom'));
    const $sPos = edges($($sausage));
    const $dAudio = newAudio();
    $($dAudio).attr('src', 'audio/splat-gb.mp3');
    //check for top of sausage and bottom of top obstacle
    if (($sPos[0] < $ob1[2] && $ob1[1] < $sPos[3]) || ($sPos[2] > $ob2[0] && $ob2[1] < $sPos[3]) || ($sPos[2] >= $ob2[2])) {
      $dAudio[0].play();
      gameOver();
    }
  }
  //repeated collision check to find contact with bonus
  function bonusCheck() {
    const $bonus = edges($($board).find('.bonus'));
    const $sPos = edges($($sausage));
    const $bAudio = newAudio();
    $($bAudio).attr('src', 'audio/coin.wav');
    if (($sPos[0] < $bonus[2] && $bonus[1] < $sPos[3] && $sPos[4] === $bonus[4]) || ($sPos[2] > $bonus[0] && $bonus[1] < $sPos[3] && $sPos[4] === $bonus[4])) {
      score = score + 10;
      $bAudio[0].play();
      $(currentBonuses[bonusCount]).stop();
      currentBonuses[bonusCount].css('z-index', -1);
      currentBonuses[bonusCount].addClass('animated fadeOutUp');
      bonusCount += 1;
    }
  }
  //function to stop intervals and alert user they lost
  function gameOver() {
    clearInterval(obstacles);
    clearInterval(scoreAndColl);
    clearInterval(diffChange);
    clearBoard();
    endPage();
    updateScore();
    difficulty = 4000;
    currentBonuses.length = 0;
    bonusCount = 0;
  }
  function homePage() {
    menu().html('<h1>A FlappyBird Sim</h1><p>Press any key to continue</p>');
    $(document).one('keydown', begin);
    bgScroll();
  }
  function startPage() {
    menu().html('<p>Welcome to Flappy Sausage<br>See how far you can get.<br>Press -s- to begin, use -space- to jump.<br>Avoid the obstacles!</p>');
  }
  //function to create div with text telling user they have lost, recording score, and telling them they can start again by pressing S, or reset scores by pressing R.
  function endPage() {
    menu().html('<p>Oh no, game over!<br>You scored ' + (score - 1) + ' points and collected ' + bonusCount + ' bonus coin(s).<br>To play again, press -s-<br>To reset the high score press -r-.</p>');
  }
  function scoreBoard() {
    scoreTracker = newDiv();
    scoreTracker.addClass('scoreBoard');
    scoreTracker.html('<p>Current Score: <span class="currentScore">0</span></p><br><p>High Score: <span class="highScore">'+ ((highScore !== 0)?(highScore-1):0) +'</span></p>');
  }
  //function to create and return a div within the game board that has class menu
  function menu() {
    const $popup = newDiv();
    $($popup).addClass('menu');
    return $($popup);
  }
  function newDiv() {
    const newDiv = $(document.createElement('div'));
    $($board).append(newDiv);
    return newDiv;
  }
  function newAudio() {
    const newAudio = $(document.createElement('audio'));
    return newAudio;
  }
  //restart function to clear screen, record high score, and get ready to start game again
  function updateScore() {
    if (score > highScore) {
      highScore = score;
    }
    score = 0;
  }
  //reset high score to 0
  function reset() {
    $($highScore).text('0');
  }
  function clearBoard() {
    $board.empty();
  }
  function bgScroll() {
    const direction = 'a';
    const speed = (difficulty/25);
    function scroll() {
      currentPos -= 1;
      $($board).css('backgroundPosition', (direction == 'a') ? currentPos+'px 0' : '0 ' + currentPos+'px');
    }
    scrolling = setInterval(scroll, speed);
  }
});
