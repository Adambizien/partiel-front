# Partiel de front pour S2 A2 NWS 


#### Création du projet :
```
    npx create-react-app partiel-front
    cd partiel-front/
    npm start
```
#### Création du systéme de route ([ici](https://github.com/Adambizien/partiel-front/blob/main/src/App.js)):
```
    npm install react-router-dom
```
#### Mise en place de tailwind
``` 
  npm install -D tailwindcss
  npx tailwindcss init
```
 - Implementer dans tailwind.config.js
```
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
``` 

- Implementer dans index.css
```
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
```
