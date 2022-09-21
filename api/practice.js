function makeRequest(location) {
    return new Promise((resolve,reject) => {
        if(location === 'Google')
            resolve('Google says hi.');
        else
            reject(new Error('We can only talk to Google.'));
    })
}

function processRequest(response) {
    return new Promise((resolve,reject) => {
        console.log("Processing response");
        resolve(`Extra information : ${response}`);
    })
}

async function doStuff() {
    try {
        console.log('ki hosse ?');
        const res1 = await makeRequest('Google');
        console.log(res1);
        console.log("First promise resolved");

        const res2 = await processRequest(res1);
        console.log(res2);
        console.log("Second promise resolved.");
    } catch(error) {
        console.log(error.message);
    }
}

doStuff();

for(let i=1;i<=10;i++) {
    console.log(i);
}