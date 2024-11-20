// 監聽來自背景腳本或其他內容腳本的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 檢查消息的 action 屬性，以確定要執行的操作
  if (request.action === "buttonClicked") {
    // 打包要傳遞的數據
    const dataToSend = {
      name: request.name,
      jsonData: request.jsonData,
    };

    // 創建一個自定義事件
    const event = new CustomEvent("sendMessageToPage", {
      detail: dataToSend,
    });
    window.dispatchEvent(event);

    const pageEvent = new CustomEvent("sendCmdToShortCut", {
      detail: dataToSend,
    });
    window.dispatchEvent(pageEvent);
  } else if (request.action === "clearClicked") {
    const pageEvent = new CustomEvent("clearDialog", {});
    window.dispatchEvent(pageEvent);
  }
});

// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "injectScript") {
    console.warn("injectScript");
    injectScript("dist/inject.js");
    return true; // 這樣可以使用 async sendResponse
  }
});

console.log("Content script loaded");

// 用於注入其他腳本
function injectScript(src) {
  // 在這裡你可以添加其他的邏輯

  const s = document.createElement("script");
  s.src = chrome.runtime.getURL(src);
  console.log(chrome.runtime.getURL(src));
  s.onload = () => s.remove();
  (document.head || document.documentElement).append(s);
}

injectScript("dist/inject.js");

// 注入您的腳本
// injectScript("dist/inject.js");
// injectScript("shortCut.js");
