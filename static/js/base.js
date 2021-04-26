$(document).ready(function () {
    let mobileTopBarToggle = $('#mobileTopBarBtn, #mobileTopBarCloseBtn'),
        sidebar = $('#nav-drawer'),
        sidebarToggle = $('.sidebar-btn, .sidebar-btn-close'),
        pageWrapper = $('#page-container, #footer-wrapper');
    mobileTopBarToggle.on('click', function () {
        if ($(mobileTopBarToggle[0]).attr('id') == 'mobileTopBarBtn') {
            let currentid = $(mobileTopBarToggle[0]).attr('id');
            // console.log(currentid)
            $('#' + currentid).prop('id', 'mobileTopBarCloseBtn');
            $('#mobileTopBarCloseBtn')
                .removeClass('far fa-user-circle')
                .addClass('fas fa-times');
        } else if ($(mobileTopBarToggle[0]).attr('id') == 'mobileTopBarCloseBtn') {
            let currentid = $(mobileTopBarToggle[0]).attr('id');
            // console.log(currentid)
            $('#' + currentid).prop('id', 'mobileTopBarBtn');
            $('#mobileTopBarBtn')
                .removeClass('fas fa-times')
                .addClass('far fa-user-circle');
        }
    });
    sidebarToggle.on('click', function (e) {
        e.preventDefault();
        sidebar.toggleClass('closed show-rwd');
        pageWrapper.toggleClass('l-with-sidebar');
    });
    var breakpoint = {
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    };
      
    $('.course-list-content').slick({
      mobileFirst: true,
      slidesToShow: 1,
      
      arrows: true,
      nextArrow: '#btn-next',
      prevArrow: '#btn-prev',
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
            slidesToShow: 3,
            
          },
        },
        {
          breakpoint: breakpoint.lg,
          settings: {
            slidesToShow: 4,
            
          },
        },
        {
          breakpoint: breakpoint.xl,
          settings: {
            slidesToShow: 5,
            
          },
        },
      ],
    });
});
