# archie_client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Run it with local server

1. change the `https` option on `vue.config.js` to `false`<br>
2. add `http://localhost:3000` in `config/cors.js` on <a href="https://dev.azure.com/wpai/archie_server/_git/archie_server">archie_server</a>
3. uncomment the http server stuff and comment out the https server stuff on `express.js` on <a href="https://dev.azure.com/wpai/archie_server/_git/archie_server">archie_server</a>
4. add the following `.env.local` file<br>
```
 NODE_ENV=development
 VUE_APP_API_URL=http://localhost:3000
 VUE_APP_UI_URL=http://localhost:8080
  ```
5. start local server (`npm start` from archie_server project)
6. start client (`npm run start:local`)