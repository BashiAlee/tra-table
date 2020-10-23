import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
// import 'tra-table'
var vm;
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  dataset: any[] = [
    {id: 1, name: 'Ted Right', address: 'Wall Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 3, name: 'Joan Well', address: 'Broadway', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 4, name: 'Gail Polite', address: 'Bourbon Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 5, name: 'Michael Fair', address: 'Lombard Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 6, name: 'Mia Fair', address: 'Rodeo Drive', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 7, name: 'Cora Fair', address: 'Sunset Boulevard', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 8, name: 'Jack Right', address: 'Michigan Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 1, name: 'Ted Right', address: 'Wall Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 3, name: 'Joan Well', address: 'Broadway', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 4, name: 'Gail Polite', address: 'Bourbon Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 5, name: 'Michael Fair', address: 'Lombard Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 6, name: 'Mia Fair', address: 'Rodeo Drive', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 7, name: 'Cora Fair', address: 'Sunset Boulevard', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 8, name: 'Jack Right', address: 'Michigan Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 1, name: 'Ted Right', address: 'Wall Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 3, name: 'Joan Well', address: 'Broadway', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 4, name: 'Gail Polite', address: 'Bourbon Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 5, name: 'Michael Fair', address: 'Lombard Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 6, name: 'Mia Fair', address: 'Rodeo Drive', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 7, name: 'Cora Fair', address: 'Sunset Boulevard', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 8, name: 'Jack Right', address: 'Michigan Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 1, name: 'Ted Right', address: 'Wall Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 3, name: 'Joan Well', address: 'Broadway', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 4, name: 'Gail Polite', address: 'Bourbon Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 5, name: 'Michael Fair', address: 'Lombard Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 6, name: 'Mia Fair', address: 'Rodeo Drive', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 7, name: 'Cora Fair', address: 'Sunset Boulevard', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 8, name: 'Jack Right', address: 'Michigan Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 1, name: 'Ted Right', address: 'Wall Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 2, name: 'Frank Honest', address: 'Pennsylvania Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 3, name: 'Joan Well', address: 'Broadway', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 4, name: 'Gail Polite', address: 'Bourbon Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 5, name: 'Michael Fair', address: 'Lombard Street', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 6, name: 'Mia Fair', address: 'Rodeo Drive', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 7, name: 'Cora Fair', address: 'Sunset Boulevard', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''},
    {id: 8, name: 'Jack Right', address: 'Michigan Avenue', campaign: 'Test', mustafa: '1', assignee: '', dateAssigned: ''}
  ];
  loading: boolean;
  selectedAgent: any = '';
  selectedRows: any = [];
  assignedCalled: boolean;
  agentsList: any = [{
    name: 'TRA Campaign',
    email: 'tra@gmail.com'
  }, {
    name: 'VNS Campaign',
    email: 'vns@gamil.com'
  }]


  settings: any = {
    isExport: true,
    hasContextMenu: true,
    height: '90vh',
    width: '100%',
    hasFilter: true,
    filters: [],
    isHyperLink: {
      url: 'https://google.com',
      column: 'address'
    }
}

  constructor() {
    vm = this;
   }

  ngOnInit() {
  }

  get(e) {
    console.log("GDFDFGFD", e)
  }

  gets(e) {
    console.log("FGHFGHFGH", e)
  }

  getList(e) {
    this.assignedCalled = true;
    this.selectedRows = e;
     console.log("FGHFGHFGH", e)
  }

    getUnList(e) {
     console.log("FGHFGHFGH", e)
  }

  appliedFiltered(e) {
    console.log('fff',e)
  }

  click1() {
    this.settings = Object.assign({}, this.settings);
    this.settings.filters = [{"column":2,"operation":"conjunction","conditions":[{"name":"by_value","args":[["Broadway"]]}]}];
    console.log("1", this.settings)
  }

  click2() {
    this.settings = Object.assign({}, this.settings);
    this.settings.filters = [{"column":1,"operation":"conjunction","conditions":[{"name":"by_value","args":[["Mia Fair"]]}]}];
    console.log("2", this.settings)
  }

  click3() {
    this.settings = Object.assign({}, this.settings);
    this.settings.filters = [];
    console.log("3", this.settings)
  }

  getUnassignedList(event) {
    console.log(event);
    this.selectedRows = event;
    if (this.selectedAgent) {
      this.selectedRows.forEach(value => {
        value.assignee = '',
        value.dateAssigned = ''
      });
      this.assignedCalled = false;
    }
  }

  assignAgentToList() {
    if (this.selectedAgent) {
      this.selectedRows.forEach(value => {
        value.assignee = this.selectedAgent,
        value.dateAssigned = moment(Date.now()).format('MM-DD-YYYY');
      });
      this.assignedCalled = false;
    }
  }



}
