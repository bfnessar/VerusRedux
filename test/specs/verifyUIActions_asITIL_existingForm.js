var SNWindow = require('../page_objects/SNInterface.page.js');
var UIActions = require('../page_objects/UIActions.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;
var open_incident_url = storage.stock_incidents.calledByITIL_open;
var closed_incident_url = storage.stock_incidents.calledByITIL_closed;


describe('Verifies the presence of fields on a new Incident form for an end user', function() {
	this.timeout(0);

	it('calls the SNInteface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('ITIL User');
	});

	it('navigates to an existing, open record form, then verifies that the UI actions are present', function(done){
		SNWindow.navToExistingRecordForm(open_incident_url);
		UIActions.setFormType('incident');
		// First round: Check the buttons
		var verify_buttons = [
			['#sysverb_update', 'form button'],
			['#connectFollow', 'button'],
			['connectFollow', 'BUTTON'],
			
			['#resolve_incident', 'form:button'],
			['resolve_incident', 'formButton'],
		];
		verify_buttons.forEach(function(target) {
			expect(UIActions.exists(target[0], target[1])).to.be.true;
		});
	});

	it('navigates to an existing, closed record form, then verifies that the UI actions are present', function(done){
		SNWindow.navToExistingRecordForm(closed_incident_url);
		UIActions.setFormType('incident');
		var verify_buttons = [
			['#connectFollow', 'button'],
		];
		verify_buttons.forEach(function(target) {
			expect(UIActions.exists(target[0], target[1])).to.be.true;
		});

	});

});
