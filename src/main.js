import "./css/index.css"
import IMask from "imask"

let ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
let ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
let logoCard = document.querySelector(".cc-logo .logocard")

function setTypeCard(type){
    const colors = {
        visa: ["#2D57F2", "#436D99"],
        mastercard:["#C69347", "#DF6F29"],
        def:["black", "gray"]
    }
    ccBgColor1.setAttribute('fill', colors[type][0])
    ccBgColor2.setAttribute("fill", colors[type][1])
    logoCard.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setTypeCard = setTypeCard

// Security code

const cvcCode = document.querySelector("#security-code")
const cvcCodePattern = {
    mask: "0000",
}

const cvcCodeMasked = IMask(cvcCode, cvcCodePattern)

// Expiration date

const expDate = document.querySelector("#expiration-date")
const expDatePattern = {
    mask: 'MM{/}YY',
    blocks:{
        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear()+10).slice(2),
        },
    },
}

const expDateMasked = IMask(expDate, expDatePattern)

// Number off card
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[2-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        console.log(foundMask)
        return foundMask
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Evento de adcionar o cartão e parar de recarregar página quando adcionado

const addCard = document.querySelector("#add-card")

addCard.addEventListener("click", ()=>{
    alert('Cartão adicionado!')
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

//  Pegando o nome do titular do cartão

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")
    ccHolder.innerHTML = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

// pegando o código CVC do cartão

cvcCodeMasked.on("accept", () => {
    updateCvcCode(cvcCodeMasked.value)
})

function updateCvcCode(code){
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerHTML = code.length === 0 ? "1234" : code
}

// pegando o nome do titular

cardNumberMasked.on('accept', () => {
    const cardtype = cardNumberMasked.masked.currentMask.cardtype
    setTypeCard(cardtype)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber (number){
    const ccNumber = document.querySelector(".cc-number .value")
    ccNumber.innerHTML = number.length === 0 ? "1234 5678 9012 3456" : number
}

// pegando expiração do cartão

expDateMasked.on("accept", () => {
    updateExpirationDate(expDateMasked.value)
    
})

function updateExpirationDate (date){
    const expirationDate = document.querySelector(".cc-expiration .value")
    expirationDate.innerHTML = date.length === 0 ? "02/32" : date
}


