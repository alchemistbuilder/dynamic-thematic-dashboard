# Dynamic Thematic Dashboard

A comprehensive real-time stock market dashboard with advanced analytics, multi-timeframe performance tracking, and thematic portfolio management.

## 🚀 Features

### 📊 Multi-Tab Dashboard
- **Market Summary**: Overview of all sectors and top performers
- **Sector Overview**: 34 ETFs covering major sectors and themes
- **High Growth Momentum**: 47 growth stocks with breakout analysis
- **Compounders**: 25 quality long-term growth stocks
- **Mag7+**: 12 mega-cap technology leaders
- **AI Platform Basket**: 21 AI-focused companies
- **Market Intelligence**: Advanced analytics and insights
- **Gainers/Losers**: Multi-timeframe performance leaders

### 📈 Advanced Technical Analysis
- **Moving Averages**: 8/13/21-day EMAs, 50/100/200-day SMAs with stacking analysis
- **RSI Indicators**: 14-day and 30-day momentum oscillators
- **Performance Metrics**: YTD, 1D, 1W, 2W, 1M, 2M, 3M, 6M, 1YR returns
- **52-Week High Delta**: Distance from yearly peaks
- **Liberation Day Tracking**: Performance since April 2, 2025
- **Consecutive Up Days**: Momentum streak tracking
- **Gap & Volume Signals**: Intraday breakout indicators

### 🏆 Multi-Timeframe Champions
- **Elite Performers**: Stocks consistently ranking in top 5 across multiple timeframes
- **Weighted Scoring**: Daily (4x), Weekly (3x), 2-Week (2x), Monthly (1x) weights
- **Champion Badges**: Visual indicators for multi-timeframe consistency

### 📊 Sector Analysis
- **Equal-Weighted Portfolio Returns**: Median-based performance across timeframes
- **Moving Average Percentages**: Sector-wide technical health metrics
- **Real-time Sector Health**: Live updates for each thematic group

### 🎯 Gainers/Losers Dashboard
- **4-Column Compact Layout**: Daily, Weekly, 2-Week, Monthly in one row
- **Top 5 Lists**: Best and worst performers for each timeframe
- **All Sectors Covered**: Overall market plus each thematic basket
- **Clean Typography**: Optimized font sizes for maximum readability

### 🎛️ Interactive Features
- **Tabbed Navigation**: Seamless switching between analysis views
- **Live Data Toggle**: Real-time vs end-of-day pricing modes
- **Sortable Tables**: Click any header to sort ascending/descending
- **Drag & Drop**: Reorder columns for custom layouts
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Instant Refresh**: Update all data with single click

## 🎯 Tracked Assets (142 Total)

### 📊 Sector ETFs (34 tickers)
**Broad Market**: SPY, QQQ, IWM  
**Technology**: IGV, ARKW, WCLD, SMH, SOXX, FNGS  
**Healthcare**: XLV, IHI, ARKG, IBB, XBI  
**Innovation**: ARKK, ARKW, ARKG  
**International**: FXI, KWEB  
**Sectors**: XLU, XLI, XLF, XLP, XLRE, XLE, XLY  
**Commodities**: GLD  

### 🚀 High Growth Momentum (47 tickers)
**Recent IPOs**: CRCL, ZETA, RKLB  
**Growth Leaders**: PLTR, MELI, CRWD, UBER, SPOT  
**Fintech**: SOFI, AFRM, COIN, HOOD, LC  
**E-commerce**: SHOP, ABNB, CVNA, DASH  
**SaaS/Cloud**: SNOW, HUBS, TWLO, MDB, DOCU  
**Gaming/Social**: RBLX, DKNG, PINS, SNAP  
**And many more emerging growth companies**

### 💎 Compounders (25 tickers)
**Mega-cap Quality**: MSFT, AAPL, GOOGL, AMZN  
**Payment Leaders**: MA, V, AXP, PYPL  
**Software**: MSFT, CRM, ADBE, NOW  
**Consumer**: COST, WMT, HD, NKE  
**Healthcare**: UNH, JNJ, PFE  
**Industrials**: CAT, LMT, RTX  

### 🌟 Mag7+ (12 tickers)
**The Magnificent 7**: AAPL, MSFT, GOOGL, AMZN, NVDA, TSLA, META  
**Plus**: CRM, NFLX, ADBE, NOW, UBER  

### 🤖 AI Platform Basket (21 tickers)
**AI Infrastructure**: NVDA, AMD, AVGO, QCOM  
**Cloud AI**: MSFT, GOOGL, AMZN, CRM  
**AI Software**: PLTR, SNOW, NOW, C3AI  
**Semiconductors**: TSM, ASML, MU, AMAT  
**Emerging AI**: SMCI, ARM, PATH, AI  

