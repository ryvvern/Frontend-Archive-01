import { catsData } from '/data.js'

const emotionRadios = document.getElementById('emotion-radios')
const getImageBtn = document.getElementById('get-image-btn')
const gifsOnlyOption = document.getElementById('gifs-only-option')
const memeModalInner = document.getElementById('meme-modal-inner')
const memeModal = document.getElementById('meme-modal')
const memeModalCloseBtn = document.getElementById('meme-modal-close-btn')

memeModalCloseBtn.addEventListener('click', closeModal)
getImageBtn.addEventListener('click', renderCat)

function closeModal() {
    memeModal.style.display = 'none'
}

function renderCat() {
    const catObject = getSingleCatObject()
    if (catObject) {
        memeModalInner.innerHTML = `
            <img 
                class="cat-img" 
                src="./images/${catObject.image}"
                alt="${catObject.alt}"
            >
        `
        memeModal.style.display = 'flex'
    }
}

function getSingleCatObject() {
    const catsArray = getMatchingCatsArray()
    if (catsArray.length === 1) {
        return catsArray[0]
    } else {
        const randomNumber = Math.floor(Math.random() * catsArray.length)
        return catsArray[randomNumber]
    }
}

function getMatchingCatsArray() {
    const selectedBtn = document.querySelector('.emotion-btn.selected')
    if (selectedBtn) {
        const selectedEmotion = selectedBtn.dataset.emotion
        const isGif = gifsOnlyOption.checked

        return catsData.filter(cat => {
            const matchesEmotion = cat.emotionTags.includes(selectedEmotion)
            return isGif ? matchesEmotion && cat.isGif : matchesEmotion
        })
    }
    return []
}

function getEmotionsArray(cats) {
    const emotionsArray = []
    for (let cat of cats) {
        for (let emotion of cat.emotionTags) {
            if (!emotionsArray.includes(emotion)) {
                emotionsArray.push(emotion)
            }
        }
    }
    return emotionsArray
}

function renderEmotionsRadios(cats) {
    let emotionButtons = ``
    const emotions = getEmotionsArray(cats)
    for (let emotion of emotions) {
        emotionButtons += `
        <button class="emotion-btn" data-emotion="${emotion}">
            ${emotion}
        </button>`
    }
    emotionRadios.innerHTML = emotionButtons

    const allButtons = document.querySelectorAll('.emotion-btn')
    allButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            allButtons.forEach(b => b.classList.remove('selected'))
            btn.classList.add('selected')
        })
    })
}

renderEmotionsRadios(catsData)
