# OrderFlow Backend Server

Backend server for handling Zr Express API calls and bypassing CORS restrictions.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your Zr Express API credentials:
   ```
   ZR_TOKEN=your_zr_express_token
   ZR_API_KEY=your_zr_express_api_key
   PORT=3001
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

### Zr Express Integration
- **POST** `/api/zr-express/test` - Test Zr Express API connection
- **POST** `/api/zr-express/send-orders` - Send orders to Zr Express
- **GET** `/api/zr-express/config` - Get current configuration
- **POST** `/api/zr-express/config` - Update configuration

## Features

- ✅ **CORS Bypass**: Handles API calls server-side
- ✅ **Error Handling**: Comprehensive error handling
- ✅ **Logging**: Detailed request/response logging
- ✅ **Security**: Helmet.js security headers
- ✅ **Configuration**: Environment-based configuration

## Usage

The frontend will automatically connect to this backend server running on port 3001.
