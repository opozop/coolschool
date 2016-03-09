var pageSession = new ReactiveDict();

Template.ParentsEdit.rendered = function() {
	
};

Template.ParentsEdit.events({
	
});

Template.ParentsEdit.helpers({
	
});

Template.ParentsEditEditForm.rendered = function() {
	

	pageSession.set("parentsEditEditFormInfoMessage", "");
	pageSession.set("parentsEditEditFormErrorMessage", "");

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

Template.ParentsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("parentsEditEditFormInfoMessage", "");
		pageSession.set("parentsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var parentsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(parentsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("parentsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("parents", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("parentsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Parents.update({ _id: t.data.parent_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("parents", {});
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

Template.ParentsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("parentsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("parentsEditEditFormErrorMessage");
	}
	
});
