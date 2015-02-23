de.titus.core.Namespace("de.titus.core.regex.Matcher", function() {
	fiducia.utils.regex.Matcher = function(/* RegExp */aRegExp, /* String */aText) {
		this.internalRegex = aRegExp;
		this.processingText = aText;
		this.currentMatch = undefined;
	}

	fiducia.utils.regex.Matcher.prototype.isMatching = function() {
		return this.internalRegex.test(this.processingText);
	};

	fiducia.utils.regex.Matcher.prototype.next = /* boolean */function() {
		this.currentMatch = this.internalRegex.exec(this.processingText);
		if (this.currentMatch != undefined) {
			this.processingText = this.processingText.replace(this.currentMatch[0], "");
			return true;
		}
		return false;
	};
	
	fiducia.utils.regex.Matcher.prototype.getMatch = /* boolean */function() {
		if (this.currentMatch != undefined)
			return this.currentMatch[0];
		return undefined;
	};

	fiducia.utils.regex.Matcher.prototype.getGroup = function(/* int */aGroupId) {
		if (this.currentMatch != undefined)
			return this.currentMatch[aGroupId];
		return undefined;
	};

	fiducia.utils.regex.Matcher.prototype.replaceAll = function(/* String */aReplaceValue, /* String */aText) {
		if (this.currentMatch != undefined)
			return aText.replace(this.currentMatch[0], aReplaceValue);
		return aText;
	};
});

de.titus.core.Namespace("de.titus.core.regex.Regex", function() {

	fiducia.utils.regex.Regex = function(/*String */ aRegex, /*String */ aOptions) {
		this.internalRegex = new RegExp(aRegex, aOptions);
	};
	
	fiducia.utils.regex.Regex.prototype.parse = /*fiducia.utils.regex.Matcher*/ function(/*String*/ aText){
		return new fiducia.utils.regex.Matcher(this.internalRegex, aText);
	};		
});