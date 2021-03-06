$(document).ready(function () {
    $('input[name="dates"]').daterangepicker({
        locale: {
            format: 'DD/MM/YYYY',
            separator: ' - ',
            applyLabel: 'Xác nhận',
            cancelLabel: 'Huỷ',
            fromLabel: 'Từ',
            toLabel: 'Đến',
            customRangeLabel: 'Tuỳ chọn',
            daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            monthNames: [ 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            firstDay: 1,
        },
    });

    $('#taskname').change(function (e) {
        $('#taskname').removeClass('is-invalid');
    });

    // tskl = $('.todoScroll').children().not('.emptylist');
    // for (let i = 0; i < tskl.length; i++) {
    //     str = $(tskl[i]).find('.todoDate').text();
    //     endday = str.split(':')[2];
    //     result = dayleft(endday)
    //     if (result >= 15) {
    //         $(tskl[i])
    //         .find('.todoDeadline')
    //         .html('Còn lại: <span class="badge bg-success">'+result+' ngày</span>');
    //     }
    //     else if (result < 15 && result > 3) {
    //         $(tskl[i])
    //         .find('.todoDeadline')
    //         .html('Còn lại: <span class="badge bg-warning text-dark">'+result+' ngày</span>');
    //     } else {
    //         $(tskl[i])
    //         .find('.todoDeadline')
    //         .html('Còn lại: <span class="badge bg-danger">'+result+' ngày</span>');
    //     }
    // }
    // id = 0
    // for (let i = 0; i < tskl.length; i++) {
    //     if (!$('#pjid').val()) {
    //         $('#pjid').val($(tskl[i]).attr('class').split(' ')[1]);
    //     }
    //     else {
    //         id = $('#pjid').val();
    //     }
    // }
    $(document).on(
        {
            mouseenter: function () {
                $('.btn-circle', this).removeClass('d-none');
            },
            mouseleave: function () {
                $('.btn-circle', this).addClass('d-none');
            },
        },
        '.list-wraper .item'
    );
    if ($('.todoScroll').children('.emptylist').length == 0) {
        $('.todoScroll').append(
            '<div class="px-4 py-5 my-5 text-center emptylist hide"> <h1 class="display-5 fw-bold">Danh sách công việc trống</h1> <div class="col-lg-6 mx-auto"> <p class="lead mb-4">Hãy nhấn thêm công việc để tạo danh sách công việc.</p> <div class="d-sm-flex justify-content-sm-center"> <div class="submitButtonBlue" data-bs-toggle="modal" data-bs-target="#AddTask"> <span>+</span> <p class="addSubmitBlue">Thêm công việc</p> </div> </div> </div> </div>'
        );
    }

    $('#taskname').change(function (e) {
        $('#taskname').removeClass('is-invalid');
    });

    $(document).on('show.bs.modal', '#AddTask', function () {
        if (!$(this).hasClass('regprojectmodal')) {
            $('#taskname').val('');
            $('#decs').val('');
            $('input[name=prio][value=Vừa]').prop('checked', true);
            $('#deadline').data('daterangepicker').setStartDate(new Date());
            $('#deadline').data('daterangepicker').setEndDate(new Date());
        }
    });

    function save() {
        lt = $('.todoScroll').children().not('.emptylist');
        html = [];
        for (let i = 0; i < lt.length; i++) {
            html.push($(lt[i]).prop('outerHTML'));
        }
        $('#taskcontent').val(html.join(''));
        $('form[name=task-update-form]').submit();
    }

    // function dayleft(endDate) {
    //     endDate2 = endDate.split('/');
    //     dateleft = Math.ceil(
    //         (new Date(endDate2[1] + '/' + endDate2[0] + '/' + endDate2[2]) -
    //             new Date()) /
    //             (1000 * 60 * 60 * 24)
    //     );
    //     return dateleft;
    // }

    $('.todoScroll').on('click', '.chkb', function () {
        $(this).toggleClass('done');
        $(this).parent().find('.line').toggleClass('linedone');
        $(this).parent().find('.todoTitle').toggleClass('titledone');
        save();
    });
    $('.todoScroll').on('click', '.deleteX', function () {
        if ($('.todoScroll').children().not('.emptylist').length == 1) {
            $(this).parent().parent().remove();
            $('.emptylist').removeClass('hide');
            $('.toolbar').addClass('hide');
            
        } else {
            $(this).parent().parent().remove();
        }
        save();
    })
    // $('#btn-add-task').on('click', function () {
    //     if ($('#taskname').val()) {
    //         title = $('#taskname').val();
    //         decs = $('#decs').val();
    //         prio = $('input[name = prio]:checked').val();
    //         startDate = $('#date-sel')
    //             .data('daterangepicker')
    //             .startDate.format('DD/MM/YYYY');
    //         endDate = $('#date-sel')
    //             .data('daterangepicker')
    //             .endDate.format('DD/MM/YYYY');
            
    //         content =
    //             '<div class="task-container '+id+'"> <div class="todoElement py-3 mb-5 container justify-content-between"> <input class="chkb" type="checkbox"> <div class="height p-2 w-100"> <div class="line"></div> <div class="todoDetails w-100 p-3"> <p class="todoTitle mb-3">' +
    //             title +
    //             '</p> <div class="todoDecs">' +
    //             decs +
    //             '</div> <p class="todoPrio">Ưu tiên: ' +
    //             prio +
    //             '</p> <div class="ft d-flex justify-content-between"> <div class="todoDate">Ngày thêm: ' +
    //             startDate +
    //             ' | Ngày kết thúc: ' +
    //             endDate +
    //             '</div> <div class="todoDeadline"></div> </div> </div> </div> <div class="deleteX"></div> </div> </div>';
    //         if ($('.todoScroll .emptylist').length == 0) {
    //             $('.todoScroll').prepend(content);
    //         } else if ($('.todoScroll .emptylist').length == 1) {
    //             $('.emptylist').addClass('hide');
    //             $('.toolbar').removeClass('hide');
    //             $('.todoScroll').prepend(content);
    //         }
    //         save();
    //     } else {
    //         $('#taskname').toggleClass('is-invalid');
    //     }
    // });

    $(document).on('click', '#btn-add-task', function (e) {
        e.preventDefault();
        var id = $('#pjid').val();
        taskname = $('#taskname').val();
        taskdesc = $('#taskdesc').val();
        priority = $('input[name = prio]:checked').val();
        startDate = $('#deadline')
            .data('daterangepicker')
            .startDate.format('DD/MM/YYYY');
        endDate = $('#deadline')
            .data('daterangepicker')
            .endDate.format('DD/MM/YYYY');
        deadline = 'Bắt Đầu từ: ' + startDate + ' đến ' + endDate;
        console.log(deadline);
        $.ajax({
            type: 'POST',
            url: '/projectdetail/' + id + '/',
            data: {
                taskname: taskname,
                taskdesc: taskdesc,
                priority: priority,
                deadline: deadline,
                action: 'add_task',
            },
            success: function (response) {
                console.log('add task sucess');
            },
        });
    });

    $(document).on('keyup', '#pname', function (e) {
        e.preventDefault();
        var id = $('#pjid').val();
        var new_name = $('#pname').val();
        $.ajax({
            type: 'POST',
            url: '/projectdetail/'+id+'/',
            data: {
                new_name: new_name,
                action: 'edit_pname',
            },
            success: function (response) {
                $('#br_pname').text(new_name);
                console.log(response.message);
            },
        });
    });
});