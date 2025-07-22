// lecture-interactive.js
// Interactive elements for PSTAT 5A Lecture 9: Sampling and Confidence Intervals

// Global variables for charts
let charts = {};
let currentPopulation = [];
let sampleMeans = [];

// Utility functions
function normalRandom(mean = 0, std = 1) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * std + mean;
}

function uniformRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function exponentialRandom(lambda) {
    return -Math.log(Math.random()) / lambda;
}

function tCritical(df, alpha) {
    // Approximation for t-critical values
    const z = {
        0.10: 1.645,
        0.05: 1.96,
        0.025: 2.24,
        0.01: 2.576,
        0.005: 2.807
    };
    
    if (df >= 30) return z[alpha/2] || 1.96;
    
    // Simple approximation for smaller df
    const correction = 1 + (1/(4*df)) + (5/(96*df*df));
    return (z[alpha/2] || 1.96) * correction;
}

function zCritical(alpha) {
    const z = {
        0.10: 1.645,
        0.05: 1.96,
        0.01: 2.576
    };
    return z[alpha] || 1.96;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Initialize all charts
    initializeInferenceChart();
    initializeUncertaintyChart();
    initializeSamplingDistChart();
    initializeCLTSamplingChart();
    initializeCIConceptChart();
    initializeCIMeanChart();
    initializeCIPropChart();
    initializeSampleSizeChart();
}

// Chart 1: Inference Review
function initializeInferenceChart() {
    const ctx = document.getElementById('inferenceReview');
    if (!ctx) return;
    
    charts.inference = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Population (Unknown)', 'Sample (Observed)'],
            datasets: [{
                data: [85, 15],
                backgroundColor: ['#e5e7eb', '#3b82f6'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Population vs Sample'
                }
            }
        }
    });
}

// Chart 2: Uncertainty Review
function initializeUncertaintyChart() {
    const ctx = document.getElementById('uncertaintyReview');
    if (!ctx) return;
    
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push({
            x: normalRandom(50, 2),
            y: Math.random() * 0.1 + 0.45
        });
    }
    
    charts.uncertainty = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Point Estimates',
                data: data,
                backgroundColor: '#3b82f6',
                pointRadius: 3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Estimate Value'
                    }
                },
                y: {
                    display: false
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Uncertainty in Estimates'
                }
            }
        }
    });
}

// Chart 3: Sampling Distribution
function initializeSamplingDistChart() {
    const ctx = document.getElementById('samplingDistChart');
    if (!ctx) return;
    
    updateSamplingDistChart(30);
}

