import { Component, Input, OnInit, Output, EventEmitter, OnChanges, ChangeDetectorRef } from '@angular/core';

import Handsontable from 'handsontable';
import {
  HotTableRegisterer
} from '@handsontable/angular';

import * as _ from 'lodash';

var vm;
var colHeaders = [];
var colTypes = [];
// let tableSettings = {};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [HotTableRegisterer]
})
export class AppComponent implements OnChanges{
  private hotRegisterer = new HotTableRegisterer();
  title = 'angular-table-element';
  public id = 'hotInstance';
  filteredArray: any = [];
  selectedRows: any = [];
  hasFilter: any = false;

  @Input() data: any;
  @Input() settings: any;
  @Input() source: [];
  @Output() getFiltered = new EventEmitter<any>();
  @Output() getSelected = new EventEmitter<any>();
  @Output() getAssignedList = new EventEmitter<any>();
  @Output() getUnassignedList = new EventEmitter<any>();
  // test: any = {};




  constructor(private cd: ChangeDetectorRef) {
    vm = this;
  }
  ngOnInit(): void {
  }


  hotSettings: Handsontable.GridSettings = {
    rowHeaders: false,
    stretchH: 'all',
    width: '100%',
    height: '40vh',
    undo: true,
    autoWrapRow: true,
    manualRowResize: true,
    manualColumnResize: true,
    multiColumnSorting: true,
    data: [],
    readOnly: false,
    filters:false,
    licenseKey:'non-commercial-and-evaluation',
    colHeaders: [],
    columns: [],
    dropdownMenu: ['filter_by_condition', 'filter_action_bar', 'alignment', 'filter_by_value'],
    outsideClickDeselects: false,
    afterFilter: function (conditions) {
      vm.hasFilter = true;
      vm.filteredArray = _.map(this.getPlugin('trimRows').rowsMapper._arrayMap, 
      r=>this.getSourceDataAtRow(r));  
      vm.getFiltered.emit(vm.filteredArray);
      vm.cd.detectChanges();
    },

    afterSelectionEndByProp (row,column,row1,column1, level) {
      let selected = [];
      // if (row == row1) {
      //   selected.push( vm.source[row]);
      // } else if (row > row1) {
      //   selected = [];
      //   for (let i = row1; i <= row; i++) {
      //     selected.push( vm.source[i]);
      //   }
      // } else if (row1> row) {
      //   selected = [];
      //   for (let i = row; i <= row1; i++) {
      //     selected.push( vm.source[i]);
      //   }
      // }
      let selectedValues = vm.hotRegisterer.getInstance(vm.id).getSelected();
      if (selectedValues.length) {
        selectedValues.forEach((rows, index) => {
          if (selectedValues.length == 1) {
            if (rows[0] < rows[2]) {
                selected = [];
                for (let i = rows[0]; i <= rows[2]; i++) {
                  selected.push( vm.source[i]);
                }
            }
            if (rows[0] == rows[2]) {
              selected = [];
                selected.push( vm.source[rows[0]]);
            }
            if (rows[0] > rows[2]) {
              selected = [];
              for (let i = rows[2]; i <= rows[0]; i++) {
                selected.push( vm.source[i]);
              }
            }
          } else {
            if (selectedValues != index) {
              selected.push( vm.source[rows[0]]);
            }
          }
        })
      }
      vm.getSelected.emit(selected)
      vm.cd.detectChanges();
    },
  }

  clearFilter() {
    vm.hotRegisterer.getInstance(vm.id).getPlugin("Filters").clearConditions();
    vm.hotRegisterer.getInstance(vm.id).getPlugin('Filters').filter();
    vm.hotRegisterer.getInstance(vm.id).render();
    vm.hasFilter = false;
    vm.cd.detectChanges();
  }

  generateColumnHeaders(data) {
    if (data && data.length) {
      Object.keys(data[0]).forEach((colName, index) => {
        colHeaders.push(colName)
        colTypes.push({
          data: colName,
          type: 'text'
        })
      });
    }
  }

