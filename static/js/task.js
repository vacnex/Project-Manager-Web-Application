$(document).ready(function () {
    $('.todoScroll').on('click', '.chkb', function () {
        $(this).toggleClass('done');
        $(this).parent().find('.line').toggleClass('linedone');
        $(this).parent().find('.todoTitle').toggleClass('titledone');
    });
    $('.todoScroll').on('click', '.deleteX', function () {
        console.log(($(this).parent().parent().parent()).children().length);
        // $(this).parent().parent().remove();
        if ($(this).parent().parent().parent().children().length == 1) {
            $(this).parent().parent().remove();
            $('.todoScroll').prepend(
                '<div class="px-4 py-5 my-5 text-center emptylist"> <h1 class="display-5 fw-bold">Danh sách công việc trống</h1> <div class="col-lg-6 mx-auto"> <p class="lead mb-4">Hãy nhấn thêm công việc để tạo danh sách công việc.</p> <div class="d-sm-flex justify-content-sm-center"> <div class="submitButtonBlue" data-bs-toggle="modal" data-bs-target="#AddTask"> <span>+</span> <p class="addSubmitBlue">Thêm công việc</p> </div> </div> </div> </div>'
            );
            $('.toolbar').addClass('hide');
        } else if ($(this).parent().parent().parent().children().length == 2) {
            $(this).parent().parent().remove();
            $('.emptylist').removeClass('hide');
            $('.toolbar').addClass('hide');
        } else {
            $(this).parent().parent().remove();
        }
    });
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
            monthNames: [
                'Tháng 1',
                'Tháng 2',
                'Tháng 3',
                'Tháng 4',
                'Tháng 5',
                'Tháng 6',
                'Tháng 7',
                'Tháng 8',
                'Tháng 9',
                'Tháng 10',
                'Tháng 11',
                'Tháng 12',
            ],
            firstDay: 1,
        },
    });
    
    $('#btn-add-task').on('click', function () {
        if ($('#taskname').val()) {
            title = $('#taskname').val();
            decs = $('#decs').val();
            prio = $('input[name = prio]:checked').val();
            startDate = $('#date-sel')
                .data('daterangepicker')
                .startDate.format('DD/MM/YYYY');
            endDate = $('#date-sel')
                .data('daterangepicker')
                .endDate.format('DD/MM/YYYY');
            endDate2 = endDate.split('/');
            dateleft = Math.ceil(
                (new Date(endDate2[1] + '/' + endDate2[0] + '/' + endDate2[2]) -
                    new Date()) /
                    (1000 * 60 * 60 * 24)
            );
            content =
                '<div class="task-container"> <div class="todoElement py-3 mb-5 container justify-content-between"> <input class="chkb" type="checkbox"> <div class="height p-2 w-100"> <div class="line"></div> <div class="todoDetails w-100 p-3"> <p class="todoTitle mb-3">' +
                title +
                '</p> <div class="todoDecs">' +
                decs +
                '</div> <p class="todoPrio">Ưu tiên: ' +
                prio +
                '</p> <div class="ft d-flex justify-content-between"> <div class="todoDate">Ngày thêm: ' +
                startDate +
                ' | Ngày kết thúc ' +
                endDate +
                '</div> <div class="todoDeadline">Còn lại: ' +
                dateleft +
                ' ngày</div> </div> </div> </div> <div class="deleteX"></div> </div> </div>';
            if ($('.todoScroll .emptylist').length == 0) {
                $('.todoScroll').prepend(content);
            } else if ($('.todoScroll .emptylist').length == 1) {
                $('.emptylist').addClass('hide');
                $('.toolbar').removeClass('hide');
                $('.todoScroll').prepend(content);
            }
            alltask = $('.task-container');
            html = [];
            for (let i = 0; i <= alltask.length; i++) {
                if ($(alltask[i]).html()) {
                    html.push($(alltask[i]).html());
                }
            }
            console.log(html.join(''));
            $('#taskcontent').val(html.join(''));
        } else {
            $('#taskname').toggleClass('is-invalid');
        }
    });
    
    $('#taskname').change(function (e) {
        $('#taskname').removeClass('is-invalid');
    });

    $('body').on('show.bs.modal', '.modal', function () {
        $('#taskname').val('');
        $('#decs').val('');
        $('input[name=prio][value=Vừa]').prop('checked', true);
        $('#date-sel').data('daterangepicker').setStartDate(new Date());
        $('#date-sel').data('daterangepicker').setEndDate(new Date());
    });
});