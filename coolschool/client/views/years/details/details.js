var pageSession = new ReactiveDict();

Template.YearsDetails.rendered = function() {
	
};

Template.YearsDetails.events({
	
});

Template.YearsDetails.helpers({
	
});

Template.YearsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("yearsDetailsDetailsFormInfoMessage", "");
	pageSession.set("yearsDetailsDetailsFormErrorMessage", "");

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

Template.YearsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("yearsDetailsDetailsFormInfoMessage", "");
		pageSession.set("yearsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var yearsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(yearsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("yearsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("yearsDetailsDetailsFormErrorMessage", message);
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

		Router.go("years", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("years", {});
	}

	
});

Template.YearsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("yearsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("yearsDetailsDetailsFormErrorMessage");
	}
	
});
