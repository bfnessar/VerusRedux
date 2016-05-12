/** The interface through which a user interacts with
	fields on a page. Should be agnostic of user role and
	form type.
*/
function Fields() {
	this.form_type; // So we know what type of form we are working on
};

Fields.prototype = {
	// This is where the more basic getter functions would go, if we decide to use any.
};

Fields.prototype.setFormType = function(form_type) {
	this.form_type = form_type;
};

/**	===================================================================================
	Updated versions of existing methods. Need to be tested for correctness.
*/

// Verified for: EU/NewIncident, 
Fields.prototype.exists = function(field_name) {
	/**	Sometimes field_name ends with '_label', but the selector,
		#element.{form_type}.{field_name}, does NOT end in '_label'.
		Let's account for that here.
	*/
	if (field_name.endsWith('_label')) {
		field_name = field_name.replace('_label', '');
	};
	var selector = '#element\\.' + this.form_type + '\\.' + field_name;
	if (browser.isExisting(selector)){
		return true;
	}
	else {
		return false;
	};
};

// Verified for: EU/NewIncident,
Fields.prototype.isVisible = function(field_name) {
	if (field_name.endsWith('_label')) {
		field_name = field_name.replace('_label', '');
	};
	var selector = '#element\\.' + this.form_type + '\\.' + field_name;
	var visible = browser.getAttribute(selector, "style");
	if (visible == "") {
		return true;
	}
	else {
		return false;
	};
};

// Verified for: 
Fields.prototype.isMandatory = function(field_name) {
	if (field_name.endsWith('_label')) {
		field_name = field_name.replace('_label', '');
	};
	var selector = '#element\\.' + this.form_type + '\\.' + field_name;
	var mandatory = browser.getAttribute(selector, 'class');
	return (mandatory.includes('is-filled') || mandatory.includes('is-required'));
};

// Verified for: EU/NewIncident, 
Fields.prototype.isReadOnly = function(field_name) {
	if (field_name.endsWith('_label')) {
		field_name = field_name.replace('_label', '');
	};
	var selector = '#' + this.form_type + '\\.' + field_name;
	var ro_selector = '#sys_readonly\\.' + this.form_type + '\\.' + field_name;
	if (browser.isExisting(ro_selector))
		return true;
	if (String(browser.getAttribute(selector, "readonly")).match(/^(true|readonly)$/))
		return true;
	if (browser.getAttribute(selector, "disabled") == true)
		return true;
	if (browser.getAttribute(selector, "class") == "form-control disabled")
		return true;
	return false;
};

// Verified for: EU/NewIncident, 
Fields.prototype.getValue = function(field_name) {
	if (field_name.endsWith('_label')) {
		field_name = field_name.replace('_label', '');
	};
	// These are the different forms that a selector can take
	var base_selector = "#" + this.form_type + "\\." + field_name;
	var selector_with_RO = '#sys_readonly\\.' + this.form_type + '\\.' + field_name;
	var selector_with_sysdisplay = '#sys_display\\.' + this.form_type + '\\.' + field_name;

	// Check for various selectors and return one that matches
	if (browser.isExisting(base_selector)) {
		return browser.getValue(base_selector);
	};
	if (browser.isExisting(selector_with_RO)) {
		return browser.getValue(selector_with_RO);
	};
	if (browser.isExisting(selector_with_sysdisplay)) {
		return browser.getValue(selector_with_sysdisplay);
	};

	// If none of the prior if-statements gave us a result, then we're out of luck.
	// ERROR HANDLING

};

Fields.prototype.setValue = function(field_name, value) {
	if (field_name.endsWith('_label')) {
		field_name = field_name.replace('_label', '');
	};
	// A selector can take one of these forms:
	var base_selector = "#" + this.form_type + "\\." + field_name;
	var selector_with_sysdisplay = "#sys_display\\." + this.form_type + "\\." + field_name;
	var selector_with_RO = '#sys_readonly\\.' + this.form_type + '\\.' + field_name;

	// Check the various selectors ands see if one matches. If so, write to it.
	if (browser.isExisting(base_selector)) {
		browser.setValue(field_name, value);
		return true;
	};
	// Actually, what's the protocol for setting the value of a field that has something like a dropdown? Does this cover it?
	if (browser.isExisting(selector_with_sysdisplay)) {
		browser.setValue(field_name, value);
		return true;
	};
	if (browser.isExisting(selector_with_RO)){
		console.log(`ERROR: Field ${field_name} is read-only.`);
		return false;
	};
	// ERROR HANDLING
	console.log(`ERROR: No selector could be found for the field ${field_name}`);
	return false;
};

// =====================================================================================================



Fields.prototype.intoFocus = function() {
	browser.frameParent();
	browser.waitForExist('#gsft_main');
	browser.waitForEnabled('#gsft_main');
	browser.frame('gsft_main');
	;
};

module.exports = new Fields()