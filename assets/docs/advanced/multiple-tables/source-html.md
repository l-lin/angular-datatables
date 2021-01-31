```html
<p>
<button type="button" class="btn waves-effect waves-light blue" (click)="displayToConsole()">
  Display the DataTable instances in the console
</button>
</p>
<table id="first-table" datatable [dtOptions]="dtOptions[0]" class="row-border hover"></table>
<table id="second-table" datatable [dtOptions]="dtOptions[1]" class="row-border hover"></table>
```
