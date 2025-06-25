import { Routes, Route, useNavigate } from 'react-router-dom';
import Whiteboard from './components/Whiteboard';
import { useState } from 'react';

function App() {
  const [roomInput, setRoomInput] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomInput.trim()) {
      navigate(`/${roomInput.trim()}`);
    }
  };

  return (
    <Routes>
      {/* Home Page Route */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
              🎨 Collab Whiteboard
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="Enter Room ID"
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />

              <button
                onClick={handleJoinRoom}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                Join Room
              </button>
            </div>
          </div>
        }
      />

      {/* Room Route */}
      <Route path="/:roomId" element={<Whiteboard />} />
    </Routes>
  );
}

export default App;
