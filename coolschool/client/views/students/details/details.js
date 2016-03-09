var pageSession = new ReactiveDict();

Template.StudentsDetails.rendered = function() {
	
};

Template.StudentsDetails.events({
	
});

Template.StudentsDetails.helpers({
	
});

Template.StudentsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("studentsDetailsDetailsFormInfoMessage", "");
	pageSession.set("studentsDetailsDetailsFormErrorMessage", "");

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

Template.StudentsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("studentsDetailsDetailsFormInfoMessage", "");
		pageSession.set("studentsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var studentsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(studentsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("studentsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("studentsDetailsDetailsFormErrorMessage", message);
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

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("students", {});
	}

	
});

Template.StudentsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("studentsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("studentsDetailsDetailsFormErrorMessage");
	}
	
});
