import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith, filter } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pageTitle = 'by Sony Pictures Entertainment';
  title = 'the at-home Runner typeahead exercise';
  requirements = [
    `We have supplied sample json in the data directory to return title suggestions for a typeahead input component you'll create.`,
    'Please build a client that returns the sample json, as you would any client interacting with a json API.',
    'When the user types 3 or more characters into the input, it should show an Angular Material typeahead/autocomplete dropdown.',
    `When the user makes a selection from the dropdown, a new element below the input should show the selection's full name. Feel free to be creative with your styles.`,
    'The selected titles should be removable.',
    'This mimics a form element in our application where users assign title metadata to assets, so if you would like to build something that replicates a form submission, feel free to come up with your own solution to how it "saves" the data.'
  ];
  profileData: any = [];
  myControl = new FormControl('');
  filteredOptions: any;
  filteredData: string[] = [];
  getFullName: any;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    // Simulation of Api call 
    // Taking from JSON data (Placing Json files in assets folder is a good practice)
    this.httpClient.get("assets/data.json").subscribe(data => {
      this.profileData = data;
      // Here this logic filters name from response 
      this.filteredData = this.profileData.map(function (item: any) {
        return item.name;
      })
      // Checking Dropdown data existance 
      if (this.filteredData.length) {
        //Listening input field and trigger the filtration
        this.filteredOptions = this.myControl.valueChanges.pipe(
          // this is to trigger if entered 3 or more characters
          filter(res => {
            return res !== null && res.length >= 3
          }),
          startWith(''),
          debounceTime(100),
          distinctUntilChanged(),
          map(value => this._filter(value || '')),
        );
      }
    })
  }

  // returing the entered Item
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredData.filter((option: any) => option.toLowerCase().includes(filterValue));
  }
  onSelect(selectedData: string) {
    const filterName = this.profileData.filter(function (item: any) {
      if (item.name == selectedData) {
        return item;
      }
    })
    this.getFullName = filterName[0].full_name;
  }
}
