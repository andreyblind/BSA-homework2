var handler = function(){
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
	        }
module.exports = handler;