(function() {

    function google_mod() {
        this.auth2 = "";
        this.options;
        this.signInTimer = 0;
    }

    function onGoogleAPIReady() {
        if (this.options.clientId !== undefined) {
            this.auth2 = ":auth2";
        }
        gapi.load('client' + this.auth2, init.bind(this));

    }

    function makeRequest(data) {
        var request = getApiFunction(this.options.apiMethod)(data);
        request.then(function(response) {
            //console.log(response.result);
            this.options.callBack(response.result);
        }.bind(this), function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    }

    function onAuth2(authResult) {
      if (authResult) {
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
          loadModule.call(this)
        } else {
          gapi.auth2.getAuthInstance().signIn().then(loadModule.bind(this))
          this.getSignedInInterval = setInterval(getSignedInState.bind(this), 1000)
        }
      } else {
        this.options.callBack(authResult);
        console.error("Google oAuth authentication failed");
      }

    }

    function loadModule() {
        var request = gapi.client.load(this.options.apiName, this.options.apiVersion).then(function() {
            clearInterval(this.getSignedInInterval);
            makeRequest.call(this, this.options.data);
        }.bind(this));
    }

    function onAuth(authResult) {
      if (authResult) {
        var request = gapi.client.load(this.options.apiName, this.options.apiVersion).then(function() {
            clearInterval(this.getSignedInInterval);
            makeRequest.call(this, this.options.data);
        }.bind(this));
      } else {
        this.options.callBack(authResult);
        console.error("Google oAuth authentication failed");
      }

    }

    function getSignedInState() {
      this.signInTimer++;
      //console.log(this.signInTimer, "seconds without signing in");
      if (!gapi.auth2.getAuthInstance().isSignedIn.get() && this.signInTimer > 8) {
        this.options.callBack({error:"user did not sign in"});
        clearInterval(this.getSignedInInterval);
      }
    }

    function init() {

        if (this.options.clientId !== undefined) {
          var authData = {
              'client_id': this.options.clientId,
              'scope': this.options.scopes,
              'immediate': this.options.immediate || false
          }
          if (this.options.forceAuth1) {
              gapi.auth.authorize(authData, onAuth.bind(this));
          } else {
            if (gapi.auth2.getAuthInstance()) {
              onAuth2.call(this, true);
            } else {
            gapi.auth2.init(authData).then(onAuth2.bind(this))
            }
          }

        } else {
            gapi.client.setApiKey(this.options.apiKey);
            gapi.client.load(this.options.apiName, this.options.apiVersion).then(function() {
                makeRequest.call(this,this.options.data);
            }.bind(this));
        }


    }

    function getApiFunction(apiMethodString) {
        var objectsChain = apiMethodString.split(".");
        var obj = gapi.client;
        var loopCnt = 0;
        while (objectsChain.length > 0) {
            obj = obj[objectsChain.shift()];
            loopCnt++
            if (loopCnt > 100) {
                break;
            }
        }
        return obj
    }

    function getApiName(apiMethodString) {
        return apiMethodString.split(".")[0];
    }


    google_mod.prototype.initialize = function(options) {
        this.options = options;

        if (this.options.data) {
            this.options.data = JSON.parse(this.options.data);
        }
        this.options.apiName = getApiName(this.options.apiMethod);


        if (!document.querySelector("[src='https://apis.google.com/js/api.js']")) {
            var srcnode = document.createElement("script");
            srcnode.src = "https://apis.google.com/js/api.js";
            document.head.appendChild(srcnode);
            srcnode.onload = onGoogleAPIReady.bind(this);
        } else {
            onGoogleAPIReady.call(this);
        }

    }

    window.google_mod = google_mod;

})()
