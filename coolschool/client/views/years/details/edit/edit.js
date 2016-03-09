var pageSession = new ReactiveDict();

Template.YearsDetailsEdit.rendered = function() {
	
};

Template.YearsDetailsEdit.events({
	
});

Template.YearsDetailsEdit.helpers({
	
});

Template.YearsDetailsEditEditForm.rendered = function() {
	

	pageSession.set("yearsDetailsEditEditFormInfoMessage", "");
	pageSession.set("yearsDetailsEditEditFormErrorMessage", "");

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

Template.YearsDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("yearsDetailsEditEditFormInfoMessage", "");
		pageSession.set("yearsDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var yearsDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(yearsDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("yearsDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("years.details", {yearId: self.params.yearId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("yearsDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Events.update({ _id: t.data.year_event._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("years.details", {yearId: this.params.yearId});
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

Template.YearsDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("yearsDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("yearsDetailsEditEditFormErrorMessage");
	}
	
});
