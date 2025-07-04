// Vercel serverless function to proxy Polygon.io API calls
// This keeps your API key hidden from the frontend

export default async function handler(req, res) {
    // CORS headers for frontend requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Get API key from environment variable
    const API_KEY = process.env.POLYGON_API_KEY;
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract the Polygon.io URL from query params
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        // Decode the URL and add API key
        const decodedUrl = decodeURIComponent(url);
        
        // Ensure proper URL construction
        const separator = decodedUrl.includes('?') ? '&' : '?';
        const polygonUrl = `${decodedUrl}${separator}apikey=${API_KEY}`;
        
        console.log('Fetching from:', polygonUrl.replace(API_KEY, '[HIDDEN]'));
        
        // Fetch from Polygon.io
        const response = await fetch(polygonUrl);
        const data = await response.json();
        
        // Return the data
        res.status(200).json(data);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}