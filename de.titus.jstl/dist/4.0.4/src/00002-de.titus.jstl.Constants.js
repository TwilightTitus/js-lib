de.titus.core.Namespace.create("de.titus.jstl.Constants", function() {
	de.titus.jstl.Constants = {
		EVENTS : {
		onStart : "jstl-on-start",
		onLoad : "jstl-on-load",
		onSuccess : "jstl-on-success",
		onFail : "jstl-on-fail",
		onReady : "jstl-on-ready"
		},
		PHASE : {
			INIT:0,
			CONDITION:1,
			CONTEXT:2,
			MANIPULATION:3,
			CONTENT:4,
			CLEANING: 5,
			CHILDREN:6,
			BINDING:7,
			FINISH:8
		}
	};	
});
