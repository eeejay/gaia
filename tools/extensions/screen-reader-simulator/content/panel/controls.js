!function() {

function ScreenReader() {
  Components.utils.import("resource://gre/modules/accessibility/AccessFu.jsm");
  Components.utils.import('resource://gre/modules/Services.jsm');

  Services.obs.addObserver(this, 'accessfu-output', false);
}

ScreenReader.prototype = {
  toggle: function toggle(enabled) {
    Services.prefs.setIntPref('accessibility.accessfu.activate', enabled ? 1 : 0);
  },

  start: function start() {
  },

  observe: function observe(aSubject, aTopic, aData) {
    if (aTopic != 'accessfu-output')
      return;

    var data = JSON.parse(aData);

    for (var i in data) {
      if (!data[i])
        continue;

      if (data[i].type == 'Speech') {
        var actions = data[i].details.actions;

        for (var ii in actions) {
          if (actions[ii].method == 'speak') {
            var li = window.document.createElement('li');
            li.innerHTML = actions[ii].data;
            window.document.getElementById('speechlog').appendChild(li);
            li.scrollIntoView(false);
          }
        }
      }
    }
  },

  next: function next() {
    AccessFu.Input.moveCursor('moveNext', 'Simple', 'gesture');
  },

  previous: function previous() {
    AccessFu.Input.moveCursor('movePrevious', 'Simple', 'gesture');
  },

  activate: function activate() {
    AccessFu.Input.activateCurrent();
  },

  scrollLeft: function scrollLeft() {
    AccessFu.Input.scroll(1, true);
  },

  scrollRight: function scrollRight() {
    AccessFu.Input.scroll(-1, true);
  },

  scrollUp: function scrollUp() {
    AccessFu.Input.scroll(1);
  },

  scrollDown: function scrollDown() {
    AccessFu.Input.scroll(-1);
  },

  _speechService: null
};
window.screenReader = new ScreenReader();

}();
