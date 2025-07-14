// lecture-interactive.js
// Interactive elements for PSTAT 5A Lecture 9: Continuous Random Variables

// Global variables for charts
let discreteReviewChart, continuousReviewChart, continuousPointChart;
let pdfChart, cdfContinuousChart, contDistChart, normalChart;
let cltPopChart, cltSampleChart;

// Mathematical functions for distributions
const distributions = {
    // Normal distribution PDF
    normalPDF: (x, mu = 0, sigma = 1) => {
        const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mu) / sigma, 2);
        return coefficient * Math.exp(exponent);
    },
    
    // Normal distribution CDF (approximation)
    normalCDF: (x, mu = 0, sigma = 1) => {
        const z = (x - mu) / sigma;
        return 0.5 * (1 + erf(z / Math.sqrt(2)));
    },
    
    // Uniform distribution PDF
    uniformPDF: (x, a = 0, b = 1) => {
        return (x >= a && x <= b) ? 1 / (b - a) : 0;
    },
    
    // Exponential distribution PDF
    exponentialPDF: (x, lambda = 1) => {
        return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
    },
    
    // Exponential distribution CDF
    exponentialCDF: (x, lambda = 1) => {
        return x >= 0 ? 1 - Math.exp(-lambda * x) : 0;
    }
};

// Error function approximation for normal CDF
function erf(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
}

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    initDiscreteReviewChart();
    initContinuousReviewChart();
    initContinuousPointChart();
    initPDFChart();
    initCDFContinuousChart();
    initContinuousDistChart();
    initNormalChart();
    initCLTCharts();
}

