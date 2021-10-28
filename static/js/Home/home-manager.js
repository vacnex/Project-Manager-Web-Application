$(document).ready(function () {
  $(document).on('click', '#pills-gv-tab', function () {
    $(this).removeClass('active');
    $(this).addClass('btn-custom');
    $('#pills-sv-tab').removeClass('btn-custom');
  });
  $(document).on('click', '#pills-sv-tab', function () {
    $(this).removeClass('active');
    $(this).addClass('btn-custom');
    $('#pills-gv-tab').removeClass('btn-custom');
  });
});