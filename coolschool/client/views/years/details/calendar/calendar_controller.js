this.YearsDetailsCalendarController = RouteController.extend({
	template: "YearsDetails",
	

	yieldTemplates: {
		'YearsDetailsCalendar': { to: 'YearsDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("YearsDetails"); this.render("loading", { to: "YearsDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("year_events", this.params.yearId),
			Meteor.subscribe("year_details", this.params.yearId)
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
			year_events: Events.find({yearId:this.params.yearId}, {}),
			year_details: Years.findOne({_id:this.params.yearId}, {transform:function(doc) {  return doc; }})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});