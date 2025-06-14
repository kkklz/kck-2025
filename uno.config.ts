import { defineConfig, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        roboto: 'Roboto',
      },
    }),
  ],
  theme: {
    colors: {
      background: '#FFF',
      text: '#1C1C1C',
      primary: '#355070',
      secondary: '#E56B6F',
      accent: {
        DEFAULT: '#B59807',
        green: '#0D7108',
      },
    },
  },
})
