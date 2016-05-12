var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var UIActions = require('../page_objects/UIActions.page.js');
var storage = require('../persistent_values.js');

var fields = storage.incident.fields.itilUser;
var uiActions = storage.incident.uiActions.itilUser;
var closed_incident = storage.existing_incidents.itilUser_closed;

var field_exceptions = ["comments", "work_notes"];
// var uiAction_exceptions = ["submit"]

describe('prepares to test elements', function() {
	this.timeout(0);
	it('impersonates the desired user, then navigates to a a closed incident record', function(){
		// SNWindow needs to know the url
		SNWindow.instance_url = storage.instance_url;
		SNWindow.impersonate("ITIL user");
		SNWindow.navToExistingRecordForm(closed_incident);
		// The Fields object needs to know what the table name is
		Fields.setTable('incident');
	});
});

describe('Verifies fields on a new incident form from the perspective of an ITIL user', function(){
	fields.forEach(function(field){
		if (field_exceptions.indexOf(field) == -1) {
			it ('verifies that ' + field + ' exists', function(){
				expect(Fields.exists(field)).to.be.true;
			});
			it('verifies that ' + field + ' is visible', function(){
				expect(Fields.isVisible(field)).to.be.true;
			});
		};
	});
});

/**	There are no UI actions present on a closed incident	*/
// describe('verifies UIActions on the new incident form from the perspective of an ITIL user', function(){
// 	uiActions.forEach(function(action){
// 		// "submit" button won't exist on an already-submitted form
// 		if (uiAction_exceptions.indexOf(action.label) == -1) {
// 			it('verifies that ' + action.label + ' exists as a ' + action.click + ' item', function(){
// 				expect(UIActions.exists(action.label, action.click)).to.be.true;
// 			});
// 		};
// 	});
// });
