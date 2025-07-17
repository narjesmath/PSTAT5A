
// Interactive functionality for the lecture
let charts = {};

// Function to flip coin
function flipCoin(element) {
  const result = Math.random() < 0.5 ? 'H' : 'T';
  element.textContent = result;
  element.style.transform = 'rotateY(360deg)';
  setTimeout(() => {
    element.style.transform = 'rotateY(0deg)';
  }, 300);
}

// Function to toggle solution visibility
function toggleSolutionByIndex(index) {
    const solution = document.querySelector(`.solution[data-index="${index}"]`);
    if (solution) {
        solution.classList.toggle('show');
    }
}

// Function to toggle solution visibility by ID
function toggleSolution(id) {
    const solution = document.querySelector(`.solution[data-id="${id}"]`);
    if (solution) {
        solution.classList.toggle('show');
    }
}

// Initialize die chart
function initDieChart() {
  const ctx = document.getElementById('dieChart');
  if (!ctx) return;
  
  charts.die = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [{
        label: 'Theoretical Probability',
        data: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6],
        backgroundColor: 'rgba(33, 150, 243, 0.5)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1
      }, {
        label: 'Observed Frequency',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 152, 0, 0.5)',
        borderColor: 'rgba(255, 152, 0, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 0.3
        }
      }
    }
  });
}

// Update die chart with simulation
function updateDieChart() {
  if (!charts.die) initDieChart();
  
  const rolls = Array(6).fill(0);
  const n = parseInt(document.getElementById('dieTrials')?.value || 1000);
  
  for (let i = 0; i < n; i++) {
    const roll = Math.floor(Math.random() * 6);
    rolls[roll]++;
  }
  
  charts.die.data.datasets[1].data = rolls.map(count => count / n);
  charts.die.update();
  
  // Update statistics
  updateDieStats(rolls);
}

// Reset die chart to initial state
function resetDieChart() {
  if (!charts.die) initDieChart();
  
  charts.die.data.datasets[1].data = [0, 0, 0, 0, 0, 0];
  charts.die.update();
  
  // Reset stats
  const statsText = document.getElementById('dieStatsText');
  if (statsText) {
    statsText.textContent = 'Click "Roll Die" to see statistics';
  }
}



// Update die statistics
function updateDieStats(rolls) {
  const statsText = document.getElementById('dieStatsText');
  if (!statsText) return;
  
  const total = rolls.reduce((sum, count) => sum + count, 0);
  const maxRoll = rolls.indexOf(Math.max(...rolls)) + 1;
  const minRoll = rolls.indexOf(Math.min(...rolls)) + 1;
  const avgRoll = rolls.reduce((sum, count, index) => sum + (index + 1) * count, 0) / total;
  
  statsText.innerHTML = `Total rolls: ${total} | Most frequent: ${maxRoll} | Least frequent: ${minRoll} | Average: ${avgRoll.toFixed(2)}`;
}

// Initialize coin chart
function initCoinChart() {
  const ctx = document.getElementById('coinChart');
  if (!ctx) return;
  
  charts.coin = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['0 Heads', '1 Head', '2 Heads'],
      datasets: [{
        label: 'Probability',
        data: [0.25, 0.5, 0.25],
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 0.6
        }
      }
    }
  });
}

// Initialize CDF chart
function initCDFChart() {
  const ctx = document.getElementById('cdfChart');
  if (!ctx) return;
  
  const xValues = [-1, 0, 0.001, 1, 1.001, 2, 2.001, 3];
  const yValues = [0, 0, 0.25, 0.25, 0.75, 0.75, 1, 1];
  
  charts.cdf = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [{
        label: 'CDF for Two Coin Flips',
        data: yValues,
        borderColor: 'rgb(75, 192, 192)',
        stepped: 'before',
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Number of Heads'
          }
        },
        y: {
          title: {
            display: true,
            text: 'F(x) = P(X ≤ x)'
          },
          beginAtZero: true,
          max: 1.1
        }
      }
    }
  });
}

