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


if(de==undefined){var de={};}if(de.titus==undefined){de.titus={};}if(de.titus.core==undefined){de.titus.core={};}if(de.titus.core.Namespace==undefined){de.titus.core.Namespace={};de.titus.core.Namespace.create=function(aNamespace,aFunction){var namespaces=aNamespace.split(".");var currentNamespace=window;var namespaceCreated=false;for(i=0;i<namespaces.length;i++){if(currentNamespace[namespaces[i]]==undefined){currentNamespace[namespaces[i]]={};namespaceCreated=true;}currentNamespace=currentNamespace[namespaces[i]];}if(namespaceCreated&&aFunction!=undefined){"use strict";aFunction();}return namespaceCreated;};de.titus.core.Namespace.exist=function(aNamespace){var namespaces=aNamespace.split(".");var currentNamespace=window;for(i=0;i<namespaces.length;i++){if(currentNamespace[namespaces[i]]==undefined){return false;}currentNamespace=currentNamespace[namespaces[i]];}return true;};}de.titus.core.Namespace.create("de.titus.core.SpecialFunctions",function(){de.titus.core.SpecialFunctions={};de.titus.core.SpecialFunctions.doEval=function(aDomhelper,aStatement,aContext){if(aStatement!=undefined){eval("var $___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$ = function($___DOMHELPER___$,$___CONTEXT___$){ "+"$___DOMHELPER___$.mergeObjects(this, $___CONTEXT___$);"+"var $___EVAL_RESULT___$ = "+aStatement+";"+"return $___EVAL_RESULT___$;};");if($___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$!=undefined){var result=$___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$(aDomhelper,aContext);$___DE_TITUS_CORE_EVAL_RESULT_FUNCTION___$=undefined;return result;}return undefined;}};});de.titus.core.Namespace.create("de.titus.core.DomHelper",function(){de.titus.core.DomHelper=function(){};de.titus.core.DomHelper.prototype.toDomObject=function(aElement){};de.titus.core.DomHelper.prototype.cloneDomObject=function(aElement){};de.titus.core.DomHelper.prototype.getAttribute=function(aDomElementObject,anAttribute){};de.titus.core.DomHelper.prototype.getAttributes=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setAttribute=function(aDomElementObject,anAttribute,value){};de.titus.core.DomHelper.prototype.getChildCount=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getChilds=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getParent=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getHtml=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setHtml=function(aDomElementObject,aHtml,aType){};de.titus.core.DomHelper.prototype.getText=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setText=function(aDomElementObject,aText,aType){};de.titus.core.DomHelper.prototype.doRemove=function(aDomElementObject){};de.titus.core.DomHelper.prototype.doRemoveChilds=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getDomElementById=function(aId){};de.titus.core.DomHelper.prototype.doRemoteLoadHtml=function(theSettings,aCallback){};de.titus.core.DomHelper.prototype.doRemoteLoadJson=function(theSettings,aCallback){};de.titus.core.DomHelper.prototype.mergeObjects=function(aObject1,aObject2){};de.titus.core.DomHelper.prototype.isFunction=function(aVariable){};de.titus.core.DomHelper.prototype.isArray=function(aVariable){};de.titus.core.DomHelper.prototype.doOnReady=function(afunction){};de.titus.core.DomHelper.prototype.doEval=function(aStatement,aDefault){return this.doEvalWithContext(aStatement,{},aDefault);};de.titus.core.DomHelper.prototype.doEvalWithContext=function(aStatement,aContext,aDefault){var result=de.titus.core.SpecialFunctions.doEval(this,aStatement,aContext);if(result==undefined){return aDefault;}return result;};de.titus.core.DomHelper.getInstance=function(){if(de.titus.core.GLOBAL_DOMHELPER_INSTANCE==undefined){de.titus.core.GLOBAL_DOMHELPER_INSTANCE=new de.titus.core.DomHelper();}return de.titus.core.GLOBAL_DOMHELPER_INSTANCE;};});de.titus.core.Namespace.create("de.titus.core.regex.Matcher",function(){de.titus.core.regex.Matcher=function(aRegExp,aText){this.internalRegex=aRegExp;this.processingText=aText;this.currentMatch=undefined;};de.titus.core.regex.Matcher.prototype.isMatching=function(){return this.internalRegex.test(this.processingText);};de.titus.core.regex.Matcher.prototype.next=function(){this.currentMatch=this.internalRegex.exec(this.processingText);if(this.currentMatch!=undefined){this.processingText=this.processingText.replace(this.currentMatch[0],"");return true;}return false;};de.titus.core.regex.Matcher.prototype.getMatch=function(){if(this.currentMatch!=undefined){return this.currentMatch[0];}return undefined;};de.titus.core.regex.Matcher.prototype.getGroup=function(aGroupId){if(this.currentMatch!=undefined){return this.currentMatch[aGroupId];}return undefined;};de.titus.core.regex.Matcher.prototype.replaceAll=function(aReplaceValue,aText){if(this.currentMatch!=undefined){return aText.replace(this.currentMatch[0],aReplaceValue);}return aText;};});de.titus.core.Namespace.create("de.titus.core.regex.Regex",function(){de.titus.core.regex.Regex=function(aRegex,aOptions){this.internalRegex=new RegExp(aRegex,aOptions);};de.titus.core.regex.Regex.prototype.parse=function(aText){return new de.titus.core.regex.Matcher(this.internalRegex,aText);};});
de.titus.core.Namespace.create("de.titus.TemplateEngine",function(){de.titus.TemplateEngine=function(aDomHelper,aTargetElement,theSettings){this.domHelper=aDomHelper||theSettings.domHelper||de.titus.utils.DomHelper.getInstance();this.settings=new de.titus.TemplateEngineSettings(aTargetElement,this.domHelper);this.settings.initialize();if(theSettings!=undefined){this.settings=this.domHelper.mergeObjects(this.settings,theSettings);}this.$target=this.domHelper.toDomObject(aTargetElement);this.$template;this.data;this.options;this.isTemplateInit=false;this.isDataInit=false;this.isOptionInit=false;this.hasError=false;};de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX=/\$\{([^\$\\{\}]*)\}/;de.titus.TemplateEngine.GLOBAL_ISFUNCTION_REGEX=/([^\(\)]*)(\([^\(\)]*\);?)/;de.titus.TemplateEngine.prototype.doTemplating=function(){if(this.settings.onLoad!=undefined){this.domHelper.doEval(this.settings.onLoad,this.settings.options);}var this_=this;window.setTimeout(function(){this_.initTemplate();this_.initData();this_.doRendering();},1);};de.titus.TemplateEngine.prototype.initTemplate=function(){if(this.settings.templateMode=="id"){this.loadTemplateById();}else{if(this.settings.templateMode=="remote"){this.loadTemplateByRemote();}else{if(this.settings.templateMode=="function"){this.loadTemplateByFunction();}}}};de.titus.TemplateEngine.prototype.loadTemplateById=function(){var template=this.domHelper.getDomElementById(this.settings.template);var template=this.domHelper.getText(template);this.$template=this.domHelper.toDomObject(template);this.isTemplateInit=true;};de.titus.TemplateEngine.prototype.loadTemplateByRemote=function(){var this_=this;var ajaxSettings={"url":this.evalText(this.settings.template,this.settings.options),"async":this.settings.templateAsync,"cache":false,"error":function(){this_.hasError=true;}};ajaxSettings=this.domHelper.mergeObjects(ajaxSettings,this.settings.templateRemoteData);this.domHelper.doRemoteLoadHtml(ajaxSettings,function(template){this_.$template=this_.domHelper.toDomObject(template);this_.isTemplateInit=true;});};de.titus.TemplateEngine.prototype.loadTemplateByFunction=function(){if(this.settings.templateAsync){var this_=this;window.setTimeout(function(){var template=eval(this_.settings.template);this_.$template=this_.domHelper.toDomObject(template);this_.isTemplateInit=true;},1);}else{var template=eval(this.settings.template);this.$template=this.domHelper.toDomObject(template);this.isTemplateInit=true;}};de.titus.TemplateEngine.prototype.initData=function(){if(this.settings.dataMode=="direct"){this.loadDataByDirect();}else{if(this.settings.dataMode=="remote"){this.loadDataByRemote();}else{if(this.settings.dataMode=="function"){this.loadDataByFunction();}}}};de.titus.TemplateEngine.prototype.loadDataByDirect=function(){this.data=this.settings.data||{};this.isDataInit=true;};de.titus.TemplateEngine.prototype.loadDataByRemote=function(){var this_=this;var ajaxSettings={"url":this.evalText(this.settings.data,this.settings.options),"async":this.settings.dataAsync,"cache":false,"error":function(){this_.hasError=true;}};ajaxSettings=this.domHelper.mergeObjects(ajaxSettings,this.settings.dataRemoteData);this.domHelper.doRemoteLoadJson(ajaxSettings,function(data){this_.data=data;this_.isDataInit=true;});};de.titus.TemplateEngine.prototype.loadDataByFunction=function(){if(this.settings.dataAsync){var this_=this;window.setTimeout(function(){this_.data=eval(this_.settings.data);this_.isDataInit=true;},1);}else{this.data=eval(this.settings.data);this.isDataInit=true;}};de.titus.TemplateEngine.prototype.doRendering=function(){if(this.hasError){if(this.settings.onError!=undefined){this.domHelper.doEval(this.settings.onError,this.settings.options);}}if(this.isTemplateInit&&this.isDataInit){this.domHelper.doRemoveChilds(this.$target);if(this.domHelper.isArray(this.data)){for(var i=0;i<this.data.length;i++){this.internalRendering(this.data[i],this.options);}}else{this.internalRendering(this.data,this.options);}if(this.settings.onSuccess!=undefined){this.domHelper.doEval(this.settings.onSuccess,this.settings.options);}}else{var this_=this;window.setTimeout(function(){this_.doRendering();},10);}};de.titus.TemplateEngine.prototype.internalRendering=function(theData,theOptions){var content=this.domHelper.cloneDomObject(this.$template);content=this.domHelper.toDomObject(content);this.processing(content,theData,theOptions);this.domHelper.setHtml(this.$target,content,"append");};de.titus.TemplateEngine.prototype.processing=function(aElement,theData,theOptions){if(this.processDirectives(aElement,theData,theOptions)){var childs=this.domHelper.getChilds(aElement);if(childs!=undefined){for(var i=0;i<childs.length;i++){var child=this.domHelper.toDomObject(childs[i]);this.processing(child,theData,theOptions);}}}};de.titus.TemplateEngine.prototype.processDirectives=function(aElement,theData,theOptions){var result=true;result=result&&this.processIfDirective(aElement,theData,theOptions);result=result&&this.processChooseDirective(aElement,theData,theOptions);result=result&&this.processTemplateReference(aElement,theData,theOptions);result=result&&this.processForeachDirective(aElement,theData,theOptions);result=result&&this.processContent(aElement,theData,theOptions);return result;};de.titus.TemplateEngine.prototype.processTemplateReference=function(aElement,theData,theOptions){var definition=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"template")||this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"template-remote")||this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"template-function");if(definition!=undefined&&definition.length!=0){var executeTemplate=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"template-execute")||true;if(executeTemplate!=undefined){executeTemplate=this.evalVariable(executeTemplate,aElement,theData,theOptions,true);}this.domHelper.doRemoveChilds(aElement);this.processAttributes(aElement,theData,theOptions,true);if(executeTemplate==true){var templateEngine=new de.titus.TemplateEngine(this.domHelper,aElement);var data=theData||{};data=this.domHelper.mergeObjects(data,templateEngine.settings);templateEngine.settings=data;templateEngine.doTemplating();}}return true;};de.titus.TemplateEngine.prototype.processChooseDirective=function(aElement,theData,theOptions){var expression=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"choose");if(expression!=undefined){var childs=this.domHelper.getChilds(aElement);var elseElement;var removeOthers=false;for(var i=0;i<childs.length;i++){var child=this.domHelper.toDomObject(childs[i]);if(!removeOthers){var elseExpression=this.domHelper.getAttribute(child,this.settings.attributePrefix+"else");var ifExpression=this.domHelper.getAttribute(child,this.settings.attributePrefix+"if");if(elseElement==undefined&&elseExpression!=undefined){elseElement=child;}else{if(ifExpression!=undefined&&this.processIfDirective(child,theData,theOptions)){this.domHelper.setAttribute(child,this.settings.attributePrefix+"if");removeOthers=true;}else{this.domHelper.doRemove(child);}}}else{this.domHelper.doRemove(child);}}if(removeOthers&&elseElement!=undefined){this.domHelper.doRemove(otherwiseElement);}}return true;};de.titus.TemplateEngine.prototype.processIfDirective=function(aElement,theData,theOptions){var expression=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"if");this.domHelper.setAttribute(aElement,this.settings.attributePrefix+"if");var defaultValue=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"if-default");if(expression!=undefined){var result=this.evalVariable(expression,theData,theOptions,undefined,false);if(result!=true){this.domHelper.doRemove(aElement);return false;}}return true;};de.titus.TemplateEngine.prototype.processForeachDirective=function(aElement,theData,theOptions){var expression=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"foreach");this.domHelper.setAttribute(aElement,this.settings.attributePrefix+"foreach");if(expression!=undefined&&expression.length!=0){var result=this.evalVariable(expression,theData,theOptions);if(this.domHelper.isArray(result)){var varName=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"foreach-var-item")||"item";var statusName=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"foreach-var-status")||"status";var repeatContent=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"foreach-repeat-content")||false;repeatContent=this.domHelper.doEval(repeatContent,false);var baseElement;var templates;if(repeatContent){baseElement=aElement;var childs=this.domHelper.getChilds(aElement);templates=this.convertToTemplate(childs);this.domHelper.doRemove(childs);}else{baseElement=this.domHelper.getParent(aElement);templates=this.convertToTemplate(aElement);}for(var i=0;i<result.length;i++){var status={"index":i,"number":(i+1),"count":result.length,"list":result};var data={};data[varName]=result[i];data[statusName]=status;this.processForeachTemplates(baseElement,templates,data,theOptions);}}else{this.domHelper.doRemove(aElement);}return false;}else{return true;}};de.titus.TemplateEngine.prototype.convertToTemplate=function(aElement){var templates=new Array();if(this.domHelper.isArray(aElement)){for(var i=0;i<aElement.length;i++){templates.push(this.domHelper.toDomObject(aElement[i]));}}else{templates.push(this.domHelper.toDomObject(aElement));}return templates;};de.titus.TemplateEngine.prototype.processForeachTemplates=function(aElement,theTemplates,theData,theOptions){for(var i=0;i<theTemplates.length;i++){var content=this.domHelper.cloneDomObject(theTemplates[i]);content=this.domHelper.toDomObject(content);this.domHelper.setHtml(aElement,content,"append");this.processing(content,theData,theOptions);}};de.titus.TemplateEngine.prototype.processContent=function(aElement,theData,theOptions){var dataFormatter=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"formatter");var undefinedValue=this.domHelper.getAttribute(aElement,this.settings.attributePrefix+"undefined-value");if(this.domHelper.getChildCount(aElement)==0){var content=this.domHelper.getText(aElement);content=this.evalText(content,theData,theOptions,dataFormatter,undefinedValue);this.domHelper.setHtml(aElement,content);this.processAttributes(aElement,theData,theOptions);return false;}this.processAttributes(aElement,theData,theOptions,dataFormatter,undefinedValue);return true;};de.titus.TemplateEngine.prototype.processAttributes=function(aElement,theData,theOptions,all,theDataformatter,theUndefinedValue){var attributes=this.domHelper.getAttributes(aElement);var processAll=all||false;for(var name in attributes){if(processAll||this.settings.attributePrefix==undefined||this.settings.attributePrefix.lenght==0||name.indexOf(this.settings.attributePrefix)!=0){var value=attributes[name];value=this.evalText(value,theData,theOptions,theDataformatter,theUndefinedValue);this.domHelper.setAttribute(aElement,name,value);}}};de.titus.TemplateEngine.prototype.evalText=function(aText,theData,theOptions,theDataformatter,theUndefinedValue){var content=aText;var runValue=aText;while(de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.test(runValue)){var match=de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.exec(runValue);var result=this.evalVariable(match[0],theData,theOptions,theDataformatter,theUndefinedValue);if(result!=undefined){content=content.replace(match[0],result);}runValue=runValue.replace(match[0],"");}return content;};de.titus.TemplateEngine.prototype.evalVariable=function(aVariable,theData,theOptions,aDefaultValue,theDataformatter,theUndefinedValue){var dataFormatter=theDataformatter;var undefinedValue=theUndefinedValue;var variable=aVariable;var data=theData||{};var match=de.titus.TemplateEngine.GLOBAL_VARIABLEN_REGEX.exec(aVariable);if(match!=undefined){variable=match[1];}if(de.titus.TemplateEngine.GLOBAL_ISFUNCTION_REGEX.test(aVariable)){var functionMatch=de.titus.TemplateEngine.GLOBAL_ISFUNCTION_REGEX.exec(variable);variable=functionMatch[1];}var result=this.domHelper.doEvalWithContext(variable,data);if(this.domHelper.isFunction(result)){result=result(data);}if(dataFormatter!=undefined){var formatFunction=this.domHelper.doEvalWithContext(variable,data);if(formatFunction!=undefined&&this.domHelper.isFunction(formatFunction)){result=formatFunction(result);}}if(result==undefined&&undefinedValue==undefined){return aDefaultValue;}else{if(result==undefined&&undefinedValue!=undefined){return undefinedValue;}else{return result;}}};});de.titus.core.Namespace.create("de.titus.TemplateEngineSettings",function(){de.titus.TemplateEngineSettings=function(aTargetElement,aDomHelper){this.domHelper=aDomHelper||de.titus.utils.DomHelper.getInstance();this.target=this.domHelper.toDomObject(aTargetElement);this.template;this.templateMode="id";this.templateAsync=true;this.templateRemoteData={};this.data;this.dataMode="direct";this.dataAsync=true;this.dataRemoteData={};this.options={};this.onLoad=undefined;this.onSuccess=undefined;this.onError=undefined;this.attributePrefix="tpl-";};de.titus.TemplateEngineSettings.prototype.initialize=function(){this.templateRemoteData=this.domHelper.doEval(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-remote-data"),{})||{};this.dataRemoteData=this.domHelper.doEval(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data-remote-data"),{})||{};this.options=this.domHelper.doEval(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-options"),{})||{};this.initTemplateSettings();this.initDataSettings();this.onLoad=this.domHelper.getAttribute(this.target,this.attributePrefix+"on-load");this.onSuccess=this.domHelper.getAttribute(this.target,this.attributePrefix+"on-success");this.onError=this.domHelper.getAttribute(this.target,this.attributePrefix+"on-error");};de.titus.TemplateEngineSettings.prototype.initTemplateSettings=function(){if(this.template!=undefined){return;}else{if(this.domHelper.getAttribute(this.target,this.attributePrefix+"template")!=undefined){this.template=this.domHelper.doEval(this.domHelper.getAttribute(this.target,this.attributePrefix+"template"));this.templateMode="id";}else{if(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-remote")!=undefined){this.template=this.domHelper.getAttribute(this.target,this.attributePrefix+"template-remote");this.templateMode="remote";}else{if(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-function")!=undefined){this.template=this.domHelper.getAttribute(this.target,this.attributePrefix+"template-function");this.templateMode="function";}}}}};de.titus.TemplateEngineSettings.prototype.initDataSettings=function(){if(this.data!=undefined){return;}else{if(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data")!=undefined){this.data=this.domHelper.doEval(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data"));this.dataMode="direct";}else{if(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data-remote")!=undefined){this.data=this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data-remote");this.dataMode="remote";}else{if(this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data-function")!=undefined){this.data=this.domHelper.getAttribute(this.target,this.attributePrefix+"template-data-function");this.dataMode="function";}}}}};});
de.titus.core.Namespace.create("de.titus.jquery.TemplateEnginePlugin",function(){(function($){$.fn.doTemplating=function(theSettings){var templateEngine=new de.titus.TemplateEngine(de.titus.jquery.DomHelper.getInstance(),this,theSettings);templateEngine.doTemplating();};}(jQuery));});de.titus.core.Namespace.create("de.titus.jquery.DomHelper",function(){de.titus.jquery.DomHelper=function(){};de.titus.jquery.DomHelper.prototype=new de.titus.core.DomHelper();de.titus.jquery.DomHelper.prototype.constructor=de.titus.jquery.DomHelper;de.titus.jquery.DomHelper.prototype.toDomObject=function(aElement){return $(aElement);};de.titus.jquery.DomHelper.prototype.cloneDomObject=function(aElement){return aElement.clone();};de.titus.jquery.DomHelper.prototype.getAttribute=function(aDomElementObject,anAttribute){return aDomElementObject.attr(anAttribute);};de.titus.core.DomHelper.prototype.getAttributes=function(aDomElementObject){var attributes={};$.each(aDomElementObject.get(0).attributes,function(i,attrib){attributes[attrib.name]=attrib.value;});return attributes;};de.titus.jquery.DomHelper.prototype.setAttribute=function(aDomElementObject,anAttribute,aValue){if(aValue==undefined){aDomElementObject.removeAttr(anAttribute);}else{aDomElementObject.attr(anAttribute,aValue);}};de.titus.core.DomHelper.prototype.getWith=function(aDomElementObject){return aDomElementObject.width();};de.titus.core.DomHelper.prototype.setWith=function(aDomElementObject,aWidth){aDomElementObject.width(aWidth);};de.titus.core.DomHelper.prototype.getContentWith=function(aDomElementObject){return aDomElementObject.innerWidth();};de.titus.core.DomHelper.prototype.setContentWith=function(aDomElementObject,aWidth){aDomElementObject.innerWidth(aWidth);};de.titus.core.DomHelper.prototype.getHeight=function(aDomElementObject){return aDomElementObject.height();};de.titus.core.DomHelper.prototype.setHeight=function(aDomElementObject,aHeight){aDomElementObject.height(aHeight);};de.titus.core.DomHelper.prototype.getContentHeight=function(aDomElementObject){return aDomElementObject.innerHeight();};de.titus.core.DomHelper.prototype.setContentHeight=function(aDomElementObject,aHeight){aDomElementObject.innerHeight(aHeight);};de.titus.jquery.DomHelper.prototype.getChilds=function(aDomElementObject){return aDomElementObject.children()||new Array();};de.titus.core.DomHelper.prototype.getChildCount=function(aDomElementObject){return this.getChilds(aDomElementObject).length;};de.titus.jquery.DomHelper.prototype.getParent=function(aDomElementObject){return aDomElementObject.parent();};de.titus.jquery.DomHelper.prototype.getHtml=function(aDomElementObject){return aDomElementObject.html();};de.titus.jquery.DomHelper.prototype.setHtml=function(aDomElementObject,aHtml,aType){if(aType==undefined){aDomElementObject.html(aHtml);}else{if(aType=="append"){aDomElementObject.append(aHtml);}else{if(aType=="prepend"){aDomElementObject.prepend(aHtml);}else{if(aType=="replace"){aDomElementObject.html(aHtml);}else{throw'The type "'+aType+'" is not supported!';}}}}};de.titus.jquery.DomHelper.prototype.getText=function(aDomElementObject){return aDomElementObject.text();};de.titus.jquery.DomHelper.prototype.setText=function(aDomElementObject,aText,aType){if(aType==undefined){aDomElementObject.text(aText);}else{if(aType=="append"){var currentText=aDomElementObject.text();aDomElementObject.append(aText+currentText);}else{if(aType=="prepend"){var currentText=aDomElementObject.text();aDomElementObject.append(currentText+aText);}else{if(aType=="replace"){aDomElementObject.text(aText);}else{throw'The type "'+aType+'" is not supported!';}}}}};de.titus.jquery.DomHelper.prototype.doRemove=function(aDomElementObject){if($.isArray(aDomElementObject)){for(var i=0;i<aDomElementObject.length;i++){aDomElementObject[i].remove();}}else{aDomElementObject.remove();}};de.titus.jquery.DomHelper.prototype.doRemoveChilds=function(aDomElementObject){aDomElementObject.empty();};de.titus.jquery.DomHelper.prototype.getDomElementById=function(aId){};de.titus.jquery.DomHelper.prototype.doRemoteLoadHtml=function(theSettings,aCallback){var settings={dataType:"html",success:aCallback};settings=$().extend(theSettings,settings);$.ajax(settings);};de.titus.jquery.DomHelper.prototype.doRemoteLoadJson=function(theSettings,aCallback){var settings={dataType:"json",success:aCallback};settings=$().extend(theSettings,settings);$.ajax(settings);};de.titus.jquery.DomHelper.prototype.mergeObjects=function(aObject1,aObject2){return $().extend(aObject1,aObject2);};de.titus.jquery.DomHelper.prototype.isFunction=function(aVariable){return $.isFunction(aVariable);};de.titus.core.DomHelper.prototype.isArray=function(aVariable){return $.isArray(aVariable)||aVariable.length!=undefined;};de.titus.core.DomHelper.prototype.doOnReady=function(aFunction){$(document).ready(aFunction);};de.titus.jquery.DomHelper.getInstance=function(){return new de.titus.jquery.DomHelper();};});
