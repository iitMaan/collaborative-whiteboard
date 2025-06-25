# 🧑‍🤝‍🧑 Collaborative Whiteboard

A real-time collaborative whiteboard built with React, Fabric.js, and Socket.IO. Users can draw, write, and interact on a shared canvas — ideal for brainstorming, teaching, or remote teamwork.

## ✨ Features

- 🎨 Drawing tools: Pencil, Rectangle, Circle, Text, Eraser
- 🧑‍🤝‍🧑 Multi-user real-time sync with Socket.IO
- 🛡️ Room access control (Public / Private)
- 👁️ Permissions: Edit / View-only modes
- 🔗 Shareable room links
- 📦 Built with Vite, Tailwind CSS, and Fabric.js

## 📁 Project Structure

collaborative-whiteboard/
├── server/ # Express + Socket.IO backend
│ ├── index.js # Main server file
│ └── src/lib/utils.js # Helper functions (optional)
│
├── whiteboard-app/ # React + Vite frontend
│ ├── App.jsx # Routes and page layout
│ ├── main.jsx # Entry point for React
│ ├── components/ # Toolbar, Whiteboard, ShareModal
│ ├── utils/ # socket.js and other helpers
│ ├── pages/ # Create/Join Room page (optional)
│ └── index.css # Global + Tailwind styles


## 🚀 Getting Started

### 1. Clone the repo

`git clone https://github.com/your-username/collaborative-whiteboard.git`
`cd collaborative-whiteboard`

### 2. Start the Backend (Server)

`cd server`
`npm install`
`node index.js`
Server runs at: http://localhost:3001

3. Start the Frontend (Vite + React)
`cd ../whiteboard-app`
`npm install`
`npm run dev`
App runs at: http://localhost:5173

🔗 Room Sharing
You can create or join rooms using:

`http://localhost:5173/roomId?accessType=public&permission=edit`

Links can be copied directly via the Share Room modal.
