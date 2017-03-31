console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));

  $($sausage).addClass('sausage');
  $($board).append($sausage);


  console.log($sausage.offset());
  // let $sausageTop = $sausage.position().top;


  $sausage.animate({ top: '535px' }, 1000);









});
