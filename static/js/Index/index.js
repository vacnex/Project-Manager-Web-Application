$(document).ready(function () {
  Notiflix.Notify.init({
    position: 'right-bottom',
    clickToClose: true,
    fontSize: 16,
    cssAnimationStyle: 'from-right',
  });
  $.ajaxSetup({
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
  });
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
    $(document).on('click', '#pills-thongbao-tab', function () {
        $(this).removeClass('active');
        $(this).addClass('btn-custom');
        $('#pills-tienich-tab').removeClass('btn-custom');
    });
    $(document).on('click', '#pills-tienich-tab', function () {
        $(this).removeClass('active');
        $(this).addClass('btn-custom');
        $('#pills-thongbao-tab').removeClass('btn-custom');
    });
    $(document).on('keyup', '#searchbox', function () {
        var value = $(this).val().toLowerCase();
        $('.list_results li').filter(function () {
            $(this).toggle(
                $(this).text().toLowerCase().indexOf(value) > -1
            );
        });
    });
  
  $(document).on('submit', '#LoginForm', function (e) {
    e.preventDefault();
    Notiflix.Block.standard('.login-wraper');
    $.ajax({
      type: "POST",
      url: ".",
      data: $('#LoginForm').serialize(),
      success: function (response, textStatus, jqXHR) {
        switch (true) {
          case ((response.Redirect).includes('index')):
            $("#LoginContainer").load(" #LoginContainer > *");
            history.pushState({}, "");
            Notiflix.Notify.success('Đăng nhập thành công!');
            break;
          case (response.Redirect).includes('home'):
            window.location.replace('/home');
            break;
          case (response.Redirect).includes('projectdetail'):
            $("#LoginContainer").load(" #LoginContainer > *");
            history.pushState({}, "");
            Notiflix.Notify.success('Đăng nhập thành công!');
            Notiflix.Confirm.show('CHUYỂN HƯỚNG','Chuyển về trang trước?','CÓ (5)','KHÔNG',function okCb() {
                window.location.replace(response.Redirect);
              },
              function cancelCb() {
                clearInterval(Timer);
              },
            );
            var Timer = CountDown(4, $('#NXConfirmButtonOk'), 'CÓ', function(){
              window.location.replace(response.Redirect);
            })
            break;
          case (response.Redirect).includes('assignment'):
            window.location.replace(response.Redirect);
            break;
          default:
            break;
        }
      },
      error: function (jqXHR, textStatus, errorText) {
        switch (['error'] in jqXHR.responseJSON) {
          case ['__all__'] in jqXHR.responseJSON.error:
            SetInValid(0, [jqXHR.responseJSON.error.__all__.toString()]);
            break;
          case ['password'] in jqXHR.responseJSON.error && ['username'] in jqXHR.responseJSON.error:
            SetInValid(1, [jqXHR.responseJSON.error.username.toString(), jqXHR.responseJSON.error.password.toString()]);
            break;
          case ['username'] in jqXHR.responseJSON.error:
            SetInValid(2, [jqXHR.responseJSON.error.username.toString()]);
            break;
          case ['password'] in jqXHR.responseJSON.error:
            SetInValid(3, [jqXHR.responseJSON.error.password.toString()]);
            break;
          default:
            break;
        }
      },
    });
  });

  $(document).on('click', '#username', function () {
    $(this).removeClass('is-invalid');
    $(this).attr('aria-describedby', '');
    $(this).removeClass('invalid-feedback').text('')
  });
  $(document).on('click', '#password', function () {
    $(this).removeClass('is-invalid');
    $(this).attr('aria-describedby', '');
    $(this).removeClass('invalid-feedback').text('')
  });
  function SetInValid() {
    state = arguments[0];
    message = arguments[1];
    switch (state) {
      case 0:
        Notiflix.Report.failure('ĐĂNG NHẬP THẤT BẠI', message[0], 'ĐÃ HIỂU', function cb(){
          Notiflix.Block.remove('.login-wraper');
        });
        break;
      case 1:
        Notiflix.Block.remove('.login-wraper');
        $('#username').addClass('is-invalid');
        $('#username').attr('aria-describedby', 'UsernameFeedback');
        $('#UsernameFeedback').addClass('invalid-feedback').text(message[0]);
        $('#password').addClass('is-invalid');
        $('#password').attr('aria-describedby', 'PasswordFeedback');
        $('#PasswordFeedback').addClass('invalid-feedback').text(message[1]);
        break;
      case 2:
        Notiflix.Block.remove('.login-wraper');
        $('#username').addClass('is-invalid');
        $('#username').attr('aria-describedby', 'UsernameFeedback');
        $('#UsernameFeedback').addClass('invalid-feedback').text(message[0]);
        break;
      case 3:
        Notiflix.Block.remove('.login-wraper');
        $('#password').addClass('is-invalid');
        $('#password').attr('aria-describedby', 'PasswordFeedback');
        $('#PasswordFeedback').addClass('invalid-feedback').text(message[1]);
        break;
      default:
        break;
    }
  }
  function CountDown(second, displayEl, customTextDisplayEL, stopTrigger) {
    var Timer = setInterval(function () {
      if (second <= 0) {
        clearInterval(Timer);
        if (typeof stopTrigger !== 'function') {
          console.log('Cần truyền function');
          return false;
        }
        stopTrigger();
      } else {
        displayEl.html(customTextDisplayEL + ' (' + second + ')');
      }
      second -= 1;
    }, 1000);
    return Timer;
  }
});