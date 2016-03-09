var pageSession = new ReactiveDict();

Template.Dashboard.rendered = function() {
	
};

Template.Dashboard.events({
	
});

Template.Dashboard.helpers({
	
});

var DashboardStudentsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("DashboardStudentsViewSearchString");
	var sortBy = pageSession.get("DashboardStudentsViewSortBy");
	var sortAscending = pageSession.get("DashboardStudentsViewSortAscending");
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

var DashboardStudentsViewExport = function(cursor, fileType) {
	var data = DashboardStudentsViewItems(cursor);
	var exportFields = ["name", "fatherLastName", "motherLastName", "preferredName", "sortName", "birthDate", "gender", "phoneNumber"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.DashboardStudentsView.rendered = function() {
	pageSession.set("DashboardStudentsViewStyle", "table");
	
};

Template.DashboardStudentsView.events({
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
				pageSession.set("DashboardStudentsViewSearchString", searchString);
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
					pageSession.set("DashboardStudentsViewSearchString", searchString);
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
					pageSession.set("DashboardStudentsViewSearchString", "");
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
		DashboardStudentsViewExport(this.student_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		DashboardStudentsViewExport(this.student_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		DashboardStudentsViewExport(this.student_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		DashboardStudentsViewExport(this.student_list, "json");
	}

	
});

Template.DashboardStudentsView.helpers({

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
		return this.student_list && pageSession.get("DashboardStudentsViewSearchString") && DashboardStudentsViewItems(this.student_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("DashboardStudentsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("DashboardStudentsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("DashboardStudentsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("DashboardStudentsViewStyle") == "gallery";
	}

	
});


Template.DashboardStudentsViewTable.rendered = function() {
	
};

Template.DashboardStudentsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("DashboardStudentsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("DashboardStudentsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("DashboardStudentsViewSortAscending") || false;
			pageSession.set("DashboardStudentsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("DashboardStudentsViewSortAscending", true);
		}
	}
});

Template.DashboardStudentsViewTable.helpers({
	"tableItems": function() {
		return DashboardStudentsViewItems(this.student_list);
	}
});


Template.DashboardStudentsViewTableItems.rendered = function() {
	
};

Template.DashboardStudentsViewTableItems.events({
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

Template.DashboardStudentsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Students.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Students.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var DashboardCoursesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("DashboardCoursesViewSearchString");
	var sortBy = pageSession.get("DashboardCoursesViewSortBy");
	var sortAscending = pageSession.get("DashboardCoursesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["yearId", "year.year", "serviceId", "service.name", "service.code", "subjectId", "subject.name", "subject.code", "code", "description", "teacherId", "teacher.sortName"];
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

var DashboardCoursesViewExport = function(cursor, fileType) {
	var data = DashboardCoursesViewItems(cursor);
	var exportFields = ["yearId", "year.year", "serviceId", "service.name", "service.code", "subjectId", "subject.name", "subject.code", "code", "description", "teacherId", "teacher.sortName"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.DashboardCoursesView.rendered = function() {
	pageSession.set("DashboardCoursesViewStyle", "table");
	
};

Template.DashboardCoursesView.events({
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
				pageSession.set("DashboardCoursesViewSearchString", searchString);
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
					pageSession.set("DashboardCoursesViewSearchString", searchString);
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
					pageSession.set("DashboardCoursesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("courses.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		DashboardCoursesViewExport(this.course_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		DashboardCoursesViewExport(this.course_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		DashboardCoursesViewExport(this.course_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		DashboardCoursesViewExport(this.course_list, "json");
	}

	
});

Template.DashboardCoursesView.helpers({

	"insertButtonClass": function() {
		return Courses.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.course_list || this.course_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.course_list && this.course_list.count() > 0;
	},
	"isNotFound": function() {
		return this.course_list && pageSession.get("DashboardCoursesViewSearchString") && DashboardCoursesViewItems(this.course_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("DashboardCoursesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("DashboardCoursesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("DashboardCoursesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("DashboardCoursesViewStyle") == "gallery";
	}

	
});


Template.DashboardCoursesViewTable.rendered = function() {
	
};

Template.DashboardCoursesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("DashboardCoursesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("DashboardCoursesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("DashboardCoursesViewSortAscending") || false;
			pageSession.set("DashboardCoursesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("DashboardCoursesViewSortAscending", true);
		}
	}
});

Template.DashboardCoursesViewTable.helpers({
	"tableItems": function() {
		return DashboardCoursesViewItems(this.course_list);
	}
});


Template.DashboardCoursesViewTableItems.rendered = function() {
	
};

Template.DashboardCoursesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("courses.details", {courseId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Courses.update({ _id: this._id }, { $set: values });

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
						Courses.remove({ _id: me._id });
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
		Router.go("courses.edit", {courseId: this._id});
		return false;
	}
});

Template.DashboardCoursesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Courses.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Courses.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var DashboardYearViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("DashboardYearViewSearchString");
	var sortBy = pageSession.get("DashboardYearViewSortBy");
	var sortAscending = pageSession.get("DashboardYearViewSortAscending");
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

var DashboardYearViewExport = function(cursor, fileType) {
	var data = DashboardYearViewItems(cursor);
	var exportFields = ["year", "name", "initialDate", "endDate"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.DashboardYearView.rendered = function() {
	pageSession.set("DashboardYearViewStyle", "table");
	
};

Template.DashboardYearView.events({
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
				pageSession.set("DashboardYearViewSearchString", searchString);
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
					pageSession.set("DashboardYearViewSearchString", searchString);
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
					pageSession.set("DashboardYearViewSearchString", "");
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
		DashboardYearViewExport(this.year_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		DashboardYearViewExport(this.year_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		DashboardYearViewExport(this.year_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		DashboardYearViewExport(this.year_list, "json");
	}

	
});

Template.DashboardYearView.helpers({

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
		return this.year_list && pageSession.get("DashboardYearViewSearchString") && DashboardYearViewItems(this.year_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("DashboardYearViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("DashboardYearViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("DashboardYearViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("DashboardYearViewStyle") == "gallery";
	}

	
});


Template.DashboardYearViewTable.rendered = function() {
	
};

Template.DashboardYearViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("DashboardYearViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("DashboardYearViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("DashboardYearViewSortAscending") || false;
			pageSession.set("DashboardYearViewSortAscending", !sortAscending);
		} else {
			pageSession.set("DashboardYearViewSortAscending", true);
		}
	}
});

Template.DashboardYearViewTable.helpers({
	"tableItems": function() {
		return DashboardYearViewItems(this.year_list);
	}
});


Template.DashboardYearViewTableItems.rendered = function() {
	
};

Template.DashboardYearViewTableItems.events({
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

Template.DashboardYearViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Years.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Years.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var DashboardServiceViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("DashboardServiceViewSearchString");
	var sortBy = pageSession.get("DashboardServiceViewSortBy");
	var sortAscending = pageSession.get("DashboardServiceViewSortAscending");
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

var DashboardServiceViewExport = function(cursor, fileType) {
	var data = DashboardServiceViewItems(cursor);
	var exportFields = ["code", "name", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.DashboardServiceView.rendered = function() {
	pageSession.set("DashboardServiceViewStyle", "table");
	
};

Template.DashboardServiceView.events({
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
				pageSession.set("DashboardServiceViewSearchString", searchString);
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
					pageSession.set("DashboardServiceViewSearchString", searchString);
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
					pageSession.set("DashboardServiceViewSearchString", "");
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
		DashboardServiceViewExport(this.service_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		DashboardServiceViewExport(this.service_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		DashboardServiceViewExport(this.service_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		DashboardServiceViewExport(this.service_list, "json");
	}

	
});

Template.DashboardServiceView.helpers({

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
		return this.service_list && pageSession.get("DashboardServiceViewSearchString") && DashboardServiceViewItems(this.service_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("DashboardServiceViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("DashboardServiceViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("DashboardServiceViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("DashboardServiceViewStyle") == "gallery";
	}

	
});


Template.DashboardServiceViewTable.rendered = function() {
	
};

Template.DashboardServiceViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("DashboardServiceViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("DashboardServiceViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("DashboardServiceViewSortAscending") || false;
			pageSession.set("DashboardServiceViewSortAscending", !sortAscending);
		} else {
			pageSession.set("DashboardServiceViewSortAscending", true);
		}
	}
});

Template.DashboardServiceViewTable.helpers({
	"tableItems": function() {
		return DashboardServiceViewItems(this.service_list);
	}
});


Template.DashboardServiceViewTableItems.rendered = function() {
	
};

Template.DashboardServiceViewTableItems.events({
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

Template.DashboardServiceViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Services.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Services.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});

var DashboardSubjectsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("DashboardSubjectsViewSearchString");
	var sortBy = pageSession.get("DashboardSubjectsViewSortBy");
	var sortAscending = pageSession.get("DashboardSubjectsViewSortAscending");
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

var DashboardSubjectsViewExport = function(cursor, fileType) {
	var data = DashboardSubjectsViewItems(cursor);
	var exportFields = ["code", "name", "description"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.DashboardSubjectsView.rendered = function() {
	pageSession.set("DashboardSubjectsViewStyle", "table");
	
};

Template.DashboardSubjectsView.events({
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
				pageSession.set("DashboardSubjectsViewSearchString", searchString);
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
					pageSession.set("DashboardSubjectsViewSearchString", searchString);
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
					pageSession.set("DashboardSubjectsViewSearchString", "");
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
		DashboardSubjectsViewExport(this.subject_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		DashboardSubjectsViewExport(this.subject_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		DashboardSubjectsViewExport(this.subject_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		DashboardSubjectsViewExport(this.subject_list, "json");
	}

	
});

Template.DashboardSubjectsView.helpers({

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
		return this.subject_list && pageSession.get("DashboardSubjectsViewSearchString") && DashboardSubjectsViewItems(this.subject_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("DashboardSubjectsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("DashboardSubjectsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("DashboardSubjectsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("DashboardSubjectsViewStyle") == "gallery";
	}

	
});


Template.DashboardSubjectsViewTable.rendered = function() {
	
};

Template.DashboardSubjectsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("DashboardSubjectsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("DashboardSubjectsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("DashboardSubjectsViewSortAscending") || false;
			pageSession.set("DashboardSubjectsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("DashboardSubjectsViewSortAscending", true);
		}
	}
});

Template.DashboardSubjectsViewTable.helpers({
	"tableItems": function() {
		return DashboardSubjectsViewItems(this.subject_list);
	}
});


Template.DashboardSubjectsViewTableItems.rendered = function() {
	
};

Template.DashboardSubjectsViewTableItems.events({
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

Template.DashboardSubjectsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Subjects.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Subjects.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
