const request = require('request');
import { parse } from 'node-html-parser';
import JSSoup from 'jssoup'; 

type SchoolClass = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

export class UlyssesClient {
    private token: string;
    private csrf: string;
    private sessionid: string;
    private AUTH_URL: string;
    private COURSES_URL: string;
    private static years: string;

    constructor(token: string, years: string) {
        this.token = token;
        UlyssesClient.years = years;
        this.AUTH_URL = `https://in.lit.msu.ru/Ulysses/login/keyword/?next=%2FUlysses%2F${years}%2F`;
        this.COURSES_URL = `https://in.lit.msu.ru/Ulysses/${years}/`
    }

    private _courses(callback): void { // TODO: private
        request.get(this.AUTH_URL, async (error, response) => {
            if (error) throw new Error(error);
            const c = response.headers['set-cookie'][0]
            this.csrf = c.slice(c.indexOf('=')+1, c.indexOf(';'))
    
            var options_auth = {
                    'method': 'POST',
                    'url': this.AUTH_URL,
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
                    'url': this.COURSES_URL,
                headers: {
                    'Cookie': `csrftoken=${this.csrf}; sessionid=${this.sessionid}`
                }}
                request(options_get, async (error, response) => {
                    // const result = parse(response.body.toString());
                    const result = new JSSoup(response.body.toString())
                    callback(result);
                })
            });
        })
    }

    public getTeachers(callback): void {
        this._courses(function(rez) {
            const teachers: string[] = [];
            for (let x = 10; x < rez.querySelectorAll("li").length; x++) {
                try {
                    teachers.push(rez.querySelectorAll("li")[x].childNodes[2].rawText.replace('(','').replace(')','').trim())
                }
                catch { break }
            }
            const res = teachers.filter(function(elem, pos) {
                return teachers.indexOf(elem) == pos;
            });
            callback(res);
        })
    }
    
    public getCourses(SchoolClass: SchoolClass, callback): void {
        this._courses(function(rez) {
            var courses: object[] = []
            const parsed = rez.findAll('li')
            for (let x = 0; x < parsed.length; x++) {
                try {
                    if(parsed[x].parent.previousElement._text.slice(0, 2).trim() == SchoolClass) {
                        var text = parsed[x].text.trim();
                        if(text.replace('(', '').includes('(')){
                            var subject = text.slice(0, text.indexOf('('))
                            var teacher = text.slice(text.indexOf(')')+3, -1)
                        } else {
                            var subject = text.slice(0, text.indexOf('('))
                            var teacher = text.slice(text.indexOf('(')+1, text.indexOf(')'))
                        }
                        courses.push({
                            subject: subject.trim(),
                            teacher: teacher.trim(),
                            link: `https://in.lit.msu.ru/Ulysses/${UlyssesClient.years}/${parsed[x].nextElement.attrs.href}`
                        })
                    }
                } catch { continue }
            }
            callback(courses);
        })
    }

}


const client = new UlyssesClient('meandmylit2021', '2021-2022')
client.getCourses(8, function (result) {
    console.log(result)
})
