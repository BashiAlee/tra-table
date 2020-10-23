import { Component, Input, OnInit, Output, EventEmitter, OnChanges, ChangeDetectorRef, ViewEncapsulation, DoCheck } from '@angular/core';

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
  selectedRowsCount = null;
  @Input() data: any;
  @Input() settings: any;
  @Input() source: [];
  @Output() getFiltered = new EventEmitter<any>();
  @Output() getSelected = new EventEmitter<any>();
  @Output() getAssignedList = new EventEmitter<any>();
  @Output() getUnassignedList = new EventEmitter<any>();
  @Output() getFiltersList = new EventEmitter<any>();
  @Output() hasClickedOutside = new EventEmitter<any>();
  // test: any = {};




  constructor(private cd: ChangeDetectorRef) {
    vm = this;
  }
  ngOnInit(): void {
  }


  hotSettings: Handsontable.GridSettings = {
    rowHeaders: false,
    stretchH: 'all',
    undo: true,
    autoWrapRow: true,
    manualRowResize: true,
    manualColumnResize: true,
    multiColumnSorting: true,
    data: [],
    readOnly: false,
    licenseKey:'non-commercial-and-evaluation',
    colHeaders: [],
    columns: [],
    dropdownMenu: ['filter_by_condition', 'filter_action_bar', 'alignment', 'filter_by_value'],
    // outsideClickDeselects: false,
    afterFilter: function (conditions) {
      console.log("GDFHFG", this.getData())
      vm.getFiltersList.emit(conditions);
      vm.hasFilter = true;
      vm.filteredArray = _.map(this.getPlugin('trimRows').rowsMapper._arrayMap, 
      r=>this.getSourceDataAtRow(r));
      console.log("filtereddd", vm.filteredArray)
      vm.getFiltered.emit(vm.filteredArray);
      vm.cd.detectChanges();
    },
    outsideClickDeselects: function(event) {
      vm.selectedRowsCount = null;
      vm.selectedRows = [];
      vm.hasClickedOutside.emit(true)
      vm.cd.detectChanges();
      return true;
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
                selected.push( vm.hasFilter? vm.filteredArray[i] :vm.source[i]);
              }
          }
          if (rows[0] == rows[2]) {
            selected = [];
              selected.push( vm.hasFilter? vm.filteredArray[rows[0]] :vm.source[rows[0]]);
          }
          if (rows[0] > rows[2]) {
            selected = [];
            for (let i = rows[2]; i <= rows[0]; i++) {
              selected.push( vm.hasFilter? vm.filteredArray[i] :vm.source[i]);
            }
          }
        } else {
          if (selectedValues != index) {
            selected.push( vm.hasFilter? vm.filteredArray[rows[0]] :vm.source[rows[0]]);
          }
        }
        })
      }
      vm.selectedRowsCount = selected.length;
      // selected = _.compact(selected)
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
    // localStorage.removeItem('appliedFiltered');
  }

  generateColumnHeaders(data) {
    colTypes = [];
    colHeaders = [];
    if (data && data.length) {
      Object.keys(data[0]).forEach((colName, index) => {
        colHeaders.push(colName)
        // colTypes.push({
        //   data: colName,
        //   type: 'text',
        //   renderer: 'html'
        // })
        if (vm.settings && vm.settings.isHyperLink && vm.settings.isHyperLink.column == colName) {
          colTypes.push({
            type: 'text',
            data: colName,
            renderer: function(instance, td, row, col, prop, value) {
              Handsontable.renderers.HtmlRenderer.apply(this, arguments);
              td.innerHTML = `<a href="${vm.settings.isHyperLink.url + value}">${value}</a>`
            },
          })
        } else {
          colTypes.push({
            type: 'text',
            data: colName
          })
        }
      });
    }
  }

  exportFile() {
    let hotInstance = this.hotRegisterer.getInstance(vm.id).getPlugin('exportFile');
    hotInstance.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      exportHiddenColumns: false,
      exportHiddenRows: true,
      fileExtension: 'csv',
      hiddenColumns: true,
      type: true,
      filename: 'file_[YYYY]-[MM]-[DD]',
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: false,
    });
  }

  async ngOnChanges() {
    let appliedFilters = [];
    if (vm.settings && vm.settings.filters) {
      appliedFilters =vm.settings.filters;
    }

    if (!vm.hotRegisterer.getInstance(vm.id)) {
      await vm.hotRegisterer.registerInstance(vm.id, vm.hotSettings)
    }

    if (this.hasFilter) {
      await vm.clearFilter();
    }

    vm.filteredArray = vm.source;
    vm.generateColumnHeaders(vm.source);
    vm.hotRegisterer.getInstance(vm.id).updateSettings({
      data: vm.source,
      readOnly: vm.settings && vm.settings.hasOwnProperty('readOnly') ? vm.settings.readOnly: true,
      filters: vm.settings &&  vm.settings.hasOwnProperty('hasFilter') ? vm.settings.hasFilter: true,
      colHeaders: colHeaders,
      columns: colTypes,
      height: vm.settings && vm.settings.hasOwnProperty('height') ? vm.settings.height: 'auto',
      width: vm.settings && vm.settings.hasOwnProperty('width') ? vm.settings.width: '100%',
      hiddenColumns: {
        columns: vm.settings.hideColumns? vm.settings.hideColumns : [],
        indicators: false
      }
    })

    // const hideColPlugin = vm.hotRegisterer.getInstance(vm.id).getPlugin('hiddenColumns');
    // hideColPlugin.hideColumns([0, 4, 6]);
    // vm.hotRegisterer.getInstance(vm.id).render();
    // vm.cd.detectChanges();
 
    if (appliedFilters){
      const filtersPlugin = vm.hotRegisterer.getInstance(vm.id).getPlugin('filters');
      if (appliedFilters.length == 1) {
        let filter = appliedFilters[0];
        if (filter.conditions.length){
          filter.conditions.forEach(cond => {
             filtersPlugin.addCondition(filter.column,cond.name, cond.args);
          });
        } else {
          filtersPlugin.addCondition(filter.column,filter.column[0].name, filter.column[0].args);
        }
        filtersPlugin.filter();
       
      } else {
        appliedFilters.forEach(filter => {
          if (filter.conditions.length){
            filter.conditions.forEach(cond => {
               filtersPlugin.addCondition(filter.column,cond.name, cond.args);
            });
          } else {
            filtersPlugin.addCondition(filter.column,filter.column[0].name, filter.column[0].args);
          }
          filtersPlugin.filter();
        });
      }
    }


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
    vm.hotRegisterer.getInstance(vm.id).render();
    vm.cd.detectChanges();
    }
  }
}
