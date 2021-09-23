$(document).ready(function () {
    $.ajaxSetup({
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
    });
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + '=');
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(';', c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return '';
    }
    $(document).on(
        {
            mouseenter: function () {
                $('.btn-circle', this).removeClass('d-none');
            },
            mouseleave: function () {
                $('.btn-circle', this).addClass('d-none');
            },
        },
        '.assignment_list .item'
    );


    $(document).on('keyup','#myInput', function () {
        var value = $(this).val().toLowerCase();
        $('.list-wraper li').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });


    $('#assignmentForm').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/assignment/',
            data: {
                Teacher: $('#id_Teacher').val(),
                Student: $('#id_Student').val(),
                action: 'add',
            },
            success: function (response) {
                $('#assignmentForm').trigger('reset');
                var asm_instance = JSON.parse(response);
                var ass =
                    '<li class="item shadow" onclick=""><div class="row"><div class="col-sm-2"><div class="mini-box" style="font-family: Roboto;font-size: 1.4em;font-style: normal; font-weight: 400;line-height: 21px;color: #EB5757;">' +
                    asm_instance['id'] +
                    '</div ></div > <div class="col-sm-9"><div class="asm-Content"><h3>Tên đề tài chưa cập nhật</h3 > <div class="assignment-info"><span style="color: blue"> GVHD: </span><span class="me-2">' +
                    asm_instance['teacher'] +
                    '</span><span style="color: blue"> Sinh Viên:</span><span class="me-2">' +
                    asm_instance['student'] +
                    '</span></div></div></div ><div class="col-sm-1"> <a id="btn-asdel" class="btn btn-danger btn-circle d-none"><i class="fas fa-times"></i></a></div></div ></li > ';
                ass = $(ass).addClass('new-item');;
                $('.list-wraper').append(ass);
                $('.list-wraper').scrollTop($('.list-wraper')[0].scrollHeight);
            },
            error: function (response) {
                console.log(response['responseJSON']['error']);
            },
        });
    });

    $(document).on('click', '#btn-asdel', function (e) {
        cur_record = $(this).parent().parent();
        record_id = parseInt($(this)
            .parent()
            .parent()
            .find('.col-sm-2')
            .text()
            .replace(/\s/g, ''));
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/assignment/',
            data: {
                pk: record_id,
                action: 'del',
            },
            success: function (response) {
                if (response.message === 'success') {
                    $(cur_record)
                        .removeClass('new-item')
                        .addClass('removed-item')
                        .one(
                            'webkitAnimationEnd oanimationend msAnimationEnd animationend',
                            function (e) {
                                $(cur_record).remove();
                            }
                        );
                }
            },
            error: function (response) {
                console.log(response['responseJSON']['error']);
            },
        });
    });

});