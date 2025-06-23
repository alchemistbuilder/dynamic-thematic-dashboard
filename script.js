// Configuration
const API_KEY = 'WLIqlQJDbnkp9ke0IEtulkjvpfM7e9Nq'; // Maximum plan - unlimited calls
const LIBERATION_DAY = new Date('2025-04-02');
const USE_POLYGON = true; // Set to false to use Yahoo Finance

// Your exact ticker list
const STOCK_TICKERS = [
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

// Crypto currencies
const CRYPTO_TICKERS = ['X:BTCUSD', 'X:SOLUSD'];

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

class StockDashboard {
    constructor() {
        this.stockData = new Map();
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
    }

    bindEvents() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadData();
        });

        // Add sorting functionality
        document.querySelectorAll('th.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sortTable(column);
            });
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
            this.renderTable();
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
        const allTickers = [...STOCK_TICKERS, ...CRYPTO_TICKERS];
        console.log('Fetching data for tickers:', allTickers);
        
        if (USE_POLYGON) {
            // Polygon paid tier - fetch all in parallel for instant loading
            const promises = allTickers.map(ticker => this.fetchStockData(ticker));
            const results = await Promise.allSettled(promises);
            
            let successCount = 0;
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    this.stockData.set(allTickers[index], result.value);
                    successCount++;
                } else {
                    console.error(`Failed to fetch data for ${allTickers[index]}:`, result.reason || 'No data');
                }
            });
            
            console.log(`Successfully fetched data for ${successCount}/${allTickers.length} tickers`);
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
                return this.processStockData(ticker, data.results);
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
                return this.processStockData(ticker, historicalData);
            } catch (error) {
                console.error(`Error fetching ${ticker}:`, error);
                return null;
            }
        }
    }

    processStockData(ticker, historicalData) {
        const sortedData = historicalData.sort((a, b) => a.t - b.t);
        const currentPrice = sortedData[sortedData.length - 1].c;
        
        // Calculate percentage changes
        const changes = this.calculatePercentageChanges(sortedData, currentPrice);
        
        // Calculate Liberation Day change
        const liberationChange = this.calculateLiberationDayChange(sortedData, currentPrice);
        
        // Calculate moving averages
        const movingAverages = this.calculateMovingAverages(sortedData);
        
        // Calculate 52-week high
        const week52High = this.calculate52WeekHigh(sortedData);
        
        // Calculate comparison indicators
        const comparisons = this.calculateComparisons(currentPrice, movingAverages, week52High);
        
        // Determine trends
        const shortTermTrend = this.determineShortTermTrend(movingAverages);
        const longTermTrend = this.determineLongTermTrend(movingAverages);

        return {
            ticker,
            name: STOCK_NAMES[ticker] || ticker,
            currentPrice,
            liberationChange,
            changes,
            movingAverages,
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
            default:
                return 0;
        }
    }

    renderTable() {
        const tbody = document.getElementById('stockTableBody');
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

        // Top 5 Most Bullish
        const topBullish = scoredStocks
            .sort((a, b) => b.bullishScore - a.bullishScore)
            .slice(0, 5);
        this.populateStockList('bullishList', topBullish, 'bullish');

        // Top 3 Most Bearish
        const topBearish = scoredStocks
            .sort((a, b) => b.bearishScore - a.bearishScore)
            .slice(0, 3);
        this.populateStockList('bearishList', topBearish, 'bearish');

        // Top 3 Best Performers
        const topPerformers = scoredStocks
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, 3);
        this.populateStockList('performersList', topPerformers, 'performer');

        // Top 3 Breakout Candidates
        const topBreakouts = scoredStocks
            .sort((a, b) => b.breakoutScore - a.breakoutScore)
            .slice(0, 3);
        this.populateStockList('breakoutList', topBreakouts, 'breakout');
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
        `;
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