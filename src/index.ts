var request =  require('request');
import { parse } from 'node-html-parser';
import { AUTH_URL } from './configs/config.json';

class client {
    private token: string;
    constructor(token: string) {
        this.token = token
    }
}

function auth() {
    request.get(AUTH_URL, async (error, response) => {
        const root = parse(response.body.toString());
        const csrf = await root.querySelector('input[name=csrfmiddlewaretoken]')['_attrs'].value;

        var options_auth = {
                'method': 'POST',
                'url': AUTH_URL,
            formData: {
                'csrfmiddlewaretoken': csrf,
                'password': 'meandmylit2021'
            }
        };

        request(options_auth, function (error, response) {
            if (error) throw new Error(error);
            console.log(response);
        });

    })
}


auth()





