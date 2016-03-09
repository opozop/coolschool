var pageSession = new ReactiveDict();

Template.CoursesDetailsSignedUpStudents.rendered = function() {
	
};

Template.CoursesDetailsSignedUpStudents.events({
	
});

Template.CoursesDetailsSignedUpStudents.helpers({
	
});

var CoursesDetailsSignedUpStudentsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("CoursesDetailsSignedUpStudentsViewSearchString");
	var sortBy = pageSession.get("CoursesDetailsSignedUpStudentsViewSortBy");
	var sortAscending = pageSession.get("CoursesDetailsSignedUpStudentsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["studentId", "student.sortName"];
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

var CoursesDetailsSignedUpStudentsViewExport = function(cursor, fileType) {
	var data = CoursesDetailsSignedUpStudentsViewItems(cursor);
	var exportFields = ["studentId", "student.sortName"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.CoursesDetailsSignedUpStudentsView.rendered = function() {
	pageSession.set("CoursesDetailsSignedUpStudentsViewStyle", "table");
	
};

Template.CoursesDetailsSignedUpStudentsView.events({
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
				pageSession.set("CoursesDetailsSignedUpStudentsViewSearchString", searchString);
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
					pageSession.set("CoursesDetailsSignedUpStudentsViewSearchString", searchString);
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
					pageSession.set("CoursesDetailsSignedUpStudentsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("courses.details.insert", {courseId: this.params.courseId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		CoursesDetailsSignedUpStudentsViewExport(this.course_students, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		CoursesDetailsSignedUpStudentsViewExport(this.course_students, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		CoursesDetailsSignedUpStudentsViewExport(this.course_students, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		CoursesDetailsSignedUpStudentsViewExport(this.course_students, "json");
	}

	
});

Template.CoursesDetailsSignedUpStudentsView.helpers({

	"insertButtonClass": function() {
		return CourseStudents.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.course_students || this.course_students.count() == 0;
	},
	"isNotEmpty": function() {
		return this.course_students && this.course_students.count() > 0;
	},
	"isNotFound": function() {
		return this.course_students && pageSession.get("CoursesDetailsSignedUpStudentsViewSearchString") && CoursesDetailsSignedUpStudentsViewItems(this.course_students).length == 0;
	},
	"searchString": function() {
		return pageSession.get("CoursesDetailsSignedUpStudentsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("CoursesDetailsSignedUpStudentsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("CoursesDetailsSignedUpStudentsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("CoursesDetailsSignedUpStudentsViewStyle") == "gallery";
	}

	
});


Template.CoursesDetailsSignedUpStudentsViewTable.rendered = function() {
	
};

Template.CoursesDetailsSignedUpStudentsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("CoursesDetailsSignedUpStudentsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("CoursesDetailsSignedUpStudentsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("CoursesDetailsSignedUpStudentsViewSortAscending") || false;
			pageSession.set("CoursesDetailsSignedUpStudentsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("CoursesDetailsSignedUpStudentsViewSortAscending", true);
		}
	}
});

Template.CoursesDetailsSignedUpStudentsViewTable.helpers({
	"tableItems": function() {
		return CoursesDetailsSignedUpStudentsViewItems(this.course_students);
	}
});


Template.CoursesDetailsSignedUpStudentsViewTableItems.rendered = function() {
	
};

Template.CoursesDetailsSignedUpStudentsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		CourseStudents.update({ _id: this._id }, { $set: values });

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
						CourseStudents.remove({ _id: me._id });
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
		Router.go("courses.details.edit", {courseId: UI._parentData(1).params.courseId, course_studentId: this._id});
		return false;
	}
});

Template.CoursesDetailsSignedUpStudentsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return CourseStudents.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return CourseStudents.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
