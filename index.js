// var request = require('request');
// var options = {
//         'method': 'POST',
//         'url': 'https://in.lit.msu.ru/Ulysses/login/keyword/?next=%2FUlysses%2F2021-2022%2F',
//         'headers': {
//         'Cookie': 'csrftoken=cTAIxG65kdjJrIfSoSCImA0cDBFYzd0OkqbJPXLigFtJG4w3HIDMV4pGQy3Gg5vf'
//     },
//     formData: {
//         'password': 'meandmylit2021',
//         'csrfmiddlewaretoken': 'cTAIxG65kdjJrIfSoSCImA0cDBFYzd0OkqbJPXLigFtJG4w3HIDMV4pGQy3Gg5vf'
//     }
// };
// request(options, function (error, response) {
//     if (error) throw new Error(error);
//     console.log(response);
// });
var axios = require('axios');
var FormData = require('form-data');
var data = new FormData();
data.append('password', 'meandmylit2021');
data.append('csrfmiddlewaretoken', 'E03Ls4usxUIo1vS5ar7XmUCsaHMI5SrHEURNYddXCu64Gf7eUs0e7ZPnqtaYoUS4');
var config = {
    method: 'post',
    url: 'https://in.lit.msu.ru/Ulysses/login/keyword/?next=%2FUlysses%2F2021-2022%2F',
    headers: {
        'Cookie': 'Cookie_1=value; csrftoken=E03Ls4usxUIo1vS5ar7XmUCsaHMI5SrHEURNYddXCu64Gf7eUs0e7ZPnqtaYoUS4; sessionid=iwpeobk776l4y0hg4102qi4itdv1dtd7'
    },
    data: data
};
axios(config)
    .then(function (response) {
    console.log(JSON.stringify(response.data));
})["catch"](function (error) {
    console.log(error);
});
