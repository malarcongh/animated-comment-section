// import 

let timestamp = [];

const data = {
    "currentUser": {
      "image": { 
        "png": "./images/avatars/image-maxblagun.png",
        "webp": "./images/avatars/image-maxblagun.webp"
      },
      "username": "juliusomo"
    },
    "comments": [
      {
        "id": '1234567',
        "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        "createdAt": "1 month ago",
        "score": 12,
        "user": {
          "image": { 
            "png": "./images/avatars/image-amyrobson.png",
            "webp": "./images/avatars/image-amyrobson.webp"
          },
          "username": "amyrobson"
        },
        "replies": []
      },
      {
        "id": '111',
        "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        "createdAt": "2 weeks ago",
        "score": 5,
        "user": {
          "image": { 
            "png": "./images/avatars/image-maxblagun.png",
            "webp": "./images/avatars/image-maxblagun.webp"
          },
          "username": "maxblagun"
        },
        "replies": [
          {
            "id": generateRandomId(),
            "content": "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            "createdAt": "1 week ago",
            "score": 4,
            "replyingTo": "maxblagun",
            "user": {
              "image": { 
                "png": "./images/avatars/image-ramsesmiron.png",
                "webp": "./images/avatars/image-ramsesmiron.webp"
              },
              "username": "ramsesmiron"
            }
          },
          {
            "id": generateRandomId(),
            "content": "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            "createdAt": "2 days ago",
            "score": 2,
            "replyingTo": "ramsesmiron",
            "user": {
              "image": { 
                "png": "./images/avatars/image-juliusomo.png",
                "webp": "./images/avatars/image-juliusomo.webp"
              },
              "username": "juliusomo"
            }
          }
        ]
      }
    ]
}




































let itemToDelete;
let replyingTo = null;
const sendForm = document.querySelector('.send-comment form');
const textArea = document.querySelector('.send-comment form textarea');
const commentsContainer = document.querySelector('.comment-wrapper');

sendForm.addEventListener('submit', function(e){

    e.preventDefault();
    if(textArea.value.trim() === '') return;

    // Push new comment
    data.comments.push({
        id: generateRandomId(),
        content: preserveBreakLines(textArea.value),
        createdAt: 'Just now',
        score: 0,
        user: {
            image: {
                png: data.currentUser.image.png,
                webp: data.currentUser.image.webp
            },
            username: data.currentUser.username
        },
        replies: []
    })

    // Render the comment
    renderComment(data.comments.at(-1));

    // Clear textarea
    textArea.value = '';
})


