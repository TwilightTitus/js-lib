de.titus.core.Namespace.create("applications.doc.App", function() {
	applications.doc.App = function(anElement) {
		this.element = anElement;
		this.chapter = this.getParameterByName("chapter");
		if(this.chapter == undefined || this.chapter == "")
			this.chapter = 0;
		else 
			this.chapter = parseInt(this.chapter) || 0;
		
		this.doc = this.getParameterByName("doc");
				
		this.init();
	};
	
	applications.doc.App.prototype.init = function() {
		this.element.jstl({
		"data" : {
			"currentChapter" : this.chapter,
			"chapterDataUrl": this.getChapterDataUrl(),
			"doc": this.doc
		},
		"onSuccess" : function() {
			hljs.initHighlightingOnLoad();
		}
		});
	};
	applications.doc.App.prototype.getChapterDataUrl = function(){
		var url = "doc/chapter-list.json";		
		if(this.doc != undefined && this.doc != ""){
			url = "doc/" + this.doc + "/chapter-list.json";
		}
		return url;
	};
	
	applications.doc.App.prototype.getParameterByName = function(name) {
		var url = window.location.search;
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		var results = regex.exec(url);
		if (!results)
			return null;
		if (!results[2])
			return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};
	
	$.fn.applications_doc_App = function() {
		var app = this.data("applications.doc.App");
		if (app == undefined) {
			app = new applications.doc.App(this);
			this.data("applications.doc.App", app);
		}
		
		return app;
	};
	
	$(document).ready(function() {
		$("body").applications_doc_App();
	});
});
