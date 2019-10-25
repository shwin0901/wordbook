Vue.component("word-input",{
    template:`<input type="text" :placeholder="placeholder">`,
    props:["placeholder"],
});

const vm = new Vue({
    el: "#app",
    data: {
        newWord:null,
    },
    methods:{
        defaultWord:function() {
            return {
                name:'',
                chinese:{
                    type:'v.',
                    text:'',
                }
            }
        }
    }
});