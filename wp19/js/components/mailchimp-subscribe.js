export default function (s, formId) {

  let $form, $resultElement, $fname_input, $email_input;

  // Hijack the submission. We'll submit the form manually.
  s.document.on('submit', formId, function (event) {
    event.preventDefault();

    $form = $(this);
    $resultElement = $form.find('.result');
    $fname_input = $form.find('input[type="text"]');
    $email_input = $form.find('input[type="email"]');

    if (!isValidName($fname_input)) {
      $fname_input.addClass('error');
    } else {
      $fname_input.removeClass('error');
    }

    if (!isValidEmail($email_input)) {
      $email_input.addClass('error');
    } else {
      $email_input.removeClass('error');
    }

    if (isValidName($fname_input) && isValidEmail($email_input)) {
      $resultElement.html('Subscribing...').removeClass('error').addClass('visible');

      submitSubscribeForm($form, $resultElement);
    }
  });


  // Validate the email address in the form
  function isValidEmail($input) {
    var email = $input.val();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  // Validate the name field in the form
  function isValidName($input) {
    var name = $input.val();
    name = name.trim();

    if (name.length === 0 || name === '') {
      return false;
    } else {
      return true;
    }
  }


  // Submit the form with an ajax/jsonp request.
  // Based on http://stackoverflow.com/a/15120409/215821
  function submitSubscribeForm($form, $resultElement) {
    jQuery.ajax({
      type: 'GET',
      url: $form.attr('action'),
      data: $form.serialize(),
      cache: false,
      dataType: 'jsonp',
      jsonp: 'c', // trigger MailChimp to return a JSONP response
      contentType: 'application/json; charset=utf-8',
      error: function (error) {
        // According to jquery docs, this is never called for cross-domain JSONP requests
      },
      success: function (data) {
        if (data.result != 'success') {
          var message = data.msg || 'Sorry, unable to subscribe. Please try again later.';

          if (data.msg && data.msg.indexOf('already subscribed') >= 0) {
            message = 'You\'re already subscribed. Thank you.';
          }

          $resultElement.html(message).removeClass('error').addClass('visible');
        } else {
          $resultElement
            .html('Thank you! Please confirm the subscription in your inbox.')
            .removeClass('error')
            .addClass('visible');

          $form.find('button[type="submit"]').attr('disabled', true);

          setTimeout(function () {
            $form.find('input').each(function () {
              $(this).removeClass('error').val('');
            });

            $form.find('button[type="submit"]').attr('disabled', false);

            $resultElement.removeClass('visible');
          }, 7500);
        }
      }
    });
  }
}
