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
                    '<li class="item shadow" onclick=""><div class="row"><div class="col-lg-2 col-md-2"><div id="pid" class="mini-box">' +
                    asm_instance['id'] +
                    '</div></div><div class="col-lg-10 col-md-10"> <div class="asm-Content ms-xxl-5 ms-md-2"> <h3 id="pname">Tên đề tài chưa cập nhật</h3> <div class="row assignment-info"> <div class="col-xl-6"> <span style="color: blue"> GVHD: </span> <span id="tname" class="me-2">' +
                    asm_instance['teacher'] +
                    '</span> </div> <div class="col-xl-6"> <span style="color: blue"> Sinh Viên:</span> <span id="sname" class="me-2">' +
                    asm_instance['student'] +
                    '</span> </div> </div> </div> </div> <a id="btn-asdel" class="btn btn-danger btn-circle d-none"> <i class="fas fa-times"></i> </a> </div></li>';
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
        e.stopPropagation();
        cur_record = $(this).parent().parent();
        record_id = parseInt(
            $(this).parent().parent().find('#pid').text().replace(/\s/g, '')
        );
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

    $(document).on('click', '.list-wraper .item', function () {
        item = $(this);
        console.log('load detail success');
        $('#editAssignmentItemBox').modal('show');
        pid = $(item).find('#pid').text();
        pname = $(item).find('#pname').text();
        tname = $(item).find('#tname').text();
        sname = $(item).find('#sname').text();
        $('#Pid').val(parseInt(pid.trim()));
        $('#oldPName').val(pname.trim());
        $('#oldTeachName').val(tname.trim());
        $('#oldStudentName').val(sname.trim());
    });

    $(document).on('click', '#confirmEdit', function (e) {
        console.log($('#Pid').val())
        item_list = $('.list-wraper .item');
        $.ajax({
            type: 'POST',
            url: '/assignment/',
            data: {
                action: 'save_item',
                id: $('#Pid').val(),
                pName: $('#oldPName').val(),
                Teacher: $('#selNewTeach select').val(),
                Student: $('#selNewStudent select').val(),
            },
            success: function (response) {
                console.log(response.message);
                newpn = $('#oldPName').val();
                newt = $('#selNewTeach select option:selected').text();
                news = $('#selNewStudent select option:selected').text();
                $.each(item_list, function (indexInArray, valueOfElement) {
                    if (
                        parseInt($('#Pid').val()) ==
                        parseInt($('#pid', valueOfElement).text())
                    ) {
                        $('#pname', valueOfElement).text(newpn);
                        $('#tname', valueOfElement).text(newt);
                        $('#sname', valueOfElement).text(news);
                    }
                });
                $('#editAssignmentItemBox').modal('hide');
            },
            error: function (response) {
                console.log(response.message);
            },
        });
    });

    $(document).on('change', '#selNewTeach select', function () {
        $('#oldTeachName').val($('option:selected',this).text());
    });
    $(document).on('change', '#selNewStudent select', function () {
        $('#oldStudentName').val($('option:selected',this).text());
    });

    $(document).on('click', '#closeEdit', function () {
        $('#editAssignmentItemBox').modal('hide');
    });
    $(document).on('show.bs.modal', '#editAssignmentItemBox', function () {
        $('#oldPName').val('');
        $('#oldTeachName').val('');
        $('#oldStudentName').val('');
        $('#assignmentEditForm').trigger('reset');
    });
});