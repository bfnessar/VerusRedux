function SNInterface() {
	this.instance_url;
};

// Getters go here, if we decide to use any
SNInterface.prototype = {
	// Getters for logging in:
	get username_field() {return browser.element('#user_name')},
	get password_field() {return browser.element('#user_password')},
	get login_button() 	{return browser.element('#sysverb_login')},
	// Getters for impersonating a user:
	get dropdown_menu() {return browser.element('#user_info_dropdown')},
	get impersonate_user_button() {return browser.element('.dropdown-menu > li:nth-child(2) > a:nth-child(1)')},
	get impersonate_user_search_bar() {return browser.element('#s2id_autogen3')},
	get impersonate_user_text_field() {return browser.element('#s2id_autogen4_search')},
	// Getters for the Application Navigator
	get filter_field() {return browser.element('#filter')},
};

// Will take you either to the login page, or to the main page
SNInterface.prototype.visitHomePage = function(instance_url){
	/** Consideration: Implement function with or without the argument,
	instance_url. If argument=1, then set this.instance_url and go to.
	If argument=0, then assert that this.instance_url!=NULL, then go to that url.
	*/
	this.instance_url = instance_url;
	browser.url(instance_url);
	browser.frame('gsft_main');
	return this;
};

SNInterface.prototype.halt = function() {
	browser.debug();
	return this;
};

SNInterface.prototype.login = function(username, password) {
	return this;
};

/**	PROBLEM: Sometimes logs in as 'Abel Tuter'. Current workaround (which works)
	is to retry impersonation until the impersonation is correct.
	If the impersonation would take more than three tries, we just return false instead.
  */
SNInterface.prototype.impersonate = function(username) {
	browser.frameParent();
	var current_user = browser.getText('.user-name');
	var timeout_counter = 0;
	while (username.toLowerCase() != current_user.toLowerCase()) {
		this.dropdown_menu.click();
		this.impersonate_user_button.click();
		this.impersonate_user_search_bar.waitForExist(5000);
		this.impersonate_user_search_bar.click();
		this.impersonate_user_text_field.setValue(username);
		browser.pause(5000);
		browser.keys(['Enter']);
		browser.pause(3000);
		browser.frameParent();
		current_user = browser.getText('.user-name');
		timeout_counter += 1;
		if (timeout_counter > 3) {
			console.log("We can't seem to impersonate " + username+ ". I guess we just give up here.");
			return false;
		};
	};
	// Should either be impersonating correctly, or have bailed out.
	return this;
};

SNInterface.prototype.navToNewRecordForm = function(form_type){
	browser.frameParent();
	this.filter_field.waitForExist();
	this.filter_field.setValue(form_type.toLowerCase() + '.do');
	browser.pause(3000);
	browser.keys(['Enter']);
	browser.pause(3000);
	browser.frameParent();
	browser.waitForExist('#gsft_main');
	browser.waitForEnabled('#gsft_main');
	browser.frame('gsft_main');

	switch (form_type.toLowerCase()) {
		case 'incident': {
			// TODO: Should return a new page object
			break;
		}
		case 'change_request':{
			// TODO: Account for variations in input, e.g. "change request" vs. "change_request"
			// TODO: Should return a new page object
			break;
		}
		case 'problem': {
			// TODO: Should return a new page object
			break;
		}
		default: {
			console.log("I don't recognize this form type; we're probably on an error screen");
			return false;
		}
	};
};

SNInterface.prototype.navToExistingRecordForm = function(url) {
	browser.url(url);
	browser.pause(3000);
	browser.waitForExist('#gsft_main');
	browser.waitForEnabled('#gsft_main');
	browser.frame('gsft_main');
	// TODO: Should return a new page object

};

module.exports = new SNInterface()