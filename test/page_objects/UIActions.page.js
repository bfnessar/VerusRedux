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

	// The user wants a BUTTON
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

	// The user wants a CONTEXT MENU ITEM
	else if (location.match(/^(form[\s\S]?)?(context[\s\S]?menu)$/i)) {
		browser.debug();

		// Right-click the dotdotdot button in the header
		if (!browser.isExisting('#context_1')) {
			browser.rightClick('#toggleMoreOptions');
		};

		// There are two formats that the elementIDs take in the context menu
		for (var i=0; i<25; i++) {
			// We'll check both formats to see if the desired element exists.
			var elemID_1 = "#context_1 > div:nth-child(*)".replace("*", i);
			if (browser.isExisting(elemID_1)) {
				if (browser.getText(elemID_1).toLowerCase() == action_name.toLowerCase()){
					return true;
				};
			}
			var elemID_2 = "div.context_item:nth-child(*)".replace('*', i);
			if (browser.isExisting(elemID_2)) {
				if (browser.getText(elemID_2).toLowerCase() == action_name.toLowerCase()) {
					return true;
				};
			}
		};
		// At this point, we haven't found the element and we give up.
		return false;
	}

	// The user wants a LINK
	else if (location.match(/^(form[\s\S]?)?(link)$/)) {
		;
	}
	
	// Unrecognized UIAction type
	else {
		console.log(location + " is not a UIAction type that I recognize");
		return false;
	};
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


