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
      customRangeLabel: 'Tuỳ chọn',
      daysOfWeek: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      firstDay: 1,
    },
    drops: "up",
    linkedCalendars: false,
    autoApply: true,
  });

  var projectID = $('.task-header .row').attr('id');
  var projectDetailPostUrl = '/projectdetail/' + projectID + '/'
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
      if (deadline) {
        $('#TaskModal .deadline #deadline').data('daterangepicker').setStartDate((deadline.trim().split('đ')[0]).trim());
        $('#TaskModal .deadline #deadline').data('daterangepicker').setEndDate((deadline.trim().split('n')[1]).trim());
      } else {
        $('#TaskModal .deadline #deadline').val('');
      }

      $('.child-wrap').empty();
      $.ajax({
        type: "GET",
        data: {
          parenttaskid: taskid,
          action: 'GET_CHILD_TASK_DATA'
        },
        url: projectDetailPostUrl,
        success: function (response) {
          data = JSON.parse(response);
          if (data.length) {
            $.each(data, function (indexInArray, valueOfElement) {
              $('.child-wrap').append('<div id=' + valueOfElement["pk"] + ' class="child-task mb-4 box-l p-3" style="background-color: #F9FAFE;"> <div class="mb-2 d-flex"> <div class="d-flex align-items-center flex-grow-1"> <i class="fas fa-tasks me-2"></i> <input id="taskchildname" class="form-control input-custom fs-4" name="taskchildname" value="' + valueOfElement["fields"]["taskName"] + '"/> </div><a id="delChildTasK" class="btn btn-danger btn-circle"><i class="fas fa-times"></i></a></div><ul class="ps-0 child-item"> </ul> <div id="addChildTaskItem" class="btn btn-primary">thêm mục</div></div>');
              $.ajax({
                type: "GET",
                data: {
                  parenttaskitemid: valueOfElement["pk"],
                  action: 'GET_CHILD_TASK_ITEM_DATA'
                },
                url: projectDetailPostUrl,
                success: function (response) {
                  data = JSON.parse(response);
                  if (data.length) {
                    console.log(data);
                    $.each(data, function (indexInArray, valueOfChildElement) {
                      if (valueOfChildElement["fields"]["parentTask"] == valueOfElement["pk"]) {
                        done = valueOfChildElement["fields"]["complete"];
                        a = $('.child-wrap .child-task[id=' + valueOfElement["pk"] + '] .child-item').append('<li id="' + valueOfChildElement["pk"] + '"class="box input-group mb-3 d-flex align-items-center scale-hover p-1"> <div class="d-flex align-items-center p-2"> <input class="form-check-input mt-0" type="checkbox" ' + (done ? "checked" : "") + ' > </div><div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfChildElement["fields"]["taskName"] + '</div> <div id="delChildTasKItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
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

  // xoá task chính
  $(document).on('click', '#btn-tdel', function (e) {
    e.stopPropagation(); //ngăn modal hiện
    e.preventDefault();
    currentTask = $(this).parent();
    currentTaskID = $(currentTask).attr('id');
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        currentTaskID: currentTaskID,
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
          // 1 task duy nhất
          if ($('.task_list .box-scroll').children().length == 1) {
            $(currentTask).removeClass('new-item').addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
              $(currentTask).remove();
              $('.task_list div.d-none').removeClass('d-none')
            });
          
            $('.task-header .row').html('<div class="col-12"><input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '" /></div>');
          } else {
            $(currentTask).removeClass('new-item').addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
              $(currentTask).remove();
            });
            $('.task-header .row').html('<div class="col-lg-10"> <input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '" /></div><div class="col-lg-2 mt-lg-0 mt-md-3 mt-sm-2 mt-1 d-flex align-items-center justify-content-center"><div id="AddNewMainTask" class="btn btn-custom"> <span>+</span>Thêm công việc</div></div>');
          }

        }
      },
      error: function (response) {
        console.log(response['responseJSON']['error']);
      },
    });
  });

  // chỉnh sửa tên project
  $(document).on('click', '#pname', function () {
    $(this).select();
    $(this).val('')
    $(this).attr('placeholder', 'Nhập tên đồ án');
    $(this).focusout(function (e) { 
      e.preventDefault();
      if (!$(this).val()) {
        $(this).val('Tên đồ án chưa cập nhật')
      } else {
        var newPName = $(this).val();
        $.ajax({
          type: 'POST',
          url: projectDetailPostUrl,
          data: {
            newPName: newPName,
            action: 'EDIT_PROJECT_NAME',
          },
          success: function (response) {
            console.log(response.message);
          },
        });
      }
    });
  });
  $(document).on('keyup', '#pname', function (e) {
    e.preventDefault();
    tempName = $(this).val();
    var newPName = $(this).val();
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        newPName: newPName,
        action: 'EDIT_PROJECT_NAME',
      },
      success: function (response) {
        console.log(response.message);
      },
    });
  });

  // thêm task chính
  $(document).on('click', '#AddNewMainTask', function () {
    function newMainTaskHTML(toggleModal,viewAsTitle, titleName='') {
      return '<li class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4"> <a id="btn-tdel" class="d-none btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a> <div class="row p-xxl-2 p-3"' + (toggleModal ? 'data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"' : '') + '> <div class="col-sm-2 d-flex d-none"> <div id="tprio" class="box box-label w-100 h-100 p-2"> </div></div><div class="col-sm-10 d-flex align-items-center"> <div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2 d-none"></div><div class="task-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"> ' + (viewAsTitle ? '<h1 id="tname">' + titleName +'</h1>' : '<input id="tname" class="form-control input-custom input-no-focus fs-3" name="tname" placeholder="Nhập tên công việc">') + '<p id="tdesc" class="d-none"></p><div class="row assignment-info"> <div class="col-md-6"> <div id="tdeadline" class="todoDate"></div></div><div id="daysleft" class="col-md-6"> </div></div></div></div></div></li>'
    }
    if ($('.task_list .box-scroll').children().length) {
      var newItem =  $('.box-scroll').prepend(newMainTaskHTML(false, false));
      $('#tname').focus().focusout(function (e) {
        if (!$(this).val()) {
          $(this).parents('li.box-item').remove();
        } else {
          editTask(null, this)
          $(this).parents('li.box-item').replaceWith(newMainTaskHTML(true, true, $(this).val()))
        } 
      });
    } else {
      $('.task_list .emptylist').parent().addClass('d-none').after('<ul class="box-scroll list-unstyled py-0 mb-0 p-xxl-0 p-md-4 p-3"></ul>');
      var newItem = $('.box-scroll').prepend(newMainTaskHTML(false, false));
      $('.task-header .row .col-12').removeClass('col-12').addClass('col-lg-10').after('<div class="col-lg-2 mt-lg-0 mt-md-3 mt-sm-2 mt-1 d-flex align-items-center justify-content-center"><div id="AddNewMainTask" class="btn btn-custom"><span>+</span>Thêm công việc</div></div>');
      $('#tname').focus().focusout(function (e) {
        if (!$(this).val()) {
          $('.task_list .emptylist').parent().removeClass('d-none');
          $(this).parents('.box-scroll').remove();
          $('.task-header .row .col-lg-2').addClass('d-none')
          $('.task-header .row .col-lg-10').removeClass('col-lg-10').addClass('col-12')
        } else {
          newTaskName = $(this).val();
          $(newItem).children().remove();
          $('.box-scroll').prepend(newMainTaskHTML(true, true, newTaskName));
          editTask(null, $('.box-scroll #tname'))
        }
      });
      $('#tname').keypress(function (e) {
        if (e.which == 13 || e.keyCode == 13) {
          newTaskName = $(this).val();
          $(this).parents('li').remove()
          console.log();
          $('.box-scroll').prepend(newMainTaskHTML(true, true, newTaskName));
        }
      });
    }
  });

  // thêm task child trong modal task chính
  $(document).on('click', '#addChildTask', function () {
    var new_child_task = $('.child-wrap').append('<div class="child-task mb-4 box-l p-3" style="background-color: #F9FAFE;"> <div class="mb-2 d-flex"> <div class="flex-grow-1 d-flex align-items-center"> <i class="fas fa-tasks me-2"></i> <input id="taskchildname" class="form-control input-custom fs-4" name="taskchildname"/> </div><a id="delChildTasK" class="btn btn-danger btn-circle"><i class="fas fa-times"></i></a></div><ul class="ps-0 child-item"> </ul> <div id="addChildTaskItem" class="btn btn-primary">thêm mục</div></div>');
    var mainTaskId = $('#TaskModal .modal-dialog .modal-content').attr('id');
    $(new_child_task).children().last().find('#taskchildname').focus();
    $(new_child_task).children().last().find('#taskchildname').focusout(function (e) {
      e.preventDefault();
      if (!$(this).val()) {
        $(this).parent().parent().parent().remove();
      }
    });
  });

  // thêm task item vào task child trong modal task chính
  $(document).on('click', "#addChildTaskItem", function () {
    var new_child_task_item = $(this).parent().find('.child-item').append('<li class="box input-group mb-3 d-flex align-items-center scale-hover p-1"> <div class="d-flex align-items-center p-2"> <input class="form-check-input mt-0" type="checkbox"> </div><input id="taskchilditemname" type="text" class="form-control input-custom" > <div id="delChildTasKItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
    $(new_child_task_item).children().last().find('input[type=text]').focus();

    $(new_child_task_item).children().last().find('input[type=text]').focusout(function (e) {
      e.preventDefault();
      if (!$(this).val()) {
        $(this).parent().remove();
      }
      $(this).replaceWith('<div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + $(this).val() + '</div>');
    }).keypress(function (e) {
      if (e.which == 13 || e.keyCode == 13) {
        e.preventDefault();
        $(this).replaceWith('<div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + $(this).val() + '</div>');
      }
    });
  });

  // sửa tên task chính trong modal
  $(document).on('keyup', '#TaskModal #taskname', function () {
    mainTaskId = $(this).parent().parent().attr('id');
    editTask(mainTaskId, this);
  });

  // Thêm hoặc sửa tên task child
  $(document).on('keyup', '#TaskModal #taskchildname', function () {
    mainTaskId = $('#TaskModal .modal-dialog .modal-content').attr('id');
    childTaskId = $(this).parent().parent().parent().attr('id');
    childTaskName = $(this).val();
    console.log(mainTaskId, childTaskId, this);
    editTask(mainTaskId, null, null, null, null, childTaskId, this);
  });

  /* #region  Xử lý task item */
  // nhấn vào tên task item để nhập tên task item 
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

  // lưu lại khi sửa tên task item của task child
  $(document).on('keyup', '#TaskModal #taskchilditemname', function () {
    childTaskItemId = $(this).parent().attr('id');
    childTaskItemName = $(this).val();
    childTaskId = $(this).parent().parent().parent().attr('id');
    editTask(null, null, null, null, null, childTaskId, null, childTaskItemId, this);
  });
  /* #endregion */

  // sửa mô tả của task chính trong modal
  $(document).on('keyup', '#TaskModal #taskdesc', function () {
    mainTaskId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
    mainTaskDesc = $(this).val();
    if (!$(this).val()) {
      mainTaskDesc = "null";
    }
    editTask(mainTaskId, null, mainTaskDesc);
  });

  // chọn ưu tiên task chính
  $(document).on('change', '#TaskModal .prio input[type=radio]', function () {
    mainTaskId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
    mainTaskPriority = $(this).val();
    editTask(mainTaskId, null, null, mainTaskPriority);
  });

  // chọn thời hạn task chính
  $(document).on('change', '#TaskModal .deadline #deadline', function () {
    mainTaskId = $(this).parent().parent().parent().parent().parent().attr('id');
    mainTaskDeadline = $(this).val();
    editTask(mainTaskId, null, null, null, mainTaskDeadline);
  });


  function editTask() {
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
      var mainTaskNameText
      if (!mainTaskId) mainTaskId = 'null';
      if ($(mainTaskName).is('h1')) {
        mainTaskNameText = $(mainTaskName).text();
      } else if ($(mainTaskName).is('input')){
        mainTaskNameText = mainTaskName.value;
      } else if (typeof(mainTaskName) == 'string') {
        mainTaskNameText = mainTaskName;
      }
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskName: mainTaskNameText,
          action: 'ADD_EDIT_MAIN_TASK_NAME',
        },
        success: function (response) {
          var mainTask_instance = JSON.parse(response);
          if (mainTask_instance['message'] == 'A') {
            $('.box-scroll li').first().attr('id', mainTask_instance['mainTaskId'])
          }
          if (mainTask_instance['message'] == 'E') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text(mainTaskNameText);
          }
        }
      });
    }
    // sửa mô tả task chính
    else if (mainTaskId, mainTaskDesc) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskDesc: mainTaskDesc,
          action: 'EDIT_MAIN_TASK_DESC',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').text(mainTaskDesc);
            if ($('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').hasClass('d-none')) {
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').removeClass('d-none');
            }
            if ($('.box-scroll').find('li[id = ' + mainTaskId + '] #tdeadline').text()) {
              var oldTName = $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text();
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').replaceWith('<h3 id="tname">' + oldTName + '</h3 >');
            }
            if (mainTaskDesc == "null") {
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').addClass("d-none");
            }
          }
        }
      });
    }
    // sửa ưu tiên task chính
    else if (mainTaskId, mainTaskPriority) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskPriority: mainTaskPriority,
          action: 'EDIT_MAIN_TASK_PRIO',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tprio').text(mainTaskPriority);
            if ($('.box-scroll').find('li[id=' + mainTaskId + '] #tprio').parent().hasClass('d-none')) {
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tprio').parent().removeClass('d-none');
              $('.box-scroll').find('li[id=' + mainTaskId + '] .line').removeClass('d-none');
            }
          }
        }
      });
    }
    // sửa deadline task chính
    else if (mainTaskId, mainTaskDeadline) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskDeadline: mainTaskDeadline,
          action: 'EDIT_MAIN_TASK_DEADLINE',
        },
        success: function (response) {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id = ' + mainTaskId + '] #tdeadline').text(mainTaskDeadline);
            $('.box-scroll').find('li[id = ' + mainTaskId + '] #daysleft').text(dayleft(mainTaskDeadline));

            if ($('.box-scroll').find('li[id = ' + mainTaskId + '] #tdesc').text()) {
              var oldTName = $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text();
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').replaceWith('<h3 id="tname">' + oldTName + '</h3 >');
            }
          }
        }
      });
    }
    // Thêm hoặc sửa task child
    else if (mainTaskId, childTaskId, childTaskName) {
      if (!childTaskId) childTaskId = 'null';
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          childTaskId: childTaskId,
          childTaskName: childTaskName.value,
          action: 'ADD_EDIT_CHILD_TASK',
        },
        success: function (response) {
          var childtask_instance = JSON.parse(response);
          if (childtask_instance['message'] == 'A') {
            $(childTaskName).parent().parent().parent().attr('id', childtask_instance['childtaskid']);
          }
          if (childtask_instance['message'] == 'E') {

          }
        }
      });
    }
    // Thêm hoặc sửa task item của task child
    else if (childTaskId, childTaskItemId, childTaskItemName) {
      if (!childTaskItemId) childTaskItemId = 'null';
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          childTaskId: childTaskId,
          childTaskItemId: childTaskItemId,
          childTaskItemName: childTaskItemName.value,
          action: 'ADD_EDIT_CHILD_TASK_ITEM',
        },
        success: function (response) {
          var childtaskitem_instance = JSON.parse(response);
          if (childtaskitem_instance['message'] == 'A') {
            $(childTaskItemName).parent().attr('id', childtaskitem_instance['childTaskItemId']);
          }
          if (childtaskitem_instance['message'] == 'E') {
          }
        }
      });
    }
  }

  $(document).on('click', '#delChildTasK', function () {
    let childTaskId = $(this).parents('.child-task').attr('id');
    let childTask = $(this).parents('.child-task');
    $(childTask).addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
      $(childTask).remove();
      deleteTaskChildAndItem(childTaskId);
    });
  });
  $(document).on('click', '#delChildTasKItem', function () {
    let childTaskItemId = $(this).parent().attr('id');
    let childTaskItem = $(this).parent();
    $(childTaskItem).addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
      $(childTaskItem).remove();
      deleteTaskChildAndItem(childTaskItemId)
    });
  });
  function deleteTaskChildAndItem(taskID){
    $.ajax({
      type: "POST",
      url: projectDetailPostUrl,
      data: {
        taskID: taskID,
        action: 'DELETE_TASK_CHILD_AND_ITEM'
      },
      success: function (response) {
        let deleteTaskChildAndItemContext = JSON.parse(response);
        console.log(deleteTaskChildAndItemContext['message'])
      }
    });
  }

  $(document).on('click', '#TaskModal .child-item input[type=checkbox]', function () {

    return false;
  });
  function completeChildTaskItem(taskID, isComplete) {
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
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