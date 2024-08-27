# Partiel de front pour S2 A2 NWS en React

### Pour clone le projet : 
```
    git clone https://github.com/Adambizien/partiel-front.git
    npm install
    npm start
```
### Création du projet :
```
    npx create-react-app partiel-front
    cd partiel-front/
    npm start
```
### Création du systéme de route ([ici](https://github.com/Adambizien/partiel-front/blob/main/src/App.js)):
```
    npm install react-router-dom
```
### Mise en place de tailwind
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
### Implementer des icon :
```
 npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
```

### Implementer des selecte multiple :
```
 npm install react-select
```

### Mise en place de l'interface home avec la recherche de film [ici](https://github.com/Adambizien/partiel-front/blob/main/src/pages/HomePage.js)
### Mise en place de l'interface des détails du film [ici](https://github.com/Adambizien/partiel-front/blob/main/src/pages/MovieDetails.js)


