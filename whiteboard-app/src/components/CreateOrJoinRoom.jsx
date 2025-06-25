import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CreateOrJoinRoom = () => {
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState('public');
  const [permission, setPermission] = useState('edit');

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/${newRoomId}?accessType=${accessType}&permission=${permission}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    const roomId = e.target.roomId.value.trim();
    if (roomId) {
      navigate(`/${roomId}?accessType=${accessType}&permission=${permission}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 to-gray-200 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create or Join a Room</h1>

        {/* Room Settings */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Room Type</label>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Permission</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="edit">Edit</option>
              <option value="view">View Only</option>
            </select>
          </div>
        </div>

        {/* Create Room Button */}
        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
        >
          ➕ Create New Room
        </button>

        {/* Join Room Form */}
        <form onSubmit={handleJoinRoom} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="roomId"
            placeholder="Enter Room ID"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrJoinRoom;
