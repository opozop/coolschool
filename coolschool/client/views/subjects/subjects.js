var pageSession = new ReactiveDict();

Template.Subjects.rendered = function() {
	
};

Template.Subjects.events({
	
});

Template.Subjects.helpers({
	
});

var SubjectsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("SubjectsViewSearchString");
	var sortBy = pageSession.get("SubjectsViewSortBy");
	var sortAscending = pageSession.get("SubjectsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["code", "name", "description"];
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

var SubjectsViewExport = function(cursor, fileType) {
	var data = SubjectsViewItems(cursor);
	var exportFields = ["code", "name", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.SubjectsView.rendered = function() {
	pageSession.set("SubjectsViewStyle", "table");
	
};

Template.SubjectsView.events({
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
				pageSession.set("SubjectsViewSearchString", searchString);
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
					pageSession.set("SubjectsViewSearchString", searchString);
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
					pageSession.set("SubjectsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("subjects.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		SubjectsViewExport(this.subject_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		SubjectsViewExport(this.subject_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		SubjectsViewExport(this.subject_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		SubjectsViewExport(this.subject_list, "json");
	}

	
});

Template.SubjectsView.helpers({

	"insertButtonClass": function() {
		return Subjects.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.subject_list || this.subject_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.subject_list && this.subject_list.count() > 0;
	},
	"isNotFound": function() {
		return this.subject_list && pageSession.get("SubjectsViewSearchString") && SubjectsViewItems(this.subject_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("SubjectsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("SubjectsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("SubjectsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("SubjectsViewStyle") == "gallery";
	}

	
});


Template.SubjectsViewTable.rendered = function() {
	
};

Template.SubjectsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("SubjectsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("SubjectsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("SubjectsViewSortAscending") || false;
			pageSession.set("SubjectsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("SubjectsViewSortAscending", true);
		}
	}
});

Template.SubjectsViewTable.helpers({
	"tableItems": function() {
		return SubjectsViewItems(this.subject_list);
	}
});


Template.SubjectsViewTableItems.rendered = function() {
	
};

Template.SubjectsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("subjects.details", {subjectId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Subjects.update({ _id: this._id }, { $set: values });

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
						Subjects.remove({ _id: me._id });
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
		Router.go("subjects.edit", {subjectId: this._id});
		return false;
	}
});

Template.SubjectsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Subjects.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Subjects.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
