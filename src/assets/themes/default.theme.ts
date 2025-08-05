import { input } from "@angular/core";
import { definePreset } from "@primeuix/themes";
import Aura from '@primeuix/themes/aura';

export const defaultTheme = definePreset(Aura, {
    // semantic: {
    //     colorScheme: {
    //         light: {
    //             surface: {
    //                 50: '{zinc.50}',
    //                 950: '{zinc.950}'
    //             }
    //         },
    //         dark: {
    //             surface: {
    //                 50: '{zinc.950}',
    //                 950: '{zinc.50}'
    //             }
    //         }
    //     }
    // }
});
