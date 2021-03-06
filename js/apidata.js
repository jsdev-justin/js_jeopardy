
async function getIds(){

var categoryIds = [];

let json = await fetch(`https://jservice.io/api/categories?count=50`)
let data = await json.json()
    categoryIds = data.map(({id})=>({id}))
    // console.log(categoryIds)
    return categoryIds;
}

 function getAllData(){
    return new Promise(async(resolve)=>{
    let ourData=[];
    let isFinished = false;
    let ourCategoryIds = await getIds()

    console.log(ourCategoryIds)

    for(let i=1;i<=6;i++){
        fetch(`https://jservice.io/api/clues?category=${ourCategoryIds[Math.random() * ourCategoryIds.length | 0].id}`)
        .then(data=>data.json())
        .then(data=>{
            data = data.slice(0,8)
            data = data.filter(d=>d.question !== "")
        let category = data[0].category.title
            data = data.map(({question,answer,value})=>({question,answer,value:value === null ? ((Math.random() * 5 | 0 + 1) * 100) : value}))
            ourData.push({category,data})

        if(i > 5){
            console.log("FINISH HIM!")
            isFinished = true;
        }
        if(isFinished){
            console.log('DATA',ourData)
            let minimum = 10
            ourData.forEach(d=>{
                if (d.data.length < minimum){
                    minimum = d.data.length;
                }
            })
            console.log("MINIMUM:",minimum)
            for(let i=0;i<ourData.length;i++){
                ourData[i].data = ourData[i].data.slice(0,minimum)
            }
            //cleanup text back into string
             ourData.map(data=>{
                data.data.map(q=>{
                    var span = document.createElement("span");
                        span.innerHTML = q.answer;
                        q.answer = span.textContent;
                })
            })
            console.log(ourData)
            resolve(ourData)
            }
    })
 }



   
})
    
}


getAllData()