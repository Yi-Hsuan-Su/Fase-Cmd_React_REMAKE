import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import JsonEditor from "./JsonEditor"; // 引入 JsonEditor 組件

const Basic = () => {
  const [jsonData, setJsonData] = useState("");
  const [name, setName] = useState("");
  const [jsonOptions, setJsonOptions] = useState([]);
  const [inputData, setInputData] = useState(""); // 用於處理用戶輸入
  const [isTyping, setIsTyping] = useState(false); // 追蹤用戶是否正在輸入
  const [isValidJson, setIsValidJson] = useState(true); // 用於控制輸入框的有效性
  const [isValidName, setIsValidName] = useState(true);

  useEffect(() => {
    // 只在組件首次加載時執行
    const savedNameInputData = localStorage.getItem("savedNameInput");
    const savedInputData = localStorage.getItem("savedInputData");

    // console.log(savedInputData);
    if (savedInputData && savedNameInputData) {
      setName(savedNameInputData);
      setInputData(savedInputData);
    }

    // 從本地存儲中取出命令隊列
    var cmdQueue = JSON.parse(localStorage.getItem("cmdQueue"));
    if (cmdQueue) {
      // 將每個 JSON 名稱添加到下拉選單
      console.log(cmdQueue);
      setJsonOptions(cmdQueue);
    }
  }, []); // 空依賴數組，只在首次渲染時執行

  // 在 inputData 更新後執行
  useEffect(() => {
    formatJson(inputData); // 如果需要格式化的話
  }, [inputData]);

  useEffect(() => {
    localStorage.setItem("savedNameInput", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("savedInputData", jsonData);
  }, [jsonData]);

  const handleSend = () => {
    if (!checkInput()) return;

    const newCmd = { name, jsonData: JSON.parse(jsonData) };
    const updatedCmdQueue = [...jsonOptions, newCmd];
    setJsonOptions(updatedCmdQueue);
    localStorage.setItem("cmdQueue", JSON.stringify(updatedCmdQueue));

    // 發送消息給後台腳本
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "buttonClicked",
        name: newCmd.name,
        jsonData: JSON.stringify(newCmd.jsonData),
      });
    });

    console.error("Sending...", { name, jsonData });
  };

  const handleReset = () => {
    setJsonOptions([]);
    setName("");
    setInputData("");
    setJsonData("");
    localStorage.removeItem("cmdQueue");
  };

  const handleClearDialog = () => {
        // 發送消息給後台腳本
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: "clearClicked"
            }
          );
        });
  };

  const checkInput = () => {
    console.log(name, inputData);
    if (!name && !inputData) {
      setIsValidName(false);
      setIsValidJson(false);
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputData(newValue);

    // // 檢查是否有變化並更新 lastInputData
    // if (newValue !== lastInputData.current) {
    //   lastInputData.current = newValue;
    // }
  };

  const handleInputFocus = () => {
    setIsValidJson(true); // 重置有效性狀態
  };

  const handleInputBlur = () => {
    if (!inputData) {
      // alert("JSON data is required.");
      setIsValidJson(false);
      return false;
    } else {
      setIsValidJson(true);
    }

    formatJson();
  };

  // ===
  const handleNameInputFocus = () => {
    setIsValidName(true);
  };

  const handleNameInputBlur = () => {
    if (!name) {
      setIsValidName(false);
      // return false;
    } else {
      setIsValidName(true);
    }
  };

  //===

  const formatJson = () => {
    try {
      const parsedData = JSON.parse(inputData);
      console.log(parsedData);
      const inputJSONData = JSON.stringify(parsedData, null, 2);
      setInputData(inputJSONData);
      setJsonData(inputJSONData);
      setIsValidJson(true); // 格式化成功，設置為有效
    } catch (error) {
      console.log(inputData);
      setIsValidJson(false); // 格式化失敗，設置為無效
    }
  };

  return (
    <div
      className="container-fluid"
      id="mainPopup"
      style={{ height: "400px", width: "800px" }}
    >
      <div className="row">
        <div className="col-auto">
          <select
            id="jsonSelect"
            className="form-control"
            value={
              jsonOptions.findIndex((option) => option.name === name) !== -1
                ? jsonOptions.findIndex((option) => option.name === name)
                : ""
            }
            onChange={(e) => {
              const selectedIndex = e.target.value;
              if (selectedIndex !== "") {
                const selectedCmd = jsonOptions[selectedIndex];
                setName(selectedCmd.name);
                setInputData(JSON.stringify(selectedCmd.jsonData));
              }
            }}
          >
            <option value="" disabled>
              請選擇 JSON
            </option>
            {jsonOptions.map((option, index) => (
              <option key={index} value={index}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button
            id="resetListButton"
            className="btn btn-primary btn-block mt-1"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
        <div className="col-auto">
          <button
            id="clearAllDialogButton"
            className="btn btn-primary btn-block mt-1"
            onClick={handleClearDialog}
          >
            Clear Dialog
          </button>
        </div>
        <div className="col text-start">
          <h2 className="mt-1">Fast Cmd</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-auto">
          <label htmlFor="nameInput" className="form-label">
            Name:
          </label>
        </div>
        <div className="col">
          <input
            type="text"
            id="nameInput"
            className={`form-control ${!isValidName ? "is-invalid" : ""}`} // 根據有效性添加紅色外框
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={handleNameInputFocus}
            onBlur={handleNameInputBlur}
          />
        </div>
      </div>
      <div className="row justify-content-center align-items-center no-gutters">
        <div className="col-md-6">
          <textarea
            id="jsonData"
            className={`form-control ${!isValidJson ? "is-invalid" : ""}`} // 根據有效性添加紅色外框
            style={{ height: "450px", maxHeight: "450px" }}
            rows="1"
            placeholder="Enter JSON data"
            value={inputData}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {!isValidJson && (
            <div className="invalid-feedback">Invalid JSON format.</div>
          )}{" "}
          {/* 顯示錯誤信息 */}
        </div>
        <div className="col-md-6">
          <JsonEditor jsonData={jsonData} setJsonData={setJsonData} />
        </div>
      </div>
      <div className="text-center">
        <button
          id="sendButton"
          className="btn btn-primary btn-block mt-1"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Basic;
