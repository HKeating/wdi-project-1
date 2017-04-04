console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $start = $('#start');
  const $reset = $('#reset');
  const $currentScore = $('.currentScore');
  const $highScore = $('.highScore');
  let $sausage;
  let obstacles;
  let scoreAndColl;
  let score = 0;

  //create sausage element, position it
  function createSausage() {
    $sausage = $(document.createElement('div'));
    $($sausage).addClass('sausage');
    $($sausage).text('Sausage');
    $($sausage).css('left', ($($board).css('left')+10));
    $($sausage).css('top', 250);
    $($board).append($sausage);
  }
  // Start button. On click create jumping element, set up jump event listener and begin intervals generating obstacles, and updating score and checking for collision. Also initialise atBottom().
  $($start).on('click', start);

  function start() {
    createSausage();
    $(document).keydown(jump);
    createObstacles();
    obstacles = setInterval(() => {
      createObstacles();
    }, 2000);
    scoreAndColl = setInterval(() => {
      scoreUp();
      collisionCheck();
    }, 100);
    atBottom();
  }
  //clear queued animations and stop current animation. Animate jump of 50px, then check for top/bottom position
  function jump() {
    $sausage.clearQueue();
    $sausage.stop();
    $sausage.animate({ top: '-=50px'}, 200);
    atTop();
    atBottom();
  }
  //at all times sausage will animate towards bottom of screen
  function atBottom() {
    if ($sausage.position().top < 1000) {
      $sausage.animate({ top: '495px' }, (1200 - edges($($sausage))[0]));
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
  //create obstacles, one top one bottom, give them classes, append to gameboard.
  function createObstacles() {
    const $obstacleTop = $(document.createElement('div'));
    const $obstacleBottom = $(document.createElement('div'));
    $($obstacleTop).addClass('obstacleTop');
    $($board).append($obstacleTop);
    $($obstacleBottom).addClass('obstacleBottom');
    $($board).append($obstacleBottom);
    //create random number to set obstacle position, set obstacle heights and top position to have gap of 150px to fly through at all times.
    const randomNum = Math.floor(Math.random()*150);
    $($obstacleTop).css('height', 250 - randomNum);
    $($obstacleBottom).css('height', 100 + randomNum);
    $($obstacleBottom).css('top', (520 - (100+randomNum)));
    //animate obstacle from right to left, then remove after time duration
    animateLeft($obstacleTop);
    animateLeft($obstacleBottom);
  }
  //animate an element until its left position is equal to that of the board, then remove it
  function animateLeft(a) {
    a.animate({left: ($($board).css('left')) }, 4000, 'linear');
    setTimeout(function() {
      a.remove();
    }, 4000);
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
  console.log(edges($board));
  //collision check, runs edges() on sausage and both obstacles, then checks for overlap. runs gameOver() if there is
  function collisionCheck() {
    const $ob1 = edges($($board).find('.obstacleTop'));
    const $ob2 = edges($($board).find('.obstacleBottom'));
    const $sPos = edges($($sausage));
    //check for top of sausage and bottom of top obstacle
    if (($sPos[0] < $ob1[2] && $ob1[1] < $sPos[3]) || ($sPos[2] > $ob2[0] && $ob2[1] < $sPos[3]) || ($sPos[2] === $ob2[2])) {
      gameOver();
    }
  }
  //function to stop intervals and alert user they lost
  function gameOver() {
    clearInterval(obstacles);
    clearInterval(scoreAndColl);
    alert('you lose');
    updateScore();
    $board.empty();
  }
  //restart function to clear screen, record high score, and get ready to start game again
  function updateScore() {
    if (score > $($highScore).text()) {
      $($highScore).text(score - 1);
      $($currentScore).text('0');
    }
    score = 0;
  }
  // event listener for reset button
  $($reset).on('click', reset);
  function reset() {
    $($highScore).text('0');
  }

});
