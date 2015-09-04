;( function(){

	$.fn.validate = function( options ){

	    var $form 	= $( this );
	    var $inputs = $form.find('input[type="text"], textarea, input[type="email"], input[type="password"]');
	    var $select = $form.find('select');

	    $form.removeClass("valid");

	    $inputs.change( function(){
	        $( this ).parent().removeClass('has-error');
	    });

	    return $form.submit( function( e ){
	        var failed = [];
	        $inputs.each( function(){
	            var $each = $( this );
	            if( $each.val() == '' ){
	                failed.push( $each );
	            }
	            if( $each.filter('[type="email"]').length > 0 ){
	                if( ! $.fn.validate.EMAIL_REGEXP.test( $each.val() ) ){
	                    failed.push( $each );
	                }
	            }
	        });

	        if( $select.val() == "" ){
	            failed.push( $select.siblings('span') );
	        }

	        $.each( failed, function( i, $e ){
	            $e.parent().addClass('has-error');
	        });

	        if ( failed.length == 0 ) {
	            $form.addClass("valid");
	            $form.trigger('validsubmission');
	        } else if ( failed.length > 0 ) {
	            $form.trigger('failedsubmission');
	            e.preventDefault();
	            return false;
	        }
	    });

	};

})( jQuery );