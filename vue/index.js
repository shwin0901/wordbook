Vue.component("word-input", {
    template: `<input type="text" :placeholder="placeholder" v-model="value" 
                     @input="onInputChange">`,
    props: ["placeholder", 'value'],
    methods: {
        onInputChange: function() {
            this.$emit('input', this.value)
        }
    }
});

Vue.component("meaning-div", {
    template: `<div class="meaning">
            <select v-model="value.type">
                <option value="v.">v.</option>
                <option value="n.">n.</option>
                <option value="adj.">adj.</option>
                <option value="adv.">adv.</option>
            </select>
            <input class="meaning-text" type="text" placeholder="中文意思" v-model="value.text">
            <div class="btn btn-primary" @click="onMeaningButtonClick($event)"></div>
     </div>`,
    props:['value','index'],
    methods:{
        onMeaningButtonClick:function(event) {
            let sign = window.getComputedStyle(event.target,':before').getPropertyValue('content');
            this.$emit('meaning-click',sign,this.index);
        }
    }
});

Vue.component("word-card", {
    template: `<div class="liStyle-li">
        <div class="liStyle-name">{{ word.name }}</div>
        <div class="liStyle-button">
            <button class="btn btn-outline-primary" @click="">编辑</button>
            <button class="btn btn-outline-danger" @click="">删除</button>
        </div>
        <div class="word-Li">
            <div v-for="meaning in word.chinese">
                <span>{{ meaning.type }}</span>
                <span>{{ meaning.text }}</span>
            </div>
        </div>
    </div>`,
    props:['word','index'],
});

const vm = new Vue({
    el: "#app",
    data: {
        newWord: {
            name: '',
            chinese:[
                {
                    type: 'v.',
                    text: '',
                }]
        },
        wordBook:[],
    },
    methods: {
        defaultWord: function() {
            return {
                name: '',
                chinese: [{
                    type: 'n.',
                    text: '',
                }]
            }
        },
        onMeaningClick:function(event,index) {
            if (event.includes("+")) {
                this.newWord.chinese.push({
                    type: 'v.',
                    text: '',
                })
            } else {
                this.newWord.chinese.splice(index, 1);
            }
        },
        save:function() {
            this.wordBook.push(this.newWord);
            this.newWord = this.defaultWord();
        }
    }
});