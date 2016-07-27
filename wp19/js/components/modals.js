export default function( $body ){
	var html = $("#modal").html();

	$body.find('.trigger-custom-modal').click(function(){

		var title = $(this).data('modalTitle');
		var body = $(this).data('modalBody');

		// Replace some values in the template
		var modalHtml = html
			.replace('{modalTitle}', title)
			.replace('{modalBody}', body);

		// Replace the modal values
		var $modal = $(modalHtml).appendTo($body);

		$modal.modal().on("hidden.bs.modal", function(){
			$(this).remove();
		});
	});
}

