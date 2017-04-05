console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $currentScore = $('.currentScore');
  const $highScore = $('.highScore');
  let $sausage;
  let obstacles;
  let scoreAndColl;
  let scrolling;
  let currentPos = 0;
  let diffChange;
  let score = 0;
  let difficulty = 4000;


  //global keydown event listeners
  homePage();
  function begin() {
    clearBoard();
    $(document).on('keydown', function(e) {
      switch(e.which) {
        case 83:
          start();
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
  function start() {
    clearBoard();
    createSausage();
    createObstacles();
    bgScroll();
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
    setTimeout(function() {
      $('#sausagePic').attr('src', 'images/sausage-fall.png');
    }, 200);
    atTop();
    atBottom();
  }
  //at all times sausage will animate towards bottom of screen
  function atBottom() {
    if ($sausage.position().top < 1000) {
      $sausage.animate({ top: (485 - $($sausage).outerHeight(true))+'px'}, (1000 - edges($($sausage))[0]), 'easeInQuad');
    }
  }
  //stops animations if jump is attempted when sausage less than 70px from top
  function atTop() {
    if($sausage.position().top < 90) {
      $sausage.clearQueue();
      $sausage.stop();
    }
  }
  //update scoreboard with current score
  function scoreUp() {
    score = score +1;
    $($currentScore).text(score);
  }
  //create sausage element, position it
  function createSausage() {
    $sausage = newDiv();
    $($sausage).addClass('sausage');
    $($sausage).css('left', ($($board).css('left')+10));
    $($sausage).css('top', 250);
    $($sausage).html('<img id="sausagePic" src="images/sausage-fall.png">');
    $($board).append($sausage);
  }
  //create obstacles, one top one bottom, give them classes, append to gameboard.
  function createObstacles() {
    const $obstacleTop = newDiv();
    const $obstacleBottom = newDiv();
    $($obstacleTop).addClass('obstacleTop');
    $($board).append($obstacleTop);
    $($obstacleBottom).addClass('obstacleBottom');
    $($board).append($obstacleBottom);
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
      animateLeft($newBonus);
    }
  }
  function createBonus() {
    const $bonus = newDiv();
    $($bonus).addClass('bonus');
    $($board).append($bonus);
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
    const $pos = [$top, $left, $bot, $right];
    return $pos;
  }
  //collision check, runs edges() on sausage and both obstacles, then checks for overlap. runs gameOver() if there is
  function collisionCheck() {
    const $ob1 = edges($($board).find('.obstacleTop'));
    const $ob2 = edges($($board).find('.obstacleBottom'));
    const $sPos = edges($($sausage));
    //check for top of sausage and bottom of top obstacle
    if (($sPos[0] < $ob1[2] && $ob1[1] < $sPos[3]) || ($sPos[2] > $ob2[0] && $ob2[1] < $sPos[3]) || ($sPos[2] >= $ob2[2])) {
      gameOver();
    }
  }
  //repeated collision check to find contact with bonus
  function bonusCheck() {
    const $bonus = edges($($board).find('.bonus'));
    const $sPos = edges($($sausage));
    if (($sPos[0] < $bonus[2] && $bonus[1] < $sPos[3]) || ($sPos[2] > $bonus[0] && $bonus[1] < $sPos[3])) {
      score = score + 10;
      ($($board).find('.bonus'))[0].remove();
    }
  }
  //function to stop intervals and alert user they lost
  function gameOver() {
    clearInterval(obstacles);
    clearInterval(scoreAndColl);
    clearInterval(diffChange);
    clearInterval(scrolling);
    clearBoard();
    endPage();
    updateScore();
    difficulty = 4000;
  }
  function homePage() {
    menu().html('<h1>A FlappyBird Sim</h1>Press any key to continue');
    $(document).one('keydown', begin);
  }
  function startPage() {
    menu().html('Welcome to Flappy Sausage<br>See how far you can get.<br>Press -s- to begin, use -space- to jump.<br>Avoid the obstacles!');
  }
  //function to create div with text telling user they have lost, recording score, and telling them they can start again by pressing S, or reset scores by pressing R.
  function endPage() {
    menu().html('Oh no, game over!<br>You scored ' + (score - 1) + ' points.<br>To play again, press -s-<br>To reset the high score press -r-.');
  }
  //function to create and return a div within the game board that has class menu
  function menu() {
    const $popup = newDiv();
    $($popup).addClass('menu');
    $($board).append($popup);
    return $($popup);
  }
  function newDiv() {
    const newDiv = $(document.createElement('div'));
    return newDiv;
  }
  //restart function to clear screen, record high score, and get ready to start game again
  function updateScore() {
    if (score > $($highScore).text()) {
      $($highScore).text(score - 1);
      $($currentScore).text('0');
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
