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
      console.log();
    }
    return '';
  }
  function isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }
  function save() {
    lt = $('.todoScroll').children().not('.emptylist');
    html = [];
    for (let i = 0; i < lt.length; i++) {
      html.push($(lt[i]).prop('outerHTML'));
    }
    $('#taskcontent').val(html.join(''));
    $('form[name=task-update-form]').submit();
  }
  function dayleft(endDate) {
    endday = (endDate.trim().split('n')[1]).trim()
    endDate2 = endday.split('/');
    console.log(endDate2[1], endDate2[0], endDate2[2]);
    dateleft = Math.ceil(
      (new Date(endDate2[1] + '/' + endDate2[0] + '/' + endDate2[2]) -
        new Date()) /
      (1000 * 60 * 60 * 24)
    );
    return dateleft;
  }
  if (!isTouchDevice()) {
    console.log(isTouchDevice());
    $('.task_list .box-scroll .box-item').each(function () {
      $(this).find('#btn-tdel').addClass('d-none');
    });
    $(document).on(
      {
        mouseenter: function () {
          $('#btn-tdel', this).removeClass('d-none');
        },
        mouseleave: function () {
          $('#btn-tdel', this).addClass('d-none');
        },
      },
      '.task_list .box-item'
    );
  }

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
      monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      firstDay: 1,
    },
  });

  $('#taskname').change(function (e) {
    $('#taskname').removeClass('is-invalid');
  });


  $(document).on('show.bs.modal', '#TaskModal', function (e) {
    btn = $(e.relatedTarget).parent();
    action = $('div[data-bs-whatever]', btn).attr('data-bs-whatever');
    if (action == '@addtask') {
      $('#TaskModal #taskname').val("");
      $('#TaskModal #taskdesc').val("");
      $('#TaskModal #TaskModalTitle').text('Thêm Công Việc Mới');
      $('#TaskModal #taskname').attr('placeholder', 'Tên công việc');
      $('#TaskModal #tasknamelabel').text('Tên công việc');
      $('#TaskModal #taskdesc').attr('placeholder', 'Thêm ghi chú');
      $('#TaskModal #taskdesclabel').text('Thêm ghi chú');
      $('#TaskModal .btn-TaskModalSubmit').text('Thêm');
      $('#TaskModal .btn-TaskModalSubmit').attr('id', 'btn-task-add');
      $('#TaskModal .prio-sel #medprio').attr('checked', true);
    }
    else if (action == '@edittask') {
      $('#TaskModal .modal-content').attr('id', $(btn).attr('id'));
      $('#TaskModal #TaskModalTitle').text('Sửa công việc');
      $('#TaskModal #taskname').attr('placeholder', 'Tên công việc mới');
      $('#TaskModal #tasknamelabel').text('Tên công việc mới');
      $('#TaskModal #taskdesc').attr('placeholder', 'Sửa ghi chú');
      $('#TaskModal #taskdesclabel').text('Sửa ghi chú');
      $('#TaskModal .btn-TaskModalSubmit').text('Sửa');
      $('#TaskModal .btn-TaskModalSubmit').attr('id', 'btn-task-edit');
      taskid = $(btn).attr('id');
      taskname = $(btn).find('#tname').text().trim();
      taskdesc = $(btn).find('#tdesc').text().trim();
      taskprio = $(btn).find('#tprio').text().trim();
      // console.log(taskid, taskname, taskdesc, taskprio);
      $('#TaskModal #taskname').val(taskname);
      $('#TaskModal #taskdesc').val(taskdesc);
      $.each($('#TaskModal .prio-sel .btn-group input'), function (indexInArray, valueOfElement) {
        if ($(this).val() == taskprio) {
          $(this).attr('checked', true);
        }
      });

    }
  });

  /* #region  chkbox */
  // $('.todoScroll').on('click', '.chkb', function () {
  //     $(this).toggleClass('done');
  //     $(this).parent().find('.line').toggleClass('linedone');
  //     $(this).parent().find('.todoTitle').toggleClass('titledone');
  //     save();
  // });
  // $('.todoScroll').on('click', '.deleteX', function () {
  //     if ($('.todoScroll').children().not('.emptylist').length == 1) {
  //         $(this).parent().parent().remove();
  //         $('.emptylist').removeClass('hide');
  //         $('.toolbar').addClass('hide');

  //     } else {
  //         $(this).parent().parent().remove();
  //     }
  //     save();
  // })
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

  /* #endregion */
  
  $(document).on('click', '#btn-task-add', function (e) {
    e.preventDefault();
    var id = $('.task-header .row #pjid').val();
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
        console.log(JSON.parse(response));
        var task_instance = JSON.parse(response);
        date = task_instance['deadline'];
        var task = '<li id="' + task_instance['id'] + '" class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4" onclick=""> <a id="btn-tdel" class="btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a><div class="row p-xxl-2 p-3" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"><div class="col-sm-2 d-flex"><div id="tprio" class="box box-label w-100 h-100 p-2">' + task_instance['priority'] + '</div></div><div class="col-sm-10 d-flex align-items-center"><div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2"></div><div class="asm-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"><h3 id="tname">' + task_instance['taskName'] + '</h3><p id="tdesc">' + task_instance['taskDesc'] + '</p><div class="row assignment-info"><div class="col-md-6"><div class="todoDate">' + task_instance['deadline'] + '</div></div><div id="daysleft" class="col-md-6">' + dayleft(date) + '</div></div></div></div></div></li>';

        console.log('add task sucess');
        console.log($('.task_list .box-scroll').length);
        pname = task_instance['pname'];
        if (!pname) {
          pname = "Tên đề tài chưa cập nhật";
        }
        if ($('.task_list .box-scroll').length == 0) {
          $('.task_list').html('<ul class="box-scroll list-unstyled py-0 mb-0 p-xxl-0 p-md-4 p-3"></ul>');
          task = $(task).addClass('new-item');
          $('.task_list .box-scroll').append(task);
          $('.task-header .row').html('<div class="col-lg-10"><form id="changeProjectNameForm" name="changeProjectNameForm" method="post" action="."><input type="hidden" name="csrfmiddlewaretoken"> <input id="pjid" type="hidden" name="pjid" value=' + id + '> <input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '"></form></div><div class="col-lg-2 mt-lg-0 mt-md-3 mt-sm-2 mt-1 d-flex align-items-center justify-content-center"><form name="task-update-form" method="post" action="."><input type="hidden" name="csrfmiddlewaretoken"> <input id="taskcontent" type="hidden" name="taskcontent" value=""> <input id="pjid" type="hidden" name="pjid" value=' + id + '><div class="btn btn-custom scale-hover px-xxl-1 px-xl-2 px-lg-0 px-md-5 px-4" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@addtask"><span>+</span>Thêm công việc</div></form></div>');
          $('.task-header .row input[name="csrfmiddlewaretoken"]').val(getCookie('csrftoken'));
        } else if ($('.task_list .box-scroll').length == 1) {
          task = $(task).addClass('new-item');
          $('.task_list .box-scroll').append(task);
        }
        $('.task_list .box-scroll').scrollTop(
          $('.task_list .box-scroll')[0].scrollHeight
        );
        if (!isTouchDevice()) {
          task = $(task).find('#btn-tdel').addClass('d-none');
        }
        $('#TaskModal').modal('hide');
      },
    });
  });

  $(document).on('click', '#btn-tdel', function (e) {
    e.stopPropagation(); //ngăn modal hiện
    e.preventDefault();
    cur_record = $(this).parent();
    record_id = parseInt($(cur_record).attr('id'));
    console.log(record_id);
    var id = $('.task-header .row #pjid').val();
    $.ajax({
      type: 'POST',
      url: '/projectdetail/' + id + '/',
      data: {
        pk: record_id,
        action: 'del',
      },
      success: function (response) {
        var deltask_instance = JSON.parse(response);
        message = deltask_instance['message'];
        pname = deltask_instance['pname'];
        if (!pname) {
          pname = "Tên đề tài chưa cập nhật";
        }
        if (message === 'success') {
          console.log($('.task_list .box-scroll').children().length);
          if ($('.task_list .box-scroll').children().length == 1 && $('.task-header .row').children().length != 1) {
            $(cur_record).removeClass('new-item').addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
              $(cur_record).remove();
            });
            $('.task_list').html('<div class="d-flex justify-content-center"><div class="box px-4 py-5 mx-xxl-5 mx-lg-4 mx-md-0 mx-3 text-center emptylist"><h1 class="display-5 fw-bold">Danh sách công việc trống</h1><p class="lead mb-4">Hãy nhấn thêm công việc để tạo danh sách công việc.</p><div class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@addtask"> <span>+</span>Thêm công việc</div></div></div>');
            $('.task-header .row').html('<div class="col-12"><form id="changeProjectNameForm" name="changeProjectNameForm" method="post" action="."> <input type="hidden" name="csrfmiddlewaretoken"> <input id="pjid" type="hidden" name="pjid" value=' + id + ' /> <input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '" /></form></div>');
            $('.task-header .row input[name="csrfmiddlewaretoken"]').val(getCookie('csrftoken'));
          } else {
            $(cur_record).removeClass('new-item').addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
              $(cur_record).remove();
            });
            $('.task-header .row').html('<div class="col-lg-10"><form id="changeProjectNameForm" name="changeProjectNameForm" method="post" action="."> <input type="hidden" name="csrfmiddlewaretoken"> <input id="pjid" type="hidden" name="pjid" value=' + id + ' /> <input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '" /></form></div><div class="col-lg-2 mt-lg-0 mt-md-3 mt-sm-2 mt-1 d-flex align-items-center justify-content-center"><form name="task-update-form" method="post" action="."> <input type="hidden" name="csrfmiddlewaretoken"> <input id="taskcontent" type="hidden" name="taskcontent" value="" /> <input id="pjid" type="hidden" name="pjid" value=' + id + ' /><div class="btn btn-custom scale-hover px-xxl-1 px-xl-2 px-lg-0 px-md-5 px-4" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@addtask"> <span>+</span> Thêm công việc</div></form></div>');
            $('.task-header .row input[name="csrfmiddlewaretoken"]').val(getCookie('csrftoken'));
          }

        }
      },
      error: function (response) {
        console.log(response['responseJSON']['error']);
      },
    });
  });

  $(document).on('click', '#btn-task-edit', function () {
    pjid = $('.task-header #pjid').val();
    taskid = $('#TaskModal .modal-content').attr('id');
    taskname = $('#TaskModal #taskname').val();
    taskdesc = $('#TaskModal #taskdesc').val();
    taskprio = $('#TaskModal .prio-sel .btn-group input:checked').val()
    startDate = $('#TaskModal #deadline')
      .data('daterangepicker')
      .startDate.format('DD/MM/YYYY');
    endDate = $('#deadline')
      .data('daterangepicker')
      .endDate.format('DD/MM/YYYY');
    taskdeadline = 'Bắt Đầu từ: ' + startDate + ' đến ' + endDate;
    
    $.ajax({
      type: "POST",
      url: '/projectdetail/' + pjid + '/',
      data: {
        'pjid': pjid,
        'taskid': taskid,
        'taskname': taskname,
        'taskdesc': taskdesc,
        'taskprio': taskprio,
        'taskdeadline': taskdeadline,
        'action':'edit_task'
      },
      success: function (response) {
        var edittask_instance = JSON.parse(response);
        taskid = edittask_instance['taskid']
        taskname = edittask_instance['taskname']
        taskdesc = edittask_instance['taskdesc']
        taskprio = edittask_instance['taskprio']
        taskdeadline = edittask_instance['taskdeadline']
        
        $.each($('.task_list .box-scroll li'), function (indexInArray, valueOfElement) {
          if ($(this).attr('id') == taskid) {
            $(this).find('#tname').text(taskname);
            $(this).find('#tdesc').text(taskdesc);
            $(this).find('#tprio').text(taskprio);
            $(this).find('#todoDate').text(taskdeadline);
            $(this).find('#daysleft').text(dayleft(taskdeadline));
          }
        });
        
        $('#TaskModal').modal('hide');
      }
    });
    // taskprio = 
  });

  $(document).on('keyup', '#pname', function (e) {
    e.preventDefault();
    console.log('test');
    var id = $('.task-header .row #pjid').val();
    var new_name = $('#pname').val();
    $.ajax({
      type: 'POST',
      url: '/projectdetail/' + id + '/',
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