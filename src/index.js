"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UlyssesClient = void 0;
var request = require('request');
var jssoup_1 = require("jssoup");
var UlyssesClient = /** @class */ (function () {
    function UlyssesClient(token, years) {
        this.token = token;
        UlyssesClient.years = years;
        this.AUTH_URL = "https://in.lit.msu.ru/Ulysses/login/keyword/?next=%2FUlysses%2F".concat(years, "%2F");
        this.COURSES_URL = "https://in.lit.msu.ru/Ulysses/".concat(years, "/");
    }
    UlyssesClient.prototype._courses = function (callback) {
        var _this = this;
        request.get(this.AUTH_URL, function (error, response) { return __awaiter(_this, void 0, void 0, function () {
            var c, options_auth;
            var _this = this;
            return __generator(this, function (_a) {
                if (error)
                    throw new Error(error);
                c = response.headers['set-cookie'][0];
                this.csrf = c.slice(c.indexOf('=') + 1, c.indexOf(';'));
                options_auth = {
                    'method': 'POST',
                    'url': this.AUTH_URL,
                    headers: {
                        'Cookie': "csrftoken=".concat(this.csrf)
                    },
                    form: {
                        'csrfmiddlewaretoken': this.csrf,
                        'password': this.token
                    }
                };
                request(options_auth, function (error, response) { return __awaiter(_this, void 0, void 0, function () {
                    var c, options_get;
                    var _this = this;
                    return __generator(this, function (_a) {
                        if (error)
                            throw new Error(error);
                        c = response.headers['set-cookie'][1];
                        this.sessionid = c.slice(c.indexOf('=') + 1, c.indexOf(';'));
                        options_get = {
                            'method': 'GET',
                            'url': this.COURSES_URL,
                            headers: {
                                'Cookie': "csrftoken=".concat(this.csrf, "; sessionid=").concat(this.sessionid)
                            }
                        };
                        request(options_get, function (error, response) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                result = new jssoup_1["default"](response.body.toString());
                                callback(result);
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
            });
        }); });
    };
    UlyssesClient.prototype.getTeachers = function (callback) {
        this._courses(function (rez) {
            var teachers = [];
            for (var x = 10; x < rez.querySelectorAll("li").length; x++) {
                try {
                    teachers.push(rez.querySelectorAll("li")[x].childNodes[2].rawText.replace('(', '').replace(')', '').trim());
                }
                catch (_a) {
                    break;
                }
            }
            var res = teachers.filter(function (elem, pos) {
                return teachers.indexOf(elem) == pos;
            });
            callback(res);
        });
    };
    UlyssesClient.prototype.getCourses = function (SchoolClass, callback) {
        this._courses(function (rez) {
            var courses = [];
            var parsed = rez.findAll('li');
            for (var x = 0; x < parsed.length; x++) {
                try {
                    if (parsed[x].parent.previousElement._text.slice(0, 2).trim() == SchoolClass) {
                        var text = parsed[x].text.trim();
                        if (text.replace('(', '').includes('(')) {
                            var subject = text.slice(0, text.indexOf('('));
                            var teacher = text.slice(text.indexOf(')') + 3, -1);
                        }
                        else {
                            var subject = text.slice(0, text.indexOf('('));
                            var teacher = text.slice(text.indexOf('(') + 1, text.indexOf(')'));
                        }
                        courses.push({
                            subject: subject.trim(),
                            teacher: teacher.trim(),
                            link: "https://in.lit.msu.ru/Ulysses/".concat(UlyssesClient.years, "/").concat(parsed[x].nextElement.attrs.href)
                        });
                    }
                }
                catch (_a) {
                    continue;
                }
            }
            callback(courses);
        });
    };
    return UlyssesClient;
}());
exports.UlyssesClient = UlyssesClient;
var client = new UlyssesClient('meandmylit2021', '2021-2022');
client.getCourses(8, function (result) {
    console.log(result);
});
