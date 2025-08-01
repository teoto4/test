import { Clipboard } from '@angular/cdk/clipboard';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  //Примечание: Параметры в API которые фильтруют числа и спец символы, оказались платной функцией, потому использовался вот такой метод обработки пароля на стороне клиента.

  password : string = '';
  length:number = 10;
  isNumber: boolean = true;
  isSymbol: boolean = true;
  maxLength: number = 500;

  isLoad:boolean = false;
  isCopy:boolean = false;
  error_message: string = '';


  private API:string = "https://api.api-ninjas.com/v1/passwordgenerator";
  private API_key:string = "4esjkkiOC20vYa5KleKP2w==FvS22lNwPoNqgYtn";

  generatePassword(){
    if(this.length < 4){
      this.error_message = 'The minimum length must be greater than or equal to four.'
      return;
    } else if(this.length > 300){
      this.error_message = 'Please enter a number less than or equal to 300';
      return;
    }

    const params = {
      'length': this.maxLength.toString(),
    }
    const headers = new HttpHeaders({
      'X-Api-Key': this.API_key,
    })
    this.isLoad = true;
    this.http.get<{ random_password: string }>(this.API, {headers, params}).subscribe({
      next: (data)=>{
        this.isLoad = false;
        let random_password = data.random_password;
        if(!this.isNumber){
          random_password = random_password.replace(/\d/g, '');
        }
        if(!this.isSymbol){
          random_password = random_password.replace(/[^a-zA-Z0-9]/g, '');
        }

        this.password = random_password.substring(0, this.length);
      },
      error:(error)=>{
        this.isLoad = false;
        console.error("Error Generation", error);
        this.password = "Error";
      }
    });

  }

  copyPassword(){
    if(this.password){
      this.clipboard.copy(this.password);
      this.isCopy = true;
      setTimeout(()=>{
        this.isCopy = false;
      }, 1000)
    }
  }

  constructor(private clipboard: Clipboard, private http: HttpClient){}
}
