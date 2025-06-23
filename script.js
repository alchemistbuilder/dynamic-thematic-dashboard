// Configuration
const API_KEY = 'WLIqlQJDbnkp9ke0IEtulkjvpfM7e9Nq'; // Maximum plan - unlimited calls
const FMP_API_KEY = 'm1HzjYgss43pOkJZcWTr2tuKvRvOPM4W'; // Premium FMP API key
const LIBERATION_DAY = new Date('2025-04-02');
const USE_POLYGON = true; // Set to false to use Yahoo Finance

// Sector Overview tickers (ETFs + Crypto)
const SECTOR_TICKERS = [
    'GLD',
    'FXI', 
    'KWEB',
    'XLU',
    'IHI',
    'XLI',
    'XLF',
    'XLP',
    'XLRE',
    'IGV',
    'ARKW',
    'XLV',
    'SPY',
    'XLE',
    'FNGS',
    'QQQ',
    'WCLD',
    'SMH',
    'IWM',
    'ARKK',
    'XLY',
    'SOXX',
    'ARKG',
    'IBB',
    'XBI'
];

// High Growth Momentum tickers (Individual stocks)
const GROWTH_TICKERS = [
    'PLTR',
    'MELI', 
    'CNSWF',
    'RBLX',
    'UBER',
    'CRWD',
    'CHWY',
    'SE',
    'CVNA',
    'SPOT',
    'GRAB',
    'HOOD',
    'DASH',
    'ROOT',
    'CPNG',
    'ZM',
    'SNOW',
    'PTON',
    'HIMS',
    'BABA',
    'TOST',
    'DOCU',
    'SOFI',
    'HUBS',
    'AFRM',
    'COIN',
    'SHOP',
    'ROKU',
    'ABNB',
    'CRCT',
    'TWLO',
    'APP',
    'OSCR',
    'OLO',
    'LMND',
    'CART',
    'SFIX',
    'FTDR',
    'SNAP',
    'DKNG',
    'LC',
    'FSLY',
    'MDB',
    'PINS',
    'ASTS',
    'ZETA',
    'CRCL',
    'RKLB'
];

// Crypto currencies (for sector overview only)
const CRYPTO_TICKERS = ['X:BTCUSD', 'X:SOLUSD'];

// Combined lists for backwards compatibility
const STOCK_TICKERS = SECTOR_TICKERS;

// Stock names mapping - exact ETF names from web research
const STOCK_NAMES = {
    'GLD': 'SPDR Gold Shares',
    'FXI': 'iShares China Large-Cap ETF',
    'KWEB': 'KraneShares CSI China Internet ETF',
    'XLU': 'Utilities Select Sector SPDR Fund',
    'IHI': 'iShares U.S. Medical Devices ETF',
    'XLI': 'Industrial Select Sector SPDR Fund',
    'XLF': 'Financial Select Sector SPDR Fund',
    'XLP': 'Consumer Staples Select Sector SPDR Fund',
    'XLRE': 'Real Estate Select Sector SPDR Fund',
    'IGV': 'iShares Expanded Tech-Software Sector ETF',
    'ARKW': 'ARK Next Generation Internet ETF',
    'XLV': 'Health Care Select Sector SPDR Fund',
    'SPY': 'SPDR S&P 500 ETF Trust',
    'XLE': 'Energy Select Sector SPDR Fund',
    'FNGS': 'MicroSectors FANG+ ETN',
    'QQQ': 'Invesco QQQ Trust',
    'WCLD': 'WisdomTree Cloud Computing Fund',
    'SMH': 'VanEck Semiconductor ETF',
    'IWM': 'iShares Russell 2000 ETF',
    'ARKK': 'ARK Innovation ETF',
    'XLY': 'Consumer Discretionary Select Sector SPDR Fund',
    'SOXX': 'iShares Semiconductor ETF',
    'ARKG': 'ARK Genomic Revolution ETF',
    'IBB': 'iShares NASDAQ Biotechnology ETF',
    'XBI': 'SPDR S&P Biotech ETF',
    'X:BTCUSD': 'Bitcoin',
    'X:SOLUSD': 'Solana'
};

// Growth stock names mapping
const GROWTH_NAMES = {
    'PLTR': 'Palantir Technologies Inc',
    'MELI': 'MercadoLibre Inc',
    'CNSWF': 'Coinsquare Ltd',
    'RBLX': 'Roblox Corporation',
    'UBER': 'Uber Technologies Inc',
    'CRWD': 'CrowdStrike Holdings Inc',
    'CHWY': 'Chewy Inc',
    'SE': 'Sea Limited',
    'CVNA': 'Carvana Co',
    'SPOT': 'Spotify Technology SA',
    'GRAB': 'Grab Holdings Limited',
    'HOOD': 'Robinhood Markets Inc',
    'DASH': 'DoorDash Inc',
    'ROOT': 'Root Inc',
    'CPNG': 'Coupang Inc',
    'ZM': 'Zoom Video Communications Inc',
    'SNOW': 'Snowflake Inc',
    'PTON': 'Peloton Interactive Inc',
    'HIMS': 'Hims & Hers Health Inc',
    'BABA': 'Alibaba Group Holding Limited',
    'TOST': 'Toast Inc',
    'DOCU': 'DocuSign Inc',
    'SOFI': 'SoFi Technologies Inc',
    'HUBS': 'HubSpot Inc',
    'AFRM': 'Affirm Holdings Inc',
    'COIN': 'Coinbase Global Inc',
    'SHOP': 'Shopify Inc',
    'ROKU': 'Roku Inc',
    'ABNB': 'Airbnb Inc',
    'CRCT': 'Cricut Inc',
    'TWLO': 'Twilio Inc',
    'APP': 'AppLovin Corporation',
    'OSCR': 'Oscar Health Inc',
    'OLO': 'Olo Inc',
    'LMND': 'Lemonade Inc',
    'CART': 'Maplebear Inc',
    'SFIX': 'Stitch Fix Inc',
    'FTDR': 'Frontdoor Inc',
    'SNAP': 'Snap Inc',
    'DKNG': 'DraftKings Inc',
    'LC': 'LendingClub Corporation',
    'FSLY': 'Fastly Inc',
    'MDB': 'MongoDB Inc',
    'PINS': 'Pinterest Inc',
    'ASTS': 'AST SpaceMobile Inc',
    'ZETA': 'Zeta Global Holdings Corp',
    'CRCL': 'Circle Internet Financial Ltd',
    'RKLB': 'Rocket Lab USA Inc'
};

class StockDashboard {
    constructor() {
        this.sectorData = new Map();
        this.growthData = new Map();
        this.currentTab = 'market-summary';
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.liveUpdateInterval = null;
        this.liveUpdateEnabled = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
    }

    get stockData() {
        if (this.currentTab === 'sector-overview') return this.sectorData;
        if (this.currentTab === 'high-growth') return this.growthData;
        return new Map(); // Market summary doesn't have its own data
    }

