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
            <input class="meaning-text" type="text" placeholder="中文意思" required>
            <div class="btn btn-primary" onclick="onMeaningButtonClick(event)"></div>
     </div>
`;

let sectionMeaning = document.querySelector('.section-meaning');
sectionMeaning.insertAdjacentHTML('beforeend', meaningDiv);

function onMeaningButtonClick(event) {
    let target = event.target;
    let sign = window.getComputedStyle(target,':before').getPropertyValue('content');
    if (sign.includes('+')) {
        sectionMeaning.insertAdjacentHTML('beforeend', meaningDiv);
    } else {
        target.parentNode.remove();
    }
}