window.addEventListener('click', function({target}){

  // Reply comment
  if(target.closest('.reply')){
    // clicking in a response comment
    if(target.closest('.response-item')){

      const replyItem = target.closest('.response-item');
      const commentItem = target.closest('.comment-wrapper').firstElementChild;
      const repliesContainer = target.closest('.comment-wrapper').querySelector('.comment-item-responses');

      if(replyingTo === commentItem){ // If the comment item that contains the item being replied is the same as the previous one being replied, return;
        const replyingInput = repliesContainer.querySelector('.replying');
        if(replyingInput){ // If the reply input was rendered 
          console.log('here');
          const textArea = replyingInput.querySelector('textarea');
          textArea.value = `@${getUser(replyItem.dataset.id)} `;
          textArea.focus();
        }
        return;
      }

      if(replyingTo) renderDeleteItem(document.querySelector('.replying'));

      replyingTo = commentItem;
      renderReply(commentItem, replyItem.dataset.id);

    }else{ //Clicking in a normal comment
      const commentItem = target.closest('.comment-item');
      const repliesContainer = target.closest('.comment-wrapper').querySelector('.comment-item-responses');

      if(replyingTo === commentItem){ // If the comment item that contains the item being replied is the same as the previous one being replied, return;
        const replyingInput = repliesContainer.querySelector('.replying');
        if(replyingInput){ // If the reply input was rendered 
          console.log('here');
          const textArea = replyingInput.querySelector('textarea');
          textArea.value = `@${getUser(commentItem.dataset.id)} `;
          textArea.focus();
        }
        return;
      }

      if(replyingTo) renderDeleteItem(document.querySelector('.replying'));

      const commentWrapper = target.closest('.comment-wrapper');
      const commentResponses = commentWrapper.querySelector('.comment-item-responses');
      commentResponses.classList.add('not-empty');
      
      replyingTo = commentItem;
      renderReply(commentItem, commentItem.dataset.id);
    }
  }

  //Send the reply
  if(target.closest('.send-reply')){
    finishReply(target.closest('.response-item'));
    // replyingTo = null;
    console.log(data);
  }

  //Delete item
  if(target.closest('.delete')){
    itemToDelete = target.closest('.your-comment');
    document.querySelector('.modal-container').style.display = 'flex';
  }

  if(target.closest('.yes-btn')){
    document.querySelector('.modal-container').style.display = 'none';
    const comment = getComment(itemToDelete.dataset.id);

    // its a reply
    if(itemToDelete.classList.contains('response-item')){
      console.log('reply');
      const commentId = itemToDelete.closest('.comment-wrapper').querySelector('.comment-item').dataset.id;
      const replyId = itemToDelete.dataset.id;
      deleteReply(commentId, replyId);
    }

    // its a comment
    if(itemToDelete.classList.contains('comment-item')){
      console.log('comment');
      const commentId = itemToDelete.dataset.id;
      deleteComment(commentId);
    }

    console.log(data);
    renderDeleteItem(itemToDelete);
  }



  if(target.closest('.no-btn')){
    document.querySelector('.modal-container').style.display = 'none';
  }

  if(target.closest('.edit')){

    const commentItem = target.closest('.your-comment');
    const textContainer = commentItem.querySelector('.comment-text')
    const textItem = commentItem.querySelector('.comment-text p');
    const updateItem = commentItem.querySelector('.update-form');
    

    textContainer.addEventListener('transitionend',function(){
      const oldHeight = textContainer.offsetHeight;
      commentItem.querySelector('.update-text').value = textItem.innerText;
      // textItem.style.display = 'none';
      // updateItem.style.display = 'flex';
      commentItem.classList.add('editing');
      const realHeight = textContainer.offsetHeight;
      textContainer.style.height = `${oldHeight}px`;
      setTimeout(() => {
        textContainer.addEventListener('transitionend', function(){
          textContainer.removeAttribute('style');
        }, {once: true})
        textContainer.style.transition = 'opacity .3s .3s, height .3s';
        textContainer.style.height = `${realHeight}px`;
        textContainer.style.opacity = 1;
      }, 10);
    }, {once: true});
    textContainer.style.transition = 'opacity .3s';
    textContainer.style.opacity = 0;

  }


  //Update comment
  if(target.closest('.update-btn')){
    
    const commentItem = target.closest('.your-comment');
    const updatedText = preserveBreakLines(commentItem.querySelector('.update-text').value);
    const textContainer = commentItem.querySelector('.comment-text')
    const textItem = commentItem.querySelector('.comment-text p');
    let markup = updatedText;

    if(commentItem.classList.contains('response-item')){
      const [username, textContent] = splitText(updatedText);
      markup = `<span style="color:#5457B6;font-weight: 500;">${username}</span> ${textContent}`;
      const commentId = commentItem.closest('.comment-wrapper').querySelector('.comment-item').dataset.id;
      const replyId = commentItem.dataset.id;
      console.log(replyId);
      getReply(commentId, replyId).content = textContent;
    }else{
      const id = commentItem.dataset.id;
      getComment(id).content = updatedText;
    }

    textContainer.style.opacity = 0;


    textContainer.addEventListener('transitionend',function(){
      const oldHeight = textContainer.offsetHeight;
      textItem.innerHTML = markup;
      commentItem.classList.remove('editing');
      const realHeight = textContainer.offsetHeight;
      textContainer.style.height = `${oldHeight}px`;
      setTimeout(() => {
        textContainer.addEventListener('transitionend', function(){
          textContainer.removeAttribute('style');
        }, {once: true})
        textContainer.style.transition = 'opacity .3s .3s, height .3s';
        textContainer.style.height = `${realHeight}px`;
        textContainer.style.opacity = 1;
      }, 10);
    }, {once: true});

    textContainer.style.transition = 'opacity .3s';
    textContainer.style.opacity = 0;
    
    console.log(data);
  }

  if(target.closest('.plus-icon')){

    const item = target.closest('[data-id]');
    const itemId = item.dataset.id;

    const minusIcon = target.closest('.score').querySelector('.minus-icon');
    const plusIcon = target.closest('.plus-icon');

    let acc = 1;
    let finalValue;

    if(!minusIcon.classList.contains('clicked')){
      acc = plusIcon.classList.contains('clicked') ? acc * -1 : acc;
    }else{
      acc = 2;
    }

    plusIcon.classList.toggle('clicked');
    minusIcon.classList.remove('clicked');

    if(item.classList.contains('response-item')){
      const commentId = item.closest('.comment-wrapper').querySelector('.comment-item').dataset.id;
      const reply = getReply(commentId, itemId);
      reply.score += acc;
      finalValue = reply.score;
    }

    if(item.classList.contains('comment-item')){
      const comment = getComment(itemId);
      comment.score += acc;
      finalValue = comment.score;
    }

    const scoreNumber = target.closest('.score').childNodes[1];

    if(!scoreNumber.classList.contains('transitioning')){
      setTimeout(function(){
        scoreNumber.style.transform = 'scale(1) translateZ(0)';
        scoreNumber.classList.remove('transitioning');
        console.log('xd');
      }, 150)
    }
    
    scoreNumber.textContent = finalValue;
    scoreNumber.style.transform = 'scale(1.3) translateZ(0)';

    scoreNumber.classList.add('transitioning');

    timestamp.push(Date.now());

    console.log(timestamp[timestamp.length - 1] - timestamp[timestamp.length - 2]);
  }

  if(target.closest('.minus-icon')){

    const item = target.closest('[data-id]');
    const itemId = item.dataset.id;

    const plusIcon = target.closest('.score').querySelector('.plus-icon');
    const minusIcon = target.closest('.minus-icon');

    let acc = 1;
    let finalValue;

    if(!plusIcon.classList.contains('clicked')){
      acc = minusIcon.classList.contains('clicked') ? acc * -1 : acc;
    }else{
      acc = 2;
    }

    minusIcon.classList.toggle('clicked');
    plusIcon.classList.remove('clicked');

    if(item.classList.contains('response-item')){
      const commentId = item.closest('.comment-wrapper').querySelector('.comment-item').dataset.id;
      const reply = getReply(commentId, itemId);
      reply.score -= acc;
      finalValue = reply.score;
    }

    if(item.classList.contains('comment-item')){
      const comment = getComment(itemId);
      comment.score -= acc;
      finalValue = comment.score;
    }

    const scoreNumber = target.closest('.score').childNodes[1];

    if(!scoreNumber.classList.contains('transitioning')){
      setTimeout(function(){
        scoreNumber.style.transform = 'scale(1) translateZ(0)';
        scoreNumber.classList.remove('transitioning');
        console.log('xd');
      }, 150)
    }
    
    scoreNumber.textContent = finalValue;
    scoreNumber.style.transform = 'scale(1.3) translateZ(0)';
    scoreNumber.classList.add('transitioning');
  }

})

