var SNWindow = require('../page_objects/SNInterface.page.js');
var Fields = require('../page_objects/Fields.page.js');
var storage = require('../persistent_values.js');

// var instance_url = storage.instance_url;
// var username = storage.login_creds.username;
// var password = storage.login_creds.password;

/**	TO IMPLEMENT:
		X Put impersonate() into the before hook (probably would rather not do this)
		* Change Fields functions to Abey's implementations
			* exists(), isVisible(), isReadOnly(), _determineIDandRO()
			* Name of form_type becomes 'table'

	IMPLEMENTED:
		* Put login() function into the before hook
		* Change impersonate() to Dan's implementation

  */

var verify = [
	'caller_id', 'closed_at', 'comments',
	'impact', 'number', 'opened_at',
	'short_description', 'state',
];

describe('Testing function revisions proposed on 9 May 2016', function() {
	this.timeout(0);

	it('impersonates the desired user, then navigates to a new incident form', function(done){
		SNWindow.instance_url = storage.instance_url;
		SNWindow.impersonate("Joe Employee");
		SNWindow.navToNewRecordForm('incident');
		Fields.setFormType('incident');
	});

	it('tests Fields.existsRedux()', function(done) {
		var outstring = "Fields.existsRedux():\n";
		verify.forEach(function(field){
			outstring += `${field} exists: ${Fields.existsRedux(field)}\n`;
			expect(Fields.existsRedux(field)).to.be.true;
		});
		console.log(outstring);
	});

	it('tests Fields.isVisible()', function(done){
		var outstring = "Fields.isVisible():\n";
		verify.forEach(function(field){
			outstring += `${field} is visible: ${Fields.isVisible(field)}\n`;
			expect(Fields.isVisible(field)).to.be.true;
		});
		console.log(outstring);
	});

	it('sees which fields are read only', function(done) {
		var outstring = "Fields.isReadOnlyRedux():\n";
		verify.forEach(function(field){
			outstring += `${field} is read-only: ${Fields.isReadOnlyRedux(field)}\n`;
		});
		console.log(outstring);
	});

	it('gets the value of each field', function(done){
		var outstring = "Fields.getValueRedux():\n";
		verify.forEach(function(field){
			outstring += `${field}.value = ${Fields.getValueRedux(field)}\n`;
		});
		console.log(outstring);
	});

});