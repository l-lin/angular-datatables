```html
<p>
  <button type="button"
          class="btn waves-effect waves-light blue"
          (click)="displayToConsole(datatableElement)">
    Display the DataTable instance in the console
  </button>
</p>
<p>
<blockquote>
  The DataTable instance ID is: {{ (datatableElement.dtInstance | async)?.table().node().id }}
</blockquote>
</p>
<table datatable [dtOptions]="dtOptions" class="row-border hover"></table>
```
