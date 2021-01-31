```html
<table datatable [dtOptions]="dtOptions" [dtTrigger]="dtTrigger" class="row-border hover">
  <thead>
    <tr>
      <th>ID</th>
      <th>First name</th>
      <th>Last name</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let person of persons">
      <td>{{ person.id }}</td>
      <td>{{ person.firstName }}</td>
      <td>{{ person.lastName }}</td>
    </tr>
  </tbody>
</table>
```
