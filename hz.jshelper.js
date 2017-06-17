

Object.prototype.hz = {
    __init__        :   function(){
        for(var k in this){
            if(typeof(this[k])!= 'object'){
                Object.prototype[k] = this[k];
            }
        }
        for(var k in this.strings){
            if(typeof(this.strings[k])!= 'object'){
                String.prototype[k] = this.strings[k];
            }
        }
    },
    save_data       :   function(key, object){
        var o = object || this;
        if(o.get_name()=='Object'){
            o = 'obj__'+strfy(o);
        }else if(o.get_name()=='Number'){
            o = 'nbr__'+o;
        }else if(o.get_name()=='Array'){
            o = 'arr__'+o.join('||');
        }
        localStorage.setItem(key, o);
        return object || this;
        function strfy (object){
            var simpleObject = {};
            for (var prop in object ){
                if (!object.hasOwnProperty(prop)){
                    continue;
                }
                if (typeof(object[prop]) == 'object'){
                    continue;
                }
                if (typeof(object[prop]) == 'function'){
                    continue;
                }
                simpleObject[prop] = object[prop];
            }
            return JSON.stringify(simpleObject); // returns cleaned up JSON
        };
    },
    get_data        :   function(key){
        var data = localStorage.getItem(key) || undefined;
        if(data.indexOf('obj__')==0){
            return JSON.parse(data.slice(5))
        }else if(data.indexOf('nbr__')==0){
            return (data.indexOf('.')>0) ? parseFloat(data.slice(5)) : parseInt(data.slice(5));
        }else if(data.indexOf('arr__')==0){
            return data.slice(5).split('||');
        }
        return data;
    },
    iif             :   function(condition, truePart, falsePart){
        console.log(this.parent);

        if(truePart==undefined) return (condition);
        if(condition){
            if(this===window && typeof(truePart)=='function')
                truePart();
            return truePart;
        }
        if(this===window && typeof(falsePart)=='function')
            falsePart();

        return falsePart;
    },
    get_type         :   function(obj){
        console.log(obj, this.toString());
        return typeof(obj || this);
    },
    get_name        :   function(obj) {
        var funcNameRegex = /function (.{1,})\(/;
        obj = obj || this;
        var results = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    },
    clone           :   function(obj){
        var o = obj || this;
        if(typeof(o) != 'object') return obj;
        var new_o = {};
        for(var i in o){
            if(o.hasOwnProperty(i)){
                new_o[i] = o[i];
            }
        }
        return new_o;
    },
    getUrlParametre :   function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },
    strings         :   {
        starts_with     :   function(val, str){
            if(str!=undefined){
                return (str.slice(0, val.length)==val)
            }else{
                return (this.slice(0, val.length)==val)
            }
        },
        ends_with     :   function(val, str){
            if(str!=undefined){
                return (str.slice(str.length-val.length, str.length)==val)
            }else{
                return (this.slice(this.length-val.length, this.length)==val)
            }
        },
        sort        :   function(str){
            if(str==undefined)
                str=this;
            return str.split('').sort().join('');
        },
        capitalizeFirstLetter    :function(s, b){
            var str, agr=false, chr;
            if(typeof(s)=='string')
                str = s;
            else if(typeof(s)=='boolean')
                agr = s;
            if(b) agr=b;




            if(str==undefined)
                str=this;
            if(agr){
                var all = str.split('.');
                for(i=0;i<all.length;i++){
                    all[i] = this.capitlizeFirstLetter(all[i]);
                }
                return all.join('.');
            }
            chr = (str.charAt(0)!=' ') ? 0 : 1;
            return ((chr==1) ? ' ' : '') + str.charAt(chr).toUpperCase() + str.slice(++chr);
        },
    }

};
hz.__init__();
