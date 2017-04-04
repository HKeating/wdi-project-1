console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  let $sausage;
  const $start = $('#start');
  const $reset = $('#reset');
  const $currentScore = $('.currentScore');
  const $highScore = $('.highScore');
  let obstacles;
  let scoreAndColl;
  let score = 0;

  function createSausage() {
    $sausage = $(document.createElement('div'));
    $($sausage).addClass('sausage');
    $($sausage).text('Sausage');
    $($sausage).css('left', ($($board).css('left')+10));
    $($sausage).css('top', 250);
    $($board).append($sausage);
  }

  // Start button. On click set up jump event listener and begin interval generating obstacles
  $($start).on('click', function() {
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
  });
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
      $sausage.animate({ top: '495px' }, 1000);
    }
  }
  //stops animations if jump is attempted when sausage less than 70px from top
  function atTop() {
    if($sausage.position().top < 90) {
      $sausage.clearQueue();
      $sausage.stop();
    }
  }
  //update scoreboard
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
    $obstacleTop.animate({left: ($($board).css('left')) }, 4000, 'linear');
    setTimeout(function() {
      $obstacleTop.remove();
    }, 4000);
    $obstacleBottom.animate({left: ($($board).css('left')) }, 4000, 'linear');
    setTimeout(function() {
      $obstacleBottom.remove();
    }, 4000);
  }
  //find top right bottom and left positions of the sausage
  function findS() {
    const $sTop = $($sausage).offset().top;
    const $sLeft = $($sausage).offset().left;
    const $sBot = $sTop + $($sausage).outerHeight(true);
    const $sRight = $sLeft + $($sausage).outerWidth(true);
    const $sPos = [$sTop, $sLeft, $sBot, $sRight];
    return $sPos;
  }
  function findOb1() {
    const $ob1 = $($board).find('.obstacleTop');
    //recording position of top obstacle
    const $ob1Top = $($ob1).offset().top;
    const $ob1Left = $($ob1).offset().left;
    const $ob1Bot = $ob1Top + $($ob1).outerHeight(true);
    const $ob1Right = $ob1Left + $($ob1).outerWidth(true);
    const $ob1Pos = [$ob1Top, $ob1Left, $ob1Bot, $ob1Right];
    return $ob1Pos;
  }
  function findOb2() {
    const $ob2 = $($board).find('.obstacleBottom');
    //recording position of bottom obstacle
    const $ob2Top = $($ob2).offset().top;
    const $ob2Left = $($ob2).offset().left;
    const $ob2Bot = $ob2Top + $($ob2).outerHeight(true);
    const $ob2Right = $ob2Left + $($ob2).outerWidth(true);
    const $ob2Pos = [$ob2Top, $ob2Left, $ob2Bot, $ob2Right];
    return $ob2Pos;
  }
  //collision check, need to find position of sausage and position of obstacles
  function collisionCheck() {
    //check for top of sausage and bottom of top obstacle
    if ((findS()[0] < findOb1()[2] && findOb1()[1] < findS()[3]) || (findS()[2] > findOb2()[0] && findOb2()[1] < findS()[3])) {
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
