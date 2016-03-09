var pageSession = new ReactiveDict();

Template.CoursesEdit.rendered = function() {
	
};

Template.CoursesEdit.events({
	
});

Template.CoursesEdit.helpers({
	
});

Template.CoursesEditEditForm.rendered = function() {
	

	pageSession.set("coursesEditEditFormInfoMessage", "");
	pageSession.set("coursesEditEditFormErrorMessage", "");

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

Template.CoursesEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("coursesEditEditFormInfoMessage", "");
		pageSession.set("coursesEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var coursesEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(coursesEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("coursesEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("courses", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("coursesEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Courses.update({ _id: t.data.course_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("courses", {});
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

Template.CoursesEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("coursesEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("coursesEditEditFormErrorMessage");
	}
	
});
