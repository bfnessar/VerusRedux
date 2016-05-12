function UIActions() {
	this.table;
};

UIActions.prototype = {	};

UIActions.prototype.setTable = function(table) {
	this.table = table;
};

/**	TODO: Divide this function into smaller ones  */
/**	Only the default UI actions have names, unless you 
	set the field 'Action name' in the UI Action table.
	So I guess the test writers will have to know the numeric ID
	of the UI action they want to search for.
	Also, 'location' is more or less the same determinant
	as "UIAction type"; e.g. Form button, form context menu, and form (related) link.
*/
UIActions.prototype.exists = function(action_name, location) {
	/**	Should handle Button, ContextMenu, and Link	*/

	// The user wants a BUTTON
	if (location.match(/^(form[\s\S]?)?(button)$/i)) {
		return this._buttonExists(action_name);
	}

	// The user wants a CONTEXT MENU ITEM
	else if (location.match(/^(form[\s\S]?)?(context[\s\S]?menu)$/i)) {
		return this._contextItemExists(action_name);
	}

	// The user wants a LINK
	else if (location.match(/^(form[\s\S]?)?(link)$/)) {
		return this._linkExists(action_name);
	}
	
	// Unrecognized UIAction type
	else {
		console.log(location + " is not a UIAction type that I recognize");
		return false;
	};
};

UIActions.prototype._buttonExists = function(action_name) {
	// Despite being labelled 'Submit', the button's actual ID is '#sysverb_insert'.
	// Let's account for that potential misunderstanding here.
	if (action_name.match(/^[#]?submit$/i)) {
		action_name = "#sysverb_insert";
	}
	else { 
		// A selector won't have spaces in its name, even if the label does. Let's replace all whitespace tokens with underscores.
		action_name = action_name.replace(/\s/, '_');
		// If the name doesn't start with a hashtag, prepend one
		if (!action_name.startsWith("#")) {
			action_name = "#" + action_name;
		};
	};
	return browser.isExisting(action_name);
};

UIActions.prototype._contextItemExists = function(action_name) {
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

	// At this point, we haven't found the element in ContextMenu and we give up.
	return false;
};

UIActions.prototype._linkExists = function(action_name) {
	// We need to be able to access this container, I'm pretty sure.
	if (!browser.isExisting(".related_links_container")) {
		console.log("Couldn't find the container for related links");
		return false;
	};

	/**	We iterate over each object in elemIDs. Each object represents an elemID of a matched element.
		We name these objects 'result' in the forEach function. In order to access the data within 'result',
		we must access its ELEMENT attribute, as in, result.ELEMENT.
		result.ELEMENT returns the webElementID of that particular element. We use this wEID as an argument
			to our browser.elementIdTHING(weID) class of functions, e.g. `browser.elementIdText(webElementID).value;
		NOTE that we append the attribute `.value` to our function call. For some reason, this class of functions
			returns yet another JSON object, and the result that we seek is stored in that object's 'value' attribute.
	*/

	/**	Trying to get the data WITHOUT accessing the .value attribute, like this:
			var retObj = browser.elementIdText(webElementID);
		would simply return a JSON object. If we stringify() the object, we would get something like this:
			{	"state":"success",
				"sessionId":"f33ca4a3-2d0d-4fb3-b763-24d52541a047",
				"hCode":1903416767,
				"value":"Create Problem", // The value that we want!
				"class":"org.openqa.selenium.remote.Response",
				"_status":0
			}
		Thus, the data that we actually want has to be accessed via browser.elementIdText(webElementID).value;
	*/

	/**	We are looking for all the elements that share the class value, 
		'.navigation_link.action_context'
	*/
	var elemIDs = browser.elements(".navigation_link.action_context").value;
		/**	This is the object that gets returned by browser.elements(X):
			{
				"state":"success",
				"sessionId":"1337bdca-b048-4b47-b3f2-c937092fe36f","
				hCode":1412241619,
				"value":[{"ELEMENT":"11"},{"ELEMENT":"12"}], // Accessed via `elemIDs`, or `elemIDs[n]`
				"class":"org.openqa.selenium.remote.Response",
				"selector":".navigation_link.action_context",
				"_status":0
			};	
		*/
	// console.log("==========================\nSearching for: " + action_name);
	var found = false;
	elemIDs.forEach(function(result) {
		var webElementID = result.ELEMENT;
		var visibleText = browser.elementIdText(webElementID).value;
		// console.log("CURRENTLY INSPECTING: " + visibleText);
		if (visibleText.toLowerCase() == action_name.toLowerCase()) {
			found = true;
		};
	});
	if (found == true) {
		// console.log("Found a match for " + action_name + "\n==========================");
		return true;
	}
	else {
		// Couldn't find the requested action_name under Related Links
		// console.log("Couldn't find a match for " + action_name + "\n==========================");
		return false
	};
};

UIActions.prototype.intoFocus = function() {
	browser.frameParent();
	browser.waitForExist('#gsft_main');
	browser.waitForEnabled('#gsft_main');
	browser.frame('gsft_main');
};

module.exports = new UIActions()


