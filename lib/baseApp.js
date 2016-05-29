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

        init:function(data,handlers){
			this.setHandlers = handlers;
			this.config = data;
            $(document).ready(this.setHandlers());
        }
    };
module.exports = app;