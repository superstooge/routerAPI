(function(){var RouterAPI = function(manifest){
  if (window.___modulesCountRouterAPI === undefined) {
    window.___modulesCountRouterAPI = 0;
  }
  this._manifest = "./manifest.php";
  if (manifest) {
    this._manifest = manifest;
  }
  this.DATA_TYPE_JSON = "JSON";
  this.DATA_TYPE_XML = "XML";
  this.DATA_TYPE_URLENCODED = "urlencoded";
  this.DATA_TYPE_URLEMBEDDED = "urlembedded";
  this._actionStack = [];
  this._dict = '';
  this._dictionaryReady = false;

  // loop breaker
  this.count = 0;

  this._currentDictNode = '';
  var oReq = new XMLHttpRequest();
  oReq._this = this;
  oReq.addEventListener("load", function () {
    var self = this._this
    self._dict = JSON.parse(this.responseText);
    self._dictionaryReady = true;
    if (self._actionStack.length > 0) {
      ////console.log('executing action stack');
      self.executeActionStack()
    }
  });
  oReq.open("GET", this._manifest);
  oReq.send();
}


RouterAPI.prototype.addToActionStack = function(params){
  this.count++
  if (this.count >100) {
    return
  }
    this._actionStack.push(params);
}

RouterAPI.prototype.executeActionStack = function(){

    for (var i=0; i <this._actionStack.length; i++) {
      var params = this._actionStack[i];
      this.performAction(params[0],params[1],params[2])
    }
    this._actionStack = [];
}


RouterAPI.prototype.performAction = function(action, data, callBack){
  if (!this._dictionaryReady) {
    this.addToActionStack([action, data, callBack])
    ////console.log('Dictionary NOT ready: pushing to actionStack');

    return
  }
  //console.log('data coming in', data);
  var dictNode = this.checkDict(action)
  if(dictNode !== false){
    this._currentDictNode = dictNode;
    var newData = this.checkData(data)
    if (this._currentDictNode.hasOwnProperty("mod")) {
      this.loadMod(this._currentDictNode, newData, callBack)
    } else {
      this.callEndpoint(this._currentDictNode, newData, callBack)
    }
  } else {
    ////console.log('no action found in dictionary');
  }
}

RouterAPI.prototype.callEndpoint = function(dictNode, data, callBack){
  var oReq = new XMLHttpRequest();
  oReq.onload =  function(){
    this.getResponse(oReq.responseText, callBack)
  }.bind(this);
  var method = "POST";
  if (dictNode.requestformat === 'urlembedded') {
    dictNode.endpoint = this.TO_urlembedded(JSON.parse(data));
  }
  oReq.open(method, dictNode.endpoint);
  if (dictNode.requestformat === 'urlencoded') {
    oReq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  }
  oReq.send(data);

}

RouterAPI.prototype.loadMod = function(dictNode, data, callBack){
  var className = dictNode.namespace;
  if (!document.querySelector("[src='"+dictNode.mod+"']")) {
    var srcnode = document.createElement("script");
    srcnode.src = dictNode.mod;
    document.head.appendChild(srcnode)
    srcnode.onload = onModuleLoaded.bind(this);
  } else {
    onModuleLoaded.call(this);
  }

  function onModuleLoaded() {
    window.___modulesCountRouterAPI++
    this["mod"+window.___modulesCountRouterAPI] = new window[className];
    dictNode.data = data;
    dictNode.callBack = callBack;
    this["mod"+window.___modulesCountRouterAPI].initialize(dictNode);
    // console.log("mod"+window.___modulesCountRouterAPI);
    // console.log(this["mod"+window.___modulesCountRouterAPI]);

  }


}





RouterAPI.prototype.checkDict = function(action){
  for (var i = 0, len = this._dict.length; i < len; i++) {
    if (this._dict[i].action === action) {
      return this._dict[i];
    }
  }
  return false;
}


RouterAPI.prototype.checkData = function(data){
    var expected = this._currentDictNode.requestformat;
    var test = this['is'+expected](data)
    if (!test) {
      var converted = this['TO_'+expected](data);
      return converted;
    } else {
      return JSON.stringify(data);
    }
}


RouterAPI.prototype.getResponse = function(data, callBack) {

  var response = data;
  var autoDetectType = this.checkAllTypes(data);

  if (this._currentDictNode.responseformat !== this.DATA_TYPE_JSON) {
    if (this['is'+this._currentDictNode.responseformat](data)) {
      response = this['FROM_'+this._currentDictNode.responseformat](data);
      //console.log('converting response from ', this._currentDictNode.responseformat, response);

      //console.log(response);
      // invoke callback
      callBack(response);
    } else {
      console.error(this._currentDictNode.action, 'Expected '+this._currentDictNode.responseformat+' data, but detected as', autoDetectType, 'Consider updating manifest.json entry for action:', this._currentDictNode.action, 'setting responseformat:'+autoDetectType);
      return
    }
  } else if (!this.isJSON(data)) {
    console.error(this._currentDictNode.action, 'Expected JSON data, received non-JSON: attempt to autodetect data returned ', autoDetectType);
    if (autoDetectType !== undefined) {
          try{
            response = this['FROM_'+autoDetectType](data);
            //console.log('attempting to convert response from ', autoDetectType, response);
            //console.log(response);
            // invoke callback
            callBack(response);

          }
          catch(e)
          {
            console.log(this._currentDictNode.action, 'attempted convertion from ', autoDetectType, 'failed!');
          }
    }
  } else {
    // response is JSON

    // invoke callback
    console.log(JSON.parse(response));
    callBack(JSON.parse(response));
  }
}


// CHECK FUNCTIONS


RouterAPI.prototype.isJSON = function(str) {
    try {
        JSON.parse(JSON.stringify(str));
    } catch (e) {
        return false;
    }
    return true;
}

RouterAPI.prototype.isurlencoded = function(str){
  var pat = /[^=]*=[^=]*&?/g
  return pat.test(str);
}

RouterAPI.prototype.isXML = function(str) {
  var oParser = new DOMParser();
  var test;
  var oDOM = oParser.parseFromString(str, "text/xml");
  test = oDOM.getElementsByTagName('parsererror').length === 0;
  return test;

}

RouterAPI.prototype.isurlembedded = function(str) {
  return true;
}


RouterAPI.prototype.checkAllTypes = function(data){
  if (this.isJSON(data)) {
    return this.DATA_TYPE_JSON
  }
  if (this.isXML(data)) {
    return this.DATA_TYPE_XML
  }
  if (this.isurlencoded(data)) {
    return this.DATA_TYPE_URLENCODED
  }

  return undefined;
}


// conversion functions

// Changes XML to JSON
FROM_XML = function(xml) {
  //console.log(xml, typeof(xml));
  if (typeof(xml) === "string") {
    var parser = new DOMParser();
    xml = parser.parseFromString(xml,"text/xml");
  }
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;

  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        if (item.nodeType == 3) {
          obj = item.nodeValue;
        } else {
          obj[nodeName] = FROM_XML(item);
        }


      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];

          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(FROM_XML(item));
      }
    }
  }
  return obj;
};

