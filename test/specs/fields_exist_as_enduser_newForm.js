var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
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

	it('navigates to a new record form (incident.do), then verifies the existence of its fields', function(done){
		SNWindow.navToNewRecordForm('incident');
		Fields.setFormType('incident');
		var verify = [
			'caller_id', 'closed_at', 'comments',
			'impact', 'number', 'opened_at',
			'short_description', 'state',
		];
		verify.forEach(function(field){
			expect(Fields.exists(field)).to.be.true;
		});
	});
});