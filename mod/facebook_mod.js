(function() {

    function facebook_mod() {}

    function onFacebookAPIReady() {
        FB.init({
            appId: this.options.appId,
            cookie: true, // enable cookies to allow the server to access
            // the session
            xfbml: true, // parse social plugins on this page
            version: 'v2.5' // use graph api version 2.5
        });
        checkAuth.call(this, makeRequest.bind(this))
    }

    function checkAuth(cb) {
        FB.getLoginStatus(function(response) {
            if (response.status !== 'connected') {
                FB.login(function(response) {
                    cb();
                }, {
                    scope: this.options.scope
                });
            } else {
                cb();
            }
        }.bind(this));

    }



    function makeRequest() {
        var args = [];
        if (this.options.apiPath) {
            args.push(this.options.apiPath)
        }
        if (this.options.apiMethod) {
            args.push(this.options.apiMethod)
        }
        args.push(this.options.data)
        args.push(this.options.callBack)
        FB.api.apply(this, args);
    }

    facebook_mod.prototype.initialize = function(options) {
        this.options = options;
        if (this.options.data) {
            this.options.data = JSON.parse(this.options.data);
        }
        this.scriptUrl = "//connect.facebook.net/{{lang}}/sdk.js".replace("{{lang}}", this.options.lang);


        if (!document.querySelector("[src='" + this.scriptUrl + "']")) {
            var srcnode = document.createElement("script");
            srcnode.src = this.scriptUrl;
            srcnode.id = 'facebook-jssdk';
            document.head.appendChild(srcnode);
            srcnode.onload = onFacebookAPIReady.bind(this);
        } else {
            onFacebookAPIReady.call(this);
        }



    }

    window.facebook_mod = facebook_mod;

})()
