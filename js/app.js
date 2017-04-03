console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));

  $($sausage).addClass('sausage');
  $($board).append($sausage);


  console.log($sausage.offset());
  // let $sausageTop = $sausage.position().top;

  $(document).on('keydown', function() {
    $sausage.clearQueue();
    $sausage.stop();
    $sausage.animate({ top: '-=100px'}, 200);
    atBottom();
  });

  const atBottom = function() {
    if ($sausage.position().top < 535) {
      $sausage.animate({ top: '535px' }, 1000);
    }
  };











});
