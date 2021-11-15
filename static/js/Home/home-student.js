$(document).ready(function () {
  $(document).on('click', '#StudentTaskList .box-item', e => {
    if ($(e.currentTarget).hasClass('choosed')) {
      $(e.currentTarget).toggleClass('choosed').siblings().removeClass('choosed');
      $('#EmptyList').removeClass('d-none');
      $('#StudentChildTaskList').addClass('d-none');
    } else {
      $(e.currentTarget).toggleClass('choosed').siblings().removeClass('choosed');
      $('#EmptyList').addClass('d-none');
      $('#StudentChildTaskList').removeClass('d-none');
    }
    GetChildTaskData($(e.currentTarget).attr('id'));
  });
  $(document).on('change', 'input[id^="chk"]', e => {
    let li = $(e.currentTarget).parent();
    let parentLi = li.parent().parent().parent();
    let taskDone = 0;
    let taskItemNumber = li.parent().children().length;
    let taskState = $(e.currentTarget).prop('checked');
    li.toggleClass('animate__animated animate__flipInX');
    setTimeout(() => {
      li.removeClass('animate__animated animate__flipInX');
    }, 500);
    if (parentLi.is('li')) {
      li.toggleClass('task-done');
      $.each(li.parent().children(), (indexInArray, valueOfElement) => {
        let item = $(valueOfElement);
        if ($(item).hasClass('task-done')) {
          taskDone++;
        }
      });
      CompleteTask(li.attr('id'), taskState);
      if (taskDone == taskItemNumber) {
        $('#BtnViewChildTaskItem', parentLi).addClass('task-done');
        $('#BtnViewChildTaskItem', parentLi).removeClass('task-processing');
        CompleteTask(parentLi.attr('id'), true);

      } else {
        if ($('#BtnViewChildTaskItem', parentLi).hasClass('task-done')) {
          $('#BtnViewChildTaskItem', parentLi).removeClass('task-done');
          $('#BtnViewChildTaskItem', parentLi).addClass('task-processing');
          CompleteTask(parentLi.attr('id'), false);
        }
      }
    } else {
      li.toggleClass('task-processing').toggleClass('task-done');
      CompleteTask(li.attr('id'), taskState);
    }

  });
});
const CompleteTask = (taskID, taskState) => {
  $.ajax({
    type: 'POST',
    url: '/home/',
    data: {
      taskID: taskID,
      taskState: taskState,
      action: 'COMPLETE_TASK'
    },
    success: response => {
      let completeTaskInstance = JSON.parse(response);
      console.log(completeTaskInstance.message);
    }
  });
};
const GetChildTaskData = (parentTaskId) => {
  Notiflix.Block.standard('#StudentChildTaskList', 'Đang tải dữ liệu');
  $.ajax({
    type: 'POST',
    url: '/home/',
    data: {
      parentTaskId: parentTaskId,
      action: 'GET_CHILD_TASK'
    }
  }).done(response => {
    let li;
    let tasksInstance = JSON.parse(response);
    if ($('#StudentChildTaskList').children().length) {
      $('#StudentChildTaskList').children().not($('.notiflix-block-wrap')).empty();
    }
    $.each(tasksInstance, (indexInArray, valueOfElement) => {
      li = $('<li id=' + valueOfElement.pk + ' class="box box-item mb-3 d-none" style="cursor: unset;"> <h2 class="accordion-header"><button id="BtnViewChildTaskItem" class="accordion-button collapsed ' + (valueOfElement.fields['tempComplete'] ? 'task-done' : 'task-processing') + '" type="button" style="border-radius: 10px;" data-bs-toggle="collapse" data-bs-target="#ViewChildTask' + indexInArray + 'Content" aria-expanded="false" aria-controls="">' + valueOfElement.fields['taskName'] + '</button> </h2> <div id="ViewChildTask' + indexInArray + 'Content" class="accordion-collapse collapse" aria-labelledby=""> <ul class="accordion-body"></ul> </div></div> </li>');
      $('#StudentChildTaskList').append(li);
      $.ajax({
        type: 'POST',
        url: '/home/',
        async: false,
        data: {
          childTaskId: li.attr('id'),
          action: 'GET_CHILD_TASK_ITEM'
        }
      }).done(response => {
        let childTaskInstance = JSON.parse(response);
        if (childTaskInstance.length > 0) {
          li.find('.accordion-body').append(' <div id="Desc' + valueOfElement.pk + '" class="alert alert-info box-item">' + valueOfElement.fields['taskDesc'] + '</div>');
         
          $.each(childTaskInstance, (indexInArray, valueOfChildElement) => {
            li.find('.accordion-body').append(' <li id="' + valueOfChildElement.pk + '" class="box mb-3 d-flex align-items-center scale-hover p-3 ' + (valueOfChildElement.fields['tempComplete'] ? 'task-done' : '') + '"><input class="checkbox-custom me-2 ' + (valueOfChildElement.fields['tempComplete'] ? 'checkbox-custom-checked' : '') + '" type="checkbox" value="" id="chk' + valueOfChildElement.pk + '" ' + (valueOfChildElement.fields['tempComplete'] ? 'checked' : '') + '><label for="chk' + valueOfChildElement.pk + '" id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfChildElement.fields['taskName'] + '</label> </li>');
          });
        } else {
          if (valueOfElement.fields['taskDesc'] && !valueOfElement.fields['fileEnabled']) {
            ToggleSingleTask($('#StudentChildTaskList').find(li), (valueOfElement.fields['tempComplete'] ? 'task-done' : 'task-processing'), (valueOfElement.fields['tempComplete'] ? 'checkbox-custom-checked' : ''), (valueOfElement.fields['tempComplete'] ? 'checked' : ''), valueOfElement.pk, valueOfElement.fields['taskName']);
            ToggleDesc($('#StudentChildTaskList').find(li), valueOfElement.fields['taskDesc']);
          }
          if (!valueOfElement.fields['taskDesc'] && valueOfElement.fields['fileEnabled']) {
            let fileToggle = valueOfElement.fields['fileEnabled'];
          }
          if (valueOfElement.fields['taskDesc'] && valueOfElement.fields['fileEnabled']) {
            let desc = valueOfElement.fields['taskDesc'];
            let fileToggle = valueOfElement.fields['fileEnabled'];
          } if (!valueOfElement.fields['taskDesc'] && !valueOfElement.fields['fileEnabled']) {
            ToggleSingleTask($('#StudentChildTaskList').find(li), (valueOfElement.fields['tempComplete'] ? 'task-done' : 'task-processing'), (valueOfElement.fields['tempComplete'] ? 'checkbox-custom-checked' : ''), (valueOfElement.fields['tempComplete'] ? 'checked' : ''), valueOfElement.pk, valueOfElement.fields['taskName']);
          }
        }
      }).fail((jqXHR, textStatus, errorThrown) => {
        Notiflix.Notify.failure(textStatus + ': ' + errorThrown);
      });
    });
    Notiflix.Block.remove('#StudentChildTaskList');
    $('#StudentChildTaskList').children().addClass('animate__animated animate__fadeInDown').removeClass('d-none');
  }).fail((jqXHR, textStatus, errorThrown) => {
    Notiflix.Notify.failure(textStatus + ': ' + errorThrown);
  });

  const ToggleSingleTask = (el, taskState, checkedCls, checkedProp, taskID, taskName) => {
    el.addClass(() => {
      return 'd-flex align-items-center p-3 ' + taskState;
    }).html('<input class="checkbox-custom me-2 ' + checkedCls + ' " type="checkbox" id="chk' + taskID + '" ' + checkedProp + '><label for="chk' + taskID + '" class="flex-grow-1 ps-2">' + taskName + '</label>');
  };

  const ToggleDesc = (el, desc) => {
    el.attr({
      'data-bs-toggle': 'tooltip',
      'data-bs-placement': 'top',
      title: desc,
    });
    el.tooltip({ placement: 'top' });
  };
  // const ToggleFile = (param) => {};
  setTimeout(() => {
    $('#StudentChildTaskList').children('li').removeClass('animate__animated animate__fadeInDown');
  }, 500);
};
