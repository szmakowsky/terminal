import React, { useState, useRef } from 'react';
import axios from 'axios';

import './App.css';

function App() {
  const [textareaValue, setTextareaValue] = useState('');
  const [messageInputValue, setMessageInputValue] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const textareaRef = useRef(null);

  const handleTextareaKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
  
      const currentText = textareaValue;
  
      const lines = currentText.split('\n');
      const lastLine = lines[lines.length - 1].trim();
  
      if (lastLine !== '') {
        sendDataToServer(lastLine);
      }

    }
  };

  const sendDataToServer = (data) => {
    axios.post('http://localhost:8080/api/command', { command: data })
      .then(response => {
        const flatData = response.data[0];
        appendTextToTextarea("")
        appendTextToTextarea(flatData);
        scrollTextareaToBottom();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
  };

  const sendFile = () => {
    const formData = new FormData();
    formData.append('file', fileInput);
    formData.append('path', messageInputValue);

    axios.post('http://localhost:8080/api/file', formData)
      .then(response => {
        const resultText = response.data[0];
        appendTextToTextarea(resultText);
        appendTextToTextarea(" ");
        appendTextToTextarea(" ");
        scrollTextareaToBottom();
      })
      .catch(error => {
        console.error(error);
      });

    setFileInput(null);
    setMessageInputValue('');
  };

  const appendTextToTextarea = (text) => {
    setTextareaValue(prevValue => prevValue + text + '\n');
  };

  const scrollTextareaToBottom = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      setTimeout(() => {
        textarea.scrollTop = textarea.scrollHeight;
        const lastLineElement = textarea.lastElementChild;
        if (lastLineElement) {
          lastLineElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 0);
    }
  };

  return (
    <div id="app-container">
      <div id="area-container">
        <textarea
          ref={textareaRef}
          id="area"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
        ></textarea>
      </div>

      <div id="container">
        <input
          type="text"
          id="messageInput"
          placeholder="path"
          value={messageInputValue}
          onChange={(e) => setMessageInputValue(e.target.value)}
        />
        <input type="file" id="fileInput" onChange={handleFileInputChange} />
        <button onClick={sendFile} id='btn'>Send file</button>
      </div>
    </div>
  );
}

export default App;
