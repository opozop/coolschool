var pageSession = new ReactiveDict();

Template.YearsDetailsCalendar.rendered = function() {
	
};

Template.YearsDetailsCalendar.events({
	
});

Template.YearsDetailsCalendar.helpers({
	
});

var YearsDetailsCalendarViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("YearsDetailsCalendarViewSearchString");
	var sortBy = pageSession.get("YearsDetailsCalendarViewSortBy");
	var sortAscending = pageSession.get("YearsDetailsCalendarViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "description", "public", "internal", "teachers", "staff", "students", "initialDate", "endDate", "notes"];
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

var YearsDetailsCalendarViewExport = function(cursor, fileType) {
	var data = YearsDetailsCalendarViewItems(cursor);
	var exportFields = ["name", "description", "public", "internal", "teachers", "staff", "students", "initialDate", "endDate", "notes"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.YearsDetailsCalendarView.rendered = function() {
	pageSession.set("YearsDetailsCalendarViewStyle", "table");
	
};

Template.YearsDetailsCalendarView.events({
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
				pageSession.set("YearsDetailsCalendarViewSearchString", searchString);
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
					pageSession.set("YearsDetailsCalendarViewSearchString", searchString);
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
					pageSession.set("YearsDetailsCalendarViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("years.details.insert", {yearId: this.params.yearId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		YearsDetailsCalendarViewExport(this.year_events, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		YearsDetailsCalendarViewExport(this.year_events, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		YearsDetailsCalendarViewExport(this.year_events, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		YearsDetailsCalendarViewExport(this.year_events, "json");
	}

	
});

Template.YearsDetailsCalendarView.helpers({

	"insertButtonClass": function() {
		return Events.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.year_events || this.year_events.count() == 0;
	},
	"isNotEmpty": function() {
		return this.year_events && this.year_events.count() > 0;
	},
	"isNotFound": function() {
		return this.year_events && pageSession.get("YearsDetailsCalendarViewSearchString") && YearsDetailsCalendarViewItems(this.year_events).length == 0;
	},
	"searchString": function() {
		return pageSession.get("YearsDetailsCalendarViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("YearsDetailsCalendarViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("YearsDetailsCalendarViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("YearsDetailsCalendarViewStyle") == "gallery";
	}

	
});


Template.YearsDetailsCalendarViewTable.rendered = function() {
	
};

Template.YearsDetailsCalendarViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("YearsDetailsCalendarViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("YearsDetailsCalendarViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("YearsDetailsCalendarViewSortAscending") || false;
			pageSession.set("YearsDetailsCalendarViewSortAscending", !sortAscending);
		} else {
			pageSession.set("YearsDetailsCalendarViewSortAscending", true);
		}
	}
});

Template.YearsDetailsCalendarViewTable.helpers({
	"tableItems": function() {
		return YearsDetailsCalendarViewItems(this.year_events);
	}
});


Template.YearsDetailsCalendarViewTableItems.rendered = function() {
	
};

Template.YearsDetailsCalendarViewTableItems.events({
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

		Events.update({ _id: this._id }, { $set: values });

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
						Events.remove({ _id: me._id });
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
		Router.go("years.details.edit", {yearId: UI._parentData(1).params.yearId, eventId: this._id});
		return false;
	}
});

Template.YearsDetailsCalendarViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Events.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Events.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
