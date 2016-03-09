var pageSession = new ReactiveDict();

Template.ParentsInsert.rendered = function() {
	
};

Template.ParentsInsert.events({
	
});

Template.ParentsInsert.helpers({
	
});

Template.ParentsInsertInsertForm.rendered = function() {
	

	pageSession.set("parentsInsertInsertFormInfoMessage", "");
	pageSession.set("parentsInsertInsertFormErrorMessage", "");

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

Template.ParentsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("parentsInsertInsertFormInfoMessage", "");
		pageSession.set("parentsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var parentsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(parentsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("parentsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("parents", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("parentsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Parents.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ParentsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("parentsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("parentsInsertInsertFormErrorMessage");
	}
	
});
