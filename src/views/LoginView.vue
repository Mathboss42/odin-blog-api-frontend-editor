<script setup>
import axios from 'axios';
import { useEditorStore } from '../stores/editor';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useEditorStore();

async function handleLogin(e) {
    console.log('handle login')
    e.preventDefault();
    const form = document.getElementById('theform');
    const data = new FormData(form);
    let values = [];
    // eslint-disable-next-line no-unused-vars
    for (const [name, value] of data) {
        values.push(value);
    }
    
    const user = {
        username: values[0],
        password: values[1]
    };

    form.reset();
    
    const response = await axios.post('http://localhost:8092/auth/', user);
    console.log('response', response.data.token);
    
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        store.isLoggedIn = true;
        router.push('/');
    }
}
</script>
<template>
    <div>
        <form :onsubmit="handleLogin" id="theform">
            <div>
                <label for="username">Username:</label>
                <input type="text" name="username" id="username">
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" name="password" id="password">
            </div>
            <button type="submit">Log In</button>
        </form>
    </div>
</template>