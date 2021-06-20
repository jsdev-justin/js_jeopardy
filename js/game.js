var gameArea= document.querySelector(".game-area")
var gameBoard = document.querySelector(".gameboard");
var questionsLeftDOM = document.querySelector(".questions-left")
var questionsAnsweredDOM = document.querySelector(".questions-answered")
var correctDOM = document.querySelector(".correct")
var wrongDOM = document.querySelector(".wrong")
var scoreDOM = document.querySelector(".score")
var toggleSwitch = document.querySelector("input[type='checkbox']");
var difficultyDOM = document.querySelector(".difficulty")

var questionsLeft = 0;
var questionsAnswered = 0;
var correct = 0;
var wrong = 0;
var score = 0;
var gameIsHard = false;

var timerInt



toggleSwitch.oninput=()=>{
    gameIsHard = !gameIsHard
    difficultyDOM.innerHTML = gameIsHard ? "<span style='color:red'>Hard</span>" : "<span style='color:white'>Easy</span>"
}




//fetch our junk words
let randomWords = [];
fetch(`https://random-word-api.herokuapp.com/word?number=75`)
.then(res=>res.json())
.then(res=>{
    // console.log(res)
    randomWords = res;
})

getAllData().then(data=>{
    console.log("Data",data)
    renderGameBoard(data)
    populateRow(data)
})


function populateRow(data){
    data.forEach(d=>{
        questionsLeft+= d.data.length;
    })

    questionsLeftDOM.innerHTML = questionsLeft;
    scoreDOM.innerHTML = score
    correctDOM.innerHTML = correct
    wrongDOM.innerHTML = wrong

}


function renderGameBoard(data){
    data.forEach((c,index)=>{
        let columnDiv = document.createElement("div");
            columnDiv.className="category-column"
            let html = ""
                html = `<div class='tile category-tile'><h5>${c.category}<h5></div>`
        // console.log(c.data)
        c.data.forEach((q,idx)=>{
                html += `<div data-x=${index} data-y=${idx} data-value=${q.value} class='tile question-tile'><h5 style="pointer-events:none">${q.value}<h5></div>`
  
        })
        columnDiv.innerHTML = html;
        gameBoard.appendChild(columnDiv)
     

    })

    document.querySelectorAll(".question-tile").forEach(q=>{
        q.onclick=(e)=>{
            if(e.target.style.background === "red")return;
            displayQuestion(e,data)
    }
})
}





function displayQuestion(e,data){

    console.log(e.target)
    let x = e.target.dataset.x
    let y = e.target.dataset.y
    let pointsForQuestion = e.target.dataset.value;
    
    console.log(x,y)
    
    if(gameArea.children.length > 1){
        clearInterval(timerInt)
        gameArea.removeChild(document.querySelector('.question-card'))
    }
    var eRef = e.target


    if(gameIsHard){
    createInputGameCard(data[x].data[y].question,data[x].data[y].answer,eRef,pointsForQuestion)
    }
    else{
    createRadioSelectGameCard(data[x].data[y].question,data[x].data[y].answer,eRef,pointsForQuestion)
    }

}


 function createRadioSelectGameCard(question,answer,eRef,pointsForQuestion){
    var gameCard = document.createElement("div");
    gameCard.className='question-card radio-card'
    var html = "<div class='text-center'>Timer:<span class='timer ml-5'></span>"
        html += `<h3 class='h3-question'>${question}</h3>`

    let ourWords = randomArr()
        ourWords.push(answer);
        ourWords = ourWords.sort(()=>Math.random() - .5);
        html += '<div style="display:grid;grid-template-columns:repeat(2,1fr)">'
    ourWords.forEach((w,idx)=>{
        // if(idx ===2) html += "<br>"
        html += `<label>${w[0].toUpperCase() + w.split("").slice(1,w.length).join("")}</label><input type='radio' name='question' value=${w}>`
    })

    html += `<button class='radio-answer-btn'>Answer</button></div>`

    gameCard.innerHTML = html;

    gameArea.appendChild(gameCard)
    startTimer(answer,eRef,pointsForQuestion)
  


    document.querySelector(".radio-answer-btn").onclick=()=>checkRadioAnswer(answer,eRef,pointsForQuestion)
    
  
}



