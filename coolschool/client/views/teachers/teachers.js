var pageSession = new ReactiveDict();

Template.Teachers.rendered = function() {
	
};

Template.Teachers.events({
	
});

Template.Teachers.helpers({
	
});

var TeachersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("TeachersViewSearchString");
	var sortBy = pageSession.get("TeachersViewSortBy");
	var sortAscending = pageSession.get("TeachersViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["docId", "name", "fatherLastName", "motherLastName", "marriedName", "preferredName", "sortName", "birthDate", "gender", "phoneNumber", "emailAddress", "Experience"];
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

var TeachersViewExport = function(cursor, fileType) {
	var data = TeachersViewItems(cursor);
	var exportFields = ["docId", "name", "fatherLastName", "motherLastName", "marriedName", "preferredName", "sortName", "birthDate", "gender", "phoneNumber", "emailAddress", "Experience"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.TeachersView.rendered = function() {
	pageSession.set("TeachersViewStyle", "table");
	
};

Template.TeachersView.events({
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
				pageSession.set("TeachersViewSearchString", searchString);
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
					pageSession.set("TeachersViewSearchString", searchString);
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
					pageSession.set("TeachersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("teachers.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		TeachersViewExport(this.teacher_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		TeachersViewExport(this.teacher_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		TeachersViewExport(this.teacher_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		TeachersViewExport(this.teacher_list, "json");
	}

	
});

Template.TeachersView.helpers({

	"insertButtonClass": function() {
		return Teachers.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.teacher_list || this.teacher_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.teacher_list && this.teacher_list.count() > 0;
	},
	"isNotFound": function() {
		return this.teacher_list && pageSession.get("TeachersViewSearchString") && TeachersViewItems(this.teacher_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("TeachersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("TeachersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("TeachersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("TeachersViewStyle") == "gallery";
	}

	
});


Template.TeachersViewTable.rendered = function() {
	
};

Template.TeachersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("TeachersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("TeachersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("TeachersViewSortAscending") || false;
			pageSession.set("TeachersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("TeachersViewSortAscending", true);
		}
	}
});

Template.TeachersViewTable.helpers({
	"tableItems": function() {
		return TeachersViewItems(this.teacher_list);
	}
});


Template.TeachersViewTableItems.rendered = function() {
	
};

Template.TeachersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("teachers.details", {teacherId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Teachers.update({ _id: this._id }, { $set: values });

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
						Teachers.remove({ _id: me._id });
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
		Router.go("teachers.edit", {teacherId: this._id});
		return false;
	}
});

Template.TeachersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Teachers.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Teachers.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
