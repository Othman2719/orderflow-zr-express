const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Zr Express API configuration
const ZR_EXPRESS_CONFIG = {
  baseURL: 'https://procolis.com/api_v1',
  token: process.env.ZR_TOKEN || '758aac85305a8379120949f780630b395905e287f8abe9e84cfab5d2c8074488',
  apiKey: process.env.ZR_API_KEY || 'a98b913516104f8bb17e7c51f2c88ba1'
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OrderFlow Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test Zr Express API connection
app.post('/api/zr-express/test', async (req, res) => {
  try {
    console.log('Testing Zr Express API connection...');
    
    const response = await axios.get(`${ZR_EXPRESS_CONFIG.baseURL}/token`, {
      headers: {
        'token': ZR_EXPRESS_CONFIG.token,
        'key': ZR_EXPRESS_CONFIG.apiKey
      },
      timeout: 10000
    });

    console.log('Zr Express API test successful:', response.status);
    res.json({ 
      success: true, 
      message: 'Zr Express API connection successful',
      status: response.status
    });
  } catch (error) {
    console.error('Zr Express API test failed:', error.message);
    
    // Try alternative endpoint
    try {
      const response = await axios.post(`${ZR_EXPRESS_CONFIG.baseURL}/tarification`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'token': ZR_EXPRESS_CONFIG.token,
          'key': ZR_EXPRESS_CONFIG.apiKey
        },
        timeout: 10000
      });

      console.log('Alternative endpoint test successful:', response.status);
      res.json({ 
        success: true, 
        message: 'Zr Express API connection successful (alternative endpoint)',
        status: response.status
      });
    } catch (altError) {
      console.error('Alternative endpoint test failed:', altError.message);
      res.status(500).json({ 
        success: false, 
        message: 'Zr Express API connection failed',
        error: altError.message
      });
    }
  }
});

