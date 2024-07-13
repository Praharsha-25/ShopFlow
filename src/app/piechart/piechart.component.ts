import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Chart, Filler, registerables } from 'chart.js';
import { CustomerTransactionService } from '../customer-transaction.service';
import { error } from 'console';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {
  ownerId: number = 0;
  top4Products: [number, string][] = [];
  weekRevenue: [number, Date][] = [];
  others: number = 0;
  totalProductCount: number = 0;
  topProducts: [string , number, Date][] = [];
  constructor(private router: Router, private route: ActivatedRoute, private cts: CustomerTransactionService) {
    Chart.register(...registerables);
  }

  logout() {
    this.router.navigate(['']);
  }

  history() {
    this.router.navigate(['/history', this.ownerId]);
  }

  home() {
    this.router.navigate(['/loggedin', this.ownerId]);
  }

  stock(){
    this.router.navigate(['/stock',this.ownerId])
  }
  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.ownerId = +data['ownerId'];
      this.cts.previousWeekRevenue(this.ownerId).subscribe(data =>{
        this.weekRevenue = data;
        console.log(this.weekRevenue);
        this.renderLineGraph();
      }, error => console.log(error));
    });
    this.cts.getTop4Products(this.ownerId).subscribe(data =>{
      this.top4Products = data;
      this.cts.totalProducts(this.ownerId).subscribe(data =>{
        this.others = data;
        this.totalProductCount = this.top4Products.reduce((total, item) => total + item[0], 0);
        this.others = this.others - this.totalProductCount;
        this.renderChart();
        console.log(data);  
      });
      
    }, error => console.log(error));
    this.cts.topProductPerDayForOwner(this.ownerId).subscribe(data =>{
      this.topProducts = data;
      console.log(this.topProducts);
    },error => console.log(error));
  }

  renderChart() {
    const ctx = document.getElementById('piechart') as HTMLCanvasElement;
    const labels = this.top4Products.map(item => item[1]);
    labels.push('Others');
    const data = this.top4Products.map(item => item[0]);
    data.push(this.others);
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: '# of votes',
          data: data,
          backgroundColor: ['#264653', '#2A9D8F', '#ecbe4b', '#f89c51', '#E76F51'],
          borderWidth: 1,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Product Sales Distribution',
            font: {
              size: 20
            },
            padding: {
              top: 10,
              bottom: 10
            }
          },
          subtitle: {
            display: true,
            text: 'Top 4 products and others',
            font: {
              size: 16
            },
            padding: {
              bottom: 10
            }
          }
        }
      }
    });
  }
    
  renderLineGraph(){
    const ctx = document.getElementById('linegraph') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.weekRevenue.map(item => item[1]),
        datasets: [{
          label: "Revenue",
          data: this.weekRevenue.map(item => item[0]),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Weekly Revenue',
            font: {
              size: 20
            },
            padding: {
              top: 10,
              bottom: 10
            }
          },
          subtitle: {
            display: true,
            text: 'Revenue trends over the last week',
            font: {
              size: 16
            },
            padding: {
              bottom: 10
            }
          }
        }
      }
    })
  };
  
  
  
}

