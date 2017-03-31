console.log('Hi there');


$(() =>{

  const $board = $('.gameBoard');
  const $sausage = $(document.createElement('div'));
  $($sausage).addClass('sausage');
  $($board).append($sausage);


  // setInterval(function() {
  //   $($sausage).style.top = '-1px';
  //     // If the top position is greater than 100px, set it to 100px
  //   if (parseInt($($sausage).style.top) < 400) { $($sausage).style.top = '100px'; }
  // }, 200);






});
