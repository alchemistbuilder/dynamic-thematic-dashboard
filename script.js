// Configuration
const API_KEY = 'WLIqlQJDbnkp9ke0IEtulkjvpfM7e9Nq'; // Maximum plan - unlimited calls
const FMP_API_KEY = 'm1HzjYgss43pOkJZcWTr2tuKvRvOPM4W'; // Premium FMP API key
const LIBERATION_DAY = new Date('2025-04-02');
const USE_POLYGON = true; // Set to false to use Yahoo Finance

// Check if we're on Vercel and should use the API proxy
const USE_API_PROXY = window.location.hostname.includes('vercel.app') || 
                      window.location.hostname !== 'localhost';

// Helper function to make API calls through proxy when on Vercel
async function fetchPolygonData(polygonUrl) {
    if (USE_API_PROXY) {
        // Use the proxy endpoint to hide API key
        const encodedUrl = encodeURIComponent(polygonUrl.replace(/&apikey=.*$/, ''));
        const proxyUrl = `/api/stocks?url=${encodedUrl}`;
        return fetch(proxyUrl);
    } else {
        // Local development - use direct API call
        return fetch(polygonUrl);
    }
}

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

// Compounder tickers (Quality long-term growth stocks)
const COMPOUNDER_TICKERS = [
    'MELI',
    'CDNS',
    'MSFT',
    'CNSWF',
    'SNPS',
    'WMT',
    'ISRG',
    'VEEV',
    'COST',
    'MA',
    'AXP',
    'JPM',
    'BSX',
    'V',
    'ASML',
    'META',
    'MCO',
    'AMD',
    'FCNCA',
    'AMZN',
    'TDG',
    'GOOGL',
    'NVO',
    'CMG',
    'BRK.A',
    'BX',
    'DHR',
    'ABBV',
    'LLY',
    'AAPL',
    'VRTX',
    'AMGN',
    'REGN',
    'TMO',
    'UNH'
];

// AI Platform Basket tickers
const AI_PLATFORM_TICKERS = [
    'VRT',   // Vertiv - Infrastructure & Energy
    'VST',   // Vistra - Infrastructure & Energy  
    'CEG',   // Constellation Energy - Infrastructure & Energy
    'LEU',   // Centrus Energy - Infrastructure & Energy
    'CRDO',  // Credo Technology - Networking & Connectivity
    'CIEN',  // Ciena - Networking & Connectivity
    'META',  // Meta Platforms - Core AI & Big Tech
    'NVDA',  // NVIDIA - Core AI & Big Tech
    'MSFT',  // Microsoft - Core AI & Big Tech
    'DUOL',  // Duolingo - AI Software & Applications
    'CRM',   // Salesforce - AI Software & Applications
    'MNDY',  // monday.com - AI Software & Applications
    'BASE',  // Couchbase - AI Software & Applications
    'SNOW',  // Snowflake - Cloud Infrastructure & Data
    'DDOG',  // Datadog - Cloud Infrastructure & Data
    'PSTG',  // Pure Storage - Cloud Infrastructure & Data
    'CRWV',  // CoreWeave - Cloud Infrastructure & Data
    'CRWD',  // CrowdStrike - AI-Driven Security
    'NET',   // Cloudflare - AI-Driven Security
    'SRAD',  // Sportradar - AI & Specialized Data
    'LRCX'   // Lam Research - Semiconductor Materials & Equipment
];

