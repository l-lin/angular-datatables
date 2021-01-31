import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-f-a-q',
  templateUrl: './f-a-q.component.html',
  styleUrls: ['./f-a-q.component.css']
})
export class FAQComponent implements OnInit {

  constructor() { }

  faqMd = 'assets/docs/faq.md';

  ngOnInit(): void {
  }

  onLoad(event) {
    // Hide Copy button
    $('.toolbar').hide();

    // red color for questions
    $('h5').css('color', 'red');
  }

}
