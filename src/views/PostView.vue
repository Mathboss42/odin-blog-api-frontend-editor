<script setup>
import { onMounted, ref } from 'vue';
import { useEditorStore } from '../stores/editor';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();

const store = useEditorStore();

const post = ref();
const comments = ref();

const token = ref(localStorage.getItem('token'));

const props = defineProps({
    id: String
})

const loading = ref(true);

onMounted(async function() {
    console.log(props.id);
    try {
        const postData = await axios.post(`http://localhost:8092/api/posts/${props.id}`, {}, {
            headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
            // .then(function (response) {
            //     if (!response.ok) {
            //         throw new Error("Not 2xx response", {cause: response});
            //     } else {
            //         return response;
            //     }
            // }).catch(function(err) {
            //     console.log(err);
            // });
        const postResult = postData.data.post;
        post.value = postResult;  
        
        fetchComments();
        
        loading.value = false;
    } catch (err) {
        console.log(err);
        post.value = 'posts couldnt be fetched';
    }
});

async function fetchComments() {
    let commentData;

    if (store.isLoggedIn) {
        commentData = await axios.post(`http://localhost:8092/api/posts/${props.id}/comments`, {}, { 
            headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
    } else {
        commentData = await axios.get(`http://localhost:8092/api/posts/${props.id}/comments`, {}, { 
            headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
    }
    
    const commentResult = commentData.data.comments;
    comments.value = commentResult;  

    for (let comment of comments.value) {
        comment.isEditing = false;
    }

    console.log(comments.value);
}


async function handleNewComment(e) {
    // e.preventDefault();
    const form = document.getElementById('theform');
    const data = new FormData(form);
    let values = [];
    // eslint-disable-next-line no-unused-vars
    for (const [name, value] of data) {
        values.push(value);
    }

    const newData = {
        text: values[0],
        post: values[1]
    };

    console.log(newData);

    const response = await postData(newData);
    console.log('response', response);
}

async function postData(data) {
    const response = await fetch('http://localhost:8092/api/comments/new', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            "Authorization": `Bearer ${token.value}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    const result = await response.json();
    return result;
}

function toggleEdit(e, comment) {
    comment.isEditing = !comment.isEditing;
}

async function handleCommentUpdate(e, comment) {
    // e.preventDefault();
    const form = document.getElementById('updateform');
    const data = new FormData(form);
    let values = [];
    // eslint-disable-next-line no-unused-vars
    for (const [name, value] of data) {
        values.push(value);
    }

    const newData = {
        text: values[0],
        post: values[1]
    };

    const response = await axios.put(`http://localhost:8092/api/comments/${comment._id}`, newData, { 
        headers: { 
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
    });
}

async function handleCommentDelete(e, comment) {
    try {
        const response = await axios.delete(`http://localhost:8092/api/comments/${comment._id}`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })

        fetchComments();
    } catch (err) {
        console.log(err);
    }
}

async function handlePostUpdate(e) {
    e.preventDefault();
    try {
        const form = document.getElementById('postupdateform');
        const data = new FormData(form);
        let values = [];
        // eslint-disable-next-line no-unused-vars
        for (const [name, value] of data) {
            values.push(value);
        }

        const newData = {
            title: values[0],
            text: values[1],
            status: values[2]
        };

        const response = await axios.put(`http://localhost:8092/api/posts/${props.id}`, newData, { 
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
    } catch (err) {
        console.log(err);
    }
}
</script>

<template>
  <main>
    <div v-if="loading">
        <p>Loading...</p>
    </div>
    <div v-else>
        <form :onsubmit="handlePostUpdate" id="postupdateform">
            <div>
                <label for="title">Title: </label>
                <input type="text" name="title" id="title" :value="post.title">
            </div>
            <div>
                <label for="text">Content: </label>
                <textarea type="text" name="text" id="text" cols="100" rows="10" :value="post.text"></textarea>
            </div>
            <div>
                <label for="status">Published</label>
                <input type="checkbox" name="status" id="status" :checked="post.status === 'published'">
            </div>
            <button>Update Post</button>
        </form>
        <p>-Written by {{ post.author.username }}</p>
    </div>
    <form v-if="store.isLoggedIn" :onsubmit="handleNewComment" id="theform">
        <p>Write A Comment</p>
        <textarea name="text" id="text" cols="100" rows="5"></textarea>
        <input type="hidden" name="post" :value="props.id">
        <button type="submit">Submit</button>
    </form>
    <div v-else class="comment-message">You must be logged in to comment.</div>
    <ul>
        <li v-for="comment in comments" :key="comment._id">
            <p>{{ comment.text }}</p>
            <p>- {{ comment.author.username }}</p>
            <div v-if="!comment.isEditing">
                <button :onclick="(e) => toggleEdit(e, comment)">Edit</button>
                <button :onclick="(e) => handleCommentDelete(e, comment)">Delete</button>
            </div>
            <form v-else-if="comment.isEditing" id="updateform">
                <textarea name="text" id="text" cols="100" rows="5" :value="comment.text"></textarea>
                <input type="hidden" name="post" :value="props.id">
                <button :onclick="(e) => handleCommentUpdate(e, comment)">Update Comment</button>
            </form>
        </li>
    </ul>
  </main>
</template>

<style scoped>
form, .comment-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 50px 50px;
    border: 2px black solid;
}
</style>
