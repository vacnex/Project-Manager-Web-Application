$(() => {
  let itemNum = $('.tab-switch').children().length;
  $('.tab-switch').get(0).style.setProperty('--dynamic', '' + $('.tab-item').width() + 'px');
  $('.tab-switch').get(0).style.setProperty('--dynamictw', '' + 100/itemNum + '%');
  let c = 1;
  for (let i = 1; i < itemNum; i++) {
    let prev = $('html').attr('style') ? $('html').attr('style') : '';
    let val = 100 / itemNum;
    if (c >= 1) val = val * c;
    $('html').attr('style', prev + ' --dynamicsw' + i + ':' + val + '%;');
    c++;
  }
  $('.tab-switch').find('.tab-item').on('click', e => {
    let $this = $(e.currentTarget);
    let direction = $this.attr('tab-direction');
    $this.addClass('active').siblings().removeClass('active');
    $('.tab-switch').removeClass((index, className) => {
      return (className.match(/\bsel-tab-\S+/g) || []).join(' ');
    }).addClass(direction);
  });
});