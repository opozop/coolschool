var pageSession = new ReactiveDict();

Template.ServicesInsert.rendered = function() {
	
};

Template.ServicesInsert.events({
	
});

Template.ServicesInsert.helpers({
	
});

Template.ServicesInsertInsertForm.rendered = function() {
	

	pageSession.set("servicesInsertInsertFormInfoMessage", "");
	pageSession.set("servicesInsertInsertFormErrorMessage", "");

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

Template.ServicesInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("servicesInsertInsertFormInfoMessage", "");
		pageSession.set("servicesInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var servicesInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(servicesInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("servicesInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("services", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("servicesInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Services.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("services", {});
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

Template.ServicesInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("servicesInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("servicesInsertInsertFormErrorMessage");
	}
	
});
