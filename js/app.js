console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));
  const $start = $('#start');
  const $currentScore = $('.currentScore');
  let score = 0;


  $($sausage).addClass('sausage');
  $($sausage).text('Sausage');
  $($sausage).css('left', ($($board).css('left')+10));
  $($sausage).css('top', 250);
  $($board).append($sausage);

// Start button. On click set up jump event listener and begin interval generating obstacles
  $($start).on('click', function() {
    $(document).keydown(jump);
    setInterval(() => {
      createObstacles();
    }, 2000);
    setInterval(() => {
      updateScore();
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
    if( $sausage.position().top < 70) {
      $sausage.clearQueue();
      $sausage.stop();
    }
  }
//update scoredboard
  function updateScore() {
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
    $obstacleTop.animate({left: ($($board).css('left')) }, 6000, 'linear');
    setTimeout(function() {
      $obstacleTop.remove();
    }, 6000);
    $obstacleBottom.animate({left: ($($board).css('left')) }, 6000, 'linear');
    setTimeout(function() {
      $obstacleBottom.remove();
    }, 6000);
  }



});
