var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var UIActions = require('../page_objects/UIActions.page.js');
var storage = require('../persistent_values.js');

var fields = storage.incident.fields.endUser;
var uiActions = storage.incident.uiActions.endUser;


describe('prepares to test elements', function() {
	this.timeout(0);
	it('impersonates the desired user, then navigates to a new incident form', function(){
		// SNWindow needs to know the url
		SNWindow.instance_url = storage.instance_url;
		SNWindow.impersonate("Joe Employee");
		SNWindow.navToNewRecordForm('incident');
		// The Fields object needs to know what the table name is
		Fields.setTable('incident');
	});
});

describe('Verifies fields on a new incident form from the perspective of an end user', function(){
	fields.forEach(function(field){
		it ('verifies that ' + field + ' exists', function(){
			expect(Fields.exists(field)).to.be.true;
		});

		it('verifies that ' + field + ' is visible', function(){
			expect(Fields.isVisible(field)).to.be.true;
		});
	});
});

describe('verifies UIActions on the new incident form from the perspective of an end user', function(){
	uiActions.forEach(function(action){
		it('verifies that ' + action.label + ' exists as a ' + action.click + ' item', function(){
			expect(UIActions.exists(action.label, action.click)).to.be.true;
		});
	});
});
