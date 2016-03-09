var pageSession = new ReactiveDict();

Template.ServicesEdit.rendered = function() {
	
};

Template.ServicesEdit.events({
	
});

Template.ServicesEdit.helpers({
	
});

Template.ServicesEditEditForm.rendered = function() {
	

	pageSession.set("servicesEditEditFormInfoMessage", "");
	pageSession.set("servicesEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ServicesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("servicesEditEditFormInfoMessage", "");
		pageSession.set("servicesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var servicesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(servicesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("servicesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("services", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("servicesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Services.update({ _id: t.data.service_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("services", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ServicesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("servicesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("servicesEditEditFormErrorMessage");
	}
	
});
