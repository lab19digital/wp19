// Import from node_modules
import 'bootstrap/js/modal';

export default function( $root ){
	var html = $("#modal").html();
	$root.find('.trigger-custom-modal').click(function(){

		var title = $(this).data('modalTitle');
		var body = $(this).data('modalBody');

		// Replace some values in the template
		var modalHtml = html
			.replace('{modalTitle}', title)
			.replace('{modalBody}', body);

		// Replace the modal values
		var $modal = $(modalHtml).appendTo($root);

		$modal.modal().on("hidden.bs.modal", function(){
			$(this).remove();
		});
	});
}

