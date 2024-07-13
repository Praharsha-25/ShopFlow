import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Stock } from '../stock';
import { StockService } from '../stock.service';
import { OwnerService } from '../owner.service';
import { error } from 'console';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute, private stockService: StockService, private ownerService: OwnerService){

  }
  ownerId: number = 0;
  stock: Stock = new Stock();
  products?: Stock[];
  currentPage = 1;
  rowsPerPage = 8;
  searchText: string = '';
  filterTransactions?: Stock[];
  logout() {
    this.router.navigate(['']);
  }

  history() {
    this.router.navigate(['/history', this.ownerId]);
  }

  home() {
    this.router.navigate(['/loggedin', this.ownerId]);
  }
  analysis(){
    this.router.navigate(['/piechart', this.ownerId])
  }
  filteredTransactions(): Stock[]{
    if(!this.searchText){
      this.displayRows();
      this.filterTransactions = this.products;
      return this.filterTransactions || [];
    }
    this.filterTransactions = this.products?.filter(prods =>
      (prods?.productName?.toLocaleLowerCase().includes(this.searchText.toLowerCase())) ?? false
    );
    this.currentPage = 1;
    this.updateTable();
    return this.filterTransactions || [];
  }
  add(): void{
    const myTable = document.getElementById("myTable")!.getElementsByTagName('tbody')[0];
    const myButton = document.getElementById("myButton") as HTMLButtonElement;
    myButton.disabled = true;
    const rows = myTable.rows.length;
    const r = myTable.insertRow(rows);
    const c1 = r.insertCell(0);  
    const c2 = r.insertCell(1);
    const c3 = r.insertCell(2);
    [c1, c2, c3].forEach(cell => {
      cell.style.border = "1px solid rgb(138, 133, 133)";
      cell.style.padding = "8px";
    });
    const productName = document.createElement("input");  
    const availability = document.createElement("input");
    productName.required = true;
    availability.required = true;
    const btn = document.createElement("button"); 
    const edit = document.createElement("button"); 
    const delete1 = document.createElement("button"); 
    const btnCancel = document.createElement("button"); 
    productName.type = "text";  
    availability.type = "number";
    productName.className = "form-control mx-auto";
    availability.className = "form-control mx-auto";
    btn.type = "button";  
    btn.textContent = "Confirm";
    btn.className = "btn btn-primary btn-sm";
    btn.style.marginRight = "5px";
    edit.type = "button";
    edit.textContent = "Edit";
    edit.className = "btn btn-warning";
    edit.style.marginRight = "5px"; 
    delete1.type = "button";
    delete1.textContent = "Delete";
    delete1.className = "btn btn-danger";
    delete1.style.width = "80px";
    btnCancel.type = "button";
    btnCancel.textContent = "Cancel";
    btnCancel.className = "btn btn-secondary btn-space btn-sm";
    edit.style.width = "80px";
    productName.style.width = "300px";
    availability.style.width = "112.5px";
    c1.appendChild(productName);
    c2.appendChild(availability);
    c3.appendChild(btn);
    c3.appendChild(btnCancel);
    btnCancel.addEventListener("click", () =>{
      const rowIndex = Array.prototype.indexOf.call(myTable.children, r);
      myTable.deleteRow(rowIndex);
      myButton.disabled = false;
    });
    btn.addEventListener("click", () =>{
      if(productName.checkValidity() && availability.checkValidity()){
        this.stock.productName = productName.value;
        this.stock.stock = Number(availability.value);
        myButton.disabled = false;
        this.updateTable();
        this.ownerService.getOwnerById(this.ownerId).subscribe(data =>{
          this.stock.owner = data;
          this.stockService.saveProductStock(this.stock).subscribe(data =>{
            console.log(data);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/stock', this.ownerId]);
            });
          }, error => console.log(error));
        })
      }
    })
  }
  deleteProduct(i: number){
    if(this.products!=undefined){
      const pro = this.products[i];
      const id = pro.id;
      console.log(id);
      if(id != undefined)
      this.stockService.deleteProduct(id).subscribe(() =>{
        console.log("Deleted");
      }, error => console.log(error));
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/stock', this.ownerId]);
      });
    }
  }
  editProduct(i: number){
    if(this.products!=undefined){
      const product = this.products[i];
      const productNameInput = document.createElement("input");
      productNameInput.type = "text";
      productNameInput.value = product.productName || '';

      const availability = document.createElement("input");
      availability.type = "number";
      availability.value = product.stock?.toString() || '';
      
      const btn = document.createElement("button");
      btn.type = "submit";
      btn.textContent = "Confirm";
      btn.className = "btn btn-primary btn-sm";
      btn.style.marginRight = "5px";
      
      const btnCancel = document.createElement("button");
      btnCancel.type = "submit";
      btnCancel.textContent = "Cancel";
      btnCancel.className = "btn btn-secondary btn-space btn-sm";

      const table = document.getElementById("myTable") as HTMLTableElement | null;
      if(table){
        const tableRow = table.rows[i];
        const originalProductName = tableRow.cells[0].innerHTML;
        const originalStock = tableRow.cells[1].innerHTML;

        tableRow.cells[0].innerHTML = '';
        tableRow.cells[0].appendChild(productNameInput);

        tableRow.cells[1].innerHTML = '';
        tableRow.cells[1].appendChild(availability);

        tableRow.cells[2].innerHTML = '';
        tableRow.cells[2].appendChild(btn);
        tableRow.cells[2].appendChild(btnCancel);
        btn.addEventListener("click", ()=>{
          if(productNameInput.checkValidity() && availability.checkValidity()){
            product.productName = productNameInput.value;
            product.stock = Number(availability.value);
            this.updateTable();
            this.ownerService.getOwnerById(this.ownerId).subscribe(data =>{
              product.owner = data;
              if(this.products)
              {
                if(originalProductName.trim() === this.products[i].productName?.trim())
                {
                  this.products[i] = product;
                  this.stockService.updateProduct(this.products[i]).subscribe(data =>{
                    console.log(data);
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate(['/stock', this.ownerId]);
                    });
                  }, error => console.log(error));
                }
                else{
                  this.products[i] = product;
                  console.log("else");
                  this.stockService.saveProductStock(this.products[i]).subscribe(data =>{
                    console.log(data);
                    if(this.products){
                      const pro = this.products[i];
                      const id = pro.id;
                      console.log(id);
                      if(id != undefined)
                      this.stockService.deleteProduct(id).subscribe(() =>{
                        console.log("Deleted");
                      }, error => console.log(error));
                    }
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate(['/stock', this.ownerId]);
                    });
                  }, error => console.log(error));
                }
              }
            })
          }
        })
        btnCancel.addEventListener("click", () => {
          tableRow.cells[0].innerHTML = originalProductName;
          tableRow.cells[1].innerHTML = originalStock;
          const edit = document.createElement("button");
          const delete1 = document.createElement("button");
          edit.type = "button";
          edit.textContent = "Edit";
          edit.className = "btn btn-warning btn-sm";
          edit.style.marginRight = "5px"; 
          edit.style.width = "60px";
          delete1.type = "button";
          delete1.textContent = "Delete";
          delete1.className = "btn btn-danger btn-sm";
          delete1.style.width = "60px";
          edit.addEventListener("click", ()=> this.editProduct(i));
          delete1.addEventListener("click", () => this.deleteProduct(i));
          tableRow.cells[2].innerHTML = '';
          tableRow.cells[2].appendChild(edit);
          tableRow.cells[2].appendChild(delete1);
        })
      }
    }
  }
  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.ownerId = +data['ownerId'];
      this.stockService.getAllProductStock(this.ownerId).subscribe(data =>{
        this.products = data;
        setTimeout(() => this.updateTable(), 0);
        this.displayRows();
      })
    });
  }
  updateTable(): void {
      const myTable = document.getElementById("myTable")!.getElementsByTagName('tbody')[0];
      const rows = myTable.getElementsByTagName("tr");
      const totalRows = rows.length;
      const totalPages = Math.ceil(totalRows / this.rowsPerPage);
    
      for (let i = 0; i < totalRows; i++) {
        rows[i].style.display = (i >= (this.currentPage - 1) * this.rowsPerPage && i < this.currentPage * this.rowsPerPage) ? "" : "none";
        rows[i].style.backgroundColor = (i % 2 === 1) ? 'white' : 'white';
      }
    
      const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
      const nextBtn = document.getElementById("nextBtn") as HTMLButtonElement;
      prevBtn.disabled = this.currentPage === 1;
      nextBtn.disabled = this.currentPage === totalPages;
    
  }

  prevPage(): void {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateTable();
        this.displayRows();
      
    }
  }

  nextPage(): void {
      const myTable = document.getElementById("myTable")!.getElementsByTagName('tbody')[0];
      const totalRows = myTable.getElementsByTagName("tr").length;
      const totalPages = Math.ceil(totalRows / this.rowsPerPage);
    
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.updateTable();
        this.displayRows();
      
    }
  }

  displayRows(): void {
      const table = document.getElementById('myTable')!.getElementsByTagName('tbody')[0];
      const rows = table.getElementsByTagName('tr');
      const totalPages = Math.ceil(rows.length / this.rowsPerPage);
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = 'none';
        rows[i].style.backgroundColor = (i % 2 === 1) ? 'white' : 'white';
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
