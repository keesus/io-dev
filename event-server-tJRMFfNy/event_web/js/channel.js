window.channelPluginSettings = {
  "plugin_id": "cd08444d-95cc-4e48-b189-9eed1df4cc34"
};
(function() {
  var node = document.createElement('div');
  node.id = 'ch-plugin';
  document.body.appendChild(node);
  var async_load = function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//cdn.channel.io/plugin/ch-plugin-web.js';
    s.charset = 'UTF-8';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  };
  if (window.attachEvent) {
    window.attachEvent('onload', async_load);
  } else {
    window.addEventListener('load', async_load, false);
  }
})();