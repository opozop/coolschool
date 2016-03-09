var pageSession = new ReactiveDict();

Template.StudentsDetailsInsert.rendered = function() {
	
};

Template.StudentsDetailsInsert.events({
	
});

Template.StudentsDetailsInsert.helpers({
	
});

Template.StudentsDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("studentsDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("studentsDetailsInsertInsertFormErrorMessage", "");

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

Template.StudentsDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("studentsDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("studentsDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var studentsDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(studentsDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("studentsDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("students.details", {studentId: self.params.studentId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("studentsDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.studentId = self.params.studentId;

				newId = Relatives.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("students.details", {studentId: this.params.studentId});
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

Template.StudentsDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("studentsDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("studentsDetailsInsertInsertFormErrorMessage");
	}
	
});
