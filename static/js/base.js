$(document).ready(function () {
    $("#menu-toggle").click(function (e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
    $('.nav-link').hover(function () {
            $(this).addClass('active');
        }, function () {
            $('.nav-link').removeClass('active');
        }
    );
});