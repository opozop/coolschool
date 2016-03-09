Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = [
	"home_public",
	"login",
	"register",
	"forgot_password",
	"reset_password"
];

var privateRoutes = [
	"home_private",
	"dashboard",
	"years",
	"years.insert",
	"years.details",
	"years.details.calendar",
	"years.details.insert",
	"years.details.edit",
	"years.edit",
	"services",
	"services.insert",
	"services.details",
	"services.edit",
	"subjects",
	"subjects.insert",
	"subjects.details",
	"subjects.edit",
	"courses",
	"courses.insert",
	"courses.details",
	"courses.details.signed_up_students",
	"courses.details.insert",
	"courses.details.edit",
	"courses.edit",
	"teachers",
	"teachers.insert",
	"teachers.details",
	"teachers.edit",
	"parents",
	"parents.insert",
	"parents.details",
	"parents.edit",
	"students",
	"students.insert",
	"students.details",
	"students.details.relatives",
	"students.details.insert",
	"students.details.edit",
	"students.edit",
	"admin",
	"admin.users",
	"admin.users.details",
	"admin.users.insert",
	"admin.users.edit",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"logout"
];

var freeRoutes = [
	
];

var roleMap = [
	{ route: "admin",	roles: ["admin"] },
	{ route: "admin.users",	roles: ["admin"] },
	{ route: "admin.users.details",	roles: ["admin"] },
	{ route: "admin.users.insert",	roles: ["admin"] },
	{ route: "admin.users.edit",	roles: ["admin"] },
	{ route: "user_settings",	roles: ["guest","user","admin"] },
	{ route: "user_settings.profile",	roles: ["guest","user","admin"] },
	{ route: "user_settings.change_pass",	roles: ["guest","user","admin"] }
];

this.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		var redirectRoute = firstGrantedRoute("home_public");
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute = firstGrantedRoute("home_private");
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute("home_private");
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Router.waitOn(function() { 
	Meteor.subscribe("current_user_data");
});

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		this.render('loading');
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles

Router.map(function () {
	
	this.route("home_public", {path: "/", controller: "HomePublicController"});
	this.route("login", {path: "/login", controller: "LoginController"});
	this.route("register", {path: "/register", controller: "RegisterController"});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController"});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController"});
	this.route("home_private", {path: "/home_private", controller: "HomePrivateController"});
	this.route("dashboard", {path: "/dashboard", controller: "DashboardController"});
	this.route("years", {path: "/years", controller: "YearsController"});
	this.route("years.insert", {path: "/years/insert", controller: "YearsInsertController"});
	this.route("years.details", {path: "/years/details/:yearId", controller: "YearsDetailsController"});
	this.route("years.details.calendar", {path: "/years/details/:yearId/calendar", controller: "YearsDetailsCalendarController"});
	this.route("years.details.insert", {path: "/years/details/:yearId/insert", controller: "YearsDetailsInsertController"});
	this.route("years.details.edit", {path: "/years/details/:yearId/edit/:yearId", controller: "YearsDetailsEditController"});
	this.route("years.edit", {path: "/years/edit/:yearId", controller: "YearsEditController"});
	this.route("services", {path: "/services", controller: "ServicesController"});
	this.route("services.insert", {path: "/services/insert", controller: "ServicesInsertController"});
	this.route("services.details", {path: "/services/details/:serviceId", controller: "ServicesDetailsController"});
	this.route("services.edit", {path: "/services/edit/:serviceId", controller: "ServicesEditController"});
	this.route("subjects", {path: "/subjects", controller: "SubjectsController"});
	this.route("subjects.insert", {path: "/subjects/insert", controller: "SubjectsInsertController"});
	this.route("subjects.details", {path: "/subjects/details/:subjectId", controller: "SubjectsDetailsController"});
	this.route("subjects.edit", {path: "/subjects/edit/:subjectId", controller: "SubjectsEditController"});
	this.route("courses", {path: "/courses", controller: "CoursesController"});
	this.route("courses.insert", {path: "/courses/insert", controller: "CoursesInsertController"});
	this.route("courses.details", {path: "/courses/details/:courseId", controller: "CoursesDetailsController"});
	this.route("courses.details.signed_up_students", {path: "/courses/details/:courseId/signed_up_students", controller: "CoursesDetailsSignedUpStudentsController"});
	this.route("courses.details.insert", {path: "/courses/details/:courseId/insert", controller: "CoursesDetailsInsertController"});
	this.route("courses.details.edit", {path: "/courses/details/:courseId/edit/:courseId", controller: "CoursesDetailsEditController"});
	this.route("courses.edit", {path: "/courses/edit/:courseId", controller: "CoursesEditController"});
	this.route("teachers", {path: "/teachers", controller: "TeachersController"});
	this.route("teachers.insert", {path: "/teachers/insert", controller: "TeachersInsertController"});
	this.route("teachers.details", {path: "/teachers/details/:teacherId", controller: "TeachersDetailsController"});
	this.route("teachers.edit", {path: "/teachers/edit/:teacherId", controller: "TeachersEditController"});
	this.route("parents", {path: "/parents", controller: "ParentsController"});
	this.route("parents.insert", {path: "/parents/insert", controller: "ParentsInsertController"});
	this.route("parents.details", {path: "/parents/details/:parentId", controller: "ParentsDetailsController"});
	this.route("parents.edit", {path: "/parents/edit/:parentId", controller: "ParentsEditController"});
	this.route("students", {path: "/students", controller: "StudentsController"});
	this.route("students.insert", {path: "/students/insert", controller: "StudentsInsertController"});
	this.route("students.details", {path: "/students/details/:studentId", controller: "StudentsDetailsController"});
	this.route("students.details.relatives", {path: "/students/details/:studentId/relatives", controller: "StudentsDetailsRelativesController"});
	this.route("students.details.insert", {path: "/students/details/:studentId/insert", controller: "StudentsDetailsInsertController"});
	this.route("students.details.edit", {path: "/students/details/:studentId/edit/:studentId", controller: "StudentsDetailsEditController"});
	this.route("students.edit", {path: "/students/edit/:studentId", controller: "StudentsEditController"});
	this.route("admin", {path: "/admin", controller: "AdminController"});
	this.route("admin.users", {path: "/admin/users", controller: "AdminUsersController"});
	this.route("admin.users.details", {path: "/admin/users/details/:userId", controller: "AdminUsersDetailsController"});
	this.route("admin.users.insert", {path: "/admin/users/insert", controller: "AdminUsersInsertController"});
	this.route("admin.users.edit", {path: "/admin/users/edit/:userId", controller: "AdminUsersEditController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
