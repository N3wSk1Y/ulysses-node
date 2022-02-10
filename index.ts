var request = require('request');
var options = {
        'method': 'POST',
        'url': 'https://in.lit.msu.ru/Ulysses/login/keyword/?next=%2FUlysses%2F2021-2022%2F',
        'headers': {
        'Cookie': 'csrftoken=cTAIxG65kdjJrIfSoSCImA0cDBFYzd0OkqbJPXLigFtJG4w3HIDMV4pGQy3Gg5vf'
    },
    formData: {
        'password': 'meandmylit2021',
        'csrfmiddlewaretoken': 'cTAIxG65kdjJrIfSoSCImA0cDBFYzd0OkqbJPXLigFtJG4w3HIDMV4pGQy3Gg5vf'
    }
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response);
});


