console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));
  const $start = $('#start');
  const $obstacle = $(document.createElement('div'));

  $($sausage).addClass('sausage');
  $($sausage).text('Sausage');
  $($sausage).css('left', ($($board).css('left')+10));
  $($sausage).css('top', (490));
  $($board).append($sausage);
  $($obstacle).addClass('obstacle');
  $($board).append($obstacle);

  // console.log($($board).css('height'));
  // $($start).on('click', function() {
  $(document).on('keydown', function() {
    $sausage.clearQueue();
    $sausage.stop();
    $sausage.animate({ top: '-=80px'}, 200);
    atTop();
    atBottom();
  });
  // });


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
