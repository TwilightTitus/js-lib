var de=de||{};de.titus=de.titus||{};de.titus.core=de.titus.core||{};if(de.titus.core.Namespace==undefined){de.titus.core.Namespace={};de.titus.core.Namespace.create=function(aNamespace,aFunction){var namespaces=aNamespace.split(".");var currentNamespace=window;var namespaceCreated=false;for(var i=0;i<namespaces.length;i++){if(currentNamespace[namespaces[i]]==undefined){currentNamespace[namespaces[i]]={};namespaceCreated=true;}currentNamespace=currentNamespace[namespaces[i]];}if(namespaceCreated&&aFunction!=undefined){aFunction();}return namespaceCreated;};de.titus.core.Namespace.exist=function(aNamespace){var namespaces=aNamespace.split(".");var currentNamespace=window;for(var i=0;i<namespaces.length;i++){if(currentNamespace[namespaces[i]]==undefined){return false;}currentNamespace=currentNamespace[namespaces[i]];}return true;};}de.titus.core.Namespace.create("de.titus.core.SpecialFunctions",function(){de.titus.core.SpecialFunctions={};de.titus.core.SpecialFunctions.EVALRESULTVARNAME={};de.titus.core.SpecialFunctions.EVALRESULTS={};de.titus.core.SpecialFunctions.doEval=function(aStatement,aContext,aCallback){if(aCallback){de.titus.core.SpecialFunctions.doEvalWithContext(aStatement,(aContext||{}),undefined,aCallback);}else{if(aStatement!=undefined&&typeof aStatement!=="string"){return aStatement;}else{if(aStatement!=undefined){var varname=de.titus.core.SpecialFunctions.newVarname();var runContext=aContext||{};with(runContext){eval("de.titus.core.SpecialFunctions.EVALRESULTS."+varname+" = "+aStatement+";");}var result=de.titus.core.SpecialFunctions.EVALRESULTS[varname];de.titus.core.SpecialFunctions.EVALRESULTS[varname]=undefined;de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname]=undefined;return result;}}return undefined;}};de.titus.core.SpecialFunctions.newVarname=function(){var varname="var"+(new Date().getTime());if(de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname]==undefined){de.titus.core.SpecialFunctions.EVALRESULTVARNAME[varname]="";return varname;}else{return de.titus.core.SpecialFunctions.newVarname();}};de.titus.core.SpecialFunctions.doEvalWithContext=function(aStatement,aContext,aDefault,aCallback){if(aCallback!=undefined&&typeof aCallback==="function"){window.setTimeout(function(){var result=de.titus.core.SpecialFunctions.doEvalWithContext(aStatement,aContext,aDefault,undefined);aCallback(result,aContext,this);},10);}else{var result=de.titus.core.SpecialFunctions.doEval(aStatement,aContext);if(result==undefined){return aDefault;}return result;}};});de.titus.core.Namespace.create("de.titus.core.DomHelper",function(){de.titus.core.DomHelper=function(){};de.titus.core.DomHelper.prototype.toDomObject=function(aElement){};de.titus.core.DomHelper.prototype.cloneDomObject=function(aElement){};de.titus.core.DomHelper.prototype.getAttribute=function(aDomElementObject,anAttribute){};de.titus.core.DomHelper.prototype.getAttributes=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setAttribute=function(aDomElementObject,anAttribute,value){};de.titus.core.DomHelper.prototype.getProperty=function(aDomElementObject,anAttribute){};de.titus.core.DomHelper.prototype.setProperty=function(aDomElementObject,anAttribute,aValue){};de.titus.core.DomHelper.prototype.getChildCount=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getChilds=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getParent=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getHtml=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setHtml=function(aDomElementObject,aHtml,aType){};de.titus.core.DomHelper.prototype.getText=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setText=function(aDomElementObject,aText,aType){};de.titus.core.DomHelper.prototype.doRemove=function(aDomElementObject){};de.titus.core.DomHelper.prototype.doRemoveChilds=function(aDomElementObject){};de.titus.core.DomHelper.prototype.getDomElementById=function(aId){};de.titus.core.DomHelper.prototype.doRemoteLoadHtml=function(theSettings,aCallback){};de.titus.core.DomHelper.prototype.doRemoteLoadJson=function(theSettings,aCallback){};de.titus.core.DomHelper.prototype.mergeObjects=function(aObject1,aObject2){};de.titus.core.DomHelper.prototype.extendObjects=function(aObject1,aObject2){};de.titus.core.DomHelper.prototype.isFunction=function(aVariable){};de.titus.core.DomHelper.prototype.isArray=function(aVariable){};de.titus.core.DomHelper.prototype.doOnReady=function(afunction){};de.titus.core.DomHelper.prototype.setBindData=function(aDomElementObject,aKey,aData){};de.titus.core.DomHelper.prototype.getBindData=function(aDomElementObject,aKey){};de.titus.core.DomHelper.prototype.doShow=function(aDomElementObject,aValue){};de.titus.core.DomHelper.prototype.getValue=function(aDomElementObject){};de.titus.core.DomHelper.prototype.setValue=function(aDomElementObject,aValue){};de.titus.core.DomHelper.prototype.addEvent=function(aDomElementObject,aEvent,aCallback){};de.titus.core.DomHelper.prototype.doEval=function(aStatement,aDefault,aCallback){return this.doEvalWithContext(aStatement,{},aDefault,aCallback);};de.titus.core.DomHelper.prototype.doEvalWithContext=function(aStatement,aContext,aDefault,aCallback){if(aCallback!=undefined&&this.isFunction(aCallback)){var $__THIS__$=this;window.setTimeout(function(){var result=$__THIS__$.doEvalWithContext(aStatement,aContext,aDefault,undefined);aCallback(result,aContext,this);},10);}else{var result=de.titus.core.SpecialFunctions.doEval(this,aStatement,aContext);if(result==undefined){return aDefault;}return result;}};de.titus.core.DomHelper.getInstance=function(){if(de.titus.core.GLOBAL_DOMHELPER_INSTANCE==undefined){de.titus.core.GLOBAL_DOMHELPER_INSTANCE=new de.titus.core.DomHelper();}return de.titus.core.GLOBAL_DOMHELPER_INSTANCE;};});(function($){$.fn.tagName=$.fn.tagName||function(){if(this.length==undefined||this.length==0){return undefined;}else{if(this.length>1){return this.each(function(){return $(this).tagName();});}else{var tagname=this.prop("tagName");if(tagname!=undefined&&tagname!=""){return tagname.toLowerCase();}return undefined;}}};})(jQuery);(function($){if($.fn.Selector==undefined){$.fn.Selector=function(){var pathes=[];this.each(function(){var element=fiduciagad.$(this);if(element[0].id!=undefined&&element[0].id!=""){pathes.push("#"+element[0].id);}else{var path;while(element.length){var realNode=element.get(0),name=realNode.localName;if(!name){break;}name=name.toLowerCase();var parent=element.parent();var sameTagSiblings=parent.children(name);if(sameTagSiblings.length>1){allSiblings=parent.children();var index=allSiblings.index(realNode)+1;if(index>0){name+=":nth-child("+index+")";}}path=name+(path?" > "+path:"");element=parent;}pathes.push(path);}});return pathes.join(",");};}})($);de.titus.core.Namespace.create("de.titus.core.regex.Matcher",function(){de.titus.core.regex.Matcher=function(aRegExp,aText){this.internalRegex=aRegExp;this.processingText=aText;this.currentMatch=undefined;};de.titus.core.regex.Matcher.prototype.isMatching=function(){return this.internalRegex.test(this.processingText);};de.titus.core.regex.Matcher.prototype.next=function(){this.currentMatch=this.internalRegex.exec(this.processingText);if(this.currentMatch!=undefined){this.processingText=this.processingText.replace(this.currentMatch[0],"");return true;}return false;};de.titus.core.regex.Matcher.prototype.getMatch=function(){if(this.currentMatch!=undefined){return this.currentMatch[0];}return undefined;};de.titus.core.regex.Matcher.prototype.getGroup=function(aGroupId){if(this.currentMatch!=undefined){return this.currentMatch[aGroupId];}return undefined;};de.titus.core.regex.Matcher.prototype.replaceAll=function(aReplaceValue,aText){if(this.currentMatch!=undefined){return aText.replace(this.currentMatch[0],aReplaceValue);}return aText;};});de.titus.core.Namespace.create("de.titus.core.regex.Regex",function(){de.titus.core.regex.Regex=function(aRegex,aOptions){this.internalRegex=new RegExp(aRegex,aOptions);};de.titus.core.regex.Regex.prototype.parse=function(aText){return new de.titus.core.regex.Matcher(this.internalRegex,aText);};});de.titus.core.Namespace.create("de.titus.core.ExpressionResolver",function(){de.titus.core.ExpressionResolver=function(varRegex){this.regex=new de.titus.core.regex.Regex(varRegex||de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX);};de.titus.core.ExpressionResolver.TEXT_EXPRESSION_REGEX="\\$\\{([^\\$\\{\\}]*)\\}";de.titus.core.ExpressionResolver.prototype.resolveText=function(aText,aDataContext,aDefaultValue){var text=aText;var matcher=this.regex.parse(text);while(matcher.next()){var expression=matcher.getMatch();var expressionResult=this.internalResolveExpression(matcher.getGroup(1),aDataContext,aDefaultValue);if(expressionResult!=undefined){text=matcher.replaceAll(expressionResult,text);}}return text;};de.titus.core.ExpressionResolver.prototype.resolveExpression=function(aExpression,aDataContext,aDefaultValue){var matcher=this.regex.parse(aExpression);if(matcher.next()){return this.internalResolveExpression(matcher.getGroup(1),aDataContext,aDefaultValue);}return this.internalResolveExpression(aExpression,aDataContext,aDefaultValue);};de.titus.core.ExpressionResolver.prototype.internalResolveExpression=function(aExpression,aDataContext,aDefaultValue){try{var result=de.titus.core.SpecialFunctions.doEvalWithContext(aExpression,aDataContext,aDefaultValue);if(result==undefined){return aDefaultValue;}return result;}catch(e){return undefined;}};});de.titus.core.Namespace.create("de.titus.jquery.DomHelper",function(){de.titus.jquery.DomHelper=function(){};de.titus.jquery.DomHelper.prototype=new de.titus.core.DomHelper();de.titus.jquery.DomHelper.prototype.constructor=de.titus.jquery.DomHelper;de.titus.jquery.DomHelper.prototype.toDomObject=function(aElement){return $(aElement);};de.titus.jquery.DomHelper.prototype.cloneDomObject=function(aElement){return aElement.clone();};de.titus.jquery.DomHelper.prototype.getAttribute=function(aDomElementObject,anAttribute){return aDomElementObject.attr(anAttribute);};de.titus.jquery.DomHelper.prototype.getAttributes=function(aDomElementObject){var attributes={};$.each(aDomElementObject.get(0).attributes,function(i,attrib){attributes[attrib.name]=attrib.value;});return attributes;};de.titus.jquery.DomHelper.prototype.setAttribute=function(aDomElementObject,anAttribute,aValue){if(aValue==undefined){aDomElementObject.removeAttr(anAttribute);}else{aDomElementObject.attr(anAttribute,aValue);}};de.titus.jquery.DomHelper.prototype.getProperty=function(aDomElementObject,anAttribute){return aDomElementObject.prop(anAttribute);};de.titus.jquery.DomHelper.prototype.setProperty=function(aDomElementObject,anAttribute,aValue){aDomElementObject.prop(anAttribute,aValue);};de.titus.jquery.DomHelper.prototype.getWith=function(aDomElementObject){return aDomElementObject.width();};de.titus.jquery.DomHelper.prototype.setWith=function(aDomElementObject,aWidth){aDomElementObject.width(aWidth);};de.titus.jquery.DomHelper.prototype.getContentWith=function(aDomElementObject){return aDomElementObject.innerWidth();};de.titus.jquery.DomHelper.prototype.setContentWith=function(aDomElementObject,aWidth){aDomElementObject.innerWidth(aWidth);};de.titus.jquery.DomHelper.prototype.getHeight=function(aDomElementObject){return aDomElementObject.height();};de.titus.jquery.DomHelper.prototype.setHeight=function(aDomElementObject,aHeight){aDomElementObject.height(aHeight);};de.titus.jquery.DomHelper.prototype.getContentHeight=function(aDomElementObject){return aDomElementObject.innerHeight();};de.titus.jquery.DomHelper.prototype.setContentHeight=function(aDomElementObject,aHeight){aDomElementObject.innerHeight(aHeight);};de.titus.jquery.DomHelper.prototype.getChilds=function(aDomElementObject){return aDomElementObject.children()||new Array();};de.titus.jquery.DomHelper.prototype.getChildCount=function(aDomElementObject){return this.getChilds(aDomElementObject).length;};de.titus.jquery.DomHelper.prototype.getParent=function(aDomElementObject){return aDomElementObject.parent();};de.titus.jquery.DomHelper.prototype.getHtml=function(aDomElementObject){return aDomElementObject.html();};de.titus.jquery.DomHelper.prototype.setHtml=function(aDomElementObject,aHtml,aType){if(aType==undefined){aDomElementObject.html(aHtml);}else{if(aType=="append"){aDomElementObject.append(aHtml);}else{if(aType=="prepend"){aDomElementObject.prepend(aHtml);}else{if(aType=="replace"){aDomElementObject.html(aHtml);}else{throw'The type "'+aType+'" is not supported!';}}}}};de.titus.jquery.DomHelper.prototype.getText=function(aDomElementObject){return aDomElementObject.text();};de.titus.jquery.DomHelper.prototype.setText=function(aDomElementObject,aText,aType){if(aType==undefined){aDomElementObject.text(aText);}else{if(aType=="append"){var currentText=aDomElementObject.text();aDomElementObject.append(aText+currentText);}else{if(aType=="prepend"){var currentText=aDomElementObject.text();aDomElementObject.append(currentText+aText);}else{if(aType=="replace"){aDomElementObject.text(aText);}else{throw'The type "'+aType+'" is not supported!';}}}}};de.titus.jquery.DomHelper.prototype.doRemove=function(aDomElementObject){if($.isArray(aDomElementObject)){for(var i=0;i<aDomElementObject.length;i++){aDomElementObject[i].remove();}}else{aDomElementObject.remove();}};de.titus.jquery.DomHelper.prototype.doRemoveChilds=function(aDomElementObject){aDomElementObject.empty();};de.titus.jquery.DomHelper.prototype.getDomElementById=function(aId){};de.titus.jquery.DomHelper.prototype.doRemoteLoadHtml=function(theSettings,aCallback){var settings={dataType:"html",success:aCallback};settings=$().extend(theSettings,settings);$.ajax(settings);};de.titus.jquery.DomHelper.prototype.doRemoteLoadJson=function(theSettings,aCallback){var settings={dataType:"json",success:aCallback};settings=$().extend(theSettings,settings);$.ajax(settings);};de.titus.jquery.DomHelper.prototype.mergeObjects=function(aObject1,aObject2){return $().extend(aObject1,aObject2);};de.titus.jquery.DomHelper.prototype.isFunction=function(aVariable){return $.isFunction(aVariable);};de.titus.jquery.DomHelper.prototype.setBindData=function(aDomElementObject,aKey,aData){aDomElementObject.data(aKey,aData);};de.titus.jquery.DomHelper.prototype.getBindData=function(aDomElementObject,aKey){return aDomElementObject.data(aKey);};de.titus.jquery.DomHelper.prototype.doShow=function(aDomElementObject,aValue){if(aValue){aDomElementObject.show();}else{aDomElementObject.hide();}};de.titus.jquery.DomHelper.prototype.getValue=function(aDomElementObject){return aDomElementObject.val();};de.titus.jquery.DomHelper.prototype.setValue=function(aDomElementObject,aValue){aDomElementObject.val(aValue);};de.titus.jquery.DomHelper.prototype.addEvent=function(aDomElementObject,aEvent,aCallback){aDomElementObject.bind(aEvent,aCallback);};de.titus.jquery.DomHelper.prototype.isArray=function(aVariable){return $.isArray(aVariable)||aVariable.length!=undefined;};de.titus.jquery.DomHelper.prototype.doOnReady=function(aFunction){$(document).ready(aFunction);};de.titus.jquery.DomHelper.getInstance=function(){return new de.titus.jquery.DomHelper();};if($!=undefined){de.titus.core.DomHelper.getInstance=function(){return new de.titus.jquery.DomHelper();};}});(function($){de.titus.core.Namespace.create("de.titus.core.URL",function(){de.titus.core.URL=function(aProtocol,aDomain,aPort,aPath,theParameter,aMarker){var protocol=aProtocol;var domain=aDomain;var port=aPort;var path=aPath;var parameters=theParameter;var marker=aMarker;this.getMarker=function(){return marker;};this.setMarker=function(aMarker){marker=aMarker;};this.getProtocol=function(){if(protocol==undefined){protocol="http";}return protocol;};this.setProtocol=function(aProtocol){protokoll=aProtocol;};this.getDomain=function(){return domain;};this.setDomain=function(aDomain){domain=aDomain;};this.getPath=function(){return path;};this.setPath=function(aPath){path=aPath;};this.getPort=function(){if(port==undefined){port=80;
}return port;};this.setPort=function(aPort){port=aPort;};this.getParameters=function(){return parameters;};this.setParameters=function(theParameter){parameters=theParameter;};};de.titus.core.URL.prototype.getParameter=function(aKey){var value=this.getParameters()[aKey];if(value==undefined){return undefined;}if(value.length>1){return value;}else{return value[0];}};de.titus.core.URL.prototype.getParameters=function(aKey){return this.getParameters()[aKey];};de.titus.core.URL.prototype.addParameter=function(aKey,aValue,append){if(this.getParameters()[aKey]==undefined){this.getParameters()[aKey]=[];}if(!append&&aValue==undefined){this.getParameters()[aKey]=undefined;}else{if(!append&&aValue!=undefined&&aValue.length!=undefined){this.getParameters()[aKey]=aValue;}else{if(append&&aValue!=undefined&&aValue.length!=undefined){$.merge(this.getParameters()[aKey],aValue);}else{if(!append&&aValue!=undefined){this.getParameters()[aKey]=[aValue];}else{if(append&&aValue!=undefined){this.getParameters()[aKey].push(aValue);}}}}}};de.titus.core.URL.prototype.getQueryString=function(){if(this.getParameters()!=undefined){var parameters=this.getParameters();var result="?";var isFirstParameter=true;for(var propertyName in parameters){if(!isFirstParameter){result=result+"&";}else{isFirstParameter=false;}var parameterValues=parameters[propertyName];if(parameterValues.length==undefined){result=result+encodeURIComponent(propertyName)+"="+encodeURIComponent(parameterValues);}else{for(j=0;j<parameterValues.length;j++){if(j>0){result=result+"&";}result=result+encodeURIComponent(propertyName)+"="+encodeURIComponent(parameterValues[j]);}}}return result;}else{return"";}};de.titus.core.URL.prototype.asString=function(){var result=this.getProtocol()+"://"+this.getDomain()+":"+this.getPort();if(this.getPath()!=undefined){result=result+this.getPath();}if(this.getMarker()!=undefined){result=result+"#"+this.getMarker();}result=result+this.getQueryString();return result;};de.titus.core.URL.prototype.toString=function(){return this.asString();};de.titus.core.URL.fromString=function(aUrlString){var tempUrl=aUrlString;var protocol="http";var host;var port=80;var path="/";var marker="";var parameterString;var splitIndex=-1;var parameter={};var regex=new RegExp("\\?([^#]*)");var match=regex.exec(tempUrl);if(match!=undefined){parameterString=match[1];}var regex=new RegExp("#([^\\?#]*)");var match=regex.exec(tempUrl);if(match!=undefined){marker=decodeURIComponent(match[1]);}splitIndex=tempUrl.indexOf("://");if(splitIndex>0){protocol=tempUrl.substr(0,splitIndex);tempUrl=tempUrl.substr(splitIndex+3);}var regex=new RegExp("([^/:\\?#]*)");var match=regex.exec(tempUrl);if(match!=undefined){host=match[1];}var regex=new RegExp(":([^\\/\\?#]*)");var match=regex.exec(tempUrl);if(match!=undefined){port=match[1];}else{if(protocol.toLowerCase()=="https"){port=443;}else{if(protocol.toLowerCase()=="ftp"){port=21;}else{if(protocol.toLowerCase()=="ftps"){port=21;}}}}var regex=new RegExp("(/[^\\?#]*)");var match=regex.exec(tempUrl);if(match!=undefined){path=match[1];}var regex=new RegExp("([^&\\?#=]*)=([^&\\?#=]*)");if(parameterString!=undefined&&""!=parameterString){var parameterEntries=parameterString.split("&");for(i=0;i<parameterEntries.length;i++){var match=regex.exec(parameterEntries[i]);var pName=decodeURIComponent(match[1]);var pValue=decodeURIComponent(match[2]);parameter[pName]?parameter[pName].push(pValue):parameter[pName]=[pValue];}}return new de.titus.core.URL(protocol,host,port,path,parameter,marker);};de.titus.core.URL.getCurrentUrl=function(){if(de.titus.core.URL.STATIC__CURRENTURL==undefined){de.titus.core.URL.STATIC__CURRENTURL=de.titus.core.URL.fromString(location.href);}return de.titus.core.URL.STATIC__CURRENTURL;};});})($);(function($){de.titus.core.Namespace.create("de.titus.core.Page",function(){de.titus.core.Page=function(){this.baseTagValue=undefined;this.hasBaseTag=false;var baseTag=$("base");if(baseTag!=undefined){this.baseTagValue=baseTag.attr("href");this.hasBaseTag=true;}this.files={};this.data={};};de.titus.core.Page.CSSTEMPLATE='<link rel="stylesheet" type="text/css"/>';de.titus.core.Page.JSTEMPLATE='<script type="text/javascript"><\/script>';de.titus.core.Page.prototype.addJsFile=function(aUrl,aFunction,forceFunction){if($.isArray(aUrl)){return this.addJsFiles(aUrl,aFunction,forceFunction);}if(this.files[aUrl]==undefined){this.files[aUrl]=true;var jsScript=$(de.titus.core.Page.JSTEMPLATE).clone();jsScript.attr("src",aUrl);$("head").append(jsScript);if(aFunction!=undefined){aFunction();}}else{if(forceFunction&&aFunction!=undefined){aFunction();}}};de.titus.core.Page.prototype.addJsFiles=function(aUrls,aFunction,forceFunction){if($.isArray(aUrls)){var url=aUrls.shift();if(aUrls.length!=0){var $__THIS__$=this;this.addJsFile(url,function(){$__THIS__$.addJsFiles(aUrls,aFunction,forceFunction);},true);}else{this.addJsFile(url,aFunction,forceFunction);}}else{this.addJsFile(aUrls,aFunction,forceFunction);}};de.titus.core.Page.prototype.addCssFile=function(aUrl){if($.isArray(aUrl)){this.addCssFiles(aUrl);return;}if(this.files[aUrl]==undefined){this.files[aUrl]=true;var cssScript=$(de.titus.core.Page.CSSTEMPLATE).clone();cssScript.attr("href",aUrl);$("head").append(cssScript);}};de.titus.core.Page.prototype.addCssFiles=function(aUrls){if($.isArray(aUrls)){for(i=0;i<aUrls.length;i++){this.addCssFile(aUrls[i]);}}};de.titus.core.Page.prototype.getUrl=function(){return de.titus.core.URL.getCurrentUrl();};de.titus.core.Page.prototype.buildUrl=function(aUrl){if(this.detectBrowser().microsoft){var tempUrl=aUrl.toLowerCase().trim();if(this.hasBaseTag&&!tempUrl.indexOf("http:")==0&&!tempUrl.indexOf("https:")==0&&!tempUrl.indexOf("ftp:")==0&&!tempUrl.indexOf("ftps:")==0&&!tempUrl.indexOf("mailto:")==0&&!tempUrl.indexOf("notes:")==0&&!tempUrl.indexOf("/")==0){return this.baseTagValue+aUrl;}}return aUrl;};de.titus.core.Page.prototype.detectBrowser=function(){var result={"microsoft":false,"other":false};var ua=window.navigator.userAgent;var msie=ua.indexOf("MSIE ");if(msie>0){result.microsoft=true;return result;}var trident=ua.indexOf("Trident/");if(trident>0){result.microsoft=true;return result;}var edge=ua.indexOf("Edge/");if(edge>0){result.microsoft=true;return result;}result.other=true;return result;};de.titus.core.Page.prototype.setData=function(aKey,aValue){this.data[aKey]=aValue;};de.titus.core.Page.prototype.getData=function(aKey){return this.data[aKey];};de.titus.core.Page.getInstance=function(){if(de.titus.core.Page.INSTANCE==undefined){de.titus.core.Page.INSTANCE=new de.titus.core.Page();}return de.titus.core.Page.INSTANCE;};if($.fn.de_titus_core_Page==undefined){$.fn.de_titus_core_Page=de.titus.core.Page.getInstance;}});})($);de.titus.core.Namespace.create("de.titus.core.UUID",function(){de.titus.core.UUID=function(customSpacer){var spacer=customSpacer||"-";var template="xxxxxxxx"+spacer+"xxxx"+spacer+"4xxx"+spacer+"yxxx"+spacer+"xxxxxxxxxxxx";return template.replace(/[xy]/g,function(c){var r=Math.random()*16|0;var v=c=="x"?r:(r&3|8);return v.toString(16);});};});(function($){de.titus.core.Namespace.create("de.titus.core.StringUtils",function(){de.titus.core.StringUtils={};de.titus.core.StringUtils.DEFAULTS={};de.titus.core.StringUtils.DEFAULTS.formatToHtml={"tabsize":4,"tabchar":"&nbsp;","newlineTag":"<br/>"};de.titus.core.StringUtils.DEFAULTS.trimTextLength={"postfix":"..."};de.titus.core.StringUtils.trimTextLength=function(aText,maxLength,theSettings){if(aText==undefined||aText!=="string"||aText==""){return aText;}var settings=$.extend({},theSettings,de.titus.core.StringUtils.DEFAULTS.trimTextLength);if(aText.length>maxLength){var end=maxLength-settings.postfix.length;if((aText.length-end)>0){return aText.substring(0,end)+settings.postfix;}}return aText;};de.titus.core.StringUtils.formatToHtml=function(aText,theSettings){if(aText==undefined||typeof aText!=="string"||aText==""){return aText;}var settings=$.extend({},theSettings,de.titus.core.StringUtils.DEFAULTS.formatToHtml);var text=aText.replace(new RegExp("\n\r","g"),"\n");var text=aText.replace(new RegExp("\r","g"),"\n");var lines=text.split("\n");var text="";for(var i=0;i<lines.length;i++){if(i!=0){text=text+settings.newlineTag;}text=text+de.titus.core.StringUtils.preventTabs(lines[i],settings.tabsize,settings.tabchar);}return text;};de.titus.core.StringUtils.getTabStopMap=function(tabSize,tabString){var tabstopMap=[];for(var i=0;i<=tabSize;i++){if(i==0){tabstopMap[0]="";}else{tabstopMap[i]=tabstopMap[i-1]+tabString;}}return tabstopMap;};de.titus.core.StringUtils.preventTabs=function(aText,theTabStops,theTabStopChar){var tabstopMap=de.titus.core.StringUtils.getTabStopMap(theTabStops,theTabStopChar);var tabStops=theTabStops;var text="";var tabs=aText.split("\t");for(var i=0;i<tabs.length;i++){if(i!=0){var size=text.length;var tabSize=size%tabStops;text=text+tabstopMap[theTabStops-tabSize]+tabs[i];}else{if(i==0&&aText.indexOf("\t")==0){text=text+tabstopMap[theTabStops];}else{text=text+tabs[i];}}}return text;};$.fn.de_titus_core_StringUtils=de.titus.core.StringUtils;});})($);