import React from 'react';

import Comment from './comment';

import './comments.css';


const Comments=props=>{
    
    

    
    return(
        
        <React.Fragment>
        
            <button onClick={props.setOpenComments} className="comment_button">Close comments</button>

            <ul>
            {props.comments.map(comment=>{

             return(

                <Comment key={comment.id} comment={comment.comment} id={comment.id} date={comment.posted} postedBy={comment.commentBy} creatorId={comment.creator} deleteHandler={props.deleteHandler} image={comment.image}/>

             );
            })}

            </ul>

        </React.Fragment>
    
    );
}

export default Comments;