RouterAPI.prototype.FROM_XML = FROM_XML;

// changes key-value pairs to json
FROM_urlencoded = function(str)
{

    "use strict";
    str = str.trim();
    // check for & at end of the string
    if (str.slice(-1) === "&") {
      str = str.slice(0, -1);
    }


    var obj,i,pt,keys,j,ev;
    if (typeof FROM_urlencoded.br !== 'function')
    {
        FROM_urlencoded.br = function(repl)
        {
            if (repl.indexOf(']') !== -1)
            {
                return repl.replace(/\](.+?)(,|$)/g,function($1,$2,$3)
                {
                    return FROM_urlencoded.br($2+'}'+$3);
                });
            }
            return repl;
        };
    }
    str = '{"'+(str.indexOf('%') !== -1 ? decodeURI(str) : str)+'"}';
    obj = str.replace(/\=/g,'":"').replace(/&/g,'","').replace(/\[/g,'":{"');
    obj = obj.replace(/\](.+?)(,|$)/g,function($1,$2,$3){ return FROM_urlencoded.br($2+'}'+$3);});
    //console.log(obj);
    obj = JSON.parse(obj);
    pt = ('&'+str).replace(/(\[|\]|\=)/g,'"$1"').replace(/\]"+/g,']').replace(/&([^\[\=]+?)(\[|\=)/g,'"&["$1]$2');
    pt = (pt + '"').replace(/^"&/,'').split('&');
    for (i=0;i<pt.length;i++)
    {
        ev = obj;
        keys = pt[i].match(/(?!:(\["))([^"]+?)(?=("\]))/g);
        for (j=0;j<keys.length;j++)
        {
            if (!ev.hasOwnProperty(keys[j]))
            {
                if (keys.length > (j + 1))
                {
                    ev[keys[j]] = {};
                }
                else
                {
                    ev[keys[j]] = pt[i].split('=')[1].replace(/"/g,'');
                    break;
                }
            }
            ev = ev[keys[j]];
        }
    }
    return obj;
}

RouterAPI.prototype.FROM_urlencoded = FROM_urlencoded;

// Changes json to key-value pairs
RouterAPI.prototype.TO_urlencoded = function(params) {
  if (params instanceof Array) {
    params = params[0];
  }
  var query = "";
  for (key in params) {
      query += encodeURIComponent(key)+"="+encodeURIComponent(params[key])+"&";
  }
  return query;
}




RouterAPI.prototype.TO_urlembedded = function(params) {
  if (params instanceof Array) {
    params = params[0];
  }
  var query = this._currentDictNode.endpoint;
  for (key in params) {
    if (params.hasOwnProperty(key)) {
      query = query.replace('{{'+key+'}}', params[key]);
    }
  }

  return query;
}


RouterAPI.prototype.TO_XML = function(o, tab) {
   var toXml = function(v, name, ind) {
      var xml = "";
      if (v instanceof Array) {
         for (var i=0, n=v.length; i<n; i++)
            xml += ind + toXml(v[i], name, ind+"\t") + "\n";
      }
      else if (typeof(v) == "object") {
         var hasChild = false;
         xml += ind + "<" + name;
         for (var m in v) {
            if (m.charAt(0) == "@")
               xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
            else
               hasChild = true;
         }
         xml += hasChild ? ">" : "/>";
         if (hasChild) {
            for (var m in v) {
               if (m == "#text")
                  xml += v[m];
               else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
               else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind+"\t");
            }
            xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
         }
      }
      else {
         xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
      }
      return xml;
   }, xml="";
   for (var m in o)
      xml += toXml(o[m], m, "");
   return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

window.RouterAPI = RouterAPI;

})()
