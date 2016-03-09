this.CoursesDetailsInsertController = RouteController.extend({
	template: "CoursesDetails",
	

	yieldTemplates: {
		'CoursesDetailsInsert': { to: 'CoursesDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("CoursesDetails"); this.render("loading", { to: "CoursesDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("student_list"),
			Meteor.subscribe("course_students_empty"),
			Meteor.subscribe("course_details", this.params.courseId),
			Meteor.subscribe("year_list"),
			Meteor.subscribe("teacher_list"),
			Meteor.subscribe("service_list"),
			Meteor.subscribe("subject_list")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		return {
			params: this.params || {},
			student_list: Students.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]}),
			course_students_empty: CourseStudents.findOne({_id:null}, {}),
			course_details: Courses.findOne({_id:this.params.courseId}, {}),
			year_list: Years.find({}, {transform:function(doc) {  return doc; },sort:["year"]}),
			teacher_list: Teachers.find({}, {sort:[["fatherLastName","asc"],["name","asc"]]}),
			service_list: Services.find({}, {sort:[["code","asc"]]}),
			subject_list: Subjects.find({}, {sort:[["code","asc"]]})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});