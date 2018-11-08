$(document).ready(function (){
	var $form = $('.login-form');

	$form.on('submit', function(event) {
	  	event.preventDefault();
	  	var password = $(this).find('.input-password').val();

	  	$.ajax({
	      type: "POST",
	      url: '/login',
	      data: {"password": password},
          contentType: false,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	      success: function(data) {
	        console.log(data);
	      },
	      error: function(error) {
	        console.log(error);
	      }
	    });
  	});
});