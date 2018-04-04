/*
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Frank Schüler
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function($){
	de.titus.core.Namespace.create("de.titus.jstl", function() {
		de.titus.jstl.Version = "4.0.5";
	});
})($);
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
(function($, GlobalSettings) {
	"use strict";
	de.titus.jstl.GlobalSettings = $.extend(true, {
		DEFAULT_TIMEOUT_VALUE: 1,
		DEFAULT_INCLUDE_BASEPATH : ""		
	}, GlobalSettings);
})($, de.titus.jstl.GlobalSettings);
de.titus.core.Namespace.create("de.titus.jstl.TaskRegistry", function() {
	
	var TaskRegistry = {
		taskchain : undefined
	};
	
	TaskRegistry.append = function(aName, aPhase, aSelector, aFunction, aChain) {
		if (!aChain && !TaskRegistry.taskchain)
			TaskRegistry.taskchain = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
		else if (!aChain && TaskRegistry.taskchain)
			TaskRegistry.append(aName, aPhase, aSelector, aFunction, TaskRegistry.taskchain);
		else if (aChain.phase <= aPhase && aChain.next && aChain.next.phase <= aPhase)
			TaskRegistry.append(aName, aPhase, aSelector, aFunction, aChain.next);
		else if (aChain.phase <= aPhase && aChain.next && aChain.next.phase > aPhase) {
			var tempChain = aChain.next;
			aChain.next = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
			aChain.next.next = tempChain;
		} else if (aChain.phase <= aPhase && !aChain.next)
			aChain.next = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
		else if (aChain.phase > aPhase) {
			var tempChain = aChain;
			TaskRegistry.taskchain = TaskRegistry.__buildEntry(aName, aPhase, aSelector, aFunction);
			TaskRegistry.taskchain.next = aChain;
		}
	}

	TaskRegistry.__buildEntry = function(aName, aPhase, aSelector, aFunction) {
		return {
		    name : aName,
		    phase : aPhase,
		    selector : aSelector,
		    task : aFunction
		};
	}

	de.titus.jstl.TaskRegistry = TaskRegistry;
});
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.ExecuteChain", function() {
		let ExecuteChain = de.titus.jstl.ExecuteChain = function(aTaskChain, aCount, aCallback) {
			this.count = aCount || 0;
			this.taskChain = aTaskChain;
			this.callback = aCallback;
		};
		ExecuteChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.ExecuteChain");

		ExecuteChain.prototype.finish = function() {
			if (ExecuteChain.LOGGER.isDebugEnabled())
				ExecuteChain.LOGGER.logDebug("count: " + this.count);

			this.count--;
			if (this.count == 0) {
				if (typeof this.callback === "function")
					this.callback(this);
				this.taskChain.nextTask();
			}
		};
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.TaskChain", function() {
		let TaskChain = function(aElement, aContext, aProcessor, isRoot, aCallback) {
			this.element = aElement;
			this.context = aContext;
			this.processor = aProcessor;
			this.root = isRoot;
			if (typeof aCallback === "function" || Array.isArray(aCallback))
				this.callback = aCallback;
			this.__preventChilds = false;
			this.__taskchain = de.titus.jstl.TaskRegistry.taskchain;
			this.__currentTask = undefined;
			this.__buildContext();
		};
		TaskChain.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.TaskChain");

		TaskChain.prototype.skipToPhase = function(aPhase) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("skipToPhase()");

			while (this.__taskchain && this.__taskchain.phase < aPhase)
				this.__taskchain = this.__taskchain.next;

			return this;
		};

		TaskChain.prototype.preventChilds = function() {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug([ "preventChilds() ", this ]);
			this.__preventChilds = true;
			return this;
		};

		TaskChain.prototype.isPreventChilds = function() {
			return this.__preventChilds;
		};

		TaskChain.prototype.updateContext = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("updateContext()");
			if (doMerge)
				this.context = $.extend(this.context, aContext);
			else
				this.context = aContext;

			this.__buildContext();

			return this;
		};

		TaskChain.prototype.appendCallback = function(aCallback) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("appendCallback()");
			if (typeof aCallback !== "function")
				return;

			if (Array.isArray(this.callback))
				this.callback.push(aCallback);
			else if (this.callback)
				this.callback = [ this.callback, aCallback ]
			else
				this.callback = aCallback;

			return this;
		};

		TaskChain.prototype.nextTask = function(aContext, doMerge) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug([ "nextTask( \"", aContext, "\", \"", doMerge, "\")" ]);

			if (typeof aContext !== "undefined")
				if (typeof aContext !== "object")
					throw new Error();
				else
					this.updateContext(aContext, doMerge);

			if (this.__taskchain) {
				let task = this.__taskchain.task;
				let phase = this.__taskchain.phase;
				let selector = this.__taskchain.selector;
				this.__currentTask = this.__taskchain;
				this.__taskchain = this.__taskchain.next;

				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug([ "nextTask() -> next task: \"", name, "\", phase: \"", phase, "\", selector \"", selector, "\", element \"", this.element, "\" !" ]);
				if (selector == undefined || this.element.is(selector))
					try {
						task(this.element, this.context, this.processor, this);
					} catch (e) {
						TaskChain.LOGGER.logError(e);
					}
				else {
					if (TaskChain.LOGGER.isDebugEnabled())
						TaskChain.LOGGER.logDebug([ "nextTask() -> skip task: \"", name, "\", phase: \"", phase, "\", selector \"", selector, "\"!" ]);
					this.nextTask();
				}
			} else {
				if (TaskChain.LOGGER.isDebugEnabled())
					TaskChain.LOGGER.logDebug("nextTask() -> task chain is finished!");
				this.finish();
			}

			return this;
		};
		TaskChain.prototype.__buildContext = function() {
			this.context["$element"] = this.element;
			this.context["$root"] = this.processor.element;
			return this.context;
		};

		TaskChain.prototype.finish = function(async) {
			if (TaskChain.LOGGER.isDebugEnabled())
				TaskChain.LOGGER.logDebug("finish()");

			if (async) {
				let self = this;
				setTimeout(function() {
					self.finish();
				}, 0);
			}

			else {
				if (typeof this.callback === "function")
					this.callback(this.element, this.context, this.processor, this);
				else if (Array.isArray(this.callback))
					for (let i = 0; i < this.callback.length; i++)
						if (typeof this.callback[i] === "function")
							this.callback[i](this.element, this.context, this.processor, this);

				this.element.trigger(de.titus.jstl.Constants.EVENTS.onSuccess, [ this.context, this.processor ]);
			}

			return this;
		};

		de.titus.jstl.TaskChain = TaskChain;
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Children", function() {
		let Children = de.titus.jstl.functions.Children = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Children"),
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Children.LOGGER.isDebugEnabled())
				    Children.LOGGER.logDebug("TASK");

			    if (!aTaskChain.isPreventChilds()) {
				    let ignoreChilds = aElement.attr("jstl-ignore-childs");
				    if (typeof ignoreChilds !== 'undefined') {
					    if (ignoreChilds.length > 0)
						    ignoreChilds = aProcessor.resolver.resolveExpression(ignoreChilds, aContext, true);
					    else
						    ignoreChilds = true;

					    if (ignoreChilds)
						    return aTaskChain.preventChilds().nextTask();
				    }

				    let children = aElement.children();
				    if (children.length == 0)
					    aTaskChain.nextTask();
				    else {
					    setTimeout(function() {
						    Children.ElementChain(children, 0, aTaskChain, aElement, aContext, aProcessor);
					    }, 1);
				    }
			    } else
				    aTaskChain.nextTask();
		    },

		    UpdateContext : function(aParentTaskChain, aTaskChain) {
			    aParentTaskChain.updateContext(aTaskChain.context, true);
		    },

		    ElementChain : function(theChildren, aIndex, aParentTaskChain, aElement, aContext, aProcessor) {
			    aParentTaskChain.updateContext(aContext, true);
			    if (aIndex < theChildren.length) {
				    let next = $(theChildren[aIndex]);
				    if (next && next.length == 1)
					    aProcessor.compute(next, aParentTaskChain.context, function(aElement, aContext, aProcessor) {
						    Children.ElementChain(theChildren, aIndex + 1, aParentTaskChain, aElement, aContext, aProcessor);
					    });

			    } else
				    aParentTaskChain.nextTask();
		    }

		};

		de.titus.jstl.TaskRegistry.append("children", de.titus.jstl.Constants.PHASE.CHILDREN, undefined, de.titus.jstl.functions.Children.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.If", function() {
		let If = de.titus.jstl.functions.If = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.If"),
		    TASK : function(aElement, aDataContext, aProcessor, aExecuteChain) {
			    if (If.LOGGER.isDebugEnabled())
				    If.LOGGER.logDebug("TASK");
			    
			    let expression = aElement.attr("jstl-if");
			    if (typeof expression !== 'undefined') {
				    expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (!(expression == true || expression == "true")) {
					    aElement.remove();
					    aExecuteChain.preventChilds().finish();
				    } else
					    aExecuteChain.nextTask();
			    } else
				    aExecuteChain.nextTask();
		    }
		};
		
		de.titus.jstl.TaskRegistry.append("if", de.titus.jstl.Constants.PHASE.CONDITION, "[jstl-if]", de.titus.jstl.functions.If.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.Preprocessor", function() {
		let Preprocessor = de.titus.jstl.functions.Preprocessor = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Preprocessor"),

		    STATICEVENTHANDLER : function(aExpression, aEvent, aContext, aProcessor) {
			    if (aExpression && aExpression != "") {
				    var eventAction = aProcessor.resolver.resolveExpression(aExpression, aContext);
				    if (typeof eventAction === "function")
					    eventAction(aContext.$element, aContext, aProcessor);
			    }
		    },

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Preprocessor.LOGGER.isDebugEnabled())
				    Preprocessor.LOGGER.logDebug("TASK");

			    if (aElement[0].nodeType != 1 || aElement.tagName() == "br")
				    return aTaskChain.preventChilds().finish();

			    if (!aTaskChain.root) {
				    let ignore = aElement.attr("jstl-ignore");
				    if (typeof ignore !== 'undefined') {
					    if (ignore.length > 0)
						    ignore = aProcessor.resolver.resolveExpression(ignore, aContext, false);
					    else
					    	ignore = true;
					    if (ignore)
						    return aTaskChain.preventChilds().finish();
				    }

				    let async = aElement.attr("jstl-async");
				    if (typeof async !== 'undefined') {
					    if (async.length > 0)
						    async = aProcessor.resolver.resolveExpression(async, dataContext, false);
					    else
						    async = true;
					    if (async) {
						    aProcessor.onReady(function() {
						    	aElement.jstlAsync({
								    data : $.extend({}, aContext)
							    });
						    });
						    return aTaskChain.preventChilds().finish();
					    }
				    }

			    }

			    Preprocessor.__appendEvents(aElement);

			    aElement.trigger(de.titus.jstl.Constants.EVENTS.onLoad, [ aContext, aProcessor ]);
			    aTaskChain.nextTask();
		    },

		    __appendEvents : function(aElement) {
			    if (aElement.attr("jstl-load"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onLoad, function(aEvent, aContext, aProcessor){Preprocessor.STATICEVENTHANDLER(aElement.attr("jstl-load"), aEvent, aContext, aProcessor);});
			    if (aElement.attr("jstl-success"))
				    aElement.one(de.titus.jstl.Constants.EVENTS.onSuccess, function(aEvent, aContext, aProcessor){Preprocessor.STATICEVENTHANDLER(aElement.attr("jstl-success"), aEvent, aContext, aProcessor);});
		    }

		};

		de.titus.jstl.TaskRegistry.append("preprocessor", de.titus.jstl.Constants.PHASE.INIT, undefined, de.titus.jstl.functions.Preprocessor.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	de.titus.core.Namespace.create("de.titus.jstl.functions.ScreenCondition", function() {
		let ScreenCondition = de.titus.jstl.functions.ScreenCondition = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.ScreenCondition"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (ScreenCondition.LOGGER.isDebugEnabled())
				    ScreenCondition.LOGGER.logDebug("TASK");

			    if (typeof aElement.attr("jstl-screen-condition-init") === 'undefined') {
				    aElement.addClass("jstl-screen-inactive");
				    de.titus.core.ScreenObserver.addHandler({
				        "condition" : aElement.attr("jstl-screen-condition"),
				        "activate" : function(aScreenData) {
					        if (ScreenCondition.LOGGER.isDebugEnabled())
						        ScreenCondition.LOGGER.logDebug("run jstl screen condition (activate)");

					        if (!aElement.is(".jstl-screen-condition-ready")) {
						        aElement.jstl({
						            "data" : aContext,
						            "callback" : function() {
							            aElement.removeClass("jstl-screen-inactive");
							            aElement.addClass("jstl-screen-active");
							            aElement.addClass("jstl-screen-condition-ready");
						            }
						        });
					        } else {
						        aElement.removeClass("jstl-screen-inactive");
						        aElement.addClass("jstl-screen-active");
					        }
				        },
				        "deactivate" : function(aScreenData) {
					        if (ScreenCondition.LOGGER.isDebugEnabled())
						        ScreenCondition.LOGGER.logDebug("run jstl screen condition (deactivate)");

					        aElement.removeClass("jstl-screen-active");
					        aElement.addClass("jstl-screen-inactive");
				        }
				    });
				    aElement.attr("jstl-screen-condition-init", "");
				    aTaskChain.finish();
			    } else
				    aTaskChain.nextTask();
		    }
		};

		de.titus.jstl.TaskRegistry.append("screenCondition", de.titus.jstl.Constants.PHASE.INIT, "[jstl-screen-condition]", de.titus.jstl.functions.ScreenCondition.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Choose", function() {
		let Choose = de.titus.jstl.functions.Choose = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Choose"),

		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-choose");
			    if (typeof expression !== 'undefined') {
				    Choose.__compute(aElement, aDataContext, aProcessor, aProcessor.resolver);
				    aTaskChain.preventChilds();
			    }

			    aTaskChain.nextTask();
		    },

		    __compute : function(aChooseElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChilds(" + aChooseElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");

			    var resolved = false;
			    aChooseElement.children().each(function() {
				    var child = $(this);
				    if (!resolved && Choose.__computeChild(aChooseElement, child, aDataContext, aProcessor, aExpressionResolver)) {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("compute child: " + child);
					    aProcessor.compute(child, aDataContext);
					    resolved = true;
				    } else {
					    if (Choose.LOGGER.isTraceEnabled())
						    Choose.LOGGER.logTrace("remove child: " + child);
					    child.remove();
				    }
			    });
		    },

		    __computeChild : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processChild(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");

			    if (Choose.__computeWhen(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else if (Choose.__computeOtherwise(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver))
				    return true;
			    else
				    return false;
		    },

		    __computeWhen : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processWhenElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");

			    let expression = aElement.attr("jstl-when");
			    if (typeof expression !== 'undefined')
				    return aExpressionResolver.resolveExpression(expression, aDataContext, false);
			    return false;
		    },

		    __computeOtherwise : function(aChooseElement, aElement, aDataContext, aProcessor, aExpressionResolver) {
			    if (Choose.LOGGER.isDebugEnabled())
				    Choose.LOGGER.logDebug("execute processOtherwiseElement(" + aChooseElement + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ", " + aExpressionResolver + ")");

			    if (typeof aElement.attr("jstl-otherwise") !== 'undefined')
				    return true;
			    return false;
		    }
		};

		de.titus.jstl.TaskRegistry.append("choose", de.titus.jstl.Constants.PHASE.CONDITION, "[jstl-choose]", de.titus.jstl.functions.Choose.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Foreach", function() {
		let Foreach = de.titus.jstl.functions.Foreach = {

		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Foreach"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-foreach");
			    if (expression !== undefined) {
				    aTaskChain.preventChilds();
				    Foreach.__compute(expression, aElement, aContext, aProcessor, aProcessor.resolver, aTaskChain);
			    } else
				    aTaskChain.nextTask();
		    },

		    __compute : function(aExpression, aElement, aContext, aProcessor, aResolver, aTaskChain) {
			    if (Foreach.LOGGER.isDebugEnabled())
				    Foreach.LOGGER.logDebug("execute __compute(" + aElement + ", " + aContext + ", " + aProcessor + ", " + aResolver + ")");

			    var template = Foreach.__template(aElement);
			    if (typeof template !== 'undefined') {
				    aElement.empty();
				    let varName = aElement.attr("jstl-foreach-var") || "itemVar";
				    let statusName = aElement.attr("jstl-foreach-status") || "statusVar";
				    if (aExpression.length == 0 && typeof aElement.attr("jstl-foreach-count") !== "undefined")
					    Foreach.__count(template, statusName, aElement, aContext, aProcessor, aTaskChain);
				    else {
					    let list = aResolver.resolveExpression(aExpression, aContext, undefined);
					    if (typeof list === "undefined")
					    	aTaskChain.nextTask();
					    else if (Array.isArray(list))
						    Foreach.__list(list, template, varName, statusName, aElement, aContext, aProcessor, aTaskChain);
					    else if (typeof list === "object")
						    Foreach.__map(list, template, varName, statusName, aElement, aContext, aProcessor, aTaskChain);					   
					    else
						    aTaskChain.nextTask();
				    }
			    }
		    },
		    __count : function(aTemplate, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var count = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-count"));
			    var step = typeof aElement.attr("jstl-foreach-step") !== 'undefined' ? aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-step")) : 1;
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain);

			    for (let i = startIndex; i < count; i += step) {
				    let context = {};
				    context = $.extend(context, aContext);
				    context[aStatusName] = {
				        "index" : i,
				        "count" : count,
				        "context" : aContext
				    };
				    executeChain.count++;
				    Foreach.__computeContent(aTemplate.clone(), context, aElement, aProcessor, executeChain);
			    }
		    },

		    __list : function(aListData, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var startIndex = aProcessor.resolver.resolveExpression(aElement.attr("jstl-foreach-start-index"), aContext, 0) || 0;
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);

			    for (let i = startIndex; i < aListData.length; i++) {
				    let context = {};
				    context = $.extend(context, aContext);
				    context[aVarname] = aListData[i];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "count" : aListData.length,
				        "data" : aListData,
				        "context" : aContext
				    };
				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(aTemplate.clone(), context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },

		    __map : function(aMap, aTemplate, aVarname, aStatusName, aElement, aContext, aProcessor, aTaskChain) {
			    var breakCondition = aElement.attr("jstl-foreach-break-condition");
			    var executeChain = new de.titus.jstl.ExecuteChain(aTaskChain, 1);
			    var properties = Object.getOwnPropertyNames(aMap);

			    for (let i = 0; i < properties.length; i++) {
				    let name = properties[i];
				    let context = {};
				    context = $.extend(context, aContext);
				    context[aVarname] = aMap[name];
				    context[aStatusName] = {
				        "index" : i,
				        "number" : (i + 1),
				        "key" : name,
				        "data" : aMap,
				        "context" : aContext
				    };

				    if (breakCondition && Foreach.__break(context, breakCondition, aElement, aProcessor))
					    return executeChain.finish();
				    else {
					    executeChain.count++;
					    Foreach.__computeContent(aTemplate.clone(), context, aElement, aProcessor, executeChain);
				    }
			    }
			    executeChain.finish();
		    },

		    __break : function(aContext, aBreakCondition, aElement, aProcessor) {
			    var expression = aProcessor.resolver.resolveExpression(aBreakCondition, aContext, false);
			    if (typeof expression === "function")
				    expression = expression(aElement, aContext, aProcessor);

			    return expression == true || expression == "true";
		    },

		    __computeContent : function(aContent, aContext, aElement, aProcessor, aExecuteChain) {
			    aContent.appendTo(aElement);
			    aProcessor.compute(aContent, aContext, function() {
				    aExecuteChain.finish();
			    });
		    },

		    __template : function(aElement) {
			    var template = aElement.data("de.titus.jstl.functions.Foreach.Template");
			    if (typeof template === 'undefined') {
				    template = $("<jstl/>").append(aElement.contents());
				    aElement.data("de.titus.jstl.functions.Foreach.Template", template);
			    }
			    return template;
		    }
		};

		de.titus.jstl.TaskRegistry.append("foreach", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-foreach]", de.titus.jstl.functions.Foreach.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Text", function() {
		let Text = de.titus.jstl.functions.Text = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Text"),

		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Text.LOGGER.isDebugEnabled())
				    Text.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let ignore = aElement.attr("jstl-text-ignore");
			    if (typeof ignore === "undefined") {
				    // IE BUG
				    if (!de.titus.core.Page.getInstance().detectBrowser().other)
					    Text.normalize(aElement[0]);
				    var contenttype = aElement.attr("jstl-text-content-type") || "text";
				    aElement.contents().filter(function() {
					    return (this.nodeType === 3 || this.nodeType === 4) && this.textContent != undefined && this.textContent.trim() != "";
				    }).each(function() {
					    let text = this.textContent;
					    if (text) {
						    text = aProcessor.resolver.resolveText(text, aContext);
						    let contentFunction = Text.CONTENTTYPE[contenttype];
						    if (contentFunction)
							    contentFunction(this, text, aElement, aProcessor, aContext);
					    }
				    });
			    }

			    aTaskChain.nextTask();
		    },

		    normalize : function(aNode) {
			    if (aNode) {
				    if (aNode.nodeType == 3) {
					    var text = aNode.textContent;
					    while (aNode.nextSibling && aNode.nextSibling.nodeType == 3) {
						    text += aNode.nextSibling.textContent;
						    aNode.parentNode.removeChild(aNode.nextSibling);
					    }
					    aNode.textContent = text;
				    } else {
					    Text.normalize(aNode.firstChild);
				    }
				    Text.normalize(aNode.nextSibling);
			    }
		    },

		    CONTENTTYPE : {
		        "html" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        $(aNode).replaceWith($.parseHTML(aText));
		        },
		        "json" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        if (typeof aText === "string")
				        aNode.textContent = aText;
			        else
				        aNode.textContent = JSON.stringify(aText);
		        },
		        "text" : function(aNode, aText, aBaseElement, aProcessor, aContext) {
			        var text = aText;
			        var addAsHtml = false;

			        let trimLength = (aBaseElement.attr("jstl-text-trim-length") || "").trim();
			        if (trimLength.length > 0) {
				        trimLength = aProcessor.resolver.resolveExpression(trimLength, aContext, "-1");
				        trimLength = parseInt(trimLength);
				        if (trimLength && trimLength > 0)
					        text = de.titus.core.StringUtils.trimTextLength(text, trimLength);
			        }

			        let preventformat = aBaseElement.attr("jstl-text-prevent-format");
			        if (typeof preventformat === "string") {
				        preventformat = preventformat.trim().length > 0 ? (aProcessor.resolver.resolveExpression(preventformat, aContext, true) || true) : true;
				        if (preventformat) {
					        text = de.titus.core.StringUtils.formatToHtml(text);
					        addAsHtml = true;
				        }
			        }

			        if (addAsHtml)
				        $(aNode).replaceWith($.parseHTML(text));
			        else
				        aNode.textContent = text;
		        }
		    }
		};

		Text.CONTENTTYPE["text/html"] = Text.CONTENTTYPE["html"];
		Text.CONTENTTYPE["application/json"] = Text.CONTENTTYPE["json"];
		Text.CONTENTTYPE["text/plain"] = Text.CONTENTTYPE["text"];

		de.titus.jstl.TaskRegistry.append("text", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Text.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Attribute", function() {
		let Attribute = de.titus.jstl.functions.Attribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Attribute"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Attribute.LOGGER.isDebugEnabled())
				    Attribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");

			    let attributes = aElement[0].attributes || [];
			    for (var i = 0; i < attributes.length; i++) {
				    let name = attributes[i].name;
				    if (name.indexOf("jstl-") != 0) {
					    let value = attributes[i].value;
					    if (value != undefined && value != "") {
						    try {
							    let newValue = aProcessor.resolver.resolveText(value, aDataContext);
							    if (value != newValue) {
								    if (Attribute.LOGGER.isDebugEnabled()) {
									    Attribute.LOGGER.logDebug("Change attribute \"" + name + "\" from \"" + value + "\" to \"" + newValue + "\"!");
								    }
								    aElement.attr(name, newValue);
							    }
						    } catch (e) {
							    Attribute.LOGGER.logError("Can't process attribute\"" + name + "\" with value \"" + value + "\"!");
						    }
					    }
				    }
			    }

			    aTaskChain.nextTask();
		    }
		};

		de.titus.jstl.TaskRegistry.append("attribute", de.titus.jstl.Constants.PHASE.CONTENT, undefined, de.titus.jstl.functions.Attribute.TASK);
	});
})($);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Data", function() {
		let Data = de.titus.jstl.functions.Data = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Data"),

		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug("TASK");

			    let expression = aElement.attr("jstl-data");
			    if (typeof expression !== 'undefined') {
				    let varname = aElement.attr("jstl-data-var");
				    let defaultValue = Data.__defaultvalue(aElement, expression, aDataContext, aProcessor);
				    let mode = aElement.attr("jstl-data-mode") || "direct";
				    Data.MODES[mode](expression, defaultValue, aElement, varname, aDataContext, aProcessor, aTaskChain);

			    } else
				    aTaskChain.nextTask();
		    },

		    __defaultvalue : function(aElement, anExpression, aDataContext, aProcessor) {
			    let defaultExpression = aElement.attr("jstl-data-default");
			    if (typeof defaultExpression === 'undefined')
				    return anExpression;
			    else if (defaultExpression.length == 0)
				    return undefined;
			    else
				    return aProcessor.resolver.resolveExpression(defaultExpression, aDataContext, anExpression);
		    },

		    __options : function(aElement, aDataContext, aProcessor) {
			    let options = aElement.attr("jstl-data-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aDataContext);
				    options = aProcessor.resolver.resolveExpression(options, aDataContext);
				    return options;
			    }
		    },
		    __updateContext : function(aVarname, aData, aTaskChain) {
			    if (typeof aData !== 'undefined') {
				    if (!aVarname)
					    aTaskChain.updateContext(aData, true);
				    else
					    aTaskChain.context[aVarname] = aData;
			    }
		    },

		    MODES : {
		        "direct" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let data = aProcessor.resolver.resolveExpression(anExpression, aDataContext, aDefault);
			        Data.__updateContext(aVarname, data, aTaskChain);
			        aTaskChain.nextTask();
		        },

		        "remote" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let url = aProcessor.resolver.resolveText(anExpression, aDataContext);
			        url = de.titus.core.Page.getInstance().buildUrl(url);
			        let option = Data.__options(aElement, aDataContext, aProcessor);
			        let datatype = (aElement.attr("jstl-data-datatype") || "json").toLowerCase();

			        let ajaxSettings = {
			            "url" : url,
			            "async" : true,
			            "cache" : false,
			            "dataType" : datatype,
			            "success" : function(aData, aState, aResponse) {
				            Data.__remoteResponse(aVarname, datatype, aTaskChain, ajaxSettings, aData, aState, aResponse);
			            },
			            "error" : function(aResponse, aState, aError) {
				            Data.__remoteError(aElement, aTaskChain, ajaxSettings, aResponse, aState, aError);
			            }
			        };
			        if (option)
				        ajaxSettings = $.extend(ajaxSettings, option);

			        $.ajax(ajaxSettings);
		        },

		        "url-parameter" : function(anExpression, aDefault, aElement, aVarname, aDataContext, aProcessor, aTaskChain) {
			        let parameterName = aProcessor.resolver.resolveText(anExpression, aDataContext, anExpression);
			        let data = de.titus.core.Page.getInstance().getUrl().getParameter(parameterName);
			        if (typeof data !== 'undefined')
				        Data.__updateContext(aVarname, data, aTaskChain);
			        else if (typeof aDefault !== 'undefined')
				        Data.__updateContext(aVarname, aDefault, aTaskChain);

			        aTaskChain.nextTask();
		        }
		    },
		    CONTENTYPE : {
		        "xml" : de.titus.core.Converter.xmlToJson,
		        "json" : function(aData) {
			        return aData;
		        }
		    },

		    __remoteResponse : function(aVarname, aDatatype, aTaskChain, aRequest, aData, aState, aResponse) {
			    if (Data.LOGGER.isDebugEnabled())
				    Data.LOGGER.logDebug([ "add remote data \"", aData, "\ as var \"", aVarname, "\" as datatype \"", aDatatype, "\" -> (request: \"", aRequest, "\", response: \"", aResponse, "\")" ]);

			    Data.__updateContext(aVarname, Data.CONTENTYPE[aDatatype](aData), aTaskChain);
			    aTaskChain.nextTask();
		    },

		    __remoteError : function(aElement, aTaskChain, aRequest, aResponse, aState, aError) {
			    Data.LOGGER.logError([ "jstl-data error at element \"", aElement, "\" -> request: \"", aRequest, "\", response: \"", aResponse, "\", state: \"", aState, "\" error: \"", aError, "\"!" ]);
			    aTaskChain.finish();
		    }
		};

		de.titus.jstl.TaskRegistry.append("data", de.titus.jstl.Constants.PHASE.CONTEXT, "[jstl-data]", de.titus.jstl.functions.Data.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Include", function() {

		let Include = de.titus.jstl.functions.Include = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Include"),
		    CACHE : {},
		    TASK : function(aElement, aContext, aProcessor, aTaskChain) {
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute run(" + aElement + ", " + aContext + ", " + aProcessor + ")");

			    let expression = aElement.attr("jstl-include");
			    if (expression.length > 0)
				    Include.__compute(expression, aElement, aContext, aProcessor, aTaskChain);
			    else
				    aTaskChain.nextTask();
		    },

		    __cacheCallback : function(aElement, aProcessor, aContext, aTaskChain, aTemplate) {
			    Include.__include(aElement, aTemplate, aProcessor, aContext, aTaskChain);
		    },

		    __executeCacheCallback : function(aUrl, aTemplate) {
			    let cache = Include.CACHE[aUrl.hashCode()];
			    cache.onload = false;
			    cache.template = $("<jstl/>").append(aTemplate);
			    for (let i = 0; i < cache.callback.length; i++)
				    cache.callback[i](cache.template);
		    },

		    __compute : function(anIncludeExpression, aElement, aContext, aProcessor, aTaskChain) {
			    aElement.addClass("jstl-include-loading");
			    let url = aProcessor.resolver.resolveText(anIncludeExpression, aContext);
			    url = Include.__buildUrl(url);
			    let disableCaching = url.indexOf("?") >= 0 || typeof aElement.attr("jstl-include-cache-disabled") !== 'undefined';
			    let cache = undefined;
			    if (!disableCaching)
				    cache = Include.CACHE[url.hashCode()];

			    if (cache) {
				    if (cache.onload)
					    cache.callback.push(function(aTemplate) {
						    Include.__cacheCallback(aElement, aProcessor, aContext, aTaskChain, aTemplate);
					    });
				    else
					    Include.__include(aElement, cache.template, aProcessor, aContext, aTaskChain);
			    } else {
				    cache = Include.CACHE[url.hashCode()] = {
				        onload : true,
				        callback : [ function(aTemplate) {
					        Include.__cacheCallback(aElement, aProcessor, aContext, aTaskChain, aTemplate);
				        } ]
				    };
				    let ajaxSettings = $.extend({
				        'url' : url,
				        'async' : true,
				        'cache' : (typeof aElement.attr("jstl-include-ajax-cache-disabled") === 'undefined'),
				        "dataType" : "html"
				    }, Include.__options(aElement, aContext, aProcessor));

				    ajaxSettings.success = function(aTemplate) {
					    Include.__executeCacheCallback(url, aTemplate);
				    };
				    ajaxSettings.error = function(aResponse, aState, aError) {
					    Include.__remoteError(aElement, aTaskChain, ajaxSettings, aResponse, aState, aError);
				    };

				    $.ajax(ajaxSettings);
			    }
		    },
		    URLPATTERN : new RegExp("^((https?://)|/).*", "i"),

		    __buildUrl : function(aUrl) {
			    let url = aUrl;
			    if (!Include.URLPATTERN.test(aUrl))
				    url = GlobalSettings.DEFAULT_INCLUDE_BASEPATH + aUrl;
			    url = de.titus.core.Page.getInstance().buildUrl(url);
			    if (Include.LOGGER.isDebugEnabled())
				    Include.LOGGER.logDebug("execute __buildUrl(\"" + aUrl + "\") -> result: " + url);

			    return url;
		    },

		    __options : function(aElement, aContext, aProcessor) {
			    let options = aElement.attr("jstl-include-options");
			    if (options) {
				    options = aProcessor.resolver.resolveText(options, aContext);
				    options = aProcessor.resolver.resolveExpression(options, aContext);
				    return options;
			    }
		    },

		    __mode : function(aElement, aContext, aProcessor) {
			    let mode = aElement.attr("jstl-include-mode");
			    if (mode == undefined)
				    return "replace";

			    mode = mode.toLowerCase();
			    if (mode == "append" || mode == "replace" || mode == "prepend")
				    return mode;

			    return "replace";
		    },

		    __include : function(aElement, aTemplate, aProcessor, aContext, aTaskChain) {
				if (Include.LOGGER.isDebugEnabled())
					Include.LOGGER.logDebug("execute __include()");
				let template = aTemplate.clone();
				let includeMode = Include.__mode(aElement, aContext, aProcessor);

				if (includeMode == "replace") {
					aElement.empty();
					aElement.append(template.contents());
					aElement.removeClass("jstl-include-loading");
					aTaskChain.nextTask();
				} else if (includeMode == "append") {
					let wrapper = $("<div></div>");
					wrapper.append(template);
					aProcessor.compute(wrapper, aContext, (function(aElement, aTemplate, aTaskChain) {
						aElement.append(aTemplate.contents());
						aElement.removeClass("jstl-include-loading");
						aTaskChain.finish();
					}).bind({}, aElement, wrapper, aTaskChain));
				} else if (includeMode == "prepend"){
					let wrapper = $("<div></div>");
					wrapper.append(template);
					aProcessor.compute(wrapper, aContext, (function(aElement, aTemplate, aTaskChain) {
						aElement.prepend(template.contents());
						aElement.removeClass("jstl-include-loading");
						aTaskChain.finish();
					}).bind({}, aElement, wrapper, aTaskChain));					
				}				
			},

		    __remoteError : function(aElement, aTaskChain, aRequest, aResponse, aState, aError) {
			    Include.LOGGER.logError([ "jstl-include error at element \"", aElement, "\" -> request: \"", aRequest, "\", response: \"", aResponse, "\", state: \"", aState, "\" error: \"", aError, "\"!" ]);
			    aTaskChain.finish();
		    }
		};

		de.titus.jstl.TaskRegistry.append("include", de.titus.jstl.Constants.PHASE.MANIPULATION, "[jstl-include]", de.titus.jstl.functions.Include.TASK);
	});
})($, de.titus.jstl.GlobalSettings);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.AddAttribute", function() {
		var AddAttribute = de.titus.jstl.functions.AddAttribute = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.AddAttribute"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (AddAttribute.LOGGER.isDebugEnabled())
				    AddAttribute.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var expression = aElement.attr("jstl-add-attribute");
			    if (expression) {
				    expression = aProcessor.resolver.resolveExpression(expression, aDataContext, false);
				    if (expression && typeof expression === "function")
					    expression = expression(aElement, aDataContext, aProcessor);
				    
				    if (expression && Array.isArray(expression))
					    AddAttribute.processArray(expression, aElement, aDataContext, aProcessor);
				    else if (expression && typeof expression === "object")
					    AddAttribute.processObject(expression, aElement, aDataContext, aProcessor);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    processArray : function(theDataArray, aElement, aDataContext, aProcessor) {
			    for (var i = 0; i < theDataArray.length; i++) {
				    AddAttribute.processObject(theDataArray[i], aElement, aDataContext, aProcessor);
			    }
		    },
		    
		    processObject : function(theData, aElement, aDataContext, aProcessor) {
			    if (theData.name)
				    aElement.attr(theData.name, theData.value);
			    else
				    AddAttribute.LOGGER.logError("run processObject (" + theData + ", " + aElement + ", " + aDataContext + ", " + aProcessor + ") -> No attribute name defined!");
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("add-attribute", de.titus.jstl.Constants.PHASE.CONTENT, "[jstl-add-attribute]", de.titus.jstl.functions.AddAttribute.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Databind", function() {
		var Databind = de.titus.jstl.functions.Databind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Databind"),
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Databind.LOGGER.isDebugEnabled())
				    Databind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    var varname = aElement.attr("jstl-databind-name");
			    if (varname && varname.trim() != "") {
				    var value = Databind.__value(aElement, aDataContext, aProcessor);
				    if (value != undefined)
					    aElement.data(varname, value);
			    }
			    
			    aTaskChain.nextTask();
		    },
		    
		    __value : function(aElement, aDataContext, aProcessor) {
			    return aProcessor.resolver.resolveExpression(aElement.attr("jstl-databind"), aDataContext, undefined);
		    }		
		};
		
		de.titus.jstl.TaskRegistry.append("databind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-databind]", de.titus.jstl.functions.Databind.TASK);
	});
})($);
(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.functions.Eventbind", function() {
		var Eventbind = de.titus.jstl.functions.Eventbind = {
		    LOGGER : de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.functions.Eventbind"),
		    
		    TASK : function(aElement, aDataContext, aProcessor, aTaskChain) {
			    if (Eventbind.LOGGER.isDebugEnabled())
				    Eventbind.LOGGER.logDebug("execute run(" + aElement + ", " + aDataContext + ", " + aProcessor + ")");
			    
			    if (aElement.attr("jstl-eventbind") != undefined)
				    aElement.de_titus_core_EventBind(aDataContext);
			    
			    aTaskChain.nextTask();
		    }
		
		};
		
		de.titus.jstl.TaskRegistry.append("eventbind", de.titus.jstl.Constants.PHASE.BINDING, "[jstl-eventbind]", de.titus.jstl.functions.Eventbind.TASK);
	});
})($);
(function($, SpecialFunctions, GlobalSettings) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
		var Processor = function(aElement, aContext, aCallback) {
			this.element = aElement;
			this.parent = this.element.parent();
			this.context = aContext || {};
			this.callback = aCallback;
			this.resolver = new de.titus.core.ExpressionResolver(this.element.data("jstlExpressionRegex"));
		};

		Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");

		Processor.prototype.compute = function(aElement, aContext, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug([ "execute compute(\"", aElement, "\", \"", aContext, "\")" ]);
			if (!aElement) {
				this.element.removeClass("jstl-ready");
				this.element.addClass("jstl-running");
				this.element.trigger(de.titus.jstl.Constants.EVENTS.onStart, [ aContext, this ]);
				this.__computeElement(this.element, this.context, true, this.callback);
			} else
				this.__computeElement(aElement, aContext, false, aCallback);
		};

		Processor.prototype.__computeElement = function(aElement, aContext, isRoot, aCallback) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug(["__computeElement() -> root: ", isRoot, "\""]);

			let self = this;
			let taskChain = new de.titus.jstl.TaskChain(aElement, aContext, this, isRoot, function(aElement, aContext){ self.__computeFinished(isRoot, aCallback, aElement, aContext);});
			taskChain.nextTask();
		};

		Processor.prototype.__computeFinished = function(isRoot, aCallback, aElement, aContext) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("__computeFinished() -> is root: " + isRoot);

			if (typeof aCallback === "function")
				aCallback(aElement, aContext, this, isRoot);

			var tagName = aElement.tagName();
			if ((tagName == "x-jstl" || tagName == "jstl") && aElement.contents().length > 0)
				aElement.replaceWith(aElement.contents());

			if (isRoot) {
				this.context = aContext;
				this.onReady();
			}
		};

		Processor.prototype.onReady = function(aFunction) {
			if (Processor.LOGGER.isDebugEnabled())
				Processor.LOGGER.logDebug("onReady()");

			if (aFunction) {
				this.element.one(de.titus.jstl.Constants.EVENTS.onReady, function(anEvent) {
					aFunction(anEvent.delegateTarget, anEvent.data);
				});
				return this;
			} else {
				let self = this;
				setTimeout(function() {
					self.element.removeClass("jstl-running");
					self.element.addClass("jstl-ready");
					self.element.trigger(de.titus.jstl.Constants.EVENTS.onReady, [ self ]);
				}, GlobalSettings.DEFAULT_TIMEOUT_VALUE * 10);
			}
		};

		de.titus.jstl.Processor = Processor;
	});
})(jQuery, de.titus.core.SpecialFunctions, de.titus.jstl.GlobalSettings);
de.titus.core.Namespace.create("de.titus.jstl.javascript.polyfills", function() {
//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from#Polyfill	


	if (!Array.from) {
	  Array.from = (function () {
	    var toStr = Object.prototype.toString;
	    var isCallable = function (fn) {
	      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
	    };
	    var toInteger = function (value) {
	      var number = Number(value);
	      if (isNaN(number)) { return 0; }
	      if (number === 0 || !isFinite(number)) { return number; }
	      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
	    };
	    var maxSafeInteger = Math.pow(2, 53) - 1;
	    var toLength = function (value) {
	      var len = toInteger(value);
	      return Math.min(Math.max(len, 0), maxSafeInteger);
	    };
	
	    // The length property of the from method is 1.
	    return function from(arrayLike/*, mapFn, thisArg */) {
	      // 1. Let C be the this value.
	      var C = this;
	
	      // 2. Let items be ToObject(arrayLike).
	      var items = Object(arrayLike);
	
	      // 3. ReturnIfAbrupt(items).
	      if (arrayLike == null) {
	        throw new TypeError("Array.from requires an array-like object - not null or undefined");
	      }
	
	      // 4. If mapfn is undefined, then let mapping be false.
	      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
	      var T;
	      if (typeof mapFn !== 'undefined') {
	        // 5. else
	        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
	        if (!isCallable(mapFn)) {
	          throw new TypeError('Array.from: when provided, the second argument must be a function');
	        }
	
	        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
	        if (arguments.length > 2) {
	          T = arguments[2];
	        }
	      }
	
	      // 10. Let lenValue be Get(items, "length").
	      // 11. Let len be ToLength(lenValue).
	      var len = toLength(items.length);
	
	      // 13. If IsConstructor(C) is true, then
	      // 13. a. Let A be the result of calling the [[Construct]] internal method 
	      // of C with an argument list containing the single item len.
	      // 14. a. Else, Let A be ArrayCreate(len).
	      var A = isCallable(C) ? Object(new C(len)) : new Array(len);
	
	      // 16. Let k be 0.
	      var k = 0;
	      // 17. Repeat, while k < len… (also steps a - h)
	      var kValue;
	      while (k < len) {
	        kValue = items[k];
	        if (mapFn) {
	          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
	        } else {
	          A[k] = kValue;
	        }
	        k += 1;
	      }
	      // 18. Let putStatus be Put(A, "length", len, true).
	      A.length = len;
	      // 20. Return A.
	      return A;
	    };
	  }());
	}

});(function($) {
	"use strict";
	de.titus.core.Namespace.create("de.titus.jquery.jstl.plugin", function() {
		$.fn.jstl = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				return this.each(function() {
					return $(this).jstl(aData);
				});
			} else {
				var processor = this.data("de.titus.jstl.Processor");
				if (!processor) {
					var data = aData || {};
					processor = new de.titus.jstl.Processor(this, $.extend(true, {}, data.data), data.callback || data.success);
					// processor = new de.titus.jstl.Processor(this, data.data,
					// data.callback || data.success);
					this.data("de.titus.jstl.Processor", processor);
				} else if (aData) {
					var data = aData || {};
					if (data.data)
						// processor.context = data.data;
						processor.context = $.extend(true, {}, data.data);
					if (typeof data.callback === 'function')
						processor.callback = data.callback
				}
				processor.compute();
				return processor;
			}
		};

		$.fn.jstlAsync = function(aData) {
			if (this.length == 0)
				return;
			else if (this.length > 1) {
				var result = [];
				this.each(function() {
					var value = $(this).jstlAsync(aData);
					if (value)
						result.push(value);
				});
				return result;
			} else {
				var self = this;
				setTimeout(function() {
					self.jstl(aData);
				}, 1);
				return this;
			}
		};

		$(document).ready(function() {
			$("[jstl-autorun]").jstlAsync();
		});

	});
}(jQuery));
