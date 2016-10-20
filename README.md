# routerAPI
JavaScript library to handle API calls to multiple endpoints based on a JSON descriptor.

## Scenario
* You are building your web page and need to call multiple APIs, on multiple servers
* Each API expects data in a certain format: JSON, XML, urlencoded, or embedded in the url itself (REST APIs)
* Some APIs expect specific information that you may only retrieve from yet another API, that does not *speak* the same language (i.e. **API-1** gives you the user location / **API-2** provides weather information based on the location)

RouterAPI provides functionality to make all the calls keeping the same data type in the frontend (JSON) without having to deal with different data types for each API endpoint. 

## How does it work?
The `routerAPI` reads a *manifest* JSON file, describing a number of *actions*. Each action corresponds to an API to call. A sample JSON manifest looks like this:
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
* load the JSON manifest file located in `path/to/JSON_file.json`
* transform `myData` into an XML object
* call the `performAction` method, passing the `action` identifier, the `myData` translated object and a callback method
* the translated `myData` will be sent to the API endpoint (`http://myapi/endpoint/`). *Remember that this API expects/returns only **XML data**)*
* the API response will be translated to JSON and sent to the callBack (`myResponseCallBack`)

**If no path to a JSON file is provided in the constructor, RouterAPI will fallback and try to load manifest.php, in its same folder)**

## request/response formats
In your JSON manifest, for both `requestformat` and `responseformat` the accepted values are:
* urlencoded
* JSON
* XML
* urlembedded

The first three types are just assigned to the property (as in the previous snippet), but when you set it to urlembedded, there are additional steps to perform. In this case, an example is worth a thousands words.

** This is your JSON manifest **

```
[{
    "id": 1,
    "action": "myActionName",
    "endpoint": "http://myapi/endpoint/{{action}}/{{id}}/",
    "requestformat": "urlembedded",
    "responseformat": "XML"
}]
```

** this is your code in the page **

```
var myData = {"action":"profile", "id":"20"};

function myResponseCallBack(response){
    alert(response);
}

var r1 = new RouterAPI("path/to/JSON_file.json");
r1.performAction("myActionName", myData, myResponseCallBack);
```

Note how the properties in `myData` match keywords in the JSON `endpoint` ?
Since we are calling a RESTful API, the endpoint will be manipulated, based on the properties of `myData` that match any `{{keyword}}` in the JSON endpoint.
In this example, the resulting url is:
    `http://myapi/endpoint/profile/20/`


## Meet the Modules
What if an API requires oAuth authentication? What if it is not RESTful? What if calls are made via an SDK? (i.e. Facebook JS SDK or Google APIs)
In that case, write a module! A module is a separate JavaScript file, that will be dynamically loaded and instantiated by RouterAPI.
RouterAPI will create an instance of the module using the **new** keyword and then invoke its **initialize** method. Therefore, your minimum code in a custom module will be something like this:

```
(function() {

    function my_mod() {
    }

    my_mod.prototype.initialize = function(options) {
        console.log("my_mod instance initialized", "options", options);
    }

    window.my_mod = my_mod;

})()
```
Save this code (let's say in the same folder where `routerapi.js` sits). Then in your JSON file you may write the following:

```
{
    "id": 6,
    "action": "MyModule",
    "mod":"my_mod.js",
    "namespace":"my_mod",
    "requestformat": "JSON",
    "responseformat": "JSON"
}
```


## Demo

[Demo here](http://fcarbone.info/routerapi/ "RouterAPI Demo")

The demo will call:

    1. Google urlshortener API, shortening fcarbone.info
    2. Google Calendar API (current events list)
    3. Facebook public API (user details - read only)
    
The demo **will launch popups to request access permissions** (Google/Facebook). Please allow popups for the domain.


## Credits
Coming soon



**This readme is just a quick draft. Detailed readme coming soon. Please be patient!** :)

