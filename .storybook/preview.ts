import { inject, provideAppInitializer } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig, Preview } from '@storybook/angular';
import { PrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

function provideTheme(): void {
  const config = inject(PrimeNG);
  config.theme.set({
    preset: Aura,
    options: {
      darkModeSelector: false,
    },
  });
}

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideAppInitializer(provideTheme),
      ],
    }),
  ],
};


export default preview;