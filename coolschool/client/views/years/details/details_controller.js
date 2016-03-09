this.YearsDetailsController = RouteController.extend({
	template: "YearsDetails",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		this.redirect('years.details.calendar', this.params || {}, { replaceState: true });
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
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
			year_details: Years.findOne({_id:this.params.yearId}, {transform:function(doc) {  return doc; }})
		};
		/*DATA_FUNCTION*/
	},

	onAfterAction: function() {
		
	}
});