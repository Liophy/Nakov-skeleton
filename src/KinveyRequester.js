import $ from 'jquery';

let KinveyRequester = (function () {
    const base_url = "https://baas.kinvey.com/";
    const app_id = "kid_Bkfe6RMXl";
    const app_secret = "4c78eb24aef349fd8fb0146ffe0c50e1";
    const appAuthHeaders = {
        Authorization: "Basic " + btoa(app_id + ":" + app_secret)
    };

    function loginUser(username,password) {
        return $.ajax({
            method: 'POST',
            url: base_url +  "user/" + app_id + "/login",
            data: JSON.stringify({username, password}),
            headers: appAuthHeaders,
            contentType:"application/json"
        });
    }
    
    function registerUser(username, password) {
        return $.ajax({
            method: 'POST',
            url: base_url +  "user/" + app_id,
            data: JSON.stringify({username, password}),
            headers: appAuthHeaders,
            contentType:"application/json"
        });
        
    }

    return {
        loginUser,
        registerUser
    }
    
})();

export default KinveyRequester;