function deleteComment(commentId){
  const index = data.comments.findIndex(comment => comment.id === commentId);
  if(index === -1) return;
  data.comments.splice(index, 1);
}

function deleteReply(commentId, replyId){
  const comment = getComment(commentId);
  const index = comment.replies.findIndex(reply => reply.id === replyId);
  comment.replies.splice(index, 1);
}

function getUser(id){

  let usern;

  for(let i = 0; i < data.comments.length; i++){
    if(data.comments[i].id === id) {
      usern = data.comments[i].user.username;
      break;
    }else{
      for(let j = 0; j < data.comments[i].replies.length; j++){
        if(data.comments[i].replies[j].id === id){
          usern = data.comments[i].replies[j].user.username;
          break;
        }
      }
    }
  }
  // const username = data.comments.find(comment => comment.id === id).user.username;
  return usern;
}

function getReply(commentId, replyId){
  const comment = getComment(commentId);
  const reply = comment.replies.find(reply => reply.id === replyId);
  return reply;
}

function getComment(id){
  const comment = data.comments.find(comment => comment.id === id);
  return comment;
}

function finishReply(replyItem){
  const curHeight = replyItem.offsetHeight;
  const text = preserveBreakLines(replyItem.querySelector('textarea').value);
  const [username, textContent] = splitText(text);

  // Only post reply if the text after the mentioned nickname isnt empty string
  if(textContent.trim() === '') return;

  const repliedComment = getComment(replyingTo.dataset.id);
  repliedComment.replies.push({
    id: replyItem.dataset.id,
    content: textContent,
    createdAt: 'Just now',
    score: 0,
    replyingTo: username,
    user: {...data.currentUser}
  });

  // console.log(repliedComment);

  const markup = `<span style="color:#5457B6;font-weight: 500;">${username}</span> ${textContent}`;

  replyItem.style.transition = 'none';
  replyItem.style.opacity = 0;
  replyItem.classList.remove('replying');
  replyItem.querySelector('.comment-text p').innerHTML = markup;
  const newHeight = replyItem.offsetHeight;
  replyItem.style.height = `${curHeight}px`;

  setTimeout(function(){
    replyItem.addEventListener('transitionend', function(){
      replyItem.removeAttribute('style');
    }, {once: true})
    replyItem.style.transition = 'all .3s';
    replyItem.style.opacity = 1;
    replyItem.style.height = `${newHeight}px`;

  }, 10);

  replyingTo = null;
}

