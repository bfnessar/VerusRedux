var SNWindow = require('../page_objects/SNInterface.page.js');
var UIActions = require('../page_objects/UIActions.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;

describe('Verifies the presence of fields on a new Incident form for an end user', function() {
	this.timeout(0);

	it('calls the SNInteface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('Joe Employee');
	});

	it('navigates to a new record form (incident.do), then verifies that the UI Actions are present', function(done){
		SNWindow.navToNewRecordForm('incident');
		UIActions.setFormType('incident');
		var verify_buttons = [
			['#sysverb_insert', 'form button'],
			['submit', 'button'],
			['#submit', 'form:button'],

			['#resolve_incident', 'form:button'],
			['resolve_incident', 'formButton'],
		];
		verify_buttons.forEach(function(target) {
			expect(UIActions.exists(target[0], target[1])).to.be.true;
		});

	});
});
