// Temporary analysis function to identify interesting stocks
// This would analyze your live data to find hidden signals

function analyzeMarketData(allDatasets) {
    const allStocks = [
        ...Array.from(allDatasets.sectorData.values()),
        ...Array.from(allDatasets.growthData.values()),
        ...Array.from(allDatasets.compounderData.values()),
        ...Array.from(allDatasets.mag7Data.values())
    ].filter(stock => stock !== null);

    console.log(`🔍 ANALYZING ${allStocks.length} STOCKS FOR HIDDEN GEMS...`);
    console.log('=' .repeat(60));

    // 1. HIGH SHARPE RATIO CANDIDATES (High returns, low volatility)
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

    console.log('🎯 HIGH SHARPE RATIO CANDIDATES (High Return/Low Volatility):');
    highSharpeStocks.forEach(s => {
        console.log(`${s.ticker.padEnd(6)} | Lib: ${(s.liberationChange || 0).toFixed(1)}% | 1M: ${(s.changes['1m'] || 0).toFixed(1)}% | Sharpe: ${s.sharpeScore.toFixed(2)}`);
    });

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

    console.log('\n🚀 MOMENTUM ACCELERATION PLAYS:');
    momentumAccel.forEach(s => {
        console.log(`${s.ticker.padEnd(6)} | 1W: ${(s.changes['1w'] || 0).toFixed(1)}% | 1M: ${(s.changes['1m'] || 0).toFixed(1)}% | Days Up: ${s.consecutiveUpDays || 0}`);
    });

    // 3. STEALTH PERFORMERS (Good fundamentals, under the radar)
    const stealthPerformers = allStocks
        .filter(s => s.liberationChange > 20) // Strong Liberation performance
        .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) < -15) // Still well below 52w high
        .filter(s => s.comparisons.ema8Above13Above21 && 
                    ['ST BULLISH', 'EMA Bullish', 'Uptrend Maintained'].includes(s.comparisons.ema8Above13Above21))
        .filter(s => (s.rsiData.rsi14 || 50) < 70) // Not overbought
        .sort((a, b) => (b.liberationChange || 0) - (a.liberationChange || 0))
        .slice(0, 6);

    console.log('\n🥷 STEALTH PERFORMERS (Strong but under radar):');
    stealthPerformers.forEach(s => {
        console.log(`${s.ticker.padEnd(6)} | Lib: ${(s.liberationChange || 0).toFixed(1)}% | 52W Delta: ${(s.comparisons.deltaFrom52WeekHigh || 0).toFixed(1)}% | RSI: ${(s.rsiData.rsi14 || 0).toFixed(0)}`);
    });

    // 4. TECHNICAL BREAKOUT SETUPS
    const breakoutSetups = allStocks
        .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) > -8) // Very close to 52w high
        .filter(s => (s.changes['1w'] || 0) > 0) // Positive weekly momentum
        .filter(s => (s.consecutiveUpDays || 0) >= 1) // Recent upward movement
        .filter(s => s.comparisons.above50SMA && s.comparisons.above100SMA) // Above key SMAs
        .sort((a, b) => (b.comparisons.deltaFrom52WeekHigh || -100) - (a.comparisons.deltaFrom52WeekHigh || -100))
        .slice(0, 5);

    console.log('\n⚡ TECHNICAL BREAKOUT SETUPS:');
    breakoutSetups.forEach(s => {
        console.log(`${s.ticker.padEnd(6)} | 52W: ${(s.comparisons.deltaFrom52WeekHigh || 0).toFixed(1)}% | 1W: ${(s.changes['1w'] || 0).toFixed(1)}% | EMA: ${s.comparisons.ema8Above13Above21}`);
    });

    // 5. VALUE WITH MOMENTUM (Recovering strong companies)
    const valueWithMomentum = allStocks
        .filter(s => (s.changes['3m'] || 0) > 10) // Strong 3-month trend
        .filter(s => (s.changes['1m'] || 0) > 5) // Positive recent momentum
        .filter(s => (s.comparisons.deltaFrom52WeekHigh || -100) < -20) // Still discounted from highs
        .filter(s => s.comparisons.sma50Above100Above200 === 'BULLISH' || s.comparisons.sma50Above100Above200 === 'Healthy')
        .sort((a, b) => (b.changes['3m'] || 0) - (a.changes['3m'] || 0))
        .slice(0, 6);

    console.log('\n💎 VALUE WITH MOMENTUM (Recovery plays):');
    valueWithMomentum.forEach(s => {
        console.log(`${s.ticker.padEnd(6)} | 3M: ${(s.changes['3m'] || 0).toFixed(1)}% | 1M: ${(s.changes['1m'] || 0).toFixed(1)}% | SMA Trend: ${s.comparisons.sma50Above100Above200}`);
    });

    // 6. CONTRARIAN OVERSOLD PLAYS
    const oversoldBounce = allStocks
        .filter(s => (s.rsiData.rsi14 || 50) < 35) // Oversold RSI
        .filter(s => (s.changes['1w'] || 0) > -10) // Not in free fall
        .filter(s => s.liberationChange > 0) // Still positive long-term
        .filter(s => s.comparisons.above200SMA) // Above long-term trend
        .sort((a, b) => (a.rsiData.rsi14 || 50) - (b.rsiData.rsi14 || 50)) // Most oversold first
        .slice(0, 5);

    console.log('\n🔄 CONTRARIAN OVERSOLD PLAYS:');
    oversoldBounce.forEach(s => {
        console.log(`${s.ticker.padEnd(6)} | RSI: ${(s.rsiData.rsi14 || 0).toFixed(0)} | Lib: ${(s.liberationChange || 0).toFixed(1)}% | 1W: ${(s.changes['1w'] || 0).toFixed(1)}%`);
    });

    console.log('\n' + '=' .repeat(60));
    console.log('🎯 ANALYSIS COMPLETE - These patterns suggest interesting opportunities!');
    
    return {
        highSharpe: highSharpeStocks,
        momentum: momentumAccel,
        stealth: stealthPerformers,
        breakouts: breakoutSetups,
        value: valueWithMomentum,
        oversold: oversoldBounce
    };
}

// Usage: Call this function with your dashboard's data
// const results = analyzeMarketData({
//     sectorData: this.sectorData,
//     growthData: this.growthData,
//     compounderData: this.compounderData,
//     mag7Data: this.mag7Data
// });