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