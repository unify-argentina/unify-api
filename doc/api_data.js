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
    "url": "/api/auth/login",
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
    "filename": "api/auth/local.js",
    "groupTitle": "Autenticacion",
    "name": "PostApiAuthLogin",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/auth/login"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/auth/signup",
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
    "filename": "api/auth/local.js",
    "groupTitle": "Autenticacion",
    "name": "PostApiAuthSignup",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/auth/signup"
      }
    ]
  }
] });