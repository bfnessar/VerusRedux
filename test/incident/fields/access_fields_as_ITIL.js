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

		var report = []
		// Just outputs the field values
		report.push("value of caller_id is: " + Fields.getValue('caller_id'));
		report.push("value of number is: " + Fields.getValue('number'));
		report.push("value of impact is: " + Fields.getValue('impact'));
		report.push("value of state is: " + Fields.getValue('state'));
		report.push("value of opened_at is: " + Fields.getValue('opened_at'));
		report.push("value of closed_at is: " + Fields.getValue('closed_at'));
		report.push("value of category is: " + Fields.getValue('category'));
		report.push("value of subcategory is: " + Fields.getValue('subcategory'));
		report.push("value of urgency is: " + Fields.getValue('urgency'));
		report.push("value of priority is: " + Fields.getValue('priority'));
		report.push("value of opened_by_label is: " + Fields.getValue('opened_by_label'));
		report.push("value of contact_type is: " + Fields.getValue('contact_type'));
		report.push("value of assignment_group is: " + Fields.getValue('assignment_group'));
		report.push("value of assigned_to is: " + Fields.getValue('assigned_to'));
		report.push("value of short_description is: " + Fields.getValue('short_description'));
		report.push("value of comments is: " + Fields.getValue('comments'));
		report.push("value of work_notes is: " + Fields.getValue('work_notes'));

		report.forEach(function(check) {
			console.log(check);
		});

	});

});
