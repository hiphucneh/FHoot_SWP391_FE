// src/App.js

import React from 'react';
import Login from './Login'
import Header from './components/Header'; // Import Header component

function App() {
  return (
    <div className="App">
      <Header />
      <Login />
      {/* Các nội dung khác của bạn */}
    </div>
  );
}

export default App;
