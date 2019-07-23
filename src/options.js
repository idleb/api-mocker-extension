// Saves options to chrome.storage
function save_template_options() {
  var typesMap = []
  document.querySelectorAll('#typesMap>tr').forEach(el => {
    typesMap.push({
      type: el.querySelector('td').textContent,
      value: el.querySelector('input').value
    })
  });

  chrome.storage.sync.set({
    typesMap,
  }, function () {
    // Update status to let user know options were saved.
    var status = document.querySelector('.status');
    status.className = 'status'
    setTimeout(function () {
      status.className = 'status hide'
    }, 3000);
  });
}

function save_range_options() {
  var arrayRange = []
  document.querySelectorAll("#arrayRange input").forEach(el => {
    arrayRange.push(el.value)
  })

  var intRange = []
  document.querySelectorAll("#intRange input").forEach(el => {
    intRange.push(el.value)
  })

  var floatRange = []
  document.querySelectorAll("#floatRange input").forEach(el => {
    floatRange.push(el.value)
  })

  chrome.storage.sync.set({
    arrayRange, intRange, floatRange,
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function save_matches_options() {
  var keyMatches = []
  document.querySelectorAll('#keyMatches>li').forEach(el => {
    var inputs = el.querySelectorAll('input')
    keyMatches.push({
      reg: inputs[0].value,
      value: inputs[1].value
    })
  })

  chrome.storage.sync.set({
    keyMatches
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
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
    keyMatches: [
      { reg: 'msg', value: '操作成功' },
      { reg: 'status', value: '0' },
    ]
  }, function (items) {
    var typesMapTable = document.getElementById('typesMap');
    var fragment = document.createDocumentFragment()
    items.typesMap.forEach(function (item) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      td1.textContent = item.type
      var td2 = document.createElement('td');
      var input = document.createElement('input')
      input.value = item.value || item.type
      td2.appendChild(input)
      tr.appendChild(td1)
      tr.appendChild(td2)
      fragment.appendChild(tr)
    })
    typesMapTable.appendChild(fragment)

    var arrayRange = document.querySelectorAll("#arrayRange input");
    arrayRange[0].value = items.arrayRange[0]
    arrayRange[1].value = items.arrayRange[1]

    var intRange = document.querySelectorAll("#intRange input");
    intRange[0].value = items.intRange[0]
    intRange[1].value = items.intRange[1]

    var floatRange = document.querySelectorAll("#floatRange input");
    floatRange[0].value = items.floatRange[0]
    floatRange[1].value = items.floatRange[1]

    var keyMatchesList = document.getElementById('keyMatches');
    var liFragment = document.createDocumentFragment()
    items.keyMatches.forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML = '匹配：<input type="text" value=' + item.reg + '> -> 值：<input type="text" value=' + item.value + '> <button class="btn-del">删除</button>'
      liFragment.appendChild(li)
    })
    keyMatchesList.appendChild(liFragment)

    document.getElementById('add').addEventListener('click', function () {
      var li = document.createElement('li');
      li.innerHTML = '匹配：<input type="text"> -> 值：<input type="text"> <button class="btn-del">删除</button>'
      keyMatchesList.appendChild(li)
    });

    keyMatchesList.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') {
        keyMatchesList.removeChild(e.target.parentElement)
      }
    });
  });
}

function change_setting(e){
  if (e.target.tagName == 'A'){
    var curName = e.target.hash.replace('#','')
    document.querySelector('#menu .active').className = ''
    e.target.className = 'active'
    var preActive = document.querySelector('.box.active')
    preActive.className = preActive.className.replace(' active', '')
    var curBox = document.querySelector('.'+curName+'-box')
    curBox.className += ' active'
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('templateSave').addEventListener('click', save_template_options);
document.getElementById('lengthRangeSave').addEventListener('click', save_range_options);
document.getElementById('wordMatchSave').addEventListener('click', save_matches_options);

document.getElementById('menu').addEventListener('click', change_setting)