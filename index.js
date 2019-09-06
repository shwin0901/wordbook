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
            <input class="meaning-text" type="text" placeholder="中文意思" required oninput="onInputCharge(event)">
            <div class="btn btn-primary" onclick="onMeaningButtonClick(event)"></div>
     </div>
`;

let sectionMeaning = document.querySelector('.section-meaning');
sectionMeaning.insertAdjacentHTML('beforeend', meaningDiv);

function onMeaningButtonClick(event) {
    let target = event.target;
    let sign = window.getComputedStyle(target, ':before').getPropertyValue('content');
    if (sign.includes('+')) {
        sectionMeaning.insertAdjacentHTML('beforeend', meaningDiv);
    } else {
        target.parentNode.remove();
    }
}

let wordBook = JSON.parse(localStorage.getItem('wordBook')) || [];

let save = document.getElementById('save');
save.onclick = function(event) {
    event.preventDefault();
    if (inspectInput()) return;
    let word = getWord(document);
    wordBook.push(word);
    localStorage.setItem('wordBook', JSON.stringify(wordBook));
    createWordLi(word);
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
    li.classList.add('liStyle');
    li.insertAdjacentHTML('beforeend', `<div>
            <div>${word.name}</div>
            <div>
                <button>编辑</button>
                <button>删除</button>
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