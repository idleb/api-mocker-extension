var main = document.getElementById("main");

var tables = main.querySelectorAll("table");

function getValueByType(type, key){
    var value = ''
    if (type === "string"){
        value = 'test'
    } else if (type === "object"){
        value = {}
    } else if (type === "array"){
        value = []
    } else if (type === "float"){
        value = '2.5'
    } else if (key.match("Id")){
        value = '@id'
    } else if (key.match("status")){
        value = '0'
    } else {
        value = '100'
    }
    return value
}

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
var formatJson = function (json) {
    var formatted = '',     //转换后的json字符串
        padIdx = 0,         //换行后是否增减PADDING的标识
        PADDING = '    ';   //4个空格符
    /**
     * 将对象转化为string
     */
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    
    json = json.replace(/([\{\}])/g, '\r\n$1\r\n')
                .replace(/([\[\]])/g, '\r\n$1\r\n')
                .replace(/(\,)/g, '$1\r\n')
                .replace(/(\r\n\r\n)/g, '\r\n')
                .replace(/\r\n\,/g, ',');
    /** 
     * 根据split生成数据进行遍历，一行行判断是否增减PADDING
     */
   (json.split('\r\n')).forEach(function (node, index) {
        var indent = 0,
            padding = '';
        if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
        else if (node.match(/\}/) || node.match(/\]/))  padIdx = padIdx !== 0 ? --padIdx : padIdx;
        else    indent = 0;
        for (var i = 0; i < padIdx; i++)    padding += PADDING;
        formatted += padding + node + '\r\n';
        padIdx += indent;
    });
    return formatted;
};

tables.forEach(function(el){
    var button = document.createElement("button");
    button.className = "t2m-btn"
    button.innerText = "Mock示例"
    el.parentElement.insertBefore(button, el);
    var pre = document.createElement("pre");
    pre.className = "t2m-code"
    el.parentElement.insertBefore(pre, el);
    var data = {}
    button.addEventListener("click", function(e){
        var btn = e.currentTarget
        console.log(btn);
        
        if (btn.className == "t2m-btn show"){
            btn.className = "t2m-btn"
            return
        }
        btn.className = "t2m-btn show"
        var rows = el.querySelectorAll("tr");
        rows.forEach(function(tr){
            var cols = tr.querySelectorAll("td");
            var node = {key:'',type:'',path:[]}
            cols.forEach(function(td,i){
                if (i === 0){
                    var path = td.innerText.replace(/\s/g,'').split('.')
                    node.key = path.pop()
                    node.path = path

                } else if (i == 1){
                    var type = td.innerText.toLocaleLowerCase().trim()
                    if (type.match('array')){
                        node.type = 'array'
                    } else if (type.match('object')){
                        node.type = 'object'
                    } else if (type == 'int' || type == 'integer'){
                        node.type = 'int'
                    } else if (type == 'long'){
                        node.type = 'long'
                    } else if (type == 'float'){
                        node.type = 'float'
                    } else if (type == 'string'){
                        node.type = 'string'
                    } 
                }
            })
            if (node.key){
                if (node.path.length === 0){
                    data[node.key] = getValueByType(node.type,node.key)
                } else {
                    var path = []
                    node.path.forEach(function(item){
                        path.push(item)
                        if(Object.prototype.toString.call(_.get(data, path))=='[object Array]'){
                            path.push('0')
                        }
                    })
                    path.push(node.key)
                    _.set(data, path, getValueByType(node.type,node.key))
                }
            }
        })
        
        pre.innerHTML = formatJson(data)
    })
})
