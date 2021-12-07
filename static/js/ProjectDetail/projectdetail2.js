$.extend({
  replaceTag: function (element, tagName, withDataAndEvents, deepWithDataAndEvents) {
    var newTag = $("<" + tagName + ">")[0];
    // From [Stackoverflow: Copy all Attributes](http://stackoverflow.com/a/6753486/2096729)
    $.each(element.attributes, function () {
      $(newTag).attr(this.name, this.value);
    });
    $(element).children().clone(withDataAndEvents, deepWithDataAndEvents).appendTo(newTag);
    return newTag;
  }
});
$.fn.extend({
  replaceTag: function (tagName, withDataAndEvents, deepWithDataAndEvents) {
    // Use map to reconstruct the selector with newly created elements
    return this.map(function () {
      return jQuery.replaceTag(this, tagName, withDataAndEvents, deepWithDataAndEvents);
    });
  }
});
$(() => {
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
    $('ul>li>.btn-circle').addClass('d-none');
    $(document).on(
      {
        mouseenter: ({ currentTarget }) => {
          $('.btn-circle', currentTarget).removeClass('d-none');
        },
        mouseleave: ({ currentTarget }) => {
          $('.btn-circle', currentTarget).addClass('d-none');
        },
      },
      'ul>li'
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
    }), format: 'dd/mm/yyyy', range: true, rangeDelim: ' đến ', clearBtn: true, cancelBtn: true
  });
  var projectID = $('.project-dashboard').attr('id');
  var projectDetailPostUrl = '/projectdetail/' + projectID + '/';
  const SendRequest = (type, data) => {
    return $.ajax({
      type: type,
      data: data,
      url: projectDetailPostUrl
    });
  };

  /* #region  load data task chính */
  $(document).on('show.bs.modal', '#TaskModal', e => {
    let li = $(e.relatedTarget).parent();
    let action = $('div[data-bs-toggle="modal"]', li).attr('data-bs-whatever');
    if (action == '@edittask') {
      let mainTaskModal = $('#TaskModal .modal-content').attr('id', $(li).attr('id'));
      let taskid = $(li).attr('id');
      let taskname = $(li).find('#tname').text().trim();
      let taskdesc = $(li).find('#tdesc').text().trim();
      let taskprio = $(li).find('#tprio').text().trim();
      let deadline = $(li).find('#tdeadline').text().trim();
      let fileEnabled = ($(li).find('.fileEnabled').text().trim().toLowerCase() === 'true');
      console.log(taskid, taskname, taskdesc, taskprio, deadline, fileEnabled);
      //set value vào modal
      $('#TaskModal #taskdesc').attr('placeholder', 'Thêm mô tả chi tiết');
      $('#TaskModal #taskdesclabel').text('Thêm mô tả chi tiết');
      $('#TaskModal #taskname').val(taskname);
      $('#TaskModal #taskdesc').val(taskdesc);
      let attachment = $('#TaskModal #IsAttachedTask').attr('id', 'IsAttachedTask' + $(mainTaskModal).attr('id')).attr('name', 'IsAttachedTask' + $(mainTaskModal).attr('id'));
      $(attachment).parent().children('label').attr('for', 'IsAttachedTask' + $(mainTaskModal).attr('id'));
      switch (fileEnabled) {
        case false:
          $('#TaskModal [id^="IsAttachedTask"]').removeClass('checkbox-custom-checked');
          $('#TaskModal [id^="IsAttachedTask"]').prop('checked', false);
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
        duDatepicker('#deadline', 'setValue', '');
      }
      $('.child-wrap').empty();
      let subTasks = SendRequest('GET', {
        parenttaskid: taskid,
        action: 'GET_SUB_TASK_DATA'
      });
      $.when(subTasks).done(response => {
        subTasks = JSON.parse(response);
        $.each(subTasks, function (indexInArray, valueOfElement) {
          let subTaskItems = SendRequest('GET', {
            parenttaskitemid: valueOfElement['pk'],
            action: 'GET_SUB_TASK_ITEM_DATA'
          });
          Notiflix.Block.standard('.child-wrap');
          $.when(subTaskItems).done(response => {
            $('.child-wrap').append('<div id=' + valueOfElement['pk'] + ' class="child-task mb-4 box p-3" style="background-color: #F9FAFE;"> <div class="mb-2 d-flex align-items-center"><div class="d-flex align-items-center flex-fill flex-wrap"> <i class="fas fa-tasks me-2 flex-shrink-1"></i> <input id="SubTaskName' + valueOfElement['pk'] + '" class= "form-control w-auto input-custom fs-4 flex-shrink-1 flex-fill" style = "background-color: transparent;" name = "SubTaskName" value = "' + valueOfElement['fields']['taskName'] + '" aria-describedby="FeedBackOf' + valueOfElement['pk'] + '"/> <div id="FeedBackOf' + valueOfElement['pk'] + '" class=" w-100 invalid-feedback"></div></div > <a id="DelSubTask" task-id="' + valueOfElement['pk'] + '"class="btn btn-danger btn-circle"><i class="fas fa-times"></i></a></div ><ul class="ps-0 child-item"> </ul> <div id="SubTaskControls' + valueOfElement['pk'] + '" class="d-flex"><div id="AddSubTaskItem" class="btn btn-custom me-2">Thêm mục</div><div id="AddSubTaskDesc" class="btn btn-custom">Thêm mô tả</div><div class="d-flex align-items-center p-2 ms-auto"> <input id="IsAttachedSubTask' + valueOfElement['pk'] + '" type="checkbox" name="IsAttachedSubTask' + valueOfElement['pk'] + '" class="checkbox-custom me-2 ' + (valueOfElement['fields']['fileEnabled'] ? 'checkbox-custom-checked' : '') + '" ' + (valueOfElement['fields']['fileEnabled'] ? 'checked' : '') + '> <label for="IsAttachedSubTask' + valueOfElement['pk'] + '"> Yêu cầu nộp file </label> </div></div></div >');
            if (valueOfElement['fields']['taskDesc'] != null) {
              let firstElement = $('div', '.child-task[id=' + valueOfElement['pk'] + ']').first().after('<div id="ChildTaskDescWraper" class="form-floating mb-3"> <textarea class="form-control" placeholder="Mô tả" id="SubTaskDescOf' + valueOfElement['pk'] + '" style="height: 100px"></textarea> <label class="" id="ChildTaskDescLabel" for="ChildTaskDesc">Mô tả</label> </div>');
              $(firstElement).parent().find('textarea').val(valueOfElement['fields']['taskDesc']);
              $(firstElement).parent().find('#AddSubTaskDesc').text('Xoá mô tả').attr('id', 'DelSubTaskDesc');
            }
            subTaskItems = JSON.parse(response);
            $.each(subTaskItems, function (indexInArray, valueOfChildElement) {
              if (valueOfChildElement['fields']['parentTask'] == valueOfElement['pk']) {
                $('.child-wrap .child-task[id=' + valueOfElement['pk'] + '] .child-item').append('<li id="' + valueOfChildElement['pk'] + '"class="box input-group mb-3 d-flex align-items-center scale-hover p-1"><div id="SubTaskItemName" class="fs-5 flex-grow-1 ps-2" role="button">' + valueOfChildElement['fields']['taskName'] + '</div> <div task-id= ' + valueOfChildElement['pk'] + ' id="DelSubTaskItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
              }
            });
            Notiflix.Block.remove('.child-wrap');
          });
        });
      });

    }
  });
  /* #endregion */

  /* #region Cập nhật tên đồ án*/
  $(document).on('click', '#pname', e => {
    if (!$(e.currentTarget).val() || $(e.currentTarget).val().toLowerCase() == 'tên đồ án chưa cập nhật') {
      $(e.currentTarget).select();
      $(e.currentTarget).val('');
      $(e.currentTarget).attr('placeholder', 'Nhập tên đồ án');
    }
  }).focusout(e => {
    if (!$(e.currentTarget).val() || $(e.currentTarget).val() == '') {
      $(e.currentTarget).val('TÊN ĐỒ ÁN CHƯA CẬP NHẬT');
      $(e.currentTarget).attr('placeholder', 'Nhập tên đồ án');
    } else {
      SendRequest('POST', {
        newPName: $(e.currentTarget).val(),
        action: 'EDIT_PROJECT_NAME',
      }).done(response => {
        let projectRename_instance = JSON.parse(response);
        console.log(projectRename_instance['message']);
      }).fail(response => { });
    }
  });
  /* #endregion */

  /* #region Thêm hoặc sửa task chính */
  $(document).on('click', '#NewTask', function () {
    const li = (toggleModal, viewAsTitle, titleName = '') => {
      return '<li class="box box-item position-relative mx-2 p-2 mb-3 scale-hover"> <a id="DelTask" class="btn-danger btn-circle position-absolute top-0 start-100 translate-middle btn-anim p-0 d-flex justify-content-center align-items-center text-decoration-none ' + (!isTouchDevice() ? 'd-none' : '') + '" style="width:28px;height:28px;"> <i class="fas fa-times"></i> </a> <div ' + (toggleModal ? 'data-bs-toggle="modal" data-bs-target="#TaskModal" data-bs-whatever="@edittask"' : '') + ' class="d-flex"> <div class="fileEnabled d-none"></div><div class="px-3 d-flex justify-content-center align-items-center d-none"> <div id="tprio" class="text-success d-flex text-wrap align-items-center fs-5 text-center" style="font-weight: 700;line-height: 1;"></div></div><div class="d-flex justify-content-center align-items-center d-none"> <div class="line"></div></div><div class="d-flex flex-column p-2 flex-grow-1 text-center" style="min-width: 0;"> <div class="date d-flex"> <small id="daysleft" class="badge bg-info"></small> <small id="tdeadline" class="end-date text-muted ms-auto"></small> </div>' + (viewAsTitle ? '<h3 id="tname" class="text-truncate">' + titleName + '</h3> ' : '<input id="tname" class="form-control input-custom input-no-focus fs-3" name="tname" placeholder="Nhập công việc">') + '<div id="tdesc" class="text-truncate"></div></div></div></li>';
    };
    if ($('#TaskLists').children().length) {
      $('#TaskLists').prepend(li(false, false)).find('#tname').focus().focusout(e => {
        if (!$(e.currentTarget).val()) {
          $(e.currentTarget).parents('li.box-item').remove();
        } else {
          SendRequest('POST', {
            mainTaskId: 'null',
            mainTaskName: $(e.currentTarget).val(),
            action: 'ADD_OR_EDIT_MAIN_TASK_NAME'
          });
          $(e.currentTarget).parents('li.box-item').replaceWith(li(true, true, $(e.currentTarget).val()));
        }
      });
    }
  });
  /* #endregion */

  /* #region Thêm hoặc sửa subtask  */
  $(document).on('click', '#NewSubTask', e => {
    let mainTaskId = $(e.currentTarget).parent().parent().parent().attr('id');
    let newSubTask = $('.child-wrap').append('<div class="child-task mb-4 box p-3" style="background-color: #F9FAFE;"> <div class="mb-2 d-flex align-items-center"> <div class="d-flex align-items-center flex-fill flex-wrap"> <i class="fas fa-tasks me-2 flex-shrink-1"></i> <input id="SubTaskName" class="form-control w-auto input-custom fs-4 flex-shrink-1 flex-fill" style="background-color: transparent;" name="SubTaskName" aria-describedby="NewSubTaskName"/><div id="NewSubTaskName" class="w-100 invalid-feedback"></div></div><a id="DelSubTask" class="btn btn-danger btn-circle"><i class="fas fa-times"></i></a></div><ul class="ps-0 child-item"> </ul> <div id="SubTaskControls" class="d-flex "><div id="AddSubTaskItem" class="btn btn-custom me-2">Thêm mục</div><div id="AddSubTaskDesc" class="btn btn-custom">Thêm mô tả</div><div class="d-flex align-items-center p-2 ms-auto"> <input id="IsAttachedSubTask" type="checkbox" name="IsAttachedSubTask" class="checkbox-custom me-2"> <label for="IsAttachedSubTask"> Yêu cầu nộp file </label> </div></div></div>');
    newSubTask.find('#SubTaskName').focus().focusout(e => {
      let thisSubTaskEl = $(e.currentTarget).parents('div.child-task');
      if (!$(e.currentTarget).val()) {
        thisSubTaskEl.remove();
      } else {
        SendRequest('POST', {
          mainTaskId: mainTaskId,
          subTaskId: 'null',
          subTaskName: $(e.currentTarget).val(),
          action: 'ADD_OR_EDIT_SUB_TASK'
        }).done(response => {
          response = JSON.parse(response);
          thisSubTaskEl.attr('id', response.subTaskId);
          $('#SubTaskName').attr({
            id: 'SubTaskName' + response.subTaskId,
            'aria-describedby': 'FeedBackOf' + response.subTaskId
          });
          thisSubTaskEl.find('#NewSubTaskName').attr('id', 'FeedBackOf' + response.subTaskId);
          thisSubTaskEl.find('#SubTaskControls').attr('id', 'SubTaskControls' + response.subTaskId);
          thisSubTaskEl.find('#DelSubTask').attr('task-id', response.subTaskId);
          thisSubTaskEl.find('input')
        });
      }
    });
  });
  $(document).on('keyup', 'input[id^="SubTaskName"]', e => {
    let mainTaskId = parseInt($('.modal-content ').attr('id'));
    let subTaskId = parseInt($(e.currentTarget).attr('id').match(/\d+/g));
    if ($(e.currentTarget).val()) {
      $(e.currentTarget).removeClass('is-invalid');
      SendRequest('POST', {
        mainTaskId: mainTaskId,
        subTaskId: subTaskId,
        subTaskName: $(e.currentTarget).val(),
        action: 'ADD_OR_EDIT_SUB_TASK'
      }).done(response => {
        response = JSON.parse(response);
        Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
      });
    } else {
      $(e.currentTarget).toggleClass('is-invalid');
      $('#FeedBackOf' + subTaskId).text('Không được để trống!');
    }
  });
  /* #endregion */

  /* #region Thêm hoặc sửa item subtask */
  $(document).on('click', '#AddSubTaskItem', e => {
    let subTaskId = parseInt($(e.currentTarget).parent().attr('id').match(/\d+/g));
    let newSubTaskItem = $(e.currentTarget).parents('.child-task').find('.child-item').append('<li class="box input-group mb-3 d-flex align-items-center scale-hover p-1"> </div><input id="SubTaskItemName" type="text" class="form-control input-custom" > <div id="DelSubTaskItem" class="btn d-flex align-items-center"><i class="p-1 fas fa-times"></i></div></li>');
    newSubTaskItem.children().last().find('input[type=text]').focus();
    newSubTaskItem.children().last().find('input[type=text]').focus().focusout(e => {
      let thisSubTaskItem = $(e.currentTarget);
      if (!$(e.currentTarget).val()) {
        $(e.currentTarget).parent().remove();
      } else {
        AddOrEditSubTask(subTaskId, 'null', $(e.currentTarget).val());
        thisSubTaskItem.replaceWith('<div id="SubTaskItemName" class="fs-5 flex-grow-1 ps-2" role="button">' + thisSubTaskItem.val() + '</div>');
      }
    }).keyup(e => {
      if (e.which == 13 || e.keyCode == 13) {
        let name = $(e.currentTarget).val();
        let replaceEl = '<div id="SubTaskItemName" class="fs-5 flex-grow-1 ps-2" role="button">' + name + '</div>';
        // $(e.currentTarget).replaceTag('<div>', true,true);
        let parentEl = $(e.currentTarget).parent();
        $(e.currentTarget).replaceWith(function () {
          return $("<div />").append(name).toggleClass('fs-5 flex-grow-1 ps-2').attr({
            id: 'SubTaskItemName',
            role: 'button'
          });
        });
        SendRequest('POST', {
          subTaskId: subTaskId,
          subTaskItemId: 'null',
          subTaskItemName: name,
          action: 'ADD_OR_EDIT_SUB_TASK_ITEM'
        }).done(response => {
          response = JSON.parse(response);
          Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
          parentEl.children('div#DelSubTaskItem').attr('task-id', response.subTaskItemId);
          parentElattr('id', response.subTaskItemId);
        });
      }
    });
  });
  $(document).on('click', '#SubTaskItemName', e => {
    let thisSubTaskItem = $(e.currentTarget);
    let SubTaskItemId = parseInt(thisSubTaskItem.parent().attr('id'));
    let val = thisSubTaskItem.text();
    if (!thisSubTaskItem.is('input')) {
      let newItem = $('<input id="SubTaskItemName" type="text" class="form-control input-custom" value="' + val + '">');
      thisSubTaskItem.replaceWith(newItem);
      newItem.focus().focusout(e => {
        newValue = $(e.currentTarget).val();
        if (newValue != val) {
          AddOrEditSubTask('null', SubTaskItemId, newValue);
        }
        $(e.currentTarget).replaceWith('<div id="SubTaskItemName" class="fs-5 flex-grow-1 ps-2" role="button">' + newValue + '</div>');
      }).keyup(e => {
        if (e.which == 13 || e.keyCode == 13) {
          if ($(e.currentTarget).val() != val) {
            AddOrEditSubTask('null', SubTaskItemId, newValue);
          }
          $(e.currentTarget).replaceWith('<div id="SubTaskItemName" class="fs-5 flex-grow-1 ps-2" role="button">' + $(e.currentTarget).val() + '</div>');
        }
      });
    }
  });
  const AddOrEditSubTask = (subTaskId, subTaskItemId, subTaskItemName) => {
    SendRequest('POST', {
      subTaskId: subTaskId,
      subTaskItemId: subTaskItemId,
      subTaskItemName: subTaskItemName,
      action: 'ADD_OR_EDIT_SUB_TASK_ITEM'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
  };
  /* #endregion */

  /* #region Xoá Task */
  $(document).on('click', '#DelTask,#DelSubTask,#DelSubTaskItem', e => {
    let id = $(e.currentTarget).attr('task-id');
    let subTask_ItemEl = $(e.currentTarget).parent('li');
    let subTaskEl = ($(e.currentTarget).attr('id') == 'DelSubTask') ? $(e.currentTarget).parents('div.child-task') : null;
    Notiflix.Confirm.show(
      'Xoá công việc',
      'Công việc này sẽ bị xoá, các mục con trong trong công việc cũng sẽ mất nếu có!',
      'Xoá',
      'Huỷ',
      function okCb() {
        $(subTaskEl).add(subTask_ItemEl).toggleClass('animate__animated animate__flipOutX').on("webkitAnimationEnd oAnimationEnd msAnimationEnd animationend", e => {
          $(e.currentTarget).remove();
        });
        SendRequest('POST', {
          taskId: id,
          action: 'DELETE_TASK'
        }).done(response => {
          response = JSON.parse(response);
          Notiflix.Notify.success(response.message);
        });
      },
    );

  });
  /* #endregion */

  /* #region Sửa mô tả main task */
  $(document).on('keyup', '#taskdesc', e => {
    let mainTaskId = $(e.currentTarget).parents('div.modal-content').attr('id');
    if ($(e.currentTarget).val()) {
      EditMainTaskDesc(mainTaskId, $(e.currentTarget).val());
      $('#TaskLists').find('li[id=' + mainTaskId + '] #tdesc').parent().toggleClass('align-items-center justify-content-center');
    } else {
      EditMainTaskDesc(mainTaskId, 'null');
      $('#TaskLists').find('li[id=' + mainTaskId + '] #tdesc').parent().toggleClass('align-items-center justify-content-center');
    }
    $('#TaskLists').find('li[id=' + mainTaskId + '] #tdesc').text($(e.currentTarget).val() ? $(e.currentTarget).val() : '');
  });
  const EditMainTaskDesc = (mainTaskId, mainTaskDesc) => {
    SendRequest('POST', {
      mainTaskId: mainTaskId,
      mainTaskDesc: mainTaskDesc,
      action: 'EDIT_MAIN_TASK_DESC'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
  };
  /* #endregion */

  /* #region Cập nhật priority */
  $(document).on('change', '#TaskModal .prio input[type=radio]', e => {
    let mainTaskId = $(e.currentTarget).parents('div.modal-content').attr('id');
    let mainTaskPriority = $(e.currentTarget).val();
    SendRequest('POST', {
      mainTaskId: mainTaskId,
      mainTaskPriority: mainTaskPriority,
      action: 'EDIT_MAIN_TASK_PRIO'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
    $('#TaskLists').find('li[id=' + mainTaskId + '] #tprio').text(mainTaskPriority).removeClass('d-none text-danger text-primary text-success text-secondary').addClass(e => {
      if (mainTaskPriority.toLowerCase() == 'rất cao') return 'text-danger';
      else if (mainTaskPriority.toLowerCase() == 'cao') return 'text-primary';
      else if (mainTaskPriority.toLowerCase() == 'vừa') return 'text-success';
      else if (mainTaskPriority.toLowerCase() == 'thấp') return 'text-secondary';
    });
    $('.line').removeClass('d-none');
  });
  /* #endregion */

  /* #region Cập nhật deadline */
  $('#deadline').on('datechanged', e => {
    let mainTaskId = $(e.currentTarget).parents('.modal-content').attr('id');
    let mainTaskDeadline = $(e.currentTarget).val() ? $(e.currentTarget).val() : 'null';
    let li = $('li[id=' + mainTaskId + ']');
    if ($(e.currentTarget).val()) {
      SendRequest('POST', {
        mainTaskId: mainTaskId,
        mainTaskDeadline: mainTaskDeadline,
        action: 'EDIT_MAIN_TASK_DEADLINE',
      }).done(response => {
        response = JSON.parse(response);
        $('#daysleft', li).text(response.dayleft);
        $('#tdeadline', li).text($(e.currentTarget).val());
        $('.date', li).parent().removeClass('align-items-center justify-content-center');
      });
    }
  });
  /* #endregion */

  /* #region  Cập nhật tên task */
  $(document).on('keyup', '#taskname', e => {
    let mainTaskId = $(e.currentTarget).parents('div.modal-content').attr('id');
    let li = $('li[id=' + mainTaskId + ']');
    SendRequest('POST', {
      mainTaskId: mainTaskId,
      mainTaskName: $(e.currentTarget).val(),
      action: "ADD_OR_EDIT_MAIN_TASK_NAME"
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
    $('#tname', li).text($(e.currentTarget).val());
  });
  /* #endregion */

  /* #region Thêm và cập nhật mô tả subtask */
  $(document).on('click', '#AddSubTaskDesc', e => {
    let subTask = $(e.currentTarget).parents('div.child-task');
    // console.log(subTaskId);
    $('div', subTask).first().after('<div id="SubTaskDescWraper" class="form-floating mb-3 animate__animated animate__flipInX"> <textarea class="form-control" placeholder="Mô tả" id="SubTaskDescOf' + subTask.attr('id') + '" style="height: 100px"></textarea> <label class="" id="ChildTaskDescLabel" for="SubTaskDescOf' + subTask.attr('id') + '">Mô tả</label> </div>');
    setTimeout(() => {
      $('#SubTaskDescWraper').removeClass('animate__animated animate__flipInX');
    }, 500);
    $(e.currentTarget).text('Xoá mô tả').attr('id', 'DelSubTaskDesc');
    $('#SubTaskDescOf' + $(subTask).attr('id')).focus();
    SendRequest('POST', {
      subTaskId: subTask.attr('id'),
      subTaskDecs: $(e.currentTarget).val(),
      action: 'ADD_SUB_TASK_DESC'
    }).done(response => {
      response = JSON.parse(response);
    });
  });
  $(document).on('keyup', 'textarea[id^="SubTaskDescOf"]', e => {
    let subTask = $(e.currentTarget).parents('div.child-task');
    SendRequest('POST', {
      subTaskId: subTask.attr('id'),
      subTaskDecs: $(e.currentTarget).val(),
      action: 'ADD_SUB_TASK_DESC'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
  });
  /* #endregion */

  /* #region Xoá mô tả Sub task  */
  $(document).on('click', '#DelSubTaskDesc', function () {
    let SubTaskID = $(e.currentTarget).parents('div.child-task').attr('id');
    SendRequest('POST', {
      subTaskID: SubTaskID,
      action: 'DEL_SUB_TASK_DESC'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
  });
  /* #endregion */

  /* #region toggle đính kèm */
  $(document).on('click', '[id^=IsAttachedTask]', e => {
    subTaskId = $(e.currentTarget).parents('div.modal-content').attr('id');
    $(e.currentTarget).toggleClass('checkbox-custom-checked');
    SendRequest('POST', {
      subTaskId: subTaskId,
      isChecked: $(e.currentTarget).prop('checked'),
      action: 'SET_ATTACHED'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    })
  });
  $(document).on('click', '[id^=IsAttachedTask]', e => {
    taskId = $(e.currentTarget).parents('div.modal-content').attr('id');
    $(e.currentTarget).toggleClass('checkbox-custom-checked');
    SendRequest('POST', {
      taskId: taskId,
      isChecked: $(e.currentTarget).prop('checked'),
      action: 'SET_ATTACHED'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    })
  });
  $(document).on('click', '[id^=IsAttachedSubTask]', e => {
    taskId = $(e.currentTarget).parents('div.child-task').attr('id');
    $(e.currentTarget).toggleClass('checkbox-custom-checked');
    SendRequest('POST', {
      taskId: taskId,
      isChecked: $(e.currentTarget).prop('checked'),
      action: 'SET_ATTACHED'
    }).done(response => {
      response = JSON.parse(response);
      Notiflix.Notify.success(response.message, { showOnlyTheLastOne: true });
    });
  });
  /* #endregion */

});