var SNWindow = require('../page_objects/SNInterface.page.js');
var UIActions = require('../page_objects/UIActions.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;
var open_incident_url = storage.stock_incidents.calledByITIL_open;


describe('Verifies the presence of fields on a new Incident form for an end user', function() {
	this.timeout(0);

	it('calls the SNInteface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('ITIL User');
	});

	it('navigates to an existing, open record form', function(done){
		SNWindow.navToExistingRecordForm(open_incident_url);
		UIActions.setFormType('incident');
	});

	it('verifies that the UIAction Buttons are present: ', function(done){
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

	it('verifies that the UIAction ContextMenu items are present: ', function(done){
		var verify_contexts = [
			"Save",
			"Create Problem",
			"Create Request",
			"Create Normal Change",
			"Create Emergency Change",
			"Copy URL",
			"Reload Form",
		];

		verify_contexts.forEach(function(target) {
			expect(UIActions.exists(target, "context menu")).to.be.true;
		});
	});

	it('verifies that the UIAction Links are present', function(done){
		var verify_links = [
			"Create Problem",
			"Print Preview",
		];

		verify_links.forEach(function(target){
			expect(UIActions.exists(target, "link")).to.be.true;
		});
	});

});
