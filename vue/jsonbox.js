const url = "https://jsonbox.io/box_52bc1d4be8246d68a87f";

export let jsonbox = {
    getAll(success,error){
        let xhr = new XMLHttpRequest();
        xhr.open("GET",url);
        xhr.responseType = "json";
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.send();
        xhr.onload=function() {
            if(xhr.status === 200){
                success(xhr.response);
            } else {
                error();
            }
        }
    },
    post(word,success,error){
        let xhr = new XMLHttpRequest();
        xhr.open("POST",url);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.responseType='json';
        xhr.send(JSON.stringify(word));
        xhr.onload =function() {
            if (xhr.status === 200 || xhr.status === 201){
                success(xhr.response);
            } else {
                error();
            }
        }
    },
    delete(){

    },
    put(){

    }
};