    bindEvents() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadData();
        });

        // Live price toggle
        const liveToggle = document.getElementById('liveToggle');
        liveToggle.addEventListener('click', () => {
            this.toggleLivePrices();
        });

        // Tab switching functionality
        document.querySelectorAll('.tab-btn').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                const tabId = tabBtn.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Initial sorting functionality will be set up in setupColumnDragAndDrop
        this.bindSortingEvents();

        // Add middle mouse button panning for all dashboard elements
        this.setupPanningForAllDashboards();
        
        // Add column drag and drop functionality
        this.setupColumnDragAndDrop();
    }

    setupPanningForAllDashboards() {
        const dashboards = document.querySelectorAll('.dashboard');
        
        dashboards.forEach(dashboard => {
            let isPanning = false;
            let startX = 0;
            let scrollLeft = 0;

            dashboard.addEventListener('mousedown', (e) => {
                // Check if middle mouse button is pressed (button === 1)
                if (e.button === 1) {
                    e.preventDefault();
                    isPanning = true;
                    dashboard.style.cursor = 'grabbing';
                    startX = e.pageX - dashboard.offsetLeft;
                    scrollLeft = dashboard.scrollLeft;
                }
            });

            dashboard.addEventListener('mousemove', (e) => {
                if (!isPanning) return;
                e.preventDefault();
                const x = e.pageX - dashboard.offsetLeft;
                const walk = (x - startX) * 2; // Scroll speed multiplier
                dashboard.scrollLeft = scrollLeft + walk; // Fixed: pull right goes right, pull left goes left
            });

            dashboard.addEventListener('mouseup', (e) => {
                if (e.button === 1) {
                    isPanning = false;
                    dashboard.style.cursor = 'default';
                }
            });

            dashboard.addEventListener('mouseleave', () => {
                isPanning = false;
                dashboard.style.cursor = 'default';
            });

            // Prevent default middle click behavior
            dashboard.addEventListener('auxclick', (e) => {
                if (e.button === 1) {
                    e.preventDefault();
                }
            });
        });
    }

    setupColumnDragAndDrop() {
        // Make all table headers draggable and add drag/drop functionality
        document.querySelectorAll('th.sortable').forEach(header => {
            // Make headers draggable
            header.draggable = true;
            header.classList.add('draggable');
            
            // Add drag indicator if not already present
            if (!header.querySelector('.drag-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'drag-indicator';
                header.insertBefore(indicator, header.firstChild);
            }
            
            // Drag start
            header.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', header.outerHTML);
                e.dataTransfer.setData('text/plain', header.dataset.column);
                header.classList.add('dragging');
                this.draggedElement = header;
                this.draggedIndex = Array.from(header.parentNode.children).indexOf(header);
            });
            
            // Drag end
            header.addEventListener('dragend', (e) => {
                header.classList.remove('dragging');
                document.querySelectorAll('th.drag-over').forEach(th => {
                    th.classList.remove('drag-over');
                });
                this.draggedElement = null;
            });
            
            // Drag over
            header.addEventListener('dragover', (e) => {
                if (this.draggedElement !== header) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    header.classList.add('drag-over');
                }
            });
            
            // Drag leave
            header.addEventListener('dragleave', (e) => {
                header.classList.remove('drag-over');
            });
            
            // Drop
            header.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedElement !== header) {
                    this.reorderColumns(this.draggedElement, header);
                }
                header.classList.remove('drag-over');
            });
        });
    }

    reorderColumns(draggedHeader, targetHeader) {
        const table = draggedHeader.closest('table');
        const headerRow = draggedHeader.parentNode;
        const allRows = table.querySelectorAll('tr');
        
        const draggedIndex = Array.from(headerRow.children).indexOf(draggedHeader);
        const targetIndex = Array.from(headerRow.children).indexOf(targetHeader);
        
        if (draggedIndex === targetIndex) return;
        
        // Reorder header
        if (draggedIndex < targetIndex) {
            headerRow.insertBefore(draggedHeader, targetHeader.nextSibling);
        } else {
            headerRow.insertBefore(draggedHeader, targetHeader);
        }
        
        // Reorder all body rows
        allRows.forEach(row => {
            if (row !== headerRow && row.children.length > draggedIndex) {
                const draggedCell = row.children[draggedIndex];
                const targetCell = row.children[targetIndex];
                
                if (draggedCell && targetCell) {
                    if (draggedIndex < targetIndex) {
                        row.insertBefore(draggedCell, targetCell.nextSibling);
                    } else {
                        row.insertBefore(draggedCell, targetCell);
                    }
                }
            }
        });
        
        // Re-setup event listeners for the reordered headers
        setTimeout(() => {
            this.setupColumnDragAndDrop();
            this.bindSortingEvents();
        }, 100);
    }

    bindSortingEvents() {
        // Re-bind sorting functionality after column reorder
        document.querySelectorAll('th.sortable').forEach(header => {
            // Remove existing listeners by cloning the element
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            // Add fresh event listener
            newHeader.addEventListener('click', (e) => {
                // Don't sort if we're dragging
                if (!e.target.closest('th').classList.contains('dragging')) {
                    const column = newHeader.dataset.column;
                    this.sortTable(column);
                }
            });
        });
    }

    switchTab(tabId) {
        // Update current tab
        this.currentTab = tabId;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        
        // Render appropriate data
        if (tabId === 'market-summary') {
            this.renderMarketSummary();
        } else {
            this.renderTable();
            
            // If no data loaded for this tab, load it
            if (this.stockData.size === 0) {
                this.loadData();
            }
        }
    }

    toggleLivePrices() {
        const liveToggle = document.getElementById('liveToggle');
        const liveStatus = liveToggle.querySelector('.live-status');
        
        this.liveUpdateEnabled = !this.liveUpdateEnabled;
        
        if (this.liveUpdateEnabled) {
            liveToggle.classList.add('active');
            
            if (this.isMarketOpen()) {
                liveStatus.textContent = 'ON';
            } else {
                liveStatus.textContent = 'ON (Market Closed)';
            }
            
            // Start live updates
            this.startLiveUpdates();
        } else {
            liveToggle.classList.remove('active');
            liveStatus.textContent = 'OFF';
            
            // Stop live updates
            this.stopLiveUpdates();
        }
    }

    isMarketOpen() {
        const now = new Date();
        const day = now.getDay();
        
        // Market closed on weekends
        if (day === 0 || day === 6) return false;
        
        // Get current time in ET
        const etTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
        const hours = etTime.getHours();
        const minutes = etTime.getMinutes();
        
        // Market hours: 9:30 AM - 4:00 PM ET
        if (hours < 9 || hours >= 16) return false;
        if (hours === 9 && minutes < 30) return false;
        
        return true;
    }

    startLiveUpdates() {
        // Update immediately
        this.updateLivePrices();
        
        // Then update every 30 seconds
        this.liveUpdateInterval = setInterval(() => {
            if (this.isMarketOpen()) {
                this.updateLivePrices();
            } else {
                // Show market closed message
                console.log('Market is closed - live updates paused');
            }
        }, 30000); // 30 seconds
    }

    stopLiveUpdates() {
        if (this.liveUpdateInterval) {
            clearInterval(this.liveUpdateInterval);
            this.liveUpdateInterval = null;
        }
    }

    async updateLivePrices() {
        console.log('Updating live prices...');
        
        // Get all tickers for current tab
        let tickers = [];
        if (this.currentTab === 'sector-overview') {
            tickers = [...SECTOR_TICKERS, ...CRYPTO_TICKERS];
        } else if (this.currentTab === 'high-growth') {
            tickers = GROWTH_TICKERS;
        } else {
            // Market summary - don't update live prices
            return;
        }
        
        // Fetch current quotes for all tickers
        const quotePromises = tickers.map(ticker => this.fetchLiveQuote(ticker));
        const quotes = await Promise.allSettled(quotePromises);
        
        // Update the data and refresh display
        quotes.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                const ticker = tickers[index];
                const existingData = this.stockData.get(ticker);
                
                if (existingData) {
                    // Update current price and recalculate 1D change
                    existingData.currentPrice = result.value.price;
                    existingData.changes['1d'] = result.value.changePercent;
                    
                    // Update the table cell if visible
                    this.updatePriceCell(ticker, result.value);
                }
            }
        });
    }

    async fetchLiveQuote(ticker) {
        try {
            // Use snapshot endpoint for real-time data
            const endpoint = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}?apikey=${API_KEY}`;
            
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.ticker) {
                const dayData = data.ticker.day;
                const prevDayData = data.ticker.prevDay;
                const min = data.ticker.min;
                
                // Use the most recent price available
                const currentPrice = min?.c || dayData?.c || prevDayData?.c || 0;
                const prevClose = prevDayData?.c || currentPrice;
                const changePercent = ((currentPrice - prevClose) / prevClose) * 100;
                
                return {
                    price: currentPrice,
                    changePercent: changePercent
                };
            } else {
                // Fallback for crypto or if snapshot fails
                if (ticker.startsWith('X:')) {
                    // For crypto, use the forex endpoint
                    const cryptoResponse = await fetch(
                        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apikey=${API_KEY}`
                    );
                    const cryptoData = await cryptoResponse.json();
                    const lastPrice = cryptoData.results?.[0]?.c || 0;
                    
                    return {
                        price: lastPrice,
                        changePercent: 0 // Would need previous day for accurate calculation
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error(`Error fetching live quote for ${ticker}:`, error);
            return null;
        }
    }

    updatePriceCell(ticker, quoteData) {
        // Find the row for this ticker
        const tbody = document.getElementById(
            this.currentTab === 'sector-overview' ? 'stockTableBody' : 'growthTableBody'
        );
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const tickerCell = row.querySelector('td.ticker-cell');
            if (tickerCell && tickerCell.textContent === ticker) {
                // Update price cell (4th column)
                const priceCell = row.cells[3];
                if (priceCell) {
                    priceCell.textContent = `$${quoteData.price.toFixed(2)}`;
                    priceCell.classList.add('price-updated');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        priceCell.classList.remove('price-updated');
                    }, 1000);
                }
                
                // Update 1D change cell (6th column)
                const dayChangeCell = row.cells[5];
                if (dayChangeCell) {
                    const changeClass = quoteData.changePercent >= 0 ? 'positive' : 'negative';
                    dayChangeCell.className = changeClass;
                    dayChangeCell.textContent = `${quoteData.changePercent >= 0 ? '+' : ''}${quoteData.changePercent.toFixed(2)}%`;
                }
            }
        });
    }

    async loadData() {
        const refreshBtn = document.getElementById('refreshBtn');
        const loading = document.getElementById('loading');
        
        refreshBtn.disabled = true;
        refreshBtn.textContent = 'Loading...';
        loading.style.display = 'block';

        try {
            await this.fetchAllStockData();
            if (this.currentTab === 'market-summary') {
                this.renderMarketSummary();
            } else {
                this.renderTable();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load stock data. Please try again.');
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.textContent = 'Refresh Data';
            loading.style.display = 'none';
        }
    }

    async fetchAllStockData() {
        // Fetch sector data (ETFs + crypto)
        await this.fetchDataForTab('sector-overview');
        
        // Fetch growth data (individual stocks)
        await this.fetchDataForTab('high-growth');
    }

    async fetchDataForTab(tabType) {
        let tickers, dataMap, tickerType;
        
        if (tabType === 'sector-overview') {
            tickers = [...SECTOR_TICKERS, ...CRYPTO_TICKERS];
            dataMap = this.sectorData;
            tickerType = 'sector';
        } else {
            tickers = GROWTH_TICKERS;
            dataMap = this.growthData;
            tickerType = 'growth';
        }
        
        console.log(`Fetching ${tickerType} data for tickers:`, tickers);
        
        if (USE_POLYGON) {
            // Polygon paid tier - fetch all in parallel for instant loading
            const promises = tickers.map(ticker => this.fetchStockData(ticker));
            const results = await Promise.allSettled(promises);
            
            let successCount = 0;
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    dataMap.set(tickers[index], result.value);
                    successCount++;
                } else {
                    console.error(`Failed to fetch data for ${tickers[index]}:`, result.reason || 'No data');
                }
            });
            
            console.log(`Successfully fetched ${tickerType} data for ${successCount}/${tickers.length} tickers`);
            
            // Fetch earnings data (individual stocks only, not ETFs/crypto)
            if (tabType === 'high-growth') {
                await this.fetchAllEarningsData(GROWTH_TICKERS, dataMap);
            }
        } else {
            // Yahoo Finance - sequential loading with delays
            let successCount = 0;
            for (let i = 0; i < STOCK_TICKERS.length; i++) {
                const ticker = STOCK_TICKERS[i];
                try {
                    const data = await this.fetchStockData(ticker);
                    if (data) {
                        this.stockData.set(ticker, data);
                        successCount++;
                        this.renderTable();
                    }
                    if (i < STOCK_TICKERS.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`Failed to fetch data for ${ticker}:`, error);
                }
            }
            
            console.log(`Successfully fetched data for ${successCount}/${STOCK_TICKERS.length} tickers`);
        }
    }

    async fetchStockData(ticker, retryCount = 0) {
        console.log(`Fetching data for ${ticker}... (attempt ${retryCount + 1})`);
        
        if (USE_POLYGON) {
            // Polygon.io API - paid tier with unlimited calls
            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            const polygonUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?adjusted=true&sort=asc&limit=5000&apikey=${API_KEY}`;
            
            try {
                const response = await fetch(polygonUrl);
                
                if (!response.ok) {
                    console.error(`HTTP ${response.status} for ${ticker}`);
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                
                if (!data.results || data.results.length === 0) {
                    console.error(`No results for ${ticker}:`, data);
                    throw new Error('No data available');
                }

                console.log(`Successfully got ${data.results.length} data points for ${ticker}`);
                return await this.processStockData(ticker, data.results);
            } catch (error) {
                console.error(`Error fetching ${ticker}:`, error);
                return null;
            }
        } else {
            // Yahoo Finance API with rate limiting
            const endTimestamp = Math.floor(Date.now() / 1000);
            const startTimestamp = Math.floor((Date.now() - 10 * 365 * 24 * 60 * 60 * 1000) / 1000);
            
            const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${startTimestamp}&period2=${endTimestamp}&interval=1d&includePrePost=false`;
            
            try {
                const response = await fetch(yahooUrl);
                
                if (response.status === 429 && retryCount < 3) {
                    console.log(`Rate limited for ${ticker}, retrying in ${2 ** retryCount} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, (2 ** retryCount) * 1000));
                    return this.fetchStockData(ticker, retryCount + 1);
                }
                
                if (!response.ok) {
                    console.error(`HTTP ${response.status} for ${ticker}`);
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                
                if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
                    console.error(`No chart data for ${ticker}:`, data);
                    throw new Error('No chart data available');
                }

                const result = data.chart.result[0];
                if (!result.timestamp || !result.indicators.quote[0].close) {
                    console.error(`Invalid data structure for ${ticker}:`, result);
                    throw new Error('Invalid data structure');
                }

                // Convert Yahoo Finance format to our format
                const historicalData = result.timestamp.map((timestamp, index) => ({
                    t: timestamp * 1000, // Convert to milliseconds
                    c: result.indicators.quote[0].close[index],
                    o: result.indicators.quote[0].open[index],
                    h: result.indicators.quote[0].high[index],
                    l: result.indicators.quote[0].low[index],
                    v: result.indicators.quote[0].volume[index]
                })).filter(point => point.c !== null);

                console.log(`Successfully got ${historicalData.length} data points for ${ticker}`);
                return await this.processStockData(ticker, historicalData);
            } catch (error) {
                console.error(`Error fetching ${ticker}:`, error);
                return null;
            }
        }
    }

    async processStockData(ticker, historicalData) {
        const sortedData = historicalData.sort((a, b) => a.t - b.t);
        const currentPrice = sortedData[sortedData.length - 1].c;
        
        // Calculate percentage changes
        const changes = this.calculatePercentageChanges(sortedData, currentPrice);
        
        // Calculate Liberation Day change
        const liberationChange = this.calculateLiberationDayChange(sortedData, currentPrice);
        
        // Calculate moving averages
        const movingAverages = this.calculateMovingAverages(sortedData);
        
        // Calculate RSI indicators
        const rsiData = this.calculateRSI(sortedData);
        
        // Calculate consecutive up days
        const consecutiveUpDays = this.calculateConsecutiveUpDays(sortedData);
        
        // Calculate 52-week high
        const week52High = this.calculate52WeekHigh(sortedData);
        
        // Calculate comparison indicators
        const comparisons = this.calculateComparisons(currentPrice, movingAverages, week52High);
        
        // Note: Earnings data removed - not available through current API
        
        // Determine trends
        const shortTermTrend = this.determineShortTermTrend(movingAverages);
        const longTermTrend = this.determineLongTermTrend(movingAverages);

        return {
            ticker,
            name: STOCK_NAMES[ticker] || GROWTH_NAMES[ticker] || ticker,
            currentPrice,
            liberationChange,
            changes,
            movingAverages,
            rsiData,
            consecutiveUpDays,
            week52High,
            comparisons,
            shortTermTrend,
            longTermTrend
        };
    }

    calculatePercentageChanges(data, currentPrice) {
        const now = Date.now();
        const currentYear = new Date().getFullYear();
        const ytdStart = new Date(currentYear, 0, 1).getTime(); // January 1st of current year
        
        const periods = {
            'ytd': null, // Will calculate separately
            '1d': 1,
            '1w': 7,
            '2w': 14,
            '1m': 30,
            '2m': 60,
            '3m': 90,
            '6m': 180,
            '1y': 365
        };

        const changes = {};
        
        // Calculate YTD separately
        const ytdPrice = this.findClosestPrice(data, ytdStart);
        if (ytdPrice) {
            changes['ytd'] = ((currentPrice - ytdPrice) / ytdPrice) * 100;
        } else {
            changes['ytd'] = null;
        }
        
        // Calculate other periods
        Object.entries(periods).forEach(([period, days]) => {
            if (days !== null) {
                const targetDate = now - (days * 24 * 60 * 60 * 1000);
                const historicalPrice = this.findClosestPrice(data, targetDate);
                
                if (historicalPrice) {
                    changes[period] = ((currentPrice - historicalPrice) / historicalPrice) * 100;
                } else {
                    changes[period] = null;
                }
            }
        });

        return changes;
    }

    calculateLiberationDayChange(data, currentPrice) {
        const liberationPrice = this.findClosestPrice(data, LIBERATION_DAY.getTime());
        if (liberationPrice) {
            return ((currentPrice - liberationPrice) / liberationPrice) * 100;
        }
        return null;
    }

    findClosestPrice(data, targetTimestamp) {
        let closest = null;
        let minDiff = Infinity;
        
        for (const point of data) {
            const diff = Math.abs(point.t - targetTimestamp);
            if (diff < minDiff && diff < 30 * 24 * 60 * 60 * 1000) { // Within 30 days
                minDiff = diff;
                closest = point.c;
            }
        }
        
        return closest;
    }

    calculateMovingAverages(data) {
        const prices = data.map(d => d.c);
        
        // Get the most recent values for display
        const latestEMAs = this.calculateEMAsSeries(prices);
        
        return {
            ema8: latestEMAs.ema8,
            ema13: latestEMAs.ema13,
            ema21: latestEMAs.ema21,
            sma50: this.calculateSMA(prices, 50),
            sma100: this.calculateSMA(prices, 100),
            sma200: this.calculateSMA(prices, 200)
        };
    }

    calculateSMA(prices, period) {
        if (prices.length < period) return null;
        const recentPrices = prices.slice(-period);
        return recentPrices.reduce((sum, price) => sum + price, 0) / period;
    }

    calculateEMA(prices, period) {
        if (prices.length < period) return null;
        
        const multiplier = 2 / (period + 1);
        let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
        
        for (let i = period; i < prices.length; i++) {
            ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
        }
        
        return ema;
    }

    calculateEMAsSeries(prices) {
        if (prices.length < 21) return { ema8: null, ema13: null, ema21: null };
        
        // Calculate all EMAs
        const ema8 = this.calculateEMA(prices, 8);
        const ema13 = this.calculateEMA(prices, 13);
        const ema21 = this.calculateEMA(prices, 21);
        
        return { ema8, ema13, ema21 };
    }

    calculateRSI(data) {
        const closes = data.map(d => d.c);
        
        return {
            rsi14: this.calculateRSIPeriod(closes, 14),
            rsi30: this.calculateRSIPeriod(closes, 30)
        };
    }

    calculateRSIPeriod(closes, period) {
        if (closes.length < period + 1) return null;
        
        let gains = [];
        let losses = [];
        
        // Calculate gains and losses
        for (let i = 1; i < closes.length; i++) {
            const change = closes[i] - closes[i - 1];
            gains.push(change > 0 ? change : 0);
            losses.push(change < 0 ? Math.abs(change) : 0);
        }
        
        // Calculate initial average gain and loss
        let avgGain = gains.slice(0, period).reduce((sum, gain) => sum + gain, 0) / period;
        let avgLoss = losses.slice(0, period).reduce((sum, loss) => sum + loss, 0) / period;
        
        // Calculate RSI using smoothed averages
        for (let i = period; i < gains.length; i++) {
            avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
            avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;
        }
        
        if (avgLoss === 0) return 100; // Avoid division by zero
        
        const rs = avgGain / avgLoss;
        const rsi = 100 - (100 / (1 + rs));
        
        return rsi;
    }

    calculateConsecutiveUpDays(data) {
        if (data.length < 2) return 0;
        
        // Sort data by timestamp to ensure chronological order
        const sortedData = data.sort((a, b) => a.t - b.t);
        
        let consecutiveUpDays = 0;
        
        // Start from the most recent day and work backwards
        for (let i = sortedData.length - 1; i > 0; i--) {
            const currentClose = sortedData[i].c;
            const previousClose = sortedData[i - 1].c;
            
            // If current day is up (green candle)
            if (currentClose > previousClose) {
                consecutiveUpDays++;
            } else {
                // Stop counting when we hit a down day
                break;
            }
        }
        
        return consecutiveUpDays;
    }

    calculate52WeekHigh(data) {
        const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
        const recentData = data.filter(point => point.t > oneYearAgo);
        
        if (recentData.length === 0) return null;
        
        return Math.max(...recentData.map(point => point.h)); // Use high prices
    }

    calculateComparisons(currentPrice, mas, week52High) {
        const { sma50, sma100, sma200, ema8, ema13, ema21 } = mas;
        
        // Calculate percentage differences from moving averages
        const pct50SMA = sma50 ? ((currentPrice - sma50) / sma50) * 100 : null;
        const pct100SMA = sma100 ? ((currentPrice - sma100) / sma100) * 100 : null;
        const pct200SMA = sma200 ? ((currentPrice - sma200) / sma200) * 100 : null;
        
        const pct8EMA = ema8 ? ((currentPrice - ema8) / ema8) * 100 : null;
        const pct13EMA = ema13 ? ((currentPrice - ema13) / ema13) * 100 : null;
        const pct21EMA = ema21 ? ((currentPrice - ema21) / ema21) * 100 : null;
        
        // SMA trend logic: =IF(AND(T5<0,U5<0,V5<0),"BEARISH",IF(AND(E5>AE5,E5>AF5,E5>AG5,AE5>AF5,AF5>AG5),"BULLISH",IF(AND(T5<0,U5>0,U5<0.1,W5>0),"At Support",IF(AND(T5>0,U5>0,V5>0),"Healthy","zFALSE"))))
        let smaStackingTrend = null;
        if (pct50SMA !== null && pct100SMA !== null && pct200SMA !== null && sma50 && sma100 && sma200) {
            if (pct50SMA < 0 && pct100SMA < 0 && pct200SMA < 0) {
                smaStackingTrend = "BEARISH";
            } else if (currentPrice > sma50 && currentPrice > sma100 && currentPrice > sma200 && 
                       sma50 > sma100 && sma100 > sma200) {
                smaStackingTrend = "BULLISH";
            } else if (pct50SMA < 0 && pct100SMA > 0 && pct100SMA < 0.1 && pct200SMA > 0) {
                smaStackingTrend = "At Support";
            } else if (pct50SMA > 0 && pct100SMA > 0 && pct200SMA > 0) {
                smaStackingTrend = "Healthy";
            } else {
                smaStackingTrend = "FALSE";
            }
        }
        
        // Enhanced EMA trend logic with comprehensive classifications
        let emaStackingTrend = null;
        if (pct8EMA !== null && pct13EMA !== null && pct21EMA !== null && ema8 && ema13 && ema21) {
            const isEmaStacked = ema8 > ema13 && ema13 > ema21;
            const isEmaInverted = ema8 < ema13 && ema13 < ema21;
            const priceAbove8 = currentPrice > ema8;
            const priceAbove13 = currentPrice > ema13;
            const priceAbove21 = currentPrice > ema21;
            
            // Primary conditions
            if (pct8EMA < 0 && pct13EMA < 0 && pct21EMA < 0) {
                emaStackingTrend = "ST BEARISH";
            } else if (priceAbove8 && priceAbove13 && priceAbove21 && isEmaStacked) {
                emaStackingTrend = "ST BULLISH";
            }
            // Additional logic for N/A cases
            else if (isEmaStacked) {
                // EMAs are properly stacked regardless of price position
                emaStackingTrend = "EMA Bullish";
            } else if (isEmaInverted) {
                // EMAs are inverted (bearish structure)
                emaStackingTrend = "EMA Bearish";
            } else if (priceAbove21 && !priceAbove8 && !priceAbove13) {
                // Price above 21 EMA but below 8 and 13
                emaStackingTrend = "Uptrend Maintained";
            } else if (priceAbove8 && priceAbove13 && !priceAbove21) {
                // Price above short EMAs but below long EMA
                emaStackingTrend = "Breaking Out";
            } else if (priceAbove8 && !priceAbove13 && !priceAbove21) {
                // Price only above shortest EMA
                emaStackingTrend = "Early Recovery";
            } else if (!priceAbove8 && priceAbove13 && priceAbove21) {
                // Price above longer EMAs but below shortest
                emaStackingTrend = "Short Pullback";
            } else if (priceAbove8 && !priceAbove13 && priceAbove21) {
                // Price above 8 and 21 but not 13 (mixed signals)
                emaStackingTrend = "Mixed Signals";
            } else if (!priceAbove8 && !priceAbove13 && priceAbove21) {
                // Price only above longest EMA
                emaStackingTrend = "Support Hold";
            } else if (!priceAbove8 && priceAbove13 && !priceAbove21) {
                // Price only above middle EMA
                emaStackingTrend = "Mid Recovery";
            } else {
                // Any remaining edge cases
                emaStackingTrend = "Transitioning";
            }
        }
        
        return {
            above50SMA: sma50 ? currentPrice > sma50 : null,
            above100SMA: sma100 ? currentPrice > sma100 : null,
            above200SMA: sma200 ? currentPrice > sma200 : null,
            sma50Above100Above200: smaStackingTrend,
            above8EMA: ema8 ? currentPrice > ema8 : null,
            above13EMA: ema13 ? currentPrice > ema13 : null,
            above21EMA: ema21 ? currentPrice > ema21 : null,
            ema8Above13Above21: emaStackingTrend,
            deltaFrom52WeekHigh: week52High ? ((currentPrice - week52High) / week52High) * 100 : null
        };
    }

    determineShortTermTrend(mas) {
        const { ema8, ema13, ema21 } = mas;
        if (ema8 && ema13 && ema21) {
            return (ema8 > ema13 && ema13 > ema21) ? 'ST BULLISH' : 'ST BEARISH';
        }
        return 'N/A';
    }

    determineLongTermTrend(mas) {
        const { sma50, sma100, sma200 } = mas;
        if (sma50 && sma100 && sma200) {
            if (sma50 > sma100 && sma100 > sma200) return 'BULLISH';
            if (sma50 < sma100 && sma100 < sma200) return 'BEARISH';
            return 'Healthy';
        }
        return 'N/A';
    }

    sortTable(column) {
        // Toggle sort direction if same column, otherwise reset to ascending
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update header classes
        document.querySelectorAll('th.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            if (header.dataset.column === column) {
                header.classList.add(`sort-${this.sortDirection}`);
            }
        });

        this.renderTable();
    }

    getSortValue(data, column) {
        switch (column) {
            case 'ticker':
                return data.ticker;
            case 'name':
                return data.name;
            case 'liberationChange':
                return data.liberationChange || -Infinity;
            case 'currentPrice':
                return data.currentPrice || 0;
            case 'ytd':
            case '1d':
            case '1w':
            case '2w':
            case '1m':
            case '2m':
            case '3m':
            case '6m':
            case '1y':
                return data.changes[column] || -Infinity;
            case 'deltaFrom52WeekHigh':
                return data.comparisons.deltaFrom52WeekHigh || -Infinity;
            case 'above50SMA':
            case 'above100SMA':
            case 'above200SMA':
            case 'above8EMA':
            case 'above13EMA':
            case 'above21EMA':
                const boolValue = data.comparisons[column];
                return boolValue === null ? -1 : (boolValue ? 1 : 0);
            case 'sma50Above100Above200':
                const smaTrendValue = data.comparisons[column];
                if (smaTrendValue === null) return -1;
                if (typeof smaTrendValue === 'string') {
                    // SMA trend ranking
                    const smaRankings = {
                        'BULLISH': 4,
                        'Healthy': 3,
                        'At Support': 2,
                        'FALSE': 1,
                        'BEARISH': 0
                    };
                    return smaRankings[smaTrendValue] || 0;
                }
                return smaTrendValue ? 1 : 0;
            case 'ema8Above13Above21':
                const emaTrendValue = data.comparisons[column];
                if (emaTrendValue === null) return -1;
                if (typeof emaTrendValue === 'string') {
                    // Comprehensive EMA trend ranking (higher = better)
                    const emaRankings = {
                        'ST BULLISH': 12,
                        'EMA Bullish': 11,
                        'Uptrend Maintained': 10,
                        'Breaking Out': 9,
                        'Early Recovery': 8,
                        'Short Pullback': 7,
                        'Support Hold': 6,
                        'Mid Recovery': 5,
                        'Mixed Signals': 4,
                        'Transitioning': 3,
                        'EMA Bearish': 2,
                        'ST BEARISH': 1
                    };
                    return emaRankings[emaTrendValue] || 0;
                }
                return emaTrendValue ? 1 : 0;
            case 'sma50':
            case 'sma100':
            case 'sma200':
            case 'ema8':
            case 'ema13':
            case 'ema21':
                return data.movingAverages[column] || 0;
            case 'rsi14':
                return data.rsiData.rsi14 || 50; // Default to neutral RSI
            case 'rsi30':
                return data.rsiData.rsi30 || 50; // Default to neutral RSI
            case 'nextEarnings':
                if (!data.nextEarnings || data.nextEarnings === 'N/A') return new Date('9999-12-31'); // Sort N/A to end
                return new Date(data.nextEarnings);
            case 'daysToEarnings':
                if (!data.daysToEarnings || data.daysToEarnings === 'N/A') return 9999; // Sort N/A to end
                return data.daysToEarnings;
            case 'consecutiveUpDays':
                return data.consecutiveUpDays || 0;
            default:
                return 0;
        }
    }

    renderTable() {
        const tbodyId = this.currentTab === 'sector-overview' ? 'stockTableBody' : 'growthTableBody';
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '';

        // Convert Map to Array for sorting
        let stockArray = Array.from(this.stockData.entries())
            .map(([ticker, data]) => data)
            .filter(data => data !== null);

        // Sort if column is selected
        if (this.sortColumn) {
            stockArray.sort((a, b) => {
                const aValue = this.getSortValue(a, this.sortColumn);
                const bValue = this.getSortValue(b, this.sortColumn);
                
                let comparison = 0;
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue);
                } else {
                    comparison = aValue - bValue;
                }

                return this.sortDirection === 'asc' ? comparison : -comparison;
            });
        }

        stockArray.forEach(data => {
            const row = document.createElement('tr');
            row.innerHTML = this.createRowHTML(data);
            tbody.appendChild(row);
        });

        // Update side panel with rankings
        this.updateSidePanel(stockArray);
    }

    calculateBullishScore(data) {
        let score = 0;
        
        // SMA trend scoring
        const smaTrend = data.comparisons.sma50Above100Above200;
        if (smaTrend === 'BULLISH') score += 40;
        else if (smaTrend === 'Healthy') score += 30;
        else if (smaTrend === 'At Support') score += 20;
        
        // EMA trend scoring
        const emaTrend = data.comparisons.ema8Above13Above21;
        if (emaTrend === 'ST BULLISH') score += 40;
        else if (emaTrend === 'EMA Bullish') score += 35;
        else if (emaTrend === 'Uptrend Maintained') score += 30;
        else if (emaTrend === 'Breaking Out') score += 25;
        else if (emaTrend === 'Early Recovery') score += 20;
        
        // Performance scoring (Liberation Day weighted 2x)
        const libChange = data.liberationChange || 0;
        const ytdChange = data.changes.ytd || 0;
        score += (libChange * 0.5) + (ytdChange * 0.25);
        
        // Above moving averages bonus
        if (data.comparisons.above50SMA) score += 10;
        if (data.comparisons.above100SMA) score += 10;
        if (data.comparisons.above200SMA) score += 10;
        
        // Consecutive up days momentum bonus
        const upDays = data.consecutiveUpDays || 0;
        if (upDays >= 5) score += 25;      // 5+ days: Strong momentum
        else if (upDays >= 3) score += 15; // 3-4 days: Good momentum  
        else if (upDays >= 1) score += 5;  // 1-2 days: Some momentum
        
        return score;
    }

    calculateBearishScore(data) {
        let score = 0;
        
        // Negative trend indicators
        const smaTrend = data.comparisons.sma50Above100Above200;
        if (smaTrend === 'BEARISH') score += 40;
        else if (smaTrend === 'FALSE') score += 20;
        
        const emaTrend = data.comparisons.ema8Above13Above21;
        if (emaTrend === 'ST BEARISH') score += 40;
        else if (emaTrend === 'EMA Bearish') score += 30;
        
        // Negative performance
        const libChange = data.liberationChange || 0;
        const ytdChange = data.changes.ytd || 0;
        if (libChange < 0) score += Math.abs(libChange) * 0.5;
        if (ytdChange < 0) score += Math.abs(ytdChange) * 0.25;
        
        // Below moving averages penalty
        if (!data.comparisons.above50SMA) score += 10;
        if (!data.comparisons.above100SMA) score += 10;
        if (!data.comparisons.above200SMA) score += 10;
        
        // Distance from 52-week high
        const delta52w = data.comparisons.deltaFrom52WeekHigh || 0;
        if (delta52w < -20) score += Math.abs(delta52w) * 0.3;
        
        return score;
    }

    calculatePerformanceScore(data) {
        const libChange = data.liberationChange || 0;
        const ytdChange = data.changes.ytd || 0;
        const oneMonthChange = data.changes['1m'] || 0;
        
        return (libChange * 0.4) + (ytdChange * 0.4) + (oneMonthChange * 0.2);
    }

    calculateBreakoutScore(data) {
        let score = 0;
        
        // Look for breakout patterns
        const emaTrend = data.comparisons.ema8Above13Above21;
        if (emaTrend === 'Breaking Out') score += 40;
        else if (emaTrend === 'Early Recovery') score += 30;
        else if (emaTrend === 'Uptrend Maintained') score += 25;
        
        // Recent momentum
        const oneWeekChange = data.changes['1w'] || 0;
        const twoWeekChange = data.changes['2w'] || 0;
        
        if (oneWeekChange > 5) score += 20;
        if (twoWeekChange > 10) score += 15;
        
        // Volume consideration (if available in future)
        // Near 52-week high consideration
        const delta52w = data.comparisons.deltaFrom52WeekHigh || -100;
        if (delta52w > -5) score += 20; // Within 5% of 52-week high
        
        return score;
    }

    updateSidePanel(stockArray) {
        // Calculate scores for all stocks
        const scoredStocks = stockArray.map(data => ({
            ...data,
            bullishScore: this.calculateBullishScore(data),
            bearishScore: this.calculateBearishScore(data),
            performanceScore: this.calculatePerformanceScore(data),
            breakoutScore: this.calculateBreakoutScore(data)
        }));

        // Get appropriate list IDs based on current tab
        const suffix = this.currentTab === 'sector-overview' ? '' : 'Growth';
        
        // Top 5 Most Bullish
        const topBullish = scoredStocks
            .sort((a, b) => b.bullishScore - a.bullishScore)
            .slice(0, 5);
        this.populateStockList(`bullishList${suffix}`, topBullish, 'bullish');

        // Top 5 Most Bearish for all tabs
        const topBearish = scoredStocks
            .sort((a, b) => b.bearishScore - a.bearishScore)
            .slice(0, 5);
        this.populateStockList(`bearishList${suffix}`, topBearish, 'bearish');

        // Top 5 Best Performers for all tabs
        const topPerformers = scoredStocks
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, 5);
        this.populateStockList(`performersList${suffix}`, topPerformers, 'performer');

        // Top 5 Breakout Candidates for all tabs
        const topBreakouts = scoredStocks
            .sort((a, b) => b.breakoutScore - a.breakoutScore)
            .slice(0, 5);
        this.populateStockList(`breakoutList${suffix}`, topBreakouts, 'breakout');
    }

    populateStockList(containerId, stocks, type) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        stocks.forEach(stock => {
            const card = document.createElement('div');
            card.className = `stock-card ${type}`;
            
            let signal = '';
            let performance = '';
            
            if (type === 'bullish') {
                signal = `${stock.comparisons.sma50Above100Above200} • ${stock.comparisons.ema8Above13Above21}`;
                performance = `Lib: ${this.formatPercent(stock.liberationChange)} | YTD: ${this.formatPercent(stock.changes.ytd)}`;
            } else if (type === 'bearish') {
                signal = `${stock.comparisons.sma50Above100Above200} • ${stock.comparisons.ema8Above13Above21}`;
                performance = `Lib: ${this.formatPercent(stock.liberationChange)} | 52W: ${this.formatPercent(stock.comparisons.deltaFrom52WeekHigh)}`;
            } else if (type === 'performer') {
                signal = `YTD: ${this.formatPercent(stock.changes.ytd)} • 1M: ${this.formatPercent(stock.changes['1m'])}`;
                performance = `Liberation: ${this.formatPercent(stock.liberationChange)}`;
            } else if (type === 'breakout') {
                signal = stock.comparisons.ema8Above13Above21;
                performance = `1W: ${this.formatPercent(stock.changes['1w'])} | 2W: ${this.formatPercent(stock.changes['2w'])}`;
            }

            card.innerHTML = `
                <div class="stock-ticker">${stock.ticker}</div>
                <div class="stock-signal">${signal}</div>
                <div class="stock-performance">
                    <span style="color: rgba(255,255,255,0.8);">${performance}</span>
                </div>
            `;

            // Add click handler to scroll to stock in main table
            card.addEventListener('click', () => {
                this.scrollToStock(stock.ticker);
            });

            container.appendChild(card);
        });
    }

    scrollToStock(ticker) {
        // Find the row with this ticker and scroll to it
        const rows = document.querySelectorAll('#stockTableBody tr');
        rows.forEach(row => {
            const tickerCell = row.querySelector('.ticker-cell');
            if (tickerCell && tickerCell.textContent === ticker) {
                row.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                // Highlight the row briefly
                row.style.backgroundColor = 'rgba(0, 212, 170, 0.2)';
                setTimeout(() => {
                    row.style.backgroundColor = '';
                }, 2000);
            }
        });
    }

    formatPercent(value) {
        if (value === null || value === undefined) return 'N/A';
        return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
    }

    formatRSI(value) {
        if (value === null || value === undefined) return 'N/A';
        return value.toFixed(0);
    }

    getRSIClass(value) {
        if (value === null || value === undefined) return '';
        if (value >= 70) return 'negative'; // Overbought (red)
        if (value <= 30) return 'positive'; // Oversold (green - potential buying opportunity)
        return ''; // Neutral
    }


    createRowHTML(data) {
        const formatPercent = (value) => {
            if (value === null || value === undefined) return 'N/A';
            const formatted = value.toFixed(1) + '%';
            const className = value >= 0 ? 'positive' : 'negative';
            return `<span class="${className}">${formatted}</span>`;
        };

        const formatPrice = (value) => {
            if (value === null || value === undefined) return 'N/A';
            return value.toFixed(2);
        };

        const formatBoolean = (value) => {
            if (value === null || value === undefined) return 'N/A';
            if (typeof value === 'string') return value; // For trend strings like "BULLISH", "ST BEARISH"
            return value ? '✓' : '✗';
        };

        const getBooleanClass = (value) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'string') {
                // Positive/Bullish classifications
                if (['BULLISH', 'ST BULLISH', 'Healthy', 'EMA Bullish', 'Uptrend Maintained', 
                     'Breaking Out', 'Early Recovery'].includes(value)) return 'positive';
                
                // Negative/Bearish classifications  
                if (['BEARISH', 'ST BEARISH', 'EMA Bearish', 'FALSE'].includes(value)) return 'negative';
                
                // Neutral/Cautionary classifications
                if (['At Support', 'Short Pullback', 'Support Hold', 'Mid Recovery', 
                     'Mixed Signals', 'Transitioning'].includes(value)) return 'healthy';
                
                return '';
            }
            return value ? 'positive' : 'negative';
        };

        return `
            <td class="ticker-cell">${data.ticker}</td>
            <td class="name-cell">${data.name}</td>
            <td>${formatPercent(data.liberationChange)}</td>
            <td class="price-cell">${formatPrice(data.currentPrice)}</td>
            <td>${formatPercent(data.changes['ytd'])}</td>
            <td>${formatPercent(data.changes['1d'])}</td>
            <td>${formatPercent(data.changes['1w'])}</td>
            <td>${formatPercent(data.changes['2w'])}</td>
            <td>${formatPercent(data.changes['1m'])}</td>
            <td>${formatPercent(data.changes['2m'])}</td>
            <td>${formatPercent(data.changes['3m'])}</td>
            <td>${formatPercent(data.changes['6m'])}</td>
            <td>${formatPercent(data.changes['1y'])}</td>
            <td>${formatPercent(data.comparisons.deltaFrom52WeekHigh)}</td>
            <td class="${getBooleanClass(data.comparisons.above50SMA)}">${formatBoolean(data.comparisons.above50SMA)}</td>
            <td class="${getBooleanClass(data.comparisons.above100SMA)}">${formatBoolean(data.comparisons.above100SMA)}</td>
            <td class="${getBooleanClass(data.comparisons.above200SMA)}">${formatBoolean(data.comparisons.above200SMA)}</td>
            <td class="${getBooleanClass(data.comparisons.sma50Above100Above200)}">${formatBoolean(data.comparisons.sma50Above100Above200)}</td>
            <td class="${getBooleanClass(data.comparisons.above8EMA)}">${formatBoolean(data.comparisons.above8EMA)}</td>
            <td class="${getBooleanClass(data.comparisons.above13EMA)}">${formatBoolean(data.comparisons.above13EMA)}</td>
            <td class="${getBooleanClass(data.comparisons.above21EMA)}">${formatBoolean(data.comparisons.above21EMA)}</td>
            <td class="${getBooleanClass(data.comparisons.ema8Above13Above21)}">${formatBoolean(data.comparisons.ema8Above13Above21)}</td>
            <td>${formatPrice(data.movingAverages.sma50)}</td>
            <td>${formatPrice(data.movingAverages.sma100)}</td>
            <td>${formatPrice(data.movingAverages.sma200)}</td>
            <td>${formatPrice(data.movingAverages.ema8)}</td>
            <td>${formatPrice(data.movingAverages.ema13)}</td>
            <td>${formatPrice(data.movingAverages.ema21)}</td>
            <td class="${this.getRSIClass(data.rsiData.rsi14)}">${this.formatRSI(data.rsiData.rsi14)}</td>
            <td class="${this.getRSIClass(data.rsiData.rsi30)}">${this.formatRSI(data.rsiData.rsi30)}</td>
            <td>${this.formatEarningsDate(data.nextEarnings)}</td>
            <td class="${this.getDaysToEarningsClass(data.daysToEarnings)}">${this.formatDaysToEarnings(data.daysToEarnings)}</td>
            <td class="${this.getConsecutiveUpDaysClass(data.consecutiveUpDays)}">${data.consecutiveUpDays}</td>
        `;
    }

    renderMarketSummary() {
        // Ensure both datasets are loaded
        if (this.sectorData.size === 0 || this.growthData.size === 0) {
            // Load data if not available
            this.loadData();
            return;
        }

        // Get scored stocks for both datasets
        const sectorArray = Array.from(this.sectorData.values()).filter(data => data !== null);
        const growthArray = Array.from(this.growthData.values()).filter(data => data !== null);

        const scoredSector = sectorArray.map(data => ({
            ...data,
            bullishScore: this.calculateBullishScore(data),
            bearishScore: this.calculateBearishScore(data),
            performanceScore: this.calculatePerformanceScore(data)
        }));

        const scoredGrowth = growthArray.map(data => ({
            ...data,
            bullishScore: this.calculateBullishScore(data),
            bearishScore: this.calculateBearishScore(data),
            performanceScore: this.calculatePerformanceScore(data)
        }));

        // Populate sector summaries (Top 5)
        const topSectorBullish = scoredSector
            .sort((a, b) => b.bullishScore - a.bullishScore)
            .slice(0, 5);
        this.populateStockList('sectorBullishSummary', topSectorBullish, 'bullish');

        const topSectorBearish = scoredSector
            .sort((a, b) => b.bearishScore - a.bearishScore)
            .slice(0, 5);
        this.populateStockList('sectorBearishSummary', topSectorBearish, 'bearish');

        // Populate growth summaries (Top 5)
        const topGrowthBullish = scoredGrowth
            .sort((a, b) => b.bullishScore - a.bullishScore)
            .slice(0, 5);
        this.populateStockList('growthBullishSummary', topGrowthBullish, 'bullish');

        const topGrowthBearish = scoredGrowth
            .sort((a, b) => b.bearishScore - a.bearishScore)
            .slice(0, 5);
        this.populateStockList('growthBearishSummary', topGrowthBearish, 'bearish');

        // Overall best performers (combine both datasets)
        const allScored = [...scoredSector, ...scoredGrowth];
        const overallPerformers = allScored
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, 5);
        this.populateStockList('overallPerformersSummary', overallPerformers, 'performer');

        // Update statistics
        this.updateMarketStats(scoredSector, scoredGrowth);
    }

    updateMarketStats(sectorData, growthData) {
        // Sector stats
        const sectorBullish = sectorData.filter(s => s.bullishScore > 50).length;
        const sectorTotal = sectorData.length;
        const sectorAvgPerf = sectorData.reduce((sum, s) => sum + (s.liberationChange || 0), 0) / sectorTotal;

        document.getElementById('sectorStats').innerHTML = `
            <div>${sectorBullish}/${sectorTotal} Bullish</div>
            <div style="font-size: 0.9rem; color: ${sectorAvgPerf >= 0 ? '#00d4aa' : '#ef5350'}">
                Avg: ${sectorAvgPerf >= 0 ? '+' : ''}${sectorAvgPerf.toFixed(1)}%
            </div>
        `;

        // Growth stats
        const growthBullish = growthData.filter(s => s.bullishScore > 50).length;
        const growthTotal = growthData.length;
        const growthAvgPerf = growthData.reduce((sum, s) => sum + (s.liberationChange || 0), 0) / growthTotal;

        document.getElementById('growthStats').innerHTML = `
            <div>${growthBullish}/${growthTotal} Bullish</div>
            <div style="font-size: 0.9rem; color: ${growthAvgPerf >= 0 ? '#00d4aa' : '#ef5350'}">
                Avg: ${growthAvgPerf >= 0 ? '+' : ''}${growthAvgPerf.toFixed(1)}%
            </div>
        `;

        // Momentum stats (consecutive up days)
        const allData = [...sectorData, ...growthData];
        const strongMomentum = allData.filter(s => (s.consecutiveUpDays || 0) >= 3).length;
        const totalStocks = allData.length;

        document.getElementById('momentumStats').innerHTML = `
            <div>${strongMomentum}/${totalStocks} Hot Streaks</div>
            <div style="font-size: 0.9rem; color: rgba(255,255,255,0.7)">
                3+ consecutive up days
            </div>
        `;

        // Populate notable highlights sections
        this.populateNotableHighlights(allData, sectorData, growthData);
    }

    populateNotableHighlights(allData, sectorData, growthData) {
        // Hot Streaks (3+ consecutive up days)
        const hotStreaks = allData
            .filter(s => (s.consecutiveUpDays || 0) >= 3)
            .sort((a, b) => (b.consecutiveUpDays || 0) - (a.consecutiveUpDays || 0))
            .slice(0, 8);

        const hotStreaksList = document.getElementById('hotStreaksList');
        if (hotStreaksList) {
            hotStreaksList.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span>Ticker</span>
                    <span>Consecutive Days</span>
                </div>
                ${hotStreaks.length > 0 ? hotStreaks.map(stock => `
                    <div class="hot-streak-item">
                        <span class="stock-ticker-highlight">${stock.ticker}</span>
                        <span class="streak-days">${stock.consecutiveUpDays || 0} days</span>
                    </div>
                `).join('') : '<div style="color: rgba(255,255,255,0.6);">No hot streaks found</div>'}
            `;
        }

        // Top Momentum Plays (high recent performance)
        const momentumPlays = allData
            .filter(s => (s.changes['1w'] || 0) > 2) // At least 2% up in past week
            .sort((a, b) => (b.changes['1w'] || 0) - (a.changes['1w'] || 0))
            .slice(0, 6);

        const momentumPlaysList = document.getElementById('momentumPlaysList');
        if (momentumPlaysList) {
            momentumPlaysList.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span>Ticker</span>
                    <span>% 1 Week</span>
                </div>
                ${momentumPlays.length > 0 ? momentumPlays.map(stock => `
                    <div class="momentum-item">
                        <span class="stock-ticker-highlight">${stock.ticker}</span>
                        <span class="positive">${this.formatPercent(stock.changes['1w'])}</span>
                    </div>
                `).join('') : '<div style="color: rgba(255,255,255,0.6);">No strong momentum found</div>'}
            `;
        }

        // Breakout Watch (near 52-week highs with good trends)
        const breakoutWatch = allData
            .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) > -10) // Within 10% of 52w high
            .filter(s => s.comparisons.ema8Above13Above21 && 
                        ['ST BULLISH', 'EMA Bullish', 'Breaking Out', 'Uptrend Maintained'].includes(s.comparisons.ema8Above13Above21))
            .sort((a, b) => (b.comparisons.deltaFrom52WeekHigh || -100) - (a.comparisons.deltaFrom52WeekHigh || -100))
            .slice(0, 6);

        const breakoutWatchList = document.getElementById('breakoutWatchList');
        if (breakoutWatchList) {
            breakoutWatchList.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span>Ticker</span>
                    <span>Δ from 52W High</span>
                </div>
                ${breakoutWatch.length > 0 ? breakoutWatch.map(stock => `
                    <div class="momentum-item">
                        <span class="stock-ticker-highlight">${stock.ticker}</span>
                        <span class="positive">${this.formatPercent(stock.comparisons.deltaFrom52WeekHigh)}</span>
                    </div>
                `).join('') : '<div style="color: rgba(255,255,255,0.6);">No breakout candidates</div>'}
            `;
        }

        // Cross-Tab Notable Items  
        this.populateCrossTabNotables(allData, sectorData, growthData);
    }

    populateCrossTabNotables(allData, sectorData, growthData) {
        // Sector Champions (best sector ETFs)
        const sectorChampions = sectorData
            .sort((a, b) => (b.liberationChange || 0) - (a.liberationChange || 0))
            .slice(0, 5);

        const sectorChampionsEl = document.getElementById('sectorChampions');
        if (sectorChampionsEl) {
            sectorChampionsEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span>Ticker</span>
                    <span>% Since Liberation</span>
                </div>
                ${sectorChampions.map(stock => `
                    <div class="trend-item">
                        <span class="stock-ticker-highlight">${stock.ticker}</span>
                        <span class="trend-description">${this.formatPercent(stock.liberationChange)}</span>
                    </div>
                `).join('')}
            `;
        }

        // Growth Leaders (best growth stocks)
        const growthLeaders = growthData
            .sort((a, b) => (b.liberationChange || 0) - (a.liberationChange || 0))
            .slice(0, 5);

        const growthLeadersEl = document.getElementById('growthLeaders');
        if (growthLeadersEl) {
            growthLeadersEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <span>Ticker</span>
                    <span>% Since Liberation</span>
                </div>
                ${growthLeaders.map(stock => `
                    <div class="trend-item">
                        <span class="stock-ticker-highlight">${stock.ticker}</span>
                        <span class="trend-description">${this.formatPercent(stock.liberationChange)}</span>
                    </div>
                `).join('')}
            `;
        }

        // Cross-Sector Trends (identify interesting patterns)
        const crossSectorTrends = this.identifyCrossSectorTrends(allData);
        const crossSectorTrendsEl = document.getElementById('crossSectorTrends');
        if (crossSectorTrendsEl) {
            crossSectorTrendsEl.innerHTML = crossSectorTrends.map(trend => `
                <div class="trend-item">
                    <span class="trend-description">${trend}</span>
                </div>
            `).join('');
        }
    }

    identifyCrossSectorTrends(allData) {
        const trends = [];
        
        // Count bullish/bearish trends
        const bullishCount = allData.filter(s => s.comparisons.sma50Above100Above200 === 'BULLISH').length;
        const bearishCount = allData.filter(s => s.comparisons.sma50Above100Above200 === 'BEARISH').length;
        const total = allData.length;
        
        if (bullishCount / total > 0.6) {
            trends.push(`🚀 Strong market: ${bullishCount}/${total} stocks bullish`);
        } else if (bearishCount / total > 0.4) {
            trends.push(`⚠️ Market stress: ${bearishCount}/${total} stocks bearish`);
        } else {
            trends.push(`📊 Mixed market: ${bullishCount} bullish, ${bearishCount} bearish`);
        }

        // RSI patterns - always show these
        const overboughtCount = allData.filter(s => (s.rsiData.rsi14 || 50) > 70).length;
        const oversoldCount = allData.filter(s => (s.rsiData.rsi14 || 50) < 30).length;
        
        if (overboughtCount > 0) {
            trends.push(`📈 ${overboughtCount} stocks overbought (RSI > 70)`);
        }
        if (oversoldCount > 0) {
            trends.push(`📉 ${oversoldCount} buying opportunities (RSI < 30)`);
        }
        if (overboughtCount === 0 && oversoldCount === 0) {
            trends.push(`⚖️ RSI levels balanced across market`);
        }

        // Earnings coming up
        const earningsThisWeek = allData.filter(s => s.daysToEarnings && s.daysToEarnings <= 7 && s.daysToEarnings !== 'N/A').length;
        if (earningsThisWeek > 0) {
            trends.push(`📊 ${earningsThisWeek} stocks reporting earnings this week`);
        }

        // Momentum analysis
        const strongMomentum = allData.filter(s => (s.consecutiveUpDays || 0) >= 3).length;
        if (strongMomentum > 0) {
            trends.push(`🔥 ${strongMomentum} stocks on hot streaks (3+ days)`);
        }

        // Near 52-week highs
        const near52WeekHigh = allData.filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) > -5).length;
        if (near52WeekHigh > 0) {
            trends.push(`⚡ ${near52WeekHigh} stocks near 52-week highs`);
        }

        // Ensure we always have at least 3-4 trends
        if (trends.length < 3) {
            trends.push('🔍 Active market monitoring');
        }

        return trends.slice(0, 6); // Limit to 6 trends max for readability
    }

    async fetchAllEarningsData(tickers, dataMap) {
        console.log('Fetching earnings data for growth stock tickers...');
        
        // Fetch earnings for growth stock tickers only
        const earningsPromises = tickers.map(ticker => this.fetchEarningsData(ticker));
        const earningsResults = await Promise.allSettled(earningsPromises);
        
        let earningsSuccessCount = 0;
        earningsResults.forEach((result, index) => {
            const ticker = tickers[index];
            if (result.status === 'fulfilled' && result.value) {
                const stockData = dataMap.get(ticker);
                if (stockData) {
                    stockData.nextEarnings = result.value.nextEarnings;
                    stockData.daysToEarnings = result.value.daysToEarnings;
                    earningsSuccessCount++;
                }
            } else {
                console.error(`Failed to fetch earnings for ${ticker}:`, result.reason || 'No earnings data');
                const stockData = dataMap.get(ticker);
                if (stockData) {
                    stockData.nextEarnings = 'N/A';
                    stockData.daysToEarnings = 'N/A';
                }
            }
        });
        
        console.log(`Successfully fetched earnings for ${earningsSuccessCount}/${tickers.length} tickers`);
    }

    async fetchEarningsData(ticker) {
        try {
            // FMP earnings calendar API - get next 3 months
            const today = new Date();
            const threeMonthsLater = new Date(today);
            threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
            
            const fromDate = today.toISOString().split('T')[0];
            const toDate = threeMonthsLater.toISOString().split('T')[0];
            
            const fmpUrl = `https://financialmodelingprep.com/api/v3/earning_calendar?from=${fromDate}&to=${toDate}&apikey=${FMP_API_KEY}`;
            
            const response = await fetch(fmpUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const earningsData = await response.json();
            
            // Find next earnings for this ticker
            const tickerEarnings = earningsData.filter(earning => 
                earning.symbol === ticker && new Date(earning.date) >= today
            );
            
            if (tickerEarnings.length === 0) {
                return null;
            }
            
            // Sort by date and get the next one
            tickerEarnings.sort((a, b) => new Date(a.date) - new Date(b.date));
            const nextEarning = tickerEarnings[0];
            
            const earningsDate = new Date(nextEarning.date);
            const daysToEarnings = Math.ceil((earningsDate - today) / (1000 * 60 * 60 * 24));
            
            return {
                nextEarnings: nextEarning.date,
                daysToEarnings: daysToEarnings
            };
            
        } catch (error) {
            console.error(`Error fetching earnings for ${ticker}:`, error);
            return null;
        }
    }

    formatEarningsDate(dateStr) {
        if (!dateStr || dateStr === 'N/A') {
            return 'N/A';
        }
        
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatDaysToEarnings(days) {
        if (!days || days === 'N/A') {
            return 'N/A';
        }
        
        if (days === 0) {
            return 'Today';
        } else if (days === 1) {
            return '1 day';
        } else if (days < 0) {
            return `${Math.abs(days)} days ago`;
        } else {
            return `${days} days`;
        }
    }

    getDaysToEarningsClass(days) {
        if (!days || days === 'N/A') {
            return '';
        }
        
        if (days <= 7) {
            return 'urgent-earnings';
        } else if (days <= 30) {
            return 'upcoming-earnings';
        } else {
            return 'future-earnings';
        }
    }

    getConsecutiveUpDaysClass(days) {
        if (days === 0) {
            return 'no-up-days';
        } else if (days >= 5) {
            return 'many-up-days';
        } else if (days >= 3) {
            return 'some-up-days';
        } else {
            return 'few-up-days';
        }
    }

    showError(message) {
        const dashboard = document.querySelector('.dashboard');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        dashboard.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    new StockDashboard();
});