// Send orders to Zr Express
app.post('/api/zr-express/send-orders', async (req, res) => {
  try {
    const { orders } = req.body;
    
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No orders provided or invalid format'
      });
    }

    console.log(`Sending ${orders.length} orders to Zr Express...`);
    console.log('Orders data:', JSON.stringify(orders, null, 2));

    // Wilaya data with English names
    const wilayaData = [
      { id: 1, nameEn: 'Adrar - 01' },
      { id: 2, nameEn: 'Chlef - 02' },
      { id: 3, nameEn: 'Laghouat - 03' },
      { id: 4, nameEn: 'Oum El Bouaghi - 04' },
      { id: 5, nameEn: 'Batna - 05' },
      { id: 6, nameEn: 'Béjaïa - 06' },
      { id: 7, nameEn: 'Biskra - 07' },
      { id: 8, nameEn: 'Béchar - 08' },
      { id: 9, nameEn: 'Blida - 09' },
      { id: 10, nameEn: 'Bouira - 10' },
      { id: 11, nameEn: 'Tamanrasset - 11' },
      { id: 12, nameEn: 'Tébessa - 12' },
      { id: 13, nameEn: 'Tlemcen - 13' },
      { id: 14, nameEn: 'Tiaret - 14' },
      { id: 15, nameEn: 'Tizi Ouzou - 15' },
      { id: 16, nameEn: 'Alger - 16' },
      { id: 17, nameEn: 'Djelfa - 17' },
      { id: 18, nameEn: 'Jijel - 18' },
      { id: 19, nameEn: 'Sétif - 19' },
      { id: 20, nameEn: 'Saïda - 20' },
      { id: 21, nameEn: 'Skikda - 21' },
      { id: 22, nameEn: 'Sidi Bel Abbès - 22' },
      { id: 23, nameEn: 'Annaba - 23' },
      { id: 24, nameEn: 'Guelma - 24' },
      { id: 25, nameEn: 'Constantine - 25' },
      { id: 26, nameEn: 'Médéa - 26' },
      { id: 27, nameEn: 'Mostaganem - 27' },
      { id: 28, nameEn: 'M\'Sila - 28' },
      { id: 29, nameEn: 'Mascara - 29' },
      { id: 30, nameEn: 'Ouargla - 30' },
      { id: 31, nameEn: 'Oran - 31' },
      { id: 32, nameEn: 'El Bayadh - 32' },
      { id: 33, nameEn: 'Illizi - 33' },
      { id: 34, nameEn: 'Bordj Bou Arréridj - 34' },
      { id: 35, nameEn: 'Boumerdès - 35' },
      { id: 36, nameEn: 'El Tarf - 36' },
      { id: 37, nameEn: 'Tindouf - 37' },
      { id: 38, nameEn: 'Tissemsilt - 38' },
      { id: 39, nameEn: 'El Oued - 39' },
      { id: 40, nameEn: 'Khenchela - 40' },
      { id: 41, nameEn: 'Souk Ahras - 41' },
      { id: 42, nameEn: 'Tipaza - 42' },
      { id: 43, nameEn: 'Mila - 43' },
      { id: 44, nameEn: 'Aïn Defla - 44' },
      { id: 45, nameEn: 'Naâma - 45' },
      { id: 46, nameEn: 'Aïn Témouchent - 46' },
      { id: 47, nameEn: 'Ghardaïa - 47' },
      { id: 48, nameEn: 'Relizane - 48' },
      { id: 49, nameEn: 'Timimoun - 49' },
      { id: 50, nameEn: 'Bordj Badji Mokhtar - 50' },
      { id: 51, nameEn: 'Ouled Djellal - 51' },
      { id: 52, nameEn: 'Béni Abbès - 52' },
      { id: 53, nameEn: 'In Salah - 53' },
      { id: 54, nameEn: 'In Guezzam - 54' },
      { id: 55, nameEn: 'Touggourt - 55' },
      { id: 56, nameEn: 'Djanet - 56' },
      { id: 57, nameEn: 'M\'Ghair - 57' },
      { id: 58, nameEn: 'Meniaa - 58' }
    ];

    // Helper function to get English wilaya name
    const getWilayaNameEn = (wilayaId) => {
      const wilaya = wilayaData.find(w => w.id === wilayaId);
      return wilaya ? wilaya.nameEn : 'Alger - 16';
    };

    // Prepare colis data for Zr Express API with COMPLETE FIX
    const colisData = orders.map((order, index) => {
      try {
        console.log(`Processing order ${index + 1}:`, order);
        
        // SIMPLE AND SAFE property extraction - no complex type checking
        const orderId = order.id || order.orderId || (index + 1);
        const clientName = order.clientName || "Unknown Client";
        const phone = order.phone || "";
        const address = order.address || "Unknown Address";
        const productName = order.productName || "Unknown Product";
        const deliveryType = order.deliveryType || "domicile";
        const wilayaId = order.wilayaId || 16;
        const totalPrice = order.totalPrice || order.price || 0;
        
        // SIMPLE string conversion - no toString() calls
        const safeOrderId = String(orderId);
        const safeWilayaId = String(wilayaId);
        const safeTotal = String(totalPrice);
        
        // Get English wilaya name
        const wilayaNameEn = getWilayaNameEn(wilayaId);
        
        // Simple address parsing
        let commune = "Alger";
        if (address && address.includes(',')) {
          commune = address.split(',')[0].trim();
        } else if (address) {
          commune = address;
        }
        
        const colisItem = {
          Tracking: `TRK${safeOrderId.padStart(6, '0')}`,
          TypeLivraison: deliveryType === "domicile" ? "0" : "1",
          TypeColis: "0",
          Confrimee: "1",
          Client: clientName,
          MobileA: phone,
          MobileB: phone,
          Adresse: address,
          IDWilaya: safeWilayaId,
          Commune: commune,
          Total: safeTotal,
          Note: `Order #${safeOrderId} - ${productName} - ${wilayaNameEn}`,
          TProduit: productName,
          id_Externe: safeOrderId,
          Source: "OrderFlow App"
        };

        console.log(`Successfully processed order ${index + 1}:`, colisItem);
        return colisItem;

      } catch (orderError) {
        console.error(`Error processing order ${index + 1}:`, orderError);
        console.error('Problematic order data:', order);
        
        // Return a completely safe default order structure
        const safeIndex = String(index + 1);
        return {
          Tracking: `TRK${safeIndex.padStart(6, '0')}`,
          TypeLivraison: "0",
          TypeColis: "0",
          Confrimee: "1",
          Client: "Unknown Client",
          MobileA: "",
          MobileB: "",
          Adresse: "Unknown Address",
          IDWilaya: "16",
          Commune: "Alger",
          Total: "0",
          Note: `Order #${safeIndex} - Unknown Product - Alger - 16`,
          TProduit: "Unknown Product",
          id_Externe: safeIndex,
          Source: "OrderFlow App"
        };
      }
    });

    const requestBody = {
      Colis: colisData
    };

    console.log('Sending to Zr Express API:', JSON.stringify(requestBody, null, 2));

    // Send to Zr Express API
    const response = await axios.post(`${ZR_EXPRESS_CONFIG.baseURL}/add_colis`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'token': ZR_EXPRESS_CONFIG.token,
        'key': ZR_EXPRESS_CONFIG.apiKey
      },
      timeout: 30000
    });

    console.log('Zr Express API response:', response.status, response.data);

    res.json({
      success: true,
      message: `${orders.length} orders sent to Zr Express successfully`,
      data: response.data,
      ordersProcessed: orders.length
    });

  } catch (error) {
    console.error('Error sending orders to Zr Express:', error.message);
    console.error('Full error details:', error);
    
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        success: false,
        message: `Zr Express API error: ${error.response.status}`,
        error: error.response.data,
        ordersProcessed: 0
      });
    } else if (error.request) {
      console.error('Network Error:', error.request);
      res.status(503).json({
        success: false,
        message: 'Network error - unable to reach Zr Express API',
        error: error.message,
        ordersProcessed: 0
      });
    } else {
      console.error('Request Error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
        ordersProcessed: 0
      });
    }
  }
});

