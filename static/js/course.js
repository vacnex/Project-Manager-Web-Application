$(document).ready(function () {
	$('.Course-Process').hide();
	$('.project-list-content .card').on('click', function () {
		pj_id = $(this).attr('id');
		console.log($(this).attr('id'));
		$.ajax({
			type: 'GET',
			url: '/course/detail/',
			data: {
				pj_id: pj_id,
			},
			success: function (data) {
                console.log(data.project_data);
                project_data = data.project_data
                console.log(project_data['Name']);
                $('.Course-Process').show();
                $('.Project-Tittle').html('<h1> Tiến độ ' + project_data['Name'] + '</h1>');
                if (project_data['content'] === '') {
                    $('.Course-Process').html(
                        '<h1>Liện hệ giáo viện để cập nhật tiến độ</h1>'
                    );
                } else {
                    $('.Course-Process').html(
                        '<div>' + project_data['content'] + '</div>'
                    );
                }
                
			},
		});
	});
});
