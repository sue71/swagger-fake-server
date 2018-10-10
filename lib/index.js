"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var swagger_parser_1 = require("swagger-parser");
var express_1 = __importDefault(require("express"));
var process = __importStar(require("process"));
var jsf = require("json-schema-faker");
var app = express_1.default();
jsf.option({
    failOnInvalidTypes: false,
    failOnInvalidFormat: false,
    fixedProbabilities: true,
    alwaysFakeOptionals: true,
    minItems: 0,
    maxItems: 10
});
function run(jsonfile, options) {
    return __awaiter(this, void 0, void 0, function () {
        var host, port, spec;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    host = options.host || process.env.HOST || "0.0.0.0";
                    port = options.port || process.env.PORT || 9000;
                    return [4, swagger_parser_1.dereference(jsonfile).catch(function (e) {
                            throw e;
                        })];
                case 1:
                    spec = _a.sent();
                    setupEndpoints(spec);
                    app.listen(port, host, function () {
                        console.log("Server listen to port", port);
                    });
                    return [2];
            }
        });
    });
}
exports.default = run;
function snakeToCamel(str) {
    return str.replace(/_([a-z])/gi, function (_, letter) {
        return letter.toUpperCase();
    });
}
function map(object, converter) {
    if (Array.isArray(object)) {
        return object.map(function (v) {
            if (typeof v === "object") {
                return map(v, converter);
            }
            return v;
        });
    }
    if (typeof object === "object") {
        return Object.keys(object).reduce(function (acc, key) {
            var _a;
            var item = object[key];
            if (typeof item === "object") {
                item = map(item, converter);
            }
            var camelKey = snakeToCamel(key);
            return Object.assign({}, acc, (_a = {},
                _a[camelKey] = item,
                _a));
        }, {});
    }
}
function toCamel(object) {
    return map(object, snakeToCamel);
}
function setupEndpoints(spec) {
    for (var path in spec.paths) {
        var methods = spec.paths[path];
        setupMethods(path, methods);
    }
}
function setupMethods(filepath, methods) {
    var _this = this;
    var _loop_1 = function (method) {
        var responses = methods[method].responses;
        var formattedPath = filepath.replace(/\{(.+?)\}/g, function (_, $1) { return ":" + $1; });
        console.info("Register endpoint: [" + method.toUpperCase() + "] " + formattedPath);
        app[method](formattedPath, function (_req, res) { return __awaiter(_this, void 0, void 0, function () {
            var schema, response;
            return __generator(this, function (_a) {
                schema = responses[200].schema;
                response = toCamel(jsf.generate(schema));
                res.json(response);
                return [2];
            });
        }); });
    };
    for (var method in methods) {
        _loop_1(method);
    }
}
//# sourceMappingURL=index.js.map