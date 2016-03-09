var pageSession = new ReactiveDict();

Template.CoursesDetailsInsert.rendered = function() {
	
};

Template.CoursesDetailsInsert.events({
	
});

Template.CoursesDetailsInsert.helpers({
	
});

Template.CoursesDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("coursesDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("coursesDetailsInsertInsertFormErrorMessage", "");

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

Template.CoursesDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("coursesDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("coursesDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var coursesDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(coursesDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("coursesDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("courses.details", {courseId: self.params.courseId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("coursesDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.courseId = self.params.courseId;

				newId = CourseStudents.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("courses.details", {coursetId: this.params.courseId});
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

Template.CoursesDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("coursesDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("coursesDetailsInsertInsertFormErrorMessage");
	}
	
});
