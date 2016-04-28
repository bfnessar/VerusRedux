/* NOT DONE, BUT WILL UPLOAD TO GITHUB */

var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;
var open_record_url = storage.stock_incidents.calledByEU_open;
var closed_record_url = storage.stock_incidents.calledByEU_closed;

describe('Verifies the presence of fields for existing records as an ITIL user', function() {
	this.timeout(0);

	it('calls the SNInterface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('Joe Employee');
	});

	it('navigates to an open record, then verifies the existence of its fields', function(done){
		SNWindow.navToExistingRecordForm(open_record_url);
		Fields.setFormType('incident');
		var verify = [ // What do about 'Additional Comments' field? Has a weird name, doesn't fit standard.
			'caller_id', 'closed_at', 'impact',
			'number', 'opened_at',
			'short_description', 'state',
		];
		verify.forEach(function(field) {
			expect(Fields.exists(field)).to.be.true;
		});
	});

	it('navigates to a closed record, then verifies the existence of its fields', function(done){
		SNWindow.navToExistingRecordForm(closed_record_url);
		var verify = [ // What do about 'Additional Comments' field? Has a weird name, doesn't fit standard.
			'caller_id', 'closed_at', 'impact',
			'number', 'opened_at',
			'short_description', 'state',
		];
		verify.forEach(function(field) {
			expect(Fields.exists(field)).to.be.true;
		});
	});
});
