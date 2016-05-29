/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var config = __webpack_require__(1);
	var toDoApp = __webpack_require__(2);

	//toDoApp.setHandlers(config);
	toDoApp.init(config);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var config={
	        keys:{
	            enter:13,
	            escape:27
	        },
	        root:"#app-list",
	        singleEl:".app-item",
	        editPurchase:".toBuytext",
	        destroyLink:".kill",
	        addButton:"#addEl",
	        newText:"#newText",
	        container:"#container",
	        item_template:"#item-template",
	        checkAll:"#checkAll",
	        checkAllText:"#checkAllText",
	        textEl:".textEl",
	        checkItem:".checkItem",
	        removeAll:"#removeAll"
	    };

	module.exports = config;

/***/ },
/* 2 */
/***/ function(module, exports) {

		var app = {
	        data:[],
	        text:null,
	        config:null,
	        addNewElement:function(data){
	            var template = Handlebars.compile($(this.config.item_template).html());
	            $(this.config.container).append(template(data));
	            this.data.push({hash:data.hash,text:data.text});
	        },

	        getLementIndexByHash:function(hash){
	            var pos = this.data.map(function(e) { return e.hash; }).indexOf(hash);
	            return pos;
	        },

	        restoreData:function(el){
	            el.val(this.text);
	        },

	        setNewData:function(data){
	            var index =this.getLementIndexByHash(data.hash);
	            if (index !=-1){
	                this.data[index]=data;
	            }

	            console.table(this.data);
	        },

	        removeElement:function(hash,that){
	            this.data.splice(this.getLementIndexByHash(hash),1);
				if(that !== undefined){
					that.parent().remove();
				}
	        },
			
	        dumpData:function(){
	          console.table(this.data);
	        },

	        generateNewHash:function(){
	            return '#' + Math.random().toString(36).substr(2, 36);
	        },

	        setHandlers:function(){
					var _this = this;
					$("#debug").click(function(){
						console.info("дебагим дату всего приложения");
						console.table(_this.data);
					});
		            $(_this.config.container).on('click',_this.config.destroyLink, function(){
		                _this.removeElement($(this).attr("href"),$(this));
		            });

		            $(_this.config.container).on('dblclick',_this.config.editPurchase, function(){
		                $(this).toggleClass("activeTextInput");
		                $(this).parent().toggleClass("activeDiv");
		            });
		            /*
		                Обработчик события на чекбокс инвертирующий
		                стиль элементов к удалению
		             */
		            $(_this.config.checkAll).change(function () {
		                $("input:checkbox").prop('checked', $(this).prop("checked")); //
		                $(_this.config.editPurchase).toggleClass("killed");
		            });

		            $(_this.config.container).on('change',_this.config.checkItem,function () {
						
		                var that = $(this);
		                var parent = that.parent();
		                var checked = that.prop("checked");
		                var hash = parent.find("a.kill").attr("href");

		                parent.find(".toBuytext").toggleClass("killed");

		            });              

		            $(_this.config.container).on('focusin',_this.config.editPurchase, function() {
		                _this.text=$(this).val();
		            });

					 $(_this.config.container).on('keyup',_this.config.editPurchase, function(event){
			                var that = $(this);
			                if(event.keyCode == _this.config.keys["enter"]) {
			                    var data= {
			                        hash:that.parent().find("a.kill").attr("href"),
			                        text:that.val()
			                    };
								_this.setNewData(data);
								$(_this.config.newText).focus();
			                }
			                else if(event.keyCode == _this.config.keys["escape"]){ 
							   _this.restoreData($(that));
			                    $(_this.config.newText).focus();
			                }
			            });

		            $(_this.config.newText).on('keyup',function(event){
		                if(event.which == _this.config.keys["enter"]) {
		                    var data = {
		                        text : $(_this.config.newText).val(),
		                        hash:_this.generateNewHash()
		                    };
							if(data.text.length > 1){
								_this.addNewElement(data);
		                    $(_this.config.newText).val('');
		                    $(_this.config.newText).focus();
							}
		                }
		                else if(event.which == _this.config.keys["escape"]){
		                    $(_this.config.newText).val('');
		                    $(_this.config.newText).focus();
		                }

		            });
		            
		            $(_this.config.removeAll).click(function(){
						$('input[type=checkbox].checkItem:checked').each(function () {
							var hash= $(this).attr("value");
							_this.removeElement(hash,$(this));
						});
		            });
		                                      
		            $(_this.config.addButton).click(function(){
		                var data = {
		                    text : $(_this.config.newText).val(),
		                    hash:_this.generateNewHash()
		                };
					
						if(data.text.length > 0){
							_this.addNewElement(data);
							$(_this.config.newText).val("");
						}	
		            });
		        },
	        init:function(data){
				this.config = data;
	            $(document).ready(this.setHandlers());
	        }
	    };
	module.exports = app;

/***/ }
/******/ ]);