var game = game || {};

$(() =>{

  game.$board = $('.gameBoard');
  game.$highScore = $('.highScore');
  game.$sausage;
  game.$sAudio;
  game.scoreTracker;
  game.obstacles;
  game.scoreAndColl;
  game.scrolling;
  game.diffChange;
  game.currentBonuses = [];
  game.bonusCount = 0;
  game.currentPos = 0;
  game.score = 0;
  game.highScore = 0;
  game.difficulty = 4000;


  //init function which displays greeting, sets background scroll
  game.homePage = function homePage() {
    menu().html('<h1>Flappy Sausage</h1><p>Press any key to continue</p>');
    $(document).one('keydown', begin);
    bgScroll();
  };

  //init function
  game.homePage();


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
    game.obstacles = setInterval(() => {
      createObstacles();
    }, game.difficulty / 2);
    game.scoreAndColl = setInterval(() => {
      scoreUp();
      collisionCheck();
      bonusCheck();
    }, 100);
    atBottom();
    game.diffChange = setInterval(() => {
      game.difficulty = game.difficulty * 0.9;
      clearInterval(game.scrolling);
      bgScroll();
    }, 5000);
  }
  //clear queued animations and stop current animation. Animate jump of 50px, then check for top/bottom position
  function jump() {
    $('#sausagePic').attr('src', 'images/sausage-rise.png');
    game.$sausage.clearQueue();
    game.$sausage.stop();
    game.$sausage.animate({ top: '-=55px'}, 200, 'easeOutQuad');
    game.$sAudio[0].play();
    setTimeout(function() {
      $('#sausagePic').attr('src', 'images/sausage-fall.png');
    }, 200);
    atTop();
    atBottom();
  }
  //at all times sausage will animate towards bottom of screen
  function atBottom() {
    if (game.$sausage.position().top < 1000) {
      game.$sausage.animate({ top: 490}, (1000 - edges($(game.$sausage))[0]), 'easeInQuad');
    }
  }
  //stops animations if jump is attempted when sausage less than 70px from top
  function atTop() {
    if(game.$sausage.position().top < 60) {
      game.$sausage.clearQueue();
      game.$sausage.stop();
    }
  }
  //update scoreboard with current score
  function scoreUp() {
    const $currentScore = $('.currentScore');
    game.score = game.score +1;
    $($currentScore).text(pad(game.score));
  }
  //create sausage element, position it
  function createSausage() {
    game.$sausage = newDiv();
    game.$sAudio = newAudio();
    $(game.$sAudio).attr('src', 'audio/jumps/sausagejump2.wav');
    $(game.$sausage).addClass('sausage');
    $(game.$sausage).css('left', ($(game.$board).css('left')+10));
    $(game.$sausage).css('top', 250);
    $(game.$sausage).html('<img id="sausagePic" src="images/sausage-fall.png">');
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
      game.currentBonuses.push($newBonus);
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
    // $(game.$board).css('left')
    a.animate({left: '-200px' }, game.difficulty, 'linear');
    setTimeout(function() {
      a.remove();
    }, game.difficulty);
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
    const $ob1 = edges($(game.$board).find('.obstacleTop'));
    const $ob2 = edges($(game.$board).find('.obstacleBottom'));
    const $sPos = edges($(game.$sausage));
    const $dAudio = newAudio();
    $($dAudio).attr('src', 'audio/splat-gb.mp3');
    //check for top of sausage and bottom of top obstacle
    if (($sPos[0] < $ob1[2] && $ob1[1] < $sPos[3] && $sPos[1] < $ob1[3]) || ($sPos[2] > $ob2[0] && $ob2[1] < $sPos[3] && $sPos[1] < $ob2[3]) || ($sPos[2] >= $ob2[2])) {
      $dAudio[0].play();
      gameOver();
    }
  }
  //repeated collision check to find contact with bonus
  function bonusCheck() {
    const $bonus = edges($(game.$board).find('.bonus'));
    const $sPos = edges($(game.$sausage));
    if (($sPos[0] < $bonus[2] && $bonus[1] < $sPos[3] && $sPos[4] === $bonus[4]) || ($sPos[2] > $bonus[0] && $bonus[1] < $sPos[3] && $sPos[4] === $bonus[4])) {
      coinHit();
    }
  }
  function coinHit() {
    game.score = game.score + 25;
    const $bAudio = newAudio();
    $($bAudio).attr('src', 'audio/coin.wav');
    $bAudio[0].play();
    $(game.currentBonuses[game.bonusCount]).stop();
    game.currentBonuses[game.bonusCount].css('z-index', -1);
    game.currentBonuses[game.bonusCount].addClass('animated fadeOutUp');
    game.bonusCount += 1;
    const $bonusPoints = $('.bonusPoints');
    $bonusPoints.text('+25');
    $bonusPoints.addClass('animated fadeOutUp');
    setTimeout(function() {
      $bonusPoints.text('');
      $bonusPoints.removeClass('animated fadeOutUp');
    }, 500);
  }
  //function to stop intervals and alert user they lost
  function gameOver() {
    clearInterval(game.obstacles);
    clearInterval(game.scoreAndColl);
    clearInterval(game.diffChange);
    clearBoard();
    endPage();
    updateScore();
    game.difficulty = 4000;
    game.currentBonuses.length = 0;
    game.bonusCount = 0;
  }
  function startPage() {
    menu().html('<p><h2>Welcome to Flappy Sausage</h2><br>See how far you can get.<br>Press -s- to begin, use -space- to jump.<br>Avoid the obstacles!</p>');
  }
  //function to create div with text telling user they have lost, recording score, and telling them they can start again by pressing S, or reset scores by pressing R.
  function endPage() {
    menu().html(((game.score>game.highScore)?'New High Score!':'<p>Oh no, game over!')+'<br>You scored ' + (game.score - 1) + ' points and collected ' + game.bonusCount + ' bonus coin(s).<br>To play again, press -s-<br>To reset the high score press -r-.</p>');
  }
  function scoreBoard() {
    game.scoreTracker = newDiv();
    game.scoreTracker.addClass('scoreBoard');
    game.scoreTracker.html('<p>Current Score: <span class="currentScore">0000</span><span class="bonusPoints"></span></p><br><p>High Score: <span class="highScore">'+ pad(((game.highScore !== 0)?(game.highScore-1):0)) +'</span></p>');
  }
  //function to create and return a div within the game board that has class menu
  function menu() {
    const $popup = newDiv();
    $($popup).addClass('menu');
    return $($popup);
  }
  function newDiv() {
    const newDiv = $(document.createElement('div'));
    game.$board.append(newDiv);
    return newDiv;
  }
  function newAudio() {
    const newAudio = $(document.createElement('audio'));
    return newAudio;
  }
  //restart function to clear screen, record high game.score, and get ready to start game again
  function updateScore() {
    if (game.score > game.highScore) {
      game.highScore = game.score;
    }
    game.score = 0;
  }
  function pad(a) {
    let padded = '' + a;
    while (padded.length < 4) {
      padded = '0' + padded;
    }
    return padded;
  }
  //reset high game.score to 0
  function reset() {
    $(game.$highScore).text('0');
  }
  function clearBoard() {
    game.$board.empty();
  }
  function bgScroll() {
    const direction = 'a';
    const speed = (game.difficulty/25);
    function scroll() {
      game.currentPos -= 1;
      $(game.$board).css('backgroundPosition', (direction == 'a') ? game.currentPos+'px 0' : '0 ' + game.currentPos+'px');
    }
    game.scrolling = setInterval(scroll, speed);
  }
});

// $(game.homePage);
