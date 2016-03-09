var pageSession = new ReactiveDict();

Template.Parents.rendered = function() {
	
};

Template.Parents.events({
	
});

Template.Parents.helpers({
	
});

var ParentsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ParentsViewSearchString");
	var sortBy = pageSession.get("ParentsViewSortBy");
	var sortAscending = pageSession.get("ParentsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "fatherLastName", "motherLastName", "sortName", "birthDate", "gender", "phoneNumber", "emailAddress", "notes"];
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

var ParentsViewExport = function(cursor, fileType) {
	var data = ParentsViewItems(cursor);
	var exportFields = ["name", "fatherLastName", "motherLastName", "sortName", "birthDate", "gender", "phoneNumber", "emailAddress", "notes"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ParentsView.rendered = function() {
	pageSession.set("ParentsViewStyle", "table");
	
};

Template.ParentsView.events({
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
				pageSession.set("ParentsViewSearchString", searchString);
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
					pageSession.set("ParentsViewSearchString", searchString);
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
					pageSession.set("ParentsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("parents.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ParentsViewExport(this.parent_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ParentsViewExport(this.parent_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ParentsViewExport(this.parent_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ParentsViewExport(this.parent_list, "json");
	}

	
});

Template.ParentsView.helpers({

	"insertButtonClass": function() {
		return Parents.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.parent_list || this.parent_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.parent_list && this.parent_list.count() > 0;
	},
	"isNotFound": function() {
		return this.parent_list && pageSession.get("ParentsViewSearchString") && ParentsViewItems(this.parent_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ParentsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ParentsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ParentsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ParentsViewStyle") == "gallery";
	}

	
});


Template.ParentsViewTable.rendered = function() {
	
};

Template.ParentsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ParentsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ParentsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ParentsViewSortAscending") || false;
			pageSession.set("ParentsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ParentsViewSortAscending", true);
		}
	}
});

Template.ParentsViewTable.helpers({
	"tableItems": function() {
		return ParentsViewItems(this.parent_list);
	}
});


Template.ParentsViewTableItems.rendered = function() {
	
};

Template.ParentsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("parents.details", {parentId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Parents.update({ _id: this._id }, { $set: values });

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
						Parents.remove({ _id: me._id });
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
		Router.go("parents.edit", {parentId: this._id});
		return false;
	}
});

Template.ParentsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Parents.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Parents.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
