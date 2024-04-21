```typescript
import { Component } from "@angular/core";
import { Config } from "datatables.net";

@Component({
  selector: "app-new-server-side",
  templateUrl: "./new-server-side.component.html",
  styleUrls: ["./new-server-side.component.css"],
})
export class NewServerSideComponent {
  dtOptions: Config = {};

  ngOnInit(): void {
    this.dtOptions = {
      serverSide: true, // Set the flag
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>("https://somedomain.com/api/1/data/", dataTablesParameters, {}).subscribe((resp) => {
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data,
          });
        });
      },
      columns: [
        {
          title: "ID",
          data: "id",
        },
        {
          title: "First name",
          data: "firstName",
        },
        {
          title: "Last name",
          data: "lastName",
        },
      ],
    };
  }
}
```
