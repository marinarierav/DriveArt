import { Component } from '@angular/core';

import { CanvasPage } from '../canvas/canvas';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CanvasPage;

  constructor() {

  }
}
