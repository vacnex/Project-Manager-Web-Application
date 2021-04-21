$(document).ready(function () {
    var mobileTopBar = $(".s-top-container"),
        mobileTopBarToggle = $("#mobileTopBarBtn, #mobileTopBarCloseBtn");

    // mobileTopBarToggle.on("click", function(e) {
    //     e.preventDefault();
    //     mobileTopBar.toggleClass("show");
    //     mobileTopBarToggle.toggleClass("hidden");
    // });
    mobileTopBarToggle.on("click", function(e) {
        e.preventDefault();
        console.log('test')
        if ($(mobileTopBarToggle[0]).attr('id') == 'mobileTopBarBtn') {
            $('#'+$(mobileTopBarToggle[0]).attr('id')).prop('id', 'mobileTopBarCloseBtn');
            $('#'+$(mobileTopBarToggle[0]).attr('id')).prop('class', 'fas fa-times');
            mobileTopBar.toggleClass("show");
        }
        else if ($(mobileTopBarToggle[0]).attr('id') =='mobileTopBarCloseBtn') {
            $('#'+$(mobileTopBarToggle[0]).attr('id')).prop('id', 'mobileTopBarBtn');
            $('#'+$(mobileTopBarToggle[0]).attr('id')).prop('class', 'far fa-user-circle');
            mobileTopBar.removeClass("show");
        }
        
    });

    var sidebar = $("#nav-drawer"),
        sidebarToggle = $(".sidebar-btn2, .sidebar-btn--close");
        pageWrapper = $("#page-wrapper, #page-footer .c-container");
        topBarWrapper = $(".s-top");

    sidebarToggle.on("click", function(e) {
        e.preventDefault();
        sidebar.toggleClass("closed");
        pageWrapper.toggleClass("l-with-sidebar");
        topBarWrapper.toggleClass("s-top--sidebar");
    });
});