de.titus.core.Namespace.create("de.titus.TemplateEngineSettings", function(){

	de.titus.TemplateEngineSettings = /* constructor */function(aTargetElement, aDomHelper) {
		this.domHelper = aDomHelper || de.titus.utils.DomHelper.getInstance();
		this.target = this.domHelper.toDomObject(aTargetElement);

		this.template;
		this.templateMode = 'id'; // id, remote, function
		this.templateAsync = true;
		this.templateRemoteData = {};

		this.data;
		this.dataMode = 'direct'; // direct, remote, function
		this.dataAsync = true;
		this.dataRemoteData = {};

		this.options;
		this.optionsMode = 'direct'; // direct, remote, function
		this.optionsAsync = true;
		this.optionsRemoteData = {};

		this.onLoad = function() {
		};
		this.onSuccess = function() {
		};
		this.onError = function() {
		};
		
		this.attributePrefix = "tpl-";
	};

	/**
	 * Initialize all required settings.
	 *
	 * @param theOverrideSettings
	 */
	de.titus.TemplateEngineSettings.prototype.initialize = function() {

		this.templateRemoteData = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix +'template-remote-data'), {});
		this.dataRemoteData = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix+'template-data-remote-data'), {})
		this.optionsRemoteData = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options-remote-data'), {})
		this.initTemplateSettings();
		this.initDataSettings();
		this.initOptionsSettings();
	};

	/**
	 * Initialize the settings for the template
	 */
	de.titus.TemplateEngineSettings.prototype.initTemplateSettings = function() {
		if (this.template != undefined) {
			return;
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template') != undefined) {
			this.template = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template'));
			this.templateMode = 'id';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-remote') != undefined) {
			this.template = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-remote');
			this.templateMode = 'remote';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-function') != undefined) {
			this.template = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-function');
			this.templateMode = 'function';
		} else {
			console.log('There is no template definition available!');
		}

	};

	/**
	 * Initialize the settings for the data
	 */
	de.titus.TemplateEngineSettings.prototype.initDataSettings = function() {
		if (this.data != undefined) {
			return;
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data') != undefined) {
			this.data = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data'));
			this.dataMode = 'direct';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-remote') != undefined) {
			this.data = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-remote');
			this.dataMode = 'remote';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-function') != undefined) {
			this.data = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-data-function');
			this.dataMode = 'function';
		} else {
			console.log('There is no data definition available!');
		}
	};

	/**
	 * Initialize the settings for the options
	 */
	de.titus.TemplateEngineSettings.prototype.initOptionsSettings = function() {
		if (this.options != undefined) {
			return;
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options') != undefined) {
			this.options = this.domHelper.doEval(this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options'));
			this.optionsMode = 'direct';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options-remote') != undefined) {
			this.options = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options-remote');
			this.optionsMode = 'remote';
		} else if (this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options-function') != undefined) {
			this.options = this.domHelper.getAttribute(this.target, this.attributePrefix + 'template-options-function');
			this.optionsMode = 'function';
		} else {
			this.options = {};
		}
	};
});
