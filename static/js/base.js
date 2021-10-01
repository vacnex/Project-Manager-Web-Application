$(document).ready(function () {
    let mobileTopBarToggle = $('#mobileTopBarBtn, #mobileTopBarCloseBtn'),
        sidebar = $('#nav-drawer'),
        sidebarToggle = $('.sidebar-btn, .sidebar-btn-close'),
        pageWrapper = $('#page-container, #footer-wrapper');
    mobileTopBarToggle.on('click', function () {
        if ($(mobileTopBarToggle[0]).attr('id') == 'mobileTopBarBtn') {
            let currentid = $(mobileTopBarToggle[0]).attr('id');
            $('#' + currentid).prop('id', 'mobileTopBarCloseBtn');
            $('#mobileTopBarCloseBtn')
                .removeClass('far fa-user-circle')
                .addClass('fas fa-times');
        } else if ($(mobileTopBarToggle[0]).attr('id') == 'mobileTopBarCloseBtn') {
            let currentid = $(mobileTopBarToggle[0]).attr('id');
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
    

    if ($('#year-list li').length !== 0) {
        $('#year-list').prepend('<li tabindex="0" id="allyear" class="dropdown-custom-item rounded choosed mb-1" data-filtertarget="ALL"><a class="dropdown-link">Tất cả</a></li>');
    }

    $(document).on('click', '#allyear', function () {
        let target = $(this).attr('data-filtertarget');
        let year = $(this).text();
        $('.list-content').slick('slickUnfilter');
        if (target != 'ALL') {
            $('.list-content').slick('slickFilter', `#${target}`);
            $('.t-tittle h4').html(`Danh Sách Đề Tài Khoá ${year}`);
            $('#allyear').removeClass('choosed');
            $(this).toggleClass('choosed');
        } else {
            $('#allyear').removeClass('choosed');
            $(this).toggleClass('choosed');
            $('.t-tittle h4').html('Danh Sách Đề Tài');
        }
    });
    $('#ConfirmProjectForm #id_Project_Name, #ConfirmProjectForm #id_Type, #ConfirmProjectForm #id_schoolYear, #ConfirmProjectForm #id_description').attr('disabled', 'disabled');
});
