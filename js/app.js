console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));
  const $obstacle = $(document.createELement('div'));

  $($sausage).addClass('sausage');
  $($obstacle).addClass('obstacle');
  $($board).append($sausage);
  $($board).append($obstacle);

  $(document).on('keydown', function() {
    $sausage.clearQueue();
    $sausage.stop();
    $sausage.animate({ top: '-=80px'}, 200);
    atTop();
    atBottom();
  });

  const atBottom = function() {
    if ($sausage.position().top < 555) {
      $sausage.animate({ top: '555px' }, 1000);
    }
  };

  const atTop = function() {
    if( $sausage.position().top < 140) {
      $sausage.clearQueue();
      $sausage.stop();
    }
  };













});
