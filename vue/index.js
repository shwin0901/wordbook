import {jsonbox} from "./jsonbox.js";

Vue.directive('animate', {
    componentUpdated: function(el, binding) {
        let showAnimate = binding.value;
        if (showAnimate) {
            let animationName = binding.arg || 'shake';
            el.classList.add('animated', animationName);
            function handleAnimationEnd() {
                el.classList.remove('animated', animationName);
                el.removeEventListener('animationend', handleAnimationEnd);
            }
            el.addEventListener('animationend', handleAnimationEnd);
        }
    }
});

Vue.component("word-input", {
    template: `<input type="text" :placeholder="placeholder" v-model="value" 
                     @input="onInputChange" required :style="style"
                     @invalid="onInvalid" v-animate:heartBeat="invalid">`,
    props: ["placeholder", 'value'],
    data: function() {
        return {
            invalid: false,
        }
    },
    computed:{
        style: function() {
            return this.invalid ? {borderColor: 'red'} : null
        },
    },
    methods: {
        onInputChange: function() {
            this.$emit('input', this.value);
            this.invalid = false;
        },
        onInvalid:function() {
            return this.invalid = true;
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
            <word-input v-model="value.text" :class="'meaning-text'" :placeholder="'中文意思'"></word-input>
            <div class="btn btn-primary" @click="onMeaningButtonClick($event)"></div>
     </div>`,
    props: ['value', 'index'],
    methods: {
        onMeaningButtonClick: function(event) {
            let sign = window.getComputedStyle(event.target, ':before').getPropertyValue('content');
            this.$emit('meaning-click', sign, this.index);
        },
    }
});

Vue.component("word-card", {
    template: `<div class="liStyle-li">
        <div class="liStyle-name">{{ word.name }}</div>
        <div class="liStyle-button">
            <button class="btn btn-outline-primary" @click="editCard">编辑</button>
            <button class="btn btn-outline-danger" @click="removeCard">删除</button>
        </div>
        <div class="word-Li">
            <div v-for="meaning in word.chinese">
                <span>{{ meaning.type }}</span>
                <span>{{ meaning.text }}</span>
            </div>
        </div>
    </div>`,
    props: ['word', 'index'],
    methods:{
        removeCard:function() {
            this.$emit('remove',this.index,this.word);
        },
        editCard:function() {
            this.$emit('edit',JSON.parse(JSON.stringify(this.word)),this.index)
        }
    }
});

Vue.component('meaning-list',{
    template:`<div class="section-meaning">
              <meaning-div
              v-for="(meaning,index) in word.chinese"
              :index="index"
              v-model="meaning"
              @meaning-click="onMeaningClick">
             </meaning-div>
</div>`,
    props: ['word'],
    methods:{
         onMeaningClick : function(sign, index) {
             console.log('meaning-click',sign.includes("+"),sign,index);
            if (sign.includes("+")) {
                console.log('+');
                this.word.chinese.push({
                    type: 'v.',
                    text: '',
                });
            } else {
                console.log('-');
                this.word.chinese.splice(index, 1);
            }
        },
    }
});

const vm = new Vue({
    el: "#app",
    data: {
        newWord: {
            name: '',
            chinese: [
                {
                    type: 'v.',
                    text: '',
                }
            ]
        },
        wordBook: [],
        editingIndex:null,
        editingWord:null,
    },
    methods: {
        defaultWord: function() {
            return {
                name: '',
                chinese: [{
                    type: 'v.',
                    text: '',
                }]
            }
        },
        refresh:function() {
            this.newWord = this.defaultWord();
            jsonbox.getAll(response => {
                this.wordBook = response;
            }, () => {
               alert("error");
            })
        },
        save: function() {
            jsonbox.post(this.newWord,(response) =>{
                this.wordBook.push(response);
                this.newWord = this.defaultWord();
            },() => {
                alert("save error");
            });
        },
        onRemoveCard:function(index,word) {
            jsonbox.delete(word,(response) => {
                this.wordBook.splice(index,1);
            },() => {
                alert("delete error");
            });
        },
        onEditCard:function(word,index) {
            this.editingWord=word;
            this.editingIndex=index;
        },
        meaningClick:function(event,index) {
            if (event.includes("+")){
                this.editingWord.chinese.push({
                    type:'v.',
                    text:''
                })
            } else {
                this.editingWord.chinese.splice(index,1)
            }
        },
        onCancelCard:function() {
            this.editingWord=null;

        },
        onSaveCard:function() {
            jsonbox.put(this.editingWord,(response) => {
                this.wordBook.splice(this.editingIndex,1,this.editingWord);
                this.editingWord = null;
            },() => {
                alert("put error");
            });
        }
    },
    created:function() {
        this.refresh();
    }
});