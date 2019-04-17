import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ICategory } from 'src/app/shared/interfaces/category.interface';
import { IMerchandiseCreateRequest } from 'src/app/shared/interfaces/merchandise.interface';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-merchandise-add',
  templateUrl: './merchandise-add.component.html',
  styleUrls: ['./merchandise-add.component.scss']
})
export class MerchandiseAddComponent implements OnInit {

  categories: ICategory[] = [];
  merchandise: IMerchandiseCreateRequest = {
    barcode: '',
    categoryID: 0,
    name: ''
  };


  @ViewChild('merchandiseForm') merchandiseForm: NgForm;

  constructor(
    private categoryService: CategoryService
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

  submit() {}

}
