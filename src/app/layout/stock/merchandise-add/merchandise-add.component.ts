import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { MerchandiseCreateRequest } from 'src/app/shared/interfaces/merchandise.interface';
import { CategoryService } from 'src/app/core/services/category.service';
import { Router } from '@angular/router';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';

@Component({
  selector: 'app-merchandise-add',
  templateUrl: './merchandise-add.component.html',
  styleUrls: ['./merchandise-add.component.scss']
})
export class MerchandiseAddComponent implements OnInit {

  categories: ICategory[] = [];
  merchandise: MerchandiseCreateRequest = {
    code: '',
    barcode: '',
    categoryID: 0,
    name: '',
    brand: '',
    scale: '',
    factory: '',
    unit: ''
  };


  @ViewChild('merchandiseForm') merchandiseForm: NgForm;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private merchandiseService: MerchandiseService
  ) { }

  ngOnInit() {
    this.merchandise.barcode = localStorage.getItem('barcode');
    this.getCategory();
  }

  getCategory() {
    this.categoryService.list()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  cancel(event: Event) {
    event.preventDefault();
    this.router.navigate(['/stock/in']);
  }

  submit() {
    console.log(this.merchandise);
    this.merchandiseService.add(this.merchandise)
      .subscribe((createdMerchandise: MerchandiseCreateRequest) => {
        this.merchandiseForm.form.markAsPristine();
        this.router.navigate(['/stock/in']);
      });
  }

}
