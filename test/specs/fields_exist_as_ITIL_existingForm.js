/* NOT DONE, BUT WILL UPLOAD TO GITHUB */

var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;
var open_record_url = storage.stock_incidents.calledByITIL_open;
var closed_record_url = storage.stock_incidents.calledByITIL_closed;

describe('just taking the new pages out for a spin', function() {
	this.timeout(0);

	it('calls the SNInterface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('ITIL user');
	});

	it('navigates to an open record, then verifies the existence of its fields', function(done){
		SNWindow.navToExistingRecordForm(open_record_url);
		Fields.setFormType('incident');
	});

	it('messes around with fields on the page', function(done){
		var verify = [ // Line-by line, alphabetically
			'assigned_to', 'assignment_group',
			'caller_id', 'category', 'caused_by', 'closed_at', 'closed_by_label', 
			'cmdb_ci', 'comments', 'contact_type',
			'impact', 'location', 'number',
			'opened_at', 'opened_by_label',
			'priority', 'problem_id', 'rfc',
			'short_description', 'state', 'subcategory',
			'urgency', 'work_notes',
		];
		// browser.debug();
		verify.forEach(function(field) {
			expect(Fields.exists(field)).to.be.true;
		});
	});

	

});
