$(document).ready(function () {
    $('.btn-effect').hover(function () {
            $('.btn-effect').removeClass('shadow-sm').addClass('shadow');
        }, function () {
            $('.btn-effect').removeClass('shadow').addClass('shadow-sm');;
        }
    );
});