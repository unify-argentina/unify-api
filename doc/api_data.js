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
          "content": "HTTP/1.1 200 OK\n{\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWJjM2MyN2JmYTU0MGVhMmM0MzJjZGMiLCJpYXQiOjE0MzgzOTk2NDUsImV4cCI6MTQ0MDk5MTY0NX0.lrrs4_S3qZ7roqmJeCr3nNAXxmPURlYhZlUA7IOcn2w\",\n    \"user\": {\n        \"__v\": 0,\n        \"_id\": \"55bc3c27bfa540ea2c432cdc\",\n        \"email\": \"90joelmarquez@gmail.com\",\n        \"main_circle\": {\n            \"user\": \"55bc3c27bfa540ea2c432cdc\",\n            \"name\": \"Main Circle\",\n            \"_id\": \"55bc3c29bfa540ea2c432cdd\",\n            \"__v\": 0,\n            \"ancestors\": [\n            ]\n        },\n        \"name\": \"Joel\",\n        \"google\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n        },\n        \"instagram\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n            \"userName\": \"joe__marquez\"\n        },\n        \"twitter\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n            \"userName\": \"joelmarquez90\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n        },\n        \"valid_local_user\": true\n    }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI4M2VkM2Y0NjAxZmMxMTFhYjcyMWY\",\n    \"user\": {\n        \"main_circle\": {\n            \"__v\": 0,\n            \"user\": \"55b83ed3f4601fc111ab721f\",\n            \"name\": \"Main Circle\",\n            \"_id\": \"55b83ed4f4601fc111ab7220\",\n            \"ancestors\": [\n            ]\n        },\n        \"__v\": 0,\n        \"email\": \"90joelmarquez2@gmail.com\",\n        \"name\": \"Joel\",\n        \"_id\": \"55b83ed3f4601fc111ab721f\",\n        \"valid_local_user\": true\n    }\n}",
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
    "type": "delete",
    "url": "/api/user/:user_id/circle/:circle_id",
    "title": "Eliminar un circulo",
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
            "description": "<p>Id del circulo a borrar (no puede ser el círculo principal)</p> "
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
            "field": "circle",
            "description": "<p>Id del circulo eliminado</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\":\"55936a0460bb409c379800b7\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/circle/index.js",
    "groupTitle": "Circulos",
    "name": "DeleteApiUserUser_idCircleCircle_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/circle/:circle_id"
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
          "content": "HTTP/1.1 200 OK\n\n{\n    \"circle\": {\n        \"contacts\": [\n            {\n                \"user\": \"55be9bb91f8bd56a4fab63f0\",\n                \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\",\n                \"name\": \"Joel\",\n                \"instagram_id\": \"993803680\",\n                \"twitter_id\": \"42704750\",\n                \"facebook_id\": \"10153267328674738\",\n                \"_id\": \"55bea6eaad16a7e3588b1ca7\",\n                \"__v\": 0,\n                \"parents\": [\n                    {\n                        \"circle\": \"55be9bbb1f8bd56a4fab63f1\",\n                        \"_id\": \"55bea6eaad16a7e3588b1ca8\",\n                        \"ancestors\": [\n                            \"55be9bbb1f8bd56a4fab63f1\"\n                        ]\n                    }\n                ]\n            },\n            {\n                \"user\": \"55be9bb91f8bd56a4fab63f0\",\n                \"picture\": \"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\",\n                \"name\": \"Alejo\",\n                \"instagram_id\": \"1574863419\",\n                \"twitter_id\": \"261365528\",\n                \"facebook_id\": \"10205153877979641\",\n                \"_id\": \"55beabbba6d239e95b50075b\",\n                \"__v\": 0,\n                \"parents\": [\n                    {\n                        \"circle\": \"55beaba5a6d239e95b50075a\",\n                        \"_id\": \"55beabbba6d239e95b50075c\",\n                        \"ancestors\": [\n                            \"55beaba5a6d239e95b50075a\",\n                            \"55be9bbb1f8bd56a4fab63f1\"\n                        ]\n                    }\n                ]\n            }\n        ],\n        \"media\": {\n            \"count\": 6,\n            \"list\": [\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10153491173094738\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438482468,\n                    \"link\": \"https://www.facebook.com/photo.php?fbid=10153491173094738&set=a.10152154863139738.1073741830.826764737&type=1\",\n                    \"media_url\": \"https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11817260_10153491173094738_5949918706607306589_n.jpg?oh=4f851773c7660e1ddbe34cb477627ae8&oe=5656DEED&__gda__=1448770591_84ba495cc3a3554a2bc842d1653f1ca8\",\n                    \"text\": \"Pami, pati, pael, paella\",\n                    \"contact\": {\n                        \"id\": \"55bea6eaad16a7e3588b1ca7\",\n                        \"name\": \"Joel\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"627667076744904704\",\n                    \"type\": \"text\",\n                    \"created_time\": 1438482467,\n                    \"link\": \"https://twitter.com/statuses/627667076744904704\",\n                    \"likes\": 0,\n                    \"text\": \"Pami, pati, pael, paella @ Charly's House https://t.co/181HbfsaEv\",\n                    \"user_has_liked\": false,\n                    \"contact\": {\n                        \"id\": \"55bea6eaad16a7e3588b1ca7\",\n                        \"name\": \"Joel\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1042388941278905607_993803680\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438482466,\n                    \"link\": \"https://instagram.com/p/53TzgiuYUHAinWlkLpGfEoP160Kccs90O22Es0/\",\n                    \"likes\": 5,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11376143_1476803242620418_1662626864_n.jpg\",\n                    \"text\": \"Pami, pati, pael, paella\",\n                    \"user_has_liked\": \"\",\n                    \"contact\": {\n                        \"id\": \"55bea6eaad16a7e3588b1ca7\",\n                        \"name\": \"Joel\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"625702932302970882\",\n                    \"type\": \"text\",\n                    \"created_time\": 1438014178,\n                    \"link\": \"https://twitter.com/statuses/625702932302970882\",\n                    \"likes\": 0,\n                    \"text\": \"El spot de Altamira en el que Scioli, Macri y Massa emulan los 3 Chiflados es lo más grande que hay..\",\n                    \"user_has_liked\": false,\n                    \"contact\": {\n                        \"id\": \"55beabbba6d239e95b50075b\",\n                        \"name\": \"Alejo\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1032419311030202502_1574863419\",\n                    \"type\": \"image\",\n                    \"created_time\": 1437293994,\n                    \"link\": \"https://instagram.com/p/5T4-S1NXCG/\",\n                    \"likes\": 8,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xtp1/t51.2885-15/s640x640/sh0.08/e35/10499264_1058431774190878_494207365_n.jpg\",\n                    \"text\": \"Gracias Carlitos por volver.. #Boca #BocaJuniors #Tevez\",\n                    \"user_has_liked\": \"\",\n                    \"contact\": {\n                        \"id\": \"55beabbba6d239e95b50075b\",\n                        \"name\": \"Alejo\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10205141615393084\",\n                    \"type\": \"image\",\n                    \"created_time\": 1431099507,\n                    \"link\": \"https://www.facebook.com/photo.php?fbid=10205141615393084&set=a.10203978678240382.1073741825.1025603691&type=1\",\n                    \"media_url\": \"https://scontent.xx.fbcdn.net/hphotos-xtf1/v/t1.0-9/11111209_10205141615393084_5968826018430732303_n.jpg?oh=97d88517956b5472d2552129273e2b86&oe=564920FF\",\n                    \"text\": \"Cómo se pone la clínica los jueves a la noche!! #ChauChauApéndice #ÓrganoInútil\",\n                    \"contact\": {\n                        \"id\": \"55beabbba6d239e95b50075b\",\n                        \"name\": \"Alejo\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\"\n                    }\n                }\n            ]\n        },\n        \"name\": \"Main Circle\",\n        \"_id\": \"55be9bbb1f8bd56a4fab63f1\",\n        \"__v\": 0,\n        \"ancestors\": [\n        ]\n    }\n}",
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
    "type": "post",
    "url": "/api/user/:user_id/circle",
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
            "field": "user_id",
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
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\":{\n    \"parent\":\"55936a0460bb409c379800b7\",\n    \"name\":\"Amigos\",\n    \"_id\":\"559ebc91dc9167e815a750b7\",\n    \"__v\":0,\n    \"ancestors\":[\n      \"559eba8109b6aee614e3f733\",\n      \"559ebc0ddc9167e815a750b5\",\n      \"55936a0460bb409c379800b7\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/circle/index.js",
    "groupTitle": "Circulos",
    "name": "PostApiUserUser_idCircle",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/circle"
      }
    ]
  },
  {
    "type": "put",
    "url": "/api/user/:user_id/circle/:circle_id",
    "title": "Actualizar un circulo",
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
            "description": "<p>Id del circulo a actualizar</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Nuevo nombre del circulo a actualizar</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "parent_id",
            "description": "<p>Nuevo id padre del circulo a actualizar</p> "
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
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\":{\n    \"parent\":\"55936a0460bb409c379800b7\",\n    \"name\":\"Amigos\",\n    \"_id\":\"559ebc91dc9167e815a750b7\",\n    \"__v\":0,\n    \"ancestors\":[\n      \"559eba8109b6aee614e3f733\",\n      \"559ebc0ddc9167e815a750b5\",\n      \"55936a0460bb409c379800b7\"\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/circle/index.js",
    "groupTitle": "Circulos",
    "name": "PutApiUserUser_idCircleCircle_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/circle/:circle_id"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/api/user/:user_id/contact/:contact_id",
    "title": "Eliminar un contacto",
    "group": "Contactos",
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
            "field": "contact_id",
            "description": "<p>Id del contacto a borrar</p> "
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
            "field": "circle",
            "description": "<p>Id del contacto eliminado</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"contact\":\"55936a0460bb409c379800b7\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/contact/index.js",
    "groupTitle": "Contactos",
    "name": "DeleteApiUserUser_idContactContact_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/contact/:contact_id"
      }
    ]
  },
  {
    "type": "get",
    "url": "/api/user/:user_id/contact/:contact_id",
    "title": "Obtener contacto",
    "group": "Contactos",
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
            "field": "contact_id",
            "description": "<p>Id del contacto</p> "
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
            "field": "contact",
            "description": "<p>Contacto</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n\n{\n    \"contact\": {\n        \"user\": \"55b3a9f7a748942e223f7399\",\n        \"circle\": \"55b3a9f8a748942e223f739a\",\n        \"picture\": \"graph.facebook.com/v2.3/10153267328674738/picture?type=large\",\n        \"name\": \"Joel\",\n        \"instagram_id\": \"993803680\",\n        \"twitter_id\": \"42704750\",\n        \"facebook_id\": \"10153267328674738\",\n        \"_id\": \"55b3ac25a748942e223f739b\",\n        \"__v\": 0,\n        \"media\": {\n            \"count\": 6,\n            \"list\": [\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"104231789737\",\n                    \"type\": \"video\",\n                    \"created_time\": 1248316817,\n                    \"link\": \"\",\n                    \"media_url\": \"https://video.xx.fbcdn.net/hvideo-xpa1/v/t42.1790-2/1128968_10151770969524738_48281_n.mp4?oh=7bac0be2bc4d52e84f95708b606b78a8&oe=55B92464\",\n                    \"text\": \"\"\n                },\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10152546867159738\",\n                    \"type\": \"image\",\n                    \"created_time\": 1405276732,\n                    \"text\": \"Lio hace lio en Rio te lo pido!!! VAMOS ARGENTINA CARAJO!!!\"\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"942358663471400364_993803680\",\n                    \"type\": \"image\",\n                    \"created_time\": 1426557928,\n                    \"link\": \"https://instagram.com/p/0T7jYrOYWs/\",\n                    \"likes\": 9,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/e15/10894975_1551551221769247_142889237_n.jpg\",\n                    \"text\": \"A brindar se ha dicho! @florejoffre\",\n                    \"user_has_liked\": \"\"\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"584556327738847233\",\n                    \"type\": \"text\",\n                    \"created_time\": 1428204063,\n                    \"link\": \"https://twitter.com/statuses/584556327738847233\",\n                    \"likes\": 0,\n                    \"text\": \"Brindo porque recién vamos 3 años y nos queda toda una vida por delante juntos. Te amo con todo mi… https://t.co/LBC7sRYkhD\",\n                    \"user_has_liked\": false\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"591574551441571840\",\n                    \"type\": \"video\",\n                    \"created_time\": 1429877338,\n                    \"link\": \"https://twitter.com/statuses/591574551441571840\",\n                    \"likes\": 0,\n                    \"text\": \"@jotaleonetti puente de victor hugo para cruzar la gral paz cerrado todo un quilombo evitar esa zona http://t.co/lM23tKSMeP\",\n                    \"user_has_liked\": false\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1004621806268155504_993803680\",\n                    \"type\": \"video\",\n                    \"created_time\": 1433980273,\n                    \"link\": \"https://instagram.com/p/3xIjXIOYZw/\",\n                    \"likes\": 8,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11424155_495429683938569_221343300_n.mp4\",\n                    \"text\": \"Franchu rockstar dedicando canciones\",\n                    \"user_has_liked\": \"\"\n                }\n            ]\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/contact/index.js",
    "groupTitle": "Contactos",
    "name": "GetApiUserUser_idContactContact_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/contact/:contact_id"
      }
    ]
  },
  {
    "type": "post",
    "url": "/api/user/:user_id/contact",
    "title": "Crear un contacto",
    "group": "Contactos",
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
            "field": "name",
            "description": "<p>Nombre del contacto a crear</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "picture",
            "description": "<p>URL de la imagen del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "circle_id",
            "description": "<p>Id del círculo en el cual el contacto va a ser creado</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "facebook_id",
            "description": "<p>Id del perfil de facebook del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "twitter_id",
            "description": "<p>Id del perfil de twitter del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "instagram_id",
            "description": "<p>Id del perfil de instagram del contacto</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"name\":\"Alejo\",\n  \"picture\":\"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\",\n  \"facebook_id\":\"10205153877979641\",\n  \"twitter_id\":\"261365528\",\n  \"instagram_id\":\"1574863419\",\n  \"circle_id\":\"55a1f0d9d3dc50a522cd0aff\"\n}",
          "type": "json"
        }
      ]
    },
    "description": "<p>Aclaración: si bien los ids de las redes sociales son opcionales, al menos uno es requerido para poder crear un contacto y obtener contenido de esa red social asignada.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "contact",
            "description": "<p>Contacto creado</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"contact\":{\n    \"user\":\"55a1f39737bc05b2257c6ae0\",\n    \"circle\":\"55a1f39937bc05b2257c6ae1\",\n    \"twitter_id\":\"261365528\",\n    \"facebook_id\":\"10205153877979641\",\n    \"picture\":\"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\",\n    \"name\":\"Alejo\",\n    \"_id\":\"55a1f47e71912f3c26602dbe\",\n    \"__v\":0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/contact/index.js",
    "groupTitle": "Contactos",
    "name": "PostApiUserUser_idContact",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/contact"
      }
    ]
  },
  {
    "type": "put",
    "url": "/api/user/:user_id/contact/:contact_id",
    "title": "Actualizar un contacto",
    "group": "Contactos",
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
            "field": "contact_id",
            "description": "<p>Id del contacto a actualizar</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Nuevo nombre del contacto a actualizar</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "picture",
            "description": "<p>URL de la imagen del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "circle_id",
            "description": "<p>Id del círculo en el cual el contacto va a ser actualizado</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "facebook_id",
            "description": "<p>Id del perfil de facebook del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "twitter_id",
            "description": "<p>Id del perfil de twitter del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "instagram_id",
            "description": "<p>Id del perfil de instagram del contacto</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"name\":\"Alejo\",\n  \"picture\":\"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\",\n  \"facebook_id\":\"10205153877979641\",\n  \"twitter_id\":\"261365528\",\n  \"instagram_id\":\"1574863419\",\n  \"circle_id\":\"55a1f0d9d3dc50a522cd0aff\"\n}",
          "type": "json"
        }
      ]
    },
    "description": "<p>Aclaración: si bien los ids de las redes sociales son opcionales, al menos uno es requerido para poder actualizar un contacto y obtener contenido de esa red social asignada.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "contact",
            "description": "<p>Contacto actualizado</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": " HTTP/1.1 200 OK\n\n{\n  \"contact\":{\n    \"user\":\"55a1f39737bc05b2257c6ae0\",\n    \"circle\":\"55a1f39937bc05b2257c6ae1\",\n    \"twitter_id\":\"261365528\",\n    \"facebook_id\":\"10205153877979641\",\n    \"picture\":\"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\",\n    \"name\":\"Alejo\",\n    \"_id\":\"55a1f47e71912f3c26602dbe\",\n    \"__v\":0\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/contact/index.js",
    "groupTitle": "Contactos",
    "name": "PutApiUserUser_idContactContact_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/contact/:contact_id"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/auth/facebook",
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
    "name": "DeleteAuthFacebook",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/facebook"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/auth/google",
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
    "name": "DeleteAuthGoogle",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/google"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/auth/instagram",
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
    "name": "DeleteAuthInstagram",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/instagram"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/auth/twitter",
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
    "name": "DeleteAuthTwitter",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/auth/twitter"
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
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"userName\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"userName\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"userName\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"userName\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"userName\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"userName\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"userName\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"userName\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": " HTTP/1.1 200 OK\n\n{\n    \"user\": {\n        \"__v\": 0,\n        \"_id\": \"55b6fba973191a7428d80c94\",\n        \"email\": \"90joelmarquez@gmail.com\",\n        \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n        \"name\": \"Joel Marquez\",\n        \"google\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n        },\n        \"instagram\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n            \"userName\": \"joe__marquez\"\n        },\n        \"twitter\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n            \"userName\": \"joelmarquez90\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n        },\n        \"valid_local_user\": true,\n        \"media\": {\n            \"count\": 3,\n            \"list\": [\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10153477879074738\",\n                    \"type\": \"image\",\n                    \"created_time\": 1437948477,\n                    \"link\": \"https://www.facebook.com/photo.php?fbid=10153477879074738&set=a.10152154863139738.1073741830.826764737&type=1\",\n                    \"media_url\": \"https://fbcdn-sphotos-h-a.akamaihd.net/hphotos-ak-xfp1/v/t1.0-9/20225_10153477879074738_4360696422298472690_n.jpg?oh=7d332338c4db1136c359cbe0e7ed3264&oe=565513FA&__gda__=1448067937_d3d74b86dbe101b54961e0549652c028\",\n                    \"text\": \"Cumple de franchu 3 años, y si, se vuelve a la infancia\"\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1037909504130909999_993803680\",\n                    \"type\": \"image\",\n                    \"created_time\": 1437948476,\n                    \"link\": \"https://instagram.com/p/5nZTHmuYcv/\",\n                    \"likes\": 13,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/e15/10809951_484188628422854_977065670_n.jpg\",\n                    \"text\": \"Cumple de franchu 3 años, y si, se vuelve a la infancia\",\n                    \"user_has_liked\": \"\"\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"625427358284148736\",\n                    \"type\": \"text\",\n                    \"created_time\": 1437948476,\n                    \"link\": \"https://twitter.com/statuses/625427358284148736\",\n                    \"likes\": 0,\n                    \"text\": \"Cumple de franchu 3 años, y si, se vuelve a la infancia https://t.co/ZT86vvlho0\",\n                    \"user_has_liked\": false\n                }\n            ]\n        }\n    }\n}",
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
    "type": "put",
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
          "content": "HTTP/1.1 200 OK\n\n{\n   \"user\": {\n     \"main_circle\":\"558748787f0a76cc4ca02a35\",\n     \"email\":\"unify.argentina@gmail.com\",\n     \"name\":\"Juan Losa\",\n     \"_id\":\"558748767f0a76cc4ca02a34\",\n     \"__v\":0\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/user/index.js",
    "groupTitle": "Usuarios",
    "name": "PutApiUserUser_id",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id"
      }
    ]
  }
] });