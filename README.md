# PDF Signer — Client

A lightweight web app for uploading and digitally signing PDF documents.

## Features
- Upload in-browser pdf
- Export signed PDFs for download or prview

## Tech stack
- React (UI)
- TypeScript (type safety)
- Vite (build + dev server)
- Tailwind CSS (styling)
- axios(HTTP requests to backend API)
- node
- express(node webserver)

## Prerequisites
- Node.js (22.12+)
- npm or yarn

## Quick start client
1. Open terminal and go to the client folder:
  - cd pdf-signer/client
2. Install dependencies:
  - npm install
  - or yarn
4. Run in development:
  - npm run dev 
  - or yarn dev
  - open app in browser
5. Build for production:
  - npm run build

## Quick start sever
1. Open terminal and go to the server folder:
  - cd pdf-signer/sever
2. Install dependencies:
  - npm install
  - or yarn
4. Run in development:
  - npm run start 
  - or yarn dev


## To Open in web browser
1. Run client
2. Run Server
3. Open http:localhost:5173 on browser

## To Open in mobile browser
1. Run client
2. Run Server
3. Find IPv4 of your system: ipconfig on windows/ifconfig on MacOS
3. Open http:/<IP>:5173 on mobile browser