  exportFile() {
    let hotInstance = this.hotRegisterer.getInstance(vm.id).getPlugin('exportFile');
    hotInstance.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      type: true,
      filename: 'file_[YYYY]-[MM]-[DD]',
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: false,
    });
  }

  async ngOnChanges() {
    if (!vm.hotRegisterer.getInstance(vm.id)) {
      await vm.hotRegisterer.registerInstance(vm.id, vm.hotSettings)
    }
    vm.filteredArray = vm.source;
    vm.generateColumnHeaders(vm.source);
    vm.hotRegisterer.getInstance(vm.id).updateSettings({
      data: vm.source,
      readOnly: vm.settings && vm.settings.hasOwnProperty('readOnly') ? vm.settings.readOnly: true,
      filters: vm.settings &&  vm.settings.hasOwnProperty('hasFilter') ? vm.settings.hasFilter: true,
      colHeaders: colHeaders,
      columns: colTypes
    })

    if (vm.settings && vm.settings.hasContextMenu) {
      vm.hotRegisterer.getInstance(vm.id).updateSettings({
        contextMenu: {
          items: {
            'assign_value': {
            name: 'Assign',
            callback: function(key, coordinates) {
              let array = vm.filteredArray;
              vm.selectedRows = [];
              if (coordinates.length == 1) {
                let coords = coordinates[0]
                if (coords.start.row == coords.end.row) {
                  vm.selectedRows.push(array[coords.start.row]);
                } else if (coords.start.row > coords.end.row) {
                  for (var i = coords.end.row; i <= coords.start.row; i++) {
                    vm.selectedRows.push(array[i])
                  }
                } else if (coords.end.row > coords.start.row) {
                  for (var i = coords.start.row; i <= coords.end.row; i++) {
                    vm.selectedRows.push(array[i])
                  }
                }
              } else if (coordinates.length > 1) {
                coordinates.forEach((coords) => {
                  if (coords.start.row == coords.end.row) {
                    vm.selectedRows.push(array[coords.start.row]);
                  } else if (coords.start.row > coords.end.row) {
                    for (var i = coords.end.row; i <= coords.start.row; i++) {
                      vm.selectedRows.push(array[i])
                    }
                  } else if (coords.end.row > coords.start.row) {
                    for (var i = coords.start.row; i <= coords.end.row; i++) {
                      vm.selectedRows.push(array[i])
                    }
                  }
                })
              }
              vm.getAssignedList.emit(vm.selectedRows)
              vm.cd.detectChanges();
            }
          },
          'unassign_value': {
            name: 'Unassign',
            callback: function(key, coordinates) {
              let array = vm.filteredArray;
              vm.selectedRows = [];
              if (coordinates.length == 1) {
                let coords = coordinates[0]
                if (coords.start.row == coords.end.row) {
                  vm.selectedRows = [];
                  vm.selectedRows.push(array[coords.start.row]);
                } else if (coords.start.row > coords.end.row) {
                  for (var i = coords.end.row; i <= coords.start.row; i++) {
                    vm.selectedRows.push(array[i])
                  }
                } else if (coords.end.row > coords.start.row) {
                  for (var i = coords.start.row; i <= coords.end.row; i++) {
                    vm.selectedRows.push(array[i])
                  }
                }
              } else if (coordinates.length > 1) {
                coordinates.forEach((coords) => {
                  if (coords.start.row == coords.end.row) {
                    vm.selectedRows.push(array[coords.start.row]);
                  } else if (coords.start.row > coords.end.row) {
                    for (var i = coords.end.row; i <= coords.start.row; i++) {
                      vm.selectedRows.push(array[i])
                    }
                  } else if (coords.end.row > coords.start.row) {
                    for (var i = coords.start.row; i <= coords.end.row; i++) {
                      vm.selectedRows.push(array[i])
                    }
                  }
                })
              }
               vm.getUnassignedList.emit(vm.selectedRows)
               vm.cd.detectChanges();
            }
          },
        }
        }
      })
       vm.cd.detectChanges();
    vm.hotRegisterer.getInstance(vm.id).render();
    vm.cd.detectChanges();
    }
  }
}
