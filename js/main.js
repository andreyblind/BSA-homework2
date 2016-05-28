    config={
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

    app = {
        data:[],
        deadElements:[],
        text:null,
        addNewElement:function(data){
            var template = Handlebars.compile($(config.item_template).html());
            $(config.container).append(template(data));
            app.data.push({hash:data.hash,text:data.text});
        },

        getLementIndexByHash:function(hash){
            var pos = app.data.map(function(e) { return e.hash; }).indexOf(hash);
            return pos;
        },

        getDeadElementIndex:function(hash){
            var pos = app.deadElements.map(function(e) { return e.hash; }).indexOf(hash);
            return pos;
        },

        restoreData:function(el){
            el.val(app.text);
        },

        setNewData:function(data){
            var index =app.getLementIndexByHash(data.hash);
            if (index !=-1){
                app.data[index]=data;
            }

            console.table(app.data);
        },

        removeElement:function(hash,that){
            app.data.splice(app.getLementIndexByHash(hash),1);
            that.parent().remove();
        },

        dumpData:function(){
          console.table(app.data);
        },

        generateNewHash:function(){
            return '#' + Math.random().toString(36).substr(2, 36);
        },

        setHandlers:function(config){

            $(config.container).on('click',config.destroyLink, function(){
                var that = $(this);
                app.removeElement(that.attr("href"),that);
            });

            $(config.container).on('dblclick',config.editPurchase, function(){
                $(this).toggleClass("activeTextInput");
                $(this).parent().toggleClass("activeDiv");
            });
            /*
                Обработчик события на чекбокс инвертирующий
                стиль элементов к удалению
             */
            $(config.checkAll).change(function () {
                $("input:checkbox").prop('checked', $(this).prop("checked"));
                $(config.editPurchase).toggleClass("killed");
            });

            $(config.container).on('change',config.checkItem,function () {
                var that = $(this);
                var parent = that.parent();
                var checked = that.prop("checked");
                var hash = parent.find("a.kill").attr("href");

                parent.find(".toBuytext").toggleClass("killed");

                if(checked){
                    app.deadElements.push({hash:hash});
                }
                if(!checked){
                    var index = app.getDeadElementIndex(hash);
                    app.deadElements.splice(index,1);
                }
            });              

            $(config.container).on('focusin',config.editPurchase, function() {
                app.text=$(this).val();
            });

         $(config.container).on('keyup',config.editPurchase, function(event){
                var that = $(this);

                if(event.which == config.keys["enter"]) {
                    var data= {
                        hash:that.parent().find("a.kill").attr("href"),
                        text:that.val()
                    };
                    app.setNewData(data);
                    $(config.newText).focus();
                }
                else if(event.keyCode == config.keys["escape"]){
                    app.restoreData($(this));
                    $(config.newText).focus();
                }
            });
            

            $(config.newText).on('keyup',function(event){
                if(event.which == config.keys["enter"]) {
                    var data = {
                        text : $(config.newText).val(),
                        hash:app.generateNewHash()
                    };
                    app.addNewElement(data);
                    $(config.newText).val('');
                    $(config.newText).focus();
                }
                else if(event.which == config.keys["escape"]){
                    $(config.newText).val('');
                    $(config.newText).focus();
                }

            });
            
            
            $(config.removeAll).click(function(){
                $("input[type=checkbox].checkItem:checked").parent().remove();
                    app.deadElements = {};
            });
                                      
            $(config.addButton).click(function(){
                var data = {
                    text : $(config.newText).val(),
                    hash:app.generateNewHash()
                };
                app.addNewElement(data);
            });
        },
        init:function(data){
            $(document).ready(app.setHandlers());
        }
    };
    app.setHandlers(config);
