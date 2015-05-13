de.titus.core.Namespace.create("de.titus.jstl.Processor", function() {
	
	de.titus.jstl.Processor = function(aRootElement, aRootDataContext, aDomHelper, aConfig) {
		this.domHelper = aDomHelper || new de.titus.core.DomHelper();
		this.rootElement = this.domHelper.toDomObject(aRootElement);
		this.rootDataContext = aRootDataContext || {};
		this.expressionResolver = new de.titus.jstl.ExpressionResolver(this.domHelper);
		this.config = {"attributePrefix": "jstl-"};
		this.config = this.domHelper.mergeObjects(aConfig, this.config);
	};
	
	/****************************************************************
	 * static variables
	 ***************************************************************/
	de.titus.jstl.Processor.LOGGER = de.titus.logging.LoggerFactory.getInstance().newLogger("de.titus.jstl.Processor");	
	
	/****************************************************************
	 * functions
	 ***************************************************************/
	
	de.titus.jstl.Processor.prototype.compute = /* boolean */function(aElement, aDataContext) {
		if(de.titus.jstl.Processor.LOGGER.isDebugEnabled())
			de.titus.jstl.Processor.LOGGER.logDebug("execute compute(" + aElement + ", " + aDataContext + ")");
		
		if(aElement == undefined)
			return this.internalComputeRoot();
		
		return this.internalComputeElement(aElement, aDataContext);
	};
	
	de.titus.jstl.Processor.prototype.internalComputeRoot = /* boolean */function() {
		return this.internalComputeElement(this.rootElement, this.rootDataContext);
	};
	
	de.titus.jstl.Processor.prototype.internalComputeElement = /* boolean */function(aElement, aDataContext) {
		var dataContext = aDataContext || this.rootDataContext;
		return this.internalExecuteFunction(aElement, dataContext);
	};
	
	de.titus.jstl.Processor.prototype.internalExecuteFunction = /* boolean */function(aElement, aDataContext) {
		if(de.titus.jstl.Processor.LOGGER.isDebugEnabled())
			de.titus.jstl.Processor.LOGGER.logDebug("execute internalExecuteFunction(" + aElement + ", " + aDataContext + ")");
		
		try {
			var functions = de.titus.jstl.FunctionRegistry.getInstance().functions;
			for (var i = 0; i < functions.length; i++) {
				var functionObject = functions[i];
				if(!functionObject.run(aElement, aDataContext, this))
					return true; //Vorzeitiger abbruch der Verarbeitung
			}
			
			return this.internalComputeChilds(aElement, aDataContext);
		} catch (e) {
			de.titus.jstl.Processor.LOGGER.logError(e);
			return false;
		}	
	};
	
	de.titus.jstl.Processor.prototype.internalComputeChilds = /* boolean */function(aElement, aDataContext) {
		if(de.titus.jstl.Processor.LOGGER.isDebugEnabled())
			de.titus.jstl.Processor.LOGGER.logDebug("execute internalComputeChilds(" + aElement + ", " + aDataContext + ")");
		
		var childs = this.domHelper.getChilds(aElement);
		if(childs == undefined)
			return true;
		else if(!this.domHelper.isArray(childs))
			return this.compute(childs, aDataContext);
		else
		{
			for(var i = 0; i < childs.length; i++){
				var newElement = this.domHelper.toDomObject(childs[i]);
				if(!this.compute(newElement, aDataContext))
					return false;
			}
		}
		return true;
	};
});