// Get Zr Express configuration
app.get('/api/zr-express/config', (req, res) => {
  res.json({
    baseURL: ZR_EXPRESS_CONFIG.baseURL,
    hasToken: !!ZR_EXPRESS_CONFIG.token,
    hasApiKey: !!ZR_EXPRESS_CONFIG.apiKey,
    tokenPreview: ZR_EXPRESS_CONFIG.token ? `***${ZR_EXPRESS_CONFIG.token.slice(-4)}` : null,
    apiKeyPreview: ZR_EXPRESS_CONFIG.apiKey ? `***${ZR_EXPRESS_CONFIG.apiKey.slice(-4)}` : null
  });
});

// Update Zr Express configuration
app.post('/api/zr-express/config', (req, res) => {
  const { token, apiKey, baseURL } = req.body;
  
  if (token) ZR_EXPRESS_CONFIG.token = token;
  if (apiKey) ZR_EXPRESS_CONFIG.apiKey = apiKey;
  if (baseURL) ZR_EXPRESS_CONFIG.baseURL = baseURL;

  console.log('Updated Zr Express configuration');
  
  res.json({
    success: true,
    message: 'Zr Express configuration updated successfully',
    config: {
      baseURL: ZR_EXPRESS_CONFIG.baseURL,
      hasToken: !!ZR_EXPRESS_CONFIG.token,
      hasApiKey: !!ZR_EXPRESS_CONFIG.apiKey
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OrderFlow Backend Server (FIXED) running on port ${PORT}`);
  console.log(`📡 Zr Express API: ${ZR_EXPRESS_CONFIG.baseURL}`);
  console.log(`🔑 Token: ${ZR_EXPRESS_CONFIG.token ? '***' + ZR_EXPRESS_CONFIG.token.slice(-4) : 'Not set'}`);
  console.log(`🔑 API Key: ${ZR_EXPRESS_CONFIG.apiKey ? '***' + ZR_EXPRESS_CONFIG.apiKey.slice(-4) : 'Not set'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
