var pageSession = new ReactiveDict();

Template.YearsEdit.rendered = function() {
	
};

Template.YearsEdit.events({
	
});

Template.YearsEdit.helpers({
	
});

Template.YearsEditEditForm.rendered = function() {
	

	pageSession.set("yearsEditEditFormInfoMessage", "");
	pageSession.set("yearsEditEditFormErrorMessage", "");

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

Template.YearsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("yearsEditEditFormInfoMessage", "");
		pageSession.set("yearsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var yearsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(yearsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("yearsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("years", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("yearsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Years.update({ _id: t.data.year_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("years", {});
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

Template.YearsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("yearsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("yearsEditEditFormErrorMessage");
	}
	
});
