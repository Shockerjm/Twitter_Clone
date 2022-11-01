import { tweetsData, setTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const parseFeedObj = JSON.parse(localStorage.getItem("savedTweets"))
console.log(parseFeedObj)

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.dataset.newreply){
        handleNewReplyClick(e.target.dataset.newreply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'reply-btn') {
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleNewReplyClick(tweetId){
    document.getElementById(`reply-${tweetId}`).classList.toggle('hidden')
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(replyBtn) {
    const replyInput = document.getElementById(`reply-input-${replyBtn}`)
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === replyBtn
    })[0]
    
    if(replyInput.value){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value
        },)
    render()
    }
    replyInput.value = ''
}

function getFeedHtml(){
    let feedHtml = ''
    
    if(parseFeedObj != null) {
       setTweetsData(parseFeedObj)
    }
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-replies">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply"
                    data-newReply="${tweet.uuid}"
                    ></i>
                </span>
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>
        </div>           
    </div>
    <div class="tweet-reply hidden" id="reply-${tweet.uuid}">
                <div class="tweet-input-area">
                    <img src="images/scrimbalogo.png" class="profile-pic">
                    <textarea placeholder="Reply..." id="reply-input-${tweet.uuid}"></textarea>
                </div>   
                <button id="reply-btn" data-replyBtn="${tweet.uuid}">Reply</button>
            </div> 
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   const jsonFeedObj = JSON.stringify(tweetsData)
   localStorage.setItem("savedTweets", jsonFeedObj)
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

