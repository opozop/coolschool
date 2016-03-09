var pageSession = new ReactiveDict();

Template.Years.rendered = function() {
	
};

Template.Years.events({
	
});

Template.Years.helpers({
	
});

var YearsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("YearsViewSearchString");
	var sortBy = pageSession.get("YearsViewSortBy");
	var sortAscending = pageSession.get("YearsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["year", "name", "initialDate", "endDate"];
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

var YearsViewExport = function(cursor, fileType) {
	var data = YearsViewItems(cursor);
	var exportFields = ["year", "name", "initialDate", "endDate"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.YearsView.rendered = function() {
	pageSession.set("YearsViewStyle", "table");
	
};

Template.YearsView.events({
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
				pageSession.set("YearsViewSearchString", searchString);
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
					pageSession.set("YearsViewSearchString", searchString);
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
					pageSession.set("YearsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("years.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		YearsViewExport(this.year_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		YearsViewExport(this.year_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		YearsViewExport(this.year_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		YearsViewExport(this.year_list, "json");
	}

	
});

Template.YearsView.helpers({

	"insertButtonClass": function() {
		return Years.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.year_list || this.year_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.year_list && this.year_list.count() > 0;
	},
	"isNotFound": function() {
		return this.year_list && pageSession.get("YearsViewSearchString") && YearsViewItems(this.year_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("YearsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("YearsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("YearsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("YearsViewStyle") == "gallery";
	}

	
});


Template.YearsViewTable.rendered = function() {
	
};

Template.YearsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("YearsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("YearsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("YearsViewSortAscending") || false;
			pageSession.set("YearsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("YearsViewSortAscending", true);
		}
	}
});

Template.YearsViewTable.helpers({
	"tableItems": function() {
		return YearsViewItems(this.year_list);
	}
});


Template.YearsViewTableItems.rendered = function() {
	
};

Template.YearsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("years.details", {yearId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Years.update({ _id: this._id }, { $set: values });

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
						Years.remove({ _id: me._id });
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
		Router.go("years.edit", {yearId: this._id});
		return false;
	}
});

Template.YearsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Years.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Years.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
