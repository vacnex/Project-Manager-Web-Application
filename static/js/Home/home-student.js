$(document).ready(function () {
  $(document).on('click', '#StudentTaskList .box-item', function () {
    item = this;
    if ($(this).hasClass('choosed')) {
      $(this).toggleClass('choosed').siblings().removeClass('choosed');
      $('#EmptyList').removeClass('d-none');
      $('#StudentChildTaskList').addClass('d-none');
    } else {
      $(this).toggleClass('choosed').siblings().removeClass('choosed');
      $("#EmptyList").addClass('d-none');
      $('#StudentChildTaskList').removeClass('d-none');
    }
    $.ajax({
      type: "POST",
      url: "/home/",
      data: {
        parentTaskId: $(this).attr('id'),
        action: "GET_CHILD_TASK"
      },
      success: function (response) {
        tasksInstance = JSON.parse(response);
        console.log(tasksInstance);
        if ($('#StudentChildTaskList').children().length) {
          $('#StudentChildTaskList').empty();
        }
        $.each(tasksInstance, function (indexInArray, valueOfElement) {
          $('#StudentChildTaskList').append('<li id=' + valueOfElement.pk + ' class="box box-item mb-3 animate__animated animate__fadeInDown" style="cursor: unset;"> <h2 class="accordion-header"><button id="BtnViewChildTaskItem" class="accordion-button collapsed ' + (valueOfElement.fields['tempComplete'] ? 'task-done' : 'task-processing') + '" type="button" style="border-radius: 10px;" data-bs-toggle="collapse" data-bs-target="#ViewChildTask' + indexInArray + 'Content" aria-expanded="false" aria-controls="">' + valueOfElement.fields['taskName'] + '</button> </h2> <div id="ViewChildTask' + indexInArray + 'Content" class="accordion-collapse collapse" aria-labelledby=""> <ul class="accordion-body"></ul> </div></div> </li>');
        });
      }
    });
  });
  $(document).on('show.bs.collapse	', '.collapse', function () {
    wraper = $(this).children('.accordion-body');
    console.log(wraper);
    $(wraper).html('');
    $.ajax({
      type: "POST",
      url: "/home/",
      data: {
        childTaskId: $(this).parent().attr('id'),
        action: "GET_CHILD_TASK_ITEM"
      },
      success: function (response) {
        childTaskInstance = JSON.parse(response);
        console.log(childTaskInstance);
        $.each(childTaskInstance, function (indexInArray, valueOfElement) {

          $(wraper).append('<li id="' + valueOfElement.pk + '" class="box input-group mb-3 d-flex align-items-center scale-hover p-3 ' + (valueOfElement.fields['tempComplete'] ? 'task-done' : '') + '"><input class="form-check-input" type="checkbox" value="" id="chk' + valueOfElement.pk + '" ' + (valueOfElement.fields['tempComplete'] ? 'checked' : '') + '><label for="chk' + valueOfElement.pk + '" id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfElement.fields['taskName'] + '</label> </li>');
        });

      }
    });
  });
  $(document).on('click', '.accordion-body li input[type=checkbox]', function () {
    let li = $(this).parent();
    let parentLi = li.parent().parent().parent();
    let taskDone = 0;
    let taskItemNumber = li.parent().children().length;
    let taskState = $(this).is(':checked');
    li.toggleClass('animate__animated animate__flipInX');
    li.toggleClass('task-done');
    setTimeout(function () {
      li.removeClass("animate__animated animate__flipInX");
    }, 500);
    $.each(li.parent().children(), function (indexInArray, valueOfElement) {
      let item = $(this);
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
      $('#BtnViewChildTaskItem', parentLi).removeClass('task-done');
      $('#BtnViewChildTaskItem', parentLi).addClass('task-processing');
      CompleteTask(parentLi.attr('id'), false);
    }

  });
  function CompleteTask(taskID, taskState) {
    $.ajax({
      type: "POST",
      url: "/home/",
      data: {
        taskID: taskID,
        taskState: taskState,
        action: "COMPLETE_TASK"
      },
      success: function (response) {

      }
    });
  }
});