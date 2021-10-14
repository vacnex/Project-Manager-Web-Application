$(document).ready(function () {
  /* #region  Teacker View */
  var breakpoint = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
    exxxl: 1600,
    xxxl: 1900,
    xxxxl: 2500,
  };

  $('#ListTeacherProject').slick({
    mobileFirst: true,
    slidesToShow: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: breakpoint.sm,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: breakpoint.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: breakpoint.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoint.xl,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoint.xxl,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoint.exxxl,
        settings: {
          slidesToShow: 4,
        },
      },

      {
        breakpoint: breakpoint.xxxl,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: breakpoint.xxxxl,
        settings: {
          slidesToShow: 6,
        },
      },
    ],
  });
  $(document).on('keyup', '#ProjectSearchBox', function () {
    var value = $(this).val().toLowerCase();
    $('#ListTeacherProject div').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  $(document).on('click', '#year-list > li', function () {
    var year = $(this).attr('data-filtertarget');
    $("#ListTeacherProject").slick('slickUnfilter');
    $('.year').each(function (index, element) {
      if (year == $(this).text()) {
        $("#ListTeacherProject").slick('slickFilter', function () {
          return $(this).find('.year').text() == year;
        })
      }
      if (year == 'all') {
        $("#ListTeacherProject").slick('slickUnfilter')
      }
    });
    $(this).toggleClass('choosed').siblings().removeClass('choosed');
  });
  /* #endregion */
  /* #region  Manager View */
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
  /* #endregion */
  /* #region  Student View */
  // var timer =  setInterval(function () {
  //   $.ajax({
  //     type: "GET",
  //     url: '/api/updatetask/',
  //     success: function (response) {
  //       if (response == "Teacher") {
  //         clearInterval(timer);
  //       } else if (response == "Reviewer") {
  //         clearInterval(timer);
  //       } else if (response == "Manager") {
  //         clearInterval(timer);
  //       } else {
  //         console.log(response);
  //         data = JSON.parse(response)[0];
  //         if (data) {
  //           a = $('.box-scroll li').last().attr('id');
  //           if (parseInt(a) != data['pk']) {
  //             $('.box-scroll').append('<li id=' + data['pk'] + ' class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4"> <a id="btn-tdel" class="btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a> <div class="row p-xxl-2 p-3" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"> <div class="col-sm-2 d-flex"> <div id="tprio" class="box box-label w-100 h-100 p-2"> ' + data['fields']['priority'] + ' </div> </div> <div class="col-sm-10 d-flex align-items-center"> <div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2"></div> <div class="task-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"> <h3 id="tname">' + data['fields']['taskName'] + '</h3> <p id="tdesc">' + data['fields']['taskDesc'] + '</p> <div class="row assignment-info"> <div class="col-md-6"> <div class="todoDate">' + data['fields']['deadline'] + '</div> </div> <div id="daysleft" class="col-md-6"> NaN </div> </div> </div> </div> </div> </li>');
  //           }
  //         }
  //       }

  //     },
  //     error: function (data) {
  //     }
  //   });
  // }, 5000);
  /* #endregion */
});