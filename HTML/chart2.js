var ctx = document.getElementById('doughnut');

var myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Koregaon Park', 'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner', 'Alandi'],
      datasets: [{
        label: 'No. of patients',
        data: [150, 620, 900, 390, 230, 600],
        
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false
            }
        }
    }
  });


