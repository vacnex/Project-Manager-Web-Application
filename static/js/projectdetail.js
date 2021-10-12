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
  function dayleft(endDate) {
    endday = (endDate.trim().split('n')[1]).trim();
    endDate2 = endday.split('/');
    console.log(endDate2[1], endDate2[0], endDate2[2]);
    dateleft = Math.ceil(
      (new Date(endDate2[1] + '/' + endDate2[0] + '/' + endDate2[2]) -
        new Date()) /
      (1000 * 60 * 60 * 24)
    );
    return dateleft;
  }
  function AddNewTask(TaskName) {
    $('.box-scroll').prepend('<li class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4"> <a id="btn-tdel" class="d-none btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a> <div class="row p-xxl-2 p-3" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"> <div class="col-sm-2 d-flex d-none"> <div id="tprio" class="box box-label w-100 h-100 p-2"> </div></div><div class="col-sm-10 d-flex align-items-center"> <div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2 d-none"></div><div class="task-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"> <h3 id="tname">' + TaskName + '</h3><p id="tdesc"></p><div class="row assignment-info"> <div class="col-md-6"> <div id="tdeadline" class="todoDate"></div></div><div id="daysleft" class="col-md-6"> </div></div></div></div></div></li>');
    var id = $('.task-header .row #pjid').val();
    $.ajax({
      type: 'POST',
      url: '/projectdetail/' + id + '/',
      data: {
        taskname: TaskName,
        action: 'ADD_NEW_MAIN_TASK',
      },
      success: function (response) {
        console.log(response.message);
      },
    });
  }
  if (!isTouchDevice()) {
    console.log(isTouchDevice());
    $('.task_list .box-scroll .box-item').each(function () {
      $(this).find('#btn-tdel').addClass('d-none');
      // $(this).find('#btn-tedit').addClass('d-none');
    });
    $(document).on(
      {
        mouseenter: function () {
          $('#btn-tdel', this).removeClass('d-none');
          // $('#btn-tedit', this).removeClass('d-none');
        },
        mouseleave: function () {
          $('#btn-tdel', this).addClass('d-none');
          // $('#btn-tedit', this).addClass('d-none');
        },
      },
      '.task_list .box-item'
    );
  } else {
    $('#TaskModal .deadline .input-group').addClass('d-none');
    $('#TaskModal .deadline input[type="date"]').removeClass('d-none');
  }

  $('input[name="dates"]').daterangepicker({
    locale: {
      format: 'DD/MM/YYYY',
      separator: ' đến ',
      applyLabel: 'Xác nhận',
      cancelLabel: 'Huỷ',
      fromLabel: 'Từ',
      toLabel: 'Đến',
      customRangeLabel: 'Tuỳ chọn',
      daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      firstDay: 1,
    },
    drops: "up",
    linkedCalendars: false,
    autoApply: true,
  });


  $(document).on('show.bs.modal', '#TaskModal', function (e) {
    btn = $(e.relatedTarget).parent();
    action = $('div[data-bs-whatever]', btn).attr('data-bs-whatever');
    if (action == '@edittask') {
      $('#TaskModal .modal-content').attr('id', $(btn).attr('id'));
      $('#TaskModal #taskdesc').attr('placeholder', 'Thêm mô tả chi tiết');
      $('#TaskModal #taskdesclabel').text('Thêm mô tả chi tiết');
      taskid = $(btn).attr('id');
      taskname = $(btn).find('#tname').text().trim();
      taskdesc = $(btn).find('#tdesc').text().trim();
      taskprio = $(btn).find('#tprio').text().trim();
      deadline = $(btn).find('#tdeadline').text().trim();
      $('#TaskModal #taskname').val(taskname);
      $('#TaskModal #taskdesc').val(taskdesc);
      $.each($('#TaskModal .prio-sel .btn-group input'), function (indexInArray, valueOfElement) {
        if ($(this).val() == taskprio) {
          $(this).attr('checked', true);
        }
      });
      $('#TaskModal .deadline #deadline').data('daterangepicker').setStartDate((deadline.trim().split('đ')[0]).trim());
      $('#TaskModal .deadline #deadline').data('daterangepicker').setEndDate((deadline.trim().split('n')[1]).trim());
      var id = $('.task-header .row #pjid').val();
      $('.child-wrap').empty();
      $.ajax({
        type: "GET",
        data: {
          parenttaskid: taskid,
          action: 'GET_CHILD_TASK_DATA'
        },
        url: '/projectdetail/' + id + '/',
        success: function (response) {
          data = JSON.parse(response);
          if (data.length) {
            $.each(data, function (indexInArray, valueOfElement) {
              $('.child-wrap').append('<div id=' + valueOfElement["pk"] + ' class="child-task mb-3"> <div class="mb-2 d-flex"> <div class="d-flex align-items-center flex-grow-1"> <i class="fas fa-tasks me-2"></i> <input id="taskchildname" class="form-control input-custom" name="taskchildname" value="' + valueOfElement["fields"]["taskName"] + '"/> </div><div id="del-child-task" class="btn btn-danger mx-3">Xoá công việc phụ</div></div><ul class="ps-0 child-item"> </ul> <div id="add-child-task-item" class="btn btn-primary">thêm mục</div></div>');
              $.ajax({
                type: "GET",
                data: {
                  parenttaskitemid: valueOfElement["pk"],
                  action: 'GET_CHILD_TASK_ITEM_DATA'
                },
                url: '/projectdetail/' + id + '/',
                success: function (response) {
                  data = JSON.parse(response);
                  if (data.length) {
                    console.log(data);
                    $.each(data, function (indexInArray, valueOfChildElement) {
                      if (valueOfChildElement["fields"]["parentTask"] == valueOfElement["pk"]) {
                        done = valueOfChildElement["fields"]["complete"];
                        a = $('.child-wrap .child-task[id=' + valueOfElement["pk"] + '] .child-item').append('<li id="' + valueOfChildElement["pk"] + '"class="box-s input-group mb-3 d-flex align-items-center "> <div class="d-flex align-items-center p-2"> <input class="form-check-input mt-0" type="checkbox" ' + (done ? "checked" : "") + ' > </div><div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfChildElement["fields"]["taskName"] + '</div> <div id="delChildTasKItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
                        if (valueOfChildElement["fields"]["tempComplete"]) {
                          $('.child-wrap .child-task[id=' + valueOfElement["pk"] + '] .child-item').find('li[id=' + valueOfChildElement["pk"] + '] input[type=checkbox]').prop("indeterminate", true);
                          // item = $('.child-wrap .child-task[id=' + valueOfElement["pk"] + '] .child-item').find('li[id=' + valueOfChildElement["pk"] + '] input[type=checkbox]').parent().parent()
                          // console.log($(':nth-child(2)', item).after('<div id="failedChildTasKItem" class="m-1 p-2 rounded shadow btn btn-warning">Chưa đạt </div>'));
                          // 
                        }
                      };
                    });
                  } else {
                    console.log('empty');
                  }
                }
              });
            });
          }
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

  /* #region  old add task */
  // $(document).on('click', '#btn-task-add', function (e) {
  //   e.preventDefault();
  //   var id = $('.task-header .row #pjid').val();
  //   taskname = $('#taskname').val();
  //   taskdesc = $('#taskdesc').val();
  //   priority = $('input[name = prio]:checked').val();
  //   startDate = $('#deadline')
  //     .data('daterangepicker')
  //     .startDate.format('DD/MM/YYYY');
  //   endDate = $('#deadline')
  //     .data('daterangepicker')
  //     .endDate.format('DD/MM/YYYY');
  //   deadline = 'Bắt Đầu từ: ' + startDate + ' đến ' + endDate;
  //   $.ajax({
  //     type: 'POST',
  //     url: '/projectdetail/' + id + '/',
  //     data: {
  //       taskname: taskname,
  //       taskdesc: taskdesc,
  //       priority: priority,
  //       deadline: deadline,
  //       action: 'add_task',
  //     },
  //     success: function (response) {
  //       console.log(JSON.parse(response));
  //       var task_instance = JSON.parse(response);
  //       date = task_instance['deadline'];
  //       var task = '<li id="' + task_instance['id'] + '" class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4" onclick=""> <a id="btn-tdel" class="btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a><div class="row p-xxl-2 p-3" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"><div class="col-sm-2 d-flex"><div id="tprio" class="box box-label w-100 h-100 p-2">' + task_instance['priority'] + '</div></div><div class="col-sm-10 d-flex align-items-center"><div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2"></div><div class="asm-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"><h3 id="tname">' + task_instance['taskName'] + '</h3><p id="tdesc">' + task_instance['taskDesc'] + '</p><div class="row assignment-info"><div class="col-md-6"><div class="todoDate">' + task_instance['deadline'] + '</div></div><div id="daysleft" class="col-md-6">' + dayleft(date) + '</div></div></div></div></div></li>';

  //       console.log('add task sucess');
  //       console.log($('.task_list .box-scroll').length);
  //       pname = task_instance['pname'];
  //       if (!pname) {
  //         pname = "Tên đề tài chưa cập nhật";
  //       }
  //       if ($('.task_list .box-scroll').length == 0) {
  //         $('.task_list').html('<ul class="box-scroll list-unstyled py-0 mb-0 p-xxl-0 p-md-4 p-3"></ul>');
  //         task = $(task).addClass('new-item');
  //         $('.task_list .box-scroll').append(task);
  //         $('.task-header .row').html('<div class="col-lg-10"><form id="changeProjectNameForm" name="changeProjectNameForm" method="post" action="."><input type="hidden" name="csrfmiddlewaretoken"> <input id="pjid" type="hidden" name="pjid" value=' + id + '> <input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '"></form></div><div class="col-lg-2 mt-lg-0 mt-md-3 mt-sm-2 mt-1 d-flex align-items-center justify-content-center"><form name="task-update-form" method="post" action="."><input type="hidden" name="csrfmiddlewaretoken"> <input id="taskcontent" type="hidden" name="taskcontent" value=""> <input id="pjid" type="hidden" name="pjid" value=' + id + '><div class="btn btn-custom scale-hover px-xxl-1 px-xl-2 px-lg-0 px-md-5 px-4" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@addtask"><span>+</span>Thêm công việc</div></form></div>');
  //         $('.task-header .row input[name="csrfmiddlewaretoken"]').val(getCookie('csrftoken'));
  //       } else if ($('.task_list .box-scroll').length == 1) {
  //         task = $(task).addClass('new-item');
  //         $('.task_list .box-scroll').append(task);
  //       }
  //       $('.task_list .box-scroll').scrollTop(
  //         $('.task_list .box-scroll')[0].scrollHeight
  //       );
  //       if (!isTouchDevice()) {
  //         task = $(task).find('#btn-tdel').addClass('d-none');
  //       }
  //       $('#TaskModal').modal('hide');
  //     },
  //   });
  // });
  /* #endregion */

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
        action: 'DELETE_MAIN_TASK',
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

  /* #region  old edit task */
  // $(document).on('click', '#btn-task-edit', function () {
  //   pjid = $('.task-header #pjid').val();
  //   taskid = $('#TaskModal .modal-content').attr('id');
  //   taskname = $('#TaskModal #taskname').val();
  //   taskdesc = $('#TaskModal #taskdesc').val();
  //   taskprio = $('#TaskModal .prio-sel .btn-group input:checked').val()
  //   startDate = $('#TaskModal #deadline')
  //     .data('daterangepicker')
  //     .startDate.format('DD/MM/YYYY');
  //   endDate = $('#deadline')
  //     .data('daterangepicker')
  //     .endDate.format('DD/MM/YYYY');
  //   taskdeadline = 'Bắt Đầu từ: ' + startDate + ' đến ' + endDate;

  //   $.ajax({
  //     type: "POST",
  //     url: '/projectdetail/' + pjid + '/',
  //     data: {
  //       'pjid': pjid,
  //       'taskid': taskid,
  //       'taskname': taskname,
  //       'taskdesc': taskdesc,
  //       'taskprio': taskprio,
  //       'taskdeadline': taskdeadline,
  //       'action':'edit_task'
  //     },
  //     success: function (response) {
  //       var edittask_instance = JSON.parse(response);
  //       taskid = edittask_instance['taskid']
  //       taskname = edittask_instance['taskname']
  //       taskdesc = edittask_instance['taskdesc']
  //       taskprio = edittask_instance['taskprio']
  //       taskdeadline = edittask_instance['taskdeadline']

  //       $.each($('.task_list .box-scroll li'), function (indexInArray, valueOfElement) {
  //         if ($(this).attr('id') == taskid) {
  //           $(this).find('#tname').text(taskname);
  //           $(this).find('#tdesc').text(taskdesc);
  //           $(this).find('#tprio').text(taskprio);
  //           $(this).find('#todoDate').text(taskdeadline);
  //           $(this).find('#daysleft').text(dayleft(taskdeadline));
  //         }
  //       });

  //       $('#TaskModal').modal('hide');
  //     }
  //   });
  //   // taskprio = 
  // });
  /* #endregion */

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
        action: 'EDIT_PROJECT_NAME',
      },
      success: function (response) {
        $('#br_pname').text(new_name);
        console.log(response.message);
      },
    });
  });

  $(document).on('click', '#AddNewMainTask', function () {
    var input_task = '<li class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4"> <a id="btn-tdel" class="d-none btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a> <div class="row p-xxl-2 p-3" data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"> <div class="col-sm-2 d-flex d-none"> <div id="tprio" class="box box-label w-100 h-100 p-2"> </div></div><div class="col-sm-10 d-flex align-items-center"> <div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2 d-none"></div><div class="task-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"> <input id="tname" class="form-control input-custom input-no-focus fs-3" name="tname" placeholder="Nhập tên công việc"/> <p id="tdesc"></p><div class="row assignment-info"> <div class="col-md-6"> <div id="tdeadline" class="todoDate"></div></div><div id="daysleft" class="col-md-6"> </div></div></div></div></div></li>';
    if ($('.task_list .box-scroll').length) {
      $('.box-scroll').prepend(input_task);
      $('#tname').focus();
      $('#tname').focusout(function (e) {
        e.preventDefault();
        var new_item = $('#tname').parent().parent().parent().parent();
        tname = $('#tname').val();
        if (tname) {
          $(new_item).children().remove();
          AddNewTask(tname);
        } else {
          $(new_item).remove();
        }
      });
    } else {
      $('.task_list').html('<ul class="box-scroll list-unstyled py-0 mb-0 p-xxl-0 p-md-4 p-3"></ul>');
      var new_item = $('.box-scroll').prepend(input_task);
      $('#tname').focus();
      $('#tname').focusout(function (e) {
        e.preventDefault();
        if ($('#tname').val()) {
          var tname = $('#tname').val();
          $(new_item).children().remove();
          AddNewTask(tname);
        } else { $('.task_list').html('<div class="d-flex justify-content-center"> <div class="box px-4 py-5 mx-xxl-5 mx-lg-4 mx-md-0 mx-3 text-center emptylist"> <h1 class="display-5 fw-bold">Danh sách công việc trống</h1> <p class="lead mb-4">Hãy nhấn thêm công việc để tạo danh sách công việc.</p><div id="AddNewMainTask" class="btn btn-custom"> <span>+</span>Thêm công việc</div></div></div>'); }
      });
    }
  });
  $(document).on('keypress', '#tname', function (e) {
    if (e.which == 13) {
      new_task_input = $(this).parent().parent().parent().parent();
      var tname = $('#tname').val();
      $(new_task_input).remove();
      AddNewTask(tname);
    }
  });

  $(document).on('click', '#add-child-task', function () {
    var new_child_task = $('.child-wrap').append('<div class="child-task mb-3"> <div class="mb-2 d-flex"> <div class="flex-grow-1 d-flex align-items-center"> <i class="fas fa-tasks me-2"></i> <input id="taskchildname" class="form-control input-custom " name="taskchildname"/> </div><div id="del-child-task" class="btn btn-danger mx-3">Xoá công việc phụ</div></div><ul class="ps-0 child-item"> </ul> <div id="add-child-task-item" class="btn btn-primary">thêm mục</div></div>');
    $(new_child_task).children().last().find('#taskchildname').focus();
    $(new_child_task).children().last().find('#taskchildname').focusout(function (e) {
      e.preventDefault();
      if ($(this).val()) {
        addChildTask(this);
      }
      else {
        $(this).parent().parent().parent().remove();
      }
    });
  });
  function addChildTask(e) {
    var id = $('.task-header .row #pjid').val();
    var parenttaskid = $('#TaskModal .modal-dialog .modal-content').attr('id');
    console.log(parenttaskid);
    $.ajax({
      type: 'POST',
      url: '/projectdetail/' + id + '/',
      data: {
        parenttaskid: parenttaskid,
        childtaskname: e.value,
        action: 'ADD_CHILD_TASK',
      },
      success: function (response) {
        var childtask_instance = JSON.parse(response);
        childtaskid = childtask_instance['childtaskid'];
        $(e).parent().parent().parent().attr('id', childtaskid);
      },
    });
  }

  $(document).on('click', "#add-child-task-item", function () {
    var new_child_task_item = $(this).parent().find('.child-item').append('<li class="box-s input-group mb-3 "> <div class="d-flex align-items-center p-2"> <input class="form-check-input mt-0" type="checkbox"> </div><input id="taskchilditemname" type="text" class="form-control input-custom" > <div id="del-child-task-item" class="btn"><i class="p-1 fas fa-times"></i></div></li>');
    $(new_child_task_item).children().last().find('input[type=text]').focus();

    $(new_child_task_item).children().last().find('input[type=text]').focusout(function (e) {
      e.preventDefault();
      if ($(this).val()) {
        addChildTaskItem(this);
      }
      else {
        $(this).parent().remove();
      }
    });
  });
  function addChildTaskItem(e) {
    var id = $('.task-header .row #pjid').val();
    var parenttaskid = $(e).parent().parent().parent().attr('id');
    console.log(parenttaskid);
    $.ajax({
      type: 'POST',
      url: '/projectdetail/' + id + '/',
      data: {
        parenttaskid: parenttaskid,
        childtaskitemname: e.value,
        action: 'ADD_CHILD_TASK_ITEM',
      },
      success: function (response) {
        console.log(response.message);
        // var childtask_instance = JSON.parse(response);
        // childtaskid = childtask_instance['childtaskid'];
        // $(e).parent().parent().parent().attr('id', childtaskid);
      },
    });
  }

  $(document).on('keyup', '#TaskModal #taskname', function () {
    mainTaskId = $(this).parent().parent().attr('id');
    mainTaskName = $(this).val();
    editTask(mainTaskId, mainTaskName);
  });
  $(document).on('keyup', '#TaskModal #taskchildname', function () {
    childTaskId = $(this).parent().parent().parent().attr('id');
    childTaskName = $(this).val();
    editTask(null, null, null, null, null, childTaskId, childTaskName);
  });

  /* #region  Xử lý giao diện taskchilditemname */
  $(document).on('click', '#taskchilditemname', function () {
    val = $(this).text();
    if (!$(this).is('input')) {
      var newItem = $('<input id="taskchilditemname" type="text" class="form-control input-custom" value="' + val + '">');
      $(this).replaceWith(newItem);
      console.log(newItem);
      $(newItem).focus().focusout(function (e) {
        e.preventDefault();
        $(this).replaceWith('<div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + $(this).val() + '</div>');
      }).keypress(function (e) {
        if (e.which == 13 || e.keyCode == 13) {
          e.preventDefault();
          $(this).replaceWith('<div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + $(this).val() + '</div>');
        }
      });
    }
  });
  $(document).on('keyup', '#TaskModal #taskchilditemname', function () {
    childTaskItemId = $(this).parent().attr('id');
    childTaskItemName = $(this).val();
    editTask(null, null, null, null, null, null, null, childTaskItemId, childTaskItemName);
  });
  /* #endregion */

  $(document).on('keyup', '#TaskModal #taskdesc', function () {
    mainTaskId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
    mainTaskDesc = $(this).val();
    editTask(mainTaskId, null, mainTaskDesc);
  });

  $(document).on('change', '#TaskModal .prio input[type=radio]', function () {
    mainTaskId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
    mainTaskPriority = $(this).val();
    editTask(mainTaskId, null, null, mainTaskPriority);
  });

  $(document).on('change', '#TaskModal .deadline #deadline', function () {
    mainTaskId = $(this).parent().parent().parent().parent().parent().attr('id');
    mainTaskDeadline = $(this).val();
    editTask(mainTaskId, null, null, null, mainTaskDeadline);
  });

  function editTask() {
    var id = $('.task-header .row #pjid').val();
    mainTaskId = arguments[0];
    mainTaskName = arguments[1];
    mainTaskDesc = arguments[2];
    mainTaskPriority = arguments[3];
    mainTaskDeadline = arguments[4];
    childTaskId = arguments[5];
    childTaskName = arguments[6];
    childTaskItemId = arguments[7];
    childTaskItemName = arguments[8];

    // sửa tên task chính
    if (mainTaskId, mainTaskName) {
      $.ajax({
        type: 'POST',
        url: '/projectdetail/' + id + '/',
        data: {
          mainTaskId: mainTaskId,
          mainTaskName: mainTaskName,
          action: 'EDIT_MAIN_TASK_NAME',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text(mainTaskName);
          }
        }
      });
    }
    // sửa mô tả task chính
    else if (mainTaskId, mainTaskDesc) {
      $.ajax({
        type: 'POST',
        url: '/projectdetail/' + id + '/',
        data: {
          mainTaskId: mainTaskId,
          mainTaskDesc: mainTaskDesc,
          action: 'EDIT_MAIN_TASK_DESC',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').text(mainTaskDesc);
          }
        }
      });
    }
    // sửa ưu tiên task chính
    else if (mainTaskId, mainTaskPriority) {
      $.ajax({
        type: 'POST',
        url: '/projectdetail/' + id + '/',
        data: {
          mainTaskId: mainTaskId,
          mainTaskPriority: mainTaskPriority,
          action: 'EDIT_MAIN_TASK_PRIO',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tprio').text(mainTaskPriority);
          }
        }
      });
    }
    // sửa deadline task chính
    else if (mainTaskId, mainTaskDeadline) {
      $.ajax({
        type: 'POST',
        url: '/projectdetail/' + id + '/',
        data: {
          mainTaskId: mainTaskId,
          mainTaskDeadline: mainTaskDeadline,
          action: 'EDIT_MAIN_TASK_DEADLINE',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id = ' + mainTaskId + '] #tdeadline').text(mainTaskDeadline);
            $('.box-scroll').find('li[id = ' + mainTaskId + '] #daysleft').text(dayleft(mainTaskDeadline));
          }
        }
      });
    }
    // sửa tên task phụ
    else if (childTaskId, childTaskName) {
      $.ajax({
        type: 'POST',
        url: '/projectdetail/' + id + '/',
        data: {
          childTaskId: childTaskId,
          childTaskName: childTaskName,
          action: 'EDIT_CHILD_TASK',
        },
        success: function (response) {
          if (response.message == 'success') {
          }
        }
      });
    }
    // sửa tên task con của task phụ
    else if (childTaskItemId, childTaskItemName) {
      $.ajax({
        type: 'POST',
        url: '/projectdetail/' + id + '/',
        data: {
          childTaskItemId: childTaskItemId,
          childTaskItemName: childTaskItemName,
          action: 'EDIT_CHILD_TASK_ITEM',
        },
        success: function (response) {
          if (response.message == 'success') {

          }
        }
      });
    }
  }
  $(document).on('change', '#TaskModal .child-item input[type=checkbox]', function () {
    console.log($(this).is(':indeterminate'));
  });
  function completeChildTaskItem(taskID, isComplete) {
    var id = $('.task-header .row #pjid').val();
    $.ajax({
      type: 'POST',
      url: '/projectdetail/' + id + '/',
      data: {
        taskID: taskID,
        isComplete: isComplete,
        action: 'COMPLETE_CHILD_TASK_ITEM',
      },
      success: function (response) {
        if (response.message == 'success') {
        }
      }
    });
  }
});