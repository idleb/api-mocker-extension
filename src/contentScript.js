chrome.storage.sync.get({
    typesMap: [
        { type: 'Integer', value: 'number,int,integer,double,long' },
        { type: 'Float', value: 'float' },
        { type: 'String', value: 'string' },
        { type: 'Object', value: 'object' },
        { type: 'Array', value: 'array' },
        { type: 'Boolean', value: 'boolean' }],
    arrayRange: [0, 10],
    intRange: [0, 100],
    floatRange: [0, 1],
    keyMatches:[
        {reg: 'msg', value: '操作成功'},
        {reg: 'status', value: '0'},
    ]
}, function (items) {
    const { typesMap, arrayRange, intRange, floatRange, keyMatches } = items
    const main = document.getElementById("main");
    const tables = main.querySelectorAll("table");

    tables.forEach(function (el) {
        var insertFragment = document.createDocumentFragment()
        var button = document.createElement("button");
        button.className = "t2m-btn"
        button.innerText = "Mock示例"
        insertFragment.appendChild(button);
        var wrapper = document.createElement('div')
        wrapper.className = "t2m-wrapper active-sample"
        var nav = document.createElement('nav')
        var sampleBtn = document.createElement('a')
        sampleBtn.className = 'sample active'
        sampleBtn.textContent = 'Mock.js'
        var dataBtn = document.createElement('a')
        dataBtn.className = 'data'
        dataBtn.textContent = 'Data'
        nav.appendChild(sampleBtn)
        nav.appendChild(dataBtn)
        wrapper.appendChild(nav)

        var samplePre = document.createElement("pre");
        samplePre.className = "t2m-code t2m-code-sample"
        var dataPre = document.createElement("pre");
        dataPre.className = "t2m-code t2m-code-data"
        wrapper.appendChild(samplePre)
        wrapper.appendChild(dataPre)
        insertFragment.appendChild(wrapper)
        el.parentElement.insertBefore(insertFragment, el);

        nav.addEventListener("click", function(e){
            if (e.target.tagName == 'A'){
                nav.querySelectorAll('a').forEach(function(a){
                    a.className=a.className.replace(' active', '')
                })
                wrapper.className = wrapper.className.split(' ')[0] + ' active-' + e.target.className
                e.target.className += ' active'
            }
        })

        button.addEventListener("click", function (e) {
            var data = {}
            var nodes = []
            var btn = e.currentTarget

            if (btn.className == "t2m-btn show") {
                btn.className = "t2m-btn"
                btn.textContent = "Mock示例"
                return
            }
            btn.className = "t2m-btn show"
            btn.textContent = "收起"
            var rows = el.querySelectorAll("tr");
            rows.forEach(function (tr) {
                var cols = tr.querySelectorAll("td");
                var node = { key: '', type: '', path: [] }
                cols.forEach(function (td, i) {
                    if (i === 0) {
                        var path = td.innerText.replace(/\s/g, '').split('.')
                        node.key = path.pop()
                        node.path = path

                    } else if (i == 1) {
                        var type = td.innerText.toLocaleLowerCase().trim()
                        if (type.match(typesMap.find(r=>r.type=="Array").value.split(',').join('|'))) {
                            node.type = 'array'
                        } else if (type.match(typesMap.find(r=>r.type=="Object").value.split(',').join('|'))) {
                            node.type = 'object'
                        } else if (type.match(typesMap.find(r=>r.type=="Float").value.split(',').join('|'))) {
                            node.type = 'float'
                        } else if (type.match(typesMap.find(r=>r.type=="Integer").value.split(',').join('|'))) {
                            node.type = 'int'
                        } else if (type.match(typesMap.find(r=>r.type=="Boolean").value.split(',').join('|'))) {
                            node.type = 'bool'
                        } else if (type.match(typesMap.find(r=>r.type=="String").value.split(',').join('|'))) {
                            node.type = 'string'
                        } else {
                            node.type = 'string'
                        }
                    }
                })
                if (node.key) {
                    if (node.path.length === 0) {
                        data[node.key] = getValueByType(node.type, node.key)
                    } else {
                        var path = []
                        node.path.forEach(function (item) {
                            path.push(item)
                            if (Array.isArray(_.get(data, path))) {
                                path.push('0')
                            }
                        })
                        path.push(node.key)
                        
                        _.set(data, path, getValueByType(node.type, node.key))
                    }
                }

                nodes.push(node)
            })

            sortData(data)

            samplePre.innerHTML = formatJson(data)
            dataPre.innerHTML = formatJson(Mock.mock(data))
            
        })
    })

    function sortData(data){
        Object.entries(data).forEach(item => {
            var resetValue = getValueByMatch(item[0], keyMatches)
            if (typeof data[item[0]] !== 'object' && resetValue){
                data[item[0]] = resetValue
            } else if (_.isBoolean(item[1])){
                var keySet = getKeySet('bool')
                if (keySet){
                    data[item[0]+'|'+keySet] = item[1]
                    delete data[item[0]]
                }
            } else if (_.isInteger(item[1])){
                var keySet = getKeySet('int')
                if (keySet){
                    data[item[0]+'|'+keySet] = item[1]
                    delete data[item[0]]
                }
            } else if (_.isNumber(item[1])){
                var keySet = getKeySet('float')
                if (keySet){
                    data[item[0]+'|'+keySet] = item[1]
                    delete data[item[0]]
                }
            } else if (_.isArray(item[1])){
                var keySet = getKeySet('array')
                if (keySet){
                    data[item[0]+'|'+keySet] = item[1]

                    if (item[1][0]){
                        sortData(item[1][0])
                    }
                    
                    delete data[item[0]]
                }
            } else if (_.isObject(item[1])){
                sortData(item[1])
            }
        })
    }

    function getKeySet(type){
        var after
        if (type==="array"){
            after = [...new Set(arrayRange)].join('-')
        } else if (type==="int"){
            after = [...new Set(intRange)].join('-')
        } else if (type==="float"){
            after = `${[...new Set(intRange)].join('-')}.${[...new Set(floatRange)].join('-')}`
        } else if (type==="bool"){
            after = '1'
        }
        return after
    }
});

function getValueByMatch(key, matches = []){
    let value
    matches.forEach(item => {
        if (key.match(new RegExp(item.reg))){
            value = item.value
        }
    })
    return value
}

function getValueByType(type, key) {
    var value = ''
    if (type === "string") {
        value = 'mock'
    } else if (type === "object") {
        value = {}
    } else if (type === "array") {
        value = ['123']
    } else if (type === "float") {
        value = 0.5
    } else if (type === "int") {
        value = 2
    } else if (type === "bool") {
        value = false
    } else {
        value = '123'
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
        else if (node.match(/\}/) || node.match(/\]/)) padIdx = padIdx !== 0 ? --padIdx : padIdx;
        else indent = 0;
        for (var i = 0; i < padIdx; i++)    padding += PADDING;
        formatted += padding + node + '\r\n';
        padIdx += indent;
    });
    return formatted;
};
