# Dynamic Thematic Dashboard

A real-time stock and cryptocurrency dashboard with comprehensive technical indicators and performance tracking.

## 🚀 Features

### 📊 Market Coverage
- **25 ETFs** covering major sectors (Tech, Healthcare, Energy, Financials, etc.)
- **2 Cryptocurrencies** (Bitcoin and Solana)
- **Real-time data** from Polygon.io API

### 📈 Technical Indicators
- **Moving Averages**: 8/13/21-day EMAs, 50/100/200-day SMAs
- **Performance Metrics**: YTD, 1D, 1W, 2W, 1M, 2M, 3M, 6M, 1YR returns
- **52-Week High Delta**: Distance from yearly highs
- **Liberation Day Tracking**: Performance since April 2, 2025

### 🔍 Advanced Analytics
- **Trend Analysis**: Bullish/Bearish classifications
- **Moving Average Comparisons**: Price vs MA indicators (✓/✗)
- **Stacking Indicators**: EMA and SMA alignment signals
- **Color-coded Performance**: Visual trend identification

### 🎛️ Interactive Features
- **Sortable Columns**: Click any header to sort ascending/descending
- **Visual Sort Indicators**: Animated arrows and hover effects
- **Responsive Design**: Works on desktop and tablet
- **One-click Refresh**: Update all data instantly

## 🎯 Tracked Assets

### ETFs
| Ticker | Name | Sector |
|--------|------|--------|
| GLD | SPDR Gold Shares | Precious Metals |
| FXI | iShares China Large-Cap ETF | International |
| KWEB | KraneShares CSI China Internet ETF | Tech/International |
| XLU | Utilities Select Sector SPDR Fund | Utilities |
| IHI | iShares U.S. Medical Devices ETF | Healthcare |
| XLI | Industrial Select Sector SPDR Fund | Industrials |
| XLF | Financial Select Sector SPDR Fund | Financials |
| XLP | Consumer Staples Select Sector SPDR Fund | Consumer Staples |
| XLRE | Real Estate Select Sector SPDR Fund | Real Estate |
| IGV | iShares Expanded Tech-Software Sector ETF | Technology |
| ARKW | ARK Next Generation Internet ETF | Innovation |
| XLV | Health Care Select Sector SPDR Fund | Healthcare |
| SPY | SPDR S&P 500 ETF Trust | Broad Market |
| XLE | Energy Select Sector SPDR Fund | Energy |
| FNGS | MicroSectors FANG+ ETN | Tech Giants |
| QQQ | Invesco QQQ Trust | NASDAQ-100 |
| WCLD | WisdomTree Cloud Computing Fund | Cloud Computing |
| SMH | VanEck Semiconductor ETF | Semiconductors |
| IWM | iShares Russell 2000 ETF | Small Cap |
| ARKK | ARK Innovation ETF | Innovation |
| XLY | Consumer Discretionary Select Sector SPDR Fund | Consumer Discretionary |
| SOXX | iShares Semiconductor ETF | Semiconductors |
| ARKG | ARK Genomic Revolution ETF | Genomics |
| IBB | iShares NASDAQ Biotechnology ETF | Biotechnology |
| XBI | SPDR S&P Biotech ETF | Biotechnology |

### Cryptocurrencies
- **Bitcoin (BTC)**: Leading cryptocurrency
- **Solana (SOL)**: High-performance blockchain

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
1. **API Calls**: Fetch 10 years of historical data per asset
2. **Calculations**: Compute EMAs, SMAs, and percentage changes
3. **Rendering**: Display data with color coding and indicators
4. **Sorting**: Client-side sorting for instant responsiveness

### Architecture
- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Backend**: Python HTTP server for local hosting
- **Data Source**: Polygon.io REST API
- **Styling**: Responsive CSS with hover effects and animations

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the dashboard.

### Potential Enhancements
- Add more technical indicators (RSI, MACD, Bollinger Bands)
- Export data to CSV/Excel
- Historical performance charts
- Alert system for threshold breaches
- Portfolio tracking capabilities

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with assistance from Claude Code
- Market data provided by Polygon.io
- Inspired by professional trading dashboards

---

**⚡ Live Dashboard**: Run locally for real-time market insights!