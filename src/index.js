document.addEventListener("DOMContentLoaded", () =>{
    getAllQuotes()


    const quoteList = document.querySelector('#quote-list')
    const newQuoteForm = document.querySelector('#new-quote-form')
    newQuoteForm.addEventListener("submit", gatherFormData)
    quoteList.addEventListener('click', handleClickEvent)
    
    

    function getAllQuotes(){
        fetch("http://localhost:3000/quotes?_embed=likes")
            .then (r => r.json())
            .then(addQuotesToDom)
    }
    function addQuotesToDom(allQuotes){
        allQuotes.forEach(quote => { 
            quoteList.innerHTML += `
        <li class='quote-card'>
        <blockquote class="blockquote" data-id=${quote.id}>
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span class='likes-span'>${quote.likes.length}</span></button>
          <button  class='btn-danger'>Delete</button>
        </blockquote>
      </li>
        `
        })
    }
    function gatherFormData(e){
        e.preventDefault()
        const author = e.target.author.value
        const quote = e.target.quote.value
        const quoteObj = {quote, author}
        
        createQuote(quoteObj)
    }
    function createQuote(quoteObj){
        fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(quoteObj)
        })
        .then(r => r.json())
        .then(addSingleQuoteToDom)
    }
    function addSingleQuoteToDom(singleQuote){
    quoteList.innerHTML += `
    <li class='quote-card'>
    <blockquote class="blockquote" data-id=${singleQuote.id}>
      <p class="mb-0">${singleQuote.quote}</p>
      <footer class="blockquote-footer">${singleQuote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span class='likes-span'>${0}</span></button>
      <button  class='btn-danger'>Delete</button>
    </blockquote>
  </li>
    `
    }
    function handleClickEvent(e){
        
        if (e.target.className === "btn-danger"){
            getIdToDeleteQuote(e)
        }else if (e.target.className === "btn-success"){
            getIdToLikeQuote(e)
            console.log(e)
        }


    }
    function deleteQuote(quoteId){
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: "DELETE",
            headers:{'Content-Type': 'application/json'}
            })
            
    }
    function getIdToDeleteQuote(e){
        const quoteId = parseInt(e.target.parentElement.dataset.id)
            deleteQuote(quoteId)
            e.target.parentElement.parentElement.remove()
    }
    function getIdToLikeQuote(e){
        const quoteId = parseInt(e.target.parentElement.dataset.id)
        likeObj = {quoteId: quoteId}
        increaseLikes(e)
        createLike(likeObj)
    }
    function createLike(quoteId){
        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(quoteId)
            })
        }
    function increaseLikes(e){
        let currentLikes = parseInt(e.target.querySelector(".likes-span").innerText)
        currentLikes++
        e.target.querySelector(".likes-span").innerText = currentLikes
}
})