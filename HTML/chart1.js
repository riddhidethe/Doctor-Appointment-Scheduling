var ctx = document.getElementById('lineChart');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Diabetes', 'Hyper-tension', 'Cold & flu', 'Cancer', 'Asthama', 'Arthritis'],
      datasets: [{
        label: 'No. of Patients',
        data: [800, 1200, 950, 550, 600, 700],
        backgroundColor: [
            'rgba(41,155,99,1)',
            'rgba(54,162,235,1)',
            'rgba(255,206,86,1)',
            'rgba(120,46,139,1)',
            'rgba(255,159,64,1)',
            'rgba(153,102,255,1)',
        ],
        borderColor: [
            'rgba(41,155,99,1)',
            'rgba(54,162,235,1)',
            'rgba(255,206,86,1)',
            'rgba(120,46,139,1)',
            'rgba(250,100,60,1)',
            'rgba(153,102,255,1)',
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
  });


