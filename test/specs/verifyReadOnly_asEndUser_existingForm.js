var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;
var open_record_url = storage.stock_incidents.calledByEU_open;
var closed_record_url = storage.stock_incidents.calledByEU_closed;

describe('Verifies the presence of fields on a new Incident form for an end user', function() {
	this.timeout(0);

	it('calls the SNInteface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('Joe Employee');
	});

	it('navigates to an existing, open record form, then verifies that its fields are read-only', function(done){
		SNWindow.navToExistingRecordForm(open_record_url);
		Fields.setFormType('incident');
		var verify = ['closed_at', 'number', 'opened_at', 'state'];
		verify.forEach(function(field) {
			expect(Fields.isReadOnly(field)).to.be.true;
		});
	});

	it('navigates to an existing, closed record form, then verifies that its fields are read-only', function(done){
		SNWindow.navToExistingRecordForm(closed_record_url);
		Fields.setFormType('incident');
		var verify = [
			'number', 'caller_id', 'opened_at', 'closed_at', 'impact', 'state', 'short_description',
		];
		verify.forEach(function(field){
			expect(Fields.isReadOnly(field)).to.be.true;
		});
	});

});
