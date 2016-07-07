de.titus.core.Namespace.create("applications.doc.App", function() {
	applications.doc.App = function(anElement) {
		this.element = anElement;
		this.chapter = 0;
		
		this.init();
	};
	
	applications.doc.App.prototype.init = function() {
		this.element.jstl({
			"data" : {
				"currentChapter" : this.chapter
			}
		});
	};
	
	applications.doc.App.prototype.nextChapter = function() {
		
	};
	
	applications.doc.App.prototype.prevChapter = function() {
		
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
