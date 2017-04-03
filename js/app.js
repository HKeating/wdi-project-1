console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));
  const $start = $('#start');
  // const $obstacle = $(document.createELement('div'));

  $($sausage).addClass('sausage');
  $($sausage).text('Sausage');
  $($sausage).css('left', ($($board).css('left')+10));
  $($sausage).css('top', (490));
  // $($obstacle).addClass('obstacle');
  $($board).append($sausage);
  // $($board).append($obstacle);

  // console.log($($board).css('height'));

  $(document).on('keydown', function() {
    $sausage.clearQueue();
    $sausage.stop();
    $sausage.animate({ top: '-=80px'}, 200);
    atTop();
    atBottom();
  });

  const atBottom = function() {
    if ($sausage.position().top < 490) {
      $sausage.animate({ top: '490px' }, 1000);
    }
  };

  const atTop = function() {
    if( $sausage.position().top < 70) {
      $sausage.clearQueue();
      $sausage.stop();
    }
  };

});
