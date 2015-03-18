de.titus.core.Namespace.create("de.titus.core.regex.Matcher", function() {
	de.titus.core.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	de.titus.core.regex.Matcher.prototype.isMatching = function() {
		return this.internalRegex.test(this.processingText);
	};

	de.titus.core.regex.Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	de.titus.core.regex.Matcher.prototype.getMatch = /* boolean */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};

	de.titus.core.regex.Matcher.prototype.getGroup = function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};

	de.titus.core.regex.Matcher.prototype.replaceAll = function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace.create("de.titus.core.regex.Regex", function() {

	de.titus.core.regex.Regex = function(/*String */ aRegex, /*String */ aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	de.titus.core.regex.Regex.prototype.parse = /*de.titus.core.regex.Matcher*/ function(/*String*/ aText){
		return new de.titus.core.regex.Matcher(this.internalRegex, aText);
	};		
});
