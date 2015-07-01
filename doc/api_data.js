define({ "api": [
  {
    "type": "get",
    "url": "/api",
    "title": "Version",
    "group": "API",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "version",
            "description": "<p>Version actual de la API</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n{\n  \"version\": \"0.0.1\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/index.js",
    "groupTitle": "API",
    "name": "GetApi",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/facebook",
    "title": "Facebook login",
    "group": "Autenticacion",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>Código de autorización de Facebook</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "clientId",
            "description": "<p>Id de la app</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "redirectUri",
            "description": "<p>La uri a la cual se va a redireccionar</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Token de acceso valido</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/auth/facebook/index.js",
    "groupTitle": "Autenticacion",
    "name": "PostAuthFacebook",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/facebook"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/login",
    "title": "Login",
    "group": "Autenticacion",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email del usuario</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password del usuario</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"email\":\"unify.argentina@gmail.com\",\n  \"password\":\"hola1234\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Token de acceso valido</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/auth/local/index.js",
    "groupTitle": "Autenticacion",
    "name": "PostAuthLogin",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/login"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "Signup",
    "group": "Autenticacion",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Email del usuario</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Nombre del usuario</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Password del usuario, debera tener 6 caracteres como minimo</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "confirm_password",
            "description": "<p>Tiene que ser igual que el password</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"email\":\"unify.argentina@gmail.com\",\n  \"name\":\"Juan Losa\",\n  \"confirm_password\":\"hola1234\",\n  \"password\":\"hola1234\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Token de acceso valido</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/auth/local/index.js",
    "groupTitle": "Autenticacion",
    "name": "PostAuthSignup",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/signup"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/user/:id/circle",
    "title": "Crear un circulo",
    "group": "Circulos",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Id del usuario</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Nombre del circulo a crear</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "parent_id",
            "description": "<p>Id del circulo padre</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"name\":\"Amigos\",\n  \"parent_id\":\"55936a0460bb409c379800b7\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "circle",
            "description": "<p>Circulo creado</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\": {\n    \"__v\":0,\n    \"parent\":\n    \"55936a0460bb409c379800b7\",\n    \"name\":\"Amigos\",\n    \"_id\":\"55936a8960bb409c379800b8\",\n    \"contacts\":[]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/circle/index.js",
    "groupTitle": "Circulos",
    "name": "GetApiUserIdCircle",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:id/circle"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/user/:id",
    "title": "Obtener Usuario",
    "group": "Usuarios",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Bearer token</p> "
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Id del usuario</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "user",
            "description": "<p>Usuario</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n\n{\n   \"user\": {\n     \"mainCircle\":\"558748787f0a76cc4ca02a35\",\n     \"email\":\"90joelmarquez@gmail.com\",\n     \"name\":\"Joel\",\n     \"_id\":\"558748767f0a76cc4ca02a34\",\n     \"__v\":0\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/user/index.js",
    "groupTitle": "Usuarios",
    "name": "GetApiUserId",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:id"
      }
    ]
  }
] });