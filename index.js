let saveButton = document.getElementById('save');

saveButton.addEventListener('click', function(event) {
    event.preventDefault();
});

const meaningDiv = `
    <div class="meaning">
            <select>
                <option {option-v}>v.</option>
                <option {option-n}>n.</option>
                <option {option-adj}>adj.</option>
                <option {option-adv}>adv.</option>
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
    updateWordCount();
};

function inspectInput() {
    for (let input of document.querySelectorAll('input')) {
        if (input.value === '') {
            input.style.borderColor = 'red';
            animateCSS(input, 'heartBeat');
            return true;
        }
    }
    return false;
}

function animateCSS(element, animationName) {
    let node = null;
    if (typeof element === 'object') {
        node = element;
    } else {
        node = document.querySelector(element);
    }
    node.classList.add('animated', animationName);
    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);
    }

    node.addEventListener('animationend', handleAnimationEnd);

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
                <button class="btn btn-outline-primary" onclick="editCard('${word.name}')">编辑</button>
                <button class="btn btn-outline-danger" onclick="removeCard('${word.name}')">删除</button>
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
    updateWordCount();
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
    updateWordCount();
}

function insertMeaning(parentDiv, meaningType = 'v.', meaningText = '') {
    let div = meaningDiv
        .replace('{meaning-text}', meaningText)
        .replace(`{option-${meaningType.substring(0, meaningType.length - 1)}}`, 'selected')
        .replace(/{option-.+}/g, '');
    parentDiv.insertAdjacentHTML('beforeend', div);
}


function editCard(wordname) {
    let bigDiv = document.createElement('div');
    bigDiv.classList.add('big-div');
    bigDiv.insertAdjacentHTML('beforeend', `<div class="small-div animated fadeInDown faster"><div>
            <label>新单词：</label>
            <input type="text" placeholder="请输入新单词" required oninput="onInputCharge(event)" value="${wordname}">
        </div>
        <label class="card-meaning">含义：</label>
        </div>`);

    let meaningDiv = document.createElement('div');
    for (let [index, word] of wordBook.entries()) {
        if (word.name === wordname) {
            for (let chin of word.chinese) {
                insertMeaning(meaningDiv, chin.type, chin.text);
            }
        }
    }
    bigDiv.firstChild.appendChild(meaningDiv);

    bigDiv.firstChild.insertAdjacentHTML("beforeend", `<button class="save btn btn-primary btn-sm" onclick="saveData('${wordname}')">保存</button>`);
    bigDiv.firstChild.insertAdjacentHTML("beforeend", '<button class="cancel btn btn-danger btn-sm" onclick="cancel()">取消</button>');
    document.body.appendChild(bigDiv);
    document.onkeydown = function(event) {
        if (event.key === 'Escape') {
            cancel();
        }
    }

}

function saveData(wordname) {
    let small = document.querySelector('.small-div');
    for (let input of small.querySelectorAll('input')) {
        if (input.value === '') {
            input.style.borderColor = 'red';
            animateCSS(input, 'heartBeat');
            return;
        }
    }

    for (let [index, word] of wordBook.entries()) {
        if (word.name === wordname) {
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
    let bigDiv = document.querySelector('.big-div');
    let smallDiv = bigDiv.querySelector('.small-div');
    smallDiv.classList.add('animated', 'fadeOutDown', "faster");
    setTimeout(() => bigDiv.remove(), 500);
}

function updateWordCount() {
    let num = document.getElementById('word-count');
    num.textContent = wordBook.length;
}