var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var storage = require('../persistent_values.js');

var instance_url = storage.instance_url;
var username = storage.login_creds.username;
var password = storage.login_creds.password;

describe('just taking the new pages out for a spin', function() {
	this.timeout(0);

	it('calls the SNInterface page object, then logs in as admin', function(done){
		SNWindow.visitHomePage(instance_url);
		browser.login(username, password);
	});

	it('impersonates an end user', function(done){
		SNWindow.impersonate('ITIL user');
	});

	it('navigates to a New Incident form, then verifies the existence of its fields', function(done){
		SNWindow.navToNewRecordForm('incident');
	});

	it('messes around with fields on the page', function(done){
		Fields.setFormType('incident');
		var verify = [
				'caller_id', 'number', 'impact', 'state', 'opened_at',
				'closed_at', 'category', 'subcategory', 'urgency', 'priority',
				'opened_by_label', 'contact_type', 'assignment_group',
				'assigned_to', 'short_description', 'comments', 'work_notes',
			];
		verify.forEach(function(field) {
			expect(Fields.exists(field)).to.be.true;
		});
	});

});
