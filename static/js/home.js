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
  /* #region  Teacker View */
  var breakpoint = {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
    exxxl: 1600,
    xxxl: 1900,
    xxxxl: 2500,
  };

  $('#ListTeacherProject').slick({
    mobileFirst: true,
    slidesToShow: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: breakpoint.sm,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: breakpoint.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: breakpoint.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoint.xl,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoint.xxl,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: breakpoint.exxxl,
        settings: {
          slidesToShow: 4,
        },
      },

      {
        breakpoint: breakpoint.xxxl,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: breakpoint.xxxxl,
        settings: {
          slidesToShow: 6,
        },
      },
    ],
  });
  $(document).on('keyup', '#ProjectSearchBox', function () {
    var value = $(this).val().toLowerCase();
    $('#ListTeacherProject div').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  $(document).on('click', '#year-list > li', function () {
    let year = $(this).attr('data-filtertarget');
    $("#ListTeacherProject").slick('slickUnfilter');
    if (year != 'ALL') {
      $.each($('.slick-track').children(), function (indexInArray, valueOfElement) {
        if (year == $(this).find('.year').text()) {
          $("#ListTeacherProject").slick('slickFilter', function () {
            return $(this).find('.year').text() == year;
          });
          return false;
        }
      });
      $(this).toggleClass('choosed').siblings().removeClass('choosed');
    } else {
      if (!$(this).hasClass('choosed')) {
        $(this).addClass('choosed').siblings().removeClass('choosed');
      }
    }


  });
  /* #endregion */
  /* #region  Manager View */
  $(document).on('click', '#pills-gv-tab', function () {
    $(this).removeClass('active');
    $(this).addClass('btn-custom');
    $('#pills-sv-tab').removeClass('btn-custom');
  });
  $(document).on('click', '#pills-sv-tab', function () {
    $(this).removeClass('active');
    $(this).addClass('btn-custom');
    $('#pills-gv-tab').removeClass('btn-custom');
  });
  /* #endregion */
  /* #region  Student View */
  
  $(document).on('click', '#StudentTaskList .box-item', function () {
    item = this
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
          $('#StudentChildTaskList').append('<li id=' + valueOfElement.pk + ' class="box box-item mb-3" style="cursor: unset;"> <h2 class="accordion-header"><button id="BtnViewChildTaskItem" class="accordion-button collapsed ' + (valueOfElement.fields['tempComplete'] ? 'task-done' : 'task-processing') + '" type="button" style="border-radius: 10px;" data-bs-toggle="collapse" data-bs-target="#ViewChildTask' + indexInArray + 'Content" aria-expanded="false" aria-controls="">' + valueOfElement.fields['taskName'] + '</button> </h2> <div id="ViewChildTask' + indexInArray +'Content" class="accordion-collapse collapse" aria-labelledby=""> <ul class="accordion-body"></ul> </div></div> </li>');
        });
      }
    });
  });
  $(document).on('show.bs.collapse	', '.collapse', function () {
    wraper = $(this).children('.accordion-body')
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

          $(wraper).append('<li id="' + valueOfElement.pk + '" class="box input-group mb-3 d-flex align-items-center scale-hover p-3 ' + (valueOfElement.fields['tempComplete'] ? 'task-done' : '') + '"><input class="form-check-input" type="checkbox" value="" id="chk' + valueOfElement.pk + '" ' + (valueOfElement.fields['tempComplete']?'checked':'') + '><label for="chk' + valueOfElement.pk + '" id="taskchilditemname" class="fs-5 flex-grow-1 ps-2">' + valueOfElement.fields['taskName'] + '</label> </li>');
        });
        
      }
    });
  });
  $(document).on('click', '.accordion-body li input[type=checkbox]', function () {
    let li = $(this).parent();
    let parentLi = li.parent().parent().parent();
    let taskDone = 0;
    let taskItemNumber = li.parent().children().length
    let taskState = $(this).is(':checked')
    li.toggleClass('animate__animated animate__flipInX');
    li.toggleClass('task-done');
    setTimeout(function () {
      li.removeClass("animate__animated animate__flipInX");
    }, 500);
    $.each(li.parent().children(), function (indexInArray, valueOfElement) {
      let item = $(this)
      if ($(item).hasClass('task-done')) {
        taskDone++;
      }
    });
    CompleteTask(li.attr('id'), taskState)
    if (taskDone == taskItemNumber) {
      $('#BtnViewChildTaskItem', parentLi).addClass('task-done');
      $('#BtnViewChildTaskItem', parentLi).removeClass('task-processing');
      CompleteTask(parentLi.attr('id'), true)
      
    } else {
      $('#BtnViewChildTaskItem', parentLi).removeClass('task-done');
      $('#BtnViewChildTaskItem', parentLi).addClass('task-processing');
      CompleteTask(parentLi.attr('id'), false)
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
  /* #endregion */
});