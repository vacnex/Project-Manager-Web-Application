$(document).ready(function () {
	if (!isTouchDevice()) {
		$('.assignment_list .box-scroll .box-item').each(function (
			index,
			element
		) {
			$(this).find('#btn-asdel').addClass('d-none');
		});
		$(document).on(
			{
				mouseenter: function () {
					$('#btn-asdel', this).removeClass('d-none');
				},
				mouseleave: function () {
					$('#btn-asdel', this).addClass('d-none');
				},
			},
			'.assignment_list .box-item'
		);
	}

	$(document).on('keyup', '#myInput', function () {
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
					'<li class="box box-item scale-hover position-relative m-xxl-4 m-xl-3 m-lg-3 m-md-4 m-sm-4 m-3 mb-xl-4 mb-lg-4 mb-4" onclick=""><a id="btn-asdel" class="btn btn-danger btn-circle btn-circle-icon position-absolute top-0 start-100 translate-middle btn-anim"><i class="fas fa-times"></i></a><div class="row p-xl-3 p-lg-3 p-md-3 p-sm-3 p-3"><div class="col-sm-2 mb-4 mb-md-0"><div id="pid" class="box-label w-100 h-100 p-md-0 p-1">' +
					asm_instance['id'] +
          '</div></div><div class="col-sm-10"> <div class="asm-Content ms-xxl-5 ms-md-2"> <h3 class="pname">Tên đề tài chưa cập nhật</h3> <div class="row assignment-info"> <div class="col-xl-6"> <span style="color: blue"> GVHD: </span> <span id="' +
          asm_instance['tid'] + '" class="me-2 tname">' + asm_instance['tname'] + '</span> </div> <div class="col-xl-6"> <span style="color: blue"> Sinh Viên:</span> <span id="' +
          asm_instance['sid'] +'" class="me-2 sname">' +
					asm_instance['sname'] +
					'</span> </div> </div> </div> </div></div></li>';
				ass = $(ass).addClass('new-item');
				$('.assignment_list .box-scroll').append(ass);
				$('.assignment_list .box-scroll').scrollTop(
					$('.assignment_list .box-scroll')[0].scrollHeight
				);
				if (!isTouchDevice()) {
					ass = $(ass).find('#btn-asdel').addClass('d-none');
				}
			},
			error: function (response) {
				console.log(response['responseJSON']['error']);
			},
		});
	});

	$(document).on('click', '#btn-asdel', function (e) {
		e.stopPropagation(); //ngăn modal hiện
		e.preventDefault();
		cur_record = $(this).parent();
		record_id = parseInt(cur_record.find('#pid').text().replace(/\s/g, ''));

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

	$(document).on('click', '.box-scroll .box-item', function () {
		item = $(this);
		console.log('load detail success');
		$('#editAssignmentItemBox').modal('show');
    pid = $(item).find('#pid').text();
    pname = $(item).find('.pname').text();
    tid = $(item).find('.tname').attr('id')
    tname = $(item).find('.tname').text();
    sid = $(item).find('.sname').attr('id');
    sname = $(item).find('.sname').text();
		$('#selNewTeach').selectpicker('val', tid);
		$('#selNewStudent').selectpicker('val', sid);
		$('#Pid').val(parseInt(pid.trim()));
		$('#oldPName').val(pname.trim());
	});

	$(document).on('click', '#confirmEdit', function (e) {
		console.log($('#editAssignmentItemBox #Pid').val());
		item_list = $('.assignment_list .box-scroll .box-item');
		$.ajax({
			type: 'POST',
			url: '/assignment/',
			data: {
				action: 'save_item',
				id: $('#editAssignmentItemBox #Pid').val(),
				pName: $('#editAssignmentItemBox #oldPName').val(),
        Teacher: $('#editAssignmentItemBox #selNewTeach').val(),
				Student: $('#editAssignmentItemBox #selNewStudent').val(),
			},
			success: function (response) {
				console.log(response.message);
        newpn = $('#editAssignmentItemBox #oldPName').val();
        newt = $('#editAssignmentItemBox #selNewTeach option:selected').text();
        news = $('#editAssignmentItemBox #selNewStudent option:selected').text();
        $.each(item_list, function (indexInArray, valueOfElement) {
					if (
            parseInt($("#editAssignmentItemBox #Pid").val()) ==
            parseInt($("#pid", valueOfElement).text())
					) {
            $(".pname", valueOfElement).text(newpn);
            $(".tname", valueOfElement).attr('id', $("#editAssignmentItemBox #selNewTeach option:selected").val());
            $(".tname", valueOfElement).text(newt);
            $(".sname", valueOfElement).attr('id', $("#editAssignmentItemBox #selNewStudent option:selected").val());
            $(".sname", valueOfElement).text(news);
					}
				});
				$('#editAssignmentItemBox').modal('hide');
			},
			error: function (response) {
				console.log(response.message);
			},
		});
	});

	$(document).on('show.bs.modal', '#editAssignmentItemBox', function () {
		$('#oldPName').val('');
		$('#assignmentEditForm').trigger('reset');
	});
});
