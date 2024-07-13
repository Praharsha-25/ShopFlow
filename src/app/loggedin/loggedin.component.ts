import { Component, OnInit, Inject, PLATFORM_ID, numberAttribute, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../customer';
import { CustomerTransactions } from '../customer-transactions';
import { CustomerService } from '../customer.service';
import { count, error } from 'console';
import { CustomerTransactionService } from '../customer-transaction.service';
import { OwnerService } from '../owner.service';
import { Owner } from '../owner';
import { on } from 'events';
import { StockService } from '../stock.service';
import { Stock } from '../stock';
@Component({
  selector: 'app-loggedin',
  templateUrl: './loggedin.component.html',
  styleUrl: './loggedin.component.css'
})
export class LoggedinComponent implements OnInit{
  @ViewChild('myModal', { static: false }) myModal: ElementRef<HTMLDivElement> | undefined; 
  currentPage = 1;
  rowsPerPage = 10;
  customer: Customer = new Customer();
  customerTransaction: CustomerTransactions = new CustomerTransactions();
  customers?: Customer[];
  transactions?: CustomerTransactions[];
  countCust: number = 0;
  countProduct: number = 0;
  totalRevenue: number = 0;
  alert: string = '';
  avgTransaction: number = 0.00;
  ownerId: number = 0;
  addedProductNames: HTMLInputElement[] = [];
  addedProductPrices: HTMLInputElement[] = [];
  searchText: string = '';
  filterTransactions?: CustomerTransactions[];
  owner: Owner = new Owner();
  dob: string = '';
    constructor(@Inject(PLATFORM_ID) private platformId: Object,private router: Router, private customerService: CustomerService, private cts: CustomerTransactionService, private route: ActivatedRoute, private ownerService: OwnerService, private stockService: StockService) {}
  logout(){
    this.router.navigate(['']);
  }
  history(){
    this.router.navigate(['/history', this.ownerId]);
  }
  analysis(){
    this.router.navigate(['/piechart', this.ownerId])
  }
  stock(){
    this.router.navigate(['/stock',this.ownerId])
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.displayRows();
      this.avgRevenue();
    }
    this.route.params.subscribe(data=>{
      this.ownerId = +data['ownerId'];
    });
    setTimeout(() =>this.cts.getTransactionsForOwner(this.ownerId).subscribe(data=>{
      this.transactions = data;
      this.totalCustomer();
      this.totalProducts();
      this.revenue();
      setTimeout(() => this.avgRevenue(), 100);
      setTimeout(() => this.updateTable(), 0);
      this.deleteEmptyCustomers();
      this.getOwner();
    }, error=>console.log(error)), 150);
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
      this.router.navigate(['/loggedin', this.ownerId]);
    }, error => console.log(error));
    alert("Updated Successfully");

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
      trans?.customer?.phnNo?.toString().includes(this.searchText)) ?? false
    ); 
    this.currentPage = 1;
    this.updateTable();
    return this.filterTransactions || [];
  }
  totalCustomer(): void{
    this.customerService.countCustomers(this.ownerId).subscribe(data=>{
      this.countCust = data;
    }, error => console.log(error));  
  }
  totalProducts(): void{
    this.cts.countProducts(this.ownerId).subscribe(data=>{
      this.countProduct = data;
    }, error=> console.log(error));
  }
  revenue(): void{
    this.totalRevenue = 0;
    this.cts.totalRevenue(this.ownerId).subscribe(data =>{
      this.totalRevenue = data;
    }, error => console.log(error));
  }
  avgRevenue(): void{
    if(this.countCust!=undefined && this.totalRevenue>0){
      this.avgTransaction = this.totalRevenue/this.countCust;
      this.avgTransaction = +this.avgTransaction.toFixed(4);
    }
    else {
      this.avgTransaction = 0;
    }
  }
  editTransaction(index: number): void{
    if(this.transactions!=undefined){
      const transaction1 = this.transactions[index];

      const customerNameInput = document.createElement("input");
      customerNameInput.type = "text";
      customerNameInput.value = transaction1.customer?.customerName || '';

      const productNameInput = document.createElement("input");
      productNameInput.type = "text";
      productNameInput.value = transaction1.productName || '';

      const productPriceInput = document.createElement("input");
      productPriceInput.type = "number";
      productPriceInput.value = transaction1.productPrice?.toString() || '';

      const phnNoInput = document.createElement("input");
      phnNoInput.type = "tel";
      phnNoInput.value = transaction1.customer?.phnNo?.toString() || '';

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
        const tableRow = table.rows[index];
        const originalCustomerName = tableRow.cells[0].innerHTML;
        const originalProductName = tableRow.cells[1].innerHTML;
        const originalProductPrice = tableRow.cells[2].innerHTML;
        const originalPhnNo = tableRow.cells[3].innerHTML;

        tableRow.cells[0].innerHTML = '';
        tableRow.cells[0].appendChild(customerNameInput);

        tableRow.cells[1].innerHTML = '';
        tableRow.cells[1].appendChild(productNameInput);
      
        tableRow.cells[2].innerHTML = '';
        tableRow.cells[2].appendChild(productPriceInput);
      
        tableRow.cells[3].innerHTML = '';
        tableRow.cells[3].appendChild(phnNoInput);
        
        tableRow.cells[4].innerHTML = '';
        tableRow.cells[4].appendChild(btn);
        tableRow.cells[4].appendChild(btnCancel);
        
        btn.addEventListener("click", () => {
          if(this.transactions!=undefined){
            let customer1: Customer = new Customer();
            customer1.customerName = customerNameInput.value;
            customer1.phnNo = Number(phnNoInput.value);
            if (this.ownerId) {
              this.ownerService.getOwnerById(this.ownerId).subscribe((data: Owner) => {
                customer1.owner = data;
                this.stockService.findByProductNameForOwner(this.ownerId, productNameInput.value).subscribe((data)=>{
                  let stock = data;
                  if(stock!=null){
                    this.customerService.createCustomer(customer1).subscribe(data =>{
                      console.log(data);
                    }, error => console.log(error));
                    transaction1.customer = customer1;
                    transaction1.date = new Date();
                    transaction1.productName = productNameInput.value;
                    transaction1.productPrice = Number(productPriceInput.value);
                    setTimeout(() => {
                      if(this.transactions){
                        this.transactions[index] = transaction1;
                        this.cts.createTransaction(this.transactions[index]).subscribe(data => {
                          console.log("Inserted", data);
                          if(stock.stock){
                            stock.stock--;
                            if(stock.stock == 0 && this.transactions && stock.id){
                              this.alert = `${this.transactions[index].productName} went out of stock`;
                              this.stockService.deleteProduct(stock.id).subscribe(()  =>{
                                console.log("Deleted");
                              }, error => console.log(error));
                            }
                          }
                          this.stockService.updateProduct(stock).subscribe(data =>{
                            console.log(data);
                          }, error => console.log(error));
                          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                            this.router.navigate(['/loggedin', this.ownerId]);
                          });
                        }, error => console.log(error));
                      }
                    }, 100)
                  }
                  else{
                    alert("No stock");
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                      this.router.navigate(['/loggedin', this.ownerId]);
                    });
                  }
                }, error => console.log(error));
                
              }, error => {
                console.log("Error fetching owner:", error);
              });
            } else {
              console.log("Owner ID is not valid");
            }
          }
          this.customerService.getCustomersList().subscribe(data =>{
            console.log(data);  
            setTimeout(() => {
              for(const cust of data){
                if(cust.id){
                  this.customerService.countTransactionsForCustomer(cust.id).subscribe(count =>{
                    if(count === 0 && cust.id){
                      this.customerService.deleteCustomer(cust.id).subscribe(() => {
                        console.log(`Customer with ID ${cust.id} deleted successfully.`);
                      }, error => {
                        console.error(`Error deleting customer with ID ${cust.id}:`, error);
                      });
                      
                    }
                  });
                  
                }
                
              }
            }, 150);
              
            })
        });
        btnCancel.addEventListener("click", () => {
          tableRow.cells[0].innerHTML = originalCustomerName;
          tableRow.cells[1].innerHTML = originalProductName;
          tableRow.cells[2].innerHTML = originalProductPrice;
          tableRow.cells[3].innerHTML = originalPhnNo;
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
          edit.addEventListener("click", () => this.editTransaction(index));
          delete1.addEventListener("click", () => this.deleteTrans(index)); 
          tableRow.cells[4].innerHTML = '';
          tableRow.cells[4].appendChild(edit);
          tableRow.cells[4].appendChild(delete1);
          this.updateTable();      
        });
      }
      
    }
  }
  deleteEmptyCustomers(): void{
    this.customerService.getCustomersList().subscribe(data =>{
      console.log(data);  
      setTimeout(() => {
        for(const cust of data){
          if(cust.id){
            this.customerService.countTransactionsForCustomer(cust.id).subscribe(count =>{
              if(count === 0 && cust.id){
                this.customerService.deleteCustomer(cust.id).subscribe(() => {
                  console.log(`Customer with ID ${cust.id} deleted successfully.`);
                }, error => {
                  console.error(`Error deleting customer with ID ${cust.id}:`, error);
                });
                
              }
            });
            
          }
          
        }
      }, 150);
        
      })
  }
  deleteTrans(index: number): void{
    if(this.transactions!=undefined){
      const transaction1 = this.transactions[index];
      if(transaction1.customer){
        const count = this.countCustomersById(transaction1.customer);
        if(count>1){
          if(transaction1.id){
            this.cts.deleteTransaction(transaction1.id).subscribe(()=>{
              console.log("Deleted");
            }, error=> console.log(error));
          }  
        }
        else{
          if(transaction1.id){
            this.cts.deleteTransaction(transaction1.id).subscribe(()=>{
              console.log("Deleted");
            }, error=> console.log(error));
          }
          if (transaction1.customer?.id !== undefined) {
            const customerId = transaction1.customer.id;
            setTimeout(() => {
              this.customerService.deleteCustomer(customerId).subscribe(() => {
                console.log("Deleted");
              }, error => console.log(error));
            }, 100);
          }
          
        }
      }
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/loggedin', this.ownerId]);
      });
    }
  }
  countCustomersById(cust: Customer): number{
    let count = 0;
    if(this.transactions){
      for(const trans of this.transactions){
        if(trans.customer == cust){
          count++;
        }
      }
    }
    return count;
  }
  add(): void {
    if (isPlatformBrowser(this.platformId)) {
      const myTable = document.getElementById("myTable")!.getElementsByTagName('tbody')[0];
      const myButton = document.getElementById("myButton") as HTMLButtonElement;
      myButton.disabled = true;
      const rows = myTable.rows.length;
      const r = myTable.insertRow(rows);
      const c1 = r.insertCell(0);  
      const c2 = r.insertCell(1);  
      const c3 = r.insertCell(2);  
      const c4 = r.insertCell(3);
      const c5 = r.insertCell(4);
      [c1, c2, c3, c4, c5].forEach(cell => {
        cell.style.border = "1px solid rgb(138, 133, 133)";
        cell.style.padding = "8px";
      });
      const customerName = document.createElement("input");  
      const productName = document.createElement("input");  
      const productPrice = document.createElement("input"); 
      const phnNo = document.createElement("input");
      customerName.required = true;    
      productName.required = true;    
      productPrice.required = true;    
      phnNo.required = true; 
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      const btn = document.createElement("button"); 
      const edit = document.createElement("button"); 
      const delete1 = document.createElement("button"); 
      const btnCancel = document.createElement("button"); 
      const add = document.createElement("button");
      customerName.type = "text";  
      productName.type = "text";  
      productPrice.type = "number";
      phnNo.type = "tel";
      phnNo.pattern = "\\d{10}";
      customerName.className = "form-control mx-auto";
      productName.className = "form-control mx-auto";
      productPrice.className = "form-control mx-auto";
      phnNo.className = "form-control mx-auto";
      add.type = "button";
      add.textContent = "+";
      add.className = "btn btn-sm";
      btn.type = "button";  
      btn.textContent = "Confirm";
      btn.className = "btn btn-primary btn-sm";
      btn.style.marginRight = "5px";
      edit.type = "button";
      edit.textContent = "Edit";
      edit.className = "btn btn-warning btn-sm";
      edit.style.marginRight = "5px"; 
      delete1.type = "button";
      delete1.textContent = "Delete";
      delete1.className = "btn btn-danger btn-sm";
      delete1.style.width = "80px";
      btnCancel.type = "button";
      btnCancel.textContent = "Cancel";
      btnCancel.className = "btn btn-secondary btn-space btn-sm";
      edit.style.width = "80px"; 
      customerName.style.width = "126px";
      productName.style.width = "112.5px";
      productName.style.marginLeft = "2px";
      productPrice.style.width = "113px";
      phnNo.style.width = "100px";
      c1.appendChild(customerName);  
      container.appendChild(productName);
      container.appendChild(add);
      c2.appendChild(container);  
      c3.appendChild(productPrice);
      c4.appendChild(phnNo);
      c5.appendChild(btn); 
      c5.appendChild(btnCancel); 
      this.addedProductNames.push(productName);
      this.addedProductPrices.push(productPrice);
      edit.addEventListener("click", () => this.editTransaction(rows));
      delete1.addEventListener("click", () => this.deleteTrans(rows)); 
      btn.addEventListener("click", () => {
        const products = this.getAllProductDetails();
        if (customerName.checkValidity() && productName.checkValidity() && productPrice.checkValidity() && phnNo.checkValidity()) {
          c1.textContent = customerName.value;
          c2.textContent = productName.value;
          c3.innerHTML = `&#8377; ${productPrice.value}`;
          c4.textContent = phnNo.value;
          c5.removeChild(btn);  
          c5.removeChild(btnCancel);  
          c5.appendChild(edit);
          c5.appendChild(delete1);
          myButton.disabled = false;
          this.updateTable();
          this.customer.customerName = customerName.value;
          let ph: number = Number(phnNo.value);
          this.customer.phnNo = ph;
          if(this.ownerId){
            this.ownerService.getOwnerById(this.ownerId).subscribe((data: Owner)=>{
              this.customer.owner = data;
              this.customerService.createCustomer(this.customer).subscribe(data =>{
                console.log(data);
              }, error => console.log(error));
              this.customerTransaction.date = new Date();
          
              this.customerTransaction.customer = this.customer;
              
              for (const prod of products) {
                let newTransaction = new CustomerTransactions();
                setTimeout(() => {
                  newTransaction = Object.assign({}, this.customerTransaction);
                  newTransaction.productName = prod.productName;
                  newTransaction.productPrice = Number(prod.productPrice);
                }, 100);
                setTimeout(() => {
                  if(newTransaction.productName){ 
                  this.stockService.findByProductNameForOwner(this.ownerId, newTransaction.productName).subscribe(data => {
                    let stock1 = data;
                    if(stock1!=null){
                      this.cts.createTransaction(newTransaction).subscribe(data => {
                        console.log(data);
                        let stock = new Stock();
                        if(newTransaction.productName){
                          this.stockService.findByProductNameForOwner(this.ownerId, newTransaction.productName).subscribe(data => {
                            stock = data;
                            if(stock!=null){
                              if(stock.stock)
                                stock.stock--;
                              if(stock.stock == 0 && stock.id){
                                this.stockService.deleteProduct(stock.id).subscribe(() => console.log("Deleted"), error => console.log("Error"));
                              }
                              this.stockService.updateProduct(stock).subscribe(data =>{
                                console.log(data);
                              }, error => console.log(error));
                            }
                          })
                        }
                      }, error => console.log(error));
                    }
                    else
                      alert("No Stock");
                  }, error => console.log(error));}
                    
                }, 100);
                
              }
              
            }, error => console.log(error));
          }
          
          setTimeout(() =>{
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/loggedin', this.ownerId]);
            });
          }, 151)
        } else {
          customerName.reportValidity();
          productName.reportValidity();
          productPrice.reportValidity();
          phnNo.reportValidity();
        }
      }); 
      btnCancel.addEventListener("click", () => {
        const rowIndex = Array.prototype.indexOf.call(myTable.children, r);
        myTable.deleteRow(rowIndex);
        myButton.disabled = false;
        this.updateTable();
      });
      add.addEventListener("click", () =>{
        const productName1 = document.createElement("input");  
            const productPrice1 = document.createElement("input");
            productName1.required = true;    
            productPrice1.required = true;
            productName1.type = "text";  
            productPrice1.type = "number";
            productName1.className = "form-control";
            productPrice1.className = "form-control mx-auto";
            productName1.style.width = "112.5px";
            productPrice1.style.width = "113px";
            productName1.style.marginLeft = "35px";
            productName1.style.marginTop = "5px";
            productPrice1.style.marginTop = "5px";
            c2.appendChild(productName1);
            c3.appendChild(productPrice1);
            
            this.addedProductNames.push(productName1);
            this.addedProductPrices.push(productPrice1);
      });
      this.updateTable();
    }
  }
  getAllProductDetails(): { productName: string, productPrice: string }[] {
    const productDetails = [];
    for (let i = 0; i < this.addedProductNames.length; i++) {
        productDetails.push({
            productName: this.addedProductNames[i].value,
            productPrice: this.addedProductPrices[i].value
        });
    }
    return productDetails;
  }  
  updateTable(): void {
    if (isPlatformBrowser(this.platformId)) {
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
}
