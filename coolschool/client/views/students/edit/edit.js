var pageSession = new ReactiveDict();

Template.StudentsEdit.rendered = function() {
	
};

Template.StudentsEdit.events({
	
});

Template.StudentsEdit.helpers({
	
});

Template.StudentsEditEditForm.rendered = function() {
	

	pageSession.set("studentsEditEditFormInfoMessage", "");
	pageSession.set("studentsEditEditFormErrorMessage", "");

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

Template.StudentsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("studentsEditEditFormInfoMessage", "");
		pageSession.set("studentsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var studentsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(studentsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("studentsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("students", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("studentsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Students.update({ _id: t.data.student_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("students", {});
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

Template.StudentsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("studentsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("studentsEditEditFormErrorMessage");
	}
	
});
