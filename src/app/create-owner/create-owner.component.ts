import { Component } from '@angular/core';
import { Owner } from '../owner';
import { OwnerService } from '../owner.service';
import { NumericType } from 'mongodb';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-owner',
  templateUrl: './create-owner.component.html',
  styleUrl: './create-owner.component.css'
})
export class CreateOwnerComponent {
  owner: Owner = new Owner();
  owners?: Owner[];
  owner1: Owner = new Owner();
  found: number = 0;
  notFound: number = 0;
  owner2: Owner = new Owner();
  constructor(private ownerService: OwnerService, private router: Router){

  }
  saveOwner(){
    this.ownerService.getOwnersList().subscribe(data=>{
      this.owners = data;
      if(this.owners){
        for(const o1 of this.owners){
          if(this.owner.email===o1.email){
            alert("Email already exist");
            this.notFound=1;
          }
        }
        if(this.notFound===0){
          this.ownerService.createOwner(this.owner).subscribe(data =>{
            console.log(data);
            this.router.navigate(['/loggedin', data.id]);
          },
          error => console.log(error));      
        }
      }
    })
  }
  onSubmit(){
    this.saveOwner();
  }
  login(){
    this.ownerService.getOwnersList().subscribe(data =>{
      this.owners = data;
      if(this.owners){
        for(const o1 of this.owners){
          if(o1.email===this.owner1.email){
            this.found = 1;
            if(o1.pwd===this.owner1.pwd){
              this.router.navigate(['/loggedin', o1.id]);
            }
            else{
              alert("Incorrect password");
            }
          }
        }
        if(this.found==0){
          alert("Invalid email");
        }
      }
    })
  }
  loginOwner(){
    console.log(this.owner1);
    this.login();
  }
}
