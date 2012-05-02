var taskList
  , editor
  , output
  ;

loadConsole();
loadTasks();
loadEditor();
loadExecution();
loadFontsizes();

function run () {
  var result
    , before
    ;

  before = new Date();

  try {
    result = clojurejs.run(editor.getSession().getValue());

    if (result !== undefined) {
      console.log(result.hasOwnProperty("stringify") ? result.stringify() : result);
    }
  }
  catch (e) {
    console.error(e.message);
  }

  console.info('Done in ' + (new Date() - before) + 'ms');
}

function appendToLog (content) {
  output.innerHTML += content;
  output.scrollTop = output.scrollHeight;
}

function loadConsole () {
  output = document.getElementById('output');

  if (typeof console === 'undefined') {
    console = {
      log: function () {}
    , error: function () {}
    , info: function () {}
    };
  }

  var consoleLog = console.log
    , consoleInfo = console.info
    , consoleError = console.error
    ;

  console.log = function (msg) {
    appendToLog(msg + '<br />');
    consoleLog.apply(console, arguments);
  };

  console.info = function (msg) {
    appendToLog(classify(msg + '<br />', 'info'));
    consoleInfo.apply(console, arguments);
  };

  console.error = function (msg) {
    appendToLog(classify(msg + '<br />', 'error'));
    consoleError.apply(console, arguments);
  };

  function zeroPadNumber (n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function classify (content, klass) {
    return '<span class="' + klass + '">' + content + '</span>';
  }
}

function loadTasks () {
  var i
    , task
    , taskElement
    ;
  
  taskList = $('#tasks');
  taskList.chosen();

  taskList.change(function() {
    var option = $('#tasks option:selected')
      , task = option.data('task')
      ;

    saveCurrentTask();

    if (task)  {
      editor.getSession().setValue(localStorage[task.name] || task.code);
      $('#description').html('<b>' + task.name + '</b><br />' + task.description);
      $(this).data('current', task);
    }
    else {
      $(this).data('current', null);
    }

    editor.focus();
  });

  taskList.empty();
  $('<option />').appendTo(taskList);

  for (i = 0; i < tasks.length; ++i) {
    task = tasks[i];

    taskElement = $('<option />').text(task.name);
    taskElement.data('task', task);
    taskElement.appendTo(taskList);
  }

  taskList.trigger("liszt:updated");

  $('#reset').click(function() {
    var task = $('#tasks').data('current');

    if (task) {
      delete localStorage[task.name];
      editor.getSession().setValue(task.code);
    }
  });

  function saveCurrentTask() {
    var task = $('#tasks').data('current');

    if (task) {
      localStorage[task.name] = editor.getSession().getValue();
    }
  }
}

function loadEditor () {
  editor = ace.edit('editor');
  editor.setTheme('ace/theme/textmate');

  var ClojureMode = require('ace/mode/clojure').Mode;
  editor.getSession().setMode(new ClojureMode());

  editor.setShowPrintMargin(false);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);

  $('.ace_gutter').css({
    background: 'transparent',
    color: '#999'
  });  
  $('.ace_scroller').css({
    'overflow-x': 'auto'
  });
  $('.ace_sb').css({
    'overflow-y': 'auto'
  });

  editor.focus();

  $('#clear').click(function () {
    output.innerHTML = '';
  });
}

function loadExecution () {
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      if (e.shiftKey) {
        output.innerHTML = '';
      }
      run();
    }
  });

  $('#run').click(function () {
    run();
  });
}

function loadFontsizes () {
  var fontsizesList = $('#fontsizes')
    , sizeElement
    ;

  fontsizesList.change(function() {
    var size = $('#fontsizes option:selected');

    $('#editor').css({'font-size': size.val() + 'px'});

    editor.focus();
  });

  [14, 16, 18, 20].forEach(function (size) {
    sizeElement = $('<option />').text(size + 'px').val(size);
    sizeElement.appendTo(fontsizesList);
  });

  fontsizesList.chosen({disable_search_threshold: 100});
}
