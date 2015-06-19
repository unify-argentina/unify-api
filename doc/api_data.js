define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
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
      }
    },
    "version": "0.0.0",
    "filename": "auth/local.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "http://api.unifyme.io/api/auth/login"
      }
    ]
  },
  {
    "type": "post",
    "url": "/auth/signup",
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
      }
    },
    "version": "0.0.0",
    "filename": "auth/local.js",
    "groupTitle": "Authentication",
    "sampleRequest": [
      {
        "url": "http://api.unifyme.io/api/auth/signup"
      }
    ]
  }
] });