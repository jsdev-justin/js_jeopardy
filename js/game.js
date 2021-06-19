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


toggleSwitch.oninput=()=>{
    gameIsHard = !gameIsHard
    difficultyDOM.innerHTML = gameIsHard ? "<span style='color:red'>Hard</span>" : "<span style='color:green'>Easy</span>"
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
    var html = ""
    html = `<h3 class='h3-question'>${question}</h3>`

    let ourWords = randomArr()
        ourWords.push(answer);
        ourWords = ourWords.sort(()=>Math.random() - .5);
        html += '<div class="flex">'
    ourWords.forEach((w,idx)=>{
        if(idx ===2) html += "<br>"
        html += `<label>${w}</label><input type='radio' name='question' value=${w}>`
    })

    html += `</div><button class='radio-answer-btn'>Answer</button>`

    gameCard.innerHTML = html;

    gameArea.appendChild(gameCard)


    document.querySelector(".radio-answer-btn").onclick=()=>checkRadioAnswer(answer,eRef,pointsForQuestion)
    
  
}



function checkRadioAnswer(answer,eRef,pointsForQuestions){

    let playerAnswer = document.querySelector("input[type='radio']:checked").value
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
    gameCard.innerHTML = `<h3 class='h3-question'>${question}</h3><h4 class='answerh4' style='opacity:0'>Answer: <span class='text-red ml-5'>${answer}</span></h4><h4 class='players-answer'></h4><div class='answer-div'><label for="answer">Answer:</label><input type='text' name='answer' id='answer' placeholder='your answer...'><button class='answer-btn'>Enter</div>`

   gameArea.appendChild(gameCard)


   document.querySelector(".answer-btn").onclick=(e)=>compareAnswer(e,pointsForQuestion,eRef)
}


function compareAnswer(e,points,eRef){
    document.querySelector(".answerh4").style.opacity = 1;
var answer = document.querySelector(".answerh4").textContent.split(":")[1];
var playerAnswer= document.querySelector("input[name='answer']").value;
    document.querySelector("input[name='answer']").innerHTML = ""


    document.querySelector(".players-answer").innerHTML = playerAnswer
    answer = answer.split(" ").map(w=>w.toLowerCase())
    playerAnswer = playerAnswer.split(" ").map(w=>w.toLowerCase())
    playerAnswer = playerAnswer.join(" ")

    checkAnswer(answer,playerAnswer,points,eRef)


    setTimeout(()=>{
        gameArea.removeChild(document.querySelector('.question-card'))

    },1250)
}



function checkAnswer(answer,playerAnswer,points,eRef){
    let verdict = ''
    console.log(eRef)
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
}