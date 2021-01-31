```html
<form (submit)="filterById()">
  <label>
    Min
    <input type="number" name="min" id="min" [(ngModel)]="min" />
  </label>
  <label>
    Max
    <input type="number" name="max" id="max" [(ngModel)]="max" />
  </label>
  <button class="btn btn-primary" type="submit">Filter by ID</button>
</form>
<br />
<table datatable [dtOptions]="dtOptions" class="row-border hover"></table>
```
