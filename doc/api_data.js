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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
          "type": "json"
        }
      ]
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
    "url": "/api/user/:user_id/circle/:circle_id",
    "title": "Obtener circulo",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user_id",
            "description": "<p>Id del usuario</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "circle_id",
            "description": "<p>Id del circulo</p> "
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
            "field": "circle",
            "description": "<p>Circulo</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\":{\n    \"parent\":\"559ebc76dc9167e815a750b6\",\n    \"name\":\"Tios\",\n    \"_id\":\"559ebc91dc9167e815a750b7\",\n    \"__v\":0,\n    \"ancestors\":[\n      \"559eba8109b6aee614e3f733\",\n      \"559ebc0ddc9167e815a750b5\",\n      \"559ebc76dc9167e815a750b6\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/circle/index.js",
    "groupTitle": "Circulos",
    "name": "GetApiUserUser_idCircleCircle_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/circle/:circle_id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/auth/twitter/callback",
    "title": "Twitter login callback",
    "group": "Social",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "oauth_token",
            "description": "<p>Oauth token para obtener el request token</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "oauth_verifier",
            "description": "<p>Oauth verificador para obtener el request token</p> "
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
    "filename": "api/auth/twitter/index.js",
    "groupTitle": "Social",
    "name": "GetAuthTwitterCallback",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/twitter/callback"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/facebook",
    "title": "Facebook login",
    "group": "Social",
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
    "groupTitle": "Social",
    "name": "PostAuthFacebook",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/facebook"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/facebook/unlink",
    "title": "Facebook unlink",
    "group": "Social",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
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
    "filename": "api/auth/facebook/index.js",
    "groupTitle": "Social",
    "name": "PostAuthFacebookUnlink",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/facebook/unlink"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/google",
    "title": "Google login",
    "group": "Social",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>Código de autorización de Google</p> "
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
    "filename": "api/auth/google/index.js",
    "groupTitle": "Social",
    "name": "PostAuthGoogle",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/google"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/google/unlink",
    "title": "Google unlink",
    "group": "Social",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
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
    "filename": "api/auth/google/index.js",
    "groupTitle": "Social",
    "name": "PostAuthGoogleUnlink",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/google/unlink"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/instagram",
    "title": "Instagram login",
    "group": "Social",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "code",
            "description": "<p>Código de autorización de Instagram</p> "
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
    "filename": "api/auth/instagram/index.js",
    "groupTitle": "Social",
    "name": "PostAuthInstagram",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/instagram"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/instagram/unlink",
    "title": "Instagram unlink",
    "group": "Social",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
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
    "filename": "api/auth/instagram/index.js",
    "groupTitle": "Social",
    "name": "PostAuthInstagramUnlink",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/instagram/unlink"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/twitter",
    "title": "Twitter login",
    "group": "Social",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "oauth_token",
            "description": "<p>Oauth token para obtener el request token</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "oauth_verifier",
            "description": "<p>Oauth verificador para obtener el request token</p> "
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
    "filename": "api/auth/twitter/index.js",
    "groupTitle": "Social",
    "name": "PostAuthTwitter",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/twitter"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/twitter/unlink",
    "title": "Twitter unlink",
    "group": "Social",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
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
    "filename": "api/auth/twitter/index.js",
    "groupTitle": "Social",
    "name": "PostAuthTwitterUnlink",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/twitter/unlink"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/user/:user_id",
    "title": "Obtener usuario",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user_id",
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
          "content": "HTTP/1.1 200 OK\n\n{\n   \"user\": {\n     \"mainCircle\":\"558748787f0a76cc4ca02a35\",\n     \"email\":\"unify.argentina@gmail.com\",\n     \"name\":\"Juan Losa\",\n     \"_id\":\"558748767f0a76cc4ca02a34\",\n     \"__v\":0\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/user/index.js",
    "groupTitle": "Usuarios",
    "name": "GetApiUserUser_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/user/:user_id/friends",
    "title": "Obtener los amigos del usuario",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user_id",
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
            "field": "friends",
            "description": "<p>Listado de amigos de las redes sociales</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"friends\":{\n    \"facebook\":{\n      \"count\":1,\n      \"list\":[\n        {\n          \"id\":\"104412116557897\",\n          \"name\":\"Juan Losa\",\n          \"picture\":\"https://graph.facebook.com/v2.3/104412116557897/picture?type=large\"\n        }\n      ]\n    },\n    \"instagram\":{\n      \"count\":2,\n      \"list\":[\n        {\n          \"id\":\"1442169810\",\n          \"name\":\"marcelo tinelli\",\n          \"picture\":\"https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11312440_693266217444492_2069397433_a.jpg\",\n          \"username\":\"cuervotinelli1\"\n        },\n        {\n          \"id\":\"1786223786\",\n          \"name\":\"Cucina Paradiso\",\n          \"picture\":\"https://igcdn-photos-a-a.akamaihd.net/hphotos-ak-xfp1/t51.2885-19/11055552_724116127706536_885942678_a.jpg\",\n          \"username\":\"cucinaparadisoba\"\n        }\n      ]\n    },\n    \"twitter\":{\n      \"count\":3,\n      \"list\":[\n        {\n          \"id\":\"2399412002\",\n          \"name\":\"StackCareersUK\",\n          \"picture\":\"http://pbs.twimg.com/profile_images/565838781853351937/P4RG_KjM_normal.png\",\n          \"username\":\"StackCareersUK\"\n        },\n        {\n          \"id\":\"1887042901\",\n          \"name\":\"Preguntados\",\n          \"picture\":\"http://pbs.twimg.com/profile_images/459753435336695808/y8G4IVrX_normal.png\",\n          \"username\":\"Preguntados_app\"\n        },\n        {\n          \"id\":\"211089576\",\n          \"name\":\"Wunderlist\",\n          \"picture\":\"http://pbs.twimg.com/profile_images/494884573428207616/BjPVVsRm_normal.png\",\n          \"username\":\"Wunderlist\"\n        }\n      ]\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/user/index.js",
    "groupTitle": "Usuarios",
    "name": "GetApiUserUser_idFriends",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/friends"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/user/:user_id",
    "title": "Actualizar usuario",
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
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Authorization\": \"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOizMTIsImV4cCI6MTQzNzM2NTMxMn0\"\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "user_id",
            "description": "<p>Id del usuario</p> "
          },
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
          "content": "HTTP/1.1 200 OK\n\n{\n   \"user\": {\n     \"mainCircle\":\"558748787f0a76cc4ca02a35\",\n     \"email\":\"unify.argentina@gmail.com\",\n     \"name\":\"Juan Losa\",\n     \"_id\":\"558748767f0a76cc4ca02a34\",\n     \"__v\":0\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/user/index.js",
    "groupTitle": "Usuarios",
    "name": "PostApiUserUser_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id"
      }
    ]
  }
] });