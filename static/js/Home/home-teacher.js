$(document).ready(function () {
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
    let year = $(this).attr('data-filtertarget');
    $("#ListTeacherProject").slick('slickUnfilter');
    if (year != 'ALL') {
      $.each($('.slick-track').children(), function (indexInArray, valueOfElement) {
        if (year == $(this).find('.year').text()) {
          $("#ListTeacherProject").slick('slickFilter', function () {
            return $(this).find('.year').text() == year;
          });
          return false;
        }
      });
      $(this).toggleClass('choosed').siblings().removeClass('choosed');
    } else {
      if (!$(this).hasClass('choosed')) {
        $(this).addClass('choosed').siblings().removeClass('choosed');
      }
    }
  });
});