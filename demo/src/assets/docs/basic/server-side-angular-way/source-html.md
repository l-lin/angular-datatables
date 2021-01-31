```html
<table datatable [dtOptions]="dtOptions" class="row-border hover">
  <thead>
    <tr>
      <th>ID</th>
      <th>First name</th>
      <th>Last name</th>
    </tr>
  </thead>
  <tbody *ngIf="persons?.length != 0">
    <tr *ngFor="let person of persons">
      <td>{{ person.id }}</td>
      <td>{{ person.firstName }}</td>
      <td>{{ person.lastName }}</td>
    </tr>
  </tbody>
  <tbody *ngIf="persons?.length == 0">
    <tr>
      <td colspan="3" class="no-data-available">No data!</td>
    </tr>
  </tbody>
</table>
```
