$(document).ready(function() {
    var $accordion = $('.accordion');
    var $createEntryButton = $('.create-entry');
    var $body = $('body');
    var globalData, updateId;

    String.prototype.numericOnly = function() {
        return this.replace(/[^\d/"+"\s]+/g, '');
    };

    String.prototype.capitalized = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    $accordion.on('click', '.entry', function() {
        var $this = $(this);

        if ($(event.target).is('button')) {
            return;
        }

        $this.children('.data').slideToggle(350);
    });

    $accordion.on('click', '.edit', function() {
        var $this = $(this),
            _id = getId($this),
            $editingEntry = getEntry($this),
            objectData = getObjectData($editingEntry, _id);

        $editForm.find('input').each(function() {
            var $this = $(this),
                name = this.getAttribute('name').capitalized();

            $this.val(objectData[name]);
        });
        $editPopup.fadeIn(400);
        $body.addClass('no-scroll');
        updateId = _id;
    });

    $createEntryButton.on('click', function() {
        $createPopup.fadeIn(400);
        $body.addClass('no-scroll');
    });

    function getObjectData($entry, id) {
        for (var i = 0; i < globalData.length; i++) {
            var iterationObject = globalData[i];

            if (iterationObject._id === id) {
                return iterationObject;
            }
        }

        return false;
    }

    $accordion.on('click', '.remove', function(event) {
        event.preventDefault();
        var $this = $(this),
            _id = getId($this),
            name = this.getAttribute('data-name');

        var isUserSure = confirm('Are you sure you want to delete "' + name + '"?');

        if (isUserSure) {
            var url = '/admin/' + _id;
            $.ajax({
                url: url,
                method: 'DELETE',
                sucess: deleteEntry($this),
                error: function(error) {
                    console.log(error);
                }
            });
        }
    });

    function getId($element) {
        return $element.closest('.entry')[0].getAttribute('data-id');
    }

    function getEntry($element) {
        return $element.closest('.entry');
    }

    function deleteEntry($element) {
        getEntry($element).hide(400, function() {
            $(this).remove();
        });
    }

    $.ajax({
        url: '/admin/get',
        method: 'GET',
        dataType: 'JSON',
        success: function(data) {
            // console.log(data);
            globalData = data;
            fillData(data);
        }
    });

    $('.phone').on('input', function() {
        var $this = $(this),
            value = $this.val().numericOnly();

        $this.val(value);
    });

    var $editForm = $('.edit-form'),
        $createForm = $('.create-form'),
        $form = $('.form'),
        $popup = $('.popup'),
        $editPopup = $('.edit-popup'),
        $createPopup = $('.create-popup'),
        $console = $('.console'),
        $consoleInfo = $('.console-info');

    var $star = $createForm.find('.star'),
        $required = $createForm.find('.user.required');

    $('.cancel').on('click', function(event) {
        event.preventDefault();
        $popup.fadeOut(400, function() {
            $editForm[0].reset();
        });
        $body.removeClass('no-scroll');
    })

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

    function fillData(data) {
        for (var i = 0; i < data.length; i++) {
            var entry = data[i],
                listItem = '';

            // console.log(entry);

            for (var key in entry) {
                if (key !== '_id') {
                    listItem += '<li>' + key + ': ' + entry[key] + '</li>';
                }
            }

            var name = entry.Name,
                surname = entry.Surname,
                fullName = name + ' ' + surname;

            var entryPattern = '<li class="entry" data-id="' + entry._id + '"><div class="handle"><button class="edit">Edit</button><button class="remove" data-name="' + fullName + '">Remove</button></div><span class="name">' + fullName + '</span></p><ul class="data">' + listItem + '</ul></li>';

            $accordion.append(entryPattern);
        }
    }

    // $console = $('.console-success');
    // console.log($editForm);

    var imageFlaga = true;

    $editForm.on('submit', function(event) {
        event.preventDefault();

        data = new FormData();
        var $inputs = $(this).find('.input');

        $inputs.each(function() {
            var $this = $(this),
                name = $this.attr('name').capitalized(),
                value = $this.val();

            if (name === 'Me') {
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

        console.log("The data has been sent");
        // console.log('Id is "' + updateId + '"');

        var url = '/admin/' + updateId;

        // console.log('URL is "' + url + '"');
        $.ajax({
        	type: "PIT",
            method: "PUT",
            url: url,
            contentType: false,
            processData: false,
            data: data,
            success: function(data) {
            	$('.console-log').text("L'entrée est mise à jour. Recharger la page...");
                showConsole();
                setTimeout(function() {
                	location.reload();
                }, 3500);
                console.log(data);
                // $editForm[0].reset();
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $createForm.on('submit', function(event) {
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

        console.log("The data has been sent");

        $.ajax({
            type: "POST",
            url: '/',
            contentType: false,
            processData: false,
            data: data,
            success: function(data) {
            	$('.console-log').text('Les données ont été envoyées. Recharger la page...');
                showConsole();
                setTimeout(function() {
                	location.reload();
                }, 3500);
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    function hideConsole() {
        $consoleInfo.fadeOut('slow');
        $body.removeClass('no-scroll')
    }

    function showConsole() {
        $editForm.fadeOut(400, function() {
            $consoleInfo.fadeIn(400);
            $body.addClass('no-scroll')
        });
    }

    $console.on('click', function(event) {
        if ($(event.target).closest('.edit-container').length > 0) {
            return;
        }

        $(this).fadeOut(400);
        $body.removeClass('no-scroll');
    });
});