// Mag7+ tickers (Magnificent 7 plus additional tech leaders)
const MAG7_PLUS_TICKERS = [
    'NFLX',
    'MSFT',
    'GOOGL',
    'TSLA',
    'NVDA',
    'AAPL',
    'AMZN',
    'META',
    'AVGO',
    'CRWD',
    'NOW'
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

// Shortened names for gainers/losers display
const SHORT_NAMES = {
    'GLD': 'Gold ETF',
    'FXI': 'China ETF',
    'KWEB': 'China Internet',
    'XLU': 'Utilities',
    'IHI': 'Medical Devices',
    'XLI': 'Industrials',
    'XLF': 'Financials',
    'XLP': 'Staples',
    'XLRE': 'Real Estate',
    'IGV': 'Tech Software',
    'ARKW': 'ARK Internet',
    'XLV': 'Healthcare',
    'SPY': 'S&P 500',
    'XLE': 'Energy',
    'FNGS': 'FANG+',
    'QQQ': 'Nasdaq 100',
    'WCLD': 'Cloud',
    'SMH': 'Semiconductors',
    'IWM': 'Russell 2000',
    'ARKK': 'ARK Innovation',
    'XLY': 'Discretionary',
    'SOXX': 'Semis',
    'ARKG': 'ARK Genomics',
    'IBB': 'Biotech',
    'XBI': 'Biotech Small',
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
    'CRCL': 'Circle Internet Group Inc',
    'RKLB': 'Rocket Lab USA Inc'
};

// Compounder stock names mapping
const COMPOUNDER_NAMES = {
    'MELI': 'MercadoLibre Inc',
    'CDNS': 'Cadence Design Systems Inc',
    'MSFT': 'Microsoft Corporation',
    'CNSWF': 'Coinsquare Ltd',
    'SNPS': 'Synopsys Inc',
    'WMT': 'Walmart Inc',
    'ISRG': 'Intuitive Surgical Inc',
    'VEEV': 'Veeva Systems Inc',
    'COST': 'Costco Wholesale Corporation',
    'MA': 'Mastercard Incorporated',
    'AXP': 'American Express Company',
    'JPM': 'JPMorgan Chase & Co',
    'BSX': 'Boston Scientific Corporation',
    'V': 'Visa Inc',
    'ASML': 'ASML Holding N.V.',
    'META': 'Meta Platforms Inc',
    'MCO': "Moody's Corporation",
    'AMD': 'Advanced Micro Devices Inc',
    'FCNCA': 'First Citizens BancShares Inc',
    'AMZN': 'Amazon.com Inc',
    'TDG': 'TransDigm Group Incorporated',
    'GOOGL': 'Alphabet Inc',
    'NVO': 'Novo Nordisk A/S',
    'CMG': 'Chipotle Mexican Grill Inc',
    'BRK.A': 'Berkshire Hathaway Inc',
    'BX': 'Blackstone Inc',
    'DHR': 'Danaher Corporation',
    'ABBV': 'AbbVie Inc',
    'LLY': 'Eli Lilly and Company',
    'AAPL': 'Apple Inc',
    'VRTX': 'Vertex Pharmaceuticals Incorporated',
    'AMGN': 'Amgen Inc',
    'REGN': 'Regeneron Pharmaceuticals Inc',
    'TMO': 'Thermo Fisher Scientific Inc',
    'UNH': 'UnitedHealth Group Incorporated'
};

// AI Platform stock names mapping
const AI_PLATFORM_NAMES = {
    'VRT': 'Vertiv Holdings Co',
    'VST': 'Vistra Corp',
    'CEG': 'Constellation Energy Corporation',
    'LEU': 'Centrus Energy Corp',
    'CRDO': 'Credo Technology Group Holding Ltd',
    'CIEN': 'Ciena Corporation',
    'META': 'Meta Platforms Inc',
    'NVDA': 'NVIDIA Corporation',
    'MSFT': 'Microsoft Corporation',
    'DUOL': 'Duolingo Inc',
    'CRM': 'Salesforce Inc',
    'MNDY': 'monday.com Ltd',
    'BASE': 'Couchbase Inc',
    'SNOW': 'Snowflake Inc',
    'DDOG': 'Datadog Inc',
    'PSTG': 'Pure Storage Inc',
    'CRWV': 'CoreWeave Inc',
    'CRWD': 'CrowdStrike Holdings Inc',
    'NET': 'Cloudflare Inc',
    'SRAD': 'Sportradar Group AG',
    'LRCX': 'Lam Research Corporation'
};

// Mag7+ stock names mapping
const MAG7_PLUS_NAMES = {
    'NFLX': 'Netflix Inc',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc',
    'TSLA': 'Tesla Inc',
    'NVDA': 'NVIDIA Corporation',
    'AAPL': 'Apple Inc',
    'AMZN': 'Amazon.com Inc',
    'META': 'Meta Platforms Inc',
    'AVGO': 'Broadcom Inc',
    'CRWD': 'CrowdStrike Holdings Inc',
    'NOW': 'ServiceNow Inc'
};

class StockDashboard {
    constructor() {
        this.sectorData = new Map();
        this.growthData = new Map();
        this.compounderData = new Map();
        this.mag7Data = new Map();
        this.aiPlatformData = new Map();
        this.currentTab = 'sector-overview';
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.liveUpdateInterval = null;
        this.liveUpdateEnabled = false;
        
        // Column visibility state
        this.hiddenColumns = new Set();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.initializeColumnControls();
    }

    initializeColumnControls() {
        // Define all available columns (complete list from table headers)
        this.allColumns = [
            { id: 'ticker', name: 'Ticker' },
            { id: 'name', name: 'Name' },
            { id: 'liberationChange', name: '% change since Liberation' },
            { id: 'currentPrice', name: 'Price' },
            { id: 'ytd', name: '% YTD' },
            { id: '1d', name: '%1 D' },
            { id: 'gapSignal', name: 'Gap Signal' },
            { id: 'volumeSignal', name: 'Volume Signal' },
            { id: '1w', name: '% 1 Wk' },
            { id: '2w', name: '%2 Wk' },
            { id: '1m', name: '%1 Mo' },
            { id: '2m', name: '%2 Mo' },
            { id: '3m', name: '%3 Mo' },
            { id: '6m', name: '%6Mo' },
            { id: '1y', name: '%1YR' },
            { id: 'deltaFrom52WeekHigh', name: 'Δ 52w H' },
            { id: 'above50SMA', name: '>50 SMA' },
            { id: 'above100SMA', name: '>100 SMA' },
            { id: 'above200SMA', name: '>200 SMA' },
            { id: 'sma50Above100Above200', name: '50>100>200?' },
            { id: 'above8EMA', name: '>8d EMA' },
            { id: 'above13EMA', name: '>13d EMA' },
            { id: 'above21EMA', name: '>21d EMA' },
            { id: 'ema8Above13Above21', name: 'ema 8>13>21' },
            { id: 'sma50', name: '50 SMA' },
            { id: 'sma100', name: '100 SMA' },
            { id: 'sma200', name: '200 SMA' },
            { id: 'ema8', name: '8d EMA' },
            { id: 'ema13', name: '13d EMA' },
            { id: 'ema21', name: '21d EMA' },
            { id: 'rsi14', name: '14D RSI' },
            { id: 'rsi30', name: '30D RSI' },
            { id: 'nextEarnings', name: 'Next Earnings' },
            { id: 'daysToEarnings', name: 'Days to Earnings' },
            { id: 'consecutiveUpDays', name: '# of Days Up' }
        ];
        
        this.populateColumnToggles();
        this.loadColumnPreferences();
    }

    populateColumnToggles() {
        // Populate all column toggle containers
        const togglesContainers = document.querySelectorAll('.column-toggles');
        
        togglesContainers.forEach(togglesContainer => {
            togglesContainer.innerHTML = '';
            
            this.allColumns.forEach(column => {
                const isVisible = !this.hiddenColumns.has(column.id);
                
                const toggleDiv = document.createElement('div');
                toggleDiv.className = 'column-toggle';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `toggle-${column.id}-${Math.random().toString(36).substr(2, 9)}`;
                checkbox.checked = isVisible;
                checkbox.addEventListener('change', () => this.toggleColumn(column.id, checkbox.checked));
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.textContent = column.name;
                
                toggleDiv.appendChild(checkbox);
                toggleDiv.appendChild(label);
                togglesContainer.appendChild(toggleDiv);
            });
        });
    }

    toggleColumn(columnId, show) {
        if (show) {
            this.hiddenColumns.delete(columnId);
        } else {
            this.hiddenColumns.add(columnId);
        }
        
        // Apply visibility to all tables
        this.applyColumnVisibility(columnId, show);
        
        // Save to localStorage
        localStorage.setItem('hiddenColumns', JSON.stringify([...this.hiddenColumns]));
    }

    applyColumnVisibility(columnId, show) {
        // Find all headers for this column across all tables
        const headers = document.querySelectorAll(`th[data-column="${columnId}"]`);
        
        headers.forEach(header => {
            const table = header.closest('table');
            const headerRow = header.parentNode;
            const columnIndex = Array.from(headerRow.children).indexOf(header);
            
            // Hide/show header
            header.classList.toggle('column-hidden', !show);
            
            // Hide/show all cells in this column
            const tbody = table.querySelector('tbody');
            if (tbody) {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => {
                    const cell = row.children[columnIndex];
                    if (cell) {
                        cell.classList.toggle('column-hidden', !show);
                    }
                });
            }
        });
    }

    loadColumnPreferences() {
        const saved = localStorage.getItem('hiddenColumns');
        if (saved) {
            this.hiddenColumns = new Set(JSON.parse(saved));
            
            // Apply saved preferences
            this.hiddenColumns.forEach(columnId => {
                this.applyColumnVisibility(columnId, false);
            });
            
            // Update toggles to reflect current state
            this.populateColumnToggles();
        }
    }

    get stockData() {
        if (this.currentTab === 'sector-overview') return this.sectorData;
        if (this.currentTab === 'high-growth') return this.growthData;
        if (this.currentTab === 'compounder') return this.compounderData;
        if (this.currentTab === 'mag7-plus') return this.mag7Data;
        if (this.currentTab === 'ai-platform') return this.aiPlatformData;
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
        } else if (tabId === 'market-intelligence') {
            this.renderMarketIntelligence();
        } else if (tabId === 'gainers-losers') {
            this.renderGainersLosers();
        } else if (tabId === 'ai-platform') {
            this.renderTable();
            this.renderSectorAnalysis('ai-platform', this.aiPlatformData);
        } else {
            this.renderTable();
            
            // Render sector analysis for relevant tabs
            if (this.currentTab === 'high-growth') {
                this.renderSectorAnalysis('growth', this.growthData);
            } else if (this.currentTab === 'compounder') {
                this.renderSectorAnalysis('compounder', this.compounderData);
            } else if (this.currentTab === 'mag7-plus') {
                this.renderSectorAnalysis('mag7', this.mag7Data);
            }
            
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
        switch (this.currentTab) {
            case 'sector-overview':
                tickers = [...SECTOR_TICKERS, ...CRYPTO_TICKERS];
                break;
            case 'high-growth':
                tickers = GROWTH_TICKERS;
                break;
            case 'compounder':
                tickers = COMPOUNDER_TICKERS;
                break;
            case 'mag7-plus':
                tickers = MAG7_PLUS_TICKERS;
                break;
            default:
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
            
            const response = await fetchPolygonData(endpoint);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.ticker) {
                const dayData = data.ticker.day;
                const prevDayData = data.ticker.prevDay;
                const min = data.ticker.min;
                
                // Use the most recent price available
                const currentPrice = min?.c || dayData?.c || prevDayData?.c || 0;
                
                // Use the API's pre-calculated daily change percentage if available
                let changePercent = data.ticker.todaysChangePerc;
                
                // Debug: log the API response to see what we're getting
                console.log(`DEBUG ${ticker}: todaysChangePerc=${changePercent}, ticker data:`, data.ticker);
                
                // Fallback to manual calculation if API doesn't provide it
                if (changePercent === undefined || changePercent === null) {
                    let referencePrice;
                    if (dayData?.o) {
                        referencePrice = dayData.o;  // Today's open
                    } else if (prevDayData?.c) {
                        referencePrice = prevDayData.c;  // Previous day's close
                    } else {
                        referencePrice = currentPrice;  // Fallback
                    }
                    changePercent = ((currentPrice - referencePrice) / referencePrice) * 100;
                }
                
                return {
                    price: currentPrice,
                    changePercent: changePercent
                };
            } else {
                // Fallback for crypto or if snapshot fails
                if (ticker.startsWith('X:')) {
                    // For crypto, use the forex endpoint
                    const cryptoResponse = await fetchPolygonData(
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
        const tbodyMapping = {
            'sector-overview': 'stockTableBody',
            'high-growth': 'growthTableBody',
            'compounder': 'compounderTableBody',
            'mag7-plus': 'mag7TableBody',
            'ai-platform': 'aiPlatformTableBody'
        };
        const tbody = document.getElementById(tbodyMapping[this.currentTab]);
        
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
        console.log('Using grouped endpoint for maximum speed...');
        
        try {
            // Get all unique stock tickers (excluding crypto for grouped endpoint)
            const allStockTickers = [
                ...new Set([
                    ...SECTOR_TICKERS,
                    ...GROWTH_TICKERS,
                    ...COMPOUNDER_TICKERS,
                    ...MAG7_PLUS_TICKERS,
                    ...AI_PLATFORM_TICKERS
                ])
            ];
            
            // Fetch all stock data in a single grouped call
            const stockData = await this.fetchGroupedStockData(allStockTickers);
            
            // Process data for each tab
            await Promise.all([
                this.processGroupedDataForTab('sector-overview', SECTOR_TICKERS, stockData),
                this.processGroupedDataForTab('high-growth', GROWTH_TICKERS, stockData),
                this.processGroupedDataForTab('compounder', COMPOUNDER_TICKERS, stockData),
                this.processGroupedDataForTab('mag7-plus', MAG7_PLUS_TICKERS, stockData),
                this.processGroupedDataForTab('ai-platform', AI_PLATFORM_TICKERS, stockData)
            ]);
            
            // Fetch crypto separately (grouped endpoint doesn't support crypto)
            await this.fetchCryptoData();
            
            // Fetch earnings for individual stock tabs
            await Promise.all([
                this.fetchAllEarningsData(GROWTH_TICKERS, this.growthData),
                this.fetchAllEarningsData(COMPOUNDER_TICKERS, this.compounderData),
                this.fetchAllEarningsData(MAG7_PLUS_TICKERS, this.mag7Data),
                this.fetchAllEarningsData(AI_PLATFORM_TICKERS, this.aiPlatformData)
            ]);
            
            console.log('Grouped data fetch completed successfully!');
            
        } catch (error) {
            console.error('Grouped fetch failed, falling back to individual calls:', error);
            // Fallback to original method if grouped fails
            await this.fetchAllStockDataFallback();
        }
    }

    async fetchGroupedStockData(tickers) {
        console.log(`Fetching grouped data for ${tickers.length} tickers...`);
        
        // Get the most recent trading day (today if markets are open, yesterday if closed)
        const today = new Date();
        const currentHour = today.getHours();
        const isWeekend = today.getDay() === 0 || today.getDay() === 6;
        const isMarketHours = currentHour >= 9 && currentHour < 16; // 9 AM - 4 PM ET roughly
        
        // Use today's date if it's a weekday and markets are likely open or recently closed
        // Otherwise use yesterday (previous trading day)
        let targetDate;
        if (isWeekend || (currentHour < 9 && today.getDay() === 1)) {
            // Weekend or early Monday - use Friday's data
            targetDate = new Date(today);
            const daysBack = isWeekend ? (today.getDay() === 0 ? 2 : 1) : 3; // Sunday: 2, Saturday: 1, Monday: 3
            targetDate.setDate(targetDate.getDate() - daysBack);
        } else {
            // Weekday - use today's date (Polygon will return most recent available data)
            targetDate = new Date(today);
        }
        
        const dateStr = targetDate.toISOString().split('T')[0];
        console.log(`Using date: ${dateStr} for grouped data`);
        
        // Use grouped daily bars endpoint
        const groupedUrl = `https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${dateStr}?adjusted=true&apikey=${API_KEY}`;
        
        const response = await fetchPolygonData(groupedUrl);
        if (!response.ok) {
            throw new Error(`Grouped API failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('No grouped data available');
        }
        
        console.log(`Grouped endpoint returned ${data.results.length} stocks`);
        
        // Convert to map for easy lookup
        const groupedData = new Map();
        data.results.forEach(result => {
            groupedData.set(result.T, result); // T is ticker symbol
        });
        
        // Debug CRCL in grouped data
        console.log('=== CRCL GROUPED DATA DEBUG ===');
        console.log('CRCL in grouped data:', groupedData.has('CRCL'));
        if (groupedData.has('CRCL')) {
            console.log('CRCL grouped data:', groupedData.get('CRCL'));
        } else {
            console.log('CRCL not found in grouped data');
            console.log('Available tickers sample:', Array.from(groupedData.keys()).slice(0, 20));
        }
        console.log('===================================');
        
        // Now fetch historical data for technical indicators
        // We still need this for moving averages calculation
        const historicalData = new Map();
        
        // Fetch in smaller batches to avoid overwhelming the API
        const batchSize = 20;
        for (let i = 0; i < tickers.length; i += batchSize) {
            const batch = tickers.slice(i, i + batchSize);
            const batchPromises = batch.map(ticker => this.fetchHistoricalData(ticker));
            const batchResults = await Promise.allSettled(batchPromises);
            
            batchResults.forEach((result, index) => {
                const ticker = batch[index];
                if (result.status === 'fulfilled' && result.value) {
                    historicalData.set(ticker, result.value);
                } else if (ticker === 'CRCL') {
                    console.log('=== CRCL HISTORICAL DATA ERROR ===');
                    console.log('CRCL fetch result:', result);
                    if (result.status === 'rejected') {
                        console.log('CRCL fetch error:', result.reason);
                    }
                    console.log('=====================================');
                }
            });
            
            // Small delay between batches
            if (i + batchSize < tickers.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // Fetch current prices for accurate daily change calculation
        console.log('Fetching current prices for accurate daily changes...');
        const currentPrices = new Map();
        
        // Fetch current prices in batches for better performance
        const priceBatchSize = 50;
        for (let i = 0; i < tickers.length; i += priceBatchSize) {
            const batch = tickers.slice(i, i + priceBatchSize);
            const pricePromises = batch.map(ticker => this.fetchCurrentPrice(ticker));
            const priceResults = await Promise.allSettled(pricePromises);
            
            priceResults.forEach((result, index) => {
                const ticker = batch[index];
                if (result.status === 'fulfilled' && result.value) {
                    currentPrices.set(ticker, result.value);
                }
            });
            
            // Small delay between batches
            if (i + priceBatchSize < tickers.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        console.log(`Got current prices for ${currentPrices.size} tickers`);
        
        return { grouped: groupedData, historical: historicalData, currentPrices: currentPrices };
    }

    async fetchHistoricalData(ticker) {
        try {
            // Get 2 years of data for technical indicators
            const endDate = new Date();
            const startDate = new Date();
            startDate.setFullYear(startDate.getFullYear() - 2);
            
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}?adjusted=true&sort=asc&apikey=${API_KEY}`;
            
            const response = await fetchPolygonData(url);
            if (!response.ok) return null;
            
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error(`Error fetching historical data for ${ticker}:`, error);
            return null;
        }
    }

    async fetchCurrentPrice(ticker) {
        try {
            // First try real-time quote endpoint for current data
            const quoteUrl = `https://api.polygon.io/v2/last/trade/${ticker}?apikey=${API_KEY}`;
            const quoteResponse = await fetchPolygonData(quoteUrl);
            
            if (quoteResponse.ok) {
                const quoteData = await quoteResponse.json();
                const currentPrice = quoteData.results?.p || 0;
                
                // Get yesterday's close price from previous day aggregates
                const prevUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apikey=${API_KEY}`;
                const prevResponse = await fetchPolygonData(prevUrl);
                
                if (prevResponse.ok) {
                    const prevData = await prevResponse.json();
                    if (prevData.results && prevData.results.length > 0) {
                        const prevClose = prevData.results[0].c;
                        const changePercent = ((currentPrice - prevClose) / prevClose) * 100;
                        
                        // Debug ARKW specifically
                        if (ticker === 'ARKW') {
                            console.log(`ARKW REAL-TIME DEBUG: prev_close=${prevClose}, current=${currentPrice}, change%=${changePercent.toFixed(2)}%`);
                        }
                        
                        return {
                            price: currentPrice,
                            change: currentPrice - prevClose,
                            changePercent: changePercent
                        };
                    }
                }
            }
            
            // Fallback to original method
            const today = new Date().toISOString().split('T')[0];
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${today}/${today}?adjusted=true&apikey=${API_KEY}`;
            
            const response = await fetchPolygonData(url);
            if (!response.ok) {
                // Fallback to previous day if today's data is not available
                return await this.fetchPreviousDayPrice(ticker);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const todayData = data.results[0];
                const changePercent = ((todayData.c - todayData.o) / todayData.o) * 100;
                
                // Debug ARKW specifically
                if (ticker === 'ARKW') {
                    const dataDate = new Date(todayData.t).toISOString().split('T')[0];
                    console.log(`ARKW DEBUG: date=${dataDate}, open=${todayData.o}, close=${todayData.c}, change%=${changePercent.toFixed(2)}%`);
                }
                
                return {
                    price: todayData.c,
                    change: todayData.c - todayData.o,
                    changePercent: changePercent
                };
            }
            
            // Fallback to previous day if no results
            return await this.fetchPreviousDayPrice(ticker);
        } catch (error) {
            console.error(`Error fetching current price for ${ticker}:`, error);
            return null;
        }
    }

    async fetchPreviousDayPrice(ticker) {
        try {
            const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apikey=${API_KEY}`;
            
            const response = await fetchPolygonData(url);
            if (!response.ok) return null;
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const prevData = data.results[0];
                return {
                    price: prevData.c,
                    change: prevData.c - prevData.o,
                    changePercent: ((prevData.c - prevData.o) / prevData.o) * 100
                };
            }
            
            return null;
        } catch (error) {
            console.error(`Error fetching previous day price for ${ticker}:`, error);
            return null;
        }
    }

    async processGroupedDataForTab(tabType, tickers, stockData) {
        const dataMap = this.getDataMapForTab(tabType);
        const missingTickers = [];
        
        tickers.forEach(ticker => {
            const grouped = stockData.grouped.get(ticker);
            const historical = stockData.historical.get(ticker);
            const currentPrice = stockData.currentPrices.get(ticker);
            
            if (grouped && historical) {
                // Process the data similar to individual fetchStockData
                const processedData = this.processStockDataFromGrouped(ticker, grouped, historical, currentPrice);
                if (processedData) {
                    dataMap.set(ticker, processedData);
                }
            } else if (historical && historical.length > 0) {
                // For stocks not in grouped data (e.g., new IPOs), fetch individual data
                console.log(`${ticker} not in grouped data, will fetch individually`);
                missingTickers.push(ticker);
            } else {
                console.warn(`No data available for ${ticker}`);
            }
        });
        
        // Fetch missing tickers individually
        if (missingTickers.length > 0) {
            console.log(`Fetching ${missingTickers.length} missing tickers individually:`, missingTickers);
            await this.fetchMissingTickers(missingTickers, dataMap);
        }
        
        console.log(`Processed ${dataMap.size} stocks for ${tabType}`);
    }

    async fetchMissingTickers(tickers, dataMap) {
        // Fetch individual ticker data for stocks not in grouped endpoint
        for (const ticker of tickers) {
            try {
                const data = await this.fetchStockData(ticker);
                if (data) {
                    dataMap.set(ticker, data);
                    console.log(`Successfully fetched ${ticker} individually`);
                }
            } catch (error) {
                console.error(`Failed to fetch ${ticker}:`, error);
            }
        }
    }

    getDataMapForTab(tabType) {
        switch (tabType) {
            case 'sector-overview': return this.sectorData;
            case 'high-growth': return this.growthData;
            case 'compounder': return this.compounderData;
            case 'mag7-plus': return this.mag7Data;
            case 'ai-platform': return this.aiPlatformData;
            default: return new Map();
        }
    }

    processStockDataFromGrouped(ticker, groupedData, historicalData, currentPriceData) {
        try {
            // Debug CRCL data fetching
            if (ticker === 'CRCL') {
                console.log('=== CRCL DATA FETCHING DEBUG ===');
                console.log('CRCL Grouped Data:', groupedData);
                console.log('CRCL Historical Data length:', historicalData?.length);
                console.log('CRCL Historical Data sample:', historicalData?.slice(-5));
                console.log('CRCL Current Price Data:', currentPriceData);
            }
            
            // Use current price from real-time data if available, otherwise fall back to grouped data
            const currentPrice = currentPriceData?.price || groupedData.c;
            const currentVolume = groupedData.v; // Current day volume
            
            // Calculate technical indicators using historical data
            const movingAverages = this.calculateMovingAverages(historicalData);
            const rsiData = this.calculateRSI(historicalData);
            const changes = this.calculatePercentageChanges(historicalData, currentPrice);
            
            // Override daily change with current price data if available
            if (currentPriceData && currentPriceData.changePercent !== undefined) {
                console.log(`${ticker}: Using current price data changePercent: ${currentPriceData.changePercent}%`);
                changes['1d'] = currentPriceData.changePercent;
            } else {
                console.log(`${ticker}: Using calculated daily change: ${changes['1d']?.toFixed(2)}%`);
            }
            
            const week52High = this.calculate52WeekHigh(historicalData);
            const comparisons = this.calculateComparisons(currentPrice, movingAverages, week52High);
            const consecutiveUpDays = this.calculateConsecutiveUpDays(historicalData);
            
            // NEW: Calculate volume and volatility signals
            const volumeSignal = this.calculateVolumeSignal(historicalData, currentVolume);
            const gapSignal = this.calculateGapSignal(historicalData, groupedData);
            const breakoutScore = this.calculateBreakoutScore({
                consecutiveUpDays,
                rsiData,
                movingAverages,
                comparisons,
                volumeSignal,
                gapSignal,
                currentPrice
            });
            
            // Calculate Liberation Day change
            const liberationChange = this.calculateLiberationDayChange(historicalData, currentPrice);
            
            return {
                ticker,
                name: STOCK_NAMES[ticker] || GROWTH_NAMES[ticker] || COMPOUNDER_NAMES[ticker] || AI_PLATFORM_NAMES[ticker] || MAG7_PLUS_NAMES[ticker] || ticker,
                currentPrice,
                changes,
                movingAverages,
                rsiData,
                comparisons,
                consecutiveUpDays,
                liberationChange,
                volumeSignal,
                gapSignal,
                breakoutScore,
                nextEarnings: 'N/A', // Will be populated later
                daysToEarnings: 'N/A'
            };
        } catch (error) {
            console.error(`Error processing data for ${ticker}:`, error);
            return null;
        }
    }

    async fetchCryptoData() {
        console.log('Fetching crypto data separately...');
        
        // Crypto needs to be fetched individually as grouped endpoint doesn't support it
        const cryptoPromises = CRYPTO_TICKERS.map(ticker => this.fetchStockData(ticker));
        const cryptoResults = await Promise.allSettled(cryptoPromises);
        
        cryptoResults.forEach((result, index) => {
            const ticker = CRYPTO_TICKERS[index];
            if (result.status === 'fulfilled' && result.value) {
                this.sectorData.set(ticker, result.value);
            }
        });
    }

    async fetchAllStockDataFallback() {
        console.log('Using fallback method...');
        
        // Original sequential approach with delays between tabs
        await this.fetchDataForTab('sector-overview');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.fetchDataForTab('high-growth');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.fetchDataForTab('compounder');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await this.fetchDataForTab('mag7-plus');
    }

    async fetchDataForTab(tabType) {
        let tickers, dataMap, tickerType;
        
        switch (tabType) {
            case 'sector-overview':
                tickers = [...SECTOR_TICKERS, ...CRYPTO_TICKERS];
                dataMap = this.sectorData;
                tickerType = 'sector';
                break;
            case 'high-growth':
                tickers = GROWTH_TICKERS;
                dataMap = this.growthData;
                tickerType = 'growth';
                break;
            case 'compounder':
                tickers = COMPOUNDER_TICKERS;
                dataMap = this.compounderData;
                tickerType = 'compounder';
                break;
            case 'mag7-plus':
                tickers = MAG7_PLUS_TICKERS;
                dataMap = this.mag7Data;
                tickerType = 'mag7+';
                break;
            default:
                console.error(`Unknown tab type: ${tabType}`);
                return;
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
            if (tabType === 'high-growth' || tabType === 'compounder' || tabType === 'mag7-plus') {
                await this.fetchAllEarningsData(tickers, dataMap);
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
                const response = await fetchPolygonData(polygonUrl);
                
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
            name: STOCK_NAMES[ticker] || GROWTH_NAMES[ticker] || COMPOUNDER_NAMES[ticker] || AI_PLATFORM_NAMES[ticker] || MAG7_PLUS_NAMES[ticker] || ticker,
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
        
        // Calculate daily change specially - use previous trading day close
        changes['1d'] = this.calculateDailyChange(data, currentPrice);
        
        // Calculate other periods
        Object.entries(periods).forEach(([period, days]) => {
            if (days !== null && period !== '1d') { // Skip 1d since we handled it specially
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

    calculateDailyChange(data, currentPrice) {
        if (data.length < 2) return null;
        
        // Sort data to ensure chronological order
        const sortedData = [...data].sort((a, b) => a.t - b.t);
        
        // Use previous day's close as the reference price (standard for daily % change)
        const previousData = sortedData[sortedData.length - 2];
        const referencePrice = previousData.c;
        
        if (!referencePrice || referencePrice <= 0) {
            return null;
        }
        
        // Calculate percentage change: current price vs previous day's close
        return ((currentPrice - referencePrice) / referencePrice) * 100;
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

    calculateLiberationDayChange(historicalData, currentPrice) {
        // Liberation Day: April 2, 2025
        const liberationDate = LIBERATION_DAY.getTime();
        
        // Find the price closest to Liberation Day
        let liberationPrice = null;
        let closestDate = Infinity;
        
        for (const dataPoint of historicalData) {
            const pointDate = dataPoint.t;
            const dateDiff = Math.abs(pointDate - liberationDate);
            
            if (dateDiff < closestDate) {
                closestDate = dateDiff;
                liberationPrice = dataPoint.c; // Close price
            }
        }
        
        if (!liberationPrice) return null;
        
        return ((currentPrice - liberationPrice) / liberationPrice) * 100;
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
            case 'gapSignal':
                const gapSignal = data.gapSignal?.signal || 'Normal';
                const gapRankings = {
                    'Gap Up 3σ': 5,
                    'Gap Up 2σ': 4,
                    'Normal': 3,
                    'Gap Down 2σ': 2,
                    'Gap Down 3σ': 1,
                    'No Data': 0
                };
                return gapRankings[gapSignal] || 3;
            case 'volumeSignal':
                const volumeSignal = data.volumeSignal?.signal || 'Normal';
                const volumeRankings = {
                    'Spike 3σ': 4,
                    'Spike 2σ': 3,
                    'Normal': 2,
                    'Low Vol': 1,
                    'No Data': 0
                };
                return volumeRankings[volumeSignal] || 2;
            default:
                return 0;
        }
    }

    renderTable() {
        const tbodyMapping = {
            'sector-overview': 'stockTableBody',
            'high-growth': 'growthTableBody',
            'compounder': 'compounderTableBody',
            'mag7-plus': 'mag7TableBody',
            'ai-platform': 'aiPlatformTableBody'
        };
        
        const tbodyId = tbodyMapping[this.currentTab];
        const tbody = document.getElementById(tbodyId);
        
        if (!tbody) {
            console.error(`Table body not found for tab: ${this.currentTab}`);
            return;
        }
        
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
        
        // Apply column visibility after rendering
        this.applyAllColumnVisibility();
    }

    applyAllColumnVisibility() {
        // Apply visibility for all hidden columns
        this.hiddenColumns.forEach(columnId => {
            this.applyColumnVisibility(columnId, false);
        });
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
        const suffixMapping = {
            'sector-overview': '',
            'high-growth': 'Growth',
            'compounder': 'Compounder',
            'mag7-plus': 'Mag7'
        };
        const suffix = suffixMapping[this.currentTab] || '';
        
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

        // NEW: Format Gap and Volume signals
        const formatGapSignal = (gapData) => {
            if (!gapData || !gapData.signal) return 'N/A';
            const className = gapData.signal.includes('Gap Up') ? 'positive' : 
                             gapData.signal.includes('Gap Down') ? 'negative' : '';
            return `<span class="${className}">${gapData.signal}</span>`;
        };

        const formatVolumeSignal = (volumeData) => {
            if (!volumeData || !volumeData.signal) return 'N/A';
            const className = volumeData.signal.includes('Spike') ? 'positive' : 
                             volumeData.signal === 'Low Vol' ? 'negative' : '';
            return `<span class="${className}">${volumeData.signal}</span>`;
        };

        return `
            <td class="ticker-cell">${data.ticker}</td>
            <td class="name-cell">${data.name}</td>
            <td>${formatPercent(data.liberationChange)}</td>
            <td class="price-cell">${formatPrice(data.currentPrice)}</td>
            <td>${formatPercent(data.changes['ytd'])}</td>
            <td>${formatPercent(data.changes['1d'])}</td>
            <td>${formatGapSignal(data.gapSignal)}</td>
            <td>${formatVolumeSignal(data.volumeSignal)}</td>
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


    renderMarketIntelligence() {
        // Ensure all datasets are loaded
        if (this.sectorData.size === 0 || this.growthData.size === 0 || 
            this.compounderData.size === 0 || this.mag7Data.size === 0 || this.aiPlatformData.size === 0) {
            // Load data if not available
            this.loadData();
            return;
        }

        console.log('🧠 Running Market Intelligence Analysis...');
        
        // Get all stocks across datasets
        const allStocks = [
            ...Array.from(this.sectorData.values()),
            ...Array.from(this.growthData.values()),
            ...Array.from(this.compounderData.values()),
            ...Array.from(this.aiPlatformData.values()),
            ...Array.from(this.mag7Data.values())
        ].filter(stock => stock !== null);
        
        // Debug CRCL presence in allStocks
        const crclStock = allStocks.find(stock => stock.ticker === 'CRCL');
        console.log('=== CRCL IN ALL STOCKS DEBUG ===');
        console.log('CRCL found in allStocks:', !!crclStock);
        console.log('Growth data size:', this.growthData.size);
        console.log('Growth data has CRCL:', this.growthData.has('CRCL'));
        if (crclStock) {
            console.log('CRCL basic data check:', {
                ticker: crclStock.ticker,
                name: crclStock.name,
                currentPrice: crclStock.currentPrice,
                hasChanges: !!crclStock.changes,
                hasMovingAverages: !!crclStock.movingAverages,
                hasRSI: !!crclStock.rsiData
            });
        }
        console.log('Total stocks in allStocks:', allStocks.length);
        console.log('====================================');

        // Run analysis
        const analysis = this.analyzeMarketData(allStocks);
        
        // Update side panel
        this.updateIntelligenceSidePanel(analysis);
        
        // Update main content sections
        this.updateIntelligenceSections(analysis);
        
        console.log('✅ Market Intelligence Analysis Complete');
    }

    analyzeMarketData(allStocks) {
        // 1. HIGH SHARPE RATIO CANDIDATES
        const highSharpeStocks = allStocks
            .filter(s => s.liberationChange > 15) // Good returns since Liberation
            .filter(s => (s.changes['1m'] || 0) > -5 && (s.changes['1m'] || 0) < 25) // Controlled monthly volatility
            .filter(s => (s.changes['1w'] || 0) > -3 && (s.changes['1w'] || 0) < 15) // Stable weekly moves
            .map(s => ({
                ...s,
                sharpeScore: s.liberationChange / (Math.abs(s.changes['1m'] || 10) + 1) // Return/volatility proxy
            }))
            .sort((a, b) => b.sharpeScore - a.sharpeScore)
            .slice(0, 8);

        // 2. MOMENTUM ACCELERATION PLAYS
        const momentumAccel = allStocks
            .filter(s => (s.changes['1w'] || 0) > (s.changes['1m'] || 0) / 4) // Weekly > monthly/4 (accelerating)
            .filter(s => (s.changes['2w'] || 0) > (s.changes['1m'] || 0) / 2) // 2-week > monthly/2
            .filter(s => (s.consecutiveUpDays || 0) >= 2) // Recent momentum
            .map(s => ({
                ...s,
                accelScore: (s.changes['1w'] || 0) - (s.changes['1m'] || 0) / 4
            }))
            .sort((a, b) => b.accelScore - a.accelScore)
            .slice(0, 6);

        // 3. STEALTH PERFORMERS
        const stealthPerformers = allStocks
            .filter(s => s.liberationChange > 20) // Strong Liberation performance
            .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) < -15) // Still well below 52w high
            .filter(s => s.comparisons.ema8Above13Above21 && 
                        ['ST BULLISH', 'EMA Bullish', 'Uptrend Maintained'].includes(s.comparisons.ema8Above13Above21))
            .filter(s => (s.rsiData.rsi14 || 50) < 70) // Not overbought
            .sort((a, b) => (b.liberationChange || 0) - (a.liberationChange || 0))
            .slice(0, 6);

        // 4. TECHNICAL BREAKOUT SETUPS
        const breakoutSetups = allStocks
            .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) > -8) // Very close to 52w high
            .filter(s => (s.changes['1w'] || 0) > 0) // Positive weekly momentum
            .filter(s => (s.consecutiveUpDays || 0) >= 1) // Recent upward movement
            .filter(s => s.comparisons.above50SMA && s.comparisons.above100SMA) // Above key SMAs
            .sort((a, b) => (b.comparisons.deltaFrom52WeekHigh || -100) - (a.comparisons.deltaFrom52WeekHigh || -100))
            .slice(0, 5);

        // 5. VALUE WITH MOMENTUM
        const valueWithMomentum = allStocks
            .filter(s => (s.changes['3m'] || 0) > 10) // Strong 3-month trend
            .filter(s => (s.changes['1m'] || 0) > 5) // Positive recent momentum
            .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) < -20) // Still discounted from highs
            .filter(s => s.comparisons.sma50Above100Above200 === 'BULLISH' || s.comparisons.sma50Above100Above200 === 'Healthy')
            .sort((a, b) => (b.changes['3m'] || 0) - (a.changes['3m'] || 0))
            .slice(0, 6);

        // 6. CONTRARIAN OVERSOLD PLAYS
        const oversoldBounce = allStocks
            .filter(s => (s.rsiData.rsi14 || 50) < 35) // Oversold RSI
            .filter(s => (s.changes['1w'] || 0) > -10) // Not in free fall
            .filter(s => s.liberationChange > 0) // Still positive long-term
            .filter(s => s.comparisons.above200SMA) // Above long-term trend
            .sort((a, b) => (a.rsiData.rsi14 || 50) - (b.rsiData.rsi14 || 50)) // Most oversold first
            .slice(0, 5);

        // 7. NEW: BREAKOUT HUNTER ANALYSIS
        const breakoutHunterCandidates = allStocks
            .map(stock => {
                // Calculate breakout score if not already calculated
                if (!stock.breakoutScore) {
                    stock.breakoutScore = this.calculateBreakoutScore(stock);
                }
                
                // Debug CRCL and ZETA specifically
                if (stock.ticker === 'CRCL' || stock.ticker === 'ZETA') {
                    console.log(`=== ${stock.ticker} BREAKOUT HUNTER DEBUG ===`);
                    console.log(`${stock.ticker} Stock Data:`, stock);
                    console.log(`${stock.ticker} Breakout Score:`, stock.breakoutScore);
                    console.log(`${stock.ticker} Volume Signal:`, stock.volumeSignal);
                    console.log(`${stock.ticker} Gap Signal:`, stock.gapSignal);
                    console.log(`${stock.ticker} Consecutive Up Days:`, stock.consecutiveUpDays);
                    console.log(`${stock.ticker} Changes:`, stock.changes);
                    console.log(`${stock.ticker} Comparisons:`, stock.comparisons);
                    console.log(`${stock.ticker} Moving Averages:`, stock.movingAverages);
                    console.log(`${stock.ticker} RSI Data:`, stock.rsiData);
                }
                
                return stock;
            })
            .filter(stock => {
                // More inclusive filtering - catch different breakout patterns
                const score = stock.breakoutScore.totalScore;
                const isNewIPO = stock.breakoutScore.isNewIPO;
                const hasVolumeSpike = stock.volumeSignal?.signal?.includes('Spike');
                const hasGapUp = stock.gapSignal?.signal?.includes('Gap Up');
                const strongMomentum = (stock.consecutiveUpDays || 0) >= 3;
                const moderateMomentum = (stock.consecutiveUpDays || 0) >= 2;
                const recentGains = (stock.changes['1w'] || 0) > 5;
                const moderateGains = (stock.changes['1w'] || 0) > 2;
                const strongLiberation = (stock.liberationChange || 0) > 30;
                
                // Debug CRCL and ZETA filtering
                if (stock.ticker === 'CRCL' || stock.ticker === 'ZETA') {
                    console.log(`${stock.ticker} Filter Check:`);
                    console.log('- Score:', score, '(>= 5)', score >= 5);
                    console.log('- Is New IPO:', isNewIPO);
                    console.log('- Volume Spike:', hasVolumeSpike);
                    console.log('- Gap Up:', hasGapUp);
                    console.log('- Strong Momentum:', strongMomentum, '(3+ up days)');
                    console.log('- Moderate Momentum:', moderateMomentum, '(2+ up days)');
                    console.log('- Recent Gains:', recentGains, '(>5% 1w)');
                    console.log('- Strong Liberation:', strongLiberation, '(>30%)');
                }
                
                // Special criteria for new IPOs (more lenient)
                if (isNewIPO) {
                    const passesNewIPO = score >= 4 || hasVolumeSpike || hasGapUp || 
                                        (moderateMomentum && moderateGains) || strongLiberation;
                    if (stock.ticker === 'CRCL' || stock.ticker === 'ZETA') {
                        console.log('- NEW IPO PASSES:', passesNewIPO);
                        console.log('=====================================');
                    }
                    return passesNewIPO;
                }
                
                // Regular criteria for established stocks
                const passesRegular = score >= 5 || hasVolumeSpike || hasGapUp || 
                                     (strongMomentum && recentGains) || 
                                     (score >= 4 && strongLiberation);
                
                if (stock.ticker === 'CRCL' || stock.ticker === 'ZETA') {
                    console.log('- REGULAR PASSES:', passesRegular);
                    console.log('=====================================');
                }
                
                return passesRegular;
            })
            .sort((a, b) => b.breakoutScore.totalScore - a.breakoutScore.totalScore)
            .slice(0, 25); // Top 25 breakout candidates (increased from 20)

        return {
            highSharpe: highSharpeStocks,
            momentum: momentumAccel,
            stealth: stealthPerformers,
            breakouts: breakoutSetups,
            value: valueWithMomentum,
            oversold: oversoldBounce,
            breakoutHunter: breakoutHunterCandidates,
            totalStocks: allStocks.length
        };
    }

    updateIntelligenceSidePanel(analysis) {
        // Calculate summary stats
        const totalOpportunities = analysis.highSharpe.length + analysis.momentum.length + 
                                 analysis.stealth.length + analysis.breakouts.length + 
                                 analysis.value.length + analysis.oversold.length + 
                                 analysis.breakoutHunter.length;

        // Find strongest signal category
        const categories = [
            { name: 'High Sharpe', count: analysis.highSharpe.length, type: 'Quality' },
            { name: 'Momentum', count: analysis.momentum.length, type: 'Growth' },
            { name: 'Stealth', count: analysis.stealth.length, type: 'Hidden' },
            { name: 'Breakouts', count: analysis.breakouts.length, type: 'Technical' },
            { name: 'Value', count: analysis.value.length, type: 'Recovery' },
            { name: 'Oversold', count: analysis.oversold.length, type: 'Contrarian' },
            { name: 'Breakout Hunter', count: analysis.breakoutHunter.length, type: 'Explosive' }
        ];
        const strongestCategory = categories.reduce((max, cat) => cat.count > max.count ? cat : max);

        // Determine market regime
        const bullishSignals = analysis.momentum.length + analysis.breakouts.length;
        const bearishSignals = analysis.oversold.length;
        const regime = bullishSignals > bearishSignals * 2 ? 'Risk-On' : 
                      bearishSignals > bullishSignals ? 'Risk-Off' : 'Mixed';

        // Update side panel
        document.getElementById('totalOpportunities').textContent = `${totalOpportunities} signals detected`;
        document.getElementById('strongestSignal').textContent = `${strongestCategory.name} (${strongestCategory.count} stocks)`;
        document.getElementById('marketRegime').textContent = `${regime} Environment`;

        // Update top picks
        if (analysis.highSharpe.length > 0) {
            const topSharpe = analysis.highSharpe[0];
            document.getElementById('topSharpe').innerHTML = `
                <div class="pick-ticker">${topSharpe.ticker}</div>
                <div class="pick-reason">Sharpe: ${topSharpe.sharpeScore.toFixed(2)} • ${this.formatPercent(topSharpe.liberationChange)}</div>
            `;
        }

        if (analysis.momentum.length > 0) {
            const topMomentum = analysis.momentum[0];
            document.getElementById('topMomentum').innerHTML = `
                <div class="pick-ticker">${topMomentum.ticker}</div>
                <div class="pick-reason">${topMomentum.consecutiveUpDays || 0} days up • ${this.formatPercent(topMomentum.changes['1w'])}</div>
            `;
        }

        if (analysis.stealth.length > 0) {
            const topStealth = analysis.stealth[0];
            document.getElementById('topStealth').innerHTML = `
                <div class="pick-ticker">${topStealth.ticker}</div>
                <div class="pick-reason">${this.formatPercent(topStealth.liberationChange)} • ${this.formatPercent(topStealth.comparisons.deltaFrom52WeekHigh)} from 52W</div>
            `;
        }

        // NEW: Top Breakout Hunter Pick
        if (analysis.breakoutHunter.length > 0) {
            const topBreakout = analysis.breakoutHunter[0];
            const scoreElement = document.getElementById('topBreakout');
            if (scoreElement) {
                scoreElement.innerHTML = `
                    <div class="pick-ticker">${topBreakout.ticker}</div>
                    <div class="pick-reason">Score: ${topBreakout.breakoutScore.totalScore}/22 • ${topBreakout.consecutiveUpDays || 0} days up</div>
                `;
            }
        }
    }

    updateIntelligenceSections(analysis) {
        // High Sharpe Ratio
        this.populateIntelligenceGrid('highSharpeList', analysis.highSharpe, (stock) => [
            stock.ticker,
            this.formatPercent(stock.liberationChange),
            this.formatPercent(Math.abs(stock.changes['1m'] || 0)),
            stock.sharpeScore.toFixed(2)
        ]);

        // Momentum Acceleration
        this.populateIntelligenceGrid('momentumAccelList', analysis.momentum, (stock) => [
            stock.ticker,
            this.formatPercent(stock.changes['1w']),
            this.formatPercent(stock.changes['1m']),
            `${stock.consecutiveUpDays || 0} days`
        ]);

        // Stealth Performers
        this.populateIntelligenceGrid('stealthList', analysis.stealth, (stock) => [
            stock.ticker,
            this.formatPercent(stock.liberationChange),
            this.formatPercent(stock.comparisons.deltaFrom52WeekHigh),
            (stock.rsiData.rsi14 || 0).toFixed(0)
        ]);

        // Breakout Setups
        this.populateIntelligenceGrid('breakoutList', analysis.breakouts, (stock) => [
            stock.ticker,
            this.formatPercent(stock.comparisons.deltaFrom52WeekHigh),
            this.formatPercent(stock.changes['1w']),
            stock.comparisons.ema8Above13Above21 || 'N/A'
        ]);

        // Value with Momentum
        this.populateIntelligenceGrid('valueList', analysis.value, (stock) => [
            stock.ticker,
            this.formatPercent(stock.changes['3m']),
            this.formatPercent(stock.changes['1m']),
            stock.comparisons.sma50Above100Above200 || 'N/A'
        ]);

        // Oversold Plays
        this.populateIntelligenceGrid('oversoldList', analysis.oversold, (stock) => [
            stock.ticker,
            (stock.rsiData.rsi14 || 0).toFixed(0),
            this.formatPercent(stock.liberationChange),
            this.formatPercent(stock.changes['1w'])
        ]);

        // NEW: Breakout Hunter
        this.populateBreakoutHunterGrid('breakoutHunterList', analysis.breakoutHunter);
    }

    populateBreakoutHunterGrid(containerId, stocks) {
        const container = document.getElementById(containerId);
        
        if (stocks.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255,255,255,0.6);">No breakout candidates detected</div>';
            return;
        }

        container.innerHTML = stocks.map(stock => {
            const score = stock.breakoutScore;
            const criteria = score.criteria;
            const isNewIPO = score.isNewIPO;
            
            // Determine score class
            const scoreClass = score.totalScore >= 15 ? 'high' : 
                              score.totalScore >= 10 ? 'medium' : 'low';
            
            // Format criteria with color coding
            const formatCriteria = (value, maxValue) => {
                const percentage = value / maxValue;
                const className = percentage >= 0.7 ? 'strong' : 
                                 percentage >= 0.4 ? 'medium' : 'weak';
                return `<span class="breakout-criteria ${className}">${value}</span>`;
            };

            // Special display for new IPOs
            if (isNewIPO) {
                return `
                    <div class="breakout-hunter-row" style="background: rgba(255, 193, 7, 0.1); border-left: 3px solid #ffc107;">
                        <div class="breakout-ticker">${stock.ticker} 🆕</div>
                        <div class="breakout-name">${stock.name}</div>
                        <div class="breakout-score ${scoreClass}">${score.totalScore}</div>
                        ${formatCriteria(criteria.consecutiveUpDays || 0, 5)}
                        <span class="breakout-criteria medium">IPO</span>
                        <span class="breakout-criteria medium">IPO</span>
                        <span class="breakout-criteria medium">IPO</span>
                        ${formatCriteria(criteria.volumeSpike || 0, 4)}
                        ${formatCriteria(criteria.gapSignal || 0, 3)}
                        <span class="breakout-criteria strong">🆕</span>
                        ${formatCriteria(criteria.recentPerformance || 0, 8)}
                    </div>
                `;
            }

            return `
                <div class="breakout-hunter-row">
                    <div class="breakout-ticker">${stock.ticker}</div>
                    <div class="breakout-name">${stock.name}</div>
                    <div class="breakout-score ${scoreClass}">${score.totalScore}</div>
                    ${formatCriteria(criteria.consecutiveUpDays, 5)}
                    ${formatCriteria(criteria.rsiSweetSpot, 3)}
                    ${formatCriteria(criteria.emaCompression, 2)}
                    ${formatCriteria(criteria.smaBreakthrough, 3)}
                    ${formatCriteria(criteria.volumeSpike, 4)}
                    ${formatCriteria(criteria.gapSignal, 3)}
                    ${formatCriteria(criteria.weekHigh52Proximity, 2)}
                    ${formatCriteria(criteria.momentumExplosion || 0, 5)}
                </div>
            `;
        }).join('');
    }

    populateIntelligenceGrid(containerId, stocks, formatFunction) {
        const container = document.getElementById(containerId);
        
        if (stocks.length === 0) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255,255,255,0.6);">No opportunities found in this category</div>';
            return;
        }

        container.innerHTML = stocks.map(stock => {
            const data = formatFunction(stock);
            return `
                <div class="intelligence-row">
                    <div class="intelligence-ticker">${data[0]}</div>
                    <div class="intelligence-metric ${this.getMetricClass(data[1])}">${data[1]}</div>
                    <div class="intelligence-metric ${this.getMetricClass(data[2])}">${data[2]}</div>
                    <div class="intelligence-metric">${data[3]}</div>
                </div>
            `;
        }).join('');
    }

    getMetricClass(value) {
        if (typeof value === 'string' && value.includes('%')) {
            const numValue = parseFloat(value.replace('%', '').replace('+', ''));
            if (numValue > 0) return 'positive';
            if (numValue < 0) return 'negative';
        }
        return '';
    }

    calculateSMAStats(data, elementId) {
        if (!data || data.length === 0) {
            document.getElementById(elementId).innerHTML = 'No data';
            return;
        }
        
        const above50SMA = data.filter(s => s.comparisons && s.comparisons.above50SMA === true).length;
        const above100SMA = data.filter(s => s.comparisons && s.comparisons.above100SMA === true).length;
        const total = data.length;
        
        const pct50 = total > 0 ? ((above50SMA / total) * 100).toFixed(0) : 0;
        const pct100 = total > 0 ? ((above100SMA / total) * 100).toFixed(0) : 0;

        document.getElementById(elementId).innerHTML = `
            <div>${above50SMA}/${total} Above 50 SMA (${pct50}%)</div>
            <div>${above100SMA}/${total} Above 100 SMA (${pct100}%)</div>
        `;
    }

    updateMarketStats(sectorData, growthData) {
        // Helper function to calculate and display SMA stats
        const updateCategoryStats = (data, elementId) => {
            const above50SMA = data.filter(s => s.comparisons && s.comparisons.above50SMA === true).length;
            const above100SMA = data.filter(s => s.comparisons && s.comparisons.above100SMA === true).length;
            const total = data.length;
            
            const pct50 = total > 0 ? ((above50SMA / total) * 100).toFixed(0) : 0;
            const pct100 = total > 0 ? ((above100SMA / total) * 100).toFixed(0) : 0;

            document.getElementById(elementId).innerHTML = `
                <div>${above50SMA}/${total} Above 50 SMA (${pct50}%)</div>
                <div>${above100SMA}/${total} Above 100 SMA (${pct100}%)</div>
            `;
        };

        // Update all category stats
        updateCategoryStats(sectorData, 'sectorStats');
        updateCategoryStats(growthData, 'growthStats');
        
        // Get data for other categories
        const compounderArray = Array.from(this.compounderData.values()).filter(data => data !== null);
        const mag7Array = Array.from(this.mag7Data.values()).filter(data => data !== null);  
        const aiPlatformArray = Array.from(this.aiPlatformData.values()).filter(data => data !== null);
        
        updateCategoryStats(compounderArray, 'compounderStats');
        updateCategoryStats(mag7Array, 'mag7Stats');
        updateCategoryStats(aiPlatformArray, 'aiPlatformStats');

        // Combined data for notable highlights
        const allData = [...sectorData, ...growthData];

        // Populate notable highlights sections
        this.populateNotableHighlights(allData, sectorData, growthData);
    }

    populateNotableHighlights(allData, sectorData, growthData) {
        // Pre-calculate all conditions in a single pass to avoid multiple array iterations
        const processedData = allData.map(stock => {
            const consecutiveUpDays = stock.consecutiveUpDays || 0;
            const weeklyChange = stock.changes['1w'] || 0;
            const deltaFrom52WeekHigh = stock.comparisons?.deltaFrom52WeekHigh || -100;
            const emaStatus = stock.comparisons?.ema8Above13Above21 || '';
            
            return {
                ...stock,
                consecutiveUpDays,
                weeklyChange,
                deltaFrom52WeekHigh,
                emaStatus,
                isHotStreak: consecutiveUpDays >= 3,
                isMomentumPlay: weeklyChange > 2,
                isBreakoutCandidate: deltaFrom52WeekHigh > -10 && 
                    ['ST BULLISH', 'EMA Bullish', 'Breaking Out', 'Uptrend Maintained'].includes(emaStatus)
            };
        });
        
        // Single pass filtering and sorting
        const hotStreaks = processedData
            .filter(s => s.isHotStreak)
            .sort((a, b) => b.consecutiveUpDays - a.consecutiveUpDays)
            .slice(0, 8);

        const momentumPlays = processedData
            .filter(s => s.isMomentumPlay)
            .sort((a, b) => b.weeklyChange - a.weeklyChange)
            .slice(0, 6);

        const breakoutWatch = processedData
            .filter(s => s.isBreakoutCandidate)
            .sort((a, b) => b.deltaFrom52WeekHigh - a.deltaFrom52WeekHigh)
            .slice(0, 6);

        // Batch DOM updates using requestAnimationFrame for better performance
        requestAnimationFrame(() => {
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
                            <span class="streak-days">${stock.consecutiveUpDays} days</span>
                        </div>
                    `).join('') : '<div style="color: rgba(255,255,255,0.6);">No hot streaks found</div>'}
                `;
            }

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
                            <span class="positive">${this.formatPercent(stock.weeklyChange)}</span>
                        </div>
                    `).join('') : '<div style="color: rgba(255,255,255,0.6);">No strong momentum found</div>'}
                `;
            }

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
                            <span class="positive">${this.formatPercent(stock.deltaFrom52WeekHigh)}</span>
                        </div>
                    `).join('') : '<div style="color: rgba(255,255,255,0.6);">No breakout candidates</div>'}
                `;
            }
        });

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

    // NEW: Volume Signal Calculation
    calculateVolumeSignal(historicalData, currentVolume) {
        if (!historicalData || historicalData.length < 20 || !currentVolume) {
            return { signal: 'No Data', ratio: 0 };
        }

        // Get last 20 days of volume data
        const recentVolumes = historicalData.slice(-20).map(day => day.v);
        const avgVolume = recentVolumes.reduce((sum, vol) => sum + vol, 0) / recentVolumes.length;
        
        // Calculate standard deviation
        const variance = recentVolumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / recentVolumes.length;
        const stdDev = Math.sqrt(variance);
        
        const volumeRatio = currentVolume / avgVolume;
        const zScore = (currentVolume - avgVolume) / stdDev;
        
        let signal = 'Normal';
        if (zScore >= 3) {
            signal = 'Spike 3σ';
        } else if (zScore >= 2) {
            signal = 'Spike 2σ';
        } else if (zScore <= -1.5) {
            signal = 'Low Vol';
        }
        
        return { signal, ratio: volumeRatio, zScore };
    }

    // NEW: Gap Signal Calculation  
    calculateGapSignal(historicalData, groupedData) {
        if (!historicalData || historicalData.length < 20 || !groupedData) {
            return { signal: 'No Data', gapPercent: 0 };
        }

        // Get yesterday's close vs today's open to detect gaps
        const todayOpen = groupedData.o; // Open price
        const yesterdayClose = historicalData[historicalData.length - 1]?.c;
        
        if (!todayOpen || !yesterdayClose) {
            return { signal: 'No Data', gapPercent: 0 };
        }

        const gapPercent = ((todayOpen - yesterdayClose) / yesterdayClose) * 100;
        
        // Calculate recent volatility (20-day standard deviation of daily changes)
        const recentChanges = historicalData.slice(-20).map((day, i, arr) => {
            if (i === 0) return 0;
            return ((day.c - arr[i-1].c) / arr[i-1].c) * 100;
        }).slice(1);
        
        const avgChange = recentChanges.reduce((sum, change) => sum + change, 0) / recentChanges.length;
        const variance = recentChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / recentChanges.length;
        const volatilityStdDev = Math.sqrt(variance);
        
        const zScore = Math.abs(gapPercent) / volatilityStdDev;
        
        let signal = 'Normal';
        if (gapPercent > 0) {
            if (zScore >= 3) {
                signal = 'Gap Up 3σ';
            } else if (zScore >= 2) {
                signal = 'Gap Up 2σ';
            }
        } else if (gapPercent < 0) {
            if (zScore >= 3) {
                signal = 'Gap Down 3σ';
            } else if (zScore >= 2) {
                signal = 'Gap Down 2σ';
            }
        }
        
        return { signal, gapPercent, zScore };
    }

    // NEW: Detect newly public stocks (IPOs with limited data)
    isNewlyPublicStock(data) {
        // Check if key technical indicators are missing (sign of limited history)
        const missingSMA200 = !data.movingAverages?.sma200;
        const missingSMA100 = !data.movingAverages?.sma100;
        const missingRSI = !data.rsiData?.rsi14;
        
        // If multiple key indicators are missing, likely a new IPO
        return (missingSMA200 && missingSMA100) || missingRSI;
    }

    // NEW: Special scoring for newly public stocks
    calculateNewIPOScore(data) {
        let score = 0;
        const criteria = {};
        
        // For new IPOs, focus on available metrics
        
        // 1. Recent Performance (0-10 points) - increased weight
        const weeklyGain = data.changes?.['1w'] || 0;
        const twoWeekGain = data.changes?.['2w'] || 0;
        const monthlyGain = data.changes?.['1m'] || 0;
        const liberationGain = data.liberationChange || 0;
        
        let performanceScore = 0;
        
        // Weekly performance (0-3 points)
        if (weeklyGain > 20) performanceScore += 3;
        else if (weeklyGain > 10) performanceScore += 2;
        else if (weeklyGain > 5) performanceScore += 1;
        
        // Two-week performance (0-2 points)
        if (twoWeekGain > 25) performanceScore += 2;
        else if (twoWeekGain > 10) performanceScore += 1;
        
        // Liberation performance (0-5 points)
        if (liberationGain > 100) performanceScore += 5;
        else if (liberationGain > 50) performanceScore += 4;
        else if (liberationGain > 30) performanceScore += 3;
        else if (liberationGain > 15) performanceScore += 2;
        else if (liberationGain > 5) performanceScore += 1;
        
        criteria.recentPerformance = Math.min(performanceScore, 10);
        score += criteria.recentPerformance;
        
        // 2. Volume and Gap signals still work for new stocks
        const volumeSignal = data.volumeSignal?.signal || 'Normal';
        if (volumeSignal === 'Spike 3σ') {
            criteria.volumeSpike = 4;
            score += 4;
        } else if (volumeSignal === 'Spike 2σ') {
            criteria.volumeSpike = 3;
            score += 3;
        } else if (data.volumeSignal?.ratio > 1.5) {
            criteria.volumeSpike = 2;
            score += 2;
        } else if (data.volumeSignal?.ratio > 1.2) {
            criteria.volumeSpike = 1;
            score += 1;
        } else {
            criteria.volumeSpike = 0;
        }
        
        const gapSignal = data.gapSignal?.signal || 'Normal';
        if (gapSignal === 'Gap Up 3σ') {
            criteria.gapSignal = 3;
            score += 3;
        } else if (gapSignal === 'Gap Up 2σ') {
            criteria.gapSignal = 2;
            score += 2;
        } else if (data.gapSignal?.gapPercent > 2) {
            criteria.gapSignal = 1;
            score += 1;
        } else {
            criteria.gapSignal = 0;
        }
        
        // 3. Consecutive days (works for new stocks)
        const upDays = data.consecutiveUpDays || 0;
        criteria.consecutiveUpDays = Math.min(upDays, 5);
        score += criteria.consecutiveUpDays;
        
        // 4. NEW IPO BONUS - Being newly public with momentum is extra bullish
        if (weeklyGain > 5 || liberationGain > 20) {
            criteria.newIPOBonus = 4; // Higher bonus for momentum IPOs
            score += 4;
        } else {
            criteria.newIPOBonus = 2;
            score += 2;
        }
        
        // 5. Price action strength (for stocks with some EMA data)
        if (data.movingAverages?.ema8 && data.currentPrice > data.movingAverages.ema8) {
            criteria.priceStrength = 1;
            score += 1;
        } else {
            criteria.priceStrength = 0;
        }
        
        return { totalScore: score, criteria, isNewIPO: true };
    }

    // NEW: Breakout Score Calculation
    calculateBreakoutScore(data) {
        // Check if this is a newly public stock (limited historical data)
        const isNewIPO = this.isNewlyPublicStock(data);
        
        // Use special scoring for new IPOs
        if (isNewIPO) {
            return this.calculateNewIPOScore(data);
        }
        
        let score = 0;
        const criteria = {};
        
        // 1. Consecutive Up Days (0-5 points)
        const upDays = data.consecutiveUpDays || 0;
        criteria.consecutiveUpDays = Math.min(upDays, 5);
        score += criteria.consecutiveUpDays;
        
        // 2. RSI Pattern (0-3 points) - Updated for momentum continuation
        const rsi = data.rsiData?.rsi14 || 50;
        if (rsi >= 45 && rsi <= 65) {
            criteria.rsiSweetSpot = 3; // Sweet spot - momentum without overbought
        } else if (rsi >= 65 && rsi <= 80) {
            criteria.rsiSweetSpot = 2; // Momentum continuation - still valid for breakouts
        } else if (rsi >= 40 && rsi <= 45) {
            criteria.rsiSweetSpot = 2; // Building momentum
        } else if (rsi > 80) {
            criteria.rsiSweetSpot = 1; // Extreme momentum - risky but possible
        } else {
            criteria.rsiSweetSpot = 0; // Oversold or other
        }
        score += criteria.rsiSweetSpot;
        
        // 3. EMA Compression (0-2 points)
        const ema8 = data.movingAverages?.ema8;
        const ema13 = data.movingAverages?.ema13;
        const ema21 = data.movingAverages?.ema21;
        if (ema8 && ema13 && ema21) {
            const emaSpread = ((Math.max(ema8, ema13, ema21) - Math.min(ema8, ema13, ema21)) / data.currentPrice) * 100;
            criteria.emaCompression = emaSpread < 3 ? 2 : (emaSpread < 5 ? 1 : 0);
        } else {
            criteria.emaCompression = 0;
        }
        score += criteria.emaCompression;
        
        // 4. Key SMA Breakthrough (0-3 points)
        let smaBreakthrough = 0;
        if (data.comparisons?.above50SMA) smaBreakthrough += 1;
        if (data.comparisons?.above100SMA) smaBreakthrough += 1;
        if (data.comparisons?.sma50Above100Above200 === 'BULLISH') smaBreakthrough += 1;
        criteria.smaBreakthrough = smaBreakthrough;
        score += criteria.smaBreakthrough;
        
        // 5. Volume Spike (0-4 points)
        const volumeSignal = data.volumeSignal?.signal || 'Normal';
        if (volumeSignal === 'Spike 3σ') {
            criteria.volumeSpike = 4;
        } else if (volumeSignal === 'Spike 2σ') {
            criteria.volumeSpike = 3;
        } else if (data.volumeSignal?.ratio > 1.5) {
            criteria.volumeSpike = 1;
        } else {
            criteria.volumeSpike = 0;
        }
        score += criteria.volumeSpike;
        
        // 6. Gap Signal (0-3 points)
        const gapSignal = data.gapSignal?.signal || 'Normal';
        if (gapSignal === 'Gap Up 3σ') {
            criteria.gapSignal = 3;
        } else if (gapSignal === 'Gap Up 2σ') {
            criteria.gapSignal = 2;
        } else {
            criteria.gapSignal = 0;
        }
        score += criteria.gapSignal;
        
        // 7. 52-Week High Proximity (0-2 points)
        const delta52w = data.comparisons?.deltaFrom52WeekHigh || -100;
        if (delta52w > -5) {
            criteria.weekHigh52Proximity = 2;
        } else if (delta52w > -15) {
            criteria.weekHigh52Proximity = 1;
        } else {
            criteria.weekHigh52Proximity = 0;
        }
        score += criteria.weekHigh52Proximity;
        
        // 8. NEW: Momentum Explosion Bonus (0-5 points)
        // Special pattern for explosive breakouts that don't fit traditional molds
        let momentumExplosion = 0;
        const weeklyGain = data.changes?.['1w'] || 0;
        const monthlyGain = data.changes?.['1m'] || 0;
        const liberationGain = data.liberationChange || 0;
        
        // Explosive recent performance
        if (weeklyGain > 15) momentumExplosion += 2;
        else if (weeklyGain > 10) momentumExplosion += 1;
        
        // Strong liberation performance
        if (liberationGain > 50) momentumExplosion += 1;
        
        // Volume + momentum combo
        if ((data.volumeSignal?.ratio > 2) && weeklyGain > 5) momentumExplosion += 2;
        
        criteria.momentumExplosion = Math.min(momentumExplosion, 5);
        score += criteria.momentumExplosion;
        
        return { totalScore: score, criteria };
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

    renderMarketSummary() {
        console.log('📊 Rendering Market Summary...');
        
        // Ensure all datasets are loaded
        if (this.sectorData.size === 0 || this.growthData.size === 0 || 
            this.compounderData.size === 0 || this.mag7Data.size === 0 || 
            this.aiPlatformData.size === 0) {
            console.warn('Data not fully loaded for market summary');
            return;
        }
        
        // Get data arrays for each category
        const sectorData = Array.from(this.sectorData.values()).filter(d => d !== null);
        const growthData = Array.from(this.growthData.values()).filter(d => d !== null);
        const compounderData = Array.from(this.compounderData.values()).filter(d => d !== null);
        const mag7Data = Array.from(this.mag7Data.values()).filter(d => d !== null);
        const aiPlatformData = Array.from(this.aiPlatformData.values()).filter(d => d !== null);
        
        // Update market stats
        this.updateMarketStats(sectorData, growthData);
        
        // Populate summary side panels for each category
        this.populateMarketSummaryPanels(sectorData, growthData, compounderData, mag7Data, aiPlatformData);
        
        console.log('✅ Market Summary rendered successfully');
    }

    populateMarketSummaryPanels(sectorData, growthData, compounderData, mag7Data, aiPlatformData) {
        // Optimized scoring function that calculates all scores at once
        const calculateAllScores = (data) => {
            // Cache frequently accessed nested properties
            const comparisons = data.comparisons || {};
            const changes = data.changes || {};
            
            // Calculate bullish score
            let bullishScore = 0;
            const smaTrend = comparisons.sma50Above100Above200;
            if (smaTrend === 'BULLISH') bullishScore += 40;
            else if (smaTrend === 'Healthy') bullishScore += 30;
            else if (smaTrend === 'At Support') bullishScore += 20;
            
            const emaTrend = comparisons.ema8Above13Above21;
            if (emaTrend === 'ST BULLISH') bullishScore += 40;
            else if (emaTrend === 'EMA Bullish') bullishScore += 35;
            else if (emaTrend === 'Uptrend Maintained') bullishScore += 30;
            else if (emaTrend === 'Breaking Out') bullishScore += 25;
            else if (emaTrend === 'Early Recovery') bullishScore += 20;
            
            const libChange = data.liberationChange || 0;
            const ytdChange = changes.ytd || 0;
            const oneMonthChange = changes['1m'] || 0;
            bullishScore += (libChange * 0.5) + (ytdChange * 0.25);
            
            if (comparisons.above50SMA) bullishScore += 10;
            if (comparisons.above100SMA) bullishScore += 10;
            if (comparisons.above200SMA) bullishScore += 10;
            
            const upDays = data.consecutiveUpDays || 0;
            if (upDays >= 5) bullishScore += 25;
            else if (upDays >= 3) bullishScore += 15;
            else if (upDays >= 1) bullishScore += 5;
            
            // Calculate bearish score
            let bearishScore = 0;
            if (smaTrend === 'BEARISH') bearishScore += 40;
            else if (smaTrend === 'FALSE') bearishScore += 20;
            
            if (emaTrend === 'ST BEARISH') bearishScore += 40;
            else if (emaTrend === 'EMA Bearish') bearishScore += 30;
            
            if (libChange < 0) bearishScore += Math.abs(libChange) * 0.5;
            if (ytdChange < 0) bearishScore += Math.abs(ytdChange) * 0.25;
            
            if (!comparisons.above50SMA) bearishScore += 10;
            if (!comparisons.above100SMA) bearishScore += 10;
            if (!comparisons.above200SMA) bearishScore += 10;
            
            const delta52w = comparisons.deltaFrom52WeekHigh || 0;
            if (delta52w < -20) bearishScore += Math.abs(delta52w) * 0.3;
            
            // Calculate performance score
            const performanceScore = (libChange * 0.4) + (ytdChange * 0.4) + (oneMonthChange * 0.2);
            
            return {
                ...data,
                bullishScore,
                bearishScore,
                performanceScore
            };
        };
        
        // Calculate scores for all data sets in one pass
        const scoredSectorData = sectorData.map(calculateAllScores);
        const scoredGrowthData = growthData.map(calculateAllScores);
        const scoredCompounderData = compounderData.map(calculateAllScores);
        const scoredMag7Data = mag7Data.map(calculateAllScores);
        const scoredAiPlatformData = aiPlatformData.map(calculateAllScores);
        
        // Combine all scored data
        const allScoredData = [...scoredSectorData, ...scoredGrowthData, ...scoredCompounderData, ...scoredMag7Data, ...scoredAiPlatformData];
        
        // Use batch DOM updates to reduce reflows
        const fragment = document.createDocumentFragment();
        
        // Sort and populate all sections
        const topSectorBullish = [...scoredSectorData].sort((a, b) => b.bullishScore - a.bullishScore).slice(0, 5);
        const topSectorBearish = [...scoredSectorData].sort((a, b) => b.bearishScore - a.bearishScore).slice(0, 5);
        const topGrowthBullish = [...scoredGrowthData].sort((a, b) => b.bullishScore - a.bullishScore).slice(0, 5);
        const topGrowthBearish = [...scoredGrowthData].sort((a, b) => b.bearishScore - a.bearishScore).slice(0, 5);
        const topAiBullish = [...scoredAiPlatformData].sort((a, b) => b.bullishScore - a.bullishScore).slice(0, 5);
        const topAiBearish = [...scoredAiPlatformData].sort((a, b) => b.bearishScore - a.bearishScore).slice(0, 5);
        const topOverallPerformers = [...allScoredData].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);
        
        // Populate all sections
        this.populateStockList('sectorBullishSummary', topSectorBullish, 'bullish');
        this.populateStockList('sectorBearishSummary', topSectorBearish, 'bearish');
        this.populateStockList('growthBullishSummary', topGrowthBullish, 'bullish');
        this.populateStockList('growthBearishSummary', topGrowthBearish, 'bearish');
        this.populateStockList('aiPlatformBullishSummary', topAiBullish, 'bullish');
        this.populateStockList('aiPlatformBearishSummary', topAiBearish, 'bearish');
        this.populateStockList('overallPerformersSummary', topOverallPerformers, 'performer');
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

    // Gainers/Losers functionality
    renderGainersLosers() {
        // Ensure all datasets are loaded
        if (this.sectorData.size === 0 || this.growthData.size === 0 || 
            this.compounderData.size === 0 || this.mag7Data.size === 0 || 
            this.aiPlatformData.size === 0) {
            // Load data if not available
            this.loadData();
            return;
        }

        console.log('📊 Rendering Gainers/Losers Analysis...');
        
        // Update market status indicator
        this.updateMarketStatusIndicator();
        
        // Get all stocks across all categories
        const allStocks = this.getAllStocksData();
        
        // Calculate gainers/losers for different timeframes
        const timeframes = ['1d', '1w', '2w', '1m'];
        
        // Render overall market gainers/losers
        timeframes.forEach(timeframe => {
            this.renderTimeframeGainersLosers('overall', allStocks, timeframe);
        });
        
        // Render multi-timeframe champions
        this.renderMultiTimeframeChampions(allStocks);
        
        // Render section-specific gainers/losers
        const sections = [
            { id: 'sector', data: Array.from(this.sectorData.values()).filter(d => d !== null) },
            { id: 'growth', data: Array.from(this.growthData.values()).filter(d => d !== null) },
            { id: 'compounder', data: Array.from(this.compounderData.values()).filter(d => d !== null) },
            { id: 'mag7', data: Array.from(this.mag7Data.values()).filter(d => d !== null) },
            { id: 'ai-platform', data: Array.from(this.aiPlatformData.values()).filter(d => d !== null) }
        ];
        
        sections.forEach(section => {
            timeframes.forEach(timeframe => {
                this.renderTimeframeGainersLosers(section.id, section.data, timeframe);
            });
        });
    }

    getAllStocksData() {
        // Combine all unique stocks from all datasets
        const allStocksMap = new Map();
        
        // Add stocks from each dataset
        [this.sectorData, this.growthData, this.compounderData, this.mag7Data, this.aiPlatformData].forEach(dataMap => {
            dataMap.forEach((data, ticker) => {
                if (data && !allStocksMap.has(ticker)) {
                    allStocksMap.set(ticker, data);
                }
            });
        });
        
        return Array.from(allStocksMap.values());
    }

    renderTimeframeGainersLosers(sectionId, stocksData, timeframe) {
        // Get container IDs
        const gainersId = `${sectionId}-gainers-${timeframe}`;
        const losersId = `${sectionId}-losers-${timeframe}`;
        
        const gainersContainer = document.getElementById(gainersId);
        const losersContainer = document.getElementById(losersId);
        
        if (!gainersContainer || !losersContainer) {
            console.warn(`Containers not found for ${sectionId} ${timeframe}`);
            return;
        }
        
        // Filter stocks with valid data for this timeframe
        const validStocks = stocksData.filter(stock => 
            stock.changes && 
            stock.changes[timeframe] !== null && 
            stock.changes[timeframe] !== undefined
        );
        
        if (validStocks.length === 0) {
            gainersContainer.innerHTML = '<div class="gl-empty">No data available</div>';
            losersContainer.innerHTML = '<div class="gl-empty">No data available</div>';
            return;
        }
        
        // Sort by performance
        const sortedStocks = [...validStocks].sort((a, b) => 
            (b.changes[timeframe] || -999999) - (a.changes[timeframe] || -999999)
        );
        
        // Get top 5 gainers and losers
        const topGainers = sortedStocks.slice(0, 5);
        const topLosers = sortedStocks.slice(-5).reverse();
        
        // Render gainers
        gainersContainer.innerHTML = topGainers.map(stock => 
            this.createGainerLoserItem(stock, timeframe, 'gainer')
        ).join('');
        
        // Render losers
        losersContainer.innerHTML = topLosers.map(stock => 
            this.createGainerLoserItem(stock, timeframe, 'loser')
        ).join('');
    }

    createGainerLoserItem(stock, timeframe, type) {
        const change = stock.changes[timeframe];
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const itemClass = type === 'gainer' ? 'gainer' : 'loser';
        
        // Use short names for display, fallback to regular name, then ticker
        const displayName = SHORT_NAMES[stock.ticker] || stock.name || stock.ticker;
        
        return `
            <div class="gl-item ${itemClass}">
                <div class="gl-stock-info">
                    <div class="gl-ticker">${stock.ticker}</div>
                    <div class="gl-name">${displayName}</div>
                </div>
                <div class="gl-change ${changeClass}">
                    ${change >= 0 ? '+' : ''}${change.toFixed(2)}%
                </div>
            </div>
        `;
    }

    updateMarketStatusIndicator() {
        const indicator = document.getElementById('marketStatusIndicator');
        if (!indicator) return;
        
        const now = new Date();
        const isMarketOpen = this.isMarketOpen();
        
        indicator.className = `market-status-indicator ${isMarketOpen ? 'open' : 'closed'}`;
        
        if (isMarketOpen) {
            indicator.innerHTML = '<span class="status-text">🟢 Market Open - Showing intraday changes from previous close</span>';
        } else {
            indicator.innerHTML = '<span class="status-text">🔴 Market Closed - Showing end-of-day changes from previous close</span>';
        }
    }

    renderMultiTimeframeChampions(allStocks) {
        const timeframes = ['1d', '1w', '2w', '1m'];
        const validStocks = allStocks.filter(stock => 
            stock.changes && 
            timeframes.every(tf => 
                stock.changes[tf] !== null && 
                stock.changes[tf] !== undefined
            )
        );

        if (validStocks.length === 0) {
            document.getElementById('overall-champions-gainers').innerHTML = '<div class="gl-empty">No data available</div>';
            document.getElementById('overall-champions-losers').innerHTML = '<div class="gl-empty">No data available</div>';
            return;
        }

        // Score stocks based on their rankings across timeframes
        const championScores = validStocks.map(stock => {
            let gainersScore = 0;
            let losersScore = 0;
            let appearances = 0;
            
            // Find the best timeframe for this stock (highest positive change for gainers, most negative for losers)
            let bestTimeframe = '1d';
            let bestChange = stock.changes['1d'];
            
            timeframes.forEach(timeframe => {
                if (Math.abs(stock.changes[timeframe]) > Math.abs(bestChange)) {
                    bestTimeframe = timeframe;
                    bestChange = stock.changes[timeframe];
                }
            });

            timeframes.forEach((timeframe, index) => {
                // Sort all stocks by this timeframe
                const sorted = [...validStocks].sort((a, b) => 
                    (b.changes[timeframe] || -999999) - (a.changes[timeframe] || -999999)
                );

                const stockIndex = sorted.findIndex(s => s.ticker === stock.ticker);
                const ranking = stockIndex + 1;
                const totalStocks = sorted.length;

                // Weight: Daily=4, Weekly=3, 2Week=2, Monthly=1
                const weight = 4 - index;

                // Top 5 gainers scoring
                if (ranking <= 5) {
                    gainersScore += (6 - ranking) * weight; // 5pts for #1, 4pts for #2, etc.
                    appearances++;
                }

                // Top 5 losers scoring (from the bottom)
                if (ranking > totalStocks - 5) {
                    const bottomRank = totalStocks - ranking + 1; // 1=worst, 2=2nd worst, etc.
                    losersScore += bottomRank * weight;
                    appearances++;
                }
            });

            return {
                ...stock,
                gainersScore,
                losersScore,
                appearances,
                dominance: Math.max(gainersScore, losersScore),
                bestTimeframe,
                bestChange
            };
        });

        // Get elite gainers (high gainers score, multiple appearances)
        const eliteGainers = championScores
            .filter(stock => stock.gainersScore > 0 && stock.appearances >= 2)
            .sort((a, b) => b.gainersScore - a.gainersScore)
            .slice(0, 5);

        // Get consistent losers (high losers score, multiple appearances)
        const consistentLosers = championScores
            .filter(stock => stock.losersScore > 0 && stock.appearances >= 2)
            .sort((a, b) => b.losersScore - a.losersScore)
            .slice(0, 5);

        // Render elite gainers
        document.getElementById('overall-champions-gainers').innerHTML = 
            eliteGainers.map(stock => this.createChampionItem(stock, 'gainer')).join('');

        // Render consistent losers
        document.getElementById('overall-champions-losers').innerHTML = 
            consistentLosers.map(stock => this.createChampionItem(stock, 'loser')).join('');
    }

    createChampionItem(stock, type) {
        const itemClass = type === 'gainer' ? 'gainer' : 'loser';
        const displayName = SHORT_NAMES[stock.ticker] || stock.name || stock.ticker;
        
        // Determine badge based on appearances
        let badge = '';
        if (stock.appearances >= 4) {
            badge = '<span class="champions-badge">4x</span>';
        } else if (stock.appearances >= 3) {
            badge = '<span class="champions-badge">3x</span>';
        } else if (stock.appearances >= 2) {
            badge = '<span class="champions-badge">2x</span>';
        }

        // Use the best performing timeframe for the percentage
        const bestChange = stock.bestTimeframe ? stock.changes[stock.bestTimeframe] : 0;
        const changeClass = bestChange >= 0 ? 'positive' : 'negative';

        return `
            <div class="gl-item ${itemClass}">
                <div class="gl-stock-info">
                    <div class="gl-ticker">${stock.ticker}${badge}</div>
                    <div class="gl-name">${displayName}</div>
                </div>
                <div class="gl-change ${changeClass}">
                    ${bestChange >= 0 ? '+' : ''}${bestChange.toFixed(2)}%
                </div>
            </div>
        `;
    }

    renderSectorAnalysis(sectorId, sectorData) {
        if (!sectorData || sectorData.size === 0) {
            return;
        }

        const stocks = Array.from(sectorData.values()).filter(stock => stock !== null);
        
        
        // Calculate equal-weighted portfolio returns
        const timeframes = ['1d', '1w', '2w', '1m', '2m', '3m', '6m', 'ytd'];
        const returns = {};
        
        timeframes.forEach(timeframe => {
            const validChanges = stocks
                .map(stock => stock.changes[timeframe])
                .filter(change => change !== null && change !== undefined && !isNaN(change));
            
            if (validChanges.length > 0) {
                // Calculate median for more robust average
                const sortedChanges = validChanges.sort((a, b) => a - b);
                const middle = Math.floor(sortedChanges.length / 2);
                returns[timeframe] = sortedChanges.length % 2 === 0
                    ? (sortedChanges[middle - 1] + sortedChanges[middle]) / 2
                    : sortedChanges[middle];
            } else {
                returns[timeframe] = 0;
            }
        });

        // Calculate percentage above moving averages
        const maStats = {
            above50SMA: 0,
            above100SMA: 0,
            above200SMA: 0,
            above8EMA: 0,
            above13EMA: 0,
            above21EMA: 0
        };

        const totalStocks = stocks.length;
        stocks.forEach(stock => {
            if (stock.comparisons) {
                if (stock.comparisons.above50SMA) maStats.above50SMA++;
                if (stock.comparisons.above100SMA) maStats.above100SMA++;
                if (stock.comparisons.above200SMA) maStats.above200SMA++;
                if (stock.comparisons.above8EMA) maStats.above8EMA++;
                if (stock.comparisons.above13EMA) maStats.above13EMA++;
                if (stock.comparisons.above21EMA) maStats.above21EMA++;
            }
        });

        // Convert to percentages
        Object.keys(maStats).forEach(key => {
            maStats[key] = totalStocks > 0 ? ((maStats[key] / totalStocks) * 100).toFixed(1) : '0.0';
        });

        // Update the UI
        timeframes.forEach(timeframe => {
            const elementId = `${sectorId}-return-${timeframe}`;
            const element = document.getElementById(elementId);
            if (element) {
                const value = returns[timeframe];
                element.textContent = `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
                element.className = `return-value ${value >= 0 ? 'positive' : 'negative'}`;
            }
        });

        // Update moving average stats
        const maMapping = {
            above50SMA: `${sectorId}-above-50sma`,
            above100SMA: `${sectorId}-above-100sma`,
            above200SMA: `${sectorId}-above-200sma`,
            above8EMA: `${sectorId}-above-8ema`,
            above13EMA: `${sectorId}-above-13ema`,
            above21EMA: `${sectorId}-above-21ema`
        };

        Object.keys(maMapping).forEach(key => {
            const element = document.getElementById(maMapping[key]);
            if (element) {
                element.textContent = `${maStats[key]}%`;
            }
        });
    }
}

// Global functions for column controls
function toggleColumnDropdown(event) {
    // Close all other dropdowns first
    document.querySelectorAll('.column-dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
        const arrow = dropdown.querySelector('.column-dropdown-arrow');
        if (arrow) arrow.textContent = '▼';
    });
    
    // Open the clicked dropdown
    const clickedDropdown = event.target.closest('.column-dropdown');
    const arrow = clickedDropdown.querySelector('.column-dropdown-arrow');
    
    clickedDropdown.classList.add('open');
    if (arrow) arrow.textContent = '▲';
}

function showAllColumns() {
    const dashboard = window.dashboard;
    if (dashboard) {
        dashboard.allColumns.forEach(column => {
            dashboard.hiddenColumns.delete(column.id);
            dashboard.applyColumnVisibility(column.id, true);
        });
        dashboard.populateColumnToggles();
        localStorage.setItem('hiddenColumns', JSON.stringify([]));
    }
}

function hideAllColumns() {
    const dashboard = window.dashboard;
    if (dashboard) {
        // Keep essential columns visible
        const essentialColumns = ['ticker', 'name', 'currentPrice', '1d'];
        
        dashboard.allColumns.forEach(column => {
            if (!essentialColumns.includes(column.id)) {
                dashboard.hiddenColumns.add(column.id);
                dashboard.applyColumnVisibility(column.id, false);
            }
        });
        dashboard.populateColumnToggles();
        localStorage.setItem('hiddenColumns', JSON.stringify([...dashboard.hiddenColumns]));
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const clickedDropdown = event.target.closest('.column-dropdown');
    
    // Close all dropdowns if clicking outside of any dropdown
    if (!clickedDropdown) {
        document.querySelectorAll('.column-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
            const arrow = dropdown.querySelector('.column-dropdown-arrow');
            if (arrow) arrow.textContent = '▼';
        });
    }
});

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new StockDashboard();
});