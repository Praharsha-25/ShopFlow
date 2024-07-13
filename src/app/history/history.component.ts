import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CustomerTransactionService } from '../customer-transaction.service';
import { CustomerTransactions } from '../customer-transactions';
import { Owner } from '../owner';
import { OwnerService } from '../owner.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit{
  constructor(private router: Router, private route: ActivatedRoute, @Inject(PLATFORM_ID) private platformId: Object, private cts: CustomerTransactionService, private ownerService: OwnerService){}
  ownerId: number = 0;
  currentPage = 1;
  rowsPerPage = 8;
  transactions?: CustomerTransactions[];
  searchText:string = '';
  filterTransactions?: CustomerTransactions[];
  owner: Owner = new Owner();
  dob: string = '';
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.displayRows();
    }
    this.route.params.subscribe(data=>{
      this.ownerId = +data['ownerId'];
    });
    setTimeout(() => this.cts.getAllTransactionsForOwner(this.ownerId).subscribe(data =>{
      this.transactions = data;
      setTimeout(() => this.updateTable(), 0);
      this.getOwner();

    }, error => console.log(error)), 160);
  }
  logout(){
    this.router.navigate(['']);
  }
  history(){
    this.router.navigate(['/history', this.ownerId])
  }
  home(){
    this.router.navigate(['/loggedin', this.ownerId]);
  }
  analysis(){
    this.router.navigate(['/piechart', this.ownerId])
  }
  stock(){
    this.router.navigate(['/stock',this.ownerId])
  }
  updateTable(): void {
    if (isPlatformBrowser(this.platformId)) {
      const myTable = document.getElementById("myTable")!.getElementsByTagName('tbody')[0];
      const rows = myTable.getElementsByTagName("tr");
      const totalRows = rows.length;
      const totalPages = Math.ceil(totalRows / this.rowsPerPage);
    
      for (let i = 0; i < totalRows; i++) {
        rows[i].style.display = (i >= (this.currentPage - 1) * this.rowsPerPage && i < this.currentPage * this.rowsPerPage) ? "" : "none";
        rows[i].style.backgroundColor = (i % 2 === 1) ? '#fbf8db' : 'white';
      }
    
      const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
      const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
      prevBtn.disabled = this.currentPage === 1;
      nextBtn.disabled = this.currentPage === totalPages;
    }
  }
  
  prevPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateTable();
        this.displayRows();
      }
    }
  }

  nextPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const myTable = document.getElementById("myTable")!.getElementsByTagName('tbody')[0];
      const totalRows = myTable.getElementsByTagName("tr").length;
      const totalPages = Math.ceil(totalRows / this.rowsPerPage);
    
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updateTable();
        this.displayRows();
      }
    }
  }

  displayRows(): void {
    if (isPlatformBrowser(this.platformId)) {
      const table = document.getElementById('myTable')!.getElementsByTagName('tbody')[0];
      const rows = table.getElementsByTagName('tr');
      const totalPages = Math.ceil(rows.length / this.rowsPerPage);
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = 'none';
        rows[i].style.backgroundColor = (i % 2 === 1) ? '#fbf8db' : 'white';
      }

      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      for (let i = start; i < end && i < rows.length; i++) {
        rows[i].style.display = '';
      }

      const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
      const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
      prevBtn.disabled = this.currentPage === 1;
      nextBtn.disabled = this.currentPage === totalPages;
    }
  }
  filteredTransactions(): CustomerTransactions[] {
    if (!this.searchText) {
      this.displayRows();
      this.filterTransactions = this.transactions;
      return this.filterTransactions || [];
    }
    this.filterTransactions = this.transactions?.filter(trans =>
      (trans?.customer?.customerName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      trans?.productName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      trans?.date?.toString().includes(this.searchText) ||
      trans?.customer?.phnNo?.toString().includes(this.searchText)) ?? false
    ); 
    this.displayRows();
    return this.filterTransactions || [];
  }
  getOwner(): void{
    this.ownerService.getOwnerById(this.ownerId).subscribe(data => {
      this.owner = data;
      this.ownerService.getDob(this.ownerId).subscribe(data => {
        console.log(data);
        this.owner.dob = this.formatDate(data);
      });
      console.log(data);
    }, error => console.log(error));
  }
  private formatDate(date: Date): string {
    let dateObj:Date;
    dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  updateOwner(): void{
    this.ownerService.createOwner(this.owner).subscribe(data =>{
      console.log(data);
      this.router.navigate(['/history', this.ownerId]);
    }, error => console.log(error));
    alert("Updated Successfully");

  }
}