### 💰 Cryptocurrencies (3 tickers)
**Major Cryptos**: X:BTCUSD, X:SOLUSD, X:ETHUSD  

## 🛠️ Setup

### Prerequisites
- Python 3.x
- Polygon.io API key (paid plan recommended for unlimited calls)
- Modern web browser

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alchemistbuilder/dynamic-thematic-dashboard.git
   cd dynamic-thematic-dashboard
   ```

2. **Update API key**:
   - Open `script.js`
   - Replace `API_KEY` with your Polygon.io API key

3. **Start the server**:
   ```bash
   python3 -m http.server 8001
   ```

4. **Open in browser**:
   ```
   http://localhost:8001
   ```

### Alternative Server Options
```bash
# Using included server script
python3 server.py

# Using auto-opening server
python3 start_server.py
```

## 📱 Usage

### Navigation
- **Refresh Button**: Update all data with latest market prices
- **Column Headers**: Click to sort by any metric
- **Visual Indicators**: Hover over headers to see sorting options

### Understanding the Data
- **Green ✓**: Positive conditions (above moving averages, bullish trends)
- **Red ✗**: Negative conditions (below moving averages, bearish trends)
- **Color-coded Percentages**: Green for gains, red for losses
- **Trend Classifications**: BULLISH, BEARISH, Healthy, ST BULLISH, ST BEARISH

### Key Metrics
- **Liberation Day**: April 2, 2025 baseline for performance tracking
- **EMA Stacking**: 8 > 13 > 21 indicates short-term bullish momentum
- **SMA Stacking**: 50 > 100 > 200 indicates long-term bullish trend
- **52W High Delta**: Shows how far current price is from yearly peak

## 🔧 Configuration

### API Settings
The dashboard uses Polygon.io for both stock and crypto data:
- **Stock tickers**: Standard symbols (e.g., SPY, QQQ)
- **Crypto tickers**: Polygon format (e.g., X:BTCUSD, X:SOLUSD)

### Adding New Assets
1. Add ticker to `STOCK_TICKERS` or `CRYPTO_TICKERS` array in `script.js`
2. Add name mapping to `STOCK_NAMES` object
3. Refresh the dashboard

### Customizing Time Periods
Modify the `periods` object in `calculatePercentageChanges()` function to adjust timeframes.

## 🚀 Performance

- **Fast Loading**: Parallel API calls for all 27 assets
- **Real-time Updates**: Current market data with each refresh
- **Optimized for Speed**: Polygon.io paid tier eliminates rate limiting
- **Responsive UI**: Smooth sorting and visual feedback

## 📊 Technical Implementation

### Data Flow
1. **Optimized API Calls**: Grouped endpoint fetching with individual fallbacks
2. **Advanced Calculations**: EMAs, SMAs, RSI, consecutive streaks, breakout scoring
3. **Multi-Tab Rendering**: Dynamic content switching with preserved state
4. **Real-time Updates**: Live pricing toggle with market hours detection
5. **Intelligent Sorting**: Client-side sorting with visual feedback

### Architecture
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks needed)
- **Backend**: Python HTTP server for local hosting
- **Data Source**: Polygon.io REST API with grouped optimization
- **Styling**: Advanced CSS Grid with responsive 4-column layouts
- **Performance**: Parallel processing and optimized API usage

### Key Features Implemented
- **New IPO Detection**: Special scoring for stocks with limited historical data
- **Multi-Timeframe Analysis**: Weighted scoring across Daily/Weekly/Monthly periods
- **Sector Portfolio Analytics**: Equal-weighted median-based returns
- **Compact Gainers/Losers**: 4-column layout with optimized typography
- **Champions System**: Persistent performer identification across timeframes

## 🤝 Contributing

This dashboard represents a comprehensive market analysis tool with advanced features:

### Recent Major Updates
- ✅ **Multi-Tab Dashboard**: 8 specialized analysis views
- ✅ **Gainers/Losers Tab**: 4-column compact layout with multi-timeframe analysis
- ✅ **Champions System**: Multi-timeframe consistency tracking
- ✅ **Sector Analysis**: Equal-weighted portfolio performance metrics
- ✅ **AI Platform Basket**: Dedicated AI/ML company tracking
- ✅ **Advanced Typography**: Optimized for readability and space efficiency

### Future Enhancement Ideas
- Historical performance charts and trend visualization
- Export functionality for analysis data
- Alert system for threshold breaches
- Portfolio tracking with position sizing
- Machine learning predictions based on technical patterns

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with assistance from Claude Code
- Market data provided by Polygon.io
- Inspired by professional trading dashboards

---

**⚡ Live Dashboard**: Run locally for real-time market insights!

---
_Last updated: 2025-06-27_