function splitText(text){
  const twoPartsArr = [];
  const splitedTextArr = text.split(' ');
  twoPartsArr.push(splitedTextArr.shift());
  twoPartsArr.push(splitedTextArr.join(' '));
  return twoPartsArr;
}

function renderReply(commentItem, repliedItemId){
  const markup = `
    <div class="response-item your-comment replying" data-id=${generateRandomId()}>
      <div class="header">
          <img src="./images/avatars/image-maxblagun.png" alt="" class="user-avatar">
          <p class="header-text"><span class="username">${data.currentUser.username}</span><span class="you-label">you</span><span class="timestamp">Just now</span></p>
      </div>
      <div class="reply-content"><textarea cols="30" rows="2">@${getUser(repliedItemId)} </textarea></div>
      <div class="comment-text">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam maiores veritatis officia corrupti itaque molestiae.</p>
          <div class="update-form">
              <textarea class="update-text"></textarea>
              <button type="submit" class="update-btn">UPDATE</button>
          </div>
      </div>
      <div class="score"><span class="plus-icon"></span><span class="score-number">0</span><span class="minus-icon"></span></div>
      <div class="reply"><span class="reply-icon"></span>Reply</div>
      <button class="send-reply">REPLY</button>
      <div class="options-wrapper">
          <div class="delete"><span class="delete-icon"></span>Delete</div>
          <div class="edit"><span class="edit-icon"></span>Edit</div>
      </div>
    </div>
  `;

  
  const replyItem = elementFromHtml(markup);
  replyItem.addEventListener('transitionend', function(){
    this.removeAttribute('style');
  }, {once: true});
  const container = commentItem.closest('.comment-wrapper').querySelector('.comment-item-responses');
  animateComment(replyItem, container);
  container.appendChild(replyItem);
  const textArea = replyItem.querySelector('textarea');
  textArea.focus();
  textArea.setSelectionRange(textArea.value.length, textArea.value.length);
}


