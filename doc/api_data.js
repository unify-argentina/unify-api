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
          "content": "HTTP/1.1 200 OK\n{\n    \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWJjM2MyN2JmYTU0MGVhMmM0MzJjZGMiLCJpYXQiOjE0MzgzOTk2NDUsImV4cCI6MTQ0MDk5MTY0NX0.lrrs4_S3qZ7roqmJeCr3nNAXxmPURlYhZlUA7IOcn2w\",\n    \"user\": {\n        \"__v\": 0,\n        \"_id\": \"55bc3c27bfa540ea2c432cdc\",\n        \"email\": \"90joelmarquez@gmail.com\",\n        \"main_circle\": {\n            \"user\": \"55bc3c27bfa540ea2c432cdc\",\n            \"name\": \"Main Circle\",\n            \"_id\": \"55bc3c29bfa540ea2c432cdd\",\n            \"__v\": 0,\n            \"ancestors\": [\n            ]\n        },\n        \"name\": \"Joel\",\n        \"google\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n        },\n        \"instagram\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n            \"username\": \"joe__marquez\"\n        },\n        \"twitter\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n            \"username\": \"joelmarquez90\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n        },\n        \"valid_local_user\": true\n    }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n    \"circle\": {\n        \"contacts\": [\n            {\n                \"user\": \"55c02cc70cce13ec28bd7ec1\",\n                \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\",\n                \"name\": \"Joel\",\n                \"_id\": \"55c0315cccab88ba31786d71\",\n                \"__v\": 0,\n                \"parents\": [\n                    {\n                        \"circle\": \"55c02cc80cce13ec28bd7ec2\",\n                        \"_id\": \"55c0315cccab88ba31786d72\",\n                        \"ancestors\": [\n                            \"55c02cc80cce13ec28bd7ec2\"\n                        ]\n                    }\n                ],\n                \"instagram\": {\n                    \"username\": \"joe__marquez\",\n                    \"id\": \"993803680\"\n                },\n                \"twitter\": {\n                    \"username\": \"joelmarquez90\",\n                    \"id\": \"42704750\"\n                },\n                \"facebook\": {\n                    \"display_name\": \"Joel Márquez\",\n                    \"id\": \"10153267328674738\"\n                }\n            },\n            {\n                \"user\": \"55c02cc70cce13ec28bd7ec1\",\n                \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg\",\n                \"name\": \"Alejo\",\n                \"_id\": \"55c0316dccab88ba31786d73\",\n                \"__v\": 0,\n                \"parents\": [\n                    {\n                        \"circle\": \"55c02cc80cce13ec28bd7ec2\",\n                        \"_id\": \"55c0316dccab88ba31786d74\",\n                        \"ancestors\": [\n                            \"55c02cc80cce13ec28bd7ec2\"\n                        ]\n                    }\n                ],\n                \"instagram\": {\n                    \"username\": \"aleagb23\",\n                    \"id\": \"1574863419\"\n                },\n                \"twitter\": {\n                    \"username\": \"aleagb23\",\n                    \"id\": \"261365528\"\n                },\n                \"facebook\": {\n                    \"display_name\": \"Alejo García\",\n                    \"id\": \"10205153877979641\"\n                }\n            }\n        ],\n        \"media\": {\n            \"count\": 4,\n            \"list\": [\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"628281888210321408\",\n                    \"type\": \"video\",\n                    \"created_time\": 1438629049,\n                    \"link\": \"https://twitter.com/statuses/628281888210321408\",\n                    \"likes\": 0,\n                    \"text\": \"http://t.co/IkL1oTkgq1\",\n                    \"user_has_liked\": false,\n                    \"contact\": {\n                        \"id\": \"55c0316dccab88ba31786d73\",\n                        \"name\": \"Alejo\",\n                        \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg\"\n                    }\n                },\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10153491173094738\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438482468,\n                    \"link\": \"https://www.facebook.com/photo.php?fbid=10153491173094738&set=a.10152154863139738.1073741830.826764737&type=1\",\n                    \"media_url\": \"https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11817260_10153491173094738_5949918706607306589_n.jpg?oh=4f851773c7660e1ddbe34cb477627ae8&oe=5656DEED&__gda__=1448770591_84ba495cc3a3554a2bc842d1653f1ca8\",\n                    \"text\": \"Pami, pati, pael, paella\",\n                    \"contact\": {\n                        \"id\": \"55c0315cccab88ba31786d71\",\n                        \"name\": \"Joel\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"627667076744904704\",\n                    \"type\": \"text\",\n                    \"created_time\": 1438482467,\n                    \"link\": \"https://twitter.com/statuses/627667076744904704\",\n                    \"likes\": 0,\n                    \"text\": \"Pami, pati, pael, paella @ Charly's House https://t.co/181HbfsaEv\",\n                    \"user_has_liked\": false,\n                    \"contact\": {\n                        \"id\": \"55c0315cccab88ba31786d71\",\n                        \"name\": \"Joel\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n                    }\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1042388941278905607_993803680\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438482466,\n                    \"link\": \"https://instagram.com/p/53TzgiuYUHAinWlkLpGfEoP160Kccs90O22Es0/\",\n                    \"likes\": 5,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11376143_1476803242620418_1662626864_n.jpg\",\n                    \"text\": \"Pami, pati, pael, paella\",\n                    \"user_has_liked\": \"\",\n                    \"contact\": {\n                        \"id\": \"55c0315cccab88ba31786d71\",\n                        \"name\": \"Joel\",\n                        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n                    }\n                }\n            ]\n        },\n        \"name\": \"Main Circle\",\n        \"_id\": \"55c02cc80cce13ec28bd7ec2\",\n        \"__v\": 0,\n        \"ancestors\": [\n        ]\n    }\n}",
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
    "url": "/api/user/:user_id/circle/:circle_id/tree",
    "title": "Obtener subcirculos",
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
            "field": "tree",
            "description": "<p>Subcirculos</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Respuesta valida",
          "content": "HTTP/1.1 200 OK\n{\n    \"tree\": [\n        {\n            \"_id\": \"55c421364037f03842898379\",\n            \"name\": \"Main Circle\",\n            \"subcircles\": [\n                {\n                    \"_id\": \"55c427f69ad9fb6848a1fa72\",\n                    \"name\": \"Familia\",\n                    \"picture\": \"http://www.granada.escolapiosemaus.org/blogs/primariaingles/wp-content/uploads/sites/9/2014/10/family-home.png\",\n                    \"parent\": \"55c421364037f03842898379\",\n                    \"subcircles\": [\n                        {\n                            \"_id\": \"55c4284c9ad9fb6848a1fa73\",\n                            \"name\": \"Materna\",\n                            \"picture\": \"http://www.healthyplace.com/blogs/relationshipsandmentalillness/files/2015/05/3d-happy-family-1.jpg\",\n                            \"parent\": \"55c427f69ad9fb6848a1fa72\",\n                            \"subcircles\": [\n                            ]\n                        },\n                        {\n                            \"_id\": \"55c4285b9ad9fb6848a1fa74\",\n                            \"name\": \"Paterna\",\n                            \"picture\": \"http://www.mindfuljourneycenter.com/wp-content/uploads/2014/07/couples-family-therapy.jpg\",\n                            \"parent\": \"55c427f69ad9fb6848a1fa72\",\n                            \"subcircles\": [\n                            ]\n                        }\n                    ]\n                },\n                {\n                    \"_id\": \"55c428849ad9fb6848a1fa75\",\n                    \"name\": \"Amigos\",\n                    \"picture\": \"http://blackfriendconnect.com/wp-content/uploads/2013/07/rent-a-black-friend-picture-new1.jpg\",\n                    \"parent\": \"55c421364037f03842898379\",\n                    \"subcircles\": [\n                        {\n                            \"_id\": \"55c428989ad9fb6848a1fa76\",\n                            \"name\": \"Facu\",\n                            \"picture\": \"http://www.unialliance.ac.uk/wp-content/uploads/2012/12/Caerleon-Lawn-21.jpg\",\n                            \"parent\": \"55c428849ad9fb6848a1fa75\",\n                            \"subcircles\": [\n                                {\n                                    \"_id\": \"55c580811b6268f35b007af8\",\n                                    \"name\": \"Primer Año\",\n                                    \"parent\": \"55c428989ad9fb6848a1fa76\",\n                                    \"subcircles\": [\n                                        {\n                                            \"_id\": \"55c5819455fdcea25c9f5607\",\n                                            \"name\": \"Primer cuatrimestre\",\n                                            \"parent\": \"55c580811b6268f35b007af8\",\n                                            \"subcircles\": [\n                                            ]\n                                        }\n                                    ]\n                                }\n                            ]\n                        },\n                        {\n                            \"_id\": \"55c428a69ad9fb6848a1fa77\",\n                            \"name\": \"Cole\",\n                            \"picture\": \"http://images.idiva.com/media/content/2011/Dec/hot_to_make_friends_at_college.jpg\",\n                            \"parent\": \"55c428849ad9fb6848a1fa75\",\n                            \"subcircles\": [\n                            ]\n                        }\n                    ]\n                }\n            ]\n        }\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/circle/index.js",
    "groupTitle": "Circulos",
    "name": "GetApiUserUser_idCircleCircle_idTree",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/circle/:circle_id/tree"
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
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "picture",
            "description": "<p>URL de la imagen del circulo</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"name\":\"Amigos\",\n  \"parent_id\":\"55936a0460bb409c379800b7\",\n  \"picture\":\"http://www.sabiask.com/images/Image/perro.jpg\"\n}",
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
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\":{\n    \"parent\":\"55936a0460bb409c379800b7\",\n    \"name\":\"Amigos\",\n    \"picture\":\"http://www.sabiask.com/images/Image/perro.jpg\",\n    \"_id\":\"559ebc91dc9167e815a750b7\",\n    \"__v\":0,\n    \"ancestors\":[\n      \"559eba8109b6aee614e3f733\",\n      \"559ebc0ddc9167e815a750b5\",\n      \"55936a0460bb409c379800b7\"\n    ]\n  }\n}",
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
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "picture",
            "description": "<p>URL de la imagen del circulo</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"name\":\"Amigos\",\n  \"parent_id\":\"55936a0460bb409c379800b7\",\n  \"picture\":\"http://www.sabiask.com/images/Image/perro.jpg\"\n}",
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
          "content": " HTTP/1.1 200 OK\n\n{\n  \"circle\":{\n    \"parent\":\"55936a0460bb409c379800b7\",\n    \"name\":\"Amigos\",\n    \"picture\":\"http://www.sabiask.com/images/Image/perro.jpg\",\n    \"_id\":\"559ebc91dc9167e815a750b7\",\n    \"__v\":0,\n    \"ancestors\":[\n      \"559eba8109b6aee614e3f733\",\n      \"559ebc0ddc9167e815a750b5\",\n      \"55936a0460bb409c379800b7\"\n    ]\n  }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n    \"contact\": {\n        \"user\": \"55c02cc70cce13ec28bd7ec1\",\n        \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\",\n        \"name\": \"Joel\",\n        \"_id\": \"55c0315cccab88ba31786d71\",\n        \"__v\": 0,\n        \"parents\": [\n            {\n                \"circle\": \"55c02cc80cce13ec28bd7ec2\",\n                \"_id\": \"55c0315cccab88ba31786d72\",\n                \"ancestors\": [\n                    \"55c02cc80cce13ec28bd7ec2\"\n                ]\n            }\n        ],\n        \"instagram\": {\n            \"username\": \"joe__marquez\",\n            \"id\": \"993803680\"\n        },\n        \"twitter\": {\n            \"username\": \"joelmarquez90\",\n            \"id\": \"42704750\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"id\": \"10153267328674738\"\n        },\n        \"media\": {\n            \"count\": 138,\n            \"list\": [\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10153491173094738\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438482468,\n                    \"link\": \"https://www.facebook.com/photo.php?fbid=10153491173094738&set=a.10152154863139738.1073741830.826764737&type=1\",\n                    \"media_url\": \"https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xft1/v/t1.0-9/11817260_10153491173094738_5949918706607306589_n.jpg?oh=4f851773c7660e1ddbe34cb477627ae8&oe=5656DEED&__gda__=1448770591_84ba495cc3a3554a2bc842d1653f1ca8\",\n                    \"text\": \"Pami, pati, pael, paella\"\n                },\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"627667076744904704\",\n                    \"type\": \"text\",\n                    \"created_time\": 1438482467,\n                    \"link\": \"https://twitter.com/statuses/627667076744904704\",\n                    \"likes\": 0,\n                    \"text\": \"Pami, pati, pael, paella @ Charly's House https://t.co/181HbfsaEv\",\n                    \"user_has_liked\": false\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1042388941278905607_993803680\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438482466,\n                    \"link\": \"https://instagram.com/p/53TzgiuYUHAinWlkLpGfEoP160Kccs90O22Es0/\",\n                    \"likes\": 5,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-15/e15/11376143_1476803242620418_1662626864_n.jpg\",\n                    \"text\": \"Pami, pati, pael, paella\",\n                    \"user_has_liked\": \"\"\n                }\n            ]\n        }\n    }\n}",
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
            "field": "facebook_display_name",
            "description": "<p>Nombre del perfil de facebook del contacto</p> "
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
            "field": "twitter_username",
            "description": "<p>Username del perfil de twitter del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "instagram_id",
            "description": "<p>Id del perfil de instagram del contacto</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "instagram_username",
            "description": "<p>Username del perfil de instagram del contacto</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Ejemplo de request",
          "content": "{\n  \"name\":\"Alejo\",\n  \"picture\":\"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg\",\n  \"facebook_id\": \"10205153877979641\",\n  \"facebook_display_name\": \"Alejo García\",\n  \"instagram_id\":\"1574863419\",\n  \"instagram_username\": \"aleagb23\",\n  \"twitter_id\": \"261365528\",\n  \"twitter_username\": \"aleagb23\",\n  \"circle_id\":\"55c02cc80cce13ec28bd7ec2\"\n}",
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
          "content": "HTTP/1.1 200 OK\n\n{\n    \"contact\": {\n        \"__v\": 0,\n        \"user\": \"55c02cc70cce13ec28bd7ec1\",\n        \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpa1/t51.2885-19/10832234_314287438773030_212898401_a.jpg\",\n        \"name\": \"Alejo\",\n        \"_id\": \"55c0316dccab88ba31786d73\",\n        \"parents\": [\n            {\n                \"circle\": \"55c02cc80cce13ec28bd7ec2\",\n                \"_id\": \"55c0316dccab88ba31786d74\",\n                \"ancestors\": [\n                    \"55c02cc80cce13ec28bd7ec2\"\n                ]\n            }\n        ],\n        \"instagram\": {\n            \"username\": \"aleagb23\",\n            \"id\": \"1574863419\"\n        },\n        \"twitter\": {\n            \"username\": \"aleagb23\",\n            \"id\": \"261365528\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Alejo García\",\n            \"id\": \"10205153877979641\"\n        }\n    }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"username\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"username\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"username\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"username\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "HTTP/1.1 200 OK\n{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"username\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"username\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "{\n  \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NWI2ZmJhOTczMTkxYTc0MjhkODBjOTQiL\",\n  \"user\": {\n    \"__v\": 0,\n    \"_id\": \"55b6fba973191a7428d80c94\",\n    \"email\": \"90joelmarquez@gmail.com\",\n    \"main_circle\": \"55b6fbaa73191a7428d80c95\",\n    \"name\": \"Joel Marquez\",\n    \"google\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n    },\n    \"instagram\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"https://igcdn-photos-g-a.akamaihd.net/hphotos-ak-xpf1/t51.2885-19/1209539_349750521886382_2055550828_a.jpg\",\n      \"username\": \"joe__marquez\"\n    },\n    \"twitter\": {\n      \"display_name\": \"Joel Márquez\",\n      \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n      \"username\": \"joelmarquez90\"\n    },\n    \"facebook\": {\n      \"display_name\": \"Joel Márquez\",\n      \"email\": \"90joelmarquez@gmail.com\",\n      \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n    },\n    \"valid_local_user\": true\n  }\n}",
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
          "content": "HTTP/1.1 200 OK\n\n{\n    \"user\": {\n        \"__v\": 0,\n        \"_id\": \"55c421354037f03842898378\",\n        \"email\": \"90joelmarquez@gmail.com\",\n        \"main_circle\": {\n            \"user\": \"55c421354037f03842898378\",\n            \"name\": \"Main Circle\",\n            \"_id\": \"55c421364037f03842898379\",\n            \"__v\": 0,\n            \"ancestors\": [\n            ]\n        },\n        \"name\": \"Joel Márquez\",\n        \"google\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n        },\n        \"instagram\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11385614_441266499409188_453477140_a.jpg\",\n            \"username\": \"joe__marquez\"\n        },\n        \"twitter\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n            \"username\": \"joelmarquez90\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n        },\n        \"valid_local_user\": true\n    }\n}",
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
    "url": "/api/user/:user_id/feed",
    "title": "Obtener feed del usuario",
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
          "content": "HTTP/1.1 200 OK\n\n{\n    \"user\": {\n        \"__v\": 0,\n        \"_id\": \"55c421354037f03842898378\",\n        \"email\": \"90joelmarquez@gmail.com\",\n        \"main_circle\": {\n            \"user\": \"55c421354037f03842898378\",\n            \"name\": \"Main Circle\",\n            \"_id\": \"55c421364037f03842898379\",\n            \"__v\": 0,\n            \"ancestors\": [\n            ]\n        },\n        \"name\": \"Joel Márquez\",\n        \"google\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n        },\n        \"instagram\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11385614_441266499409188_453477140_a.jpg\",\n            \"username\": \"joe__marquez\"\n        },\n        \"twitter\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n            \"username\": \"joelmarquez90\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n        },\n        \"valid_local_user\": true,\n        \"media\": {\n            \"count\": 4,\n            \"list\": [\n                {\n                    \"provider\": \"twitter\",\n                    \"id\": \"630875071029112832\",\n                    \"type\": \"text\",\n                    \"created_time\": 1439247312,\n                    \"link\": \"https://twitter.com/statuses/630875071029112832\",\n                    \"likes\": 0,\n                    \"text\": \"@FloreJoffre volvió mi escritora favorita, la extrañaba mucho!\",\n                    \"user_has_liked\": false\n                },\n                {\n                    \"provider\": \"facebook\",\n                    \"id\": \"10153505103784738\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438992173,\n                    \"link\": \"https://www.facebook.com/photo.php?fbid=10153505103784738&set=a.10152154863139738.1073741830.826764737&type=1\",\n                    \"likes\": 22,\n                    \"media_url\": \"https://scontent.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/11222579_10153505103784738_8048795787845306035_n.jpg?oh=1666a8fd6d3e5aed978488fc1b03ad17&oe=56809729\",\n                    \"text\": \"Visita a los abuelos!\"\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1046664664395121919_993803680\",\n                    \"type\": \"image\",\n                    \"created_time\": 1438992172,\n                    \"link\": \"https://instagram.com/p/6Gf_eAOYT_TLaOE0wV4q3GebfMnHq2eYRd3500/\",\n                    \"likes\": 10,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/11326029_815625338545580_1345778981_n.jpg\",\n                    \"text\": \"Visita a los abuelos!\",\n                    \"user_has_liked\": \"\"\n                },\n                {\n                    \"provider\": \"instagram\",\n                    \"id\": \"1041658847019238902_993803680\",\n                    \"type\": \"video\",\n                    \"created_time\": 1438395432,\n                    \"link\": \"https://instagram.com/p/50tzPRuYX2b063EzLuYQ190FkgywcDGwMbFoM0/\",\n                    \"likes\": 6,\n                    \"media_url\": \"https://scontent.cdninstagram.com/hphotos-xfa1/t50.2886-16/11766536_1631591547111503_50874758_n.mp4\",\n                    \"text\": \"Alguien nos invadió el cuarto!\",\n                    \"user_has_liked\": \"\"\n                }\n            ]\n        }\n    }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "api/user/index.js",
    "groupTitle": "Usuarios",
    "name": "GetApiUserUser_idFeed",
    "sampleRequest": [
      {
        "url": "http://localhost:8080/api/user/:user_id/feed"
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
          "content": "HTTP/1.1 200 OK\n\n{\n    \"friends\": {\n        \"facebook\": {\n            \"list\": [\n                {\n                    \"id\": \"10205153877979641\",\n                    \"name\": \"Alejo García\",\n                    \"picture\": \"https://graph.facebook.com/v2.3/10205153877979641/picture?type=large\",\n                    \"is_friend\": true\n                },\n                {\n                    \"id\": \"237673679704701\",\n                    \"name\": \"Kinder\",\n                    \"picture\": \"https://graph.facebook.com/v2.3/237673679704701/picture?type=large\",\n                    \"is_friend\": false\n                }\n            ],\n            \"count\": 2\n        },\n        \"instagram\": {\n            \"list\": [\n                {\n                    \"id\": \"1748235982\",\n                    \"name\": \"Basta De Todo\",\n                    \"picture\": \"https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/11374053_781604678648356_1836083238_a.jpg\",\n                    \"username\": \"bastatodo\"\n                }\n            ],\n            \"count\": 1\n        },\n        \"twitter\": {\n            \"list\": [\n                {\n                    \"id\": \"66780587\",\n                    \"name\": \"Amazon Web Services\",\n                    \"picture\": \"http://pbs.twimg.com/profile_images/2900345382/16ffae8c667bdbc6a4969f6f02090652_bigger.png\",\n                    \"username\": \"awscloud\"\n                }\n            ],\n            \"count\": 1\n        }\n    }\n}",
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
          "content": "HTTP/1.1 200 OK\n\n{\n    \"user\": {\n        \"__v\": 0,\n        \"_id\": \"55c421354037f03842898378\",\n        \"email\": \"90joelmarquez@gmail.com\",\n        \"main_circle\": {\n            \"user\": \"55c421354037f03842898378\",\n            \"name\": \"Main Circle\",\n            \"_id\": \"55c421364037f03842898379\",\n            \"__v\": 0,\n            \"ancestors\": [\n            ]\n        },\n        \"name\": \"Joel Márquez\",\n        \"google\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://lh5.googleusercontent.com/-QnDa8Ya8z38/AAAAAAAAAAI/AAAAAAAARw0/ye1DoA5JF9Y/photo.jpg?sz=200\"\n        },\n        \"instagram\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"https://igcdn-photos-e-a.akamaihd.net/hphotos-ak-xfa1/t51.2885-19/s150x150/11385614_441266499409188_453477140_a.jpg\",\n            \"username\": \"joe__marquez\"\n        },\n        \"twitter\": {\n            \"display_name\": \"Joel Márquez\",\n            \"picture\": \"http://pbs.twimg.com/profile_images/490125015044456449/O-wWpWq0_bigger.jpeg\",\n            \"username\": \"joelmarquez90\"\n        },\n        \"facebook\": {\n            \"display_name\": \"Joel Márquez\",\n            \"email\": \"90joelmarquez@gmail.com\",\n            \"picture\": \"https://graph.facebook.com/v2.3/10153267328674738/picture?type=large\"\n        },\n        \"valid_local_user\": true\n    }\n}",
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