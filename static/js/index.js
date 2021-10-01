$(document).ready(function () {
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
});