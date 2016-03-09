var pageSession = new ReactiveDict();

Template.YearsDetailsInsert.rendered = function() {
	
};

Template.YearsDetailsInsert.events({
	
});

Template.YearsDetailsInsert.helpers({
	
});

Template.YearsDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("yearsDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("yearsDetailsInsertInsertFormErrorMessage", "");

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

Template.YearsDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("yearsDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("yearsDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var yearsDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(yearsDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("yearsDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("years.details", {yearId: self.params.yearId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("yearsDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.yearId = self.params.yearId;

				newId = Events.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.YearsDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("yearsDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("yearsDetailsInsertInsertFormErrorMessage");
	}
	
});
