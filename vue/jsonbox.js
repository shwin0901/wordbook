const url = "https://jsonbox.io/box_52bc1d4be8246d68a87f";

export let jsonbox = {
    async fetchAll() {
        let response = await fetch(url);
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Fetch all failed!");
        }
    },
    getAll(success, error) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "json";
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send();
        xhr.onload = function() {
            if (xhr.status === 200) {
                success(xhr.response);
            } else {
                error();
            }
        };
        xhr.onerror = error;
    },
    async post(word) {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(word),
        });
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Create failed!");
        }
        // let xhr = new XMLHttpRequest();
        // xhr.open("POST", url);
        // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        // xhr.responseType = 'json';
        // xhr.send(JSON.stringify(word));
        // xhr.onload = function() {
        //     if (xhr.status === 200 || xhr.status === 201) {
        //         success(xhr.response);
        //     } else {
        //         error();
        //     }
        // };
        // xhr.onerror = error;
    },
    async delete(word) {
        let response = await fetch(url + "/" + word._id, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(word),
        });

        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject("Delete failed!");
        }
    },
    // delete(word, success, error) {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("DELETE", url + "/" + word._id);
    //     xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    //     xhr.responseType = "json";
    //     xhr.send(JSON.stringify(word));
    //     xhr.onload = function() {
    //         if (xhr.status === 200) {
    //             success(xhr.response);
    //         } else {
    //             error();
    //         }
    //     };
    //     xhr.onerror = error;
    // },
    async put(word) {
        let response = await fetch(url + "/" + word._id, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(word),
        });
        if (response.ok) {
            return response.json();
        } else {
            return  Promise.reject("Update failed!");
        }
    },
    // put(word, success, error)
    // {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("PUT", url + "/" + word._id);
    //     xhr.responseType = "json";
    //     xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    //     xhr.send(JSON.stringify(word));
    //     xhr.onload = function() {
    //         if (xhr.status === 200) {
    //             let result = success(xhr.response);
    //             reslove(result)
    //         } else {
    //             error();
    //         }
    //     };
    //     xhr.onerror = error;
    // }
    // }
};



