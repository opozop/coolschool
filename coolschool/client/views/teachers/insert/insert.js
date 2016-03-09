var pageSession = new ReactiveDict();

Template.TeachersInsert.rendered = function() {
	
};

Template.TeachersInsert.events({
	
});

Template.TeachersInsert.helpers({
	
});

Template.TeachersInsertInsertForm.rendered = function() {
	

	pageSession.set("teachersInsertInsertFormInfoMessage", "");
	pageSession.set("teachersInsertInsertFormErrorMessage", "");

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

Template.TeachersInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("teachersInsertInsertFormInfoMessage", "");
		pageSession.set("teachersInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var teachersInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(teachersInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("teachersInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("teachers", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("teachersInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Teachers.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.TeachersInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("teachersInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("teachersInsertInsertFormErrorMessage");
	}
	
});
