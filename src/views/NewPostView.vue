<script setup>
import { onMounted, ref } from 'vue';
import { useEditorStore } from '../stores/editor';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useEditorStore();

const post = ref();


async function handleNewPost(e) {
    e.preventDefault();
    try {
        const form = document.getElementById('newpostform');
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

        const response = await axios.post(`http://localhost:8092/api/posts/new`, newData, { 
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        router.push('/');

    
    } catch (err) {
        console.log(err);
    }
}
</script>

<template>
  <main>
    <div>
        <form :onsubmit="handleNewPost" id="newpostform">
            <div>
                <label for="title">Title: </label>
                <input type="text" name="title" id="title">
            </div>
            <div>
                <label for="text">Content: </label>
                <textarea type="text" name="text" id="text" cols="100" rows="10"></textarea>
            </div>
            <div>
                <label for="status">Published</label>
                <select name="status" id="status">
                    <option value="archived">Archived</option>
                    <option value="published">Published</option>
                </select>
            </div>
            <button>Create Post</button>
        </form>
    </div>
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
