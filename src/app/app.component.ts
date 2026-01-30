import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AiAssistantComponent } from './shared/components/ai-assistant/ai-assistant.component';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, AiAssistantComponent],
})
export class AppComponent {
  constructor() { }
}

