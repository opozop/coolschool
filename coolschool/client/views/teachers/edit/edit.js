var pageSession = new ReactiveDict();

Template.TeachersEdit.rendered = function() {
	
};

Template.TeachersEdit.events({
	
});

Template.TeachersEdit.helpers({
	
});

Template.TeachersEditEditForm.rendered = function() {
	

	pageSession.set("teachersEditEditFormInfoMessage", "");
	pageSession.set("teachersEditEditFormErrorMessage", "");

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

Template.TeachersEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("teachersEditEditFormInfoMessage", "");
		pageSession.set("teachersEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var teachersEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(teachersEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("teachersEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("teachers", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("teachersEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Teachers.update({ _id: t.data.teacher_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("teachers", {});
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

Template.TeachersEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("teachersEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("teachersEditEditFormErrorMessage");
	}
	
});
