$(document).ready(function () {
  const dayleft = endDate => {
    let endday = (endDate.trim().split('n')[1]).trim();
    let endDate2 = endday.split('/');
    return Math.ceil(
      (new Date(endDate2[1] + '/' + endDate2[0] + '/' + endDate2[2]) -
        new Date()) /
      (1000 * 60 * 60 * 24)
    );
  };
  if (!isTouchDevice()) {
    console.log(isTouchDevice());
    $('.task_list .box-scroll .box-item').each((index, item)=> {
      $(item).find('#btn-tdel').addClass('d-none');
    });
    $(document).on(
      {
        mouseenter: ({ currentTarget }) => {
          $('#btn-tdel', currentTarget).removeClass('d-none');
        },
        mouseleave: ({ currentTarget }) => {
          $('#btn-tdel', currentTarget).addClass('d-none');
        },
      },
      '.task_list .box-item'
    );
  } else {
    $('#TaskModal .deadline .input-group').addClass('d-none');
    $('#TaskModal .deadline input[type="date"]').removeClass('d-none');
  }
  duDatepicker('#deadline', {
    i18n: new duDatepicker.i18n.Locale('tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'), 'Thg 01_Thg 02_Thg 03_Thg 04_Thg 05_Thg 06_Thg 07_Thg 08_Thg 09_Thg 10_Thg 11_Thg 12'.split('_'), 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'), 'CN_T2_T3_T4_T5_T6_T7'.split('_'), 'CN_T2_T3_T4_T5_T6_T7'.split('_'), 1, {
      btnOk: 'ok',
      btnCancel: 'huỷ',
      btnClear: 'xoá'
    }), format: 'dd/mm/yyyy', range: true, rangeDelim: ' đến ', clearBtn: true, cancelBtn: true});


  var projectID = $('.task-header .row').attr('id');
  var projectDetailPostUrl = '/projectdetail/' + projectID + '/';
  $(document).on('show.bs.modal', '#TaskModal', ({ relatedTarget }) => {
    let btn = $(relatedTarget).parent();
    let action = $('div[data-bs-whatever]', btn).attr('data-bs-whatever');
    if (action == '@edittask') {
      let mainTaskID = $('#TaskModal .modal-content').attr('id', $(btn).attr('id'));
      $('#TaskModal #taskdesc').attr('placeholder', 'Thêm mô tả chi tiết');
      $('#TaskModal #taskdesclabel').text('Thêm mô tả chi tiết');
      let taskid = $(btn).attr('id');
      let taskname = $(btn).find('#tname').text().trim();
      let taskdesc = $(btn).find('#tdesc').text().trim();
      let taskprio = $(btn).find('#tprio').text().trim();
      let deadline = $(btn).find('#tdeadline').text().trim();
      let fileEnabled = ($(btn).find('.fileEnabled').text().trim().toLowerCase() === 'true');
      $('#TaskModal #taskname').val(taskname);
      $('#TaskModal #taskdesc').val(taskdesc);
      let newID = $('#TaskModal #IsAttachedTask').attr('id', 'IsAttachedTask' + $(mainTaskID).attr('id')).attr('name', 'IsAttachedTask' + $(mainTaskID).attr('id'));
      $(newID).parent().children('label').attr('for', 'IsAttachedTask' + $(mainTaskID).attr('id'));
      switch (fileEnabled) {
      case false:
        $('#TaskModal [id^="IsAttachedTask"]').removeClass('checkbox-custom-checked');
        $('#TaskModal [id^="IsAttachedTask"]').prop('checked',false);
        break;
      case true:
        $('#TaskModal [id^="IsAttachedTask"]').addClass('checkbox-custom-checked');
        $('#TaskModal [id^="IsAttachedTask"]').prop('checked', true);
        break;
      default:
        break;
      }
      if (taskprio) {
        $('#TaskModal .prio-sel .btn-group input').each((indexInArray, valueOfElement) => {
          if ($(valueOfElement).val() == taskprio) {
            $(valueOfElement).prop('checked', true);
          }
        });
      }
      if (deadline) {
        duDatepicker('#deadline', 'setValue',
          (deadline.trim().split('đ')[0]).trim() + ' đến ' + (deadline.trim().split('n')[1]).trim());
      } else {
        duDatepicker('#deadline', 'setValue','');
      }

      $('.child-wrap').empty();
      $.ajax({
        type: 'GET',
        data: {
          parenttaskid: taskid,
          action: 'GET_CHILD_TASK_DATA'
        },
        url: projectDetailPostUrl,
        success: response => {
          let data = JSON.parse(response);
          console.log(data);
          if (data.length) {
            $.each(data, function (indexInArray, valueOfElement) {
              console.log(valueOfElement['fields']['fileEnabled']);
              $('.child-wrap').append('<div id=' + valueOfElement['pk'] + ' class="child-task mb-4 box p-3" style="background-color: #F9FAFE;"> <div class="mb-2 d-flex align-items-center"><div class="d-flex align-items-center flex-fill flex-wrap"> <i class="fas fa-tasks me-2 flex-shrink-1"></i> <input id="taskchildname" class= "form-control w-auto input-custom fs-4 flex-shrink-1 flex-fill" style = "background-color: transparent;" name = "taskchildname" value = "' + valueOfElement['fields']['taskName'] + '" aria-describedby="FeedBackOf' + valueOfElement['pk'] + '"/> <div id="FeedBackOf' + valueOfElement['pk'] + '" class=" w-100"></div></div > <a id="delChildTasK" class="btn btn-danger btn-circle"><i class="fas fa-times"></i></a></div ><ul class="ps-0 child-item"> </ul> <div id="ChildTaskControl" class="d-flex"><div id="addChildTaskItem" class="btn btn-custom me-2">Thêm mục</div><div id="addChildTaskDesc" class="btn btn-custom">Thêm mô tả</div><div class="d-flex align-items-center p-2 ms-auto"> <input id="IsAttachedChildTask' + valueOfElement['pk'] + '" type="checkbox" name="IsAttachedChildTask' + valueOfElement['pk'] + '" class="checkbox-custom me-2 ' + (valueOfElement['fields']['fileEnabled'] ? 'checkbox-custom-checked' : '') + '" ' + (valueOfElement['fields']['fileEnabled'] ? 'checked' : '') + '> <label for="IsAttachedChildTask' + valueOfElement['pk'] + '"> Yêu cầu nộp file </label> </div></div></div >');
              if (valueOfElement['fields']['taskDesc']!=null) {
                let firstElement = $('div', '.child-task[id=' + valueOfElement['pk'] + ']').first().after('<div id="ChildTaskDescWraper" class="form-floating mb-3"> <textarea class="form-control" placeholder="Mô tả" id="ChildTaskDescOf' + valueOfElement['pk']+'" style="height: 100px"></textarea> <label class="" id="ChildTaskDescLabel" for="ChildTaskDesc">Mô tả</label> </div>');
                $(firstElement).parent().find('textarea').val(valueOfElement['fields']['taskDesc']);
                $(firstElement).parent().find('#addChildTaskDesc').text('Xoá mô tả').attr('id', 'delChildTaskDesc');
              }
              $.ajax({
                type: 'GET',
                data: {
                  parenttaskitemid: valueOfElement['pk'],
                  action: 'GET_CHILD_TASK_ITEM_DATA'
                },
                url: projectDetailPostUrl,
                success: response => {
                  data = JSON.parse(response);
                  if (data.length) {
                    $.each(data, function (indexInArray, valueOfChildElement) {
                      if (valueOfChildElement['fields']['parentTask'] == valueOfElement['pk']) {
                        $('.child-wrap .child-task[id=' + valueOfElement['pk'] + '] .child-item').append('<li id="' + valueOfChildElement['pk'] + '"class="box input-group mb-3 d-flex align-items-center scale-hover p-1"><div id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfChildElement['fields']['taskName'] + '</div> <div id="delChildTasKItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
                      }
                    });
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
    let currentTask = $(this).parent();
    let currentTaskID = $(currentTask).attr('id');
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        currentTaskID: currentTaskID,
        action: 'DELETE_MAIN_TASK',
      },
      success: response => {
        let deltask_instance = JSON.parse(response);
        let message = deltask_instance['message'];
        let pname = deltask_instance['pname'];
        if (!pname) {
          pname = 'Tên đề tài chưa cập nhật';
        }
        if (message === 'success') {
          console.log($('.task_list .box-scroll').children().length);
          // 1 task duy nhất
          if ($('.task_list .box-scroll').children().length == 1) {
            $(currentTask).removeClass('new-item').addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
              $(currentTask).remove();
              $('.task_list div.d-none').removeClass('d-none');
            });
          
            $('.task-header .row').html('<div class="col-12"><input id="pname" class="form-control input-custom input-no-focus fs-3 title" name="pname" value="' + pname + '" /></div>');
          } else {
            $(currentTask).removeClass('new-item').addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
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
  $(document).on('click', '#pname', (e) => {
    if (!$(e.currentTarget).val() || $(e.currentTarget).val().toLowerCase() == 'tên đồ án chưa cập nhật') {
      $(e.currentTarget).select();
      $(e.currentTarget).val('');
      $(e.currentTarget).attr('placeholder', 'Nhập tên đồ án');
    }
    $(e.currentTarget).focusout((e) => {
      e.preventDefault();
      if (!$(e.currentTarget).val()) {
        $(e.currentTarget).val('Tên đồ án chưa cập nhật');
      } else {
        let newPName = $(e.currentTarget).val().toUpperCase();
        $.ajax({
          type: 'POST',
          url: projectDetailPostUrl,
          data: {
            newPName: newPName,
            action: 'EDIT_PROJECT_NAME',
          },
          success: response => {
            console.log(response.message);
          },
        });
      }
    });
  });
  $(document).on('keyup', '#pname', function (e) {
    e.preventDefault();
    let newPName = $(this).val();
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        newPName: newPName,
        action: 'EDIT_PROJECT_NAME',
      },
      success: response => {
        console.log(response.message);
      },
    });
  });

  // thêm task chính
  $(document).on('click', '#AddNewMainTask', function () {
    function newMainTaskHTML(toggleModal,viewAsTitle, titleName='') {
      return '<li class="box box-item position-relative scale-hover mt-4 mx-xxl-5 mx-xl-0 mx-sm-3 mx-4"> <a id="btn-tdel" class="d-none btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"> <i class="fas fa-times"></i> </a> <div class="row p-xxl-2 p-3"' + (toggleModal ? 'data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"' : '') + '> <div class="col-sm-2 d-flex d-none"> <div id="tprio" class="box box-label w-100 h-100 p-2"> </div></div><div class="col-sm-10 d-flex align-items-center"> <div class="line mx-xxl-3 mx-xl-2 mx-lg-2 mx-md-2 d-none"></div><div class="task-Content flex-fill ps-xxl-1 ps-3 mt-sm-0 mt-3"> ' + (viewAsTitle ? '<h1 id="tname">' + titleName + '</h1>' : '<input id="tname" class="form-control input-custom input-no-focus fs-3" name="tname" placeholder="Nhập tên công việc">') + '<p id="tdesc" class="d-none"></p><div class="row assignment-info"> <div class="col-md-6"> <div id="tdeadline" class="todoDate"></div></div><div id="daysleft" class="col-md-6"> </div></div></div></div></div></li>';
    }
    if ($('.task_list .box-scroll').children().length) {
      $('.box-scroll').prepend(newMainTaskHTML(false, false));
      $('#tname').focus().focusout(() => {
        if (!$(this).val()) {
          $(this).parents('li.box-item').remove();
        } else {
          editTask('null', this);
          $(this).parents('li.box-item').replaceWith(newMainTaskHTML(true, true, $(this).val()));
        } 
      });
    } else {
      $('.task_list .emptylist').parent().addClass('d-none').after('<ul class="box-scroll list-unstyled py-0 mb-0 p-xxl-0 p-md-4 p-3"></ul>');
      let newItem = $('.box-scroll').prepend(newMainTaskHTML(false, false));
      $('.task-header .row .col-12').removeClass('col-12').addClass('col-lg-10').after('<div class="col-lg-2 mt-lg-0 mt-md-3 mt-sm-2 mt-1 d-flex align-items-center justify-content-center"><div id="AddNewMainTask" class="btn btn-custom"><span>+</span>Thêm công việc</div></div>');
      $('#tname').focus().focusout(() => {
        if (!$(this).val()) {
          $('.task_list .emptylist').parent().removeClass('d-none');
          $(this).parents('.box-scroll').remove();
          $('.task-header .row .col-lg-2').addClass('d-none');
          $('.task-header .row .col-lg-10').removeClass('col-lg-10').addClass('col-12');
        } else {
          let newTaskName = $(this).val();
          $(newItem).children().remove();
          $('.box-scroll').prepend(newMainTaskHTML(true, true, newTaskName));
          editTask('null', $('.box-scroll #tname'));
        }
      });
      $('#tname').keypress(function (e) {
        if (e.which == 13 || e.keyCode == 13) {
          let newTaskName = $(this).val();
          $(this).parents('li').remove();
          console.log();
          $('.box-scroll').prepend(newMainTaskHTML(true, true, newTaskName));
        }
      });
    }
  });

  // thêm task child trong modal task chính
  $(document).on('click', '#addChildTask', function () {
    let mainTaskId = $(this).parent().parent().parent().attr('id');
    let new_child_task = $('.child-wrap').append('<div class="child-task mb-4 box p-3" style="background-color: #F9FAFE;"> <div class="mb-2 d-flex align-items-center"> <div class="d-flex align-items-center flex-fill flex-wrap"> <i class="fas fa-tasks me-2 flex-shrink-1"></i> <input id="taskchildname" class="form-control w-auto input-custom fs-4 flex-shrink-1 flex-fill" style="background-color: transparent;" name="taskchildname" aria-describedby="NewChildTask"/><div id="NewChildTask" class="w-100"></div></div><a id="delChildTasK" class="btn btn-danger btn-circle"><i class="fas fa-times"></i></a></div><ul class="ps-0 child-item"> </ul> <div id="ChildTaskControl" class="d-flex "><div id="addChildTaskItem" class="btn btn-custom me-2">Thêm mục</div><div id="addChildTaskDesc" class="btn btn-custom">Thêm mô tả</div><div class="d-flex align-items-center p-2 ms-auto"> <input id="IsAttachedChildTask" type="checkbox" name="IsAttachedChildTask" class="checkbox-custom me-2"> <label for="IsAttachedChildTask"> Yêu cầu nộp file </label> </div></div></div>');
    editTask(mainTaskId, null, null, null, null, 'null', $(new_child_task).children().last().find('#taskchildname'));
    $(new_child_task).children().last().find('#taskchildname').focus();
  });

  // thêm task item vào task child trong modal task chính
  $(document).on('click', '#addChildTaskItem', function () {
    let new_child_task_item = $(this).parent().parent().find('.child-item').append('<li class="box input-group mb-3 d-flex align-items-center scale-hover p-1"> </div><input id="taskchilditemname" type="text" class="form-control input-custom" > <div id="delChildTasKItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
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
    let mainTaskId = $(this).parent().parent().attr('id');
    editTask(mainTaskId, this);
  });

  // Thêm hoặc sửa tên task child
  $(document).on('keyup', '#TaskModal #taskchildname', function () {
    let mainTaskId = $('#TaskModal .modal-dialog .modal-content').attr('id');
    let childTaskId = $(this).parent().parent().parent().attr('id') ? $(this).parent().parent().parent().attr('id') : 'null';
    if ($(this).val()) {
      if ($(this).parent().children('#NewChildTask')) {
        $(this).removeClass('is-invalid');
        let newEl = $('#NewChildTask').attr('id', $(this).attr('aria-describedby'));
        newEl.removeClass('invalid-feedback').text('');
      }
      else {
        $(this).removeClass('is-invalid');
        $(this).parent().children('div[id^="FeedBackOf"]').removeClass('invalid-feedback').text('');
      }
      editTask(mainTaskId, null, null, null, null, childTaskId, this);
    } else {
      $(this).addClass('is-invalid');
      if ($(this).parent().children('#NewChildTask').length) {
        let newEl = $('#NewChildTask').attr('id', $(this).attr('aria-describedby'));
        $(this).parent().parent().removeClass('align-items-center');
        newEl.addClass('invalid-feedback').text('Nhập tên tác vụ!');
      } else {
        $(this).parent().parent().removeClass('align-items-center');
        $(this).parent().children('div[id^="FeedBackOf"]').addClass('invalid-feedback').text('Nhập tên tác vụ!');
      } 
    }
  });
  $(document).on('focusout', '#taskchildname', (e) => {
    if (!e.currentTarget.value) {
      //nếu là task mới được thêm thì xoá khi ko có value
      if ($(e.currentTarget).attr('aria-describedby') == 'NewChildTask') {
        $(e.currentTarget).parent().children('div[id^="FeedBackOf"]').attr('id');
        // $(e.currentTarget).parent().parent().parent().remove();

      } //ngược lại là task đã có sẽ valid khi value trống
      else {
        let invalidDiv = $(e.currentTarget).parent().children('div[id^="FeedBackOf"]').attr('id');
        $(e.currentTarget).addClass('is-invalid');
        $(e.currentTarget).attr('aria-describedby', invalidDiv);
        $(e.currentTarget).parent().children('div[id^="FeedBackOf"]').addClass('invalid-feedback').text('Nhập tên tác vụ!');
      }
    }
  });
  /* #region  Xử lý task item */
  // nhấn vào tên task item để nhập tên task item 
  $(document).on('click', '#taskchilditemname', function () {
    let val = $(this).text();
    if (!$(this).is('input')) {
      let newItem = $('<input id="taskchilditemname" type="text" class="form-control input-custom" value="' + val + '">');
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
    let childTaskItemId = $(this).parent().attr('id') ? $(this).parent().attr('id') : 'null';
    let childTaskId = $(this).parent().parent().parent().attr('id');
    editTask(null, null, null, null, null, childTaskId, null, childTaskItemId, this);
  });
  /* #endregion */

  // sửa mô tả của task chính trong modal
  $(document).on('keyup', '#TaskModal #taskdesc', function () {
    let mainTaskId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
    let mainTaskDesc = $(this).val();
    if (!$(this).val()) {
      mainTaskDesc = 'null';
    }
    editTask(mainTaskId, null, mainTaskDesc);
  });

  // chọn ưu tiên task chính
  $(document).on('change', '#TaskModal .prio input[type=radio]', function () {
    let mainTaskId = $(this).parent().parent().parent().parent().parent().parent().attr('id');
    let mainTaskPriority = $(this).val();
    editTask(mainTaskId, null, null, mainTaskPriority);
  });

  // chọn thời hạn task chính
  $('#deadline').on('datechanged', () => {
    let mainTaskId = $(this).parents('.modal-content').attr('id');
    let mainTaskDeadline = $(this).val() ? $(this).val() : 'null';
    editTask(mainTaskId, null, null, null, mainTaskDeadline);
  });


  function editTask() {
    let mainTaskId = arguments[0];
    let mainTaskName = arguments[1];
    let mainTaskDesc = arguments[2];
    let mainTaskPriority = arguments[3];
    let mainTaskDeadline = arguments[4];
    let childTaskId = arguments[5];
    let childTaskName = arguments[6];
    let childTaskItemId = arguments[7];
    let childTaskItemName = arguments[8];

    // sửa tên task chính
    if (mainTaskId && mainTaskName) {
      let mainTaskNameText;
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
        success: response => {
          let mainTask_instance = JSON.parse(response);
          if (mainTask_instance['message'] == 'A') {
            $('.box-scroll li').first().attr('id', mainTask_instance['mainTaskId']);
          }
          if (mainTask_instance['message'] == 'E') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text(mainTaskNameText);
          }
        }
      });
    }
    // sửa mô tả task chính
    else if (mainTaskId && mainTaskDesc) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskDesc: mainTaskDesc,
          action: 'EDIT_MAIN_TASK_DESC',
        },
        success: response => {
          if (response.message == 'success') {
            $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').text(mainTaskDesc);
            if ($('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').hasClass('d-none')) {
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').removeClass('d-none');
            }
            if ($('.box-scroll').find('li[id = ' + mainTaskId + '] #tdeadline').text()) {
              let oldTName = $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text();
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').replaceWith('<h3 id="tname">' + oldTName + '</h3 >');
            }
            if (mainTaskDesc == 'null') {
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tdesc').addClass('d-none');
            }
          }
        }
      });
    }
    // sửa ưu tiên task chính
    else if (mainTaskId && mainTaskPriority) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskPriority: mainTaskPriority,
          action: 'EDIT_MAIN_TASK_PRIO',
        },
        success: response => {
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
    else if (mainTaskId && mainTaskDeadline) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          mainTaskDeadline: mainTaskDeadline,
          action: 'EDIT_MAIN_TASK_DEADLINE',
        },
        success: response => {
          if (response.message == 'success') {
            if (mainTaskDeadline !='null') {
              $('.box-scroll').find('li[id = ' + mainTaskId + '] #tdeadline').text(mainTaskDeadline);
              $('.box-scroll').find('li[id = ' + mainTaskId + '] #daysleft').text(dayleft(mainTaskDeadline));
            } else {
              $('.box-scroll').find('li[id = ' + mainTaskId + '] #tdeadline').text('');
              $('.box-scroll').find('li[id = ' + mainTaskId + '] #daysleft').text('');
            }
            if ($('.box-scroll').find('li[id = ' + mainTaskId + '] #tdesc').text()) {
              let oldTName = $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').text();
              $('.box-scroll').find('li[id=' + mainTaskId + '] #tname').replaceWith('<h3 id="tname">' + oldTName + '</h3 >');
            }
          }
        }
      });
    }
    // Thêm hoặc sửa task child
    else if (mainTaskId && childTaskId && childTaskName) {
      console.log($(childTaskName).val());
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          mainTaskId: mainTaskId,
          childTaskId: childTaskId,
          childTaskName: $(childTaskName).val(),
          action: 'ADD_EDIT_CHILD_TASK',
        },
        success: response => {
          let childtask_instance = JSON.parse(response);
          if (childtask_instance['message'] == 'A') {
            $(childTaskName).parent().parent().parent().attr('id', childtask_instance['childtaskid']);
            $(childTaskName).attr('aria-describedby', 'FeedBackOf' + childtask_instance['childtaskid']);
            $(childTaskName).parent().children('#NewChildTask').attr('id', 'FeedBackOf' + childtask_instance['childtaskid']);
            $(childTaskName).parent().parent().parent().children('#ChildTaskControl').find('input').attr('id', 'IsAttachedChildTask' + childtask_instance['childtaskid']);
            $(childTaskName).parent().parent().parent().children('#ChildTaskControl').find('label').attr('for', 'IsAttachedChildTask' + childtask_instance['childtaskid']);
          }
          if (childtask_instance['message'] == 'E') {
            console.log('edit');
          }
        }, error: function (xhr, errmsg, err) {
          console.log(xhr.status + ': ' + err);

        }
      });
    }
    // Thêm hoặc sửa task item của task child
    else if (childTaskId && childTaskItemId && childTaskItemName) {
      $.ajax({
        type: 'POST',
        url: projectDetailPostUrl,
        data: {
          childTaskId: childTaskId,
          childTaskItemId: childTaskItemId,
          childTaskItemName: childTaskItemName.value,
          action: 'ADD_EDIT_CHILD_TASK_ITEM',
        },
        success: response => {
          let childtaskitem_instance = JSON.parse(response);
          if (childtaskitem_instance['message'] == 'A') {
            $(childTaskItemName).parent().attr('id', childtaskitem_instance['childTaskItemId']);
          }
          if (childtaskitem_instance['message'] == 'E') {
            console.log('Edit');
          }
        }
      });
    }
  }

  $(document).on('click', '#delChildTasK', function () {
    let childTaskId = $(this).parents('.child-task').attr('id');
    let childTask = $(this).parents('.child-task');
    $(childTask).addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
      $(childTask).remove();
      deleteTaskChildAndItem(childTaskId);
    });
  });
  $(document).on('click', '#delChildTasKItem', function () {
    let childTaskItemId = $(this).parent().attr('id');
    let childTaskItem = $(this).parent();
    $(childTaskItem).addClass('removed-item').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
      $(childTaskItem).remove();
      deleteTaskChildAndItem(childTaskItemId);
    });
  });
  function deleteTaskChildAndItem(taskID){
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        taskID: taskID,
        action: 'DELETE_TASK_CHILD_AND_ITEM'
      },
      success: response => {
        let deleteTaskChildAndItemContext = JSON.parse(response);
        console.log(deleteTaskChildAndItemContext['message']);
      }
    });
  }

  $(document).on('click', '[id^=IsAttachedTask]', (e) => {
    $(e.currentTarget).toggleClass('checkbox-custom-checked');
    AllowAttached($(e.currentTarget).parents('.modal-content').attr('id').match(/\d+/)[0], $(e.currentTarget).prop('checked'));
  });
  $(document).on('click', '[id^=IsAttachedChildTask]', (e) => {
    $(e.currentTarget).toggleClass('checkbox-custom-checked');
    AllowAttached($(e.currentTarget).attr('id').match(/\d+/)[0], $(e.currentTarget).prop('checked'));
  });
  $(document).on('click', '#addChildTaskDesc', (e) => {
    let thisChildTask = $(e.currentTarget).parent().parent();
    $('div', thisChildTask).first().after('<div id="ChildTaskDescWraper" class="form-floating mb-3 animate__animated animate__flipInX"> <textarea class="form-control" placeholder="Mô tả" id="ChildTaskDescOf' + $(thisChildTask).attr('id') + '" style="height: 100px"></textarea> <label class="" id="ChildTaskDescLabel" for="ChildTaskDescOf' + $(thisChildTask).attr('id') +'">Mô tả</label> </div>');
    setTimeout(()=>{
      $('#ChildTaskDescWraper').removeClass('animate__animated animate__flipInX');
    }, 500);
    $(e.currentTarget).text('Xoá mô tả').attr('id', 'delChildTaskDesc');
    $('#ChildTaskDescOf' + $(thisChildTask).attr('id')).focus();
    // .focusout((e) => {
    //   if (!$(e.currentTarget).val()) {
    //     console.log('remove on focusout child task desc');
    //     $('#ChildTaskDescWraper').addClass('animate__animated animate__flipOutX');
    //     $(document).on('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', '#ChildTaskDescWraper', (e) => {
    //       $(e.currentTarget).remove();
    //     });
    //     $(e.currentTarget).parent().parent().
    //       children('#ChildTaskControl #delChildTaskDesc').text('Thêm mô tả').attr('id', 'addChildTaskDesc');
    //   }
    // });
    console.log($(e.currentTarget).prop('id'));
    AddChildTaskDesc($(thisChildTask).attr('id'), '');
  });

  $(document).on('keyup', '[id^=ChildTaskDescOf]', (e) => {
    let thisChildTaskID = $(e.currentTarget).parent().parent().attr('id');
    AddChildTaskDesc(thisChildTaskID, $(e.currentTarget).val());
  });

  $(document).on('click', '#delChildTaskDesc', (e) => {
    $(e.currentTarget).parent().parent().children('#ChildTaskDescWraper').addClass('animate__animated animate__flipOutX').one('webkitAnimationEnd oAnimationEnd msAnimationEnd animationend', (e) => {
      DelChildTaskDesc($(e.target).parent().attr('id'));
      $(e.target).remove();
    });
    $(e.currentTarget).text('Thêm mô tả').attr('id', 'addChildTaskDesc');
  });

  const AddChildTaskDesc = (ChildTaskID, ChildTaskDecs) => {
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        ChildTaskID: ChildTaskID,
        ChildTaskDecs: ChildTaskDecs,
        action: 'ADD_CHILD_TASK_DESC'
      },
      success: (response) => {
        response = JSON.parse(response);
        console.log(response.message);
      }
    });
  };

  const DelChildTaskDesc = ChildTaskID => {
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        ChildTaskID: ChildTaskID,
        action: 'DEL_CHILD_TASK_DESC'
      },
      success: (response) => {
        response = JSON.parse(response);
        console.log(response.message);
      }
    });
  };

  const AllowAttached = (taskID,isChecked) => {
    $.ajax({
      type: 'POST',
      url: projectDetailPostUrl,
      data: {
        taskID: taskID,
        isChecked: isChecked,
        action: 'SET_ALLOW_ATTACHED'
      },
      success: function (response) {
        response = JSON.parse(response);
        console.log(response.message);
      }
    });
  };
});