function updateSamplingDistChart(n) {
    const ctx = document.getElementById('samplingDistChart');
    if (!ctx) return;
    
    // Generate sampling distribution
    const populationMean = 50;
    const populationSD = 10;
    const sampleSize = n;
    const standardError = populationSD / Math.sqrt(sampleSize);
    
    const xValues = [];
    const yValues = [];
    
    for (let x = populationMean - 4*standardError; x <= populationMean + 4*standardError; x += standardError/10) {
        xValues.push(x);
        const z = (x - populationMean) / standardError;
        yValues.push(Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI) / standardError);
    }
    
    if (charts.samplingDist) {
        charts.samplingDist.destroy();
    }
    
    charts.samplingDist = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues.map(x => x.toFixed(1)),
            datasets: [{
                label: 'Sampling Distribution',
                data: yValues,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Sample Mean'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Density'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Sampling Distribution (n=${sampleSize}, SE=${standardError.toFixed(2)})`
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Chart 4: CLT Sampling Demo
function initializeCLTSamplingChart() {
    const ctx = document.getElementById('cltSamplingChart');
    if (!ctx) return;
    
    updateCLTSamplingDemo();
}

function updateCLTSamplingDemo() {
    const populationType = document.getElementById('cltSamplingPopulation')?.value || 'uniform';
    generatePopulation(populationType);
    updateCLTDisplay();
}

function generatePopulation(type) {
    currentPopulation = [];
    
    switch(type) {
        case 'uniform':
            for (let i = 0; i < 10000; i++) {
                currentPopulation.push(uniformRandom(0, 10));
            }
            break;
        case 'exponential':
            for (let i = 0; i < 10000; i++) {
                currentPopulation.push(exponentialRandom(0.5));
            }
            break;
        case 'bimodal':
            for (let i = 0; i < 10000; i++) {
                if (Math.random() < 0.5) {
                    currentPopulation.push(normalRandom(3, 1));
                } else {
                    currentPopulation.push(normalRandom(7, 1));
                }
            }
            break;
        case 'skewed':
            for (let i = 0; i < 10000; i++) {
                let x = Math.random();
                currentPopulation.push(Math.pow(x, 2) * 10);
            }
            break;
    }
}

function updateCLTDisplay() {
    const ctx = document.getElementById('cltSamplingChart');
    if (!ctx) return;
    
    // Create histogram of population
    const bins = 50;
    const min = Math.min(...currentPopulation);
    const max = Math.max(...currentPopulation);
    const binWidth = (max - min) / bins;
    
    const histogram = new Array(bins).fill(0);
    currentPopulation.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[binIndex]++;
    });
    
    const binLabels = [];
    for (let i = 0; i < bins; i++) {
        binLabels.push((min + i * binWidth).toFixed(1));
    }
    
    if (charts.cltSampling) {
        charts.cltSampling.destroy();
    }
    
    charts.cltSampling = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Population Distribution',
                data: histogram,
                backgroundColor: '#3b82f6',
                alpha: 0.7
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Population Distribution'
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Update stats
    const mean = currentPopulation.reduce((a, b) => a + b, 0) / currentPopulation.length;
    document.getElementById('populationMean').textContent = mean.toFixed(2);
}

function runSamplingSimulation() {
    const sampleSize = parseInt(document.getElementById('cltSamplingSize')?.value) || 30;
    sampleMeans = [];
    
    // Generate 1000 sample means
    for (let i = 0; i < 1000; i++) {
        let sampleSum = 0;
        for (let j = 0; j < sampleSize; j++) {
            const randomIndex = Math.floor(Math.random() * currentPopulation.length);
            sampleSum += currentPopulation[randomIndex];
        }
        sampleMeans.push(sampleSum / sampleSize);
    }
    
    // Update chart with sample means
    updateSampleMeansChart();
    updateSamplingStats();
}

function updateSampleMeansChart() {
    const ctx = document.getElementById('cltSamplingChart');
    if (!ctx) return;
    
    // Create histogram of sample means
    const bins = 30;
    const min = Math.min(...sampleMeans);
    const max = Math.max(...sampleMeans);
    const binWidth = (max - min) / bins;
    
    const histogram = new Array(bins).fill(0);
    sampleMeans.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogram[binIndex]++;
    });
    
    const binLabels = [];
    for (let i = 0; i < bins; i++) {
        binLabels.push((min + i * binWidth).toFixed(2));
    }
    
    charts.cltSampling.destroy();
    
    charts.cltSampling = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: 'Sample Means Distribution',
                data: histogram,
                backgroundColor: '#ef4444',
                alpha: 0.7
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Sample Mean'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distribution of Sample Means (CLT in Action!)'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function updateSamplingStats() {
    const sampleSize = parseInt(document.getElementById('cltSamplingSize')?.value) || 30;
    const populationMean = currentPopulation.reduce((a, b) => a + b, 0) / currentPopulation.length;
    const sampleMeansMean = sampleMeans.reduce((a, b) => a + b, 0) / sampleMeans.length;
    
    // Calculate population standard deviation
    const populationVariance = currentPopulation.reduce((sum, x) => sum + Math.pow(x - populationMean, 2), 0) / currentPopulation.length;
    const populationSD = Math.sqrt(populationVariance);
    const theoreticalSE = populationSD / Math.sqrt(sampleSize);
    
    document.getElementById('populationMean').textContent = populationMean.toFixed(2);
    document.getElementById('sampleMeansMean').textContent = sampleMeansMean.toFixed(2);
    document.getElementById('standardError').textContent = theoreticalSE.toFixed(2);
}

// Chart 5: CI Concept
function initializeCIConceptChart() {
    const ctx = document.getElementById('ciConceptChart');
    if (!ctx) return;
    
    generateCIConceptDemo();
}

function generateCIConceptDemo() {
    const ctx = document.getElementById('ciConceptChart');
    if (!ctx) return;
    
    const trueMean = 50;
    const intervals = [];
    const colors = [];
    
    // Generate 20 confidence intervals
    for (let i = 0; i < 20; i++) {
        const sampleMean = normalRandom(trueMean, 2);
        const marginError = 1.96 * 2; // 95% CI with SE = 2
        const lower = sampleMean - marginError;
        const upper = sampleMean + marginError;
        
        intervals.push({
            label: `CI ${i+1}`,
            lower: lower,
            upper: upper,
            captures: lower <= trueMean && trueMean <= upper
        });
        
        colors.push(intervals[i].captures ? '#10b981' : '#ef4444');
    }
    
    if (charts.ciConcept) {
        charts.ciConcept.destroy();
    }
    
    charts.ciConcept = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: intervals.map(ci => ci.label),
            datasets: [{
                label: 'CI Lower',
                data: intervals.map(ci => ci.lower),
                backgroundColor: 'rgba(0,0,0,0)'
            }, {
                label: 'CI Width',
                data: intervals.map(ci => ci.upper - ci.lower),
                backgroundColor: colors.map(c => c + '80'),
                borderColor: colors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '20 Confidence Intervals (Green = Captures μ, Red = Misses)'
                },
                legend: {
                    display: false
                }
            },
            onClick: generateCIConceptDemo
        }
    });
}

// Chart 6: CI for Means Demo
function initializeCIMeanChart() {
    const ctx = document.getElementById('ciMeanChart');
    if (!ctx) return;
    
    updateCIMeanDemo();
}

function updateCIMeanDemo() {
    // Initialize with default values
    generateCIMean();
}

function generateCIMean() {
    const n = parseInt(document.getElementById('ciMeanSampleSize')?.value) || 25;
    const confLevel = parseInt(document.getElementById('ciMeanConfLevel')?.value) || 95;
    const popMean = parseFloat(document.getElementById('ciMeanPopMean')?.value) || 50;
    const popSD = parseFloat(document.getElementById('ciMeanPopSD')?.value) || 10;
    
    // Generate sample
    let sample = [];
    for (let i = 0; i < n; i++) {
        sample.push(normalRandom(popMean, popSD));
    }
    
    const sampleMean = sample.reduce((a, b) => a + b, 0) / n;
    const sampleSD = Math.sqrt(sample.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0) / (n - 1));
    
    // Calculate CI
    const alpha = (100 - confLevel) / 100;
    const tCrit = tCritical(n - 1, alpha);
    const se = sampleSD / Math.sqrt(n);
    const marginError = tCrit * se;
    
    const ciLower = sampleMean - marginError;
    const ciUpper = sampleMean + marginError;
    const capturesMu = ciLower <= popMean && popMean <= ciUpper;
    
    // Update display
    document.getElementById('currentCI').textContent = `(${ciLower.toFixed(2)}, ${ciUpper.toFixed(2)})`;
    document.getElementById('capturesMu').textContent = capturesMu ? 'Yes ✓' : 'No ✗';
    document.getElementById('capturesMu').style.color = capturesMu ? '#10b981' : '#ef4444';
    document.getElementById('marginError').textContent = marginError.toFixed(2);
    
    // Update chart
    updateCIMeanChart(sampleMean, ciLower, ciUpper, popMean, capturesMu);
}

function updateCIMeanChart(sampleMean, ciLower, ciUpper, popMean, captures) {
    const ctx = document.getElementById('ciMeanChart');
    if (!ctx) return;
    
    if (charts.ciMean) {
        charts.ciMean.destroy();
    }
    
    charts.ciMean = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Sample Mean',
                data: [{x: sampleMean, y: 1}],
                backgroundColor: '#3b82f6',
                pointRadius: 8
            }, {
                label: 'Population Mean',
                data: [{x: popMean, y: 1}],
                backgroundColor: '#ef4444',
                pointRadius: 8,
                pointStyle: 'triangle'
            }, {
                label: 'Confidence Interval',
                data: [{x: ciLower, y: 1}, {x: ciUpper, y: 1}],
                backgroundColor: captures ? '#10b981' : '#ef4444',
                borderColor: captures ? '#10b981' : '#ef4444',
                showLine: true,
                pointRadius: 4,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                },
                y: {
                    display: false,
                    min: 0.5,
                    max: 1.5
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Confidence Interval ${captures ? 'Captures' : 'Misses'} Population Mean`
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function simulate100CIs() {
    const n = parseInt(document.getElementById('ciMeanSampleSize')?.value) || 25;
    const confLevel = parseInt(document.getElementById('ciMeanConfLevel')?.value) || 95;
    const popMean = parseFloat(document.getElementById('ciMeanPopMean')?.value) || 50;
    const popSD = parseFloat(document.getElementById('ciMeanPopSD')?.value) || 10;
    
    let captureCount = 0;
    const intervals = [];
    
    for (let i = 0; i < 100; i++) {
        // Generate sample
        let sample = [];
        for (let j = 0; j < n; j++) {
            sample.push(normalRandom(popMean, popSD));
        }
        
        const sampleMean = sample.reduce((a, b) => a + b, 0) / n;
        const sampleSD = Math.sqrt(sample.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0) / (n - 1));
        
        // Calculate CI
        const alpha = (100 - confLevel) / 100;
        const tCrit = tCritical(n - 1, alpha);
        const se = sampleSD / Math.sqrt(n);
        const marginError = tCrit * se;
        
        const ciLower = sampleMean - marginError;
        const ciUpper = sampleMean + marginError;
        const captures = ciLower <= popMean && popMean <= ciUpper;
        
        if (captures) captureCount++;
        intervals.push({lower: ciLower, upper: ciUpper, captures: captures});
    }
    
    // Update chart with all intervals
    updateCI100Chart(intervals, popMean, captureCount);
}

function updateCI100Chart(intervals, popMean, captureCount) {
    const ctx = document.getElementById('ciMeanChart');
    if (!ctx) return;
    
    if (charts.ciMean) {
        charts.ciMean.destroy();
    }
    
    const datasets = [];
    
    // Add intervals
    intervals.forEach((interval, i) => {
        datasets.push({
            label: i === 0 ? 'Confidence Intervals' : '',
            data: [{x: interval.lower, y: i+1}, {x: interval.upper, y: i+1}],
            backgroundColor: interval.captures ? '#10b981' : '#ef4444',
            borderColor: interval.captures ? '#10b981' : '#ef4444',
            showLine: true,
            pointRadius: 1,
            borderWidth: 1
        });
    });
    
    // Add population mean line
    datasets.push({
        label: 'Population Mean',
        data: [{x: popMean, y: 0}, {x: popMean, y: 101}],
        backgroundColor: '#1f2937',
        borderColor: '#1f2937',
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5]
    });
    
    charts.ciMean = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Interval Number'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `100 CIs: ${captureCount}/100 captured μ (${captureCount}%)`
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Chart 7: CI for Proportions Demo
function initializeCIPropChart() {
    const ctx = document.getElementById('ciPropChart');
    if (!ctx) return;
    
    updateCIPropDemo();
}

function updateCIPropDemo() {
    generateCIProp();
}

function generateCIProp() {
    const n = parseInt(document.getElementById('ciPropSampleSize')?.value) || 100;
    const confLevel = parseInt(document.getElementById('ciPropConfLevel')?.value) || 95;
    const popProp = parseFloat(document.getElementById('ciPropPopProp')?.value) || 0.3;
    
    // Generate sample
    let successes = 0;
    for (let i = 0; i < n; i++) {
        if (Math.random() < popProp) successes++;
    }
    
    const sampleProp = successes / n;
    
    // Calculate CI
    const alpha = (100 - confLevel) / 100;
    const zCrit = zCritical(alpha);
    const se = Math.sqrt((sampleProp * (1 - sampleProp)) / n);
    const marginError = zCrit * se;
    
    const ciLower = Math.max(0, sampleProp - marginError);
    const ciUpper = Math.min(1, sampleProp + marginError);
    const capturesP = ciLower <= popProp && popProp <= ciUpper;
    
    // Update display
    document.getElementById('currentPropCI').textContent = `(${ciLower.toFixed(3)}, ${ciUpper.toFixed(3)})`;
    document.getElementById('capturesProp').textContent = capturesP ? 'Yes ✓' : 'No ✗';
    document.getElementById('capturesProp').style.color = capturesP ? '#10b981' : '#ef4444';
    document.getElementById('sampleProp').textContent = sampleProp.toFixed(3);
    
    // Update chart
    updateCIPropChart(sampleProp, ciLower, ciUpper, popProp, capturesP);
}

function updateCIPropChart(sampleProp, ciLower, ciUpper, popProp, captures) {
    const ctx = document.getElementById('ciPropChart');
    if (!ctx) return;
    
    if (charts.ciProp) {
        charts.ciProp.destroy();
    }
    
    charts.ciProp = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Sample Proportion',
                data: [{x: sampleProp, y: 1}],
                backgroundColor: '#3b82f6',
                pointRadius: 8
            }, {
                label: 'Population Proportion',
                data: [{x: popProp, y: 1}],
                backgroundColor: '#ef4444',
                pointRadius: 8,
                pointStyle: 'triangle'
            }, {
                label: 'Confidence Interval',
                data: [{x: ciLower, y: 1}, {x: ciUpper, y: 1}],
                backgroundColor: captures ? '#10b981' : '#ef4444',
                borderColor: captures ? '#10b981' : '#ef4444',
                showLine: true,
                pointRadius: 4,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Proportion'
                    },
                    min: 0,
                    max: 1
                },
                y: {
                    display: false,
                    min: 0.5,
                    max: 1.5
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Confidence Interval ${captures ? 'Captures' : 'Misses'} Population Proportion`
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function simulate100PropCIs() {
    const n = parseInt(document.getElementById('ciPropSampleSize')?.value) || 100;
    const confLevel = parseInt(document.getElementById('ciPropConfLevel')?.value) || 95;
    const popProp = parseFloat(document.getElementById('ciPropPopProp')?.value) || 0.3;
    
    let captureCount = 0;
    const intervals = [];
    
    for (let i = 0; i < 100; i++) {
        // Generate sample
        let successes = 0;
        for (let j = 0; j < n; j++) {
            if (Math.random() < popProp) successes++;
        }
        
        const sampleProp = successes / n;
        
        // Calculate CI
        const alpha = (100 - confLevel) / 100;
        const zCrit = zCritical(alpha);
        const se = Math.sqrt((sampleProp * (1 - sampleProp)) / n);
        const marginError = zCrit * se;
        
        const ciLower = Math.max(0, sampleProp - marginError);
        const ciUpper = Math.min(1, sampleProp + marginError);
        const captures = ciLower <= popProp && popProp <= ciUpper;
        
        if (captures) captureCount++;
        intervals.push({lower: ciLower, upper: ciUpper, captures: captures});
    }
    
    // Update chart with all intervals
    updateProp100Chart(intervals, popProp, captureCount);
}

function updateProp100Chart(intervals, popProp, captureCount) {
    const ctx = document.getElementById('ciPropChart');
    if (!ctx) return;
    
    if (charts.ciProp) {
        charts.ciProp.destroy();
    }
    
    const datasets = [];
    
    // Add intervals
    intervals.forEach((interval, i) => {
        datasets.push({
            label: i === 0 ? 'Confidence Intervals' : '',
            data: [{x: interval.lower, y: i+1}, {x: interval.upper, y: i+1}],
            backgroundColor: interval.captures ? '#10b981' : '#ef4444',
            borderColor: interval.captures ? '#10b981' : '#ef4444',
            showLine: true,
            pointRadius: 1,
            borderWidth: 1
        });
    });
    
    // Add population proportion line
    datasets.push({
        label: 'Population Proportion',
        data: [{x: popProp, y: 0}, {x: popProp, y: 101}],
        backgroundColor: '#1f2937',
        borderColor: '#1f2937',
        showLine: true,
        pointRadius: 0,
        borderWidth: 2,
        borderDash: [5, 5]
    });
    
    charts.ciProp = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Proportion'
                    },
                    min: 0,
                    max: 1
                },
                y: {
                    title: {
                        display: true,
                        text: 'Interval Number'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `100 CIs: ${captureCount}/100 captured p (${captureCount}%)`
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Chart 8: Sample Size Demo
function initializeSampleSizeChart() {
    const ctx = document.getElementById('sampleSizeChart');
    if (!ctx) return;
    
    updateSampleSizeDemo();
}

function updateSampleSizeDemo() {
    const sigma = parseFloat(document.getElementById('sampleSizeSD')?.value) || 10;
    const confLevel = parseInt(document.getElementById('sampleSizeConfLevel')?.value) || 95;
    const desiredME = parseFloat(document.getElementById('desiredME')?.value) || 2;
    
    const alpha = (100 - confLevel) / 100;
    const zCrit = zCritical(alpha);
    
    // Calculate required sample size
    const requiredN = Math.ceil(Math.pow(zCrit * sigma / desiredME, 2));
    
    // Generate data for chart
    const sampleSizes = [];
    const marginErrors = [];
    
    for (let n = 10; n <= 500; n += 10) {
        sampleSizes.push(n);
        marginErrors.push(zCrit * sigma / Math.sqrt(n));
    }
    
    // Update display
    document.getElementById('requiredN').textContent = requiredN;
    document.getElementById('resultingME').textContent = (zCrit * sigma / Math.sqrt(requiredN)).toFixed(2);
    
    // Update chart
    if (charts.sampleSize) {
        charts.sampleSize.destroy();
    }
    
    charts.sampleSize = new Chart(document.getElementById('sampleSizeChart'), {
        type: 'line',
        data: {
            labels: sampleSizes,
            datasets: [{
                label: 'Margin of Error',
                data: marginErrors,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }, {
                label: 'Desired ME',
                data: sampleSizes.map(() => desiredME),
                borderColor: '#ef4444',
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Sample Size (n)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Margin of Error'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Sample Size vs Margin of Error (${confLevel}% confidence)`
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Solution toggle function
function toggleSolution(solutionId) {
    const solution = document.querySelector(`[data-id="${solutionId}"]`);
    if (solution) {
        solution.style.display = solution.style.display === 'none' ? 'block' : 'none';
    }
}

// Export functions for global access
window.updateCLTSamplingDemo = updateCLTSamplingDemo;
window.runSamplingSimulation = runSamplingSimulation;
window.updateCIMeanDemo = updateCIMeanDemo;
window.generateCIMean = generateCIMean;
window.simulate100CIs = simulate100CIs;
window.updateCIPropDemo = updateCIPropDemo;
window.generateCIProp = generateCIProp;
window.simulate100PropCIs = simulate100PropCIs;
window.updateSampleSizeDemo = updateSampleSizeDemo;
window.toggleSolution = toggleSolution;