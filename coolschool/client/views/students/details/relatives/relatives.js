var pageSession = new ReactiveDict();

Template.StudentsDetailsRelatives.rendered = function() {
	
};

Template.StudentsDetailsRelatives.events({
	
});

Template.StudentsDetailsRelatives.helpers({
	
});

var StudentsDetailsRelativesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("StudentsDetailsRelativesViewSearchString");
	var sortBy = pageSession.get("StudentsDetailsRelativesViewSortBy");
	var sortAscending = pageSession.get("StudentsDetailsRelativesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["relationShip", "parentId", "relative.sortName", "canPickUpChild", "sendNotifications", "emergencyPerson"];
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

var StudentsDetailsRelativesViewExport = function(cursor, fileType) {
	var data = StudentsDetailsRelativesViewItems(cursor);
	var exportFields = ["relationShip", "relative.sortName", "canPickUpChild", "sendNotifications", "emergencyPerson"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.StudentsDetailsRelativesView.rendered = function() {
	pageSession.set("StudentsDetailsRelativesViewStyle", "table");
	
};

Template.StudentsDetailsRelativesView.events({
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
				pageSession.set("StudentsDetailsRelativesViewSearchString", searchString);
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
					pageSession.set("StudentsDetailsRelativesViewSearchString", searchString);
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
					pageSession.set("StudentsDetailsRelativesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("students.details.insert", {studentId: this.params.studentId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		StudentsDetailsRelativesViewExport(this.relatives, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		StudentsDetailsRelativesViewExport(this.relatives, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		StudentsDetailsRelativesViewExport(this.relatives, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		StudentsDetailsRelativesViewExport(this.relatives, "json");
	}

	
});

Template.StudentsDetailsRelativesView.helpers({

	"insertButtonClass": function() {
		return Relatives.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.relatives || this.relatives.count() == 0;
	},
	"isNotEmpty": function() {
		return this.relatives && this.relatives.count() > 0;
	},
	"isNotFound": function() {
		return this.relatives && pageSession.get("StudentsDetailsRelativesViewSearchString") && StudentsDetailsRelativesViewItems(this.relatives).length == 0;
	},
	"searchString": function() {
		return pageSession.get("StudentsDetailsRelativesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("StudentsDetailsRelativesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("StudentsDetailsRelativesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("StudentsDetailsRelativesViewStyle") == "gallery";
	}

	
});


Template.StudentsDetailsRelativesViewTable.rendered = function() {
	
};

Template.StudentsDetailsRelativesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("StudentsDetailsRelativesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("StudentsDetailsRelativesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("StudentsDetailsRelativesViewSortAscending") || false;
			pageSession.set("StudentsDetailsRelativesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("StudentsDetailsRelativesViewSortAscending", true);
		}
	}
});

Template.StudentsDetailsRelativesViewTable.helpers({
	"tableItems": function() {
		return StudentsDetailsRelativesViewItems(this.relatives);
	}
});


Template.StudentsDetailsRelativesViewTableItems.rendered = function() {
	
};

Template.StudentsDetailsRelativesViewTableItems.events({
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

		Relatives.update({ _id: this._id }, { $set: values });

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
						Relatives.remove({ _id: me._id });
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
		Router.go("students.details.edit", {studentId: UI._parentData(1).params.studentId, relativeId: this._id});
		return false;
	}
});

Template.StudentsDetailsRelativesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Relatives.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Relatives.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