// Discrete Review Chart
function initDiscreteReviewChart() {
    const ctx = document.getElementById('discreteReview');
    if (!ctx) return;
    
    discreteReviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [{
                label: 'P(X = k)',
                data: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 0.3,
                    title: {
                        display: true,
                        text: 'Probability'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Discrete: Fair Die Roll'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Continuous Review Chart
function initContinuousReviewChart() {
    const ctx = document.getElementById('continuousReview');
    if (!ctx) return;
    
    // Generate normal distribution curve
    const xValues = [];
    const yValues = [];
    for (let x = -4; x <= 4; x += 0.1) {
        xValues.push(x.toFixed(1));
        yValues.push(distributions.normalPDF(x, 0, 1));
    }
    
    continuousReviewChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'f(x)',
                data: yValues,
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                fill: true,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Density f(x)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Continuous: Normal Distribution'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Continuous Point Chart - shows why P(X = x) = 0
function initContinuousPointChart() {
    const ctx = document.getElementById('continuousPointChart');
    if (!ctx) return;
    
    const xValues = [];
    const yValues = [];
    for (let x = -3; x <= 3; x += 0.05) {
        xValues.push(x);
        yValues.push(distributions.normalPDF(x, 0, 1));
    }
    
    continuousPointChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'PDF',
                data: yValues,
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            onClick: (event, elements) => {
                showPointProbability();
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Density'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Why P(X = exact value) = 0?'
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function showPointProbability() {
    alert('A single point (like a vertical line) has zero width, so the area under the curve at any exact point is zero!\n\nThat\'s why P(X = any exact value) = 0 for continuous variables.');
}

// PDF Interactive Chart
function initPDFChart() {
    const ctx = document.getElementById('pdfChart');
    if (!ctx) return;
    
    updatePDFDemo();
}

function updatePDFDemo() {
    const pdfType = document.getElementById('pdfType')?.value || 'uniform';
    const intervalA = parseFloat(document.getElementById('intervalA')?.value || 1);
    const intervalB = parseFloat(document.getElementById('intervalB')?.value || 2);
    
    const ctx = document.getElementById('pdfChart');
    if (!ctx) return;
    
    if (pdfChart) {
        pdfChart.destroy();
    }
    
    let xValues = [];
    let yValues = [];
    let areaData = [];
    let prob = 0;
    
    if (pdfType === 'uniform') {
        for (let x = -1; x <= 4; x += 0.1) {
            xValues.push(x);
            yValues.push(distributions.uniformPDF(x, 0, 3));
            if (x >= intervalA && x <= intervalB) {
                areaData.push(distributions.uniformPDF(x, 0, 3));
            } else {
                areaData.push(null);
            }
        }
        prob = Math.max(0, Math.min(intervalB, 3) - Math.max(intervalA, 0)) / 3;
    } else if (pdfType === 'normal') {
        for (let x = -4; x <= 4; x += 0.1) {
            xValues.push(x);
            yValues.push(distributions.normalPDF(x, 0, 1));
            if (x >= intervalA && x <= intervalB) {
                areaData.push(distributions.normalPDF(x, 0, 1));
            } else {
                areaData.push(null);
            }
        }
        prob = distributions.normalCDF(intervalB, 0, 1) - distributions.normalCDF(intervalA, 0, 1);
    } else if (pdfType === 'exponential') {
        for (let x = 0; x <= 5; x += 0.1) {
            xValues.push(x);
            yValues.push(distributions.exponentialPDF(x, 1));
            if (x >= intervalA && x <= intervalB) {
                areaData.push(distributions.exponentialPDF(x, 1));
            } else {
                areaData.push(null);
            }
        }
        prob = distributions.exponentialCDF(intervalB, 1) - distributions.exponentialCDF(intervalA, 1);
    }
    
    pdfChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'PDF',
                data: yValues,
                borderColor: 'rgba(37, 99, 235, 1)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: false,
                borderWidth: 2,
                pointRadius: 0
            }, {
                label: 'Selected Area',
                data: areaData,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.4)',
                fill: true,
                borderWidth: 0,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Density f(x)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${pdfType.charAt(0).toUpperCase() + pdfType.slice(1)} Distribution PDF`
                },
                legend: {
                    display: true
                }
            }
        }
    });
    
    // Update probability display
    const pdfAreaText = document.getElementById('pdfAreaText');
    if (pdfAreaText) {
        pdfAreaText.textContent = `P(${intervalA} ≤ X ≤ ${intervalB}) = ${prob.toFixed(4)}`;
    }
}

// CDF Continuous Chart
function initCDFContinuousChart() {
    const ctx = document.getElementById('cdfContinuousChart');
    if (!ctx) return;

    const xValues = [];
    const cdfValues = [];
    for (let x = -4; x <= 4; x += 0.1) {
        xValues.push(x);
        cdfValues.push(distributions.normalCDF(x, 0, 1));
    }

    // Initial draggable line at x=0
    let dragX = 0;
    let dragIndex = xValues.findIndex(v => Math.abs(v - dragX) < 0.05);
    if (dragIndex === -1) dragIndex = Math.floor(xValues.length / 2);

    cdfContinuousChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'F(x) = P(X ≤ x)',
                data: cdfValues,
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: false,
                borderWidth: 3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            onClick: function(evt) {
                // Get x value from click
                const points = cdfContinuousChart.scales.x.getValueForPixel(evt.x || evt.offsetX);
                let x = points;
                // Find closest x value
                let closest = xValues.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
                let idx = xValues.indexOf(closest);
                // Move the annotation line
                cdfContinuousChart.options.plugins.annotation.annotations.dragLine.xMin = closest;
                cdfContinuousChart.options.plugins.annotation.annotations.dragLine.xMax = closest;
                cdfContinuousChart.update('none');
                // Update label below chart
                let fx = cdfValues[idx];
                let label = document.getElementById('cdfValueText');
                if (label) {
                    label.innerHTML = `<strong>x = ${closest.toFixed(2)}</strong>, <strong>F(x) = ${fx.toFixed(4)}</strong>`;
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    title: {
                        display: true,
                        text: 'F(x)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'CDF: Standard Normal Distribution'
                },
                legend: {
                    display: true
                },
                annotation: {
                    annotations: {
                        dragLine: {
                            type: 'line',
                            xMin: xValues[dragIndex],
                            xMax: xValues[dragIndex],
                            borderColor: 'rgba(245, 158, 11, 1)',
                            borderWidth: 3,
                            label: {
                                enabled: true,
                                content: 'x',
                                position: 'start',
                                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                                color: '#000',
                                font: { weight: 'bold' }
                            },
                            draggable: true,
                            onDrag: function(e) {
                                // Find closest x value
                                let x = e.x;
                                let closest = xValues.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
                                let idx = xValues.indexOf(closest);
                                // Move the line
                                cdfContinuousChart.options.plugins.annotation.annotations.dragLine.xMin = closest;
                                cdfContinuousChart.options.plugins.annotation.annotations.dragLine.xMax = closest;
                                cdfContinuousChart.update('none');
                                // Update label below chart
                                let fx = cdfValues[idx];
                                let label = document.getElementById('cdfValueText');
                                if (label) {
                                    label.innerHTML = `<strong>x = ${closest.toFixed(2)}</strong>, <strong>F(x) = ${fx.toFixed(4)}</strong>`;
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Initial label update
    setTimeout(() => {
        let label = document.getElementById('cdfValueText');
        if (label) {
            let fx = cdfValues[dragIndex];
            label.innerHTML = `<strong>x = ${xValues[dragIndex].toFixed(2)}</strong>, <strong>F(x) = ${fx.toFixed(4)}</strong>`;
        }
    }, 200);
}

// Continuous Distribution Explorer
function initContinuousDistChart() {
    updateContinuousDistribution();
}

function updateContinuousDistribution() {
    const distType = document.getElementById('contDistType')?.value || 'normal';
    const param1 = parseFloat(document.getElementById('contParam1')?.value || 0);
    const param2 = parseFloat(document.getElementById('contParam2')?.value || 1);
    
    const ctx = document.getElementById('contDistChart');
    if (!ctx) return;
    
    if (contDistChart) {
        contDistChart.destroy();
    }
    
    let xValues = [];
    let yValues = [];
    let mean, variance, title;
    
    if (distType === 'uniform') {
        const a = param1;
        const b = param2;
        mean = (a + b) / 2;
        variance = Math.pow(b - a, 2) / 12;
        title = `Uniform(${a}, ${b})`;
        
        for (let x = a - 1; x <= b + 1; x += 0.1) {
            xValues.push(x);
            yValues.push(distributions.uniformPDF(x, a, b));
        }
    } else if (distType === 'normal') {
        const mu = param1;
        const sigma = param2;
        mean = mu;
        variance = sigma * sigma;
        title = `Normal(${mu}, ${sigma}²)`;
        
        for (let x = mu - 4*sigma; x <= mu + 4*sigma; x += sigma/10) {
            xValues.push(x);
            yValues.push(distributions.normalPDF(x, mu, sigma));
        }
    } else if (distType === 'exponential') {
        const lambda = param1;
        mean = 1 / lambda;
        variance = 1 / (lambda * lambda);
        title = `Exponential(λ=${lambda})`;
        
        for (let x = 0; x <= 5/lambda; x += 0.1/lambda) {
            xValues.push(x);
            yValues.push(distributions.exponentialPDF(x, lambda));
        }
    }
    
    contDistChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'PDF',
                data: yValues,
                borderColor: 'rgba(168, 85, 247, 1)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                fill: true,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Density f(x)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'x'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Update stats display
    const statsText = document.getElementById('contDistStatsText');
    if (statsText) {
        statsText.textContent = `Mean = ${mean.toFixed(3)}, Variance = ${variance.toFixed(3)}, SD = ${Math.sqrt(variance).toFixed(3)}`;
    }
}

function showDistributionArea() {
    alert('Feature coming soon: Click on chart to select interval and calculate area!');
}

// Normal Distribution with 68-95-99.7 rule
function initNormalChart() {
    const ctx = document.getElementById('normalChart');
    if (!ctx) return;
    
    const xValues = [];
    const yValues = [];
    const oneSD = [];
    const twoSD = [];
    const threeSD = [];
    
    for (let x = -4; x <= 4; x += 0.1) {
        xValues.push(x);
        yValues.push(distributions.normalPDF(x, 0, 1));
        
        // 68% (1 SD)
        if (x >= -1 && x <= 1) {
            oneSD.push(distributions.normalPDF(x, 0, 1));
        } else {
            oneSD.push(null);
        }
        
        // 95% (2 SD)
        if (x >= -2 && x <= 2) {
            twoSD.push(distributions.normalPDF(x, 0, 1));
        } else {
            twoSD.push(null);
        }
        
        // 99.7% (3 SD)
        if (x >= -3 && x <= 3) {
            threeSD.push(distributions.normalPDF(x, 0, 1));
        } else {
            threeSD.push(null);
        }
    }
    
    normalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Standard Normal',
                data: yValues,
                borderColor: 'rgba(37, 99, 235, 1)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: false,
                borderWidth: 2,
                pointRadius: 0
            }, {
                label: '68% (±1σ)',
                data: oneSD,
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.3)',
                fill: true,
                borderWidth: 0,
                pointRadius: 0
            }, {
                label: '95% (±2σ)',
                data: twoSD,
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                fill: true,
                borderWidth: 0,
                pointRadius: 0
            }, {
                label: '99.7% (±3σ)',
                data: threeSD,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                borderWidth: 0,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Density'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Standard Deviations from Mean'
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            let num = Number(value);
                            if (isNaN(num)) return value;
                            if (num === 0) return '0';
                            return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '68-95-99.7 Rule (Standard Normal)'
                },
                legend: {
                    display: true
                }
            }
        }
    });
}

// Central Limit Theorem Charts
function initCLTCharts() {
    updateCLTDemo();
}

function updateCLTDemo() {
    const popType = document.getElementById('cltPopulation')?.value || 'uniform';
    
    // Initialize population chart
    const popCtx = document.getElementById('cltPopChart');
    if (popCtx) {
        if (cltPopChart) {
            cltPopChart.destroy();
        }
        
        const xValues = [];
        const yValues = [];
        let title = '';
        
        if (popType === 'uniform') {
            title = 'Uniform Population';
            for (let x = 0; x <= 10; x += 0.1) {
                xValues.push(x);
                yValues.push(distributions.uniformPDF(x, 2, 8));
            }
        } else if (popType === 'exponential') {
            title = 'Exponential Population';
            for (let x = 0; x <= 10; x += 0.1) {
                xValues.push(x);
                yValues.push(distributions.exponentialPDF(x, 0.5));
            }
        } else if (popType === 'bimodal') {
            title = 'Bimodal Population';
            for (let x = 0; x <= 10; x += 0.1) {
                xValues.push(x);
                yValues.push(0.5 * distributions.normalPDF(x, 2, 1) + 0.5 * distributions.normalPDF(x, 8, 1));
            }
        }
        
        cltPopChart = new Chart(popCtx, {
            type: 'line',
            data: {
                labels: xValues,
                datasets: [{
                    label: 'Population PDF',
                    data: yValues,
                    borderColor: 'rgba(37, 99, 235, 1)',
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Density'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                let num = Number(value);
                                if (isNaN(num)) return value;
                                if (num === 0) return '0';
                                return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: title
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Initialize empty sample means chart
    const sampleCtx = document.getElementById('cltSampleChart');
    if (sampleCtx) {
        if (cltSampleChart) {
            cltSampleChart.destroy();
        }
        
        cltSampleChart = new Chart(sampleCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sample Means',
                    data: [],
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Sample Mean'
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                let num = Number(value);
                                if (isNaN(num)) return value;
                                if (num === 0) return '0';
                                return Math.abs(num) < 1e-4 ? num.toExponential(2) : num.toFixed(4).replace(/\.?0+$/, "");
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribution of Sample Means'
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

function runCLTSimulation() {
    const popType = document.getElementById('cltPopulation')?.value || 'uniform';
    const sampleSize = parseInt(document.getElementById('cltSampleSize')?.value || 30);
    const numSamples = 1000;
    
    let sampleMeans = [];
    
    // Generate sample means
    for (let i = 0; i < numSamples; i++) {
        let sampleSum = 0;
        
        for (let j = 0; j < sampleSize; j++) {
            let value;
            if (popType === 'uniform') {
                value = Math.random() * 6 + 2; // Uniform(2, 8)
            } else if (popType === 'exponential') {
                value = -Math.log(Math.random()) / 0.5; // Exponential(0.5)
            } else if (popType === 'bimodal') {
                // 50% chance of each mode
                if (Math.random() < 0.5) {
                    value = 2 + Math.random() * 2; // Around 2
                } else {
                    value = 8 + Math.random() * 2; // Around 8
                }
            }
            sampleSum += value;
        }
        
        sampleMeans.push(sampleSum / sampleSize);
    }
    
    // Create histogram of sample means
    const bins = 20;
    const minMean = Math.min(...sampleMeans);
    const maxMean = Math.max(...sampleMeans);
    const binWidth = (maxMean - minMean) / bins;
    
    const binCounts = new Array(bins).fill(0);
    const binLabels = [];
    
    for (let i = 0; i < bins; i++) {
        binLabels.push((minMean + i * binWidth).toFixed(2));
    }
    
    sampleMeans.forEach(mean => {
        const binIndex = Math.min(Math.floor((mean - minMean) / binWidth), bins - 1);
        binCounts[binIndex]++;
    });
    
    // Update chart
    cltSampleChart.data.labels = binLabels;
    cltSampleChart.data.datasets[0].data = binCounts;
    cltSampleChart.update();
    
    // Update stats
    const meanOfMeans = sampleMeans.reduce((a, b) => a + b) / sampleMeans.length;
    const variance = sampleMeans.reduce((sum, x) => sum + Math.pow(x - meanOfMeans, 2), 0) / sampleMeans.length;
    const standardError = Math.sqrt(variance);
    
    const statsText = document.getElementById('cltStatsText');
    if (statsText) {
        statsText.textContent = `Sample means: μ = ${meanOfMeans.toFixed(3)}, SE = ${standardError.toFixed(3)}. Notice the normal shape!`;
    }
}

// Solution toggle function
function toggleSolution(solutionId) {
    const solution = document.querySelector(`[data-id="${solutionId}"]`);
    if (solution) {
        if (solution.style.display === 'none' || solution.style.display === '') {
            solution.style.display = 'block';
        } else {
            solution.style.display = 'none';
        }
    }
}

// Random number generators for different distributions
function generateUniform(a, b) {
    return Math.random() * (b - a) + a;
}

function generateExponential(lambda) {
    return -Math.log(Math.random()) / lambda;
}

function generateNormal(mu = 0, sigma = 1) {
    // Box-Muller transformation
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * sigma + mu;
}

// Utility function to format numbers
function formatNumber(num, decimals = 4) {
    return parseFloat(num.toFixed(decimals));
}

// Initialize everything when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCharts);
} else {
    initializeCharts();
}