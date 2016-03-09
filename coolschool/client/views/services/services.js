var pageSession = new ReactiveDict();

Template.Services.rendered = function() {
	
};

Template.Services.events({
	
});

Template.Services.helpers({
	
});

var ServicesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ServicesViewSearchString");
	var sortBy = pageSession.get("ServicesViewSortBy");
	var sortAscending = pageSession.get("ServicesViewSortAscending");
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

var ServicesViewExport = function(cursor, fileType) {
	var data = ServicesViewItems(cursor);
	var exportFields = ["code", "name", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ServicesView.rendered = function() {
	pageSession.set("ServicesViewStyle", "table");
	
};

Template.ServicesView.events({
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
				pageSession.set("ServicesViewSearchString", searchString);
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
					pageSession.set("ServicesViewSearchString", searchString);
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
					pageSession.set("ServicesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("services.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ServicesViewExport(this.service_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ServicesViewExport(this.service_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ServicesViewExport(this.service_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ServicesViewExport(this.service_list, "json");
	}

	
});

Template.ServicesView.helpers({

	"insertButtonClass": function() {
		return Services.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.service_list || this.service_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.service_list && this.service_list.count() > 0;
	},
	"isNotFound": function() {
		return this.service_list && pageSession.get("ServicesViewSearchString") && ServicesViewItems(this.service_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ServicesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ServicesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ServicesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ServicesViewStyle") == "gallery";
	}

	
});


Template.ServicesViewTable.rendered = function() {
	
};

Template.ServicesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ServicesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ServicesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ServicesViewSortAscending") || false;
			pageSession.set("ServicesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ServicesViewSortAscending", true);
		}
	}
});

Template.ServicesViewTable.helpers({
	"tableItems": function() {
		return ServicesViewItems(this.service_list);
	}
});


Template.ServicesViewTableItems.rendered = function() {
	
};

Template.ServicesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("services.details", {serviceId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Services.update({ _id: this._id }, { $set: values });

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
						Services.remove({ _id: me._id });
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
		Router.go("services.edit", {serviceId: this._id});
		return false;
	}
});

Template.ServicesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Services.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Services.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
