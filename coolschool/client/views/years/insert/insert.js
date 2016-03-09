var pageSession = new ReactiveDict();

Template.YearsInsert.rendered = function() {
	
};

Template.YearsInsert.events({
	
});

Template.YearsInsert.helpers({
	
});

Template.YearsInsertInsertForm.rendered = function() {
	

	pageSession.set("yearsInsertInsertFormInfoMessage", "");
	pageSession.set("yearsInsertInsertFormErrorMessage", "");

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

Template.YearsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("yearsInsertInsertFormInfoMessage", "");
		pageSession.set("yearsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var yearsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(yearsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("yearsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("years", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("yearsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Years.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.YearsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("yearsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("yearsInsertInsertFormErrorMessage");
	}
	
});
