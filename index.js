let saveButton = document.getElementById('save');

saveButton.addEventListener('click', function(event) {
    event.preventDefault();
});

const meaningDiv = `
    <div class="meaning">
            <select>
                <option>v.</option>
                <option>n.</option>
                <option>adj.</option>
                <option>adv.</option>
            </select>
            <input class="meaning-text" type="text" placeholder="中文意思" required oninput="onInputCharge(event)" value="{meaning-text}">
            <div class="btn btn-primary" onclick="onMeaningButtonClick(event)"></div>
     </div>
`;

let sectionMeaning = document.querySelector('.section-meaning');
insertMeaning(sectionMeaning);

function onMeaningButtonClick(event) {
    let target = event.target;
    let sign = window.getComputedStyle(target, ':before').getPropertyValue('content');
    if (sign.includes('+')) {
        // sectionMeaning.insertAdjacentHTML('beforeend', meaningDiv);
        insertMeaning(target.parentNode.parentNode);
    } else {
        target.parentNode.remove();
    }
}

let wordBook = JSON.parse(localStorage.getItem('wordBook')) || [];

let save = document.getElementById('save');
save.onclick = function(event) {
    event.preventDefault();
    if (inspectInput()) return;
    if (detectionCard()) return;
    let word = getWord(document);
    wordBook.push(word);
    localStorage.setItem('wordBook', JSON.stringify(wordBook));
    createWordLi(word);
    clearInputMessage();
};

function inspectInput() {
    for (let input of document.querySelectorAll('input')) {
        if (input.value === '') {
            input.style.borderColor = 'red';
            return true;
        }
    }
    return false;
}

function onInputCharge(event) {
    if (event.data !== null) {
        event.target.style.borderColor = null;
    }
}

function getWord(element) {
    let meaning = element.querySelectorAll('.meaning');
    let word = {
        name: element.getElementsByTagName('input')[0].value,
        chinese: []
    };
    for (let item of meaning) {
        word.chinese.push({
            type: item.children[0].value,
            text: item.children[1].value,
        })
    }
    return word;
}

function createWordLi(word) {
    let wordList = document.getElementById('word-list');
    let li = document.createElement('li');
    li.classList.add('liStyle', word.name);
    li.insertAdjacentHTML('beforeend', `<div class="liStyle-li">
            <div class="liStyle-name">${word.name}</div>
            <div class="liStyle-button">
                <button onclick="editCard('${word.name}')">编辑</button>
                <button onclick="removeCard('${word.name}')">删除</button>
            </div>
            <div class="word-Li"></div>
            </div>`);

    let wordLi = li.querySelector('.word-Li');
    for (let item of word.chinese) {
        wordLi.insertAdjacentHTML('beforeend', `<div>
             <span>${item.type}</span>
             <span>${item.text}</span>
             </div>`)
    }

    wordList.prepend(li);
}

function refreshWordLi() {
    for (let word of wordBook) {
        createWordLi(word);
    }
}

refreshWordLi();

function clearInputMessage() {
    for (let div of document.querySelectorAll('.meaning:not(:first-child)')) {
        div.remove();
    }
    for (let input of document.querySelectorAll('input')) {
        input.value = ''
    }
    document.querySelector('.meaning>select').value = 'v.';

}

//检查输入时的单词是否在localStorage中存在
function detectionCard() {
    let card = document.getElementsByTagName('input')[0];
    for (let wordcard of wordBook) {
        if (card.value === wordcard.name) {
            alert('该单词已存在!');
            return true;
        }
    }
    return false;
}

function removeCard(wordname) {
    let li = document.querySelector(`.${wordname}`);
    li.remove();
    for (let [index, word] of wordBook.entries()) {
        if (wordname === word.name) {
            wordBook.splice(index, 1)
        }
    }
    localStorage.setItem('wordBook', JSON.stringify(wordBook));
}

function insertMeaning(parentDiv, meaningType = 'v.', meaningText = '') {
    parentDiv.insertAdjacentHTML('beforeend', meaningDiv
        .replace('{meaning-type}', meaningType)
        .replace('{meaning-text}', meaningText))
}


function editCard(wordname) {
    let BigDiv = document.createElement('div');
    BigDiv.classList.add('big-div');
    BigDiv.insertAdjacentHTML('beforeend', `<div class="small-div"><div>
            <label>新单词：</label>
            <input type="text" placeholder="请输入新单词" required oninput="onInputCharge(event)" value="${wordname}">
        </div>
        <label>含义：</label>
        </div>`);
    let meaningDiv = document.createElement('div');
    for (let [index, word] of wordBook.entries()) {
        if (word.name === wordname) {
            for (let chin of word.chinese) {
                insertMeaning(meaningDiv, chin.type, chin.text);
            }
        }
    }
    BigDiv.firstChild.appendChild(meaningDiv);

    BigDiv.firstChild.insertAdjacentHTML("beforeend", `<button class="save btn btn-primary btn-sm" onclick="saveData('${wordname}')">保存</button>`);
    BigDiv.firstChild.insertAdjacentHTML("beforeend", '<button class="cancel btn btn-danger btn-sm" onclick="cancel()">取消</button>');
    document.body.appendChild(BigDiv);
    document.onkeydown = function(event) {
        if (event.key === 'Escape') {
            BigDiv.remove();
        }
    }

}

function saveData(wordname) {
    let small = document.querySelector('.small-div');
    for (let input of small.querySelectorAll('input')) {
        if (input.value === '') {
            input.style.borderColor = 'red';
            return;
        }
    }

    for(let [index,word] of wordBook.entries()){
        if (word.name === wordname){
            wordBook.splice(index, 1);
            break;
        }
    }

    let word = getWord(small);
    removeCard(wordname);

    wordBook.push(word);
    localStorage.setItem('wordBook', JSON.stringify(wordBook));
    createWordLi(word);
    cancel();
}

function cancel() {
    let BigDiv = document.querySelector('.big-div');
    BigDiv.remove();
}