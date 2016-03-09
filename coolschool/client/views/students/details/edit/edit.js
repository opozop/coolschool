var pageSession = new ReactiveDict();

Template.StudentsDetailsEdit.rendered = function() {
	
};

Template.StudentsDetailsEdit.events({
	
});

Template.StudentsDetailsEdit.helpers({
	
});

Template.StudentsDetailsEditEditForm.rendered = function() {
	

	pageSession.set("studentsDetailsEditEditFormInfoMessage", "");
	pageSession.set("studentsDetailsEditEditFormErrorMessage", "");

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

Template.StudentsDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("studentsDetailsEditEditFormInfoMessage", "");
		pageSession.set("studentsDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var studentsDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(studentsDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("studentsDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("students.details", {studentsId: self.params.studentsId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("studentsDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Relatives.update({ _id: t.data.relative._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("students.details", {studentsId: this.params.studentsId});
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

Template.StudentsDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("studentsDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("studentsDetailsEditEditFormErrorMessage");
	}
	
});
