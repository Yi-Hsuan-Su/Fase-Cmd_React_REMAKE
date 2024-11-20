// inject.js
window.addEventListener('sendMessageToPage', function (event) {
  var data = event.detail;
  console.log("Received data:", data);
  // 在此处执行接收到消息后的操作
  // 例如：根据接收到的数据执行相应的操作
  if (window.DataProcess && typeof window.DataProcess.sendCustomStringToSelf === 'function') {
    window.DataProcess.sendCustomStringToSelf(data.name + " " + data.jsonData);
  } else {
    console.warn("DataProcess is not available");
  }
});

window.addEventListener('clearDialog', function (event) {
  console.log("Clear All Dialog");
  // 在此处执行接收到消息后的操作
  if (window.DialogManager && typeof window.DialogManager.cleanAllDialog === 'function') {
    window.DialogManager.cleanAllDialog();
  } else {
    console.warn("DialogManager is not available");
  }
});