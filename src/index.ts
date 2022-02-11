var request = require('request');
import { parse } from 'node-html-parser'
import { AUTH_URL, COURSES_URL } from './configs/config.json';

type SchoolClass = 3 | 4| 5 | 6 | 7 | 8 | 9 | 10 | 11

export class Client {
    private token: string;
    private csrf: string;
    private sessionid: string;

    constructor(token: string) {
        this.token = token
    }

    public getCourses(schoolclass: SchoolClass): void {
        request.get(AUTH_URL, async (error, response) => {
            if (error) throw new Error(error);
            const c = response.headers['set-cookie'][0]
            this.csrf = c.slice(c.indexOf('=')+1, c.indexOf(';'))
    
            var options_auth = {
                    'method': 'POST',
                    'url': AUTH_URL,
                headers: {
                    'Cookie': `csrftoken=${this.csrf}`
                },
                form: {
                    'csrfmiddlewaretoken': this.csrf,
                    'password': this.token
                }
            };
            request(options_auth, async (error, response) => {
                if (error) throw new Error(error);
                const c = response.headers['set-cookie'][1]
                this.sessionid = c.slice(c.indexOf('=')+1, c.indexOf(';'))
                var options_get = {
                    'method': 'GET',
                    'url': COURSES_URL,
                headers: {
                    'Cookie': `csrftoken=${this.csrf}; sessionid=${this.sessionid}`
                }}

                request(options_get, async (error, response) => {
                    const c = parse(response.toString()).querySelector("ul[class=ulysses-courses-list]")
                    // result = c 
                })
            });
        })
    }
    
    }


const client = new Client('meandmylit2021')
console.log(client.getCourses(8))


