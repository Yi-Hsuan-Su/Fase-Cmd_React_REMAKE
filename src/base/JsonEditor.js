import React, { useEffect, useRef } from 'react';

const JsonEditor = ({ jsonData, setJsonData }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const container = editorRef.current;
    const options = {
      mode: 'tree', // 或 'view', 'text', 'form', 'code', 'preview'
      onChange: () => {
        setJsonData(JSON.stringify(editor.get(), null, 2));
      },
    };

    // 確保 jsoneditor 已加載
    const editor = new window.JSONEditor(container, options);
    editor.set(jsonData ? JSON.parse(jsonData) : {});

    return () => {
      editor.destroy(); // 清理編輯器
    };
  }, [jsonData, setJsonData]);

  return <div ref={editorRef} style={{ width: '100%', height: '450px' }} />;
};

export default JsonEditor;