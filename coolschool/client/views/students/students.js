var pageSession = new ReactiveDict();

Template.Students.rendered = function() {
	
};

Template.Students.events({
	
});

Template.Students.helpers({
	
});

var StudentsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("StudentsViewSearchString");
	var sortBy = pageSession.get("StudentsViewSortBy");
	var sortAscending = pageSession.get("StudentsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "fatherLastName", "motherLastName", "preferredName", "sortName", "birthDate", "gender", "phoneNumber"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var StudentsViewExport = function(cursor, fileType) {
	var data = StudentsViewItems(cursor);
	var exportFields = ["name", "fatherLastName", "motherLastName", "preferredName", "sortName", "birthDate", "gender", "phoneNumber"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.StudentsView.rendered = function() {
	pageSession.set("StudentsViewStyle", "table");
	
};

Template.StudentsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("StudentsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("StudentsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("StudentsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("students.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		StudentsViewExport(this.student_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		StudentsViewExport(this.student_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		StudentsViewExport(this.student_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		StudentsViewExport(this.student_list, "json");
	}

	
});

Template.StudentsView.helpers({

	"insertButtonClass": function() {
		return Students.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.student_list || this.student_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.student_list && this.student_list.count() > 0;
	},
	"isNotFound": function() {
		return this.student_list && pageSession.get("StudentsViewSearchString") && StudentsViewItems(this.student_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("StudentsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("StudentsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("StudentsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("StudentsViewStyle") == "gallery";
	}

	
});


Template.StudentsViewTable.rendered = function() {
	
};

Template.StudentsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("StudentsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("StudentsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("StudentsViewSortAscending") || false;
			pageSession.set("StudentsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("StudentsViewSortAscending", true);
		}
	}
});

Template.StudentsViewTable.helpers({
	"tableItems": function() {
		return StudentsViewItems(this.student_list);
	}
});


Template.StudentsViewTableItems.rendered = function() {
	
};

Template.StudentsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("students.details", {studentId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Students.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Students.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("students.edit", {studentId: this._id});
		return false;
	}
});

Template.StudentsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Students.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Students.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
