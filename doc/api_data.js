define({ "api": [
  {
    "type": "get",
    "url": "/api",
    "title": "Version",
    "name": "Version",
    "group": "API",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "version",
            "description": "<p>Current API version</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "api/index.js",
    "groupTitle": "API",
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
    "name": "Login",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password</p> "
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
            "description": "<p>Valid access token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTg0ZTc0MGRkOTlkNDllMzQ0MGRkM2IiLCJpYXQiOjE0MzQ3NzMzMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/auth/local.js",
    "groupTitle": "Authentication",
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
    "name": "Signup",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>User email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>User name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>User password, must be at least 6 characters of length</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "confirm_password",
            "description": "<p>Same as password, they must be identical</p> "
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
            "description": "<p>Valid access token</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NTg0ZTc0MGRkOTlkNDllMzQ0MGRkM2IiLCJpYXQiOjE0MzQ3NzMzMTIsImV4cCI6MTQzNzM2NTMxMn0.akRndKmfCPSRumw8ybquxCjba7MsgfBdK_ZuHINGNNs\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/auth/local.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/auth/signup"
      }
    ]
  }
] });