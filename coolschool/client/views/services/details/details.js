var pageSession = new ReactiveDict();

Template.ServicesDetails.rendered = function() {
	
};

Template.ServicesDetails.events({
	
});

Template.ServicesDetails.helpers({
	
});

Template.ServicesDetailsDetailsForm.rendered = function() {
	

	pageSession.set("servicesDetailsDetailsFormInfoMessage", "");
	pageSession.set("servicesDetailsDetailsFormErrorMessage", "");

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

Template.ServicesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("servicesDetailsDetailsFormInfoMessage", "");
		pageSession.set("servicesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var servicesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(servicesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("servicesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("servicesDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("services", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("services", {});
	}

	
});

Template.ServicesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("servicesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("servicesDetailsDetailsFormErrorMessage");
	}
	
});