function renderComment(comment){
  const markup = `
    <div class="comment-wrapper">
      <div class="comment-item your-comment" data-id=${comment.id}>
          <div class="header">
              <img src="${comment.user.image.png}" alt="" class="user-avatar">
              <p class="header-text"><span class="username">${comment.user.username}</span><span class="you-label">you</span><span class="timestamp">${comment.createdAt}</span></p>
          </div>
          <div class="reply-content"><textarea cols="30" rows="2"></textarea></div>
          <div class="comment-text">
              <p>${comment.content}</p>
              <div class="update-form">
                  <textarea class="update-text"></textarea>
                  <button type="submit" class="update-btn">UPDATE</button>
              </div>
          </div>
          <div class="score"><span class="plus-icon"></span><span class="score-number">0</span><span class="minus-icon"></span></div>
          <div class="reply"><span class="reply-icon"></span>Reply</div>
          <button class="send-reply">REPLY</button>
          <div class="options-wrapper">
              <div class="delete"><span class="delete-icon"></span>Delete</div>
              <div class="edit"><span class="edit-icon"></span>Edit</div>
          </div>
      </div>
      <div class="comment-item-responses">
      </div>
    </div>
  `;

  const commentContainer = document.querySelector('.all-comments');
  const commentItemWrapper = elementFromHtml(markup);
  console.log(commentItemWrapper);
  const commentItem = commentItemWrapper.querySelector('.comment-item');
  // commentItem.dataset.id = generateRandomId();
  commentItem.addEventListener('transitionend', function(){
    this.removeAttribute('style');
  }, {once: true});

  const observer = new MutationObserver(entries => {
    // Remove the transitions so the element disappears instantly when it gets rendered.
    commentItem.style.transition = 'none';
    const realHeight = commentItem.offsetHeight;
    commentItem.style.height = '0px';
    commentItem.style.padding = '0';
    commentItem.style.opacity= 0;
    setTimeout(() => {
      // Wait 0.01s for the previous styles to be applied (requestAnimationFrame is not working for me to wait for the next frame).
      commentItem.style.transition = 'all .3s';
      commentItem.style.height = `${realHeight}px`;
      commentItem.style.opacity = 1;
      commentItem.style.padding = '1.5rem'; // Pending to use the right padding based on the viweport width (1rem or 1.5rem);
      setTimeout(() => {
        // Scroll to the end of the document.
        window.scroll({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }, 20);
    }, 10);
    observer.disconnect();
  });

  // Observe the element to be in the DOM.
  observer.observe(commentContainer, {childList: true});

  // Insert the element in the DOM.
  commentContainer.appendChild(commentItemWrapper);
  
}

function elementFromHtml(markup){
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

function renderDeleteItem(itemToDelete){

  const commentResponses = itemToDelete.closest('.comment-item-responses');
  let commentWrapper = itemToDelete;
  let marginTop = '-1rem';

  // if the last reply is deleted 
  if(commentResponses && commentResponses.children.length === 1){
    commentResponses.classList.remove('not-empty');
    marginTop = '0';
  }

  // If im clicking in a normal comment 
  if(!commentResponses){
    commentWrapper = itemToDelete.closest('.comment-wrapper');
  }

  itemToDelete.addEventListener('transitionend', function(){
    commentWrapper.remove();
  }, {once: true});

  const realHeight = itemToDelete.offsetHeight;
  itemToDelete.style.height = `${realHeight}px`;

  setTimeout(() => {
    itemToDelete.style.padding = `0px`;
    itemToDelete.style.opacity = 0;
    itemToDelete.style.height = `0px`;
    commentWrapper.style.marginTop = marginTop;
  }, 10)
}

function preserveBreakLines(string){
  return string.replace(/[\r\n]+/g, '<br>');
}

function generateRandomId(){
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for(let i = 0; i < 10; i++){
    id += chars[Math.floor(Math.random() * (chars.length + 1))];
  }
  return  id;
}

function animateComment(commentItem, commentContainer){
  const observer = new MutationObserver(entries => {
    // Remove the transitions so the element disappears intanstly when it gets rendered.
    commentItem.style.transition = 'none';
    const realHeight = commentItem.offsetHeight;
    commentItem.style.height = '0px';
    commentItem.style.padding = '0';
    commentItem.style.opacity= 0;
    setTimeout(() => {
      // Wait 0.01s for the previous styles to be applied (requestAnimationFrame is not working for me to wait to the next frame).
      commentItem.style.transition = 'all .3s';
      commentItem.style.height = `${realHeight}px`;
      commentItem.style.opacity = 1;
      commentItem.style.padding = '1.5rem'; // Pending to use the right padding based on the viweport width (1rem or 1.5rem);

      // console.log(commentItem);
      // console.log(commentItem.clientTop);

      commentItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 10);
    observer.disconnect();
  });

  // Observe the element to be in the DOM.
  observer.observe(commentContainer, {childList: true});
}


function renderData(){

  const markup = data.comments.map(comment => {
    return `
      <div class="comment-wrapper">
        <div class="comment-item" data-id="${comment.id}">
            <div class="header">
                <img src="${comment.user.image.png}" alt="" class="user-avatar">
                <p class="header-text"><span class="username">${comment.user.username}</span><span class="you-label">you</span><span class="timestamp">${comment.createdAt}</span></p>
            </div>
            <div class="reply-content"><textarea cols="30" rows="2"></textarea></div>
            <div class="comment-text">
                <p>${comment.content}</p>
                <div class="update-form">
                    <textarea class="update-text"></textarea>
                    <button type="submit" class="update-btn">UPDATE</button>
                </div>
            </div>
            <div class="score"><span class="plus-icon"></span><span class="score-number">${comment.score}</span><span class="minus-icon"></span></div>
            <div class="reply"><span class="reply-icon"></span>Reply</div>
            <button class="send-reply">REPLY</button>
            <div class="options-wrapper">
                <div class="delete"><span class="delete-icon"></span>Delete</div>
                <div class="edit"><span class="edit-icon"></span>Edit</div>
            </div>
        </div>
        <div class="comment-item-responses ${comment.replies.length > 1 ? 'not-empty': ''}">${comment.replies.map(reply => {
          return `
            <div class="response-item" data-id=${reply.id}>
              <div class="header">
                  <img src="${reply.user.image.png}" alt="" class="user-avatar">
                  <p class="header-text"><span class="username">${reply.user.username}</span><span class="you-label">you</span><span class="timestamp">${reply.createdAt}</span></p>
              </div>
              <div class="reply-content"><textarea cols="30" rows="2"></textarea></div> 
              <div class="comment-text">
                  <p><span style="color:#5457B6;font-weight: 500;">@${reply.replyingTo}</span> ${reply.content}</p>
                  <div class="update-form">
                      <textarea class="update-text"></textarea>
                      <button type="submit" class="update-btn">UPDATE</button>
                  </div>
              </div>
              <div class="score"><span class="plus-icon"></span><span class="score-number">${reply.score}</span><span class="minus-icon"></span></div>
              <div class="reply"><span class="reply-icon"></span>Reply</div>
              <button class="send-reply">REPLY</button>
              <div class="options-wrapper">
                  <div class="delete"><span class="delete-icon"></span>Delete</div>
                  <div class="edit"><span class="edit-icon"></span>Edit</div>
              </div>
            </div>
          `;
        }).join('')}</div>
      </div>
    `;
  }).join('');

  document.querySelector('.all-comments').insertAdjacentHTML('afterbegin', markup);
}

function renderSendForm(){
  document.querySelector('.this-avatar').src = data.currentUser.image.png;
}

function init(){
  renderData();
  renderSendForm();
}

init();
