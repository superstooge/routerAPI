# routerAPI
JavaScript library to handle API calls to multiple endpoints based on a JSON descriptor.

## Scenario
* You are building your web page and you need to access multiple APIs, on different server
* Each API expects data in a certain format: JSON, XML, urlencoded, or embedded in the url itself (REST APIs)
* Some APIs expect specific information that you may only retrieve from yet another API, that does not *speak* the same language (i.e. **API-1** gives you the user location / **API-2** provides weather information based on the location)

RouterAPI provides functionality to make all the calls keeping the same data type in the frontend (JSON) without having to deal with different data types for each API endpoint. 

## How does it work?
The `routerAPI` reads a *dictionary* JSON file, describing a number of *actions*. Each action corresponds to an API to call. A sample JSON dictionary looks like this:
```
[{
    "id": 1,
    "action": "myActionName",
    "endpoint": "http://myapi/endpoint/",
    "requestformat": "XML",
    "responseformat": "XML"
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

* create an instance of RouterAPI
* load the JSON dictionary file located in `path/to/JSON_file.json`
* transform `myData` into an XML object
* call the `performAction` method, passing the `action` identifier, the `myData` translated object and a callback method
* the translated `myData` will be sent to the API endpoint (`http://myapi/endpoint/`). *Remember that this API expects/returns only **XML data**)*
* the API response will be translated to JSON and sent to the callBack (`myResponseCallBack`)



[Demo here](http://fcarbone.info/routerapi/ "RouterAPI Demo")

The demo will call:

    1. Google urlshortener API, shortening fcarbone.info
    2. Google Calendar API (current events list)
    3. Facebook public API (user details - read only)
    
The demo **will launch popups to request access permissions** (Google/Facebook). Please allow popups for the domain.


## Credits
Coming soon



**This readme is just a quick draft. Detailed readme coming soon. Please be patient!** :)

