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
  game.bonusBoost = 5;
  game.currentPos = 0;
  game.score = 0;
  game.highScore = 0;
  game.difficulty = 4000;
  //function to create and return a div within the game board that has class menu
  game.menu = function menu() {
    const $popup = game.newDiv();
    $($popup).addClass('menu animated flipInX');
    return $($popup);
  };
  game.newDiv = function newDiv() {
    const newDiv = $(document.createElement('div'));
    game.$board.append(newDiv);
    return newDiv;
  };
  game.newAudio = function newAudio() {
    const newAudio = $(document.createElement('audio'));
    return newAudio;
  };
  game.pad = function pad(a) {
    let padded = '' + a;
    while (padded.length < 4) {
      padded = '0' + padded;
    }
    return padded;
  };
  game.bgScroll = function bgScroll() {
    const direction = 'a';
    const speed = (game.difficulty/25);
    function scroll() {
      game.currentPos -= 1;
      $(game.$board).css('backgroundPosition', (direction == 'a') ? game.currentPos+'px 0' : '0 ' + game.currentPos+'px');
    }
    game.scrolling = setInterval(scroll, speed);
  };
  //removes everything from gameboard area
  game.clearBoard = function clearBoard() {
    game.$board.empty();
  };
  //reset high game.score to 0
  game.reset = function reset() {
    $(game.$highScore).text('0');
  };
  //restart function to clear screen, record high game.score, and get ready to start game again
  game.updateScore = function updateScore() {
    if (game.score > game.highScore) {
      game.highScore = game.score;
    }
    game.score = 0;
  };

  //Start function, creates jumping element, begins intervals generating obstacles, and updating score and checking for collision. Also initialises atBottom() and bgscroll.
  game.startGame = function startGame() {
    $('.menu').addClass('animated flipOutX');
    //timeout to allow menu screen to animate out
    setTimeout(function() {
      game.clearBoard();
      game.createSausage();
      //timeout to allow sausage to animate in
      setTimeout(function() {
        game.createObstacles();
        game.scoreBoard();
        game.obstacles = setInterval(() => {
          game.createObstacles();
        }, game.difficulty / 4);
        game.scoreAndColl = setInterval(() => {
          game.scoreUp();
          game.collisionCheck();
          game.bonusCheck();
        }, 100);
        game.atBottom();
        game.diffChange = setInterval(() => {
          game.difficulty = game.difficulty * 0.9;
          clearInterval(game.scrolling);
          game.bgScroll();
        }, 5000);
      }, 1000);
    }, 600);
  };

  game.scoreBoard = function scoreBoard() {
    game.scoreTracker = game.newDiv();
    game.scoreTracker.addClass('scoreBoard');
    game.scoreTracker.html('<p>Current Score: <span class="currentScore">0000</span><span class="bonusPoints"></span></p><br><p>High Score: <span class="highScore">'+ game.pad(((game.highScore !== 0)?(game.highScore-1):0)) +'</span></p>');
  };
  //create sausage element, position it
  game.createSausage = function createSausage() {
    game.$sausage = game.newDiv();
    game.$sAudio = game.newAudio();
    $(game.$sAudio).attr('src', 'audio/jumps/sausagejump2.wav');
    $(game.$sausage).addClass('sausage animated fadeInLeftBig');
    $(game.$sausage).css('left', ($(game.$board).css('left')+10));
    $(game.$sausage).css('top', 150);
    $(game.$sausage).html('<img id="sausagePic" src="images/sausage-fall.png">');
  };
  //create obstacles, one top one bottom, give them classes, append to gameboard.
  game.createObstacles = function createObstacles() {
    const $obstacleTop = game.newDiv();
    const $obstacleBottom = game.newDiv();
    $($obstacleTop).addClass('obstacleTop');
    $($obstacleBottom).addClass('obstacleBottom');
    //create random number to set obstacle position, set obstacle heights and top position to have gap of 150px to fly through at all times.
    const randomNum = Math.floor(Math.random()*200);
    $($obstacleTop).css('height', 275 - randomNum);
    $($obstacleBottom).css('height', 75 + randomNum);
    $($obstacleBottom).css('top', (520 - (75+randomNum)));
    //animate obstacle from right to left, then remove after time duration
    game.animateLeft($obstacleTop);
    game.animateLeft($obstacleBottom);
    if (randomNum % 2 == 0) {
      const $newBonus = game.createBonus();
      $($newBonus).css('top', (350 - randomNum));
      game.currentBonuses.push($newBonus);
      game.animateLeft($newBonus);
    }
  };
  game.createBonus = function createBonus() {
    const $bonus = game.newDiv();
    $($bonus).addClass('bonus');
    $($bonus).html('<img id="bonusCoin" src="images/coinspin-small.gif">');
    return $bonus;
  };
  //animate an element until its left position is equal to that of the board, then remove it
  game.animateLeft = function animateLeft(a) {
    // $(game.$board).css('left')
    a.animate({left: '-200px' }, game.difficulty, 'linear');
    setTimeout(function() {
      a.remove();
    }, game.difficulty);
  };
  //find top right bottom and left positions of an element
  game.edges = function edges(a) {
    const $top = $(a).offset().top;
    const $left = $(a).offset().left;
    const $bot = $top + $(a).outerHeight(true);
    const $right = $left + $(a).outerWidth(true);
    const $zInd = $(a).css('z-index');
    const $pos = [$top, $left, $bot, $right, $zInd];
    return $pos;
  };
  //collision check, runs game.edges() on sausage and both obstacles, then checks for overlap. runs gameOver() if there is
  game.collisionCheck = function collisionCheck() {
    const $ob1 = game.edges($(game.$board).find('.obstacleTop'));
    const $ob2 = game.edges($(game.$board).find('.obstacleBottom'));
    const $sPos = game.edges($(game.$sausage));
    const $dAudio = game.newAudio();
    $($dAudio).attr('src', 'audio/splat-gb.mp3');
    //check for top of sausage and bottom of top obstacle
    if (($sPos[0] < $ob1[2] && $ob1[1] < $sPos[3] && $sPos[1] < $ob1[3]) || ($sPos[2] > $ob2[0] && $ob2[1] < $sPos[3] && $sPos[1] < $ob2[3]) || ($sPos[2] >= $ob2[2])) {
      $dAudio[0].play();
      game.gameOver();
    }
  };
  //repeated collision check to find contact with bonus
  game.bonusCheck = function bonusCheck() {
    const $bonus = game.edges($(game.$board).find('.bonus'));
    const $sPos = game.edges($(game.$sausage));
    if (($sPos[0] < $bonus[2] && $bonus[1] < $sPos[3] && $sPos[1] < $bonus[3] && $sPos[4] === $bonus[4]) || ($sPos[2] > $bonus[0] && $bonus[1] < $sPos[3] && $sPos[1] < $bonus[3] && $sPos[4] === $bonus[4])) {
      game.coinHit();
    }
  };
  game.coinHit = function coinHit() {
    game.score = game.score + game.bonusBoost;
    const $bAudio = game.newAudio();
    $($bAudio).attr('src', 'audio/coin.wav');
    $bAudio[0].play();
    $(game.currentBonuses[game.bonusCount]).stop();
    game.currentBonuses[game.bonusCount].css('z-index', -1);
    game.currentBonuses[game.bonusCount].addClass('animated fadeOutUp');
    game.bonusCount += 1;
    const $bonusPoints = $('.bonusPoints');
    $bonusPoints.text('+'+game.bonusBoost);
    $bonusPoints.addClass('animated fadeOutUp');
    game.bonusBoost += 5;
    setTimeout(function() {
      $bonusPoints.text('');
      $bonusPoints.removeClass('animated fadeOutUp');
    }, 500);
  };
  //clear queued animations and stop current animation. Animate jump of 50px, then check for top/bottom position
  game.jump = function jump() {
    $('#sausagePic').attr('src', 'images/sausage-rise.png');
    game.$sausage.clearQueue();
    game.$sausage.stop();
    game.$sausage.animate({ top: '-=55px'}, 200, 'easeOutQuad');
    game.$sAudio[0].play();
    setTimeout(function() {
      $('#sausagePic').attr('src', 'images/sausage-fall.png');
    }, 200);
    game.atTop();
    game.atBottom();
  };
  //at all times sausage will animate towards bottom of screen
  game.atBottom = function atBottom() {
    if (game.$sausage.position().top < 1000) {
      game.$sausage.animate({ top: 490}, (1000 - game.edges($(game.$sausage))[0]), 'easeInQuad');
    }
  };
  //stops animations if jump is attempted when sausage less than 70px from top
  game.atTop = function atTop() {
    if(game.$sausage.position().top < 60) {
      game.$sausage.clearQueue();
      game.$sausage.stop();
    }
  };
  //update scoreboard with current score
  game.scoreUp = function scoreUp() {
    const $currentScore = $('.currentScore');
    game.score = game.score +1;
    $($currentScore).text(game.pad(game.score));
  };
  //function to stop intervals and alert user they lost
  game.gameOver = function gameOver() {
    clearInterval(game.obstacles);
    clearInterval(game.scoreAndColl);
    clearInterval(game.diffChange);
    game.clearBoard();
    game.endPage();
    game.updateScore();
    game.difficulty = 4000;
    game.currentBonuses.length = 0;
    game.bonusCount = 0;
    game.bonusBoost = 5;
  };
  //global keydown event listeners
  game.begin = function begin() {
    game.clearBoard();
    $(document).on('keydown', function(e) {
      switch(e.which) {
        case 83:
          game.startGame();
          break;
        case 82:
          game.reset();
          break;
        case 32:
          game.jump();
          break;
      }
    });
    game.startPage();
  };
  game.startPage = function startPage() {
    game.menu().html('<p><h2>Welcome to Flappy Sausage</h2><br>See how far you can get.<br>Press -s- to begin, use <br>-space- to jump.<br>Avoid the obstacles!</p>');
  };
  game.endPage = function endPage() {
    game.menu().html(((game.score>game.highScore)?'New High Score!':'<p>Oh no, game over!')+'<br>You scored ' + (game.score - 1) + ' points and collected ' + game.bonusCount + ' bonus coin(s).<br>To play again, press -s-<br>To reset the high score press -r-.</p>');
  };
  //init function which displays greeting, sets background scroll
  game.homePage = function homePage() {
    game.menu().html('<h1>Flappy Sausage</h1><p>Press any key to continue</p>');
    $(document).one('keydown tap', game.begin);
    // $(document).one('touchstart', game.begin);
    game.bgScroll();
  };
  //init function
  game.homePage();
});
