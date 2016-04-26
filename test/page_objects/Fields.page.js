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

/**	You know, this function could pretty much take the logic out of _determineIDandRO() and
	replace it with brute-force guesswork. Just return the element name for which this function returns
	true, along with the boolean itself.  */
Fields.prototype.exists = function(field_name) {
	var base_name = "#" + this.form_type + "\\." + field_name;
	var name_with_readonly = base_name.replace(/#/, "#sys_readonly\\.");
	var name_with_sysdisplay = base_name.replace(/#/, "#sys_display\\.");

	if (browser.isExisting(name_with_readonly)){
		return true;
		// return name_with_readonly;
	}
	else if (browser.isExisting(name_with_sysdisplay)) {
		return true;
		// return name_with_sysdisplay;
	}
	else if (browser.isExisting(base_name)) {
		return true;
		// return base_name;
	}
	else {
		return false;
	};
};

Fields.prototype.getValue = function(field_name) {
	/**	We have to go through some steps to find out the element id, before we can get the element's value.
		We already know that the element id will contain "<form_type>\\.<field_name>".
		We need to find out if it has a prefix, and if so, what that prefix is.
		Consequently, we find out if the field is readOnly (we have to determine this
		in order to get the element id).
	  */
	// First we inspect "#label\\.${form_type}\\.${field_name}" to determine the field type.
	var field_type = this._getFieldType(field_name);

	/**	Given that we now know the field type, we determine whether the element 
		is readonly. 
		Once we have 1) the form type, 2) the field type, and 3) whether it's readonly,
		we can recreate the element id.
	*/
	var field_specs = this._determineIDandRO(field_name, field_type);
	return browser.getValue(field_specs["fieldID"]);
		// TODO: What if _dIDaRO() failed to return an ID?
};

Fields.prototype._getFieldType = function(field_name) {
	// TODO: Have a catch ready in case getAttribute(l_id, "type") causes an error or returns null or false, or whatever.
	/** EXCEPTIONS: Sometimes, a field will have '_label' in its element name, 
		BUT it lacks that suffix in its #label.type.field name. To deal with this, we remove '_label' from
		the field_name of an element before we look up its #label.form.field identifier. 
	*/
	var label_id = "#label\\." + this.form_type + "\\." + field_name.replace(/_label/, "");
	return browser.getAttribute(label_id, "type");
};

/**	Returns the following JSON: 
	{fieldID: <string>,
	 is_RO: <boolean or NULL>,
	}
*/
Fields.prototype._determineIDandRO = function(field_name, field_type) {
	/** Observation: When we console.log(base_name), it outputs 
		'#incident\.caller_id'-- with a single backslash.
		In contrast, browser.() methods that use base_name recognize
		the double backslash, and those methods work correctly.
		There is no problem here, but the result is unintuitive and I thought
		I should point it out in case there are problems in the future.
	*/
	/**	Originally, I was going to use two separate functions for this job:
		one to determine ReadOnly, and the other to determine the element's name.
		However, since those two questions are so closely related, I think they
		might as well be answered by the same function.
	  */
	// TODO: Account for any non-truthy values returned from _getFieldType()
	var base_name = "#" + this.form_type + "\\." + field_name;
	switch (field_type) {
		case 'choice': {
			var name_with_readonly = base_name.replace(/#/, "#sys_readonly\\.");
			var elem_has_readonly_attribute = String(browser.getAttribute(base_name, "readonly")).match(/^(true|readonly)$/);
			var disabled_is_true = browser.getAttribute(base_name, "disabled") == "true";
			if (browser.isExisting(name_with_readonly)) { // RO=true
				return {fieldID: name_with_readonly, isRO: true,};
			}
			else if (elem_has_readonly_attribute || disabled_is_true) { // RO=true
				return {fieldID: base_name, isRO: true,};
			}
			else {	// RO=false
				return {fieldID: base_name, isRO: false,};
			};
		}
		case 'date_time': {
			var name_with_readonly = base_name.replace(/#/, "#sys_readonly\\.");
			var elem_has_readonly_attribute = String(browser.getAttribute(base_name, "readonly")).match(/^(true|readonly)$/);
			if (browser.isExisting(name_with_readonly) || elem_has_readonly_attribute) {
				return {fieldID: name_with_readonly, isRO: true,};
			}
			else {
				return {fieldID: base_name, isRO: false,};
			};
		}

		case 'pick_list': {
			/**	Pretty much only applies to Short Description, and is (probably) never read-only	*/
			return {fieldID: base_name, isRO: false,};
		}

		case 'journal_input': {
			/** Applies to comments and work_notes */
			return {fieldID: base_name, isRO: false,};
		}

		case 'reference': {	// E.g. caller_id
			/**	This case is tricky because it's the only one (so far) where
				1) being read-only requires that there is NO sys_readonly prefix,
				2) being read-write requires that there IS a prefix, called sys_display
			 */
			var prefixed_name = base_name.replace(/#/, "#sys_display\\.");
			var elem_has_readonly_attribute = String(browser.getAttribute(base_name, "readonly")).match(/^(true|readonly)$/);
			var elem_has_formcontrol_disabled = browser.getAttribute(base_name, "class") == "form-control disabled";
			if (elem_has_readonly_attribute || elem_has_formcontrol_disabled) {
				return {fieldID: base_name, isRO: true,};
			}
			else {
				return {fieldID: prefixed_name, isRO: false,};
			};
		}

		// E.g. (incident) number
		case 'string': {
			/**	SUMMARY OF CASES:
				* if (prepend_sysreadonly): read-only, yes prefix
				* if (!prepend_sysreadonly && (elem_has_formcontrol_disabled || elem_has_readonly_enabled)): read-only, no prefix
				* if ((dont_prepend_sysreadonly || class_is_formcontrol) && !(elem_has_formcontrol_disabled || elem_has_readonly_enabled)): not read-only, no prefix
				(prepend_sysreadonly) id exists with prefix
				(dont_prepend_sysreadonly) id exists without prefix
				(elem_has_formcontrol_disabled) class="form-control disabled"
				(elem_has_readonly_enabled) readonly=(true|"readonly")
				(class_is_formcontrol) class="form-control"
			*/
			var name_with_prefix = base_name.replace(/#/, "#sys_readonly\\.");
			var prepend_sysreadonly = browser.isExisting(name_with_prefix);
			var elem_has_formcontrol_disabled = browser.getAttribute(base_name, "class") == "form-control disabled";
			var elem_has_readonly_enabled = String(browser.getAttribute(base_name, "readonly")).match(/^(true|readonly)$/);
			var class_is_formcontrol = browser.getAttribute(base_name, "class") == "form-control";

			if (prepend_sysreadonly) { // YES prefix, YES readonly
				return 	{	fieldID: name_with_prefix,
							isRO: true,
						};
			}
			else if (elem_has_formcontrol_disabled || elem_has_readonly_enabled) { // NO prefix, YES readonly
				return 	{	fieldID: base_name,
							isRO: true,
						};
			}
			else if ( (class_is_formcontrol) && !(elem_has_formcontrol_disabled || elem_has_readonly_enabled) ){ // NO prefix, NO readonly
				return 	{	fieldID: base_name,
							isRO: false,
						};
			};
		}
		default: {
			// TODO: Should throw an error
			// Either the element does not exist, or our logic is faulty
			console.log("Couldn't figure it out the meaning of " + field_name + ", sorry.");
			return false;
		}
	};
};

Fields.prototype.setValue = function(value, field_name) {
	// Determine the field type, so that we can get its ID
	var field_type = this._getFieldType(field_name);
	// Determine the field ID and whether it is writable
	var field_specs = this._determineIDandRO(field_name, field_type);

	// _determineIDandRO() returned an untruthy value, so it can't be trusted
	if (!field_specs) {
		console.log("Could not ID the field: " + field_name);
		return false;
	}
	// The field is maybe truthy, but it's read-only
	else if (field_specs["isRO"] == true) {
		console.log("Field " + field_name + " is read-only, so no.");
		return false;
	}
	// If fieldID is truthy and the field is writable, we're good to go
	else if (field_specs["fieldID"] && (field_specs["isRO"] == false) ) {
		browser.setValue(field_specs["fieldID"], value);
	};
};

Fields.prototype.isMandatory = function(field_name) {
	;
};

Fields.prototype.intoFocus = function() {
	browser.frameParent();
	browser.waitForExist('#gsft_main');
	browser.waitForEnabled('#gsft_main');
	browser.frame('gsft_main');
	;
};

module.exports = new Fields()