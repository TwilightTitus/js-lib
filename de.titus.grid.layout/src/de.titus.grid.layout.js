de.titus.core.Namespace.create("de.titus.grid.layout", function() {
	
	de.titus.grid.layout.Layouter = function(aElement, aDomHelper) {
		this.domHelper = aDomHelper;
		this.element = this.domHelper.toDomObject(aElement);
		this.config = this.initConfig();
	};
	
	de.titus.grid.layout.Layouter.prototype.initConfig(){
		var config = {};
		//config.columnCount = this.domHelper.getAttribute(aElement, "grid-layout-column-count");
		//config.columnWidth = this.element.width() / config.columnCount;
		
		
		return config;
	};
	
	de.titus.grid.layout.Layouter.prototype.doLayout(){
		var this_ = this;
		$.each(this.element.children(), function( index, aChild){
			var child = this_.domHelper.toDomObject(aChild);
			var width = this_.domHelper.getWidth(child);
			var height = this_.domHelper.getHeight(child);			
			var colSpan = this_.domHelper.getAttribute(child, "grid-layout-column-span");
			var rowSpan = this_.domHelper.getAttribute(child, "grid-layout-row-span");
			
						
		});
	};
	
	
	
});
