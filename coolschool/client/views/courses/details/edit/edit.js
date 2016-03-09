var pageSession = new ReactiveDict();

Template.CoursesDetailsEdit.rendered = function() {
	
};

Template.CoursesDetailsEdit.events({
	
});

Template.CoursesDetailsEdit.helpers({
	
});

Template.CoursesDetailsEditEditForm.rendered = function() {
	

	pageSession.set("coursesDetailsEditEditFormInfoMessage", "");
	pageSession.set("coursesDetailsEditEditFormErrorMessage", "");

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

Template.CoursesDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("coursesDetailsEditEditFormInfoMessage", "");
		pageSession.set("coursesDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var coursesDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(coursesDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("coursesDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("courses.details", {coursesId: self.params.coursesId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("coursesDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				CourseStudents.update({ _id: t.data.course_student._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("courses.details", {coursesId: this.params.coursesId});
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

Template.CoursesDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("coursesDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("coursesDetailsEditEditFormErrorMessage");
	}
	
});
