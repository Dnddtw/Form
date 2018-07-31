$(document).ready(function() {
  String.prototype.numericOnly = function() {
      return this.replace(/[^\d/"+"\s]+/g, '');
  };

  String.prototype.capitalized = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  $('.phone').on('input', function() {
    var $this = $(this),
        value = $this.val().numericOnly();

    $this.val(value);
  });

  var $star = $('.star'),
      $required = $('.user.required');


  $star.on('input', function() {
    var $this = $(this),
        $user = $this.closest('.input-container').find('.user.required'),
        index = $this.index();

    $star.each(function(index) {
      var $this = $(this);

      if ($this.val().length === 0) {
        $required.eq(index).removeClass('required');
        $this.removeAttr('required');
      } else {
        $required.eq(index).addClass('required');
        $this.prop('required', true);
      }
    });
    
    if ($('.user.required').length === 0) {
      $required.addClass('required');
    } 

  });

  $('.birthday').datepicker({
    changeMonth: true,
    changeYear: true,
    showAnim: 'fadeIn',
    minDate: '-90y',
    maxDate: '-12y',
    yearRange: '-90:-12'
  });

  $('.birthday').datepicker('option', $.datepicker.regional[ "fr" ]);

  var imageFlaga = true,
      $form = $('form');

  $form.on('submit', function(event) {
  	event.preventDefault();

  	data = new FormData();
  	var $inputs = $(this).find('.input');

  	$inputs.each(function() {
  		var $this = $(this),
    			name = $this.attr('name').capitalized(),
    			value = $this.val();

      if (name === 'Me') {
        if (!$this.is(':checked')) return;
        name = 'Who I am';
      }

  		if ($this.attr('type') == "file" && value) {
        value = $this[0].files[0];
        var imageFormat = value.name.split('.');
        imageFormat = imageFormat[imageFormat.length - 1];

        if (imageFormat == 'png' || imageFormat == 'jpg' || imageFormat == 'jpeg' || imageFormat == 'gif') {
          data.append(name, value, 'photo');
        } else {
          alert("Choisissez le format correct d'une image, s'il vous plaît");
          imageFlaga = false;
          return;
        }
      } else if (value) {
        data.append(name, value);
  		}
  	});

    if (imageFlaga === false) {
      return;
    }

    var $console = $('.console');
    $console.on('click', hideConsole);

    function hideConsole() {
      $console.fadeOut('slow');
    }

    function showConsole() {
      $console.fadeIn('slow');
    }

    console.log("The data has been sent");

  	$.ajax({
      type: "POST",
      url: '/',
      contentType: false,
      processData: false,
      data: data,
      success: function(data) {
        showConsole();
        setTimeout(hideConsole, 10000);
        $form[0].reset();
      }
    });
  });
});