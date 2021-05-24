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
        xxl: 1400,
        exxxl: 1600,
        xxxl: 1900,
        xxxxl: 2500,
    };

    $('.list-content').slick({
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
    $('.project-list-content').slick({
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

    if ($('.yearlist li').length !== 0) {
        content =
            '<li tabindex="0" class="rounded year choosed" data-filtertarget="ALL"><a class="link-dark w-85">Tất cả</a></li>';
        $('.yearlist').prepend(content);
    }

    $('.year').on('click', function () {
        let target = $(this).attr('data-filtertarget');
        let year = $(this).text();
        $('.list-content').slick('slickUnfilter');
        if (target != 'ALL') {
            $('.list-content').slick('slickFilter', `#${target}`);
            $('.t-tittle h4').html(`Danh Sách Đề Tài Khoá ${year}`);
            $('.year').removeClass('choosed');
            $(this).toggleClass('choosed');
        } else {
            $('.year').removeClass('choosed');
            $(this).toggleClass('choosed');
            $('.t-tittle h4').html('Danh Sách Đề Tài');
        }
    });
    $('#ConfirmProjectForm #id_Project_Name, #ConfirmProjectForm #id_Type, #ConfirmProjectForm #id_schoolYear, #ConfirmProjectForm #id_description').attr('disabled', 'disabled');
});
