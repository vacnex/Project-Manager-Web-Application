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
  $(document).on('click', '.accordion-body li input[type=checkbox]', e =>{
    let li = $(e.currentTarget).parent();
    let parentLi = li.parent().parent().parent();
    let taskDone = 0;
    let taskItemNumber = li.parent().children().length;
    let taskState = $(e.currentTarget).is(':checked');
    li.toggleClass('animate__animated animate__flipInX');
    li.toggleClass('task-done');
    setTimeout(() => {
      li.removeClass('animate__animated animate__flipInX');
    }, 500);
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
        data: {
          childTaskId: li.attr('id'),
          action: 'GET_CHILD_TASK_ITEM'
        }
      }).done(response => {
        let childTaskInstance = JSON.parse(response);
        $.each(childTaskInstance, (indexInArray, valueOfElement) => {
          li.find('.accordion-body').append('<li id="' + valueOfElement.pk + '" class="box input-group mb-3 d-flex align-items-center scale-hover p-3 ' + (valueOfElement.fields['tempComplete'] ? 'task-done' : '') + '"><input class="form-check-input" type="checkbox" value="" id="chk' + valueOfElement.pk + '" ' + (valueOfElement.fields['tempComplete'] ? 'checked' : '') + '><label for="chk' + valueOfElement.pk + '" id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfElement.fields['taskName'] + '</label> </li>');
        });
      }).fail((jqXHR, textStatus, errorThrown) => {
        Notiflix.Notify.failure(textStatus + ': ' + errorThrown);
      });
    });
    Notiflix.Block.remove('#StudentChildTaskList');
    $('#StudentChildTaskList').children().addClass('animate__animated animate__fadeInDown').removeClass('d-none');
  }).fail((jqXHR, textStatus, errorThrown) => {
    Notiflix.Notify.failure(textStatus + ': ' + errorThrown);
  });

  setTimeout(() => {
    $('#StudentChildTaskList').children('li').removeClass('animate__animated animate__fadeInDown');
  }, 500);
};
