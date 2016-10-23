[{
    "id": 1,
    "action": "testAction1",
    "endpoint": "./fakeapi.php",
    "requestformat": "JSON",
    "responseformat": "XML"
}, {
    "id": 2,
    "action": "testAction2",
    "endpoint": "./fakeapi_XML.php",
    "requestformat": "XML",
    "responseformat": "XML"
}, {
    "id": 3,
    "action": "testAction3",
    "endpoint": "./fakeapi_urlencoded.php",
    "requestformat": "urlencoded",
    "responseformat": "urlencoded"
}, {
    "id": 4,
    "action": "testAction4",
    "endpoint": "./{{id}}/{{action}}/fakeapi.php",
    "requestformat": "urlembedded",
    "responseformat": "JSON"
}, {
    "id": 5,
    "action": "testAction5",
    "endpoint": "./fakeapi.php",
    "requestformat": "JSON",
    "responseformat": "JSON"
}, {
    "id": 6,
    "action": "testGoogle",
    "mod":"mod/google_mod.js",
    "namespace":"google_mod",
    "apiKey":"AIzaSyDKInslrnSodGk0G_kGLfCTimYrn_vDpTA",
    "apiMethod":"urlshortener.url.get",
    "apiVersion":"v1",
    "immediate":false,
    "clientId":"574205967969-mge0jbmm3g8bmnpjhe4n0mfj1odb66dd.apps.googleusercontent.com",
    "scopes":"https://www.googleapis.com/auth/urlshortener",
    "requestformat": "JSON",
    "responseformat": "JSON"
}, {
    "id": 7,
    "action": "GoogleCalendarListEvents",
    "mod":"mod/google_mod.js",
    "namespace":"google_mod",
    "apiKey":"AIzaSyDKInslrnSodGk0G_kGLfCTimYrn_vDpTA",
    "apiMethod":"calendar.events.list",
    "apiVersion":"v3",
    "immediate":false,
    "clientId":"574205967969-qe2gmjk663ql5asb8vjaqmh5v7ao4hgj.apps.googleusercontent.com",
    "scopes":"https://www.googleapis.com/auth/calendar.readonly",
    "requestformat": "JSON",
    "responseformat": "JSON"
}, {
    "id": 8,
    "action": "FacebookAPI",
    "mod":"mod/facebook_mod.js",
    "namespace":"facebook_mod",
    "appId":"1275476619181853",
    "apiPath":"/me",
    "apiParams":"{\"fields\":\"name, age_range, picture, link\"}",
    "lang":"en_US",
    "scope":"public_profile,email",
    "requestformat": "JSON",
    "responseformat": "JSON"
}, {
    "id": 9,
    "action": "YoutubeAPI",
    "mod":"mod/google_mod.js",
    "namespace":"google_mod",
    "apiKey":"AIzaSyDKInslrnSodGk0G_kGLfCTimYrn_vDpTA",
    "apiMethod":"youtube.search.list",
    "apiVersion":"v3",
    "scopes":"https://www.googleapis.com/auth/youtube",
    "requestformat": "JSON",
    "responseformat": "JSON"
}


]
