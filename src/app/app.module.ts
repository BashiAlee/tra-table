import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { createCustomElement } from '@angular/elements';
import { TestComponent } from './components/test/test.component';
import { HotTableModule } from '@handsontable/angular';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HotTableModule
  ],
  providers: [],
  bootstrap: [TestComponent],
  entryComponents: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(AppComponent, { injector });
    customElements.define('tra-table', el);
  }
  ngDoBootstrap() {}
}
