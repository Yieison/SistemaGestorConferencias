export function fetchApi(url, method, body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    return fetch(`http://localhost:8080${url}`, options).then(response => response.json());
}




