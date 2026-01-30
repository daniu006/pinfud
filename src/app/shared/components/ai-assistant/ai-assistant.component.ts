import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AiService } from 'src/app/core/services/ai.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { bulbOutline, closeOutline, sparklesOutline, sendOutline } from 'ionicons/icons';

@Component({
    selector: 'app-ai-assistant',
    templateUrl: './ai-assistant.component.html',
    styleUrls: ['./ai-assistant.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class AiAssistantComponent implements OnInit {
    isOpen = false;
    userInput = '';
    isLoading = false;
    showAssistant = false;
    currentContext = 'Inicio de la aplicación';

    messages: { role: 'ai' | 'user'; text: string }[] = [
        { role: 'ai', text: '¡Hola! Soy tu asistente inteligente de Pinfud. ¿En qué puedo ayudarte hoy?' }
    ];

    constructor(private aiService: AiService, private router: Router) {
        addIcons({ bulbOutline, closeOutline, sparklesOutline, sendOutline });
    }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: any) => {
            this.updateContext(event.url);
        });
    }

    toggleAssistant() {
        this.isOpen = !this.isOpen;
    }

    updateContext(url: string) {
        // Determinamos si se debe mostrar el asistente
        const hiddenRoutes = ['splash', 'welcome', 'login', 'register'];
        this.showAssistant = !hiddenRoutes.some(route => url.includes(route)) && url !== '/';

        if (url.includes('home')) this.currentContext = 'El usuario está en la pantalla principal viendo platos recomendados.';
        else if (url.includes('regions')) this.currentContext = 'El usuario está explorando las regiones gastronómicas del Ecuador.';
        else if (url.includes('upload')) this.currentContext = 'El usuario está en la pantalla para subir una nueva receta o plato.';
        else if (url.includes('dish')) this.currentContext = 'El usuario está viendo los detalles de un plato específico.';
        else this.currentContext = 'Navegando por la app Pinfud.';
    }

    async sendMessage() {
        if (!this.userInput.trim() || this.isLoading) return;

        const userText = this.userInput;
        this.messages.push({ role: 'user', text: userText });
        this.userInput = '';
        this.isLoading = true;

        const aiResponse = await this.aiService.generateResponse(userText, this.currentContext);
        this.messages.push({ role: 'ai', text: aiResponse });
        this.isLoading = false;
    }
}
