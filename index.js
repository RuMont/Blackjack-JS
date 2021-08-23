let currentHand = document.getElementById('currentHand')
let total = document.getElementById('total')
let startBtn = document.getElementById('startBtn')
let cardBtn = document.getElementById('cardBtn')
let abandonBtn = document.getElementById('abandonBtn')
let infoDiv = document.getElementById('info')
let imagesDiv = document.getElementById('images')
let popUpDiv = document.getElementById('popUp')

let cardsArray = ['clubs-2', 'clubs-3', 'clubs-4', 'clubs-5', 'clubs-6', 'clubs-7', 'clubs-8', 'clubs-9', 'clubs-10', 'clubs-A', 'clubs-J', 'clubs-K', 'clubs-Q',
    'diamonds-2', 'diamonds-3', 'diamonds-4', 'diamonds-5', 'diamonds-6', 'diamonds-7', 'diamonds-8', 'diamonds-9', 'diamonds-10', 'diamonds-A', 'diamonds-J', 'diamonds-K', 'diamonds-Q',
    'hearts-2', 'hearts-3', 'hearts-4', 'hearts-5', 'hearts-6', 'hearts-7', 'hearts-8', 'hearts-9', 'hearts-10', 'hearts-A', 'hearts-J', 'hearts-K', 'hearts-Q',
    'spades-2', 'spades-3', 'spades-4', 'spades-5', 'spades-6', 'spades-7', 'spades-8', 'spades-9', 'spades-10', 'spades-A', 'spades-J', 'spades-K', 'spades-Q'
]

class Card {
    constructor($name, $suit, $number, $value) {
        this.name = $name
        this.suit = $suit
        this.number = $number
        this.value = $value
    }

    getName() { return this.name }

    getSuit() { return this.suit }

    getNumber() { return this.number }

    getValue() { return this.value }

    setName($name) { this.name = $name }

    setSuit($suit) { this.suit = $suit }

    setNumber($number) { this.number = $number }

    setValue($value) { this.value = $value }
}

//Generating array of objects from cardsArray (array of Strings)
let cards = []
for (i = 0; i < cardsArray.length; i++) {
    let suitAndNumber = cardsArray[i].split('-',)
    let value = suitAndNumber[1]
    if (value == 'K' || value == 'Q' || value == 'J') {
        value = 10
    } if (value == 'A') {
        value = undefined
    }
    cards.push(new Card(cardsArray[i], suitAndNumber[0], suitAndNumber[1], +value))
}

//Copying the array to be able to remove elements from this array
let cardsCopy = cards.map((x) => x)

let hand = []
let handValue = 0

function getImagePath(card) {
    let suit = card.suit.charAt(0).toUpperCase() + card.suit.slice(1)
    return `img/Cards/${suit}/${card.number}.png`
}

function isAnACard(index) {
    let val = index
    cardBtn.style.visibility = 'hidden'
    popUpDiv.style.visibility = 'visible'
    document.querySelectorAll('#popUpBtns > *').forEach(btn => {
        btn.onclick = (ev) => {
            if (ev.target.id == 'value1') {
                hand[val].value = 1
                handValue += hand[val].value
                popUpDiv.style.visibility = 'hidden'
                cardBtn.style.visibility = 'visible'
                total.textContent = `Total: ${handValue}`
                didUserWin()
            } else if (ev.target.id == 'value11') {
                hand[val].value = 11
                handValue += hand[val].value
                popUpDiv.style.visibility = 'hidden'
                cardBtn.style.visibility = 'visible'
                total.textContent = `Total: ${handValue}`
                didUserWin()
            }
        }
    })
}

function start() {
    startBtn.style.display = 'none'
    cardBtn.style.display = 'inline'
    abandonBtn.style.display = 'inline'

    //Generating 2 random cards to start with
    for (i = 0; i < 2; i++) {
        let index = Math.floor(Math.random() * (cardsCopy.length - 0)) + 0
        hand.push(cardsCopy[index])
        cardsCopy.splice(index, 1)
    }
    infoDiv.style.visibility = 'visible'
    currentHand.textContent = `Your current hand is: ${hand[0].name}, ${hand[1].name}`

    //Summing every card number
    for (j = 0; j < hand.length; j++) {
        if (isNaN(hand[j].value)) {
            isAnACard(j)
        } else {
            handValue += hand[j].value
        }
        total.textContent = `Total: ${handValue}`
    }

    //Generating images according to the cards
    for (i = 0; i < hand.length; i++) {
        let newImage = document.createElement('img')
        newImage.src = getImagePath(hand[i])
        imagesDiv.appendChild(newImage)
    }

}

async function didUserWin() {
    if (handValue == 21) {
        currentHand.style.color = 'green'
        currentHand.textContent = 'You won!'
        cardBtn.style.display = 'none'
        abandonBtn.style.display = 'none'
        await new Promise(r => setTimeout(r, 1000));
        location.reload()
    } else if (handValue > 21) {
        currentHand.style.color = 'red'
        currentHand.textContent = 'You lose!'
        cardBtn.style.display = 'none'
        abandonBtn.style.display = 'none'
        await new Promise(r => setTimeout(r, 1000));
        location.reload()
    }
}

let cardsOnField = 2

function takeOne() {
    //Generating a random card
    let index = Math.floor(Math.random() * (cardsCopy.length - 0)) + 0
    hand.push(cardsCopy[index])
    cardsCopy.splice(index, 1)

    //Summing every card number
    if (isNaN(hand[hand.length - 1].value)) {
        isAnACard(hand.length - 1)
    } else {
        handValue += hand[hand.length - 1].value
    }

    //Generating images according to the cards
    let newImage = document.createElement('img')
    newImage.src = getImagePath(hand[hand.length - 1])
    imagesDiv.appendChild(newImage)
    cardsOnField++
    imagesDiv.style.transform = `scale(${1 - ((cardsOnField * 6) / 100)})`


    //Updating texts
    total.textContent = `Total: ${handValue}`
    if (cardsOnField < 7) {
        currentHand.textContent = currentHand.textContent + `, ${hand[hand.length - 1].name}`
    } else {
        currentHand.textContent = ''
    }

    didUserWin()
}

async function abandon() {
    currentHand.style.color = 'red'
    currentHand.textContent = 'You are a coward'
    total.textContent = ''
    cardBtn.style.display = 'none'
    abandonBtn.style.display = 'none'
    await new Promise(r => setTimeout(r, 1000));
    location.reload()
}