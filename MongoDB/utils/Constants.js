let ObjectId = require('mongodb').ObjectID
exports = module.exports = {
    FACEBOOK_LOGIN: "FACEBOOKLOGIN",
    MOBILE_LOGIN: "MOBILENUMBERLOGIN",
    LOGIN_SUCCESS: "Your profile has been created successfully!",
    SIGNUP_SUCCESS: "Your profile has been created successfully!",
    //statuscodes
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    // etc
    CONTINUE: 100,
    101: 'Switching Protocols',
    102: 'PROCESSING',                 // RFC 2518, obsoleted by RFC 4918
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',               // RFC 4918
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Moved Temporarily',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot',              // RFC 2324
    422: 'Unprocessable Entity',       // RFC 4918
    423: 'Locked',                     // RFC 4918
    424: 'Failed Dependency',          // RFC 4918
    425: 'Unordered Collection',       // RFC 4918
    426: 'Upgrade Required',           // RFC 2817
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version not supported',
    506: 'Variant Also Negotiates',    // RFC 2295
    507: 'Insufficient Storage',       // RFC 4918
    509: 'Bandwidth Limit Exceeded',
    'Not Extended': 510,



    //messages
    CODE_SUCCESS: 1,
    CODE_ERROR: 0,
    CODE_EMPTY: 0,
    MSG_SUCCESS: "Success",
    MSG_FAILURE: "Failure",
    MSG_EMPTY: "No data found",
    MSG_ERROR: "Error",
    MSG_INVALID_USER_ID: "Invalid userId",
    MSG_INVALID_TYPE: "Invalid type",
    MSG_INVALID_KEY_VALUE: "Invalid key value",
    MSG_INVALID_LOGIN_TYPE: "invalid loginType",
    MSG_FIND_OTP_ERROR: "Error finding OTP data for verfication",
    MSG_NO_OTP_DATA: "No OTP data",
    MSG_OTP_EXPIRED: "OTP expired",







    //constant keys

    EMAIL: "email",
    PHONENUMBER: "phoneNumber",
    REQUESTTYPE: ["signup", "login", "forgotPassword"],
    TYPE: ["email", "phoneNumber"]


};