this.YearsDetailsInsertController = RouteController.extend({
	template: "YearsDetails",
	

	yieldTemplates: {
		'YearsDetailsInsert': { to: 'YearsDetailsSubcontent'}
		
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
			Meteor.subscribe("year_event_empty"),
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
			year_event_empty: Events.findOne({_id:null}, {}),
			year_details: Years.findOne({_id:this.params.yearId}, {transform:function(doc) {  return doc; }})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});