function checkRadioAnswer(answer,eRef,pointsForQuestion){
    if(!document.querySelector("input[type='radio']:checked"))return alert("Need to check a box you dummy!")
    clearInterval(timerInt)

    let playerAnswer = document.querySelector("input[type='radio']:checked").value
    checkAnswer(answer,playerAnswer,pointsForQuestion,eRef)
}




 function randomArr(){
        let randomArr = [];
        let isNew = false;
        console.log(randomWords)
    for(let i =0;i<3;i++){
        isNew = false;
        while(!isNew){
        let number = Math.random() * randomWords.length | 0
        if(randomArr.indexOf(randomWords[number]) === -1){
            randomArr.push(randomWords[number])
            isNew = true;
        }

    }

}

        return randomArr


    

}



function createInputGameCard(question,answer,eRef,pointsForQuestion){
    var gameCard = document.createElement("div");
    gameCard.className='question-card'

    gameCard.innerHTML = `<div class='text-center'>Timer:<span class='timer ml-5'></span><h3 class='h3-question'>${question}</h3><h4 class='answerh4' style='opacity:0'>Answer: <span class='text-red ml-5'>${answer}</span></h4><h4 class='players-answer'></h4><div class='answer-div'><label for="answer">Answer:</label><input type='text' name='answer' id='answer' placeholder='your answer...'><button class='answer-btn'>Enter</div></div>`

   gameArea.appendChild(gameCard)
   startTimer(answer,eRef,pointsForQuestion)


   document.querySelector(".answer-btn").onclick=(e)=>compareAnswer(e,pointsForQuestion,eRef)

}


function compareAnswer(e,points,eRef){
    clearInterval(timerInt)

    document.querySelector(".answerh4").style.opacity = 1;
var answer = document.querySelector(".answerh4").textContent.split(":")[1];
var playerAnswer= document.querySelector("input[name='answer']").value;
    document.querySelector("input[name='answer']").innerHTML = ""


    document.querySelector(".players-answer").innerHTML = playerAnswer
    answer = answer.split(" ").map(w=>w.toLowerCase())
    playerAnswer = playerAnswer.split(" ").map(w=>w.toLowerCase())
    playerAnswer = playerAnswer.join(" ")

    checkAnswer(answer,playerAnswer,points,eRef)


    // setTimeout(()=>{
    //     gameArea.removeChild(document.querySelector('.question-card'))

    // },1250)
}



function checkAnswer(answer,playerAnswer,points,eRef){
    document.querySelector(".timer").innerHTML = ""
    gameArea.removeChild(document.querySelector('.question-card'))

    let verdict = ''
    console.log(eRef)
    if(playerAnswer === ""){
        verdict = false;
        toggleRow(verdict)
        console.log(":(")
        eRef.style.backgroundColor='red'
        eRef.innerHTML = "<i class='fas fa-times'></i>"
        return;
    }
    playerAnswer.split(" ").forEach(w=>{
        if(answer.indexOf(w) !== -1){
            console.log("player got it right!!!")
            score+= parseInt(points);
            scoreDOM.innerHTML = score;
            verdict = true;
            toggleRow(verdict)

            eRef.style.backgroundColor='green'
            eRef.innerHTML = "<i class='fas fa-check'></i>"
            return;
        }
        else{
            verdict = false;
            toggleRow(verdict)
            console.log(":(")
            eRef.style.backgroundColor='red'
            eRef.innerHTML = "<i class='fas fa-times'></i>"

        }
    })
}


function toggleRow(verdict){
    questionsLeft--;
    questionsAnswered++;
    verdict ? correct++ : wrong++;

    questionsLeftDOM.innerHTML = questionsLeft;
    questionsAnsweredDOM.innerHTML = questionsAnswered;
    correctDOM.innerHTML = correct;
    wrongDOM.innerHTML = wrong;

    if(questionsLeft === 0){
        gameOver()
    }
}


function gameOver(){
    var gameCard = document.createElement("div");
    gameCard.className='question-card'
    fetch(`https://api.giphy.com/v1/gifs/search?q=thats%20all%20folks&api_key=nTv0EGtd08JY2KbjlEnIZwVsFolXRS2C`)
    .then(res=>res.json())
    .then(res=>{
    console.log(res)

 

    gameCard.innerHTML =`<h1>Game Over!</h1><h4>Your Score:${score}</h4><img src=${res.data[Math.random() * res.data.length | 0].images.fixed_height.url} style='height:100px'>`

    gameArea.appendChild(gameCard)
    })
}








function startTimer(answer,points,eRef){
    let counter = 25

    timerInt = setInterval(()=>{
        counter--

        document.querySelector(".timer").innerHTML = counter;
        if(counter < 5){
            document.querySelector(".timer").classList.add('text-red')
        }

        if(counter === -1){
        document.querySelector(".timer").classList.remove('text-red')
               checkAnswer(answer,"",eRef,points)
              clearInterval(timerInt)
        }

    },1000)

    
}