// Law of Large Numbers demo
function runLLNDemo() {
  const ctx = document.getElementById('llnChart');
  if (!ctx) return;
  
  const trials = parseInt(document.getElementById('llnTrials').value);
  const means = [];
  let sum = 0;
  
  for (let i = 1; i <= trials; i++) {
    sum += Math.floor(Math.random() * 6) + 1;
    means.push(sum / i);
  }
  
  if (charts.lln) {
    charts.lln.destroy();
  }
  
  charts.lln = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: Array.from({length: trials}, (_, i) => i + 1),
      datasets: [{
        label: 'Running Average',
        data: means,
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        pointRadius: 0
      }, {
        label: 'Expected Value (3.5)',
        data: Array(trials).fill(3.5),
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Number of Rolls'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Average Value'
          },
          min: 2.5,
          max: 4.5
        }
      }
    }
  });
}

// Distribution visualizer
function updateDistribution() {
  const ctx = document.getElementById('distChart');
  if (!ctx) return;
  
  const distType = document.getElementById('distType').value;
  const param1 = parseFloat(document.getElementById('param1').value);
  const param2 = parseFloat(document.getElementById('param2').value);
  
  let labels = [];
  let data = [];
  
  if (distType === 'binomial') {
    const n = Math.floor(param1);
    const p = param2;
    for (let k = 0; k <= n; k++) {
      labels.push(k);
      data.push(binomialPMF(n, k, p));
    }
  } else if (distType === 'geometric') {
    const p = param2;
    for (let k = 1; k <= 20; k++) {
      labels.push(k);
      data.push(Math.pow(1 - p, k - 1) * p);
    }
  } else if (distType === 'poisson') {
    const lambda = param1;
    for (let k = 0; k <= 20; k++) {
      labels.push(k);
      data.push(poissonPMF(lambda, k));
    }
  }
  
  if (charts.dist) {
    charts.dist.destroy();
  }
  
  charts.dist = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Probability',
        data: data,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Helper functions
function binomialPMF(n, k, p) {
  return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function binomialCoefficient(n, k) {
  if (k > n - k) k = n - k;
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = c * (n - i) / (i + 1);
  }
  return c;
}

function poissonPMF(lambda, k) {
  return Math.pow(lambda, k) * Math.exp(-lambda) / factorial(k);
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Initialize type comparison plots
function initTypePlots() {
  initDiscretePlot();
  initContinuousPlot();
}

// Initialize discrete plot
function initDiscretePlot() {
  const ctx = document.getElementById('discretePlot');
  if (!ctx) return;
  
  charts.discrete = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5', '6'],
      datasets: [{
        label: 'Discrete Values',
        data: [1, 1, 1, 1, 1, 1],
        backgroundColor: 'rgba(30, 58, 138, 0.7)',
        borderColor: 'rgba(30, 58, 138, 1)',
        borderWidth: 2,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Discrete: Gaps between values',
          color: 'rgba(30, 58, 138, 0.8)',
          font: {
            size: 12
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 2,
          display: false
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// Initialize continuous plot
function initContinuousPlot() {
  const ctx = document.getElementById('continuousPlot');
  if (!ctx) return;
  
  // Generate continuous data points
  const xValues = [];
  const yValues = [];
  for (let i = 0; i <= 100; i++) {
    xValues.push(i);
    yValues.push(Math.sin(i * 0.1) * 0.5 + 1);
  }
  
  charts.continuous = new Chart(ctx.getContext('2d'), {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [{
        label: 'Continuous Values',
        data: yValues,
        borderColor: 'rgba(124, 58, 237, 1)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Continuous: No gaps',
          color: 'rgba(124, 58, 237, 0.8)',
          font: {
            size: 12
          }
        }
      },
      scales: {
        y: {
          display: false
        },
        x: {
          display: false
        }
      }
    }
  });
}

// Interactive Coin Flip Demo for PMF Table
let coinStates = [1, 0, 1, 0]; // 1=H, 0=T, initial: H T H T
let coinCounts = [0, 0, 0]; // counts for 0, 1, 2 heads
let coinTotal = 0;
let coinChart = null;

function updateCoinOutcome() {
  const outcome = coinStates.map(x => x ? 'H' : 'T').join(' ');
  const el = document.getElementById('coinOutcome');
  if (el) el.textContent = 'Current outcome: ' + outcome;
}

function flipCoinDemo(element, idx) {
  if (!element) return;
  coinStates[idx] = 1 - coinStates[idx];
  element.textContent = coinStates[idx] ? 'H' : 'T';
  element.classList.toggle('flipped');
  updateCoinOutcome();
  updateCoinTable();
}

function resetCoinDemo() {
  coinStates = [1, 0, 1, 0];
  coinCounts = [0, 0, 0];
  coinTotal = 0;
  document.querySelectorAll('.coin-flip-demo .coin').forEach((el, idx) => {
    el.textContent = coinStates[idx] ? 'H' : 'T';
    el.classList.remove('flipped');
  });
  updateCoinOutcome();
  updateCoinTable();
}

function updateCoinTable() {
  // Count heads
  const heads = coinStates.reduce((a, b) => a + b, 0);
  // Update counts
  coinCounts[heads]++;
  coinTotal++;
  // Highlight table row
  for (let i = 0; i <= 2; i++) {
    const row = document.getElementById('row-' + i);
    if (row) row.classList.toggle('active', i === heads);
    const emp = document.getElementById('emp-' + i);
    if (emp) emp.textContent = coinTotal ? (coinCounts[i] / coinTotal).toFixed(2) : '0';
  }
  // Update stats
  const stats = document.getElementById('coinStats');
  if (stats) {
    stats.textContent = `Empirical probability for ${heads} heads: ` + (coinCounts[heads] / coinTotal).toFixed(2) + ` (out of ${coinTotal} flips)`;
  }
  // Update chart
  updateCoinChart();
}

function updateCoinChart() {
  const ctx = document.getElementById('coinChart');
  if (!ctx) return;
  const theoretical = [0.25, 0.5, 0.25];
  const empirical = coinTotal ? coinCounts.map(c => c / coinTotal) : [0, 0, 0];
  try {
    if (!coinChart) {
      coinChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['0 Heads', '1 Head', '2 Heads'],
          datasets: [
            {
              label: 'Theoretical',
              data: theoretical,
              backgroundColor: 'rgba(33, 150, 243, 0.5)',
              borderColor: 'rgba(33, 150, 243, 1)',
              borderWidth: 1
            },
            {
              label: 'Empirical',
              data: empirical,
              backgroundColor: 'rgba(249, 115, 22, 0.5)',
              borderColor: 'rgba(249, 115, 22, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 1
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: { font: { size: 11 } }
            }
          }
        }
      });
    } else {
      coinChart.data.datasets[1].data = empirical;
      coinChart.update();
    }
  } catch (e) {
    // fail silently
  }
}

// Defensive chart initialization for discrete/continuous/CDF plots
function safeInitDiscretePlot() {
  try { initDiscretePlot(); } catch (e) {}
}
function safeInitContinuousPlot() {
  try { initContinuousPlot(); } catch (e) {}
}
function safeInitCDFChart() {
  try { initCDFChart(); } catch (e) {}
}

// Initialize on DOMContentLoaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    // Set initial coin faces
    document.querySelectorAll('.coin-flip-demo .coin').forEach((el, idx) => {
      el.textContent = coinStates[idx] ? 'H' : 'T';
    });
    updateCoinOutcome();
    updateCoinTable();
    safeInitDiscretePlot();
    safeInitContinuousPlot();
    safeInitCDFChart();
  });
}

// Initialize charts when document is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    initDieChart();
    initCoinChart();
    initCDFChart();
    updateDistribution();
    initTypePlots();
  }, 100);
});
