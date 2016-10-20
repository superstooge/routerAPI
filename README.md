# routerAPI
JavaScript library to handle API calls to multiple endpoints based on a JSON descriptor.

## How does it work?
The `routerAPI` reads a *dictionary* JSON file, describing a number of *actions*. Each action corresponds to an API to call. A sample JSON dictionary looks like this:
```
[{
    "id": 1,
    "action": "myActionName",
    "endpoint": "http://myapi/endpoint/",
    "requestformat": "JSON",
    "responseformat": "JSON"
}]
```
**The properties are:**
* `id`              unique identifier
* `action`          action label
* `endpoint`        API endpoint
* `requestformat`   data format expected by the API endpoint
* `responseformat`  data format returned by the API

This descriptor allows RouterAPI to perform calls to the endpoints in a streamlined way.

## Usage
Import the library using a `<script>` tag.
```
var myData = {"myProp":"myValue", "myProp2":"myValue2"};

function myResponseCallBack(response){
    alert(response);
}

var r1 = new RouterAPI("path/to/JSON_file.json");
r1.performAction("myActionName", myData, myResponseCallBack);
```

Based on the example, the lines:
```
var r1 = new RouterAPI("path/to/JSON_file.json");
r1.performAction("myActionName", myData, myResponseCallBack);
```
will
1. create an instance of RouterAPI
2. load the JSON dictionary file located in `path/to/JSON_file.json`
3. call the `performAction` method, passing the `action` identifier, some data object to be sent to the API endpoint and a reference to a callback method, that will receive the API response.


**This readme is just a quick draft. Detailed readme coming soon. Please be patient!** :)

["Demo here"](http://fcarbone.info/routerapi/ "RouterAPI Demo")
The demo will call:
1. Google urlshortener API, shortening fcarbone.info
2. Google Calendar API (current events list)
3. Facebook public API (user details - read only)
The demo **will launch popups to request access permissions** (Google/Facebook). Please allow popups for the domain.
