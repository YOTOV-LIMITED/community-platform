$(document).ready(function() {

	$('#mail1').submit(function(e) {
		e.preventDefault();
		var data = $('#mail1').serialize();
		$.ajax({
			url:        '/campaign/respond',
			data:       data,
			type:       'POST',
			success:    function(data) {
				$("#mailform"  + data.campaign_id).addClass("hide");
				$("#returndate").html(data.return_on);
				$("#thankyou1").removeClass("hide");
			},
			error:      function(data) {
				if (typeof data.responseJSON.errstr === 'undefined') {
					$("#mailerr1").text('<i class="icn icon-warning-sign"></i>Sorry, an unknown error occurred. Please try again later.').addClass('notice');
				}
				else {
					$("#mailerr1").text('<i class="icn icon-warning-sign"></i>'+data.responseJSON.errstr).addClass('notice');
				}
			},
		});
	});

	$('#mail2').submit(function(e) {
		e.preventDefault();
		var data = $('#mail2').serialize();
		$.ajax({
			url:        '/campaign/respond',
			data:       data,
			type:       'POST',
			success:    function(data) {
				$("#mailform"  + data.campaign_id).addClass("hide");
				$("#couponcode").html(data.coupon);
				$("#thankyou2").removeClass("hide");
			},
			error:      function(data) {
				if (typeof data.responseJSON.errstr === 'undefined') {
					$("#mailerr2").text('<i class="icn icon-warning-sign"></i>Sorry, an unknown error occurred. Please try again later.').addClass('notice');
				}
				else {
					$("#mailerr2").text('<i class="icn icon-warning-sign"></i>'+data.responseJSON.errstr).addClass('notice');
				}
			},
		});
	});

});

