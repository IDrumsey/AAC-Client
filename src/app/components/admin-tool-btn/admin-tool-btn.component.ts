import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-tool-btn',
  templateUrl: './admin-tool-btn.component.html',
  styleUrls: ['./admin-tool-btn.component.css']
})
export class AdminToolBtnComponent implements OnInit {
  @Input() name: string;

  constructor() { }

  ngOnInit(): void {
  }

}
