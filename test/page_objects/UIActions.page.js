function UIActions() {
	this.form_type;
};

UIActions.prototype = {	};

UIActions.prototype.setFormType = function(form_type) {
	this.form_type = form_type;
};

/**	Only the default UI actions have names, unless you 
	set the field 'Action name' in the UI Action table.
	So I guess the test writers will have to know the numeric ID
	of the UI action they want to search for.
	Also, 'location' is more or less the same determinant
	as "UIAction type"; e.g. Form button, form context menu, and form (related) link.
*/
UIActions.prototype.exists = function(action_name, location) {
	/**	Should handle Button, ContextMenu, and Link*/
	if (location.match(/^(form[\s\S]?)?(button)$/i)) {
		// Despite being labelled 'Submit', the button's actual ID is '#sysverb_insert'. Let's just account for that here.
		if (action_name.match(/^[#]?submit$/i)) {
			action_name = "#sysverb_insert";
		}
		else { // If the name doesn't start with a hashtag, prepend one
			if (!action_name.startsWith("#")) {
				action_name = "#" + action_name;
			};
		};
		return browser.isExisting(action_name);
	}
	else if (location.match(/^(form[\s\S]?)?(context[\s\S]?menu)$/i)) {
		;
	}
	else if (location.match(/^(form[\s\S]?)?(link)$/)) {
		;
	}
	else {return false;};
};

UIActions.prototype._getElemID = function(button_name) {
	;
};

UIActions.prototype.click = function(button_name, location) {
	;
};

UIActions.prototype.intoFocus = function() {
	browser.frameParent();
	browser.waitForExist('#gsft_main');
	browser.waitForEnabled('#gsft_main');
	browser.frame('gsft_main');
};

module.exports = new UIActions()


