$(document).ready(function () {
    $('.btn-effect').hover(function () {
            $(this).removeClass('shadow-sm').addClass('shadow');
        }, function () {
            $(this).removeClass('shadow').addClass('shadow-sm');;
        }
    );
});