process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const SERVER_URL = `${process.env.SERVER_URL}/monitor`;

async function checkHealth(){
    try{
        const res = await fetch(SERVER_URL);
        const data = await res.json();

        if (data.server === true){
            console.log(JSON.stringify({ status: true }));
        } else {
            console.log(JSON.stringify({ status: false }));
        }
    } catch (error) {
        console.log("no hay respuesta")
        console.log(JSON.stringify({ status: false }));
    }
}

setInterval(checkHealth, 10000);
checkHealth();