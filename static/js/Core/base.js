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


});
