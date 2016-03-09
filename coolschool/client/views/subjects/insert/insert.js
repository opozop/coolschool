var pageSession = new ReactiveDict();

Template.SubjectsInsert.rendered = function() {
	
};

Template.SubjectsInsert.events({
	
});

Template.SubjectsInsert.helpers({
	
});

Template.SubjectsInsertInsertForm.rendered = function() {
	

	pageSession.set("subjectsInsertInsertFormInfoMessage", "");
	pageSession.set("subjectsInsertInsertFormErrorMessage", "");

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

Template.SubjectsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("subjectsInsertInsertFormInfoMessage", "");
		pageSession.set("subjectsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var subjectsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(subjectsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("subjectsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("subjects", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("subjectsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Subjects.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("subjects", {});
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

Template.SubjectsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("subjectsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("subjectsInsertInsertFormErrorMessage");
	}
	
});
