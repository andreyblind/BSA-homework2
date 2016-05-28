	var app = {
        data:[],
        deadElements:[],
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

        getDeadElementIndex:function(hash){
            var pos = this.deadElements.map(function(e) { return e.hash; }).indexOf(hash);
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
            that.parent().remove();
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
					
					console.info("дебагим элементы к удалению");
					console.table(_this.deadElements);
					
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
	                $("input:checkbox").prop('checked', $(this).prop("checked"));
	                $(_this.config.editPurchase).toggleClass("killed");
	            });

	            $(_this.config.container).on('change',_this.config.checkItem,function () {
	                var that = $(this);
	                var parent = that.parent();
	                var checked = that.prop("checked");
	                var hash = parent.find("a.kill").attr("href");

	                parent.find(".toBuytext").toggleClass("killed");

	                if(checked){
	                    _this.deadElements.push({hash:hash});
	                }
	                if(!checked){
	                    var index = _this.getDeadElementIndex(hash);
	                    _this.deadElements.splice(index,1);
	                }
	            });              

	            $(_this.config.container).on('focusin',_this.config.editPurchase, function() {
	                this.text=$(this).val();
	            });

	         $(_this.config.newText).on('keyup',_this.config.editPurchase, function(event){
	                var that = $(this);
	                if(event.which == _this.config.keys["enter"]) {
	                    var data= {
	                        hash:that.parent().find("a.kill").attr("href"),
	                        text:that.val()
	                    };
						
							this.setNewData(data);
							$(_this.config.newText).focus();
						
	                }
	                else if(event.keyCode == _this.config.keys["escape"]){
	                    this.restoreData($(this));
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
	                $("input[type=checkbox].checkItem:checked").parent().remove();
	                    _this.deadElements = {};
	            });
	                                      
	            $(_this.config.addButton).click(function(){
	                var data = {
	                    text : $(_this.config.newText).val(),
	                    hash:_this.generateNewHash()
	                };
				
					if(data.text.length > 1){
						_this.addNewElement(data);
					}	
	            });
	        },
        init:function(data){
			this.config = data;
            $(document).ready(this.setHandlers());
        }
    };
module.exports = app;