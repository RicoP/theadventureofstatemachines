


function require(str) {
 if (str == "streamline/lib/util/flows") return Streamline.flows;
 else if (str == "streamline/lib/globals") return Streamline.globals;
 else if (str == "streamline/lib/callbacks/runtime") return Streamline.runtime;
 else if (str == "streamline/lib/callbacks/transform") return Streamline;
 else if (str == "streamline/lib/callbacks/builtins") return Streamline.builtins;
 else if (str == "streamline/lib/globals") return Streamline.globals;
 else if (str == "streamline/lib/util/future") return Streamline.future;
 else if (str == "./squeeze-more") return Uglify;
 else if (str == "./parse-js") return Uglify;
 else if (str == "./process") return Uglify;
 else {
  throw new Error("cannot require " + str)
 }
}
var Uglify = {};
(function(exports) {
var KEYWORDS = array_to_hash([
    "break",
    "case",
    "catch",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "finally",
    "for",
    "function",
    "if",
    "in",
    "instanceof",
    "new",
    "return",
    "switch",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with"
]);
var RESERVED_WORDS = array_to_hash([
    "abstract",
    "boolean",
    "byte",
    "char",
    "class",
    "double",
    "enum",
    "export",
    "extends",
    "final",
    "float",
    "goto",
    "implements",
    "import",
    "int",
    "interface",
    "long",
    "native",
    "package",
    "private",
    "protected",
    "public",
    "short",
    "static",
    "super",
    "synchronized",
    "throws",
    "transient",
    "volatile"
]);
var KEYWORDS_BEFORE_EXPRESSION = array_to_hash([
    "return",
    "new",
    "delete",
    "throw",
    "else",
    "case"
]);
var KEYWORDS_ATOM = array_to_hash([
    "false",
    "null",
    "true",
    "undefined"
]);
var OPERATOR_CHARS = array_to_hash(characters("+-*&%=<>!?|~^"));
var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
var RE_OCT_NUMBER = /^0[0-7]+$/;
var RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
var OPERATORS = array_to_hash([
    "in",
    "instanceof",
    "typeof",
    "new",
    "void",
    "delete",
    "++",
    "--",
    "+",
    "-",
    "!",
    "~",
    "&",
    "|",
    "^",
    "*",
    "/",
    "%",
    ">>",
    "<<",
    ">>>",
    "<",
    ">",
    "<=",
    ">=",
    "==",
    "===",
    "!=",
    "!==",
    "?",
    "=",
    "+=",
    "-=",
    "/=",
    "*=",
    "%=",
    ">>=",
    "<<=",
    ">>>=",
    "|=",
    "^=",
    "&=",
    "&&",
    "||"
]);
var WHITESPACE_CHARS = array_to_hash(characters(" \u00a0\n\r\t\f\u000b\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000"));
var PUNC_BEFORE_EXPRESSION = array_to_hash(characters("[{(,.;:"));
var PUNC_CHARS = array_to_hash(characters("[]{}(),;:"));
var REGEXP_MODIFIERS = array_to_hash(characters("gmsiy"));
var UNICODE = {
    letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F0\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
    combining_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08E4-\\u08FE\\u0900-\\u0903\\u093A-\\u093C\\u093E-\\u094F\\u0951-\\u0957\\u0962\\u0963\\u0981-\\u0983\\u09BC\\u09BE-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2\\u09E3\\u0A01-\\u0A03\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AE2\\u0AE3\\u0B01-\\u0B03\\u0B3C\\u0B3E-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B62\\u0B63\\u0B82\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C82\\u0C83\\u0CBC\\u0CBE-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CE2\\u0CE3\\u0D02\\u0D03\\u0D3E-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0D62\\u0D63\\u0D82\\u0D83\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102B-\\u103E\\u1056-\\u1059\\u105E-\\u1060\\u1062-\\u1064\\u1067-\\u106D\\u1071-\\u1074\\u1082-\\u108D\\u108F\\u109A-\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u192B\\u1930-\\u193B\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A17-\\u1A1B\\u1A55-\\u1A5E\\u1A60-\\u1A7C\\u1A7F\\u1B00-\\u1B04\\u1B34-\\u1B44\\u1B6B-\\u1B73\\u1B80-\\u1B82\\u1BA1-\\u1BAD\\u1BE6-\\u1BF3\\u1C24-\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE8\\u1CED\\u1CF2-\\u1CF4\\u1DC0-\\u1DE6\\u1DFC-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA823-\\uA827\\uA880\\uA881\\uA8B4-\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA953\\uA980-\\uA983\\uA9B3-\\uA9C0\\uAA29-\\uAA36\\uAA43\\uAA4C\\uAA4D\\uAA7B\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEB-\\uAAEF\\uAAF5\\uAAF6\\uABE3-\\uABEA\\uABEC\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
    connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]"),
    digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]")
};
function is_letter(ch) {
    return UNICODE.letter.test(ch);
};
function is_digit(ch) {
    ch = ch.charCodeAt(0);
    return ch >= 48 && ch <= 57;
};
function is_unicode_digit(ch) {
    return UNICODE.digit.test(ch);
}
function is_alphanumeric_char(ch) {
    return is_digit(ch) || is_letter(ch);
};
function is_unicode_combining_mark(ch) {
    return UNICODE.combining_mark.test(ch);
};
function is_unicode_connector_punctuation(ch) {
    return UNICODE.connector_punctuation.test(ch);
};
function is_identifier_start(ch) {
    return ch == "$" || ch == "_" || is_letter(ch);
};
function is_identifier_char(ch) {
    return is_identifier_start(ch)
        || is_unicode_combining_mark(ch)
        || is_unicode_digit(ch)
        || is_unicode_connector_punctuation(ch)
        || ch == "\u200c"
        || ch == "\u200d"
    ;
};
function parse_js_number(num) {
    if (RE_HEX_NUMBER.test(num)) {
        return parseInt(num.substr(2), 16);
    } else if (RE_OCT_NUMBER.test(num)) {
        return parseInt(num.substr(1), 8);
    } else if (RE_DEC_NUMBER.test(num)) {
        return parseFloat(num);
    }
};
function JS_Parse_Error(message, line, col, pos) {
    this.message = message;
    this.line = line + 1;
    this.col = col + 1;
    this.pos = pos + 1;
    this.stack = new Error().stack;
};
JS_Parse_Error.prototype.toString = function() {
    return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack;
};
function js_error(message, line, col, pos) {
    throw new JS_Parse_Error(message, line, col, pos);
};
function is_token(token, type, val) {
    return token.type == type && (val == null || token.value == val);
};
var EX_EOF = {};
function tokenizer($TEXT) {
    var S = {
        text : $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, ''),
        pos : 0,
        tokpos : 0,
        line : 0,
        tokline : 0,
        col : 0,
        tokcol : 0,
        newline_before : false,
        regex_allowed : false,
        comments_before : []
    };
    function peek() { return S.text.charAt(S.pos); };
    function next(signal_eof, in_string) {
        var ch = S.text.charAt(S.pos++);
        if (signal_eof && !ch)
            throw EX_EOF;
        if (ch == "\n") {
            S.newline_before = S.newline_before || !in_string;
            ++S.line;
            S.col = 0;
        } else {
            ++S.col;
        }
        return ch;
    };
    function eof() {
        return !S.peek();
    };
    function find(what, signal_eof) {
        var pos = S.text.indexOf(what, S.pos);
        if (signal_eof && pos == -1) throw EX_EOF;
        return pos;
    };
    function start_token() {
        S.tokline = S.line;
        S.tokcol = S.col;
        S.tokpos = S.pos;
    };
    function token(type, value, is_comment) {
        S.regex_allowed = ((type == "operator" && !HOP(UNARY_POSTFIX, value)) ||
                           (type == "keyword" && HOP(KEYWORDS_BEFORE_EXPRESSION, value)) ||
                           (type == "punc" && HOP(PUNC_BEFORE_EXPRESSION, value)));
        var ret = {
            type : type,
            value : value,
            line : S.tokline,
            col : S.tokcol,
            pos : S.tokpos,
            endpos : S.pos,
            nlb : S.newline_before
        };
        if (!is_comment) {
            ret.comments_before = S.comments_before;
            S.comments_before = [];
            for (var i = 0, len = ret.comments_before.length; i < len; i++) {
                ret.nlb = ret.nlb || ret.comments_before[i].nlb;
            }
        }
        S.newline_before = false;
        return ret;
    };
    function skip_whitespace() {
        while (HOP(WHITESPACE_CHARS, peek()))
            next();
    };
    function read_while(pred) {
        var ret = "", ch = peek(), i = 0;
        while (ch && pred(ch, i++)) {
            ret += next();
            ch = peek();
        }
        return ret;
    };
    function parse_error(err) {
        js_error(err, S.tokline, S.tokcol, S.tokpos);
    };
    function read_num(prefix) {
        var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
        var num = read_while(function(ch, i){
            if (ch == "x" || ch == "X") {
                if (has_x) return false;
                return has_x = true;
            }
            if (!has_x && (ch == "E" || ch == "e")) {
                if (has_e) return false;
                return has_e = after_e = true;
            }
            if (ch == "-") {
                if (after_e || (i == 0 && !prefix)) return true;
                return false;
            }
            if (ch == "+") return after_e;
            after_e = false;
            if (ch == ".") {
                if (!has_dot && !has_x && !has_e)
                    return has_dot = true;
                return false;
            }
            return is_alphanumeric_char(ch);
        });
        if (prefix)
            num = prefix + num;
        var valid = parse_js_number(num);
        if (!isNaN(valid)) {
            return token("num", valid);
        } else {
            parse_error("Invalid syntax: " + num);
        }
    };
    function read_escaped_char(in_string) {
        var ch = next(true, in_string);
        switch (ch) {
          case "n" : return "\n";
          case "r" : return "\r";
          case "t" : return "\t";
          case "b" : return "\b";
          case "v" : return "\u000b";
          case "f" : return "\f";
          case "0" : return "\0";
          case "x" : return String.fromCharCode(hex_bytes(2));
          case "u" : return String.fromCharCode(hex_bytes(4));
          case "\n": return "";
          default : return ch;
        }
    };
    function hex_bytes(n) {
        var num = 0;
        for (; n > 0; --n) {
            var digit = parseInt(next(true), 16);
            if (isNaN(digit))
                parse_error("Invalid hex-character pattern in string");
            num = (num << 4) | digit;
        }
        return num;
    };
    function read_string() {
        return with_eof_error("Unterminated string constant", function(){
            var quote = next(), ret = "";
            for (;;) {
                var ch = next(true);
                if (ch == "\\") {
                    var octal_len = 0, first = null;
                    ch = read_while(function(ch){
                        if (ch >= "0" && ch <= "7") {
                            if (!first) {
                                first = ch;
                                return ++octal_len;
                            }
                            else if (first <= "3" && octal_len <= 2) return ++octal_len;
                            else if (first >= "4" && octal_len <= 1) return ++octal_len;
                        }
                        return false;
                    });
                    if (octal_len > 0) ch = String.fromCharCode(parseInt(ch, 8));
                    else ch = read_escaped_char(true);
                }
                else if (ch == quote) break;
                ret += ch;
            }
            return token("string", ret);
        });
    };
    function read_line_comment() {
        next();
        var i = find("\n"), ret;
        if (i == -1) {
            ret = S.text.substr(S.pos);
            S.pos = S.text.length;
        } else {
            ret = S.text.substring(S.pos, i);
            S.pos = i;
        }
        return token("comment1", ret, true);
    };
    function read_multiline_comment() {
        next();
        return with_eof_error("Unterminated multiline comment", function(){
            var i = find("*/", true),
            text = S.text.substring(S.pos, i);
            S.pos = i + 2;
            S.line += text.split("\n").length - 1;
            S.newline_before = S.newline_before || text.indexOf("\n") >= 0;
            if (/^@cc_on/i.test(text)) {
                warn("WARNING: at line " + S.line);
                warn("*** Found \"conditional comment\": " + text);
                warn("*** UglifyJS DISCARDS ALL COMMENTS.  This means your code might no longer work properly in Internet Explorer.");
            }
            return token("comment2", text, true);
        });
    };
    function read_name() {
        var backslash = false, name = "", ch, escaped = false, hex;
        while ((ch = peek()) != null) {
            if (!backslash) {
                if (ch == "\\") escaped = backslash = true, next();
                else if (is_identifier_char(ch)) name += next();
                else break;
            }
            else {
                if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                ch = read_escaped_char();
                if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                name += ch;
                backslash = false;
            }
        }
        if (HOP(KEYWORDS, name) && escaped) {
            hex = name.charCodeAt(0).toString(16).toUpperCase();
            name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
        }
        return name;
    };
    function read_regexp(regexp) {
        return with_eof_error("Unterminated regular expression", function(){
            var prev_backslash = false, ch, in_class = false;
            while ((ch = next(true))) if (prev_backslash) {
                regexp += "\\" + ch;
                prev_backslash = false;
            } else if (ch == "[") {
                in_class = true;
                regexp += ch;
            } else if (ch == "]" && in_class) {
                in_class = false;
                regexp += ch;
            } else if (ch == "/" && !in_class) {
                break;
            } else if (ch == "\\") {
                prev_backslash = true;
            } else {
                regexp += ch;
            }
            var mods = read_name();
            return token("regexp", [ regexp, mods ]);
        });
    };
    function read_operator(prefix) {
        function grow(op) {
            if (!peek()) return op;
            var bigger = op + peek();
            if (HOP(OPERATORS, bigger)) {
                next();
                return grow(bigger);
            } else {
                return op;
            }
        };
        return token("operator", grow(prefix || next()));
    };
    function handle_slash() {
        next();
        var regex_allowed = S.regex_allowed;
        switch (peek()) {
          case "/":
            S.comments_before.push(read_line_comment());
            S.regex_allowed = regex_allowed;
            return next_token();
          case "*":
            S.comments_before.push(read_multiline_comment());
            S.regex_allowed = regex_allowed;
            return next_token();
        }
        return S.regex_allowed ? read_regexp("") : read_operator("/");
    };
    function handle_dot() {
        next();
        return is_digit(peek())
            ? read_num(".")
            : token("punc", ".");
    };
    function read_word() {
        var word = read_name();
        return !HOP(KEYWORDS, word)
            ? token("name", word)
            : HOP(OPERATORS, word)
            ? token("operator", word)
            : HOP(KEYWORDS_ATOM, word)
            ? token("atom", word)
            : token("keyword", word);
    };
    function with_eof_error(eof_error, cont) {
        try {
            return cont();
        } catch(ex) {
            if (ex === EX_EOF) parse_error(eof_error);
            else throw ex;
        }
    };
    function next_token(force_regexp) {
        if (force_regexp != null)
            return read_regexp(force_regexp);
        skip_whitespace();
        start_token();
        var ch = peek();
        if (!ch) return token("eof");
        if (is_digit(ch)) return read_num();
        if (ch == '"' || ch == "'") return read_string();
        if (HOP(PUNC_CHARS, ch)) return token("punc", next());
        if (ch == ".") return handle_dot();
        if (ch == "/") return handle_slash();
        if (HOP(OPERATOR_CHARS, ch)) return read_operator();
        if (ch == "\\" || is_identifier_start(ch)) return read_word();
        parse_error("Unexpected character '" + ch + "'");
    };
    next_token.context = function(nc) {
        if (nc) S = nc;
        return S;
    };
    return next_token;
};
var UNARY_PREFIX = array_to_hash([
    "typeof",
    "void",
    "delete",
    "--",
    "++",
    "!",
    "~",
    "-",
    "+"
]);
var UNARY_POSTFIX = array_to_hash([ "--", "++" ]);
var ASSIGNMENT = (function(a, ret, i){
    while (i < a.length) {
        ret[a[i]] = a[i].substr(0, a[i].length - 1);
        i++;
    }
    return ret;
})(
    ["+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="],
    { "=": true },
    0
);
var PRECEDENCE = (function(a, ret){
    for (var i = 0, n = 1; i < a.length; ++i, ++n) {
        var b = a[i];
        for (var j = 0; j < b.length; ++j) {
            ret[b[j]] = n;
        }
    }
    return ret;
})(
    [
        ["||"],
        ["&&"],
        ["|"],
        ["^"],
        ["&"],
        ["==", "===", "!=", "!=="],
        ["<", ">", "<=", ">=", "in", "instanceof"],
        [">>", "<<", ">>>"],
        ["+", "-"],
        ["*", "/", "%"]
    ],
    {}
);
var STATEMENTS_WITH_LABELS = array_to_hash([ "for", "do", "while", "switch" ]);
var ATOMIC_START_TOKEN = array_to_hash([ "atom", "num", "string", "regexp", "name" ]);
function NodeWithToken(str, start, end) {
    this.name = str;
    this.start = start;
    this.end = end;
};
NodeWithToken.prototype.toString = function() { return this.name; };
function parse($TEXT, exigent_mode, embed_tokens) {
    var S = {
        input : typeof $TEXT == "string" ? tokenizer($TEXT, true) : $TEXT,
        token : null,
        prev : null,
        peeked : null,
        in_function : 0,
        in_directives : true,
        in_loop : 0,
        labels : []
    };
    S.token = next();
    function is(type, value) {
        return is_token(S.token, type, value);
    };
    function peek() { return S.peeked || (S.peeked = S.input()); };
    function next() {
        S.prev = S.token;
        if (S.peeked) {
            S.token = S.peeked;
            S.peeked = null;
        } else {
            S.token = S.input();
        }
        S.in_directives = S.in_directives && (
            S.token.type == "string" || is("punc", ";")
        );
        return S.token;
    };
    function prev() {
        return S.prev;
    };
    function croak(msg, line, col, pos) {
        var ctx = S.input.context();
        js_error(msg,
                 line != null ? line : ctx.tokline,
                 col != null ? col : ctx.tokcol,
                 pos != null ? pos : ctx.tokpos);
    };
    function token_error(token, msg) {
        croak(msg, token.line, token.col);
    };
    function unexpected(token) {
        if (token == null)
            token = S.token;
        token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
    };
    function expect_token(type, val) {
        if (is(type, val)) {
            return next();
        }
        token_error(S.token, "Unexpected token " + S.token.type + ", expected " + type);
    };
    function expect(punc) { return expect_token("punc", punc); };
    function can_insert_semicolon() {
        return !exigent_mode && (
            S.token.nlb || is("eof") || is("punc", "}")
        );
    };
    function semicolon() {
        if (is("punc", ";")) next();
        else if (!can_insert_semicolon()) unexpected();
    };
    function as() {
        return slice(arguments);
    };
    function parenthesised() {
        expect("(");
        var ex = expression();
        expect(")");
        return ex;
    };
    function add_tokens(str, start, end) {
        return str instanceof NodeWithToken ? str : new NodeWithToken(str, start, end);
    };
    function maybe_embed_tokens(parser) {
        if (embed_tokens) return function() {
            var start = S.token;
            var ast = parser.apply(this, arguments);
            ast[0] = add_tokens(ast[0], start, prev());
            return ast;
        };
        else return parser;
    };
    var statement = maybe_embed_tokens(function() {
        if (is("operator", "/") || is("operator", "/=")) {
            S.peeked = null;
            S.token = S.input(S.token.value.substr(1));
        }
        switch (S.token.type) {
          case "string":
            var dir = S.in_directives, stat = simple_statement();
            if (dir && stat[1][0] == "string" && !is("punc", ","))
                return as("directive", stat[1][1]);
            return stat;
          case "num":
          case "regexp":
          case "operator":
          case "atom":
            return simple_statement();
          case "name":
            return is_token(peek(), "punc", ":")
                ? labeled_statement(prog1(S.token.value, next, next))
                : simple_statement();
          case "punc":
            switch (S.token.value) {
              case "{":
                return as("block", block_());
              case "[":
              case "(":
                return simple_statement();
              case ";":
                next();
                return as("block");
              default:
                unexpected();
            }
          case "keyword":
            switch (prog1(S.token.value, next)) {
              case "break":
                return break_cont("break");
              case "continue":
                return break_cont("continue");
              case "debugger":
                semicolon();
                return as("debugger");
              case "do":
                return (function(body){
                    expect_token("keyword", "while");
                    return as("do", prog1(parenthesised, semicolon), body);
                })(in_loop(statement));
              case "for":
                return for_();
              case "function":
                return function_(true);
              case "if":
                return if_();
              case "return":
                if (S.in_function == 0)
                    croak("'return' outside of function");
                return as("return",
                          is("punc", ";")
                          ? (next(), null)
                          : can_insert_semicolon()
                          ? null
                          : prog1(expression, semicolon));
              case "switch":
                return as("switch", parenthesised(), switch_block_());
              case "throw":
                if (S.token.nlb)
                    croak("Illegal newline after 'throw'");
                return as("throw", prog1(expression, semicolon));
              case "try":
                return try_();
              case "var":
                return prog1(var_, semicolon);
              case "const":
                return prog1(const_, semicolon);
              case "while":
                return as("while", parenthesised(), in_loop(statement));
              case "with":
                return as("with", parenthesised(), statement());
              default:
                unexpected();
            }
        }
    });
    function labeled_statement(label) {
        S.labels.push(label);
        var start = S.token, stat = statement();
        if (exigent_mode && !HOP(STATEMENTS_WITH_LABELS, stat[0]))
            unexpected(start);
        S.labels.pop();
        return as("label", label, stat);
    };
    function simple_statement() {
        return as("stat", prog1(expression, semicolon));
    };
    function break_cont(type) {
        var name;
        if (!can_insert_semicolon()) {
            name = is("name") ? S.token.value : null;
        }
        if (name != null) {
            next();
            if (!member(name, S.labels))
                croak("Label " + name + " without matching loop or statement");
        }
        else if (S.in_loop == 0)
            croak(type + " not inside a loop or switch");
        semicolon();
        return as(type, name);
    };
    function for_() {
        expect("(");
        var init = null;
        if (!is("punc", ";")) {
            init = is("keyword", "var")
                ? (next(), var_(true))
                : expression(true, true);
            if (is("operator", "in")) {
                if (init[0] == "var" && init[1].length > 1)
                    croak("Only one variable declaration allowed in for..in loop");
                return for_in(init);
            }
        }
        return regular_for(init);
    };
    function regular_for(init) {
        expect(";");
        var test = is("punc", ";") ? null : expression();
        expect(";");
        var step = is("punc", ")") ? null : expression();
        expect(")");
        return as("for", init, test, step, in_loop(statement));
    };
    function for_in(init) {
        var lhs = init[0] == "var" ? as("name", init[1][0]) : init;
        next();
        var obj = expression();
        expect(")");
        return as("for-in", init, lhs, obj, in_loop(statement));
    };
    var function_ = function(in_statement) {
        var name = is("name") ? prog1(S.token.value, next) : null;
        if (in_statement && !name)
            unexpected();
        expect("(");
        return as(in_statement ? "defun" : "function",
                  name,
                  (function(first, a){
                      while (!is("punc", ")")) {
                          if (first) first = false; else expect(",");
                          if (!is("name")) unexpected();
                          a.push(S.token.value);
                          next();
                      }
                      next();
                      return a;
                  })(true, []),
                  (function(){
                      ++S.in_function;
                      var loop = S.in_loop;
                      S.in_directives = true;
                      S.in_loop = 0;
                      var a = block_();
                      --S.in_function;
                      S.in_loop = loop;
                      return a;
                  })());
    };
    function if_() {
        var cond = parenthesised(), body = statement(), belse;
        if (is("keyword", "else")) {
            next();
            belse = statement();
        }
        return as("if", cond, body, belse);
    };
    function block_() {
        expect("{");
        var a = [];
        while (!is("punc", "}")) {
            if (is("eof")) unexpected();
            a.push(statement());
        }
        next();
        return a;
    };
    var switch_block_ = curry(in_loop, function(){
        expect("{");
        var a = [], cur = null;
        while (!is("punc", "}")) {
            if (is("eof")) unexpected();
            if (is("keyword", "case")) {
                next();
                cur = [];
                a.push([ expression(), cur ]);
                expect(":");
            }
            else if (is("keyword", "default")) {
                next();
                expect(":");
                cur = [];
                a.push([ null, cur ]);
            }
            else {
                if (!cur) unexpected();
                cur.push(statement());
            }
        }
        next();
        return a;
    });
    function try_() {
        var body = block_(), bcatch, bfinally;
        if (is("keyword", "catch")) {
            next();
            expect("(");
            if (!is("name"))
                croak("Name expected");
            var name = S.token.value;
            next();
            expect(")");
            bcatch = [ name, block_() ];
        }
        if (is("keyword", "finally")) {
            next();
            bfinally = block_();
        }
        if (!bcatch && !bfinally)
            croak("Missing catch/finally blocks");
        return as("try", body, bcatch, bfinally);
    };
    function vardefs(no_in) {
        var a = [];
        for (;;) {
            if (!is("name"))
                unexpected();
            var name = S.token.value;
            next();
            if (is("operator", "=")) {
                next();
                a.push([ name, expression(false, no_in) ]);
            } else {
                a.push([ name ]);
            }
            if (!is("punc", ","))
                break;
            next();
        }
        return a;
    };
    function var_(no_in) {
        return as("var", vardefs(no_in));
    };
    function const_() {
        return as("const", vardefs());
    };
    function new_() {
        var newexp = expr_atom(false), args;
        if (is("punc", "(")) {
            next();
            args = expr_list(")");
        } else {
            args = [];
        }
        return subscripts(as("new", newexp, args), true);
    };
    var expr_atom = maybe_embed_tokens(function(allow_calls) {
        if (is("operator", "new")) {
            next();
            return new_();
        }
        if (is("punc")) {
            switch (S.token.value) {
              case "(":
                next();
                return subscripts(prog1(expression, curry(expect, ")")), allow_calls);
              case "[":
                next();
                return subscripts(array_(), allow_calls);
              case "{":
                next();
                return subscripts(object_(), allow_calls);
            }
            unexpected();
        }
        if (is("keyword", "function")) {
            next();
            return subscripts(function_(false), allow_calls);
        }
        if (HOP(ATOMIC_START_TOKEN, S.token.type)) {
            var atom = S.token.type == "regexp"
                ? as("regexp", S.token.value[0], S.token.value[1])
                : as(S.token.type, S.token.value);
            return subscripts(prog1(atom, next), allow_calls);
        }
        unexpected();
    });
    function expr_list(closing, allow_trailing_comma, allow_empty) {
        var first = true, a = [];
        while (!is("punc", closing)) {
            if (first) first = false; else expect(",");
            if (allow_trailing_comma && is("punc", closing)) break;
            if (is("punc", ",") && allow_empty) {
                a.push([ "atom", "undefined" ]);
            } else {
                a.push(expression(false));
            }
        }
        next();
        return a;
    };
    function array_() {
        return as("array", expr_list("]", !exigent_mode, true));
    };
    function object_() {
        var first = true, a = [];
        while (!is("punc", "}")) {
            if (first) first = false; else expect(",");
            if (!exigent_mode && is("punc", "}"))
                break;
            var type = S.token.type;
            var name = as_property_name();
            if (type == "name" && (name == "get" || name == "set") && !is("punc", ":")) {
                a.push([ as_name(), function_(false), name ]);
            } else {
                expect(":");
                a.push([ name, expression(false) ]);
            }
        }
        next();
        return as("object", a);
    };
    function as_property_name() {
        switch (S.token.type) {
          case "num":
          case "string":
            return prog1(S.token.value, next);
        }
        return as_name();
    };
    function as_name() {
        switch (S.token.type) {
          case "name":
          case "operator":
          case "keyword":
          case "atom":
            return prog1(S.token.value, next);
          default:
            unexpected();
        }
    };
    function subscripts(expr, allow_calls) {
        if (is("punc", ".")) {
            next();
            return subscripts(as("dot", expr, as_name()), allow_calls);
        }
        if (is("punc", "[")) {
            next();
            return subscripts(as("sub", expr, prog1(expression, curry(expect, "]"))), allow_calls);
        }
        if (allow_calls && is("punc", "(")) {
            next();
            return subscripts(as("call", expr, expr_list(")")), true);
        }
        return expr;
    };
    function maybe_unary(allow_calls) {
        if (is("operator") && HOP(UNARY_PREFIX, S.token.value)) {
            return make_unary("unary-prefix",
                              prog1(S.token.value, next),
                              maybe_unary(allow_calls));
        }
        var val = expr_atom(allow_calls);
        while (is("operator") && HOP(UNARY_POSTFIX, S.token.value) && !S.token.nlb) {
            val = make_unary("unary-postfix", S.token.value, val);
            next();
        }
        return val;
    };
    function make_unary(tag, op, expr) {
        if ((op == "++" || op == "--") && !is_assignable(expr))
            croak("Invalid use of " + op + " operator");
        return as(tag, op, expr);
    };
    function expr_op(left, min_prec, no_in) {
        var op = is("operator") ? S.token.value : null;
        if (op && op == "in" && no_in) op = null;
        var prec = op != null ? PRECEDENCE[op] : null;
        if (prec != null && prec > min_prec) {
            next();
            var right = expr_op(maybe_unary(true), prec, no_in);
            return expr_op(as("binary", op, left, right), min_prec, no_in);
        }
        return left;
    };
    function expr_ops(no_in) {
        return expr_op(maybe_unary(true), 0, no_in);
    };
    function maybe_conditional(no_in) {
        var expr = expr_ops(no_in);
        if (is("operator", "?")) {
            next();
            var yes = expression(false);
            expect(":");
            return as("conditional", expr, yes, expression(false, no_in));
        }
        return expr;
    };
    function is_assignable(expr) {
        if (!exigent_mode) return true;
        switch (expr[0]+"") {
          case "dot":
          case "sub":
          case "new":
          case "call":
            return true;
          case "name":
            return expr[1] != "this";
        }
    };
    function maybe_assign(no_in) {
        var left = maybe_conditional(no_in), val = S.token.value;
        if (is("operator") && HOP(ASSIGNMENT, val)) {
            if (is_assignable(left)) {
                next();
                return as("assign", ASSIGNMENT[val], left, maybe_assign(no_in));
            }
            croak("Invalid assignment");
        }
        return left;
    };
    var expression = maybe_embed_tokens(function(commas, no_in) {
        if (arguments.length == 0)
            commas = true;
        var expr = maybe_assign(no_in);
        if (commas && is("punc", ",")) {
            next();
            return as("seq", expr, expression(true, no_in));
        }
        return expr;
    });
    function in_loop(cont) {
        try {
            ++S.in_loop;
            return cont();
        } finally {
            --S.in_loop;
        }
    };
    return as("toplevel", (function(a){
        while (!is("eof"))
            a.push(statement());
        return a;
    })([]));
};
function curry(f) {
    var args = slice(arguments, 1);
    return function() { return f.apply(this, args.concat(slice(arguments))); };
};
function prog1(ret) {
    if (ret instanceof Function)
        ret = ret();
    for (var i = 1, n = arguments.length; --n > 0; ++i)
        arguments[i]();
    return ret;
};
function array_to_hash(a) {
    var ret = {};
    for (var i = 0; i < a.length; ++i)
        ret[a[i]] = true;
    return ret;
};
function slice(a, start) {
    return Array.prototype.slice.call(a, start || 0);
};
function characters(str) {
    return str.split("");
};
function member(name, array) {
    for (var i = array.length; --i >= 0;)
        if (array[i] == name)
            return true;
    return false;
};
function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};
var warn = function() {};
exports.tokenizer = tokenizer;
exports.parse = parse;
exports.slice = slice;
exports.curry = curry;
exports.member = member;
exports.array_to_hash = array_to_hash;
exports.PRECEDENCE = PRECEDENCE;
exports.KEYWORDS_ATOM = KEYWORDS_ATOM;
exports.RESERVED_WORDS = RESERVED_WORDS;
exports.KEYWORDS = KEYWORDS;
exports.ATOMIC_START_TOKEN = ATOMIC_START_TOKEN;
exports.OPERATORS = OPERATORS;
exports.is_alphanumeric_char = is_alphanumeric_char;
exports.is_identifier_start = is_identifier_start;
exports.is_identifier_char = is_identifier_char;
exports.set_logger = function(logger) {
    warn = logger;
};
}(Uglify));
(function(exports) {
var jsp = require("./parse-js"),
    curry = jsp.curry,
    slice = jsp.slice,
    member = jsp.member,
    is_identifier_char = jsp.is_identifier_char,
    PRECEDENCE = jsp.PRECEDENCE,
    OPERATORS = jsp.OPERATORS;
function ast_walker() {
    function _vardefs(defs) {
        return [ this[0], MAP(defs, function(def){
            var a = [ def[0] ];
            if (def.length > 1)
                a[1] = walk(def[1]);
            return a;
        }) ];
    };
    function _block(statements) {
        var out = [ this[0] ];
        if (statements != null)
            out.push(MAP(statements, walk));
        return out;
    };
    var walkers = {
        "string": function(str) {
            return [ this[0], str ];
        },
        "num": function(num) {
            return [ this[0], num ];
        },
        "name": function(name) {
            return [ this[0], name ];
        },
        "toplevel": function(statements) {
            return [ this[0], MAP(statements, walk) ];
        },
        "block": _block,
        "splice": _block,
        "var": _vardefs,
        "const": _vardefs,
        "try": function(t, c, f) {
            return [
                this[0],
                MAP(t, walk),
                c != null ? [ c[0], MAP(c[1], walk) ] : null,
                f != null ? MAP(f, walk) : null
            ];
        },
        "throw": function(expr) {
            return [ this[0], walk(expr) ];
        },
        "new": function(ctor, args) {
            return [ this[0], walk(ctor), MAP(args, walk) ];
        },
        "switch": function(expr, body) {
            return [ this[0], walk(expr), MAP(body, function(branch){
                return [ branch[0] ? walk(branch[0]) : null,
                         MAP(branch[1], walk) ];
            }) ];
        },
        "break": function(label) {
            return [ this[0], label ];
        },
        "continue": function(label) {
            return [ this[0], label ];
        },
        "conditional": function(cond, t, e) {
            return [ this[0], walk(cond), walk(t), walk(e) ];
        },
        "assign": function(op, lvalue, rvalue) {
            return [ this[0], op, walk(lvalue), walk(rvalue) ];
        },
        "dot": function(expr) {
            return [ this[0], walk(expr) ].concat(slice(arguments, 1));
        },
        "call": function(expr, args) {
            return [ this[0], walk(expr), MAP(args, walk) ];
        },
        "function": function(name, args, body) {
            return [ this[0], name, args.slice(), MAP(body, walk) ];
        },
        "debugger": function() {
            return [ this[0] ];
        },
        "defun": function(name, args, body) {
            return [ this[0], name, args.slice(), MAP(body, walk) ];
        },
        "if": function(conditional, t, e) {
            return [ this[0], walk(conditional), walk(t), walk(e) ];
        },
        "for": function(init, cond, step, block) {
            return [ this[0], walk(init), walk(cond), walk(step), walk(block) ];
        },
        "for-in": function(vvar, key, hash, block) {
            return [ this[0], walk(vvar), walk(key), walk(hash), walk(block) ];
        },
        "while": function(cond, block) {
            return [ this[0], walk(cond), walk(block) ];
        },
        "do": function(cond, block) {
            return [ this[0], walk(cond), walk(block) ];
        },
        "return": function(expr) {
            return [ this[0], walk(expr) ];
        },
        "binary": function(op, left, right) {
            return [ this[0], op, walk(left), walk(right) ];
        },
        "unary-prefix": function(op, expr) {
            return [ this[0], op, walk(expr) ];
        },
        "unary-postfix": function(op, expr) {
            return [ this[0], op, walk(expr) ];
        },
        "sub": function(expr, subscript) {
            return [ this[0], walk(expr), walk(subscript) ];
        },
        "object": function(props) {
            return [ this[0], MAP(props, function(p){
                return p.length == 2
                    ? [ p[0], walk(p[1]) ]
                    : [ p[0], walk(p[1]), p[2] ];
            }) ];
        },
        "regexp": function(rx, mods) {
            return [ this[0], rx, mods ];
        },
        "array": function(elements) {
            return [ this[0], MAP(elements, walk) ];
        },
        "stat": function(stat) {
            return [ this[0], walk(stat) ];
        },
        "seq": function() {
            return [ this[0] ].concat(MAP(slice(arguments), walk));
        },
        "label": function(name, block) {
            return [ this[0], name, walk(block) ];
        },
        "with": function(expr, block) {
            return [ this[0], walk(expr), walk(block) ];
        },
        "atom": function(name) {
            return [ this[0], name ];
        },
        "directive": function(dir) {
            return [ this[0], dir ];
        }
    };
    var user = {};
    var stack = [];
    function walk(ast) {
        if (ast == null)
            return null;
        try {
            stack.push(ast);
            var type = ast[0];
            var gen = user[type];
            if (gen) {
                var ret = gen.apply(ast, ast.slice(1));
                if (ret != null)
                    return ret;
            }
            gen = walkers[type];
            return gen.apply(ast, ast.slice(1));
        } finally {
            stack.pop();
        }
    };
    function dive(ast) {
        if (ast == null)
            return null;
        try {
            stack.push(ast);
            return walkers[ast[0]].apply(ast, ast.slice(1));
        } finally {
            stack.pop();
        }
    };
    function with_walkers(walkers, cont){
        var save = {}, i;
        for (i in walkers) if (HOP(walkers, i)) {
            save[i] = user[i];
            user[i] = walkers[i];
        }
        var ret = cont();
        for (i in save) if (HOP(save, i)) {
            if (!save[i]) delete user[i];
            else user[i] = save[i];
        }
        return ret;
    };
    return {
        walk: walk,
        dive: dive,
        with_walkers: with_walkers,
        parent: function() {
            return stack[stack.length - 2];
        },
        stack: function() {
            return stack;
        }
    };
};
function Scope(parent) {
    this.names = {};
    this.mangled = {};
    this.rev_mangled = {};
    this.cname = -1;
    this.refs = {};
    this.uses_with = false;
    this.uses_eval = false;
    this.directives = [];
    this.parent = parent;
    this.children = [];
    if (parent) {
        this.level = parent.level + 1;
        parent.children.push(this);
    } else {
        this.level = 0;
    }
};
function base54_digits() {
    if (typeof DIGITS_OVERRIDE_FOR_TESTING != "undefined")
        return DIGITS_OVERRIDE_FOR_TESTING;
    else
        return "etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXV$JKQGYZ0516372984";
}
var base54 = (function(){
    var DIGITS = base54_digits();
    return function(num) {
        var ret = "", base = 54;
        do {
            ret += DIGITS.charAt(num % base);
            num = Math.floor(num / base);
            base = 64;
        } while (num > 0);
        return ret;
    };
})();
Scope.prototype = {
    has: function(name) {
        for (var s = this; s; s = s.parent)
            if (HOP(s.names, name))
                return s;
    },
    has_mangled: function(mname) {
        for (var s = this; s; s = s.parent)
            if (HOP(s.rev_mangled, mname))
                return s;
    },
    toJSON: function() {
        return {
            names: this.names,
            uses_eval: this.uses_eval,
            uses_with: this.uses_with
        };
    },
    next_mangled: function() {
        for (;;) {
            var m = base54(++this.cname), prior;
            prior = this.has_mangled(m);
            if (prior && this.refs[prior.rev_mangled[m]] === prior)
                continue;
            prior = this.has(m);
            if (prior && prior !== this && this.refs[m] === prior && !prior.has_mangled(m))
                continue;
            if (HOP(this.refs, m) && this.refs[m] == null)
                continue;
            if (!is_identifier(m))
                continue;
            return m;
        }
    },
    set_mangle: function(name, m) {
        this.rev_mangled[m] = name;
        return this.mangled[name] = m;
    },
    get_mangled: function(name, newMangle) {
        if (this.uses_eval || this.uses_with) return name;
        var s = this.has(name);
        if (!s) return name;
        if (HOP(s.mangled, name)) return s.mangled[name];
        if (!newMangle) return name;
        return s.set_mangle(name, s.next_mangled());
    },
    references: function(name) {
        return name && !this.parent || this.uses_with || this.uses_eval || this.refs[name];
    },
    define: function(name, type) {
        if (name != null) {
            if (type == "var" || !HOP(this.names, name))
                this.names[name] = type || "var";
            return name;
        }
    },
    active_directive: function(dir) {
        return member(dir, this.directives) || this.parent && this.parent.active_directive(dir);
    }
};
function ast_add_scope(ast) {
    var current_scope = null;
    var w = ast_walker(), walk = w.walk;
    var having_eval = [];
    function with_new_scope(cont) {
        current_scope = new Scope(current_scope);
        current_scope.labels = new Scope();
        var ret = current_scope.body = cont();
        ret.scope = current_scope;
        current_scope = current_scope.parent;
        return ret;
    };
    function define(name, type) {
        return current_scope.define(name, type);
    };
    function reference(name) {
        current_scope.refs[name] = true;
    };
    function _lambda(name, args, body) {
        var is_defun = this[0] == "defun";
        return [ this[0], is_defun ? define(name, "defun") : name, args, with_new_scope(function(){
            if (!is_defun) define(name, "lambda");
            MAP(args, function(name){ define(name, "arg") });
            return MAP(body, walk);
        })];
    };
    function _vardefs(type) {
        return function(defs) {
            MAP(defs, function(d){
                define(d[0], type);
                if (d[1]) reference(d[0]);
            });
        };
    };
    function _breacont(label) {
        if (label)
            current_scope.labels.refs[label] = true;
    };
    return with_new_scope(function(){
        var ret = w.with_walkers({
            "function": _lambda,
            "defun": _lambda,
            "label": function(name, stat) { current_scope.labels.define(name) },
            "break": _breacont,
            "continue": _breacont,
            "with": function(expr, block) {
                for (var s = current_scope; s; s = s.parent)
                    s.uses_with = true;
            },
            "var": _vardefs("var"),
            "const": _vardefs("const"),
            "try": function(t, c, f) {
                if (c != null) return [
                    this[0],
                    MAP(t, walk),
                    [ define(c[0], "catch"), MAP(c[1], walk) ],
                    f != null ? MAP(f, walk) : null
                ];
            },
            "name": function(name) {
                if (name == "eval")
                    having_eval.push(current_scope);
                reference(name);
            }
        }, function(){
            return walk(ast);
        });
        MAP(having_eval, function(scope){
            if (!scope.has("eval")) while (scope) {
                scope.uses_eval = true;
                scope = scope.parent;
            }
        });
        function fixrefs(scope, i) {
            for (i = scope.children.length; --i >= 0;)
                fixrefs(scope.children[i]);
            for (i in scope.refs) if (HOP(scope.refs, i)) {
                for (var origin = scope.has(i), s = scope; s; s = s.parent) {
                    s.refs[i] = origin;
                    if (s === origin) break;
                }
            }
        };
        fixrefs(current_scope);
        return ret;
    });
};
function ast_mangle(ast, options) {
    var w = ast_walker(), walk = w.walk, scope;
    options = defaults(options, {
        mangle : true,
        toplevel : false,
        defines : null,
        except : null,
        no_functions : false
    });
    function get_mangled(name, newMangle) {
        if (!options.mangle) return name;
        if (!options.toplevel && !scope.parent) return name;
        if (options.except && member(name, options.except))
            return name;
        if (options.no_functions && HOP(scope.names, name) &&
            (scope.names[name] == 'defun' || scope.names[name] == 'lambda'))
            return name;
        return scope.get_mangled(name, newMangle);
    };
    function get_define(name) {
        if (options.defines) {
            if (!scope.has(name)) {
                if (HOP(options.defines, name)) {
                    return options.defines[name];
                }
            }
            return null;
        }
    };
    function _lambda(name, args, body) {
        if (!options.no_functions && options.mangle) {
            var is_defun = this[0] == "defun", extra;
            if (name) {
                if (is_defun) name = get_mangled(name);
                else if (body.scope.references(name)) {
                    extra = {};
                    if (!(scope.uses_eval || scope.uses_with))
                        name = extra[name] = scope.next_mangled();
                    else
                        extra[name] = name;
                }
                else name = null;
            }
        }
        body = with_scope(body.scope, function(){
            args = MAP(args, function(name){ return get_mangled(name) });
            return MAP(body, walk);
        }, extra);
        return [ this[0], name, args, body ];
    };
    function with_scope(s, cont, extra) {
        var _scope = scope;
        scope = s;
        if (extra) for (var i in extra) if (HOP(extra, i)) {
            s.set_mangle(i, extra[i]);
        }
        for (var i in s.names) if (HOP(s.names, i)) {
            get_mangled(i, true);
        }
        var ret = cont();
        ret.scope = s;
        scope = _scope;
        return ret;
    };
    function _vardefs(defs) {
        return [ this[0], MAP(defs, function(d){
            return [ get_mangled(d[0]), walk(d[1]) ];
        }) ];
    };
    function _breacont(label) {
        if (label) return [ this[0], scope.labels.get_mangled(label) ];
    };
    return w.with_walkers({
        "function": _lambda,
        "defun": function() {
            var ast = _lambda.apply(this, arguments);
            switch (w.parent()[0]) {
              case "toplevel":
              case "function":
              case "defun":
                return MAP.at_top(ast);
            }
            return ast;
        },
        "label": function(label, stat) {
            if (scope.labels.refs[label]) return [
                this[0],
                scope.labels.get_mangled(label, true),
                walk(stat)
            ];
            return walk(stat);
        },
        "break": _breacont,
        "continue": _breacont,
        "var": _vardefs,
        "const": _vardefs,
        "name": function(name) {
            return get_define(name) || [ this[0], get_mangled(name) ];
        },
        "try": function(t, c, f) {
            return [ this[0],
                     MAP(t, walk),
                     c != null ? [ get_mangled(c[0]), MAP(c[1], walk) ] : null,
                     f != null ? MAP(f, walk) : null ];
        },
        "toplevel": function(body) {
            var self = this;
            return with_scope(self.scope, function(){
                return [ self[0], MAP(body, walk) ];
            });
        },
        "directive": function() {
            return MAP.at_top(this);
        }
    }, function() {
        return walk(ast_add_scope(ast));
    });
};
var warn = function(){};
function best_of(ast1, ast2) {
    return gen_code(ast1).length > gen_code(ast2[0] == "stat" ? ast2[1] : ast2).length ? ast2 : ast1;
};
function last_stat(b) {
    if (b[0] == "block" && b[1] && b[1].length > 0)
        return b[1][b[1].length - 1];
    return b;
}
function aborts(t) {
    if (t) switch (last_stat(t)[0]) {
      case "return":
      case "break":
      case "continue":
      case "throw":
        return true;
    }
};
function boolean_expr(expr) {
    return ( (expr[0] == "unary-prefix"
              && member(expr[1], [ "!", "delete" ])) ||
             (expr[0] == "binary"
              && member(expr[1], [ "in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">" ])) ||
             (expr[0] == "binary"
              && member(expr[1], [ "&&", "||" ])
              && boolean_expr(expr[2])
              && boolean_expr(expr[3])) ||
             (expr[0] == "conditional"
              && boolean_expr(expr[2])
              && boolean_expr(expr[3])) ||
             (expr[0] == "assign"
              && expr[1] === true
              && boolean_expr(expr[3])) ||
             (expr[0] == "seq"
              && boolean_expr(expr[expr.length - 1]))
           );
};
function empty(b) {
    return !b || (b[0] == "block" && (!b[1] || b[1].length == 0));
};
function is_string(node) {
    return (node[0] == "string" ||
            node[0] == "unary-prefix" && node[1] == "typeof" ||
            node[0] == "binary" && node[1] == "+" &&
            (is_string(node[2]) || is_string(node[3])));
};
var when_constant = (function(){
    var $NOT_CONSTANT = {};
    function evaluate(expr) {
        switch (expr[0]) {
          case "string":
          case "num":
            return expr[1];
          case "name":
          case "atom":
            switch (expr[1]) {
              case "true": return true;
              case "false": return false;
              case "null": return null;
            }
            break;
          case "unary-prefix":
            switch (expr[1]) {
              case "!": return !evaluate(expr[2]);
              case "typeof": return typeof evaluate(expr[2]);
              case "~": return ~evaluate(expr[2]);
              case "-": return -evaluate(expr[2]);
              case "+": return +evaluate(expr[2]);
            }
            break;
          case "binary":
            var left = expr[2], right = expr[3];
            switch (expr[1]) {
              case "&&" : return evaluate(left) && evaluate(right);
              case "||" : return evaluate(left) || evaluate(right);
              case "|" : return evaluate(left) | evaluate(right);
              case "&" : return evaluate(left) & evaluate(right);
              case "^" : return evaluate(left) ^ evaluate(right);
              case "+" : return evaluate(left) + evaluate(right);
              case "*" : return evaluate(left) * evaluate(right);
              case "/" : return evaluate(left) / evaluate(right);
              case "%" : return evaluate(left) % evaluate(right);
              case "-" : return evaluate(left) - evaluate(right);
              case "<<" : return evaluate(left) << evaluate(right);
              case ">>" : return evaluate(left) >> evaluate(right);
              case ">>>" : return evaluate(left) >>> evaluate(right);
              case "==" : return evaluate(left) == evaluate(right);
              case "===" : return evaluate(left) === evaluate(right);
              case "!=" : return evaluate(left) != evaluate(right);
              case "!==" : return evaluate(left) !== evaluate(right);
              case "<" : return evaluate(left) < evaluate(right);
              case "<=" : return evaluate(left) <= evaluate(right);
              case ">" : return evaluate(left) > evaluate(right);
              case ">=" : return evaluate(left) >= evaluate(right);
              case "in" : return evaluate(left) in evaluate(right);
              case "instanceof" : return evaluate(left) instanceof evaluate(right);
            }
        }
        throw $NOT_CONSTANT;
    };
    return function(expr, yes, no) {
        try {
            var val = evaluate(expr), ast;
            switch (typeof val) {
              case "string": ast = [ "string", val ]; break;
              case "number": ast = [ "num", val ]; break;
              case "boolean": ast = [ "name", String(val) ]; break;
              default:
                if (val === null) { ast = [ "atom", "null" ]; break; }
                throw new Error("Can't handle constant of type: " + (typeof val));
            }
            return yes.call(expr, ast, val);
        } catch(ex) {
            if (ex === $NOT_CONSTANT) {
                if (expr[0] == "binary"
                    && (expr[1] == "===" || expr[1] == "!==")
                    && ((is_string(expr[2]) && is_string(expr[3]))
                        || (boolean_expr(expr[2]) && boolean_expr(expr[3])))) {
                    expr[1] = expr[1].substr(0, 2);
                }
                else if (no && expr[0] == "binary"
                         && (expr[1] == "||" || expr[1] == "&&")) {
                    try {
                        var lval = evaluate(expr[2]);
                        expr = ((expr[1] == "&&" && (lval ? expr[3] : lval)) ||
                                (expr[1] == "||" && (lval ? lval : expr[3])) ||
                                expr);
                    } catch(ex2) {
                    }
                }
                return no ? no.call(expr, expr) : null;
            }
            else throw ex;
        }
    };
})();
function warn_unreachable(ast) {
    if (!empty(ast))
        warn("Dropping unreachable code: " + gen_code(ast, true));
};
function prepare_ifs(ast) {
    var w = ast_walker(), walk = w.walk;
    function redo_if(statements) {
        statements = MAP(statements, walk);
        for (var i = 0; i < statements.length; ++i) {
            var fi = statements[i];
            if (fi[0] != "if") continue;
            if (fi[3]) continue;
            var t = fi[2];
            if (!aborts(t)) continue;
            var conditional = walk(fi[1]);
            var e_body = redo_if(statements.slice(i + 1));
            var e = e_body.length == 1 ? e_body[0] : [ "block", e_body ];
            return statements.slice(0, i).concat([ [
                fi[0],
                conditional,
                t,
                e
            ] ]);
        }
        return statements;
    };
    function redo_if_lambda(name, args, body) {
        body = redo_if(body);
        return [ this[0], name, args, body ];
    };
    function redo_if_block(statements) {
        return [ this[0], statements != null ? redo_if(statements) : null ];
    };
    return w.with_walkers({
        "defun": redo_if_lambda,
        "function": redo_if_lambda,
        "block": redo_if_block,
        "splice": redo_if_block,
        "toplevel": function(statements) {
            return [ this[0], redo_if(statements) ];
        },
        "try": function(t, c, f) {
            return [
                this[0],
                redo_if(t),
                c != null ? [ c[0], redo_if(c[1]) ] : null,
                f != null ? redo_if(f) : null
            ];
        }
    }, function() {
        return walk(ast);
    });
};
function for_side_effects(ast, handler) {
    var w = ast_walker(), walk = w.walk;
    var $stop = {}, $restart = {};
    function stop() { throw $stop };
    function restart() { throw $restart };
    function found(){ return handler.call(this, this, w, stop, restart) };
    function unary(op) {
        if (op == "++" || op == "--")
            return found.apply(this, arguments);
    };
    function binary(op) {
        if (op == "&&" || op == "||")
            return found.apply(this, arguments);
    };
    return w.with_walkers({
        "try": found,
        "throw": found,
        "return": found,
        "new": found,
        "switch": found,
        "break": found,
        "continue": found,
        "assign": found,
        "call": found,
        "if": found,
        "for": found,
        "for-in": found,
        "while": found,
        "do": found,
        "return": found,
        "unary-prefix": unary,
        "unary-postfix": unary,
        "conditional": found,
        "binary": binary,
        "defun": found
    }, function(){
        while (true) try {
            walk(ast);
            break;
        } catch(ex) {
            if (ex === $stop) break;
            if (ex === $restart) continue;
            throw ex;
        }
    });
};
function ast_lift_variables(ast) {
    var w = ast_walker(), walk = w.walk, scope;
    function do_body(body, env) {
        var _scope = scope;
        scope = env;
        body = MAP(body, walk);
        var hash = {}, names = MAP(env.names, function(type, name){
            if (type != "var") return MAP.skip;
            if (!env.references(name)) return MAP.skip;
            hash[name] = true;
            return [ name ];
        });
        if (names.length > 0) {
            for_side_effects([ "block", body ], function(ast, walker, stop, restart) {
                if (ast[0] == "assign"
                    && ast[1] === true
                    && ast[2][0] == "name"
                    && HOP(hash, ast[2][1])) {
                    for (var i = names.length; --i >= 0;) {
                        if (names[i][0] == ast[2][1]) {
                            if (names[i][1])
                                stop();
                            names[i][1] = ast[3];
                            names.push(names.splice(i, 1)[0]);
                            break;
                        }
                    }
                    var p = walker.parent();
                    if (p[0] == "seq") {
                        var a = p[2];
                        a.unshift(0, p.length);
                        p.splice.apply(p, a);
                    }
                    else if (p[0] == "stat") {
                        p.splice(0, p.length, "block");
                    }
                    else {
                        stop();
                    }
                    restart();
                }
                stop();
            });
            body.unshift([ "var", names ]);
        }
        scope = _scope;
        return body;
    };
    function _vardefs(defs) {
        var ret = null;
        for (var i = defs.length; --i >= 0;) {
            var d = defs[i];
            if (!d[1]) continue;
            d = [ "assign", true, [ "name", d[0] ], d[1] ];
            if (ret == null) ret = d;
            else ret = [ "seq", d, ret ];
        }
        if (ret == null && w.parent()[0] != "for") {
            if (w.parent()[0] == "for-in")
                return [ "name", defs[0][0] ];
            return MAP.skip;
        }
        return [ "stat", ret ];
    };
    function _toplevel(body) {
        return [ this[0], do_body(body, this.scope) ];
    };
    return w.with_walkers({
        "function": function(name, args, body){
            for (var i = args.length; --i >= 0 && !body.scope.references(args[i]);)
                args.pop();
            if (!body.scope.references(name)) name = null;
            return [ this[0], name, args, do_body(body, body.scope) ];
        },
        "defun": function(name, args, body){
            if (!scope.references(name)) return MAP.skip;
            for (var i = args.length; --i >= 0 && !body.scope.references(args[i]);)
                args.pop();
            return [ this[0], name, args, do_body(body, body.scope) ];
        },
        "var": _vardefs,
        "toplevel": _toplevel
    }, function(){
        return walk(ast_add_scope(ast));
    });
};
function ast_squeeze(ast, options) {
    ast = squeeze_1(ast, options);
    ast = squeeze_2(ast, options);
    return ast;
};
function squeeze_1(ast, options) {
    options = defaults(options, {
        make_seqs : true,
        dead_code : true,
        no_warnings : false,
        keep_comps : true,
        unsafe : false
    });
    var w = ast_walker(), walk = w.walk, scope;
    function negate(c) {
        var not_c = [ "unary-prefix", "!", c ];
        switch (c[0]) {
          case "unary-prefix":
            return c[1] == "!" && boolean_expr(c[2]) ? c[2] : not_c;
          case "seq":
            c = slice(c);
            c[c.length - 1] = negate(c[c.length - 1]);
            return c;
          case "conditional":
            return best_of(not_c, [ "conditional", c[1], negate(c[2]), negate(c[3]) ]);
          case "binary":
            var op = c[1], left = c[2], right = c[3];
            if (!options.keep_comps) switch (op) {
              case "<=" : return [ "binary", ">", left, right ];
              case "<" : return [ "binary", ">=", left, right ];
              case ">=" : return [ "binary", "<", left, right ];
              case ">" : return [ "binary", "<=", left, right ];
            }
            switch (op) {
              case "==" : return [ "binary", "!=", left, right ];
              case "!=" : return [ "binary", "==", left, right ];
              case "===" : return [ "binary", "!==", left, right ];
              case "!==" : return [ "binary", "===", left, right ];
              case "&&" : return best_of(not_c, [ "binary", "||", negate(left), negate(right) ]);
              case "||" : return best_of(not_c, [ "binary", "&&", negate(left), negate(right) ]);
            }
            break;
        }
        return not_c;
    };
    function make_conditional(c, t, e) {
        var make_real_conditional = function() {
            if (c[0] == "unary-prefix" && c[1] == "!") {
                return e ? [ "conditional", c[2], e, t ] : [ "binary", "||", c[2], t ];
            } else {
                return e ? best_of(
                    [ "conditional", c, t, e ],
                    [ "conditional", negate(c), e, t ]
                ) : [ "binary", "&&", c, t ];
            }
        };
        return when_constant(c, function(ast, val){
            warn_unreachable(val ? e : t);
            return (val ? t : e);
        }, make_real_conditional);
    };
    function rmblock(block) {
        if (block != null && block[0] == "block" && block[1]) {
            if (block[1].length == 1)
                block = block[1][0];
            else if (block[1].length == 0)
                block = [ "block" ];
        }
        return block;
    };
    function _lambda(name, args, body) {
        return [ this[0], name, args, tighten(body, "lambda") ];
    };
    function tighten(statements, block_type) {
        statements = MAP(statements, walk);
        statements = statements.reduce(function(a, stat){
            if (stat[0] == "block") {
                if (stat[1]) {
                    a.push.apply(a, stat[1]);
                }
            } else {
                a.push(stat);
            }
            return a;
        }, []);
        statements = (function(a, prev){
            statements.forEach(function(cur){
                if (prev && ((cur[0] == "var" && prev[0] == "var") ||
                             (cur[0] == "const" && prev[0] == "const"))) {
                    prev[1] = prev[1].concat(cur[1]);
                } else {
                    a.push(cur);
                    prev = cur;
                }
            });
            return a;
        })([]);
        if (options.dead_code) statements = (function(a, has_quit){
            statements.forEach(function(st){
                if (has_quit) {
                    if (st[0] == "function" || st[0] == "defun") {
                        a.push(st);
                    }
                    else if (st[0] == "var" || st[0] == "const") {
                        if (!options.no_warnings)
                            warn("Variables declared in unreachable code");
                        st[1] = MAP(st[1], function(def){
                            if (def[1] && !options.no_warnings)
                                warn_unreachable([ "assign", true, [ "name", def[0] ], def[1] ]);
                            return [ def[0] ];
                        });
                        a.push(st);
                    }
                    else if (!options.no_warnings)
                        warn_unreachable(st);
                }
                else {
                    a.push(st);
                    if (member(st[0], [ "return", "throw", "break", "continue" ]))
                        has_quit = true;
                }
            });
            return a;
        })([]);
        if (options.make_seqs) statements = (function(a, prev) {
            statements.forEach(function(cur){
                if (prev && prev[0] == "stat" && cur[0] == "stat") {
                    prev[1] = [ "seq", prev[1], cur[1] ];
                } else {
                    a.push(cur);
                    prev = cur;
                }
            });
            if (a.length >= 2
                && a[a.length-2][0] == "stat"
                && (a[a.length-1][0] == "return" || a[a.length-1][0] == "throw")
                && a[a.length-1][1])
            {
                a.splice(a.length - 2, 2,
                         [ a[a.length-1][0],
                           [ "seq", a[a.length-2][1], a[a.length-1][1] ]]);
            }
            return a;
        })([]);
        return statements;
    };
    function make_if(c, t, e) {
        return when_constant(c, function(ast, val){
            if (val) {
                t = walk(t);
                warn_unreachable(e);
                return t || [ "block" ];
            } else {
                e = walk(e);
                warn_unreachable(t);
                return e || [ "block" ];
            }
        }, function() {
            return make_real_if(c, t, e);
        });
    };
    function abort_else(c, t, e) {
        var ret = [ [ "if", negate(c), e ] ];
        if (t[0] == "block") {
            if (t[1]) ret = ret.concat(t[1]);
        } else {
            ret.push(t);
        }
        return walk([ "block", ret ]);
    };
    function make_real_if(c, t, e) {
        c = walk(c);
        t = walk(t);
        e = walk(e);
        if (empty(e) && empty(t))
            return [ "stat", c ];
        if (empty(t)) {
            c = negate(c);
            t = e;
            e = null;
        } else if (empty(e)) {
            e = null;
        } else {
            (function(){
                var a = gen_code(c);
                var n = negate(c);
                var b = gen_code(n);
                if (b.length < a.length) {
                    var tmp = t;
                    t = e;
                    e = tmp;
                    c = n;
                }
            })();
        }
        var ret = [ "if", c, t, e ];
        if (t[0] == "if" && empty(t[3]) && empty(e)) {
            ret = best_of(ret, walk([ "if", [ "binary", "&&", c, t[1] ], t[2] ]));
        }
        else if (t[0] == "stat") {
            if (e) {
                if (e[0] == "stat")
                    ret = best_of(ret, [ "stat", make_conditional(c, t[1], e[1]) ]);
                else if (aborts(e))
                    ret = abort_else(c, t, e);
            }
            else {
                ret = best_of(ret, [ "stat", make_conditional(c, t[1]) ]);
            }
        }
        else if (e && t[0] == e[0] && (t[0] == "return" || t[0] == "throw") && t[1] && e[1]) {
            ret = best_of(ret, [ t[0], make_conditional(c, t[1], e[1] ) ]);
        }
        else if (e && aborts(t)) {
            ret = [ [ "if", c, t ] ];
            if (e[0] == "block") {
                if (e[1]) ret = ret.concat(e[1]);
            }
            else {
                ret.push(e);
            }
            ret = walk([ "block", ret ]);
        }
        else if (t && aborts(e)) {
            ret = abort_else(c, t, e);
        }
        return ret;
    };
    function _do_while(cond, body) {
        return when_constant(cond, function(cond, val){
            if (!val) {
                warn_unreachable(body);
                return [ "block" ];
            } else {
                return [ "for", null, null, null, walk(body) ];
            }
        });
    };
    return w.with_walkers({
        "sub": function(expr, subscript) {
            if (subscript[0] == "string") {
                var name = subscript[1];
                if (is_identifier(name))
                    return [ "dot", walk(expr), name ];
                else if (/^[1-9][0-9]*$/.test(name) || name === "0")
                    return [ "sub", walk(expr), [ "num", parseInt(name, 10) ] ];
            }
        },
        "if": make_if,
        "toplevel": function(body) {
            return [ "toplevel", tighten(body) ];
        },
        "switch": function(expr, body) {
            var last = body.length - 1;
            return [ "switch", walk(expr), MAP(body, function(branch, i){
                var block = tighten(branch[1]);
                if (i == last && block.length > 0) {
                    var node = block[block.length - 1];
                    if (node[0] == "break" && !node[1])
                        block.pop();
                }
                return [ branch[0] ? walk(branch[0]) : null, block ];
            }) ];
        },
        "function": _lambda,
        "defun": _lambda,
        "block": function(body) {
            if (body) return rmblock([ "block", tighten(body) ]);
        },
        "binary": function(op, left, right) {
            return when_constant([ "binary", op, walk(left), walk(right) ], function yes(c){
                return best_of(walk(c), this);
            }, function no() {
                return function(){
                    if(op != "==" && op != "!=") return;
                    var l = walk(left), r = walk(right);
                    if(l && l[0] == "unary-prefix" && l[1] == "!" && l[2][0] == "num")
                        left = ['num', +!l[2][1]];
                    else if (r && r[0] == "unary-prefix" && r[1] == "!" && r[2][0] == "num")
                        right = ['num', +!r[2][1]];
                    return ["binary", op, left, right];
                }() || this;
            });
        },
        "conditional": function(c, t, e) {
            return make_conditional(walk(c), walk(t), walk(e));
        },
        "try": function(t, c, f) {
            return [
                "try",
                tighten(t),
                c != null ? [ c[0], tighten(c[1]) ] : null,
                f != null ? tighten(f) : null
            ];
        },
        "unary-prefix": function(op, expr) {
            expr = walk(expr);
            var ret = [ "unary-prefix", op, expr ];
            if (op == "!")
                ret = best_of(ret, negate(expr));
            return when_constant(ret, function(ast, val){
                return walk(ast);
            }, function() { return ret });
        },
        "name": function(name) {
            switch (name) {
              case "true": return [ "unary-prefix", "!", [ "num", 0 ]];
              case "false": return [ "unary-prefix", "!", [ "num", 1 ]];
            }
        },
        "while": _do_while,
        "assign": function(op, lvalue, rvalue) {
            lvalue = walk(lvalue);
            rvalue = walk(rvalue);
            var okOps = [ '+', '-', '/', '*', '%', '>>', '<<', '>>>', '|', '^', '&' ];
            if (op === true && lvalue[0] === "name" && rvalue[0] === "binary" &&
                ~okOps.indexOf(rvalue[1]) && rvalue[2][0] === "name" &&
                rvalue[2][1] === lvalue[1]) {
                return [ this[0], rvalue[1], lvalue, rvalue[3] ]
            }
            return [ this[0], op, lvalue, rvalue ];
        },
        "call": function(expr, args) {
            expr = walk(expr);
            if (options.unsafe && expr[0] == "dot" && expr[1][0] == "string" && expr[2] == "toString") {
                return expr[1];
            }
            return [ this[0], expr, MAP(args, walk) ];
        },
        "num": function (num) {
            if (!isFinite(num))
                return [ "binary", "/", num === 1 / 0
                         ? [ "num", 1 ] : num === -1 / 0
                         ? [ "unary-prefix", "-", [ "num", 1 ] ]
                         : [ "num", 0 ], [ "num", 0 ] ];
            return [ this[0], num ];
        }
    }, function() {
        return walk(prepare_ifs(walk(prepare_ifs(ast))));
    });
};
function squeeze_2(ast, options) {
    var w = ast_walker(), walk = w.walk, scope;
    function with_scope(s, cont) {
        var save = scope, ret;
        scope = s;
        ret = cont();
        scope = save;
        return ret;
    };
    function lambda(name, args, body) {
        return [ this[0], name, args, with_scope(body.scope, curry(MAP, body, walk)) ];
    };
    return w.with_walkers({
        "directive": function(dir) {
            if (scope.active_directive(dir))
                return [ "block" ];
            scope.directives.push(dir);
        },
        "toplevel": function(body) {
            return [ this[0], with_scope(this.scope, curry(MAP, body, walk)) ];
        },
        "function": lambda,
        "defun": lambda
    }, function(){
        return walk(ast_add_scope(ast));
    });
};
var DOT_CALL_NO_PARENS = jsp.array_to_hash([
    "name",
    "array",
    "object",
    "string",
    "dot",
    "sub",
    "call",
    "regexp",
    "defun"
]);
function make_string(str, ascii_only) {
    var dq = 0, sq = 0;
    str = str.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(s){
        switch (s) {
          case "\\": return "\\\\";
          case "\b": return "\\b";
          case "\f": return "\\f";
          case "\n": return "\\n";
          case "\r": return "\\r";
          case "\u2028": return "\\u2028";
          case "\u2029": return "\\u2029";
          case '"': ++dq; return '"';
          case "'": ++sq; return "'";
          case "\0": return "\\0";
        }
        return s;
    });
    if (ascii_only) str = to_ascii(str);
    if (dq > sq) return "'" + str.replace(/\x27/g, "\\'") + "'";
    else return '"' + str.replace(/\x22/g, '\\"') + '"';
};
function to_ascii(str) {
    return str.replace(/[\u0080-\uffff]/g, function(ch) {
        var code = ch.charCodeAt(0).toString(16);
        while (code.length < 4) code = "0" + code;
        return "\\u" + code;
    });
};
var SPLICE_NEEDS_BRACKETS = jsp.array_to_hash([ "if", "while", "do", "for", "for-in", "with" ]);
function gen_code(ast, options) {
    options = defaults(options, {
        indent_start : 0,
        indent_level : 4,
        quote_keys : false,
        space_colon : false,
        beautify : false,
        ascii_only : false,
        inline_script: false
    });
    var beautify = !!options.beautify;
    var indentation = 0,
    newline = beautify ? "\n" : "",
    space = beautify ? " " : "";
    function encode_string(str) {
        var ret = make_string(str, options.ascii_only);
        if (options.inline_script)
            ret = ret.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1");
        return ret;
    };
    function make_name(name) {
        name = name.toString();
        if (options.ascii_only)
            name = to_ascii(name);
        return name;
    };
    function indent(line) {
        if (line == null)
            line = "";
        if (beautify)
            line = repeat_string(" ", options.indent_start + indentation * options.indent_level) + line;
        return line;
    };
    function with_indent(cont, incr) {
        if (incr == null) incr = 1;
        indentation += incr;
        try { return cont.apply(null, slice(arguments, 1)); }
        finally { indentation -= incr; }
    };
    function last_char(str) {
        str = str.toString();
        return str.charAt(str.length - 1);
    };
    function first_char(str) {
        return str.toString().charAt(0);
    };
    function add_spaces(a) {
        if (beautify)
            return a.join(" ");
        var b = [];
        for (var i = 0; i < a.length; ++i) {
            var next = a[i + 1];
            b.push(a[i]);
            if (next &&
                ((is_identifier_char(last_char(a[i])) && (is_identifier_char(first_char(next))
                                                          || first_char(next) == "\\")) ||
                 (/[\+\-]$/.test(a[i].toString()) && /^[\+\-]/.test(next.toString())))) {
                b.push(" ");
            }
        }
        return b.join("");
    };
    function add_commas(a) {
        return a.join("," + space);
    };
    function parenthesize(expr) {
        var gen = make(expr);
        for (var i = 1; i < arguments.length; ++i) {
            var el = arguments[i];
            if ((el instanceof Function && el(expr)) || expr[0] == el)
                return "(" + gen + ")";
        }
        return gen;
    };
    function best_of(a) {
        if (a.length == 1) {
            return a[0];
        }
        if (a.length == 2) {
            var b = a[1];
            a = a[0];
            return a.length <= b.length ? a : b;
        }
        return best_of([ a[0], best_of(a.slice(1)) ]);
    };
    function needs_parens(expr) {
        if (expr[0] == "function" || expr[0] == "object") {
            var a = slice(w.stack()), self = a.pop(), p = a.pop();
            while (p) {
                if (p[0] == "stat") return true;
                if (((p[0] == "seq" || p[0] == "call" || p[0] == "dot" || p[0] == "sub" || p[0] == "conditional") && p[1] === self) ||
                    ((p[0] == "binary" || p[0] == "assign" || p[0] == "unary-postfix") && p[2] === self)) {
                    self = p;
                    p = a.pop();
                } else {
                    return false;
                }
            }
        }
        return !HOP(DOT_CALL_NO_PARENS, expr[0]);
    };
    function make_num(num) {
        var str = num.toString(10), a = [ str.replace(/^0\./, ".").replace('e+', 'e') ], m;
        if (Math.floor(num) === num) {
            if (num >= 0) {
                a.push("0x" + num.toString(16).toLowerCase(),
                       "0" + num.toString(8));
            } else {
                a.push("-0x" + (-num).toString(16).toLowerCase(),
                       "-0" + (-num).toString(8));
            }
            if ((m = /^(.*?)(0+)$/.exec(num))) {
                a.push(m[1] + "e" + m[2].length);
            }
        } else if ((m = /^0?\.(0+)(.*)$/.exec(num))) {
            a.push(m[2] + "e-" + (m[1].length + m[2].length),
                   str.substr(str.indexOf(".")));
        }
        return best_of(a);
    };
    var w = ast_walker();
    var make = w.walk;
    return w.with_walkers({
        "string": encode_string,
        "num": make_num,
        "name": make_name,
        "debugger": function(){ return "debugger;" },
        "toplevel": function(statements) {
            return make_block_statements(statements)
                .join(newline + newline);
        },
        "splice": function(statements) {
            var parent = w.parent();
            if (HOP(SPLICE_NEEDS_BRACKETS, parent)) {
                return make_block.apply(this, arguments);
            } else {
                return MAP(make_block_statements(statements, true),
                           function(line, i) {
                               return i > 0 ? indent(line) : line;
                           }).join(newline);
            }
        },
        "block": make_block,
        "var": function(defs) {
            return "var " + add_commas(MAP(defs, make_1vardef)) + ";";
        },
        "const": function(defs) {
            return "const " + add_commas(MAP(defs, make_1vardef)) + ";";
        },
        "try": function(tr, ca, fi) {
            var out = [ "try", make_block(tr) ];
            if (ca) out.push("catch", "(" + ca[0] + ")", make_block(ca[1]));
            if (fi) out.push("finally", make_block(fi));
            return add_spaces(out);
        },
        "throw": function(expr) {
            return add_spaces([ "throw", make(expr) ]) + ";";
        },
        "new": function(ctor, args) {
            args = args.length > 0 ? "(" + add_commas(MAP(args, function(expr){
                return parenthesize(expr, "seq");
            })) + ")" : "";
            return add_spaces([ "new", parenthesize(ctor, "seq", "binary", "conditional", "assign", function(expr){
                var w = ast_walker(), has_call = {};
                try {
                    w.with_walkers({
                        "call": function() { throw has_call },
                        "function": function() { return this }
                    }, function(){
                        w.walk(expr);
                    });
                } catch(ex) {
                    if (ex === has_call)
                        return true;
                    throw ex;
                }
            }) + args ]);
        },
        "switch": function(expr, body) {
            return add_spaces([ "switch", "(" + make(expr) + ")", make_switch_block(body) ]);
        },
        "break": function(label) {
            var out = "break";
            if (label != null)
                out += " " + make_name(label);
            return out + ";";
        },
        "continue": function(label) {
            var out = "continue";
            if (label != null)
                out += " " + make_name(label);
            return out + ";";
        },
        "conditional": function(co, th, el) {
            return add_spaces([ parenthesize(co, "assign", "seq", "conditional"), "?",
                                parenthesize(th, "seq"), ":",
                                parenthesize(el, "seq") ]);
        },
        "assign": function(op, lvalue, rvalue) {
            if (op && op !== true) op += "=";
            else op = "=";
            return add_spaces([ make(lvalue), op, parenthesize(rvalue, "seq") ]);
        },
        "dot": function(expr) {
            var out = make(expr), i = 1;
            if (expr[0] == "num") {
                if (!/[a-f.]/i.test(out))
                    out += ".";
            } else if (expr[0] != "function" && needs_parens(expr))
                out = "(" + out + ")";
            while (i < arguments.length)
                out += "." + make_name(arguments[i++]);
            return out;
        },
        "call": function(func, args) {
            var f = make(func);
            if (f.charAt(0) != "(" && needs_parens(func))
                f = "(" + f + ")";
            return f + "(" + add_commas(MAP(args, function(expr){
                return parenthesize(expr, "seq");
            })) + ")";
        },
        "function": make_function,
        "defun": make_function,
        "if": function(co, th, el) {
            var out = [ "if", "(" + make(co) + ")", el ? make_then(th) : make(th) ];
            if (el) {
                out.push("else", make(el));
            }
            return add_spaces(out);
        },
        "for": function(init, cond, step, block) {
            var out = [ "for" ];
            init = (init != null ? make(init) : "").replace(/;*\s*$/, ";" + space);
            cond = (cond != null ? make(cond) : "").replace(/;*\s*$/, ";" + space);
            step = (step != null ? make(step) : "").replace(/;*\s*$/, "");
            var args = init + cond + step;
            if (args == "; ; ") args = ";;";
            out.push("(" + args + ")", make(block));
            return add_spaces(out);
        },
        "for-in": function(vvar, key, hash, block) {
            return add_spaces([ "for", "(" +
                                (vvar ? make(vvar).replace(/;+$/, "") : make(key)),
                                "in",
                                make(hash) + ")", make(block) ]);
        },
        "while": function(condition, block) {
            return add_spaces([ "while", "(" + make(condition) + ")", make(block) ]);
        },
        "do": function(condition, block) {
            return add_spaces([ "do", make(block), "while", "(" + make(condition) + ")" ]) + ";";
        },
        "return": function(expr) {
            var out = [ "return" ];
            if (expr != null) out.push(make(expr));
            return add_spaces(out) + ";";
        },
        "binary": function(operator, lvalue, rvalue) {
            var left = make(lvalue), right = make(rvalue);
            if (member(lvalue[0], [ "assign", "conditional", "seq" ]) ||
                lvalue[0] == "binary" && PRECEDENCE[operator] > PRECEDENCE[lvalue[1]] ||
                lvalue[0] == "function" && needs_parens(this)) {
                left = "(" + left + ")";
            }
            if (member(rvalue[0], [ "assign", "conditional", "seq" ]) ||
                rvalue[0] == "binary" && PRECEDENCE[operator] >= PRECEDENCE[rvalue[1]] &&
                !(rvalue[1] == operator && member(operator, [ "&&", "||", "*" ]))) {
                right = "(" + right + ")";
            }
            else if (!beautify && options.inline_script && (operator == "<" || operator == "<<")
                     && rvalue[0] == "regexp" && /^script/i.test(rvalue[1])) {
                right = " " + right;
            }
            return add_spaces([ left, operator, right ]);
        },
        "unary-prefix": function(operator, expr) {
            var val = make(expr);
            if (!(expr[0] == "num" || (expr[0] == "unary-prefix" && !HOP(OPERATORS, operator + expr[1])) || !needs_parens(expr)))
                val = "(" + val + ")";
            return operator + (jsp.is_alphanumeric_char(operator.charAt(0)) ? " " : "") + val;
        },
        "unary-postfix": function(operator, expr) {
            var val = make(expr);
            if (!(expr[0] == "num" || (expr[0] == "unary-postfix" && !HOP(OPERATORS, operator + expr[1])) || !needs_parens(expr)))
                val = "(" + val + ")";
            return val + operator;
        },
        "sub": function(expr, subscript) {
            var hash = make(expr);
            if (needs_parens(expr))
                hash = "(" + hash + ")";
            return hash + "[" + make(subscript) + "]";
        },
        "object": function(props) {
            var obj_needs_parens = needs_parens(this);
            if (props.length == 0)
                return obj_needs_parens ? "({})" : "{}";
            var out = "{" + newline + with_indent(function(){
                return MAP(props, function(p){
                    if (p.length == 3) {
                        return indent(make_function(p[0], p[1][2], p[1][3], p[2], true));
                    }
                    var key = p[0], val = parenthesize(p[1], "seq");
                    if (options.quote_keys) {
                        key = encode_string(key);
                    } else if ((typeof key == "number" || !beautify && +key + "" == key)
                               && parseFloat(key) >= 0) {
                        key = make_num(+key);
                    } else if (!is_identifier(key)) {
                        key = encode_string(key);
                    }
                    return indent(add_spaces(beautify && options.space_colon
                                             ? [ key, ":", val ]
                                             : [ key + ":", val ]));
                }).join("," + newline);
            }) + newline + indent("}");
            return obj_needs_parens ? "(" + out + ")" : out;
        },
        "regexp": function(rx, mods) {
            if (options.ascii_only) rx = to_ascii(rx);
            return "/" + rx + "/" + mods;
        },
        "array": function(elements) {
            if (elements.length == 0) return "[]";
            return add_spaces([ "[", add_commas(MAP(elements, function(el, i){
                if (!beautify && el[0] == "atom" && el[1] == "undefined") return i === elements.length - 1 ? "," : "";
                return parenthesize(el, "seq");
            })), "]" ]);
        },
        "stat": function(stmt) {
            return stmt != null
                ? make(stmt).replace(/;*\s*$/, ";")
                : ";";
        },
        "seq": function() {
            return add_commas(MAP(slice(arguments), make));
        },
        "label": function(name, block) {
            return add_spaces([ make_name(name), ":", make(block) ]);
        },
        "with": function(expr, block) {
            return add_spaces([ "with", "(" + make(expr) + ")", make(block) ]);
        },
        "atom": function(name) {
            return make_name(name);
        },
        "directive": function(dir) {
            return make_string(dir) + ";";
        }
    }, function(){ return make(ast) });
    function make_then(th) {
        if (th == null) return ";";
        if (th[0] == "do") {
            return make_block([ th ]);
        }
        var b = th;
        while (true) {
            var type = b[0];
            if (type == "if") {
                if (!b[3])
                    return make([ "block", [ th ]]);
                b = b[3];
            }
            else if (type == "while" || type == "do") b = b[2];
            else if (type == "for" || type == "for-in") b = b[4];
            else break;
        }
        return make(th);
    };
    function make_function(name, args, body, keyword, no_parens) {
        var out = keyword || "function";
        if (name) {
            out += " " + make_name(name);
        }
        out += "(" + add_commas(MAP(args, make_name)) + ")";
        out = add_spaces([ out, make_block(body) ]);
        return (!no_parens && needs_parens(this)) ? "(" + out + ")" : out;
    };
    function must_has_semicolon(node) {
        switch (node[0]) {
          case "with":
          case "while":
            return empty(node[2]) || must_has_semicolon(node[2]);
          case "for":
          case "for-in":
            return empty(node[4]) || must_has_semicolon(node[4]);
          case "if":
            if (empty(node[2]) && !node[3]) return true;
            if (node[3]) {
                if (empty(node[3])) return true;
                return must_has_semicolon(node[3]);
            }
            return must_has_semicolon(node[2]);
          case "directive":
            return true;
        }
    };
    function make_block_statements(statements, noindent) {
        for (var a = [], last = statements.length - 1, i = 0; i <= last; ++i) {
            var stat = statements[i];
            var code = make(stat);
            if (code != ";") {
                if (!beautify && i == last && !must_has_semicolon(stat)) {
                    code = code.replace(/;+\s*$/, "");
                }
                a.push(code);
            }
        }
        return noindent ? a : MAP(a, indent);
    };
    function make_switch_block(body) {
        var n = body.length;
        if (n == 0) return "{}";
        return "{" + newline + MAP(body, function(branch, i){
            var has_body = branch[1].length > 0, code = with_indent(function(){
                return indent(branch[0]
                              ? add_spaces([ "case", make(branch[0]) + ":" ])
                              : "default:");
            }, 0.5) + (has_body ? newline + with_indent(function(){
                return make_block_statements(branch[1]).join(newline);
            }) : "");
            if (!beautify && has_body && i < n - 1)
                code += ";";
            return code;
        }).join(newline) + newline + indent("}");
    };
    function make_block(statements) {
        if (!statements) return ";";
        if (statements.length == 0) return "{}";
        return "{" + newline + with_indent(function(){
            return make_block_statements(statements).join(newline);
        }) + newline + indent("}");
    };
    function make_1vardef(def) {
        var name = def[0], val = def[1];
        if (val != null)
            name = add_spaces([ make_name(name), "=", parenthesize(val, "seq") ]);
        return name;
    };
};
function split_lines(code, max_line_length) {
    var splits = [ 0 ];
    jsp.parse(function(){
        var next_token = jsp.tokenizer(code);
        var last_split = 0;
        var prev_token;
        function current_length(tok) {
            return tok.pos - last_split;
        };
        function split_here(tok) {
            last_split = tok.pos;
            splits.push(last_split);
        };
        function custom(){
            var tok = next_token.apply(this, arguments);
            out: {
                if (prev_token) {
                    if (prev_token.type == "keyword") break out;
                }
                if (current_length(tok) > max_line_length) {
                    switch (tok.type) {
                      case "keyword":
                      case "atom":
                      case "name":
                      case "punc":
                        split_here(tok);
                        break out;
                    }
                }
            }
            prev_token = tok;
            return tok;
        };
        custom.context = function() {
            return next_token.context.apply(this, arguments);
        };
        return custom;
    }());
    return splits.map(function(pos, i){
        return code.substring(pos, splits[i + 1] || code.length);
    }).join("\n");
};
function repeat_string(str, i) {
    if (i <= 0) return "";
    if (i == 1) return str;
    var d = repeat_string(str, i >> 1);
    d += d;
    if (i & 1) d += str;
    return d;
};
function defaults(args, defs) {
    var ret = {};
    if (args === true)
        args = {};
    for (var i in defs) if (HOP(defs, i)) {
        ret[i] = (args && HOP(args, i)) ? args[i] : defs[i];
    }
    return ret;
};
function is_identifier(name) {
    return /^[a-z_$][a-z0-9_$]*$/i.test(name)
        && name != "this"
        && !HOP(jsp.KEYWORDS_ATOM, name)
        && !HOP(jsp.RESERVED_WORDS, name)
        && !HOP(jsp.KEYWORDS, name);
};
function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};
var MAP;
(function(){
    MAP = function(a, f, o) {
        var ret = [], top = [], i;
        function doit() {
            var val = f.call(o, a[i], i);
            if (val instanceof AtTop) {
                val = val.v;
                if (val instanceof Splice) {
                    top.push.apply(top, val.v);
                } else {
                    top.push(val);
                }
            }
            else if (val != skip) {
                if (val instanceof Splice) {
                    ret.push.apply(ret, val.v);
                } else {
                    ret.push(val);
                }
            }
        };
        if (a instanceof Array) for (i = 0; i < a.length; ++i) doit();
        else for (i in a) if (HOP(a, i)) doit();
        return top.concat(ret);
    };
    MAP.at_top = function(val) { return new AtTop(val) };
    MAP.splice = function(val) { return new Splice(val) };
    var skip = MAP.skip = {};
    function AtTop(val) { this.v = val };
    function Splice(val) { this.v = val };
})();
exports.ast_walker = ast_walker;
exports.ast_mangle = ast_mangle;
exports.ast_squeeze = ast_squeeze;
exports.ast_lift_variables = ast_lift_variables;
exports.gen_code = gen_code;
exports.ast_add_scope = ast_add_scope;
exports.set_logger = function(logger) { warn = logger };
exports.make_string = make_string;
exports.split_lines = split_lines;
exports.MAP = MAP;
exports.ast_squeeze_more = require("./squeeze-more").ast_squeeze_more;
}(Uglify));
window.Streamline = { globals: {} };
var __filename = "<UNKNOWN>";
(function() {
    var narcissus = {
        options: {
            version: 185,
        },
        hostGlobal: this
    };
    Narcissus = narcissus;
})();
Narcissus.definitions = (function() {
    var tokens = [
        "END",
        "\n", ";",
        ",",
        "=",
        "?", ":", "CONDITIONAL",
        "||",
        "&&",
        "|",
        "^",
        "&",
        "==", "!=", "===", "!==",
        "<", "<=", ">=", ">",
        "<<", ">>", ">>>",
        "+", "-",
        "*", "/", "%",
        "!", "~", "UNARY_PLUS", "UNARY_MINUS",
        "++", "--",
        ".",
        "[", "]",
        "{", "}",
        "(", ")",
        "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX",
        "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER",
        "GROUP", "LIST", "LET_BLOCK", "ARRAY_COMP", "GENERATOR", "COMP_TAIL",
        "IDENTIFIER", "NUMBER", "STRING", "REGEXP",
        "break",
        "case", "catch", "const", "continue",
        "debugger", "default", "delete", "do",
        "else",
        "false", "finally", "for", "function",
        "if", "in", "instanceof",
        "let",
        "new", "null",
        "return",
        "switch",
        "this", "throw", "true", "try", "typeof",
        "var", "void",
        "yield",
        "while", "with",
    ];
    var statementStartTokens = [
        "break",
        "const", "continue",
        "debugger", "do",
        "for",
        "if",
        "return",
        "switch",
        "throw", "try",
        "var",
        "yield",
        "while", "with",
    ];
    var opTypeNames = {
        '\n': "NEWLINE",
        ';': "SEMICOLON",
        ',': "COMMA",
        '?': "HOOK",
        ':': "COLON",
        '||': "OR",
        '&&': "AND",
        '|': "BITWISE_OR",
        '^': "BITWISE_XOR",
        '&': "BITWISE_AND",
        '===': "STRICT_EQ",
        '==': "EQ",
        '=': "ASSIGN",
        '!==': "STRICT_NE",
        '!=': "NE",
        '<<': "LSH",
        '<=': "LE",
        '<': "LT",
        '>>>': "URSH",
        '>>': "RSH",
        '>=': "GE",
        '>': "GT",
        '++': "INCREMENT",
        '--': "DECREMENT",
        '+': "PLUS",
        '-': "MINUS",
        '*': "MUL",
        '/': "DIV",
        '%': "MOD",
        '!': "NOT",
        '~': "BITWISE_NOT",
        '.': "DOT",
        '[': "LEFT_BRACKET",
        ']': "RIGHT_BRACKET",
        '{': "LEFT_CURLY",
        '}': "RIGHT_CURLY",
        '(': "LEFT_PAREN",
        ')': "RIGHT_PAREN"
    };
    var keywords = {__proto__: null};
    var tokenIds = {};
    var consts = "const ";
    for (var i = 0, j = tokens.length; i < j; i++) {
        if (i > 0)
            consts += ", ";
        var t = tokens[i];
        var name;
        if (/^[a-z]/.test(t)) {
            name = t.toUpperCase();
            keywords[t] = i;
        } else {
            name = (/^\W/.test(t) ? opTypeNames[t] : t);
        }
        consts += name + " = " + i;
        tokenIds[name] = i;
        tokens[t] = i;
    }
    consts += ";";
    var isStatementStartCode = {__proto__: null};
    for (i = 0, j = statementStartTokens.length; i < j; i++)
        isStatementStartCode[keywords[statementStartTokens[i]]] = true;
    var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];
    for (i = 0, j = assignOps.length; i < j; i++) {
        t = assignOps[i];
        assignOps[t] = tokens[t];
    }
    function defineGetter(obj, prop, fn, dontDelete, dontEnum) {
        Object.defineProperty(obj, prop,
                              { get: fn, configurable: !dontDelete, enumerable: !dontEnum });
    }
    function defineProperty(obj, prop, val, dontDelete, readOnly, dontEnum) {
        Object.defineProperty(obj, prop,
                              { value: val, writable: !readOnly, configurable: !dontDelete,
                                enumerable: !dontEnum });
    }
    function isNativeCode(fn) {
        return ((typeof fn) === "function") && fn.toString().match(/\[native code\]/);
    }
    function getPropertyDescriptor(obj, name) {
        while (obj) {
            if (({}).hasOwnProperty.call(obj, name))
                return Object.getOwnPropertyDescriptor(obj, name);
            obj = Object.getPrototypeOf(obj);
        }
    }
    function getOwnProperties(obj) {
        var map = {};
        for (var name in Object.getOwnPropertyNames(obj))
            map[name] = Object.getOwnPropertyDescriptor(obj, name);
        return map;
    }
    function makePassthruHandler(obj) {
        return {
            getOwnPropertyDescriptor: function(name) {
                var desc = Object.getOwnPropertyDescriptor(obj, name);
                desc.configurable = true;
                return desc;
            },
            getPropertyDescriptor: function(name) {
                var desc = getPropertyDescriptor(obj, name);
                desc.configurable = true;
                return desc;
            },
            getOwnPropertyNames: function() {
                return Object.getOwnPropertyNames(obj);
            },
            defineProperty: function(name, desc) {
                Object.defineProperty(obj, name, desc);
            },
            "delete": function(name) { return delete obj[name]; },
            fix: function() {
                if (Object.isFrozen(obj)) {
                    return getOwnProperties(obj);
                }
                return undefined;
            },
            has: function(name) { return name in obj; },
            hasOwn: function(name) { return ({}).hasOwnProperty.call(obj, name); },
            get: function(receiver, name) { return obj[name]; },
            set: function(receiver, name, val) { obj[name] = val; return true; },
            enumerate: function() {
                var result = [];
                for (name in obj) { result.push(name); };
                return result;
            },
            keys: function() { return Object.keys(obj); }
        };
    }
    function noPropFound() { return undefined; }
    var hasOwnProperty = ({}).hasOwnProperty;
    function StringMap() {
        this.table = Object.create(null, {});
        this.size = 0;
    }
    StringMap.prototype = {
        has: function(x) { return hasOwnProperty.call(this.table, x); },
        set: function(x, v) {
            if (!hasOwnProperty.call(this.table, x))
                this.size++;
            this.table[x] = v;
        },
        get: function(x) { return this.table[x]; },
        getDef: function(x, thunk) {
            if (!hasOwnProperty.call(this.table, x)) {
                this.size++;
                this.table[x] = thunk();
            }
            return this.table[x];
        },
        forEach: function(f) {
            var table = this.table;
            for (var key in table)
                f.call(this, key, table[key]);
        },
        toString: function() { return "[object StringMap]" }
    };
    function Stack(elts) {
        this.elts = elts || null;
    }
    Stack.prototype = {
        push: function(x) {
            return new Stack({ top: x, rest: this.elts });
        },
        top: function() {
            if (!this.elts)
                throw new Error("empty stack");
            return this.elts.top;
        },
        isEmpty: function() {
            return this.top === null;
        },
        find: function(test) {
            for (var elts = this.elts; elts; elts = elts.rest) {
                if (test(elts.top))
                    return elts.top;
            }
            return null;
        },
        has: function(x) {
            return Boolean(this.find(function(elt) { return elt === x }));
        },
        forEach: function(f) {
            for (var elts = this.elts; elts; elts = elts.rest) {
                f(elts.top);
            }
        }
    };
    return {
        tokens: tokens,
        opTypeNames: opTypeNames,
        keywords: keywords,
        isStatementStartCode: isStatementStartCode,
        tokenIds: tokenIds,
        consts: consts,
        assignOps: assignOps,
        defineGetter: defineGetter,
        defineProperty: defineProperty,
        isNativeCode: isNativeCode,
        makePassthruHandler: makePassthruHandler,
        noPropFound: noPropFound,
        StringMap: StringMap,
        Stack: Stack
    };
}());
Narcissus.lexer = (function() {
    var definitions = Narcissus.definitions;
    eval(definitions.consts);
    var opTokens = {};
    for (var op in definitions.opTypeNames) {
        if (op === '\n' || op === '.')
            continue;
        var node = opTokens;
        for (var i = 0; i < op.length; i++) {
            var ch = op[i];
            if (!(ch in node))
                node[ch] = {};
            node = node[ch];
            node.op = op;
        }
    }
    function Tokenizer(s, f, l) {
        this.cursor = 0;
        this.source = String(s);
        this.tokens = [];
        this.tokenIndex = 0;
        this.lookahead = 0;
        this.scanNewlines = false;
        this.unexpectedEOF = false;
        this.filename = f || "";
        this.lineno = l || 1;
    }
    Tokenizer.prototype = {
        get done() {
            return this.peek(true) === END;
        },
        get token() {
            return this.tokens[this.tokenIndex];
        },
        match: function (tt, scanOperand) {
            return this.get(scanOperand) === tt || this.unget();
        },
        mustMatch: function (tt) {
            if (!this.match(tt)) {
                throw this.newSyntaxError("Missing " +
                                          definitions.tokens[tt].toLowerCase());
            }
            return this.token;
        },
        forceIdentifier: function() {
         if (!this.match(IDENTIFIER)) {
          if (this.get() >= definitions.keywords[0] || this.unget) {
           this.token.type = IDENTIFIER;
          }
          else {
           throw this.newSyntaxError("Missing identifier");
          }
         }
         return this.token;
        },
        peek: function (scanOperand) {
            var tt, next;
            if (this.lookahead) {
                next = this.tokens[(this.tokenIndex + this.lookahead) & 3];
                tt = (this.scanNewlines && next.lineno !== this.lineno)
                     ? NEWLINE
                     : next.type;
            } else {
                tt = this.get(scanOperand);
                this.unget();
            }
            return tt;
        },
        peekOnSameLine: function (scanOperand) {
            this.scanNewlines = true;
            var tt = this.peek(scanOperand);
            this.scanNewlines = false;
            return tt;
        },
        skip: function () {
            var input = this.source;
            for (;;) {
                var ch = input[this.cursor++];
                var next = input[this.cursor];
                if (ch === '\n' && !this.scanNewlines) {
                    this.lineno++;
                } else if (ch === '/' && next === '*') {
                    this.cursor++;
                    for (;;) {
                        ch = input[this.cursor++];
                        if (ch === undefined)
                            throw this.newSyntaxError("Unterminated comment");
                        if (ch === '*') {
                            next = input[this.cursor];
                            if (next === '/') {
                                this.cursor++;
                                break;
                            }
                        } else if (ch === '\n') {
                            this.lineno++;
                        }
                    }
                } else if (ch === '/' && next === '/') {
                    this.cursor++;
                    for (;;) {
                        ch = input[this.cursor++];
                        if (ch === undefined)
                            return;
                        if (ch === '\n') {
                            this.lineno++;
                            break;
                        }
                    }
                } else if (ch !== ' ' && ch !== '\t') {
                    this.cursor--;
                    return;
                }
            }
        },
        lexExponent: function() {
            var input = this.source;
            var next = input[this.cursor];
            if (next === 'e' || next === 'E') {
                this.cursor++;
                ch = input[this.cursor++];
                if (ch === '+' || ch === '-')
                    ch = input[this.cursor++];
                if (ch < '0' || ch > '9')
                    throw this.newSyntaxError("Missing exponent");
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                return true;
            }
            return false;
        },
        lexZeroNumber: function (ch) {
            var token = this.token, input = this.source;
            token.type = NUMBER;
            ch = input[this.cursor++];
            if (ch === '.') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                this.lexExponent();
                token.value = parseFloat(input.substring(token.start, this.cursor));
            } else if (ch === 'x' || ch === 'X') {
                do {
                    ch = input[this.cursor++];
                } while ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f') ||
                         (ch >= 'A' && ch <= 'F'));
                this.cursor--;
                token.value = parseInt(input.substring(token.start, this.cursor));
            } else if (ch >= '0' && ch <= '7') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '7');
                this.cursor--;
                token.value = parseInt(input.substring(token.start, this.cursor));
            } else {
                this.cursor--;
                this.lexExponent();
                token.value = 0;
            }
        },
        lexNumber: function (ch) {
            var token = this.token, input = this.source;
            token.type = NUMBER;
            var floating = false;
            do {
                ch = input[this.cursor++];
                if (ch === '.' && !floating) {
                    floating = true;
                    ch = input[this.cursor++];
                }
            } while (ch >= '0' && ch <= '9');
            this.cursor--;
            var exponent = this.lexExponent();
            floating = floating || exponent;
            var str = input.substring(token.start, this.cursor);
            token.value = floating ? parseFloat(str) : parseInt(str);
        },
        lexDot: function (ch) {
            var token = this.token, input = this.source;
            var next = input[this.cursor];
            if (next >= '0' && next <= '9') {
                do {
                    ch = input[this.cursor++];
                } while (ch >= '0' && ch <= '9');
                this.cursor--;
                this.lexExponent();
                token.type = NUMBER;
                token.value = parseFloat(input.substring(token.start, this.cursor));
            } else {
                token.type = DOT;
                token.assignOp = null;
                token.value = '.';
            }
        },
        lexString: function (ch) {
            var token = this.token, input = this.source;
            token.type = STRING;
            var hasEscapes = false;
            var delim = ch;
            while ((ch = input[this.cursor++]) !== delim) {
                if (this.cursor == input.length)
                    throw this.newSyntaxError("Unterminated string literal");
                if (ch === '\\') {
                    hasEscapes = true;
                    if (input[this.cursor] === '\n') this.lineno++;
                    if (++this.cursor == input.length)
                        throw this.newSyntaxError("Unterminated string literal");
                }
            }
            token.value = hasEscapes
                          ? eval(input.substring(token.start, this.cursor))
                          : input.substring(token.start + 1, this.cursor - 1);
        },
        lexRegExp: function (ch) {
            var token = this.token, input = this.source;
            token.type = REGEXP;
            do {
                ch = input[this.cursor++];
                if (ch === '\\') {
                    this.cursor++;
                } else if (ch === '[') {
                    do {
                        if (ch === undefined)
                            throw this.newSyntaxError("Unterminated character class");
                        if (ch === '\\')
                            this.cursor++;
                        ch = input[this.cursor++];
                    } while (ch !== ']');
                } else if (ch === undefined) {
                    throw this.newSyntaxError("Unterminated regex");
                }
            } while (ch !== '/');
            do {
                ch = input[this.cursor++];
            } while (ch >= 'a' && ch <= 'z');
            this.cursor--;
            token.value = eval(input.substring(token.start, this.cursor));
        },
        lexOp: function (ch) {
            var token = this.token, input = this.source;
            var node = opTokens[ch];
            var next = input[this.cursor];
            if (next in node) {
                node = node[next];
                this.cursor++;
                next = input[this.cursor];
                if (next in node) {
                    node = node[next];
                    this.cursor++;
                    next = input[this.cursor];
                }
            }
            var op = node.op;
            if (definitions.assignOps[op] && input[this.cursor] === '=') {
                this.cursor++;
                token.type = ASSIGN;
                token.assignOp = definitions.tokenIds[definitions.opTypeNames[op]];
                op += '=';
            } else {
                token.type = definitions.tokenIds[definitions.opTypeNames[op]];
                token.assignOp = null;
            }
            token.value = op;
        },
        lexIdent: function (ch) {
            var token = this.token, input = this.source;
            do {
                ch = input[this.cursor++];
            } while ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') ||
                     (ch >= '0' && ch <= '9') || ch === '$' || ch === '_');
            this.cursor--;
            var id = input.substring(token.start, this.cursor);
            token.type = definitions.keywords[id] || IDENTIFIER;
            token.value = id;
        },
        get: function (scanOperand) {
            var token;
            while (this.lookahead) {
                --this.lookahead;
                this.tokenIndex = (this.tokenIndex + 1) & 3;
                token = this.tokens[this.tokenIndex];
                if (token.type !== NEWLINE || this.scanNewlines)
                    return token.type;
            }
            this.skip();
            this.tokenIndex = (this.tokenIndex + 1) & 3;
            token = this.tokens[this.tokenIndex];
            if (!token)
                this.tokens[this.tokenIndex] = token = {};
            var input = this.source;
            if (this.cursor === input.length)
                return token.type = END;
            token.start = this.cursor;
            token.lineno = this.lineno;
            var ch = input[this.cursor++];
            if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '$' || ch === '_') {
                this.lexIdent(ch);
            } else if (scanOperand && ch === '/') {
                this.lexRegExp(ch);
            } else if (ch in opTokens) {
                this.lexOp(ch);
            } else if (ch === '.') {
                this.lexDot(ch);
            } else if (ch >= '1' && ch <= '9') {
                this.lexNumber(ch);
            } else if (ch === '0') {
                this.lexZeroNumber(ch);
            } else if (ch === '"' || ch === "'") {
                this.lexString(ch);
            } else if (this.scanNewlines && ch === '\n') {
                token.type = NEWLINE;
                token.value = '\n';
                this.lineno++;
            } else {
                throw this.newSyntaxError("Illegal token");
            }
            token.end = this.cursor;
            return token.type;
        },
        unget: function () {
            if (++this.lookahead === 4) throw "PANIC: too much lookahead!";
            this.tokenIndex = (this.tokenIndex - 1) & 3;
        },
        newSyntaxError: function (m) {
            var e = new SyntaxError(this.filename + ":" + this.lineno + ":" + m);
            e.source = this.source;
            e.cursor = this.lookahead
                       ? this.tokens[(this.tokenIndex + this.lookahead) & 3].start
                       : this.cursor;
            return e;
        },
    };
    return { Tokenizer: Tokenizer };
}());
Narcissus.parser = (function() {
    var lexer = Narcissus.lexer;
    var definitions = Narcissus.definitions;
    const StringMap = definitions.StringMap;
    const Stack = definitions.Stack;
    eval(definitions.consts);
    function pushDestructuringVarDecls(n, s) {
        for (var i in n) {
            var sub = n[i];
            if (sub.type === IDENTIFIER) {
                s.varDecls.push(sub);
            } else {
                pushDestructuringVarDecls(sub, s);
            }
        }
    }
    const NESTING_TOP = 0, NESTING_SHALLOW = 1, NESTING_DEEP = 2;
    function StaticContext(parentScript, parentBlock, inFunction, inForLoopInit, nesting) {
        this.parentScript = parentScript;
        this.parentBlock = parentBlock;
        this.inFunction = inFunction;
        this.inForLoopInit = inForLoopInit;
        this.nesting = nesting;
        this.allLabels = new Stack();
        this.currentLabels = new Stack();
        this.labeledTargets = new Stack();
        this.defaultTarget = null;
        Narcissus.options.ecma3OnlyMode && (this.ecma3OnlyMode = true);
        Narcissus.options.parenFreeMode && (this.parenFreeMode = true);
    }
    StaticContext.prototype = {
        ecma3OnlyMode: false,
        parenFreeMode: false,
        update: function(ext) {
            var desc = {};
            for (var key in ext) {
                desc[key] = {
                    value: ext[key],
                    writable: true,
                    enumerable: true,
                    configurable: true
                }
            }
            return Object.create(this, desc);
        },
        pushLabel: function(label) {
            return this.update({ currentLabels: this.currentLabels.push(label),
                                 allLabels: this.allLabels.push(label) });
        },
        pushTarget: function(target) {
            var isDefaultTarget = target.isLoop || target.type === SWITCH;
            if (isDefaultTarget) target.target = this.defaultTarget;
            if (this.currentLabels.isEmpty()) {
                return isDefaultTarget
                     ? this.update({ defaultTarget: target })
                     : this;
            }
            target.labels = new StringMap();
            this.currentLabels.forEach(function(label) {
                target.labels.set(label, true);
            });
            return this.update({ currentLabels: new Stack(),
                                 labeledTargets: this.labeledTargets.push(target),
                                 defaultTarget: isDefaultTarget
                                                ? target
                                                : this.defaultTarget });
        },
        nest: function(atLeast) {
            var nesting = Math.max(this.nesting, atLeast);
            return (nesting !== this.nesting)
                 ? this.update({ nesting: nesting })
                 : this;
        }
    };
    function Script(t, inFunction) {
        var n = new Node(t, scriptInit());
        var x = new StaticContext(n, n, inFunction, false, NESTING_TOP);
        Statements(t, x, n);
        return n;
    }
    definitions.defineProperty(Array.prototype, "top",
                               function() {
                                   return this.length && this[this.length-1];
                               }, false, false, true);
    function Node(t, init) {
        var token = t.token;
        if (token) {
            this.type = token.type;
            this.value = token.value;
            this.lineno = token.lineno;
            this.start = token.start;
            this.end = token.end;
        } else {
            this.lineno = t.lineno;
        }
        this.tokenizer = t;
        this.children = [];
        for (var prop in init)
            this[prop] = init[prop];
    }
    var Np = Node.prototype = {};
    Np.constructor = Node;
    Np.toSource = Object.prototype.toSource;
    Np.push = function (kid) {
        if (kid !== null) {
            if (kid.start < this.start)
                this.start = kid.start;
            if (this.end < kid.end)
                this.end = kid.end;
        }
        return this.children.push(kid);
    }
    Node.indentLevel = 0;
    function tokenString(tt) {
        var t = definitions.tokens[tt];
        return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
    }
    Np.toString = function () {
        var a = [];
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'type' && i !== 'target')
                a.push({id: i, value: this[i]});
        }
        a.sort(function (a,b) { return (a.id < b.id) ? -1 : 1; });
        const INDENTATION = "    ";
        var n = ++Node.indentLevel;
        var s = "{\n" + INDENTATION.repeat(n) + "type: " + tokenString(this.type);
        for (i = 0; i < a.length; i++)
            s += ", " + a[i].id + ": " + a[i].value;
        n = --Node.indentLevel;
        s += "\n" + INDENTATION.repeat(n) + "}";
        return s;
    }
    Np.getSource = function () {
        return this.tokenizer.source.slice(this.start, this.end);
    };
    const LOOP_INIT = { isLoop: true };
    function blockInit() {
        return { type: BLOCK, varDecls: [] };
    }
    function scriptInit() {
        return { type: SCRIPT,
                 funDecls: [],
                 varDecls: [],
                 modDecls: [],
                 impDecls: [],
                 expDecls: [],
                 loadDeps: [],
                 hasEmptyReturn: false,
                 hasReturnWithValue: false,
                 isGenerator: false };
    }
    definitions.defineGetter(Np, "filename",
                             function() {
                                 return this.tokenizer.filename;
                             });
    definitions.defineGetter(Np, "length",
                             function() {
                                 throw new Error("Node.prototype.length is gone; " +
                                                 "use n.children.length instead");
                             });
    definitions.defineProperty(String.prototype, "repeat",
                               function(n) {
                                   var s = "", t = this + s;
                                   while (--n >= 0)
                                       s += t;
                                   return s;
                               }, false, false, true);
    function MaybeLeftParen(t, x) {
        if (x.parenFreeMode)
            return t.match(LEFT_PAREN) ? LEFT_PAREN : END;
        return t.mustMatch(LEFT_PAREN).type;
    }
    function MaybeRightParen(t, p) {
        if (p === LEFT_PAREN)
            t.mustMatch(RIGHT_PAREN);
    }
    function Statements(t, x, n) {
        try {
            while (!t.done && t.peek(true) !== RIGHT_CURLY)
                n.push(Statement(t, x));
        } catch (e) {
            if (t.done)
                t.unexpectedEOF = true;
            throw e;
        }
    }
    function Block(t, x) {
        t.mustMatch(LEFT_CURLY);
        var n = new Node(t, blockInit());
        Statements(t, x.update({ parentBlock: n }).pushTarget(n), n);
        t.mustMatch(RIGHT_CURLY);
        n.end = t.token.end;
        return n;
    }
    const DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;
    function Statement(t, x) {
        var i, label, n, n2, p, c, ss, tt = t.get(true), tt2, x2, x3;
        switch (tt) {
          case FUNCTION:
            return FunctionDefinition(t, x, true,
                                      (x.nesting !== NESTING_TOP)
                                      ? STATEMENT_FORM
                                      : DECLARED_FORM);
          case LEFT_CURLY:
            n = new Node(t, blockInit());
            Statements(t, x.update({ parentBlock: n }).pushTarget(n).nest(NESTING_SHALLOW), n);
            t.mustMatch(RIGHT_CURLY);
            n.end = t.token.end;
            return n;
          case IF:
            n = new Node(t);
            n.condition = HeadExpression(t, x);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            n.thenPart = Statement(t, x2);
            n.elsePart = t.match(ELSE) ? Statement(t, x2) : null;
            return n;
          case SWITCH:
            n = new Node(t, { cases: [], defaultIndex: -1 });
            n.discriminant = HeadExpression(t, x);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            t.mustMatch(LEFT_CURLY);
            while ((tt = t.get()) !== RIGHT_CURLY) {
                switch (tt) {
                  case DEFAULT:
                    if (n.defaultIndex >= 0)
                        throw t.newSyntaxError("More than one switch default");
                  case CASE:
                    n2 = new Node(t);
                    if (tt === DEFAULT)
                        n.defaultIndex = n.cases.length;
                    else
                        n2.caseLabel = Expression(t, x2, COLON);
                    break;
                  default:
                    throw t.newSyntaxError("Invalid switch case");
                }
                t.mustMatch(COLON);
                n2.statements = new Node(t, blockInit());
                while ((tt=t.peek(true)) !== CASE && tt !== DEFAULT &&
                        tt !== RIGHT_CURLY)
                    n2.statements.push(Statement(t, x2));
                n.cases.push(n2);
            }
            n.end = t.token.end;
            return n;
          case FOR:
            n = new Node(t, LOOP_INIT);
            if (t.match(IDENTIFIER)) {
                if (t.token.value === "each")
                    n.isEach = true;
                else
                    t.unget();
            }
            if (!x.parenFreeMode)
                t.mustMatch(LEFT_PAREN);
            x2 = x.pushTarget(n).nest(NESTING_DEEP);
            x3 = x.update({ inForLoopInit: true });
            if ((tt = t.peek()) !== SEMICOLON) {
                if (tt === VAR || tt === CONST) {
                    t.get();
                    n2 = Variables(t, x3);
                } else if (tt === LET) {
                    t.get();
                    if (t.peek() === LEFT_PAREN) {
                        n2 = LetBlock(t, x3, false);
                    } else {
                        x3.parentBlock = n;
                        n.varDecls = [];
                        n2 = Variables(t, x3);
                    }
                } else {
                    n2 = Expression(t, x3);
                }
            }
            if (n2 && t.match(IN)) {
                n.type = FOR_IN;
                n.object = Expression(t, x3);
                if (n2.type === VAR || n2.type === LET) {
                    c = n2.children;
                    if (c.length !== 1 && n2.destructurings.length !== 1) {
                        throw new SyntaxError("Invalid for..in left-hand side",
                                              t.filename, n2.lineno);
                    }
                    if (n2.destructurings.length > 0) {
                        n.iterator = n2.destructurings[0];
                    } else {
                        n.iterator = c[0];
                    }
                    n.varDecl = n2;
                } else {
                    if (n2.type === ARRAY_INIT || n2.type === OBJECT_INIT) {
                        n2.destructuredNames = checkDestructuring(t, x3, n2);
                    }
                    n.iterator = n2;
                }
            } else {
                n.setup = n2;
                t.mustMatch(SEMICOLON);
                if (n.isEach)
                    throw t.newSyntaxError("Invalid for each..in loop");
                n.condition = (t.peek() === SEMICOLON)
                              ? null
                              : Expression(t, x3);
                t.mustMatch(SEMICOLON);
                tt2 = t.peek();
                n.update = (x.parenFreeMode
                            ? tt2 === LEFT_CURLY || definitions.isStatementStartCode[tt2]
                            : tt2 === RIGHT_PAREN)
                           ? null
                           : Expression(t, x3);
            }
            if (!x.parenFreeMode)
                t.mustMatch(RIGHT_PAREN);
            n.body = Statement(t, x2);
            n.end = t.token.end;
            return n;
          case WHILE:
            n = new Node(t, { isLoop: true });
            n.condition = HeadExpression(t, x);
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            n.end = t.token.end;
            return n;
          case DO:
            n = new Node(t, { isLoop: true });
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            t.mustMatch(WHILE);
            n.condition = HeadExpression(t, x);
            if (!x.ecmaStrictMode) {
                t.match(SEMICOLON);
                n.end = t.token.end;
                return n;
            }
            break;
          case BREAK:
          case CONTINUE:
            n = new Node(t);
            x2 = x.pushTarget(n);
            if (t.peekOnSameLine() === IDENTIFIER) {
                t.get();
                n.label = t.token.value;
            }
            n.target = n.label
                     ? x2.labeledTargets.find(function(target) { return target.labels.has(n.label) })
                     : x2.defaultTarget;
            if (!n.target)
                throw t.newSyntaxError("Invalid " + ((tt === BREAK) ? "break" : "continue"));
            if (tt === CONTINUE) {
                for (var ttt = n.target; ttt && !ttt.isLoop; ttt = ttt.target)
                    ;
                if (!ttt) throw t.newSyntaxError("Invalid continue");
            }
            break;
          case TRY:
            n = new Node(t, { catchClauses: [] });
            n.tryBlock = Block(t, x);
            while (t.match(CATCH)) {
                n2 = new Node(t);
                p = MaybeLeftParen(t, x);
                switch (t.get()) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    t.unget();
                    n2.varName = DestructuringExpression(t, x, true);
                    break;
                  case IDENTIFIER:
                    n2.varName = t.token.value;
                    break;
                  default:
                    throw t.newSyntaxError("missing identifier in catch");
                    break;
                }
                if (t.match(IF)) {
                    if (x.ecma3OnlyMode)
                        throw t.newSyntaxError("Illegal catch guard");
                    if (n.catchClauses.length && !n.catchClauses.top().guard)
                        throw t.newSyntaxError("Guarded catch after unguarded");
                    n2.guard = Expression(t, x);
                }
                MaybeRightParen(t, p);
                n2.block = Block(t, x);
                n.catchClauses.push(n2);
            }
            if (t.match(FINALLY))
                n.finallyBlock = Block(t, x);
            if (!n.catchClauses.length && !n.finallyBlock)
                throw t.newSyntaxError("Invalid try statement");
            n.end = t.token.end;
            return n;
          case CATCH:
          case FINALLY:
            throw t.newSyntaxError(definitions.tokens[tt] + " without preceding try");
          case THROW:
            n = new Node(t);
            n.exception = Expression(t, x);
            break;
          case RETURN:
            n = ReturnOrYield(t, x);
            break;
          case WITH:
            n = new Node(t);
            n.object = HeadExpression(t, x);
            n.body = Statement(t, x.pushTarget(n).nest(NESTING_DEEP));
            n.end = t.token.end;
            return n;
          case VAR:
          case CONST:
            n = Variables(t, x);
            n.eligibleForASI = true;
            break;
          case LET:
            if (t.peek() === LEFT_PAREN)
                n = LetBlock(t, x, true);
            else
                n = Variables(t, x);
            n.eligibleForASI = true;
            break;
          case DEBUGGER:
            n = new Node(t);
            break;
          case NEWLINE:
          case SEMICOLON:
            n = new Node(t, { type: SEMICOLON });
            n.expression = null;
            return n;
          default:
            if (tt === IDENTIFIER) {
                tt = t.peek();
                if (tt === COLON) {
                    label = t.token.value;
                    if (x.allLabels.has(label))
                        throw t.newSyntaxError("Duplicate label");
                    t.get();
                    n = new Node(t, { type: LABEL, label: label });
                    n.statement = Statement(t, x.pushLabel(label).nest(NESTING_SHALLOW));
                    n.target = (n.statement.type === LABEL) ? n.statement.target : n.statement;
                    n.end = t.token.end;
                    return n;
                }
            }
            n = new Node(t, { type: SEMICOLON });
            t.unget();
            n.expression = Expression(t, x);
            n.end = n.expression.end;
            break;
        }
        MagicalSemicolon(t);
        n.end = t.token.end;
        return n;
    }
    function MagicalSemicolon(t) {
        var tt;
        if (t.lineno === t.token.lineno) {
            tt = t.peekOnSameLine();
            if (tt !== END && tt !== NEWLINE && tt !== SEMICOLON && tt !== RIGHT_CURLY)
                throw t.newSyntaxError("missing ; before statement");
        }
        t.match(SEMICOLON);
    }
    function ReturnOrYield(t, x) {
        var n, b, tt = t.token.type, tt2;
        var parentScript = x.parentScript;
        if (tt === RETURN) {
            if (false && !x.inFunction)
                throw t.newSyntaxError("Return not in function");
        } else {
            if (!x.inFunction)
                throw t.newSyntaxError("Yield not in function");
            parentScript.isGenerator = true;
        }
        n = new Node(t, { value: undefined });
        tt2 = t.peek(true);
        if (tt2 !== END && tt2 !== NEWLINE &&
            tt2 !== SEMICOLON && tt2 !== RIGHT_CURLY
            && (tt !== YIELD ||
                (tt2 !== tt && tt2 !== RIGHT_BRACKET && tt2 !== RIGHT_PAREN &&
                 tt2 !== COLON && tt2 !== COMMA))) {
            if (tt === RETURN) {
                n.value = Expression(t, x);
                parentScript.hasReturnWithValue = true;
            } else {
                n.value = AssignExpression(t, x);
            }
        } else if (tt === RETURN) {
            parentScript.hasEmptyReturn = true;
        }
        if (parentScript.hasReturnWithValue && parentScript.isGenerator)
            throw t.newSyntaxError("Generator returns a value");
        return n;
    }
    function FunctionDefinition(t, x, requireName, functionForm) {
        var tt;
        var f = new Node(t, { params: [] });
        if (f.type !== FUNCTION)
            f.type = (f.value === "get") ? GETTER : SETTER;
        if (t.match(IDENTIFIER))
            f.name = t.token.value;
        else if (requireName)
            throw t.newSyntaxError("missing function identifier");
        var x2 = new StaticContext(null, null, true, false, NESTING_TOP);
        t.mustMatch(LEFT_PAREN);
        if (!t.match(RIGHT_PAREN)) {
            do {
                switch (t.get()) {
                  case LEFT_BRACKET:
                  case LEFT_CURLY:
                    t.unget();
                    f.params.push(DestructuringExpression(t, x2));
                    break;
                  case IDENTIFIER:
                    f.params.push(t.token.value);
                    break;
                  default:
                    throw t.newSyntaxError("missing formal parameter");
                    break;
                }
            } while (t.match(COMMA));
            t.mustMatch(RIGHT_PAREN);
        }
        tt = t.get();
        if (tt !== LEFT_CURLY)
            t.unget();
        if (tt !== LEFT_CURLY) {
            f.body = AssignExpression(t, x2);
            if (f.body.isGenerator)
                throw t.newSyntaxError("Generator returns a value");
        } else {
            f.body = Script(t, true);
        }
        if (tt === LEFT_CURLY)
            t.mustMatch(RIGHT_CURLY);
        f.end = t.token.end;
        f.functionForm = functionForm;
        if (functionForm === DECLARED_FORM)
            x.parentScript.funDecls.push(f);
        return f;
    }
    function Variables(t, x, letBlock) {
        var n, n2, ss, i, s, tt;
        tt = t.token.type;
        switch (tt) {
          case VAR:
          case CONST:
            s = x.parentScript;
            break;
          case LET:
            s = x.parentBlock;
            break;
          case LEFT_PAREN:
            tt = LET;
            s = letBlock;
            break;
        }
        n = new Node(t, { type: tt, destructurings: [] });
        do {
            tt = t.get();
            if (tt === LEFT_BRACKET || tt === LEFT_CURLY) {
                t.unget();
                var dexp = DestructuringExpression(t, x, true);
                n2 = new Node(t, { type: IDENTIFIER,
                                   name: dexp,
                                   readOnly: n.type === CONST });
                n.push(n2);
                pushDestructuringVarDecls(n2.name.destructuredNames, s);
                n.destructurings.push({ exp: dexp, decl: n2 });
                if (x.inForLoopInit && t.peek() === IN) {
                    continue;
                }
                t.mustMatch(ASSIGN);
                if (t.token.assignOp)
                    throw t.newSyntaxError("Invalid variable initialization");
                n2.initializer = AssignExpression(t, x);
                continue;
            }
            if (tt !== IDENTIFIER)
                throw t.newSyntaxError("missing variable name");
            n2 = new Node(t, { type: IDENTIFIER,
                               name: t.token.value,
                               readOnly: n.type === CONST });
            n.push(n2);
            s.varDecls.push(n2);
            if (t.match(ASSIGN)) {
                if (t.token.assignOp)
                    throw t.newSyntaxError("Invalid variable initialization");
                n2.initializer = AssignExpression(t, x);
            }
        } while (t.match(COMMA));
        n.end = t.token.end;
        return n;
    }
    function LetBlock(t, x, isStatement) {
        var n, n2;
        n = new Node(t, { type: LET_BLOCK, varDecls: [] });
        t.mustMatch(LEFT_PAREN);
        n.variables = Variables(t, x, n);
        t.mustMatch(RIGHT_PAREN);
        if (isStatement && t.peek() !== LEFT_CURLY) {
            n2 = new Node(t, { type: SEMICOLON,
                               expression: n });
            isStatement = false;
        }
        if (isStatement)
            n.block = Block(t, x);
        else
            n.expression = AssignExpression(t, x);
        return n;
    }
    function checkDestructuring(t, x, n, simpleNamesOnly) {
        if (n.type === ARRAY_COMP)
            throw t.newSyntaxError("Invalid array comprehension left-hand side");
        if (n.type !== ARRAY_INIT && n.type !== OBJECT_INIT)
            return;
        var lhss = {};
        var nn, n2, idx, sub, cc, c = n.children;
        for (var i = 0, j = c.length; i < j; i++) {
            if (!(nn = c[i]))
                continue;
            if (nn.type === PROPERTY_INIT) {
                cc = nn.children;
                sub = cc[1];
                idx = cc[0].value;
            } else if (n.type === OBJECT_INIT) {
                sub = nn;
                idx = nn.value;
            } else {
                sub = nn;
                idx = i;
            }
            if (sub.type === ARRAY_INIT || sub.type === OBJECT_INIT) {
                lhss[idx] = checkDestructuring(t, x, sub, simpleNamesOnly);
            } else {
                if (simpleNamesOnly && sub.type !== IDENTIFIER) {
                    throw t.newSyntaxError("missing name in pattern");
                }
                lhss[idx] = sub;
            }
        }
        return lhss;
    }
    function DestructuringExpression(t, x, simpleNamesOnly) {
        var n = PrimaryExpression(t, x);
        n.destructuredNames = checkDestructuring(t, x, n, simpleNamesOnly);
        return n;
    }
    function GeneratorExpression(t, x, e) {
        return new Node(t, { type: GENERATOR,
                             expression: e,
                             tail: ComprehensionTail(t, x) });
    }
    function ComprehensionTail(t, x) {
        var body, n, n2, n3, p;
        body = new Node(t, { type: COMP_TAIL });
        do {
            n = new Node(t, { type: FOR_IN, isLoop: true });
            if (t.match(IDENTIFIER)) {
                if (t.token.value === "each")
                    n.isEach = true;
                else
                    t.unget();
            }
            p = MaybeLeftParen(t, x);
            switch(t.get()) {
              case LEFT_BRACKET:
              case LEFT_CURLY:
                t.unget();
                n.iterator = DestructuringExpression(t, x);
                break;
              case IDENTIFIER:
                n.iterator = n3 = new Node(t, { type: IDENTIFIER });
                n3.name = n3.value;
                n.varDecl = n2 = new Node(t, { type: VAR });
                n2.push(n3);
                x.parentScript.varDecls.push(n3);
                break;
              default:
                throw t.newSyntaxError("missing identifier");
            }
            t.mustMatch(IN);
            n.object = Expression(t, x);
            MaybeRightParen(t, p);
            body.push(n);
        } while (t.match(FOR));
        if (t.match(IF))
            body.guard = HeadExpression(t, x);
        return body;
    }
    function HeadExpression(t, x) {
        var p = MaybeLeftParen(t, x);
        var n = ParenExpression(t, x);
        MaybeRightParen(t, p);
        if (p === END && !n.parenthesized) {
            var tt = t.peek();
            if (tt !== LEFT_CURLY && !definitions.isStatementStartCode[tt])
                throw t.newSyntaxError("Unparenthesized head followed by unbraced body");
        }
        return n;
    }
    function ParenExpression(t, x) {
        var n = Expression(t, x.update({ inForLoopInit: x.inForLoopInit &&
                                                        (t.token.type === LEFT_PAREN) }));
        if (t.match(FOR)) {
            if (n.type === YIELD && !n.parenthesized)
                throw t.newSyntaxError("Yield expression must be parenthesized");
            if (n.type === COMMA && !n.parenthesized)
                throw t.newSyntaxError("Generator expression must be parenthesized");
            n = GeneratorExpression(t, x, n);
        }
        return n;
    }
    function Expression(t, x) {
        var n, n2;
        n = AssignExpression(t, x);
        if (t.match(COMMA)) {
            n2 = new Node(t, { type: COMMA });
            n2.push(n);
            n = n2;
            do {
                n2 = n.children[n.children.length-1];
                if (n2.type === YIELD && !n2.parenthesized)
                    throw t.newSyntaxError("Yield expression must be parenthesized");
                n.push(AssignExpression(t, x));
            } while (t.match(COMMA));
        }
        return n;
    }
    function AssignExpression(t, x) {
        var n, lhs;
        if (t.match(YIELD, true))
            return ReturnOrYield(t, x);
        n = new Node(t, { type: ASSIGN });
        lhs = ConditionalExpression(t, x);
        if (!t.match(ASSIGN)) {
            return lhs;
        }
        switch (lhs.type) {
          case OBJECT_INIT:
          case ARRAY_INIT:
            lhs.destructuredNames = checkDestructuring(t, x, lhs);
          case IDENTIFIER: case DOT: case INDEX: case CALL:
            break;
          default:
            throw t.newSyntaxError("Bad left-hand side of assignment");
            break;
        }
        n.assignOp = t.token.assignOp;
        n.push(lhs);
        n.push(AssignExpression(t, x));
        return n;
    }
    function ConditionalExpression(t, x) {
        var n, n2;
        n = OrExpression(t, x);
        if (t.match(HOOK)) {
            n2 = n;
            n = new Node(t, { type: HOOK });
            n.push(n2);
            n.push(AssignExpression(t, x.update({ inForLoopInit: false })));
            if (!t.match(COLON))
                throw t.newSyntaxError("missing : after ?");
            n.push(AssignExpression(t, x));
        }
        return n;
    }
    function OrExpression(t, x) {
        var n, n2;
        n = AndExpression(t, x);
        while (t.match(OR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(AndExpression(t, x));
            n = n2;
        }
        return n;
    }
    function AndExpression(t, x) {
        var n, n2;
        n = BitwiseOrExpression(t, x);
        while (t.match(AND)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseOrExpression(t, x));
            n = n2;
        }
        return n;
    }
    function BitwiseOrExpression(t, x) {
        var n, n2;
        n = BitwiseXorExpression(t, x);
        while (t.match(BITWISE_OR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseXorExpression(t, x));
            n = n2;
        }
        return n;
    }
    function BitwiseXorExpression(t, x) {
        var n, n2;
        n = BitwiseAndExpression(t, x);
        while (t.match(BITWISE_XOR)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(BitwiseAndExpression(t, x));
            n = n2;
        }
        return n;
    }
    function BitwiseAndExpression(t, x) {
        var n, n2;
        n = EqualityExpression(t, x);
        while (t.match(BITWISE_AND)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(EqualityExpression(t, x));
            n = n2;
        }
        return n;
    }
    function EqualityExpression(t, x) {
        var n, n2;
        n = RelationalExpression(t, x);
        while (t.match(EQ) || t.match(NE) ||
               t.match(STRICT_EQ) || t.match(STRICT_NE)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(RelationalExpression(t, x));
            n = n2;
        }
        return n;
    }
    function RelationalExpression(t, x) {
        var n, n2;
        var x2 = x.update({ inForLoopInit: false });
        n = ShiftExpression(t, x2);
        while ((t.match(LT) || t.match(LE) || t.match(GE) || t.match(GT) ||
               (!x.inForLoopInit && t.match(IN)) ||
               t.match(INSTANCEOF))) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(ShiftExpression(t, x2));
            n = n2;
        }
        return n;
    }
    function ShiftExpression(t, x) {
        var n, n2;
        n = AddExpression(t, x);
        while (t.match(LSH) || t.match(RSH) || t.match(URSH)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(AddExpression(t, x));
            n = n2;
        }
        return n;
    }
    function AddExpression(t, x) {
        var n, n2;
        n = MultiplyExpression(t, x);
        while (t.match(PLUS) || t.match(MINUS)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(MultiplyExpression(t, x));
            n = n2;
        }
        return n;
    }
    function MultiplyExpression(t, x) {
        var n, n2;
        n = UnaryExpression(t, x);
        while (t.match(MUL) || t.match(DIV) || t.match(MOD)) {
            n2 = new Node(t);
            n2.push(n);
            n2.push(UnaryExpression(t, x));
            n = n2;
        }
        return n;
    }
    function UnaryExpression(t, x) {
        var n, n2, tt;
        switch (tt = t.get(true)) {
          case DELETE: case VOID: case TYPEOF:
          case NOT: case BITWISE_NOT: case PLUS: case MINUS:
            if (tt === PLUS)
                n = new Node(t, { type: UNARY_PLUS });
            else if (tt === MINUS)
                n = new Node(t, { type: UNARY_MINUS });
            else
                n = new Node(t);
            n.push(UnaryExpression(t, x));
            break;
          case INCREMENT:
          case DECREMENT:
            n = new Node(t);
            n.push(MemberExpression(t, x, true));
            break;
          default:
            t.unget();
            n = MemberExpression(t, x, true);
            if (t.tokens[(t.tokenIndex + t.lookahead - 1) & 3].lineno ===
                t.lineno) {
                if (t.match(INCREMENT) || t.match(DECREMENT)) {
                    n2 = new Node(t, { postfix: true });
                    n2.push(n);
                    n = n2;
                }
            }
            break;
        }
        return n;
    }
    function MemberExpression(t, x, allowCallSyntax) {
        var n, n2, name, tt;
        if (t.match(NEW)) {
            n = new Node(t);
            n.push(MemberExpression(t, x, false));
            if (t.match(LEFT_PAREN)) {
                n.type = NEW_WITH_ARGS;
                n.push(ArgumentList(t, x));
            }
        } else {
            n = PrimaryExpression(t, x);
        }
        while ((tt = t.get()) !== END) {
            switch (tt) {
              case DOT:
                n2 = new Node(t);
                n2.push(n);
                t.forceIdentifier();
                n2.push(new Node(t));
                break;
              case LEFT_BRACKET:
                n2 = new Node(t, { type: INDEX });
                n2.push(n);
                n2.push(Expression(t, x));
                t.mustMatch(RIGHT_BRACKET);
                n2.end = t.token.end;
                break;
              case LEFT_PAREN:
                if (allowCallSyntax) {
                    n2 = new Node(t, { type: CALL });
                    n2.push(n);
                    n2.push(ArgumentList(t, x));
                    break;
                }
              default:
                t.unget();
                return n;
            }
            n = n2;
        }
        return n;
    }
    function ArgumentList(t, x) {
        var n, n2;
        n = new Node(t, { type: LIST });
        if (t.match(RIGHT_PAREN, true)) {
            n.end = t.token.end;
            return n;
        }
        do {
            n2 = AssignExpression(t, x);
            if (n2.type === YIELD && !n2.parenthesized && t.peek() === COMMA)
                throw t.newSyntaxError("Yield expression must be parenthesized");
            if (t.match(FOR)) {
                n2 = GeneratorExpression(t, x, n2);
                if (n.children.length > 1 || t.peek(true) === COMMA)
                    throw t.newSyntaxError("Generator expression must be parenthesized");
            }
            n.push(n2);
        } while (t.match(COMMA));
        t.mustMatch(RIGHT_PAREN);
        n.end = t.token.end;
        return n;
    }
    function PrimaryExpression(t, x) {
        var n, n2, tt = t.get(true);
        switch (tt) {
          case FUNCTION:
            n = FunctionDefinition(t, x, false, EXPRESSED_FORM);
            break;
          case LEFT_BRACKET:
            n = new Node(t, { type: ARRAY_INIT });
            while ((tt = t.peek(true)) !== RIGHT_BRACKET) {
                if (tt === COMMA) {
                    t.get();
                    n.push(null);
                    continue;
                }
                n.push(AssignExpression(t, x));
                if (tt !== COMMA && !t.match(COMMA))
                    break;
            }
            if (n.children.length === 1 && t.match(FOR)) {
                n2 = new Node(t, { type: ARRAY_COMP,
                                   expression: n.children[0],
                                   tail: ComprehensionTail(t, x) });
                n = n2;
            }
            t.mustMatch(RIGHT_BRACKET);
            n.end = t.token.end;
            break;
          case LEFT_CURLY:
            var id, fd;
            n = new Node(t, { type: OBJECT_INIT });
          object_init:
            if (!t.match(RIGHT_CURLY)) {
                do {
                    tt = t.get();
                    if ((t.token.value === "get" || t.token.value === "set") &&
                        t.peek() === IDENTIFIER) {
                        if (x.ecma3OnlyMode)
                            throw t.newSyntaxError("Illegal property accessor");
                        n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
                    } else {
                        switch (tt) {
                          case IDENTIFIER: case NUMBER: case STRING:
                            id = new Node(t, { type: IDENTIFIER });
                            break;
                          case RIGHT_CURLY:
                            if (x.ecma3OnlyMode)
                                throw t.newSyntaxError("Illegal trailing ,");
                            break object_init;
                          default:
                            if (t.token.value in definitions.keywords) {
                                id = new Node(t, { type: IDENTIFIER });
                                break;
                            }
                            throw t.newSyntaxError("Invalid property name");
                        }
                        if (t.match(COLON)) {
                            n2 = new Node(t, { type: PROPERTY_INIT });
                            n2.push(id);
                            n2.push(AssignExpression(t, x));
                            n.push(n2);
                        } else {
                            if (t.peek() !== COMMA && t.peek() !== RIGHT_CURLY)
                                throw t.newSyntaxError("missing : after property");
                            n.push(id);
                        }
                    }
                } while (t.match(COMMA));
                t.mustMatch(RIGHT_CURLY);
            }
            n.end = t.token.end;
            break;
          case LEFT_PAREN:
            var start = t.token.start;
            n = ParenExpression(t, x);
            t.mustMatch(RIGHT_PAREN);
            n.start = start;
            n.end = t.token.end;
            n.parenthesized = true;
            break;
          case LET:
            n = LetBlock(t, x, false);
            break;
          case NULL: case THIS: case TRUE: case FALSE:
          case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
            n = new Node(t);
            break;
          default:
            throw t.newSyntaxError("missing operand");
            break;
        }
        return n;
    }
    function parse(s, f, l) {
        var t = new lexer.Tokenizer(s, f, l);
        var n = Script(t, false);
        if (!t.done)
            throw t.newSyntaxError("Syntax error");
        return n;
    }
    function parseStdin(s, ln) {
        for (;;) {
            try {
                var t = new lexer.Tokenizer(s, "stdin", ln.value);
                var n = Script(t, false);
                ln.value = t.lineno;
                return n;
            } catch (e) {
                if (!t.unexpectedEOF)
                    throw e;
                var more = readline();
                if (!more)
                    throw e;
                s += "\n" + more;
            }
        }
    }
    return {
        parse: parse,
        parseStdin: parseStdin,
        Node: Node,
        DECLARED_FORM: DECLARED_FORM,
        EXPRESSED_FORM: EXPRESSED_FORM,
        STATEMENT_FORM: STATEMENT_FORM,
        Tokenizer: lexer.Tokenizer,
        FunctionDefinition: FunctionDefinition
    };
}());
Narcissus.decompiler = (function() {
    const parser = Narcissus.parser;
    const definitions = Narcissus.definitions;
    const tokens = definitions.tokens;
    eval(definitions.consts);
    function indent(n, s) {
        var ss = "", d = true;
        for (var i = 0, j = s.length; i < j; i++) {
            if (d)
                for (var k = 0; k < n; k++)
                    ss += " ";
            ss += s[i];
            d = s[i] === '\n';
        }
        return ss;
    }
    function isBlock(n) {
        return n && (n.type === BLOCK);
    }
    function isNonEmptyBlock(n) {
        return isBlock(n) && n.children.length > 0;
    }
    function nodeStr(n) {
        return '"' +
               n.value.replace(/\\/g, "\\\\")
                      .replace(/"/g, "\\\"")
                      .replace(/\n/g, "\\n")
                      .replace(/\r/g, "\\r") +
               '"';
    }
    function pp(n, d, inLetHead) {
        var topScript = false;
        if (!n)
            return "";
        if (!(n instanceof Object))
            return n;
        if (!d) {
            topScript = true;
            d = 1;
        }
        var p = "";
        if (n.parenthesized)
            p += "(";
        switch (n.type) {
          case FUNCTION:
          case GETTER:
          case SETTER:
            if (n.type === FUNCTION)
                p += "function";
            else if (n.type === GETTER)
                p += "get";
            else
                p += "set";
            p += (n.name ? " " + n.name : "") + "(";
            for (var i = 0, j = n.params.length; i < j; i++)
                p += (i > 0 ? ", " : "") + pp(n.params[i], d);
            p += ") " + pp(n.body, d);
            break;
          case SCRIPT:
          case BLOCK:
            var nc = n.children;
            if (topScript) {
                for (var i = 0, j = nc.length; i < j; i++) {
                    if (i > 0)
                        p += "\n";
                    p += pp(nc[i], d);
                    var eoc = p[p.length - 1];
                    if (eoc != ";")
                        p += ";";
                }
                break;
            }
            p += "{";
            if (n.id !== undefined)
                p += " /* " + n.id + " */";
            p += "\n";
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += "\n";
                p += indent(4, pp(nc[i], d));
                var eoc = p[p.length - 1];
                if (eoc != ";")
                    p += ";";
            }
            p += "\n}";
            break;
          case LET_BLOCK:
            p += "let (" + pp(n.variables, d, true) + ") ";
            if (n.expression)
                p += pp(n.expression, d);
            else
                p += pp(n.block, d);
            break;
          case IF:
            p += "if (" + pp(n.condition, d) + ") ";
            var tp = n.thenPart, ep = n.elsePart;
            var b = isBlock(tp) || isBlock(ep);
            if (!b)
                p += "{\n";
            p += (b ? pp(tp, d) : indent(4, pp(tp, d))) + "\n";
            if (ep) {
                if (!b)
                    p += "} else {\n";
                else
                    p += " else ";
                p += (b ? pp(ep, d) : indent(4, pp(ep, d))) + "\n";
            }
            if (!b)
                p += "}";
            break;
          case SWITCH:
            p += "switch (" + pp(n.discriminant, d) + ") {\n";
            for (var i = 0, j = n.cases.length; i < j; i++) {
                var ca = n.cases[i];
                if (ca.type === CASE)
                    p += "  case " + pp(ca.caseLabel, d) + ":\n";
                else
                    p += "  default:\n";
                ps = pp(ca.statements, d);
                p += ps.slice(2, ps.length - 2) + "\n";
            }
            p += "}";
            break;
          case FOR:
            p += "for (" + pp(n.setup, d) + "; "
                         + pp(n.condition, d) + "; "
                         + pp(n.update, d) + ") ";
            var pb = pp(n.body, d);
            if (!isBlock(n.body))
                p += "{\n" + indent(4, pb) + ";\n}";
            else if (n.body)
                p += pb;
            break;
          case WHILE:
            p += "while (" + pp(n.condition, d) + ") ";
            var pb = pp(n.body, d);
            if (!isBlock(n.body))
                p += "{\n" + indent(4, pb) + ";\n}";
            else
                p += pb;
            break;
          case FOR_IN:
            var u = n.varDecl;
            p += n.isEach ? "for each (" : "for (";
            p += (u ? pp(u, d) : pp(n.iterator, d)) + " in " +
                 pp(n.object, d) + ") ";
            var pb = pp(n.body, d);
            if (!isBlock(n.body))
                p += "{\n" + indent(4, pb) + ";\n}";
            else if (n.body)
                p += pb;
            break;
          case DO:
            p += "do " + pp(n.body, d);
            p += " while (" + pp(n.condition, d) + ");";
            break;
          case BREAK:
            p += "break" + (n.label ? " " + n.label : "") + ";";
            break;
          case CONTINUE:
            p += "continue" + (n.label ? " " + n.label : "") + ";";
            break;
          case TRY:
            p += "try ";
            p += pp(n.tryBlock, d);
            for (var i = 0, j = n.catchClauses.length; i < j; i++) {
                var t = n.catchClauses[i];
                p += " catch (" + pp(t.varName, d) +
                                (t.guard ? " if " + pp(t.guard, d) : "") +
                                ") ";
                p += pp(t.block, d);
            }
            if (n.finallyBlock) {
                p += " finally ";
                p += pp(n.finallyBlock, d);
            }
            break;
          case THROW:
            p += "throw " + pp(n.exception, d);
            break;
          case RETURN:
            p += "return";
            if (n.value)
              p += " " + pp(n.value, d);
            break;
          case YIELD:
            p += "yield";
            if (n.value.type)
              p += " " + pp(n.value, d);
            break;
          case GENERATOR:
            p += pp(n.expression, d) + " " + pp(n.tail, d);
            break;
          case WITH:
            p += "with (" + pp(n.object, d) + ") ";
            p += pp(n.body, d);
            break;
          case LET:
          case VAR:
          case CONST:
            var nc = n.children;
            if (!inLetHead) {
                p += tokens[n.type] + " ";
            }
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += ", ";
                var u = nc[i];
                p += pp(u.name, d);
                if (u.initializer)
                    p += " = " + pp(u.initializer, d);
            }
            break;
          case DEBUGGER:
            p += "debugger\n";
            break;
          case SEMICOLON:
            if (n.expression) {
                p += pp(n.expression, d) + ";";
            }
            break;
          case LABEL:
            p += n.label + ":\n" + pp(n.statement, d);
            break;
          case COMMA:
          case LIST:
            var nc = n.children;
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += ", ";
                p += pp(nc[i], d);
            }
            break;
          case ASSIGN:
            var nc = n.children;
            var t = n.assignOp;
            p += pp(nc[0], d) + " " + (t ? tokens[t] : "") + "="
                              + " " + pp(nc[1], d);
            break;
          case HOOK:
            var nc = n.children;
            p += "(" + pp(nc[0], d) + " ? "
                     + pp(nc[1], d) + " : "
                     + pp(nc[2], d);
            p += ")";
            break;
          case OR:
          case AND:
            var nc = n.children;
            p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
                     + pp(nc[1], d);
            p += ")";
            break;
          case BITWISE_OR:
          case BITWISE_XOR:
          case BITWISE_AND:
          case EQ:
          case NE:
          case STRICT_EQ:
          case STRICT_NE:
          case LT:
          case LE:
          case GE:
          case GT:
          case IN:
          case INSTANCEOF:
          case LSH:
          case RSH:
          case URSH:
          case PLUS:
          case MINUS:
          case MUL:
          case DIV:
          case MOD:
            var nc = n.children;
            p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
                     + pp(nc[1], d) + ")";
            break;
          case DELETE:
          case VOID:
          case TYPEOF:
            p += tokens[n.type] + " " + pp(n.children[0], d);
            break;
          case NOT:
          case BITWISE_NOT:
            p += tokens[n.type] + pp(n.children[0], d);
            break;
          case UNARY_PLUS:
            p += "+" + pp(n.children[0], d);
            break;
          case UNARY_MINUS:
            p += "-" + pp(n.children[0], d);
            break;
          case INCREMENT:
          case DECREMENT:
            if (n.postfix) {
                p += pp(n.children[0], d) + tokens[n.type];
            } else {
                p += tokens[n.type] + pp(n.children[0], d);
            }
            break;
          case DOT:
            var nc = n.children;
            p += pp(nc[0], d) + "." + pp(nc[1], d);
            break;
          case INDEX:
            var nc = n.children;
            p += pp(nc[0], d) + "[" + pp(nc[1], d) + "]";
            break;
          case CALL:
            var nc = n.children;
            p += pp(nc[0], d) + "(" + pp(nc[1], d) + ")";
            break;
          case NEW:
          case NEW_WITH_ARGS:
            var nc = n.children;
            p += "new " + pp(nc[0], d);
            if (nc[1])
                p += "(" + pp(nc[1], d) + ")";
            break;
          case ARRAY_INIT:
            p += "[";
            var nc = n.children;
            for (var i = 0, j = nc.length; i < j; i++) {
                if(nc[i])
                    p += pp(nc[i], d);
                p += ","
            }
            p += "]";
            break;
          case ARRAY_COMP:
            p += "[" + pp (n.expression, d) + " ";
            p += pp(n.tail, d);
            p += "]";
            break;
          case COMP_TAIL:
            var nc = n.children;
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0)
                    p += " ";
                p += pp(nc[i], d);
            }
            if (n.guard)
                p += " if (" + pp(n.guard, d) + ")";
            break;
          case OBJECT_INIT:
            var nc = n.children;
            if (nc[0] && nc[0].type === PROPERTY_INIT)
                p += "{\n";
            else
                p += "{";
            for (var i = 0, j = nc.length; i < j; i++) {
                if (i > 0) {
                    p += ",\n";
                }
                var t = nc[i];
                if (t.type === PROPERTY_INIT) {
                    var tc = t.children;
                    var l;
                    if (typeof tc[0].value === "string" && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(tc[0].value)) {
                        l = nodeStr(tc[0]);
                    } else {
                        l = pp(tc[0], d);
                    }
                    p += indent(4, l) + ": " +
                         indent(4, pp(tc[1], d)).substring(4);
                } else {
                    p += indent(4, pp(t, d));
                }
            }
            p += "\n}";
            break;
          case NULL:
            p += "null";
            break;
          case THIS:
            p += "this";
            break;
          case TRUE:
            p += "true";
            break;
          case FALSE:
            p += "false";
            break;
          case IDENTIFIER:
          case NUMBER:
          case REGEXP:
            p += n.value;
            break;
          case STRING:
            p += nodeStr(n);
            break;
          case GROUP:
            p += "(" + pp(n.children[0], d) + ")";
            break;
          default:
            throw "PANIC: unknown operation " + tokens[n.type] + " " + n.toSource();
        }
        if (n.parenthesized)
            p += ")";
        return p;
    }
    return {
        pp: pp
    };
}());
if (typeof exports !== 'undefined') {
 var Narcissus = require('../../deps/narcissus');
}
(function(exports){
 eval(Narcissus.definitions.consts);
 var tokens = Narcissus.definitions.tokens;
 exports.format = function(node, linesOpt) {
  var result = '';
  var ppOut = _pp(node);
  if (linesOpt == "ignore")
   return ppOut.source;
  var lineMap = ppOut.lineMap;
  var lines = ppOut.source.split("\n");
  if (linesOpt == "preserve") {
   var outputLineNo = 1, bol = true;
   for (var i = 0; i < lines.length; i++) {
    var sourceNodes = (lineMap[i] || []).filter(function(n) { return n._isSourceNode });
    if (sourceNodes.length > 0) {
     var sourceLineNo = sourceNodes[0].lineno;
     while (outputLineNo < sourceLineNo) {
      result += "\n";
      outputLineNo += 1;
      bol = true;
     }
    }
    result += bol ? lines[i] : lines[i].replace(/^\s+/, ' ');
    bol = false;
   }
  }
  else if (linesOpt == "mark"){
   for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var sourceNodes = (lineMap[i] || []).filter(function(n) { return n._isSourceNode });
    var linePrefix = '            ';
    if (sourceNodes.length > 0) {
     var sourceLineNo = '' + sourceNodes[0].lineno;
     linePrefix = '/* ';
     for (var j = sourceLineNo.length; j < 5; j++) linePrefix += ' ';
     linePrefix += sourceLineNo + ' */ ';
    }
    result += linePrefix + line + "\n";
   }
  }
  else
   throw new Error("bad --lines option: " + linesOpt)
  return result;
 }
 function _pp(node) {
  var curLineNo = 0;
  var lineNodeMap = {};
  var src = pp(node);
  return {
   source: src,
   lineMap: lineNodeMap
  };
  function countNewline(s) {
   curLineNo += 1;
   return s;
  }
  function indent(n, s) {
   var ss = "", d = true;
   for (var i = 0, j = s.length; i < j; i++) {
    if (d)
     for (var k = 0; k < n; k++)
      ss += " ";
    ss += s[i];
    d = s[i] === '\n';
   }
   return ss;
  }
  function isBlock(n) {
   return n && (n.type === BLOCK);
  }
  function isNonEmptyBlock(n) {
   return isBlock(n) && n.children.length > 0;
  }
  function nodeStr(n) {
   return '"' +
    n.value.replace(/\\/g, "\\\\")
           .replace(/"/g, "\\\"")
           .replace(/\n/g, "\\n")
           .replace(/\r/g, "\\r") +
           '"';
  }
  function pp(n, d, inLetHead) {
   var topScript = false;
   if (!n)
    return "";
   if (!(n instanceof Object))
    return n;
   if (!d) {
    topScript = true;
    d = 1;
   }
   if (!lineNodeMap[curLineNo])
    lineNodeMap[curLineNo] = [];
   lineNodeMap[curLineNo].push(n);
   var p = "";
   if (n.parenthesized)
    p += "(";
   switch (n.type) {
   case FUNCTION:
   case GETTER:
   case SETTER:
    if (n.type === FUNCTION)
     p += "function";
    else if (n.type === GETTER)
     p += "get";
    else
     p += "set";
    p += (n.name ? " " + n.name : "") + "(";
    for (var i = 0, j = n.params.length; i < j; i++)
     p += (i > 0 ? ", " : "") + pp(n.params[i], d);
    p += ") " + pp(n.body, d);
    break;
   case SCRIPT:
   case BLOCK:
    var nc = n.children;
    if (topScript) {
     for (var i = 0, j = nc.length; i < j; i++) {
      if (i > 0)
       p += countNewline("\n");
      p += pp(nc[i], d);
      var eoc = p[p.length - 1];
      if (eoc != ";")
       p += ";";
     }
     break;
    }
    p += "{";
    if (n.id !== undefined)
     p += " /* " + n.id + " */";
    p += countNewline("\n");
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += countNewline("\n");
     p += indent(2, pp(nc[i], d));
     var eoc = p[p.length - 1];
     if (eoc != ";")
      p += ";";
    }
    p += countNewline("\n}");
    break;
   case LET_BLOCK:
    p += "let (" + pp(n.variables, d, true) + ") ";
    if (n.expression)
     p += pp(n.expression, d);
    else
     p += pp(n.block, d);
    break;
   case IF:
    p += "if (" + pp(n.condition, d) + ") ";
    var tp = n.thenPart, ep = n.elsePart;
    var b = isBlock(tp) || isBlock(ep);
    if (!b)
     p += countNewline("{\n");
    p += (b ? pp(tp, d) : indent(2, pp(tp, d)))
    if (ep && ";}".indexOf(p[p.length - 1]) < 0)
     p += ";";
    p += countNewline("\n");
    if (ep) {
     if (!b)
      p += countNewline("} else {\n");
     else
      p += " else ";
     p += (b ? pp(ep, d) : indent(2, pp(ep, d))) + countNewline("\n");
    }
    if (!b)
     p += "}";
    break;
   case SWITCH:
    p += "switch (" + pp(n.discriminant, d) + countNewline(") {\n");
    for (var i = 0, j = n.cases.length; i < j; i++) {
     var ca = n.cases[i];
     if (ca.type === CASE)
      p += "case " + pp(ca.caseLabel, d) + countNewline(":\n");
     else
      p += countNewline("  default:\n");
     ps = pp(ca.statements, d);
     p += ps.slice(2, ps.length - 2) + countNewline("\n");
     curLineNo -= 2;
    }
    p += "}";
    break;
   case FOR:
    p += "for (" + pp(n.setup, d) + "; "
        + pp(n.condition, d) + "; "
        + pp(n.update, d) + ") ";
    var pb = pp(n.body, d);
    if (!isBlock(n.body))
     p += countNewline("{\n") + indent(2, pb) + countNewline(";\n}");
    else if (n.body)
     p += pb;
    break;
   case WHILE:
    p += "while (" + pp(n.condition, d) + ") ";
    var pb = pp(n.body, d);
    if (!isBlock(n.body))
     p += countNewline("{\n") + indent(2, pb) + countNewline(";\n}");
    else
     p += pb;
    break;
   case FOR_IN:
    var u = n.varDecl;
    p += n.isEach ? "for each (" : "for (";
    p += (u ? pp(u, d) : pp(n.iterator, d)) + " in " +
      pp(n.object, d) + ") ";
    var pb = pp(n.body, d);
    if (!isBlock(n.body))
     p += countNewline("{\n") + indent(2, pb) + countNewline(";\n}");
    else if (n.body)
     p += pb;
    break;
   case DO:
    p += "do " + pp(n.body, d);
    p += " while (" + pp(n.condition, d) + ");";
    break;
   case BREAK:
    p += "break" + (n.label ? " " + n.label : "") + ";";
    break;
   case CONTINUE:
    p += "continue" + (n.label ? " " + n.label : "") + ";";
    break;
   case TRY:
    p += "try ";
    p += pp(n.tryBlock, d);
    for (var i = 0, j = n.catchClauses.length; i < j; i++) {
     var t = n.catchClauses[i];
     p += " catch (" + pp(t.varName, d) +
         (t.guard ? " if " + pp(t.guard, d) : "") +
         ") ";
     p += pp(t.block, d);
    }
    if (n.finallyBlock) {
     p += " finally ";
     p += pp(n.finallyBlock, d);
    }
    break;
   case THROW:
    p += "throw " + pp(n.exception, d);
    break;
   case RETURN:
    p += "return";
    if (n.value)
     p += " " + pp(n.value, d);
    break;
   case YIELD:
    p += "yield";
    if (n.value.type)
     p += " " + pp(n.value, d);
    break;
   case GENERATOR:
    p += pp(n.expression, d) + " " + pp(n.tail, d);
    break;
   case WITH:
    p += "with (" + pp(n.object, d) + ") ";
    p += pp(n.body, d);
    break;
   case LET:
   case VAR:
   case CONST:
    var nc = n.children;
    if (!inLetHead) {
     p += tokens[n.type] + " ";
    }
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += ", ";
     var u = nc[i];
     p += pp(u.name, d);
     if (u.initializer)
      p += " = " + pp(u.initializer, d);
    }
    break;
   case DEBUGGER:
    p += countNewline("debugger\n");
    break;
   case SEMICOLON:
    if (n.expression) {
     p += pp(n.expression, d) + ";";
    }
    break;
   case LABEL:
    p += n.label + countNewline(":\n") + pp(n.statement, d);
    break;
   case COMMA:
   case LIST:
    var nc = n.children;
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += ", ";
     p += pp(nc[i], d);
    }
    break;
   case ASSIGN:
    var nc = n.children;
    var t = n.assignOp;
    p += pp(nc[0], d) + " " + (t ? tokens[t] : "") + "=" + " " + pp(nc[1], d);
    break;
   case HOOK:
    var nc = n.children;
    p += "(" + pp(nc[0], d) + " ? "
       + pp(nc[1], d) + " : "
       + pp(nc[2], d);
    p += ")";
    break;
   case OR:
   case AND:
    var nc = n.children;
    p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
       + pp(nc[1], d);
    p += ")";
    break;
   case BITWISE_OR:
   case BITWISE_XOR:
   case BITWISE_AND:
   case EQ:
   case NE:
   case STRICT_EQ:
   case STRICT_NE:
   case LT:
   case LE:
   case GE:
   case GT:
   case IN:
   case INSTANCEOF:
   case LSH:
   case RSH:
   case URSH:
   case PLUS:
   case MINUS:
   case MUL:
   case DIV:
   case MOD:
    var nc = n.children;
    p += "(" + pp(nc[0], d) + " " + tokens[n.type] + " "
       + pp(nc[1], d) + ")";
    break;
   case DELETE:
   case VOID:
   case TYPEOF:
    p += tokens[n.type] + " " + pp(n.children[0], d);
    break;
   case NOT:
   case BITWISE_NOT:
    p += tokens[n.type] + pp(n.children[0], d);
    break;
   case UNARY_PLUS:
    p += "+" + pp(n.children[0], d);
    break;
   case UNARY_MINUS:
    p += "-" + pp(n.children[0], d);
    break;
   case INCREMENT:
   case DECREMENT:
    if (n.postfix) {
     p += pp(n.children[0], d) + tokens[n.type];
    } else {
     p += tokens[n.type] + pp(n.children[0], d);
    }
    break;
   case DOT:
    var nc = n.children;
    p += pp(nc[0], d) + "." + pp(nc[1], d);
    break;
   case INDEX:
    var nc = n.children;
    p += pp(nc[0], d) + "[" + pp(nc[1], d) + "]";
    break;
   case CALL:
    var nc = n.children;
    p += pp(nc[0], d) + "(" + pp(nc[1], d) + ")";
    break;
   case NEW:
   case NEW_WITH_ARGS:
    var nc = n.children;
    p += "new " + pp(nc[0], d);
    if (nc[1])
     p += "(" + pp(nc[1], d) + ")";
    break;
   case ARRAY_INIT:
    p += "[";
    var nc = n.children;
    for (var i = 0, j = nc.length; i < j; i++) {
     if(nc[i])
      p += pp(nc[i], d);
     p += ","
    }
    p += "]";
    break;
   case ARRAY_COMP:
    p += "[" + pp (n.expression, d) + " ";
    p += pp(n.tail, d);
    p += "]";
    break;
   case COMP_TAIL:
    var nc = n.children;
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0)
      p += " ";
     p += pp(nc[i], d);
    }
    if (n.guard)
     p += " if (" + pp(n.guard, d) + ")";
    break;
   case OBJECT_INIT:
    var nc = n.children;
    if (nc[0] && nc[0].type === PROPERTY_INIT)
     p += countNewline("{\n");
    else
     p += "{";
    for (var i = 0, j = nc.length; i < j; i++) {
     if (i > 0) {
      p += countNewline(",\n");
     }
     var t = nc[i];
     if (t.type === PROPERTY_INIT) {
      var tc = t.children;
      var l;
      if (typeof tc[0].value === "string" && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(tc[0].value)) {
       l = nodeStr(tc[0]);
      } else {
       l = pp(tc[0], d);
      }
      p += indent(2, l) + ": " +
        indent(2, pp(tc[1], d)).substring(2);
     } else {
      p += indent(2, pp(t, d));
     }
    }
    p += countNewline("\n}");
    break;
   case NULL:
    p += "null";
    break;
   case THIS:
    p += "this";
    break;
   case TRUE:
    p += "true";
    break;
   case FALSE:
    p += "false";
    break;
   case IDENTIFIER:
   case NUMBER:
   case REGEXP:
    p += n.value;
    break;
   case STRING:
    p += nodeStr(n);
    break;
   case GROUP:
    p += "(" + pp(n.children[0], d) + ")";
    break;
   default:
    throw "PANIC: unknown operation " + tokens[n.type] + " " + n.toSource();
   }
   if (n.parenthesized)
    p += ")";
   return p;
  }
 }
})(typeof exports !== 'undefined' ? exports : (window.Streamline = window.Streamline || {}));
if (typeof exports !== 'undefined') {
 var Narcissus = require('../../deps/narcissus');
 var format = require('./format').format;
} else {
 var format = Streamline.format;
}(function(exports) {
 exports.version = "0.4.0 (callbacks)";
 var parse = Narcissus.parser.parse;
 var pp = Narcissus.decompiler.pp;
 var definitions = Narcissus.definitions;
 eval(definitions.consts.replace(/const /g, "var "));
 function _assert(cond) {
  if (!cond) throw new Error("Assertion failed!")
 }
 function _tag(node) {
  if (!node || !node.type) return "*NOT_A_NODE*";
  var t = definitions.tokens[node.type];
  return /^\W/.test(t) ? definitions.opTypeNames[t] : t.toUpperCase();
 }
 function _node(ref, type, children) {
  return {
   _scope: ref && ref._scope,
   _async: ref && ref._async,
   type: type,
   children: children
  };
 }
 function _identifier(name, initializer) {
  return {
   _scope: initializer && initializer._scope,
   type: IDENTIFIER,
   name: name,
   value: name,
   initializer: initializer
  };
 }
 function _number(val) {
  return {
   type: NUMBER,
   value: val
  };
 }
 function _string(val) {
  return {
   type: STRING,
   value: val
  };
 }
 function _return(node) {
  return {
   type: RETURN,
   _scope: node._scope,
   value: node
  };
 }
 function _semicolon(node) {
  var stmt = _node(node, SEMICOLON);
  stmt.expression = node;
  return stmt;
 }
 function _safeName(precious, name) {
  while (precious[name]) name += 'A';
  return name;
 }
 function _flatten(node) {
  if (node.type == BLOCK || node.type == SCRIPT) {
   do {
    var found = false;
    var children = [];
    node.children.forEach(function(child) {
     if (child._isFunctionReference || (child.type == SEMICOLON && (child.expression == null || child.expression._isFunction))) return;
     node._async |= child._async;
     if (child.type == BLOCK || child.type == SCRIPT) {
      children = children.concat(child.children);
      found = true;
     } else children.push(child);
    })
    node.children = children;
   }
   while (found);
  }
  return node;
 }
 function _propagate(node, fn, doAll, clone) {
  var result = clone ? clone : node;
  for (var prop in node) {
   if (node.hasOwnProperty(prop) && prop.indexOf("Decls") < 0 && (doAll || prop != 'target') && prop[0] != '_') {
    var child = node[prop];
    if (child != null) {
     if (Array.isArray(child)) {
      if (clone) result[prop] = (child = [].concat(child));
      var undef = false;
      for (var i = 0; i < child.length; i++) {
       if (doAll || (child[i] && child[i].type)) {
        child[i] = fn(child[i], node);
        undef |= typeof child[i] === "undefined"
       }
      }
      if (undef) {
       result[prop] = child.filter(function(elt) {
        return typeof elt !== "undefined";
       });
      }
     } else {
      if (doAll || (child && child.type)) result[prop] = fn(child, node);
     }
    }
   }
  }
  return result;
 }
 function _clone(node) {
  var lastId = 0;
  var clones = {};
  function cloneOne(child) {
   if (!child || !child.type) return child;
   var cloneId = child._cloneId;
   if (!cloneId) cloneId = (child._cloneId = ++lastId);
   var clone = clones[cloneId];
   if (clone) return clone;
   clones[cloneId] = (clone = {
    _cloneId: cloneId
   });
   return _propagate(child, cloneOne, true, clone);
  }
  return _propagate(node, cloneOne, true, {});
 }
 function Template(pass, str, isExpression, createScope) {
  var _root = parse("function _t(){" + str + "}").children[0].body;
  if (_root.children.length == 1) _root = _root.children[0];
  else _root = _node(_root.children[0], BLOCK, _root.children);
  this.generate = function(scopeNode, bindings) {
   var scope = scopeNode._scope;
   _assert(scope != null);
   bindings = bindings || {};
   var fn = null;
   function gen(node) {
    if (node.type != SCRIPT && node.type != BLOCK) node._pass = pass;
    if (node.type == FUNCTION && createScope) {
     _assert(fn == null);
     fn = node;
    }
    if (!node || !node.type) {
     if (node == "_") return scope.options.callback;
     if (typeof node === "string") {
      if (node[0] === "$") return bindings[node];
      return _safeName(scope.options.precious, node);
     }
     return node;
    }
    node._scope = scope;
    var ident = node.type == SEMICOLON ? node.expression : node;
    if (ident && ident.type == IDENTIFIER && ident.value[0] === "$") {
     var result = bindings[ident.value];
     if (ident.initializer) {
      result.initializer = gen(ident.initializer);
      if (result.initializer._async) result._async = true;
     }
     return result;
    } else {
     node = _propagate(node, function(child) {
      child = gen(child);
      if (child && (child._async || (child === scope.options.callback && createScope)) && node.type !== FUNCTION) node._async = true;
      return child;
     }, true);
     node = _flatten(node);
     return node;
    }
   }
   var result = gen(_clone(_root));
   if (fn) {
    fn.parenthesized = true;
    var scope = new Scope(fn.body, fn._scope.options);
    scope.name = fn._scope.name;
    scope.line = fn._scope.line;
    scope.last = fn._scope.last;
    _assert(fn.params[0] === fn._scope.options.callback);
    scope.cbIndex = 0;
    function _changeScope(node, parent) {
     if (node.type == FUNCTION) return node;
     node._scope = scope;
     return _propagate(node, _changeScope);
    }
    _propagate(fn, _changeScope);
   }
   return isExpression ? result.value : result;
  }
  this.root = isExpression ? _root.value : _root;
 }
 function Scope(script, options) {
  this.script = script;
  this.line = 0;
  this.last = 0;
  this.vars = [];
  this.functions = [];
  this.options = options;
  this.cbIndex = -1;
  this.isAsync = function() {
   return this.cbIndex >= 0;
  }
 }
 function _genId(node) {
  return _safeName(node._scope.options.precious, "__" + ++node._scope.last);
 }
 function _markSource(node, options) {
  function _markOne(node) {
   if (typeof node.value === 'string' && node.value.substring(0, 2) === '__') options.precious[node.value] = true;
   node.params && node.params.forEach(function(param) {
    if (param.substring(0, 2) === '__') options.precious[param] = true;
   });
   node._isSourceNode = true;
   _propagate(node, function(child) {
    _markOne(child);
    return child;
   });
  }
  _markOne(node);
 }
 function _isScriptAsync(script, options) {
  var async = false;
  function _doIt(node, parent) {
   switch (node.type) {
   case FUNCTION:
    return node;
   case IDENTIFIER:
    if (node.value == options.callback) {
     async = true;
    } else {
     _propagate(node, _doIt);
    }
    return node;
   case CALL:
    var fn = node.children[0],
     args = node.children[1],
     ident;
    if (fn.type === DOT && (ident = fn.children[1]).value === "call" && (fn = fn.children[0]).type === FUNCTION && fn.params.length === 0 && !fn.name && args.children.length === 1 && args.children[0].type === THIS) {
     _propagate(fn.body, _doIt);
     return node;
    }
   default:
    if (!async) {
     _propagate(node, _doIt);
    }
    return node;
   }
  }
  _propagate(script, _doIt);
  return async;
 }
 var _rootTemplate = new Template("root",
 "(function main(_){ $script }).call(this, __trap);");
 function _canonTopLevelScript(script, options) {
  script._scope = new Scope(script, options);
  if (_isScriptAsync(script, options)) return _rootTemplate.generate(script, {
   $script: script
  });
  else return script;
 }
 var _assignTemplate = new Template("canon", "$lhs = $rhs;");
 function _guessName(node, parent) {
  function _sanitize(name) {
   name = name.replace(/[^A-Z0-9_$]/ig, '_o_');
   return name && !/^\d/.test(name) ? name : '_o_' + name;
  }
  var id = _genId(node),
   n, nn;
  if (parent.type === IDENTIFIER) return _sanitize(parent.value) + id;
  if (parent.type === ASSIGN) {
   n = parent.children[0];
   var s = "";
   while ((n.type === DOT && (nn = n.children[1]).type === IDENTIFIER) || (n.type === INDEX && (nn = n.children[1]).type === STRING)) {
    s = s ? nn.value + "_" + s : nn.value;
    n = n.children[0];
   }
   if (n.type === IDENTIFIER) s = s ? n.value + "_" + s : n.value;
   if (s) return _sanitize(s) + id;
  } else if (parent.type == PROPERTY_INIT) {
   n = parent.children[0];
   if (n.type === IDENTIFIER || n.type === STRING) return _sanitize(n.value) + id;
  }
  return id;
 }
 function _canonScopes(node, options) {
  function _doIt(node, parent) {
   var scope = parent._scope;
   node._scope = scope;
   var async = scope.isAsync();
   if (!async && node.type !== FUNCTION) {
    if (node.type === IDENTIFIER && node.value === options.callback) throw new Error(node.filename + ": Function contains async calls but does not have _ parameter: " + node.name + " at line " + node.lineno);
    return _propagate(node, _doIt);
   }
   switch (node.type) {
   case FUNCTION:
    var result = node;
    var cbIndex = node.params.reduce(function(index, param, i) {
     if (param != options.callback) return index;
     if (index < 0) return i;
     else throw new Error("duplicate _ parameter");
    }, -1);
    if (cbIndex >= 0) {
     if (!node.name) node.name = _guessName(node, parent);
    }
    if (async && (parent.type === SCRIPT || parent.type === BLOCK)) {
     scope.functions.push(node);
     result = undefined;
    }
    var bodyScope = new Scope(node.body, options);
    node.body._scope = bodyScope;
    bodyScope.name = node.name;
    bodyScope.cbIndex = cbIndex;
    bodyScope.line = node.lineno;
    node.body = _propagate(node.body, _doIt);
    if (cbIndex >= 0) bodyScope.functions.push(_string("BEGIN_BODY"));
    node.body.children = bodyScope.functions.concat(node.body.children);
    if (bodyScope.hasThis && !node._inhibitThis) {
     bodyScope.vars.push(_identifier(_safeName(options.precious, "__this"), _node(node, THIS)));
    }
    if (bodyScope.hasArguments && !node._inhibitArguments) {
     bodyScope.vars.push(_identifier(_safeName(options.precious, "__arguments"), _identifier("arguments")));
    }
    if (bodyScope.vars.length > 0) {
     node.body.children.splice(0, 0, _node(node, VAR, bodyScope.vars));
    }
    return result;
   case VAR:
    var children = node.children.map(function(child) {
     if (!scope.vars.some(function(elt) {
      return elt.value == child.value;
     })) {
      scope.vars.push(_identifier(child.value));
     }
     if (!child.initializer) return null;
     child = _assignTemplate.generate(parent, {
      $lhs: _identifier(child.value),
      $rhs: child.initializer
     });
     if (parent.type === FOR) child = child.expression;
     return child;
    }).filter(function(child) {
     return child != null;
    });
    if (children.length == 0) {
     return;
    }
    var type = parent.type == BLOCK || parent.type === SCRIPT ? BLOCK : COMMA;
    var result = _node(parent, type, children);
    result = _propagate(result, _doIt);
    parent._async |= result._async;
    return result;
   case THIS:
    scope.hasThis = true;
    return _identifier(_safeName(options.precious, "__this"));
   case IDENTIFIER:
    if (node.value === "arguments") {
     scope.hasArguments = true;
     return _identifier(_safeName(options.precious, "__arguments"));
    }
    node = _propagate(node, _doIt);
    node._async |= node.value === options.callback;
    if (node._async && !parent.isArgsList &&
     !(parent.type === PROPERTY_INIT && node === parent.children[0]) &&
     !(parent.type === DOT && node === parent.children[1]))
     throw new Error("invalid usage of '_'")
    parent._async |= node._async;
    return node;
   case NEW_WITH_ARGS:
    var cbIndex = node.children[1].children.reduce(function(index, arg, i) {
     if (arg.type !== IDENTIFIER || arg.value !== options.callback) return index;
     if (index < 0) return i;
     else throw new Error("duplicate _ argument");
    }, -1);
    if (cbIndex >= 0) {
     var constr = _node(node, CALL, [_identifier(_safeName(options.precious, '__construct')), _node(node, LIST, [node.children[0], _number(cbIndex)])]);
     node = _node(node, CALL, [constr, node.children[1]]);
    }
    node.children[1].isArgsList = true;
    node = _propagate(node, _doIt);
    parent._async |= node._async;
    return node;
   case CALL:
    node.children[1].isArgsList = true;
    _convertCoffeeScriptCalls(node, options);
    _convertApply(node, options);
    node.children[1].isArgsList = true;
   default:
    node = _propagate(node, _doIt);
    _setBreaks(node);
    parent._async |= node._async;
    return node;
   }
  }
  return _propagate(node, _doIt);
 }
 function _convertCoffeeScriptCalls(node, options) {
  var fn = node.children[0];
  var args = node.children[1];
  if (fn.type === FUNCTION && fn.params.length === 0 && !fn.name && args.children.length == 0) {
   fn._noFuture = true;
   fn.params = [options.callback];
   args.children = [_identifier(options.callback)];
  } else if (fn.type === DOT) {
   var ident = fn.children[1];
   fn = fn.children[0];
   if (fn.type === FUNCTION && fn.params.length === 0 && !fn.name && ident.type === IDENTIFIER) {
    if (ident.value === "call" && args.children.length === 1 && args.children[0].type === THIS) {
     node.children[0] = fn;
     fn._noFuture = true;
     fn.params = [options.callback];
     args.children = [_identifier(options.callback)];
     node._scope.hasThis = true;
     fn._inhibitThis = true;
    } else if (ident.value === "apply" && args.children.length === 2 && args.children[0].type === THIS && args.children[1].type === IDENTIFIER && args.children[1].value === "arguments") {
     node.children[0] = fn;
     fn._noFuture = true;
     fn.params = [options.callback];
     args.children = [_identifier(options.callback)];
     node._scope.hasThis = true;
     node._scope.hasArguments = true;
     fn._inhibitThis = true;
     fn._inhibitArguments = true;
    }
   }
  }
 }
 function _convertApply(node, options) {
  var dot = node.children[0];
  var args = node.children[1];
  if (dot.type === DOT) {
   var ident = dot.children[1];
   if (ident.type === IDENTIFIER && ident.value === "apply" && args.children.length === 2 && args.children[0].type === THIS && args.children[1].type === IDENTIFIER && args.children[1].value === "arguments") {
    var f = dot.children[0];
    node.children[0] = _identifier('__apply');
    args.children = [_identifier(options.callback), f, _identifier('__this'), _identifier('__arguments'), _number(node._scope.cbIndex)];
    node._scope.hasThis = true;
    node._scope.hasArguments = true;
   }
  }
 }
 function _setBreaks(node) {
  switch (node.type) {
  case IF:
   node._breaks = node.thenPart._breaks && node.elsePart && node.elsePart._breaks;
   break;
  case SWITCH:
   for (var i = 0; i < node.cases.length; i++) {
    var stmts = node.cases[i].statements;
    if (node._async && stmts.children.length > 0 && !stmts._breaks) {
     if (i == node.cases.length - 2 && node.cases[i + 1].type === DEFAULT && node.cases[i + 1].statements.children.length === 1 && node.cases[i + 1].statements.children[0].type === SEMICOLON && node.cases[i + 1].statements.children[0].expression == null) {
      stmts.children.push(_node(node, BREAK));
      stmts._breaks = true;
     } else if (i === node.cases.length - 1) {
      stmts.children.push(_node(node, BREAK));
      stmts._breaks = true;
     } else {
      throw new Error(node.filename + ": unsupported construct: switch case with some path not terminated by break, return or throw");
     }
    }
   }
   break;
  case TRY:
   node._breaks = node.tryBlock._breaks && node.catchClauses[0] && node.catchClauses[0].block._breaks;
   break;
  case BLOCK:
  case SCRIPT:
   node.children.forEach(function(child) {
    node._breaks |= child._breaks;
   });
   break;
  case RETURN:
  case THROW:
  case BREAK:
   node._breaks = true;
   break;
  }
 }
 function _statementify(exp) {
  if (!exp) return exp;
  var block = _node(exp, BLOCK, []);
  function uncomma(node) {
   if (node.type === COMMA) {
    node.children.forEach(uncomma);
   } else {
    block.children.push(node.type == SEMICOLON ? node : _semicolon(node));
   }
  }
  uncomma(exp);
  return block;
 }
 function _blockify(node) {
  if (!node || node.type == BLOCK) return node;
  if (node.type == COMMA) return _statementify(node);
  var block = _node(node, BLOCK, [node]);
  block._async = node._async;
  return block;
 }
 var _flowsTemplates = {
  WHILE: new Template("flows", "{" +
  "	for (; $condition;) {" +
  "		$body;" +
  "	}" +
  "}"),
  DO: new Template("flows", "{" +
  "	var $firstTime = true;" +
  "	for (; $firstTime || $condition;) {" +
  "		$firstTime = false;" +
  "		$body;" +
  "	}" +
  "}"),
  FOR: new Template("flows", "{" +
  "	$setup;" +
  "	for (; $condition; $update) {" +
  "		$body;" +
  "	}" +
  "}"),
  FOR_IN: new Template("flows", "{" +
  "	var $array = __forIn($object);" +
  "	var $i = 0;" +
  "	for (; $i < $array.length;) {" +
  "		$iter = $array[$i++];" +
  "		$body;" +
  "	}" +
  "}"),
  TRY: new Template("flows", "" +
  "try {" +
  "	try { $try; }" +
  "	catch ($ex) { $catch; }" +
  "}" +
  "finally { $finally; }"),
  AND: new Template("flows", "" +
  "return (function $name(_){" +
  "	var $v = $op1;" +
  "	if (!$v) {" +
  "		return $v;" +
  "	}" +
  "	return $op2;" +
  "})(_)", true, true),
  OR: new Template("flows", "" +
  "return (function $name(_){" +
  "	var $v = $op1;" +
  "	if ($v) {" +
  "		return $v;" +
  "	}" +
  "	return $op2;" +
  "})(_)", true, true),
  HOOK: new Template("flows", "" +
  "return (function $name(_){" +
  "	var $v = $condition;" +
  "	if ($v) {" +
  "		return $true;" +
  "	}" +
  "	return $false;" +
  "})(_);", true, true),
  COMMA: new Template("flows", "" +
  "return (function $name(_){" +
  "	$body;" +
  "	return $result;" +
  "})(_);", true, true),
  CONDITION: new Template("flows", "" +
  "return (function $name(_){" +
  "	return $condition;" +
  "})(_);", true, true),
  UPDATE: new Template("flows", "" +
  "return (function $name(_){" +
  "	$update;" +
  "})(_);", true, true)
 };
 function _canonFlows(node, options) {
  function _doIt(node, parent) {
   var scope = node._scope;
   function _doAsyncFor(node) {
    if (node.condition && node.condition._async && node.condition.type !== CALL) node.condition = _flowsTemplates.CONDITION.generate(node, {
     $name: "__$" + node._scope.name,
     $condition: node.condition
    });
    if (node.update && node.update._async) node.update = _flowsTemplates.UPDATE.generate(node, {
     $name: "__$" + node._scope.name,
     $update: _statementify(node.update)
    });
   }
   if (node.type == FOR && node._pass === "flows") _doAsyncFor(node);
   if (!scope || !scope.isAsync() || node._pass === "flows") return _propagate(node, _doIt);
   switch (node.type) {
   case IF:
    node.thenPart = _blockify(node.thenPart);
    node.elsePart = _blockify(node.elsePart);
    break;
   case SWITCH:
    if (node._async) {
     var def = node.cases.filter(function(n) {
      return n.type == DEFAULT
     })[0];
     if (!def) {
      def = _node(node, DEFAULT);
      def.statements = _node(node, BLOCK, []);
      node.cases.push(def);
     }
     if (!def._breaks) {
      def.statements.children.push(_node(node, BREAK))
     }
    }
    break;
   case WHILE:
    node.body = _blockify(node.body);
    if (node._async) {
     node = _flowsTemplates.WHILE.generate(node, {
      $condition: node.condition,
      $body: node.body
     });
    }
    break;
   case DO:
    node.body = _blockify(node.body);
    if (node._async) {
     node = _flowsTemplates.DO.generate(node, {
      $firstTime: _identifier(_genId(node)),
      $condition: node.condition,
      $body: node.body
     });
    }
    break;
   case FOR:
    node.condition = node.condition || _number(1);
    node.body = _blockify(node.body);
    if (node._async) {
     if (node.setup) {
      node = _flowsTemplates.FOR.generate(node, {
       $setup: _statementify(node.setup),
       $condition: node.condition,
       $update: node.update,
       $body: node.body
      });
     } else {
      if (node._pass !== "flows") {
       node._pass = "flows";
       _doAsyncFor(node);
      }
     }
    }
    break;
   case FOR_IN:
    node.body = _blockify(node.body);
    if (node._async) {
     if (node.iterator.type != IDENTIFIER) {
      throw new Error("unsupported 'for ... in' syntax: type=" + _tag(node.iterator));
     }
     node = _flowsTemplates.FOR_IN.generate(node, {
      $array: _identifier(_genId(node)),
      $i: _identifier(_genId(node)),
      $object: node.object,
      $iter: node.iterator,
      $body: node.body
     });
    }
    break;
   case TRY:
    if (node.tryBlock && node.catchClauses[0] && node.finallyBlock) {
     node = _flowsTemplates.TRY.generate(node, {
      $try: node.tryBlock,
      $catch: node.catchClauses[0].block,
      $ex: node.catchClauses[0].varName,
      $finally: node.finallyBlock
     })
    }
    break;
   case AND:
   case OR:
    if (node._async) {
     node = _flowsTemplates[_tag(node)].generate(node, {
      $name: "__$" + node._scope.name,
      $v: _identifier(_genId(node)),
      $op1: node.children[0],
      $op2: node.children[1]
     });
    }
    break;
   case HOOK:
    if (node._async) {
     node = _flowsTemplates.HOOK.generate(node, {
      $name: "__$" + node._scope.name,
      $v: _identifier(_genId(node)),
      $condition: node.children[0],
      $true: node.children[1],
      $false: node.children[2]
     });
    }
    break;
   case COMMA:
    if (node._async) {
     node = _flowsTemplates.COMMA.generate(node, {
      $name: "__$" + node._scope.name,
      $body: _node(node, BLOCK, node.children.slice(0, node.children.length - 1).map(_semicolon)),
      $result: node.children[node.children.length - 1]
     });
    }
    break;
   }
   return _propagate(node, _doIt);
  }
  return _propagate(node, _doIt);
 }
 function _split(node, prop) {
  var exp = node[prop];
  if (!exp || !exp._async) return node;
  var id = _genId(node);
  var v = _identifier(id, exp);
  node[prop] = _identifier(id);
  return _node(node, BLOCK, [_node(node, VAR, [v]), node]);
 }
 function _disassemble(node, options) {
  function _disassembleIt(node, parent, noResult) {
   if (!node._async) return _propagate(node, _scanIt);
   node = _propagate(node, _disassembleIt);
   if (node.type === CALL) {
    if (node.children[0].type === IDENTIFIER && node.children[0].value.indexOf('__wrap') == 0) {
     node._isWrapper = true;
     return node;
    }
    var args = node.children[1];
    if (args.children.some(function(arg) {
     return (arg.type === IDENTIFIER && arg.value === options.callback) || arg._isWrapper;
    })) {
     if (noResult) {
      node._scope.disassembly.push(_statementify(node));
      return;
     } else {
      if (parent.type == IDENTIFIER && parent.value.indexOf('__') === 0) {
       node._skipDisassembly = true;
       return node;
      }
      var id = _genId(node);
      var v = _identifier(id, node);
      node = _node(node, VAR, [v]);
      node._scope.disassembly.push(node);
      return _identifier(id);
     }
    }
   }
   return node;
  }
  function _scanIt(node, parent) {
   var scope = node._scope;
   if (!scope || !scope.isAsync() || !node._async) return _propagate(node, _scanIt);
   switch (node.type) {
   case IF:
    node = _split(node, "condition");
    break;
   case SWITCH:
    node = _split(node, "discriminant");
    break;
   case FOR:
    break;
   case RETURN:
    node = _split(node, "value");
    break;
   case THROW:
    node = _split(node, "exception");
    break;
   case VAR:
    _assert(node.children.length === 1);
    var ident = node.children[0];
    scope.disassembly = [];
    ident.initializer = _disassembleIt(ident.initializer, ident);
    node._async = ident.initializer._skipDisassembly;
    scope.disassembly.push(node);
    return _node(parent, BLOCK, scope.disassembly);
   case SEMICOLON:
    scope.disassembly = [];
    node.expression = _disassembleIt(node.expression, node, true);
    if (node.expression) {
     node._async = false;
     scope.disassembly.push(node);
    }
    return _node(parent, BLOCK, scope.disassembly);
   }
   return _propagate(node, _scanIt);
  }
  return _propagate(node, _scanIt);
 }
 var _cbTemplates = {
  FUNCTION: new Template("cb", "{" +
  "	$decls;" +
  "	var __frame = { name: $fname, line: $line };" +
  "	return __func(_, this, arguments, $fn, $index, __frame, function $name(){" +
  "		$body;" +
  "		_();" +
  "	});" +
  "}"),
  FUNCTION_INTERNAL: new Template("cb", "{ $decls; $body; _(); }"),
  RETURN: new Template("cb", "return _(null, $value);"),
  RETURN_UNDEFINED: new Template("cb", "return _(null);"),
  THROW: new Template("cb", "return _($exception);"),
  IF: new Template("cb", "" +
  "return (function $name(__then){" +
  "	if ($condition) { $then; __then(); }" +
  "	else { $else; __then(); }" +
  "})(function $name(){ $tail; });"),
  SWITCH: new Template("cb", "" +
  "return (function $name(__break){" +
  "	$statement;" +
  "})(function $name(){ $tail; });"),
  BREAK: new Template("cb", "return __break();"),
  CONTINUE: new Template("cb", "" +
  "while (__more) { __loop(); } __more = true;" +
  "return;"),
  LOOP1: new Template("cb", "" +
  "if ($v) {" +
  "	$body;" +
  "	while (__more) { __loop(); } __more = true;" +
  "}" +
  "else { __break(); }"),
  LOOP2: new Template("temp", "var $v = $condition; $loop1;"),
  LOOP2_UPDATE: new Template("temp", "" +
  "if ($beenHere) { $update; } else { $beenHere = true; }" +
  "var $v = $condition; $loop1;"),
  FOR: new Template("cb", "" +
  "return (function ___(__break){" +
  "	var __more;" +
  "	var __loop = __cb(_, __frame, 0, 0, function $name(){" +
  "		__more = false;" +
  "		$loop2" +
  "	});" +
  "	do { __loop(); } while (__more); __more = true;" +
  "})(function $name(){ $tail;});"),
  FOR_UPDATE: new Template("cb", "" +
  "var $beenHere = false;" +
  "return (function ___(__break){" +
  "	var __more;" +
  "	var __loop = __cb(_, __frame, 0, 0, function $name(){" +
  "		__more = false;" +
  "		$loop2" +
  "	});" +
  "	do { __loop(); } while (__more); __more = true;" +
  "})(function $name(){ $tail; });"),
  CATCH: new Template("cb", "" +
  "return (function ___(__then){" +
  "	(function ___(_){" +
  "		__tryCatch(_, function $name(){ $try; __then(); });" +
  "	})(function ___($ex, __result){" +
  "		__tryCatch(_, function $name(){" +
  "			if ($ex) { $catch; __then(); }" +
  "			else { _(null, __result); }" +
  "		});" +
  "	});" +
  "})(function ___(){" +
  "	__tryCatch(_, function $name(){ $tail; });" +
  "});"),
  FINALLY: new Template("cb", "" +
  "return (function ___(__then){" +
  "	(function ___(_){" +
  "		__tryCatch(_, function $name(){ $try; _(null, null, true); });" +
  "	})(function ___(__e, __r, __cont){" +
  "		(function ___(__then){" +
  "			__tryCatch(_, function $name(){ $finally; __then(); });" +
  "		})(function ___(){" +
  "			__tryCatch(_, function ___(){" +
  "				if (__cont) __then(); else _(__e, __r);" +
  "			});" +
  "		})" +
  "	});" +
  "})(function ___(){" +
  "	__tryCatch(_, function $name(){ $tail; });" +
  "});"),
  CALL_VOID: new Template("cb", "return __cb(_, __frame, $offset, $col, function $name(){ $tail; }, true)", true),
  CALL_TMP: new Template("cb", "return __cb(_, __frame, $offset, $col, function ___(__0, $result){ $tail }, true)", true),
  CALL_RESULT: new Template("cb", "" +
  "return __cb(_, __frame, $offset, $col, function $name(__0, $v){" +
  "	var $result = $v;" +
  "	$tail" +
  "}, true)", true)
 };
 function _callbackify(node, options) {
  function _scanIt(node, parent) {
   node = _flatten(node);
   if (!node._scope || !node._scope.isAsync() || node._pass === "cb") return _propagate(node, _scanIt);
   switch (node.type) {
   case SCRIPT:
    if (parent._pass !== "cb") {
     var decls;
     for (var cut = 0; cut < node.children.length; cut++) {
      var child = node.children[cut];
      if (child.type === STRING && child.value === "BEGIN_BODY") {
       decls = node.children.splice(0, cut);
       node.children.splice(0, 1);
       break;
      }
     }
     var template = parent._noFuture || parent._pass === "flows" ? _cbTemplates.FUNCTION_INTERNAL : _cbTemplates.FUNCTION;
     node = template.generate(node, {
      $fn: parent.name,
      $name: "__$" + node._scope.name,
      $fname: _string(parent.name),
      $line: _number(node._scope.line),
      $index: _number(node._scope.cbIndex),
      $decls: _node(node, BLOCK, decls || []),
      $body: node
     });
    }
    node.type = SCRIPT;
   case BLOCK:
    for (var i = 0; i < node.children.length; i++) {
     node.children[i] = _restructureIt(node, i);
    }
    return node;
   }
   return _propagate(node, _scanIt);
  }
  function _extractTail(parent, i) {
   return _node(parent, BLOCK, parent.children.splice(i + 1, parent.children.length - i - 1));
  }
  function _restructureIt(parent, i) {
   var node = parent.children[i];
   if (node._pass === "cb") return _propagate(node, _scanIt);
   switch (node.type) {
   case RETURN:
    _extractTail(parent, i);
    var template = node.value ? _cbTemplates.RETURN : _cbTemplates.RETURN_UNDEFINED;
    node = template.generate(node, {
     $value: node.value
    });
    break;
   case THROW:
    _extractTail(parent, i);
    node = _cbTemplates.THROW.generate(node, {
     $exception: node.exception
    });
    break;
   case BREAK:
    if (node.target && !node.target._async) {
     break;
    }
    _extractTail(parent, i);
    if (node.label) {
     throw new Error(node.filename + ": labelled break not supported yet");
    }
    node = _cbTemplates.BREAK.generate(node, {});
    break;
   case CONTINUE:
    if (node.target && !node.target._async) {
     break;
    }
    _extractTail(parent, i);
    if (node.label) {
     throw new Error(node.filename + ": labelled continue not supported yet");
    }
    node = _cbTemplates.CONTINUE.generate(node, {});
    break;
   case TRY:
    var tail = _extractTail(parent, i);
    if (node.catchClauses[0]) {
     node = _cbTemplates.CATCH.generate(node, {
      $name: "__$" + node._scope.name,
      $try: node.tryBlock,
      $catch: node.catchClauses[0].block,
      $ex: node.catchClauses[0].varName,
      $tail: tail
     });
    } else {
     node = _cbTemplates.FINALLY.generate(node, {
      $name: "__$" + node._scope.name,
      $try: node.tryBlock,
      $finally: node.finallyBlock,
      $tail: tail
     });
    }
    break;
   default:
    if (node._async) {
     var tail = _extractTail(parent, i);
     switch (node.type) {
     case IF:
      node = _cbTemplates.IF.generate(node, {
       $name: "__$" + node._scope.name,
       $condition: node.condition,
       $then: node.thenPart,
       $else: node.elsePart || _node(node, BLOCK, []),
       $tail: tail
      });
      break;
     case SWITCH:
      node._pass = "cb";
      node = _cbTemplates.SWITCH.generate(node, {
       $name: "__$" + node._scope.name,
       $statement: node,
       $tail: tail
      });
      break;
     case FOR:
      var v = _identifier(_genId(node));
      var loop1 = _cbTemplates.LOOP1.generate(node, {
       $v: v,
       $body: node.body,
      });
      var update = node.update;
      var beenHere = update && _identifier(_genId(node));
      var loop2 = (update ? _cbTemplates.LOOP2_UPDATE : _cbTemplates.LOOP2).generate(node, {
       $v: v,
       $condition: node.condition,
       $beenHere: beenHere,
       $update: _statementify(update),
       $loop1: loop1
      });
      node = (update ? _cbTemplates.FOR_UPDATE : _cbTemplates.FOR).generate(node, {
       $name: "__$" + node._scope.name,
       $beenHere: beenHere,
       $loop2: loop2,
       $tail: tail
      });
      break;
     case VAR:
      _assert(node.children.length == 1);
      var ident = node.children[0];
      _assert(ident.type === IDENTIFIER);
      var call = ident.initializer;
      delete ident.initializer;
      _assert(call && call.type === CALL);
      return _restructureCall(call, tail, ident.value);
     case SEMICOLON:
      var call = node.expression;
      _assert(call.type === CALL)
      return _restructureCall(call, tail);
     default:
      throw new Error("internal error: bad node type: " + _tag(node) + ": " + pp(node));
     }
    }
   }
   return _scanIt(node, parent);
   function _restructureCall(node, tail, result) {
    var args = node.children[1];
    function _cbIndex(args) {
     return args.children.reduce(function(index, arg, i) {
      if ((arg.type == IDENTIFIER && arg.value === options.callback) || arg._isWrapper) return i;
      else return index;
     }, -1);
    }
    var i = _cbIndex(args);
    _assert(i >= 0);
    if (args.children[i]._isWrapper) {
     args = args.children[i].children[1];
     i = _cbIndex(args);
    }
    var bol = node.start;
    while (bol >= 0 && options.source[bol] != '\n')
    bol--;
    args.children[i] = (result ? result.indexOf('__') === 0 ? _cbTemplates.CALL_TMP : _cbTemplates.CALL_RESULT : _cbTemplates.CALL_VOID).generate(node, {
     $v: _genId(node),
     $frameName: _string(node._scope.name),
     $offset: _number(node.lineno - node._scope.line),
     $col: _number(node.start - bol - 1),
     $name: "__$" + node._scope.name,
     $result: result,
     $tail: tail
    });
    node = _propagate(node, _scanIt);
    var stmt = _node(node, RETURN, []);
    stmt.value = node;
    stmt._pass = "cb";
    return stmt;
   }
  }
  return _propagate(node, _scanIt);
 }
 function _checkUsed(val, used) {
  if (typeof val === "string" && val.substring(0, 2) === "__") used[val] = true;
 }
 var _optims = {
  function__0$fn: new Template("simplify", "return function ___(__0) { $fn(); }", true).root,
  function$return: new Template("simplify", "return function $fn1() { return $fn2(); }", true).root,
  function__0$arg1return_null$arg2: new Template("simplify", "return function ___(__0, $arg1) { return _(null, $arg2); }", true).root,
  __cb__: new Template("simplify", "return __cb(_, $frameVar, $line, $col, _)", true).root,
  __cbt__: new Template("simplify", "return __cb(_, $frameVar, $line, $col, _, true)", true).root,
  function$fn: new Template("simplify", "return function $fn1() { $fn2(); }", true).root
 }
 function _simplify(node, options, used) {
  if (node._simplified) return node;
  node._simplified = true;
  _propagate(node, function(child) {
   return _simplify(child, options, used)
  });
  _checkUsed(node.value, used);
  function _match(prop, v1, v2, result) {
   var ignored = ["parenthesized", "lineno", "start", "end", "tokenizer", "hasReturnWithValue"];
   if (prop.indexOf('_') == 0 || ignored.indexOf(prop) >= 0) return true;
   if (v1 == v2) return true;
   if (v1 == null || v2 == null) {
    if (prop == "children" && v1 && v1.length === 0) return true;
    return false;
   }
   if (Array.isArray(v1)) {
    if (v1.length != v2.length) return false;
    for (var i = 0; i < v1.length; i++) {
     if (!_match(prop, v1[i], v2[i], result)) return false;
    }
    return true;
   }
   if (v1.type === IDENTIFIER && v1.value[0] === "$" && v2.type === NUMBER) {
    result[v1.value] = v2.value;
    return true;
   }
   if (typeof v1 == "string" && v1[0] == "$" && typeof v2 == "string") {
    result[v1] = v2;
    return true;
   }
   if (v1.type) {
    var exp;
    if (v1.type == SCRIPT && v1.children[0] && (exp = v1.children[0].expression) && typeof exp.value == "string" && exp.value[0] == '$') {
     result[exp.value] = v2;
     return true;
    }
    if (v1.type != v2.type) return false;
    if (v1.type == IDENTIFIER && v1.value == '$') {
     result[v1.value] = v2.value;
     return true;
    }
    for (var prop in v1) {
     if (v1.hasOwnProperty(prop) && prop.indexOf("Decls") < 0 && prop != "target") {
      if (!_match(prop, v1[prop], v2[prop], result)) return false;
     }
    }
    return true;
   }
   return false;
  }
  var result = {};
  if (_match("", _optims.function__0$fn, node, result)) return _identifier(result.$fn);
  if (_match("", _optims.function$return, node, result) && (result.$fn1 === '___' || result.$fn1.indexOf('__$') === 0) && (result.$fn2 === '__break')) return _identifier(result.$fn2);
  if (_match("", _optims.function__0$arg1return_null$arg2, node, result) && result.$arg1 == result.$arg2) return _identifier("_");
  if (options.optimize && _match("", _optims.__cb__, node, result)) return _identifier("_");
  if (options.optimize && _match("", _optims.__cbt__, node, result)) return _identifier("_");
  if (_match("", _optims.function$fn, node, result) && (result.$fn1 === '___' || result.$fn1.indexOf('__$') === 0) && (result.$fn2 === '_' || result.$fn2 === '__then' || result.$fn2 === '__loop')) return _identifier(result.$fn2);
  _flatten(node);
  return node;
 }
 function _extend(obj, other) {
  for (var i in other) {
   obj[i] = other[i];
  }
  return obj;
 }
 function _cl(obj) {
  return _extend({}, obj);
 }
 exports.transform = function(source, options) {
  try {
   source = source.replace(/\r\n/g, "\n");
   options = options ? _extend({}, options) : {};
   var sourceOptions = /streamline\.options\s*=\s*(\{.*\})/.exec(source);
   if (sourceOptions) {
    _extend(options, JSON.parse(sourceOptions[1]));
   }
   options.source = source;
   options.callback = options.callback || "_";
   options.lines = options.lines || "preserve";
   options.precious = {};
   var node = parse(source + "\n");
   var strict = node.children[0] && node.children[0].expression && node.children[0].expression.value == "use strict";
   strict && node.children.splice(0, 1);
   _markSource(node, options);
   node = _canonTopLevelScript(node, options);
   node = _canonScopes(node, options);
   node = _canonFlows(node, options);
   node = _disassemble(node, options);
   node = _callbackify(node, options);
   var used = {};
   node = _simplify(node, options, used);
   var result = format(node, options.lines);
   if (!options.noHelpers) result = exports.helpersSource(options, used, strict) + result;
   return result;
  } catch (err) {
   var message = "error streamlining " + (options.sourceName || 'source') + ": " + err.message;
   if (err.source && err.cursor) {
    var line = 1;
    for (var i = 0; i < err.cursor; i++) {
     if (err.source[i] === "\n") line += 1;
    }
    message += " on line " + line;
   } else if (err.stack) {
    message += "\nSTACK:\n" + err.stack;
   }
   throw new Error(message);
  }
 }
 function _trim(fn) {
  return fn.toString().replace(/\s+/g, " ");
 }
 exports.helpersSource = function(options, used, strict) {
  var srcName = "" + options.sourceName;
  var i = srcName.indexOf('node_modules/');
  if (i == -1 && typeof process === 'object' && typeof process.cwd === 'function') i = process.cwd().length;
  srcName = i >= 0 ? srcName.substring(i + 13) : srcName;
  var sep = options.lines == "preserve" ? " " : "\n";
  strict = strict ? '"use strict";' + sep : "";
  var s = sep + strict;
  var rt = require("streamline/lib/callbacks/runtime").runtime(options.sourceName + ".js");
  var __rt = _safeName(options.precious, "__rt");
  s += "var " + __rt + "=require('streamline/lib/callbacks/runtime').runtime(__filename)";
  for (var key in rt) {
   var k = _safeName(options.precious, key);
   if (used[k]) s += "," + k + "=" + __rt + "." + key;
  }
  s += ";" + sep;
  return s;
 }
})(typeof exports !== 'undefined' ? exports : (window.Streamline = window.Streamline || {}));
(function(exports) {
 var globals = require("streamline/lib/globals");
 exports.future = function(fn, args, i) {
  var err, result, done, q = [];
  args = Array.prototype.slice.call(args);
  function notify(e, r) {
   err = e, result = r, done = true;
   q && q.forEach(function(f) {
    try {
     if (f.timeout) {
      clearTimeout(f.timeout);
      delete f.timeout;
     }
     var ignore = f.ignore;
     f.ignore = true;
     if (!ignore) f(e, r);
    } catch (ex) {
     __trap(ex);
    }
   });
   q = null;
  };
  args[i] = notify;
  future.prev = globals.future;
  globals.future = future;
  try {
   fn.apply(this, args);
  } finally {
   globals.future = future.prev;
  }
  function future(cb, timeout) {
   if (!cb) return future;
   if (future.cancelled) return cb(new Error("future cancelled"));
   if (done) return cb(err, result);
   if (typeof timeout === 'number') {
    timeout = { timeout: timeout };
   }
   var ncb = cb;
   if (timeout != null) {
    ncb = function(e, r) {
     cb(e, r);
    }
    ncb.timeout = setTimeout(function() {
     if (ncb.timeout) {
      clearTimeout(ncb.timeout);
      delete ncb.timeout;
      var nfy = cb, v;
      if (timeout.probe) {
       ncb.ignore = true;
      } else {
       future.cancelled = true;
       nfy = notify;
      }
      if ("return" in timeout) {
       v = timeout.return;
       nfy(null, typeof v === 'function' ? v() : v);
      } else {
       v = timeout.throw || "timeout";
       nfy(typeof v === 'function' ? v() : typeof v === 'string' ? new Error(v) : v);
      }
     }
    }, timeout.timeout);
   }
   q.push(ncb);
  }
  return future;
 }
})(typeof exports !== 'undefined' ? exports : (Streamline.future = Streamline.future || {}));
(function(exports) {
 var __g = require("streamline/lib/globals");
 var __future = require("streamline/lib/util/future").future;
 __g.context = __g.context || {};
 __g.depth = __g.depth || 0;
 __g.trampoline = (function() {
  var q = [];
  return {
   queue: function(fn) {
    q.push(fn);
   },
   flush: function() {
    __g.depth++;
    try {
     var fn;
     while (fn = q.shift()) fn();
    } finally {
     __g.depth--;
    }
   }
  }
 })();
 exports.runtime = function(filename) {
  function __func(_, __this, __arguments, fn, index, frame, body) {
   if (!_) {
    return __future.call(__this, fn, __arguments, index);
   }
   frame.file = filename;
   frame.prev = __g.frame;
   __g.frame = frame;
   __g.depth++;
   try {
    frame.active = true;
    body();
   } catch (e) {
    __setEF(e, frame.prev);
    __propagate(_, e);
   } finally {
    frame.active = false;
    __g.frame = frame.prev;
    if (--__g.depth === 0 && __g.trampoline) __g.trampoline.flush();
   }
  }
  return {
   __g: __g,
   __func: __func,
   __cb: __cb,
   __future: __future,
   __propagate: __propagate,
   __trap: __trap,
   __tryCatch: __tryCatch,
   __forIn: __forIn,
   __apply: __apply,
   __construct: __construct,
   __setEF: __setEF
  };
 }
 function __cb(_, frame, offset, col, fn, trampo) {
  frame.offset = offset;
  frame.col = col;
  var ctx = __g.context;
  var fut = __g.future;
  return function ___(err, result) {
   for (var f = fut; f; f = f.prev) {
    if (f.cancelled) err = new Error("cancelled");
   }
   var oldFrame = __g.frame;
   __g.frame = frame;
   __g.context = ctx;
   var oldFut = __g.future;
   __g.future = fut;
   __g.depth++;
   try {
    if (trampo && frame.active && __g.trampoline) {
     __g.trampoline.queue(function() {
      return ___(err, result);
     });
    } else {
     if (err) {
      __setEF(err, frame);
      return _(err);
     }
     frame.active = true;
     return fn(null, result);
    }
   } catch (ex) {
    __setEF(ex, frame);
    return __propagate(_, ex);
   } finally {
    frame.active = false;
    __g.frame = oldFrame;
    if (--__g.depth === 0 && __g.trampoline) __g.trampoline.flush();
    __g.future = oldFut;
   }
  }
 }
 function __propagate(_, err) {
  try {
   _(err);
  } catch (ex) {
   __trap(ex);
  }
 }
 function __trap(err) {
  if (err) {
   if (__g.context && __g.context.errorHandler) __g.context.errorHandler(err);
   else __g.trampoline.queue(function() {
    throw err;
   });
  }
 }
 __tryCatch: function __tryCatch(_, fn) {
  try {
   fn();
  } catch (e) {
   try {
    _(e);
   } catch (ex) {
    __trap(ex);
   }
  }
 }
 function __forIn(object) {
  var array = [];
  for (var obj in object) {
   array.push(obj);
  }
  return array;
 }
 function __apply(cb, fn, thisObj, args, index) {
  if (cb == null) return __future(__apply, arguments, 0);
  args = Array.prototype.slice.call(args, 0);
  args[index != null ? index : args.length] = cb;
  return fn.apply(thisObj, args);
 }
 function __construct(constructor, i) {
  var key = '__async' + i,
   f;
  return constructor[key] || (constructor[key] = function() {
   var args = arguments;
   function F() {
    var self = this;
    var cb = args[i];
    args[i] = function(e, r) {
     cb(e, self);
    }
    return constructor.apply(self, args);
   }
   F.prototype = constructor.prototype;
   return new F();
  });
 }
 function __setEF(e, f) {
  function formatStack(e, raw) {
   var s = raw,
    f, skip, skipFunc = 0;
   if (s) {
    var ff;
    s = s.split('\n').map(function(l) {
     var ffOffset = (typeof navigator === 'object' && typeof require === 'function' && require.async) ? 10 : 0;
     var m = /(^[^(]+)\([^@]*\@(.*)\:(\d+)$/.exec(l);
     l = m ? "    at " + m[1] + " (" + m[2] + ":" + (parseInt(m[3]) - ffOffset) + ":0)" : l;
     ff = ff || (m != null);
     var i = l.indexOf('__$');
     if (i >= 0 && !skip) {
      skip = true;
      return l.substring(0, i) + l.substring(i + 3) + '\n';
     }
     return skip ? '' : l + '\n';
    }).join('');
    if (ff)
    s = "Error: " + e.message + '\n' + s;
    for (var f = e.__frame; f; f = f.prev) {
     if (f.offset >= 0) s += "    at " + f.name + " (" + f.file + ":" + (f.line + f.offset) + ":" + f.col + ")\n"
    }
   }
   return s;
  };
  e.__frame = e.__frame || f;
  if (exports.stackTraceEnabled && e.__lookupGetter__ && e.__lookupGetter__("rawStack") == null) {
   var getter = e.__lookupGetter__("stack");
   if (!getter) {
    var raw = e.stack || "raw stack unavailable";
    getter = function() {
     return raw;
    }
   }
   e.__defineGetter__("rawStack", getter);
   e.__defineGetter__("stack", function() {
    return formatStack(e, getter());
   });
  }
 }
 exports.stackTraceEnabled = true;
})(typeof exports !== 'undefined' ? exports : (Streamline.runtime = Streamline.runtime || {}));
require && require("streamline/lib/callbacks/builtins");
                                                                  var __rt=require('streamline/lib/callbacks/runtime').runtime(__filename),__func=__rt.__func,__cb=__rt.__cb; (function(exports) {
  "use strict";
  var VERSION = 3;
  var future = function(fn, args, i) {
    var err, result, done, q = [], self = this;
    args = Array.prototype.slice.call(args);
    args[i] = function(e, r) {
      err = e, result = r, done = true;
      (q && q.forEach(function(f) {
        f.call(self, e, r); }));
      q = null; };
    fn.apply(this, args);
    return function F(cb) {
      if (!cb) { return F };
      if (done) { cb.call(self, err, result); } else {
        q.push(cb); }; }; };
  exports.funnel = function(max) {
    max = ((max == null) ? -1 : max);
    if ((max === 0)) { max = funnel.defaultSize; };
    if ((typeof max !== "number")) { throw new Error(("bad max number: " + max)) };
    var queue = [], active = 0, closed = false;
    var fun = function(callback, fn) {
      if ((callback == null)) { return future(fun, arguments, 0) };
      if (((max < 0) || (max == Infinity))) { return fn(callback) };
      queue.push({
        fn: fn,
        cb: callback });
      function _doOne() {
        var current = queue.splice(0, 1)[0];
        if (!current.cb) { return current.fn() };
        active++;
        current.fn(function(err, result) {
          active--;
          if (!closed) {
            current.cb(err, result);
            while (((active < max) && (queue.length > 0))) { _doOne();; }; } ; }); };
      while (((active < max) && (queue.length > 0))) { _doOne();; }; };
    fun.close = function() {
      queue = [], closed = true; };
    return fun; };
  var funnel = exports.funnel;
  funnel.defaultSize = 4;
  function _parallel(options) {
    if ((typeof options === "number")) { return options };
    if ((typeof options.parallel === "number")) { return options.parallel };
    return (options.parallel ? -1 : 1); };
  if ((Array.prototype.forEach_ && (Array.prototype.forEach_.version_ >= VERSION))) { return };
  try {
    Object.defineProperty({ }, "x", { });
  } catch (e) {
    return; };
  var has = Object.prototype.hasOwnProperty;
  delete Array.prototype.forEach_;
  Object.defineProperty(Array.prototype, "forEach_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__1(_, options, fn, thisObj) { var par, len, i, __this = this; var __frame = { name: "value__1", line: 120 }; return __func(_, this, arguments, value__1, 0, __frame, function __$value__1() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__1(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __2 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__1() { __more = false; if (__2) { i++; } else { __2 = true; } ; var __1 = (i < len); if (__1) { return (function __$value__1(__then) {
                    if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 7, 28, __then, true), __this[i], i); } else { __then(); } ; })(function __$value__1() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            return __this.map_(__cb(_, __frame, 10, 4, __then, true), par, fn, thisObj); } ; })(function __$value__1() { return _(null, __this); }); }); } });
  Array.prototype.forEach_.version_ = VERSION;
  delete Array.prototype.map_;
  Object.defineProperty(Array.prototype, "map_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__2(_, options, fn, thisObj) { var par, len, result, i, fun, __this = this; var __frame = { name: "value__2", line: 143 }; return __func(_, this, arguments, value__2, 0, __frame, function __$value__2() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__2(__then) {
          if (((par === 1) || (len <= 1))) {
            result = new Array(len);
            i = 0; var __4 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__2() { __more = false; if (__4) { i++; } else { __4 = true; } ; var __3 = (i < len); if (__3) { return (function __$value__2(__then) {
                    if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 9, 40, function ___(__0, __1) { result[i] = __1; __then(); }, true), __this[i], i); } else { __then(); } ; })(function __$value__2() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            fun = funnel(par);
            result = __this.map(function(elt, i) {
              return fun(null, function __1(_) { var __frame = { name: "__1", line: 157 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                  return fn.call(thisObj, __cb(_, __frame, 1, 13, _, true), elt, i); }); }); });
            i = 0; var __7 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__2() { __more = false; if (__7) { i++; } else { __7 = true; } ; var __6 = (i < len); if (__6) { return (function __$value__2(__then) {
                    if (has.call(__this, i)) { return result[i](__cb(_, __frame, 19, 40, function ___(__0, __2) { result[i] = __2; __then(); }, true)); } else { __then(); } ; })(function __$value__2() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } ; })(function __$value__2() {
          return _(null, result); }); }); } });
  delete Array.prototype.filter_;
  Object.defineProperty(Array.prototype, "filter_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__3(_, options, fn, thisObj) { var par, result, len, i, elt, __this = this; var __frame = { name: "value__3", line: 175 }; return __func(_, this, arguments, value__3, 0, __frame, function __$value__3() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        result = [];
        len = __this.length; return (function __$value__3(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __4 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__3() { __more = false; if (__4) { i++; } else { __4 = true; } ; var __3 = (i < len); if (__3) { return (function __$value__3(__then) {
                    if (has.call(__this, i)) {
                      elt = __this[i];
                      return fn.call(thisObj, __cb(_, __frame, 10, 10, function ___(__0, __2) { return (function __$value__3(__then) { if (__2) { result.push(elt); __then(); } else { __then(); } ; })(__then); }, true), elt); } else { __then(); } ; })(function __$value__3() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            return __this.map_(__cb(_, __frame, 14, 4, __then, true), par, function __1(_, elt) { var __frame = { name: "__1", line: 189 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                return fn.call(thisObj, __cb(_, __frame, 1, 9, function ___(__0, __1) { return (function __$__1(__then) { if (__1) { result.push(elt); __then(); } else { __then(); } ; })(_); }, true), elt); });
            }, thisObj); } ; })(function __$value__3() {
          return _(null, result); }); }); } });
  delete Array.prototype.every_;
  Object.defineProperty(Array.prototype, "every_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__4(_, options, fn, thisObj) { var par, len, i, fun, futures, __this = this; var __frame = { name: "value__4", line: 203 }; return __func(_, this, arguments, value__4, 0, __frame, function __$value__4() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__4(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __6 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__4() { __more = false; if (__6) { i++; } else { __6 = true; } ; var __5 = (i < len); if (__5) { return (function __$value__4(_) {
                    var __1 = has.call(__this, i); if (!__1) { return _(null, __1); } ; return fn.call(thisObj, __cb(_, __frame, 8, 31, function ___(__0, __3) { var __2 = !__3; return _(null, __2); }, true), __this[i]); })(__cb(_, __frame, -202, 17, function ___(__0, __3) { return (function __$value__4(__then) { if (__3) { return _(null, false); } else { __then(); } ; })(function __$value__4() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            fun = funnel(par);
            futures = __this.map(function(elt) {
              return fun(null, function __1(_) { var __frame = { name: "__1", line: 216 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                  return fn.call(thisObj, __cb(_, __frame, 1, 13, _, true), elt); }); }); });
            i = 0; var __9 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__4() { __more = false; if (__9) { i++; } else { __9 = true; } ; var __8 = (i < len); if (__8) { return (function __$value__4(_) {
                    var __2 = has.call(__this, i); if (!__2) { return _(null, __2); } ; return futures[i](__cb(_, __frame, 18, 31, function ___(__0, __4) { var __3 = !__4; return _(null, __3); }, true)); })(__cb(_, __frame, -202, 17, function ___(__0, __4) { return (function __$value__4(__then) { if (__4) {
                        fun.close();
                        return _(null, false); } else { __then(); } ; })(function __$value__4() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } ; })(function __$value__4() {
          return _(null, true); }); }); } });
  delete Array.prototype.some_;
  Object.defineProperty(Array.prototype, "some_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__5(_, options, fn, thisObj) { var par, len, i, fun, futures, __this = this; var __frame = { name: "value__5", line: 237 }; return __func(_, this, arguments, value__5, 0, __frame, function __$value__5() {
        if ((typeof options === "function")) { thisObj = fn, fn = options, options = 1; } ;
        par = _parallel(options);
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length; return (function __$value__5(__then) {
          if (((par === 1) || (len <= 1))) {
            i = 0; var __6 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__5() { __more = false; if (__6) { i++; } else { __6 = true; } ; var __5 = (i < len); if (__5) { return (function __$value__5(_) {
                    var __1 = has.call(__this, i); if (!__1) { return _(null, __1); } ; return fn.call(thisObj, __cb(_, __frame, 7, 30, _, true), __this[i]); })(__cb(_, __frame, -236, 17, function ___(__0, __3) { return (function __$value__5(__then) { if (__3) { return _(null, true); } else { __then(); } ; })(function __$value__5() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } else {
            fun = funnel(par);
            futures = __this.map(function(elt) {
              return fun(null, function __1(_) { var __frame = { name: "__1", line: 249 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() {
                  return fn.call(thisObj, __cb(_, __frame, 1, 13, _, true), elt); }); }); });
            i = 0; var __9 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__5() { __more = false; if (__9) { i++; } else { __9 = true; } ; var __8 = (i < len); if (__8) { return (function __$value__5(_) {
                    var __2 = has.call(__this, i); if (!__2) { return _(null, __2); } ; return futures[i](__cb(_, __frame, 17, 30, _, true)); })(__cb(_, __frame, -236, 17, function ___(__0, __4) { return (function __$value__5(__then) { if (__4) {
                        fun.close();
                        return _(null, true); } else { __then(); } ; })(function __$value__5() { while (__more) { __loop(); }; __more = true; }); }, true)); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(__then); } ; })(function __$value__5() {
          return _(null, false); }); }); } });
  delete Array.prototype.reduce_;
  Object.defineProperty(Array.prototype, "reduce_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__6(_, fn, v, thisObj) { var len, i, __this = this; var __frame = { name: "value__6", line: 270 }; return __func(_, this, arguments, value__6, 0, __frame, function __$value__6() {
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length;
        i = 0; var __3 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__6() { __more = false; if (__3) { i++; } else { __3 = true; } ; var __2 = (i < len); if (__2) { return (function __$value__6(__then) {
                if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 4, 31, function ___(__0, __1) { v = __1; __then(); }, true), v, __this[i], i, __this); } else { __then(); } ; })(function __$value__6() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(function __$value__6() {
          return _(null, v); }); }); } });
  delete Array.prototype.reduceRight_;
  Object.defineProperty(Array.prototype, "reduceRight_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__7(_, fn, v, thisObj) { var len, i, __this = this; var __frame = { name: "value__7", line: 286 }; return __func(_, this, arguments, value__7, 0, __frame, function __$value__7() {
        thisObj = ((thisObj !== undefined) ? thisObj : __this);
        len = __this.length;
        i = (len - 1); var __3 = false; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$value__7() { __more = false; if (__3) { i--; } else { __3 = true; } ; var __2 = (i >= 0); if (__2) { return (function __$value__7(__then) {
                if (has.call(__this, i)) { return fn.call(thisObj, __cb(_, __frame, 4, 31, function ___(__0, __1) { v = __1; __then(); }, true), v, __this[i], i, __this); } else { __then(); } ; })(function __$value__7() { while (__more) { __loop(); }; __more = true; }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(function __$value__7() {
          return _(null, v); }); }); } });
  delete Array.prototype.sort_;
  Object.defineProperty(Array.prototype, "sort_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function value__8(_, compare, beg, end) { var array, __this = this;
      function _qsort(_, beg, end) { var tmp, mid, o, nbeg, nend; var __frame = { name: "_qsort", line: 309 }; return __func(_, this, arguments, _qsort, 0, __frame, function __$_qsort() {
          if ((beg >= end)) { return _(null); } ; return (function __$_qsort(__then) {
            if ((end == (beg + 1))) {
              return compare(__cb(_, __frame, 4, 9, function ___(__0, __2) { var __1 = (__2 > 0); return (function __$_qsort(__then) { if (__1) {
                    tmp = array[beg];
                    array[beg] = array[end];
                    array[end] = tmp; __then(); } else { __then(); } ; })(function __$_qsort() { return _(null); }); }, true), array[beg], array[end]); } else { __then(); } ; })(function __$_qsort() {
            mid = Math.floor((((beg + end)) / 2));
            o = array[mid];
            nbeg = beg;
            nend = end; return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$_qsort() { __more = false;
                var __4 = (nbeg <= nend); if (__4) { return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$_qsort() { __more = false; return (function __$_qsort(_) { return (function __$_qsort(_) {
                          var __1 = (nbeg < end); if (!__1) { return _(null, __1); } ; return compare(__cb(_, __frame, 18, 26, function ___(__0, __3) { var __2 = (__3 < 0); return _(null, __2); }, true), array[nbeg], o); })(__cb(_, __frame, -308, 17, _, true)); })(__cb(_, __frame, -308, 17, function ___(__0, __5) { if (__5) { nbeg++; while (__more) { __loop(); }; __more = true; } else { __break(); } ; }, true)); }); do { __loop(); } while (__more); __more = true; })(function __$_qsort() { return (function ___(__break) { var __more; var __loop = __cb(_, __frame, 0, 0, function __$_qsort() { __more = false; return (function __$_qsort(_) { return (function __$_qsort(_) {
                            var __1 = (beg < nend); if (!__1) { return _(null, __1); } ; return compare(__cb(_, __frame, 19, 26, function ___(__0, __3) { var __2 = (__3 < 0); return _(null, __2); }, true), o, array[nend]); })(__cb(_, __frame, -308, 17, _, true)); })(__cb(_, __frame, -308, 17, function ___(__0, __7) { if (__7) { nend--; while (__more) { __loop(); }; __more = true; } else { __break(); } ; }, true)); }); do { __loop(); } while (__more); __more = true; })(function __$_qsort() {
                      if ((nbeg <= nend)) {
                        tmp = array[nbeg];
                        array[nbeg] = array[nend];
                        array[nend] = tmp;
                        nbeg++;
                        nend--; } ; while (__more) { __loop(); }; __more = true; }); }); } else { __break(); } ; }); do { __loop(); } while (__more); __more = true; })(function __$_qsort() { return (function __$_qsort(__then) {
                if ((nbeg < end)) { return _qsort(__cb(_, __frame, 30, 20, __then, true), nbeg, end); } else { __then(); } ; })(function __$_qsort() { return (function __$_qsort(__then) {
                  if ((beg < nend)) { return _qsort(__cb(_, __frame, 31, 20, __then, true), beg, nend); } else { __then(); } ; })(_); }); }); }); }); }; var __frame = { name: "value__8", line: 304 }; return __func(_, this, arguments, value__8, 0, __frame, function __$value__8() { array = __this; beg = (beg || 0); end = ((end == null) ? (array.length - 1) : end);
        return _qsort(__cb(_, __frame, 38, 3, function __$value__8() {
          return _(null, array); }, true), beg, end); }); } });
  delete Function.prototype.apply_;
  Object.defineProperty(Function.prototype, "apply_", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function(callback, thisObj, args, index) {
      args = Array.prototype.slice.call(args, 0);
      args.splice((((index != null) && (index >= 0)) ? index : args.length), 0, callback);
      return this.apply(thisObj, args); } });
})(((typeof exports !== "undefined") ? exports : (Streamline.builtins = (Streamline.builtins || {}))));
var Compiler = (function() {
"use strict";
function isCall(touple) {
 return touple[0] === "call"
     && touple[1] && touple[1][0] === "name";
}
function isFunctionDef(touple) {
 return touple[0] === "function";
}
function iterateOverCalls(touple, callback) {
 if(isCall(touple)) {
  callback(touple);
 }
 for(var i = 0; i !== touple.length; i++) {
  var subtouple = touple[i];
  if(subtouple instanceof Array) {
   iterateOverCalls(subtouple, callback);
  }
 }
}
function iterateOverFunctionDefs(touple, callback) {
 if(isFunctionDef(touple)) {
  callback(touple);
 }
 for(var i = 0; i !== touple.length; i++) {
  var subtouple = touple[i];
  if(subtouple instanceof Array) {
   iterateOverFunctionDefs(subtouple, callback);
  }
 }
}
function deepCopy(obj) {
 if (Object.prototype.toString.call(obj) === '[object Array]') {
  var out = [], i = 0, len = obj.length;
  for ( ; i < len; i++ ) {
   out[i] = deepCopy(obj[i]);
  }
  return out;
 }
 return obj;
}
return {
 "underscore" : function(source) {
  var ast = Uglify.parse(source);
  iterateOverCalls(ast, function(call) {
   var args = call[2];
   args.unshift( ["name", "_"] );
  });
  iterateOverFunctionDefs(ast, function(func) {
   var args = func[2];
   args.unshift( ["_"] );
  });
  return Uglify.gen_code(ast);
 },
 "makeasync" : function(source) {
  if(!__rt) {
   throw new Error("Global variable '__rt' is not defined");
  }
  return "var __func = __rt.__func,__cb = __rt.__cb,__trap = __rt.__trap;" + Streamline.transform(source, {noHelpers : true});
 },
 "createAsyncFunction" : function(source) {
  return new Function( this.makeasync( this.underscore( source)));
 }
};
}());
if(window["WebGLRenderingContext"]) {
 window["WebGLRenderingContext"]["prototype"]["getSafeContext"] =
 (function (){
  "use strict";
  var METHODS =
  {"releaseShaderCompiler":[{"args":[]}],"getContextAttributes":[{"args":[]}],"isContextLost":[{"args":[]}],"getSupportedExtensions":[{"args":[]}],"getExtension":[{"args":[{"name":"name","type":"DOMString"}]}],"activeTexture":[{"args":[{"name":"texture","type":"GLenum"}]}],"attachShader":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"shader","type":"WebGLShader"}]}],"bindAttribLocation":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"index","type":"GLuint"},{"name":"name","type":"DOMString"}]}],"bindBuffer":[{"args":[{"name":"target","type":"GLenum"},{"name":"buffer","type":"WebGLBuffer"}]}],"bindFramebuffer":[{"args":[{"name":"target","type":"GLenum"},{"name":"framebuffer","type":"WebGLFramebuffer"}]}],"bindRenderbuffer":[{"args":[{"name":"target","type":"GLenum"},{"name":"renderbuffer","type":"WebGLRenderbuffer"}]}],"bindTexture":[{"args":[{"name":"target","type":"GLenum"},{"name":"texture","type":"WebGLTexture"}]}],"blendColor":[{"args":[{"name":"red","type":"GLclampf"},{"name":"green","type":"GLclampf"},{"name":"blue","type":"GLclampf"},{"name":"alpha","type":"GLclampf"}]}],"blendEquation":[{"args":[{"name":"mode","type":"GLenum"}]}],"blendEquationSeparate":[{"args":[{"name":"modeRGB","type":"GLenum"},{"name":"modeAlpha","type":"GLenum"}]}],"blendFunc":[{"args":[{"name":"sfactor","type":"GLenum"},{"name":"dfactor","type":"GLenum"}]}],"blendFuncSeparate":[{"args":[{"name":"srcRGB","type":"GLenum"},{"name":"dstRGB","type":"GLenum"},{"name":"srcAlpha","type":"GLenum"},{"name":"dstAlpha","type":"GLenum"}]}],"bufferData":[{"args":[{"name":"target","type":"GLenum"},{"name":"size","type":"GLsizeiptr"},{"name":"usage","type":"GLenum"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"data","type":"ArrayBufferView"},{"name":"usage","type":"GLenum"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"data","type":"ArrayBuffer"},{"name":"usage","type":"GLenum"}]}],"bufferSubData":[{"args":[{"name":"target","type":"GLenum"},{"name":"offset","type":"GLintptr"},{"name":"data","type":"ArrayBufferView"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"offset","type":"GLintptr"},{"name":"data","type":"ArrayBuffer"}]}],"checkFramebufferStatus":[{"args":[{"name":"target","type":"GLenum"}]}],"clear":[{"args":[{"name":"mask","type":"GLbitfield"}]}],"clearColor":[{"args":[{"name":"red","type":"GLclampf"},{"name":"green","type":"GLclampf"},{"name":"blue","type":"GLclampf"},{"name":"alpha","type":"GLclampf"}]}],"clearDepth":[{"args":[{"name":"depth","type":"GLclampf"}]}],"clearStencil":[{"args":[{"name":"s","type":"GLint"}]}],"colorMask":[{"args":[{"name":"red","type":"GLboolean"},{"name":"green","type":"GLboolean"},{"name":"blue","type":"GLboolean"},{"name":"alpha","type":"GLboolean"}]}],"compileShader":[{"args":[{"name":"shader","type":"WebGLShader"}]}],"copyTexImage2D":[{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"internalformat","type":"GLenum"},{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"},{"name":"border","type":"GLint"}]}],"copyTexSubImage2D":[{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"xoffset","type":"GLint"},{"name":"yoffset","type":"GLint"},{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"}]}],"createBuffer":[{"args":[]}],"createFramebuffer":[{"args":[]}],"createProgram":[{"args":[]}],"createRenderbuffer":[{"args":[]}],"createShader":[{"args":[{"name":"type","type":"GLenum"}]}],"createTexture":[{"args":[]}],"cullFace":[{"args":[{"name":"mode","type":"GLenum"}]}],"deleteBuffer":[{"args":[{"name":"buffer","type":"WebGLBuffer"}]}],"deleteFramebuffer":[{"args":[{"name":"framebuffer","type":"WebGLFramebuffer"}]}],"deleteProgram":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"deleteRenderbuffer":[{"args":[{"name":"renderbuffer","type":"WebGLRenderbuffer"}]}],"deleteShader":[{"args":[{"name":"shader","type":"WebGLShader"}]}],"deleteTexture":[{"args":[{"name":"texture","type":"WebGLTexture"}]}],"depthFunc":[{"args":[{"name":"func","type":"GLenum"}]}],"depthMask":[{"args":[{"name":"flag","type":"GLboolean"}]}],"depthRange":[{"args":[{"name":"zNear","type":"GLclampf"},{"name":"zFar","type":"GLclampf"}]}],"detachShader":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"shader","type":"WebGLShader"}]}],"disable":[{"args":[{"name":"cap","type":"GLenum"}]}],"disableVertexAttribArray":[{"args":[{"name":"index","type":"GLuint"}]}],"drawArrays":[{"args":[{"name":"mode","type":"GLenum"},{"name":"first","type":"GLint"},{"name":"count","type":"GLsizei"}]}],"drawElements":[{"args":[{"name":"mode","type":"GLenum"},{"name":"count","type":"GLsizei"},{"name":"type","type":"GLenum"},{"name":"offset","type":"GLintptr"}]}],"enable":[{"args":[{"name":"cap","type":"GLenum"}]}],"enableVertexAttribArray":[{"args":[{"name":"index","type":"GLuint"}]}],"finish":[{"args":[]}],"flush":[{"args":[]}],"framebufferRenderbuffer":[{"args":[{"name":"target","type":"GLenum"},{"name":"attachment","type":"GLenum"},{"name":"renderbuffertarget","type":"GLenum"},{"name":"renderbuffer","type":"WebGLRenderbuffer"}]}],"framebufferTexture2D":[{"args":[{"name":"target","type":"GLenum"},{"name":"attachment","type":"GLenum"},{"name":"textarget","type":"GLenum"},{"name":"texture","type":"WebGLTexture"},{"name":"level","type":"GLint"}]}],"frontFace":[{"args":[{"name":"mode","type":"GLenum"}]}],"generateMipmap":[{"args":[{"name":"target","type":"GLenum"}]}],"getActiveAttrib":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"index","type":"GLuint"}]}],"getActiveUniform":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"index","type":"GLuint"}]}],"getAttachedShaders":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"getAttribLocation":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"name","type":"DOMString"}]}],"getParameter":[{"args":[{"name":"pname","type":"GLenum"}]}],"getBufferParameter":[{"args":[{"name":"target","type":"GLenum"},{"name":"pname","type":"GLenum"}]}],"getError":[{"args":[]}],"getFramebufferAttachmentParameter":[{"args":[{"name":"target","type":"GLenum"},{"name":"attachment","type":"GLenum"},{"name":"pname","type":"GLenum"}]}],"getProgramParameter":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"pname","type":"GLenum"}]}],"getProgramInfoLog":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"getRenderbufferParameter":[{"args":[{"name":"target","type":"GLenum"},{"name":"pname","type":"GLenum"}]}],"getShaderParameter":[{"args":[{"name":"shader","type":"WebGLShader"},{"name":"pname","type":"GLenum"}]}],"getShaderInfoLog":[{"args":[{"name":"shader","type":"WebGLShader"}]}],"getShaderSource":[{"args":[{"name":"shader","type":"WebGLShader"}]}],"getTexParameter":[{"args":[{"name":"target","type":"GLenum"},{"name":"pname","type":"GLenum"}]}],"getUniform":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"location","type":"WebGLUniformLocation"}]}],"getUniformLocation":[{"args":[{"name":"program","type":"WebGLProgram"},{"name":"name","type":"DOMString"}]}],"getVertexAttrib":[{"args":[{"name":"index","type":"GLuint"},{"name":"pname","type":"GLenum"}]}],"getVertexAttribOffset":[{"args":[{"name":"index","type":"GLuint"},{"name":"pname","type":"GLenum"}]}],"hint":[{"args":[{"name":"target","type":"GLenum"},{"name":"mode","type":"GLenum"}]}],"isBuffer":[{"args":[{"name":"buffer","type":"WebGLBuffer"}]}],"isEnabled":[{"args":[{"name":"cap","type":"GLenum"}]}],"isFramebuffer":[{"args":[{"name":"framebuffer","type":"WebGLFramebuffer"}]}],"isProgram":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"isRenderbuffer":[{"args":[{"name":"renderbuffer","type":"WebGLRenderbuffer"}]}],"isShader":[{"args":[{"name":"shader","type":"WebGLShader"}]}],"isTexture":[{"args":[{"name":"texture","type":"WebGLTexture"}]}],"lineWidth":[{"args":[{"name":"width","type":"GLfloat"}]}],"linkProgram":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"pixelStorei":[{"args":[{"name":"pname","type":"GLenum"},{"name":"param","type":"GLint"}]}],"polygonOffset":[{"args":[{"name":"factor","type":"GLfloat"},{"name":"units","type":"GLfloat"}]}],"readPixels":[{"args":[{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"pixels","type":"ArrayBufferView"}]}],"renderbufferStorage":[{"args":[{"name":"target","type":"GLenum"},{"name":"internalformat","type":"GLenum"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"}]}],"sampleCoverage":[{"args":[{"name":"value","type":"GLclampf"},{"name":"invert","type":"GLboolean"}]}],"scissor":[{"args":[{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"}]}],"shaderSource":[{"args":[{"name":"shader","type":"WebGLShader"},{"name":"source","type":"DOMString"}]}],"stencilFunc":[{"args":[{"name":"func","type":"GLenum"},{"name":"ref","type":"GLint"},{"name":"mask","type":"GLuint"}]}],"stencilFuncSeparate":[{"args":[{"name":"face","type":"GLenum"},{"name":"func","type":"GLenum"},{"name":"ref","type":"GLint"},{"name":"mask","type":"GLuint"}]}],"stencilMask":[{"args":[{"name":"mask","type":"GLuint"}]}],"stencilMaskSeparate":[{"args":[{"name":"face","type":"GLenum"},{"name":"mask","type":"GLuint"}]}],"stencilOp":[{"args":[{"name":"fail","type":"GLenum"},{"name":"zfail","type":"GLenum"},{"name":"zpass","type":"GLenum"}]}],"stencilOpSeparate":[{"args":[{"name":"face","type":"GLenum"},{"name":"fail","type":"GLenum"},{"name":"zfail","type":"GLenum"},{"name":"zpass","type":"GLenum"}]}],"texImage2D":[{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"internalformat","type":"GLenum"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"},{"name":"border","type":"GLint"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"pixels","type":"ArrayBufferView"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"internalformat","type":"GLenum"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"pixels","type":"ImageData"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"internalformat","type":"GLenum"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"image","type":"HTMLImageElement"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"internalformat","type":"GLenum"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"canvas","type":"HTMLCanvasElement"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"internalformat","type":"GLenum"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"video","type":"HTMLVideoElement"}]}],"texParameterf":[{"args":[{"name":"target","type":"GLenum"},{"name":"pname","type":"GLenum"},{"name":"param","type":"GLfloat"}]}],"texParameteri":[{"args":[{"name":"target","type":"GLenum"},{"name":"pname","type":"GLenum"},{"name":"param","type":"GLint"}]}],"texSubImage2D":[{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"xoffset","type":"GLint"},{"name":"yoffset","type":"GLint"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"pixels","type":"ArrayBufferView"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"xoffset","type":"GLint"},{"name":"yoffset","type":"GLint"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"pixels","type":"ImageData"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"xoffset","type":"GLint"},{"name":"yoffset","type":"GLint"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"image","type":"HTMLImageElement"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"xoffset","type":"GLint"},{"name":"yoffset","type":"GLint"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"canvas","type":"HTMLCanvasElement"}]},{"args":[{"name":"target","type":"GLenum"},{"name":"level","type":"GLint"},{"name":"xoffset","type":"GLint"},{"name":"yoffset","type":"GLint"},{"name":"format","type":"GLenum"},{"name":"type","type":"GLenum"},{"name":"video","type":"HTMLVideoElement"}]}],"uniform1f":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLfloat"}]}],"uniform1fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"FloatArray"}]}],"uniform1i":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLint"}]}],"uniform1iv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"Int32Array"}]}],"uniform2f":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLfloat"},{"name":"y","type":"GLfloat"}]}],"uniform2fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"FloatArray"}]}],"uniform2i":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLint"},{"name":"y","type":"GLint"}]}],"uniform2iv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"Int32Array"}]}],"uniform3f":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLfloat"},{"name":"y","type":"GLfloat"},{"name":"z","type":"GLfloat"}]}],"uniform3fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"FloatArray"}]}],"uniform3i":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"z","type":"GLint"}]}],"uniform3iv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"Int32Array"}]}],"uniform4f":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLfloat"},{"name":"y","type":"GLfloat"},{"name":"z","type":"GLfloat"},{"name":"w","type":"GLfloat"}]}],"uniform4fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"FloatArray"}]}],"uniform4i":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"z","type":"GLint"},{"name":"w","type":"GLint"}]}],"uniform4iv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"v","type":"Int32Array"}]}],"uniformMatrix2fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"transpose","type":"GLboolean"},{"name":"value","type":"FloatArray"}]}],"uniformMatrix3fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"transpose","type":"GLboolean"},{"name":"value","type":"FloatArray"}]}],"uniformMatrix4fv":[{"args":[{"name":"location","type":"WebGLUniformLocation"},{"name":"transpose","type":"GLboolean"},{"name":"value","type":"FloatArray"}]}],"useProgram":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"validateProgram":[{"args":[{"name":"program","type":"WebGLProgram"}]}],"vertexAttrib1f":[{"args":[{"name":"indx","type":"GLuint"},{"name":"x","type":"GLfloat"}]}],"vertexAttrib1fv":[{"args":[{"name":"indx","type":"GLuint"},{"name":"values","type":"FloatArray"}]}],"vertexAttrib2f":[{"args":[{"name":"indx","type":"GLuint"},{"name":"x","type":"GLfloat"},{"name":"y","type":"GLfloat"}]}],"vertexAttrib2fv":[{"args":[{"name":"indx","type":"GLuint"},{"name":"values","type":"FloatArray"}]}],"vertexAttrib3f":[{"args":[{"name":"indx","type":"GLuint"},{"name":"x","type":"GLfloat"},{"name":"y","type":"GLfloat"},{"name":"z","type":"GLfloat"}]}],"vertexAttrib3fv":[{"args":[{"name":"indx","type":"GLuint"},{"name":"values","type":"FloatArray"}]}],"vertexAttrib4f":[{"args":[{"name":"indx","type":"GLuint"},{"name":"x","type":"GLfloat"},{"name":"y","type":"GLfloat"},{"name":"z","type":"GLfloat"},{"name":"w","type":"GLfloat"}]}],"vertexAttrib4fv":[{"args":[{"name":"indx","type":"GLuint"},{"name":"values","type":"FloatArray"}]}],"vertexAttribPointer":[{"args":[{"name":"indx","type":"GLuint"},{"name":"size","type":"GLint"},{"name":"type","type":"GLenum"},{"name":"normalized","type":"GLboolean"},{"name":"stride","type":"GLsizei"},{"name":"offset","type":"GLintptr"}]}],"viewport":[{"args":[{"name":"x","type":"GLint"},{"name":"y","type":"GLint"},{"name":"width","type":"GLsizei"},{"name":"height","type":"GLsizei"}]}]}
  ;
  var checkType = {
   "ArrayBuffer" : checkType("null", "ArrayBuffer", "Float32Array", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray", "Array"),
   "ArrayBufferView" : checkType("null", "ArrayBuffer", "Float32Array", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Uint8Array", "Uint8ClampedArray", "Array"),
   "DOMString" : checkType("null", "string"),
   "FloatArray" : checkType("null", "Float32Array", "Array"),
   "GLbitfield" : checkType("number"),
   "GLboolean" : checkType("boolean"),
   "GLclampf" : checkType("number"),
   "GLenum" : checkType("number"),
   "GLfloat" : checkType("number"),
   "GLint" : checkType("number"),
   "GLintptr" : checkType("number"),
   "GLsizei" : checkType("number"),
   "GLsizeiptr" : checkType("number"),
   "GLuint" : checkType("number"),
   "HTMLCanvasElement" : checkType("null", "HTMLCanvasElement"),
   "HTMLImageElement" : checkType("null", "HTMLImageElement"),
   "HTMLVideoElement" : checkType("null", "HTMLVideoElement"),
   "ImageData" : checkType("null", "ImageData"),
   "Int32Array" : checkType("null", "Int32Array", "Array"),
   "WebGLBuffer" : checkType("null", "WebGLBuffer"),
   "WebGLFramebuffer" : checkType("null", "WebGLFramebuffer"),
   "WebGLProgram" : checkType("null", "WebGLProgram"),
   "WebGLRenderbuffer" : checkType("null", "WebGLRenderbuffer"),
   "WebGLShader" : checkType("null", "WebGLShader"),
   "WebGLTexture" : checkType("null", "WebGLTexture"),
   "WebGLUniformLocation" : checkType("null", "WebGLUniformLocation"),
   "float" : checkType("number"),
   "long" : checkType("number")
  };
  var checkValue = {
   "ArrayBuffer" : checkFloatArray,
   "ArrayBufferView" : checkFloatArray,
   "DOMString" : ok,
   "FloatArray" : checkFloatArray,
   "GLbitfield" : isInt,
   "GLboolean" : isBool,
   "GLclampf" : isClampf,
   "GLenum" : isInt,
   "GLfloat" : ok,
   "GLint" : isInt,
   "GLintptr" : isInt,
   "GLsizei" : isInt,
   "GLsizeiptr" : isInt,
   "GLuint" : isInt,
   "HTMLCanvasElement" : ok,
   "HTMLImageElement" : ok,
   "HTMLVideoElement" : ok,
   "ImageData" : ok,
   "Int32Array" : checkIntArray,
   "WebGLBuffer" : ok,
   "WebGLFramebuffer" : ok,
   "WebGLProgram" : ok,
   "WebGLRenderbuffer" : ok,
   "WebGLShader" : ok,
   "WebGLTexture" : ok,
   "WebGLUniformLocation" : ok,
   "float" : ok,
   "long" : isInt
  };
  function safeContext (gl, opt) {
   var key, value, i, pair, safegl, map, keys, error;
   if(typeof opt === "string") {
    if(opt === "error") {
     error = throwError;
    }
    else if(opt === "warn") {
     error = showWarning;
    }
    else {
     throw new Error("can't process the option '" + opt + "!");
    }
   }
   else if(typeof opt === "function") {
    error = opt;
   }
   else {
    error = showWarning;
   }
   keys = [];
   for (key in gl) {
    if(key === "getSafeContext") {
     continue;
    }
    keys.push(key);
   }
   map = keys.map(function(key) {
    var val, type;
    val = gl[key];
    type = typeof val;
    if(type === "function") {
     return [key, createSafeCaller(gl, val, key, error)];
    }
    return [key];
   });
   safegl = { "isSafeContext" : true };
   for(i = 0; i != map.length; i++) {
    pair = map[i];
    key = pair[0];
    value = pair[1];
    if(value) {
     safegl[key] = value;
    } else {
     (function(key) {
      Object.defineProperty(safegl, key, {
       get : function() { return gl[key]; },
       set : function(v) { gl[key] = v; },
       enumerable : true
      });
     }(key));
    }
   }
   return safegl;
  }
  function createSafeCaller (gl, func, funcname, error) {
   var glMethods = METHODS[funcname];
   if( !glMethods ) {
    console.warn("couldn't find reference definition for method " + funcname + ".");
    return function() {
     return func.apply(gl, arguments);
    };
   }
   return function() {
    var funcDef = getFunctionDef(argumentsToArray(arguments), glMethods);
    if(!funcDef) {
     error("couldn't apply arguments ("
      + argumentsToArray(arguments).join(", ")
      + ") to any of the possible schemas:\n"
      + glMethods.map(function(m) {
       return "(" + m.args.map(function(arg) { return arg.type; }).join(", ") + ")"
        }).join("\n,")
     );
    }
    else {
     testArgumentValues(argumentsToArray(arguments), funcDef, funcname, error);
     return func.apply(gl, arguments);
    }
    return func.apply(gl, arguments);
   };
  }
  function argumentsToArray(args) {
   return Array.prototype.slice.call(args);
  }
  function testArgumentValues(args, funcDef, funcname, error) {
   var arg, type, name, i;
   for( i=0; i != args.length; i++) {
    arg = args[i];
    type = funcDef.args[i].type;
    name = funcDef.args[i].name;
    if(!checkValue[type](arg)) {
     error("Argument '" + name + "' in function '" + funcname + "' was expected to be of type '" + type + "' but instead was called with value: " + arg);
     return;
    }
   }
  }
  function getFunctionDef(args, glMethods) {
    return glMethods.filter(function(glMethod) {
     if(glMethod.args.length !== args.length) {
      return false;
     }
     var i = 0;
     return glMethod.args.every(function(glarg) {
      var ret = checkType[glarg.type](args[i++]);
      return ret;
     });
    })[0];
  }
  function throwError(text) {
   throw new Error(text);
  }
  function showWarning(text) {
   console.warn(text);
  }
  function checkType() {
   var possibleTypes = argumentsToArray(arguments).map(function(type) { return type.toLowerCase(); });
   return function(value) {
    var valueType = toType(value);
    return possibleTypes.some(function(type) { return valueType === type; });
   }
  }
  function ok() {
   return true;
  }
  function checkFloatArray(v) {
   var type = toType(v);
   if(type === "array") {
    for(var i = 0; i != v.length; i++) {
     if(!isFloat(v[i])) {
      return false;
     }
    }
   }
   return true;
  }
  function checkIntArray(v) {
   var type = toType(v);
   if(type === "array") {
    for(var i = 0; i != v.length; i++) {
     if(!isInt(v[i])) {
      return false;
     }
    }
   }
   return true;
  }
  function isString(v) {
   return v === null || typeof v === "string";
  }
  function isFloat(v) {
   return typeof v === "number";
  }
  function isInt(v) {
   return typeof v === "number" && v === ~~v;
  }
  function isBool(v) {
   return v === true || v === false;
  }
  function isClampf(v) {
   return isFloat(v) && v >= 0 && v <= 1;
  }
  function toType (obj) {
   return ({}).toString.call(obj).match(/\s([a-zA-Z0-9]+)/)[1].toLowerCase();
  }
  return function(option) { return safeContext(this, option); };
 }());
}
var WebGLDebugUtils = function() {
var log = function(msg) {
  if (window.console && window.console.log) {
 throw msg;
  }
};
var glValidEnumContexts = {
  'enable': { 0:true },
  'disable': { 0:true },
  'getParameter': { 0:true },
  'drawArrays': { 0:true },
  'drawElements': { 0:true, 2:true },
  'createShader': { 0:true },
  'getShaderParameter': { 1:true },
  'getProgramParameter': { 1:true },
  'getVertexAttrib': { 1:true },
  'vertexAttribPointer': { 2:true },
  'bindTexture': { 0:true },
  'activeTexture': { 0:true },
  'getTexParameter': { 0:true, 1:true },
  'texParameterf': { 0:true, 1:true },
  'texParameteri': { 0:true, 1:true, 2:true },
  'texImage2D': { 0:true, 2:true, 6:true, 7:true },
  'texSubImage2D': { 0:true, 6:true, 7:true },
  'copyTexImage2D': { 0:true, 2:true },
  'copyTexSubImage2D': { 0:true },
  'generateMipmap': { 0:true },
  'bindBuffer': { 0:true },
  'bufferData': { 0:true, 2:true },
  'bufferSubData': { 0:true },
  'getBufferParameter': { 0:true, 1:true },
  'pixelStorei': { 0:true, 1:true },
  'readPixels': { 4:true, 5:true },
  'bindRenderbuffer': { 0:true },
  'bindFramebuffer': { 0:true },
  'checkFramebufferStatus': { 0:true },
  'framebufferRenderbuffer': { 0:true, 1:true, 2:true },
  'framebufferTexture2D': { 0:true, 1:true, 2:true },
  'getFramebufferAttachmentParameter': { 0:true, 1:true, 2:true },
  'getRenderbufferParameter': { 0:true, 1:true },
  'renderbufferStorage': { 0:true, 1:true },
  'clear': { 0:true },
  'depthFunc': { 0:true },
  'blendFunc': { 0:true, 1:true },
  'blendFuncSeparate': { 0:true, 1:true, 2:true, 3:true },
  'blendEquation': { 0:true },
  'blendEquationSeparate': { 0:true, 1:true },
  'stencilFunc': { 0:true },
  'stencilFuncSeparate': { 0:true, 1:true },
  'stencilMaskSeparate': { 0:true },
  'stencilOp': { 0:true, 1:true, 2:true },
  'stencilOpSeparate': { 0:true, 1:true, 2:true, 3:true },
  'cullFace': { 0:true },
  'frontFace': { 0:true }
};
var glEnums = null;
function init(ctx) {
  if (glEnums == null) {
    glEnums = { };
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'number') {
        glEnums[ctx[propertyName]] = propertyName;
      }
    }
  }
}
function checkInit() {
  if (glEnums == null) {
    throw 'WebGLDebugUtils.init(ctx) not called';
  }
}
function mightBeEnum(value) {
  checkInit();
  return (glEnums[value] !== undefined);
}
function glEnumToString(value) {
  checkInit();
  var name = glEnums[value];
  return (name !== undefined) ? name :
      ("*UNKNOWN WebGL ENUM (0x" + value.toString(16) + ")");
}
function glFunctionArgToString(functionName, argumentIndex, value) {
  var funcInfo = glValidEnumContexts[functionName];
  if (funcInfo !== undefined) {
    if (funcInfo[argumentIndex]) {
      return glEnumToString(value);
    }
  }
  return value.toString();
}
function makePropertyWrapper(wrapper, original, propertyName) {
  wrapper.__defineGetter__(propertyName, function() {
    return original[propertyName];
  });
  wrapper.__defineSetter__(propertyName, function(value) {
    original[propertyName] = value;
  });
}
function makeFunctionWrapper(original, functionName) {
  var f = original[functionName];
  return function() {
    var result = f.apply(original, arguments);
    return result;
  };
}
function makeDebugContext(ctx, opt_onErrorFunc) {
  init(ctx);
  opt_onErrorFunc = opt_onErrorFunc || function(err, functionName, args) {
        var argStr = "";
        for (var ii = 0; ii < args.length; ++ii) {
          argStr += ((ii == 0) ? '' : ', ') +
              glFunctionArgToString(functionName, ii, args[ii]);
        }
        log("WebGL error "+ glEnumToString(err) + " in "+ functionName +
            "(" + argStr + ")");
      };
  var glErrorShadow = { };
  function makeErrorWrapper(ctx, functionName) {
    return function() {
      var result = ctx[functionName].apply(ctx, arguments);
      var err = ctx.getError();
      if (err != 0) {
        glErrorShadow[err] = true;
        opt_onErrorFunc(err, functionName, arguments);
      }
      return result;
    };
  }
  var wrapper = {};
  for (var propertyName in ctx) {
    if (typeof ctx[propertyName] == 'function') {
       wrapper[propertyName] = makeErrorWrapper(ctx, propertyName);
     } else {
       makePropertyWrapper(wrapper, ctx, propertyName);
     }
  }
  wrapper.getError = function() {
    for (var err in glErrorShadow) {
      if (glErrorShadow.hasOwnProperty(err)) {
        if (glErrorShadow[err]) {
          glErrorShadow[err] = false;
          return err;
        }
      }
    }
    return ctx.NO_ERROR;
  };
  return wrapper;
}
function resetToInitialState(ctx) {
  var numAttribs = ctx.getParameter(ctx.MAX_VERTEX_ATTRIBS);
  var tmp = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, tmp);
  for (var ii = 0; ii < numAttribs; ++ii) {
    ctx.disableVertexAttribArray(ii);
    ctx.vertexAttribPointer(ii, 4, ctx.FLOAT, false, 0, 0);
    ctx.vertexAttrib1f(ii, 0);
  }
  ctx.deleteBuffer(tmp);
  var numTextureUnits = ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS);
  for (var ii = 0; ii < numTextureUnits; ++ii) {
    ctx.activeTexture(ctx.TEXTURE0 + ii);
    ctx.bindTexture(ctx.TEXTURE_CUBE_MAP, null);
    ctx.bindTexture(ctx.TEXTURE_2D, null);
  }
  ctx.activeTexture(ctx.TEXTURE0);
  ctx.useProgram(null);
  ctx.bindBuffer(ctx.ARRAY_BUFFER, null);
  ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
  ctx.bindRenderbuffer(ctx.RENDERBUFFER, null);
  ctx.disable(ctx.BLEND);
  ctx.disable(ctx.CULL_FACE);
  ctx.disable(ctx.DEPTH_TEST);
  ctx.disable(ctx.DITHER);
  ctx.disable(ctx.SCISSOR_TEST);
  ctx.blendColor(0, 0, 0, 0);
  ctx.blendEquation(ctx.FUNC_ADD);
  ctx.blendFunc(ctx.ONE, ctx.ZERO);
  ctx.clearColor(0, 0, 0, 0);
  ctx.clearDepth(1);
  ctx.clearStencil(-1);
  ctx.colorMask(true, true, true, true);
  ctx.cullFace(ctx.BACK);
  ctx.depthFunc(ctx.LESS);
  ctx.depthMask(true);
  ctx.depthRange(0, 1);
  ctx.frontFace(ctx.CCW);
  ctx.hint(ctx.GENERATE_MIPMAP_HINT, ctx.DONT_CARE);
  ctx.lineWidth(1);
  ctx.pixelStorei(ctx.PACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_ALIGNMENT, 4);
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
  ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  if (ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL) {
    ctx.pixelStorei(ctx.UNPACK_COLORSPACE_CONVERSION_WEBGL, ctx.BROWSER_DEFAULT_WEBGL);
  }
  ctx.polygonOffset(0, 0);
  ctx.sampleCoverage(1, false);
  ctx.scissor(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.stencilFunc(ctx.ALWAYS, 0, 0xFFFFFFFF);
  ctx.stencilMask(0xFFFFFFFF);
  ctx.stencilOp(ctx.KEEP, ctx.KEEP, ctx.KEEP);
  ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);
  while(ctx.getError())
  {}
}
function makeLostContextSimulatingCanvas(canvas) {
  var unwrappedContext_;
  var wrappedContext_;
  var onLost_ = [];
  var onRestored_ = [];
  var wrappedContext_ = {};
  var contextId_ = 1;
  var contextLost_ = false;
  var resourceId_ = 0;
  var resourceDb_ = [];
  var numCallsToLoseContext_ = 0;
  var numCalls_ = 0;
  var canRestore_ = false;
  var restoreTimeout_ = 0;
  var glErrorShadow_ = { };
  canvas.getContext = function(f) {
    return function() {
      var ctx = f.apply(canvas, arguments);
      if (ctx instanceof WebGLRenderingContext) {
        if (ctx != unwrappedContext_) {
          if (unwrappedContext_) {
            throw "got different context"
          }
          unwrappedContext_ = ctx;
          wrappedContext_ = makeLostContextSimulatingContext(unwrappedContext_);
        }
        return wrappedContext_;
      }
      return ctx;
    }
  }(canvas.getContext);
  function wrapEvent(listener) {
    if (typeof(listener) == "function") {
      return listener;
    } else {
      return function(info) {
        listener.handleEvent(info);
      }
    }
  }
  var addOnContextLostListener = function(listener) {
    onLost_.push(wrapEvent(listener));
  };
  var addOnContextRestoredListener = function(listener) {
    onRestored_.push(wrapEvent(listener));
  };
  function wrapAddEventListener(canvas) {
    var f = canvas.addEventListener;
    canvas.addEventListener = function(type, listener, bubble) {
      switch (type) {
        case 'webglcontextlost':
          addOnContextLostListener(listener);
          break;
        case 'webglcontextrestored':
          addOnContextRestoredListener(listener);
          break;
        default:
          f.apply(canvas, arguments);
      }
    };
  }
  wrapAddEventListener(canvas);
  canvas.loseContext = function() {
    if (!contextLost_) {
      contextLost_ = true;
      numCallsToLoseContext_ = 0;
      ++contextId_;
      while (unwrappedContext_.getError())
   {}
      clearErrors();
      glErrorShadow_[unwrappedContext_.CONTEXT_LOST_WEBGL] = true;
      var event = makeWebGLContextEvent("context lost");
      var callbacks = onLost_.slice();
      setTimeout(function() {
          for (var ii = 0; ii < callbacks.length; ++ii) {
            callbacks[ii](event);
          }
          if (restoreTimeout_ >= 0) {
            setTimeout(function() {
                canvas.restoreContext();
              }, restoreTimeout_);
          }
        }, 0);
    }
  };
  canvas.restoreContext = function() {
    if (contextLost_) {
      if (onRestored_.length) {
        setTimeout(function() {
            if (!canRestore_) {
              throw "can not restore. webglcontestlost listener did not call event.preventDefault";
            }
            freeResources();
            resetToInitialState(unwrappedContext_);
            contextLost_ = false;
            numCalls_ = 0;
            canRestore_ = false;
            var callbacks = onRestored_.slice();
            var event = makeWebGLContextEvent("context restored");
            for (var ii = 0; ii < callbacks.length; ++ii) {
              callbacks[ii](event);
            }
          }, 0);
      }
    }
  };
  canvas.loseContextInNCalls = function(numCalls) {
    if (contextLost_) {
      throw "You can not ask a lost contet to be lost";
    }
    numCallsToLoseContext_ = numCalls_ + numCalls;
  };
  canvas.getNumCalls = function() {
    return numCalls_;
  };
  canvas.setRestoreTimeout = function(timeout) {
    restoreTimeout_ = timeout;
  };
  function isWebGLObject(obj) {
    return (obj instanceof WebGLBuffer ||
            obj instanceof WebGLFramebuffer ||
            obj instanceof WebGLProgram ||
            obj instanceof WebGLRenderbuffer ||
            obj instanceof WebGLShader ||
            obj instanceof WebGLTexture);
  }
  function checkResources(args) {
    for (var ii = 0; ii < args.length; ++ii) {
      var arg = args[ii];
      if (isWebGLObject(arg)) {
        return arg.__webglDebugContextLostId__ == contextId_;
      }
    }
    return true;
  }
  function clearErrors() {
    var k = Object.keys(glErrorShadow_);
    for (var ii = 0; ii < k.length; ++ii) {
      delete glErrorShadow_[k];
    }
  }
  function loseContextIfTime() {
    ++numCalls_;
    if (!contextLost_) {
      if (numCallsToLoseContext_ == numCalls_) {
        canvas.loseContext();
      }
    }
  }
  function makeLostContextFunctionWrapper(ctx, functionName) {
    var f = ctx[functionName];
    return function() {
      loseContextIfTime();
      if (!contextLost_) {
        var result = f.apply(ctx, arguments);
        return result;
      }
    };
  }
  function freeResources() {
    for (var ii = 0; ii < resourceDb_.length; ++ii) {
      var resource = resourceDb_[ii];
      if (resource instanceof WebGLBuffer) {
        unwrappedContext_.deleteBuffer(resource);
      } else if (resource instanceof WebGLFramebuffer) {
        unwrappedContext_.deleteFramebuffer(resource);
      } else if (resource instanceof WebGLProgram) {
        unwrappedContext_.deleteProgram(resource);
      } else if (resource instanceof WebGLRenderbuffer) {
        unwrappedContext_.deleteRenderbuffer(resource);
      } else if (resource instanceof WebGLShader) {
        unwrappedContext_.deleteShader(resource);
      } else if (resource instanceof WebGLTexture) {
        unwrappedContext_.deleteTexture(resource);
      }
    }
  }
  function makeWebGLContextEvent(statusMessage) {
    return {
      statusMessage: statusMessage,
      preventDefault: function() {
          canRestore_ = true;
        }
    };
  }
  return canvas;
  function makeLostContextSimulatingContext(ctx) {
    for (var propertyName in ctx) {
      if (typeof ctx[propertyName] == 'function') {
         wrappedContext_[propertyName] = makeLostContextFunctionWrapper(
             ctx, propertyName);
       } else {
         makePropertyWrapper(wrappedContext_, ctx, propertyName);
       }
    }
    wrappedContext_.getError = function() {
      loseContextIfTime();
      if (!contextLost_) {
        var err;
        while (err = unwrappedContext_.getError()) {
          glErrorShadow_[err] = true;
        }
      }
      for (var err in glErrorShadow_) {
        if (glErrorShadow_[err]) {
          delete glErrorShadow_[err];
          return err;
        }
      }
      return wrappedContext_.NO_ERROR;
    };
    var creationFunctions = [
      "createBuffer",
      "createFramebuffer",
      "createProgram",
      "createRenderbuffer",
      "createShader",
      "createTexture"
    ];
    for (var ii = 0; ii < creationFunctions.length; ++ii) {
      var functionName = creationFunctions[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return null;
          }
          var obj = f.apply(ctx, arguments);
          obj.__webglDebugContextLostId__ = contextId_;
          resourceDb_.push(obj);
          return obj;
        };
      }(ctx[functionName]);
    }
    var functionsThatShouldReturnNull = [
      "getActiveAttrib",
      "getActiveUniform",
      "getBufferParameter",
      "getContextAttributes",
      "getAttachedShaders",
      "getFramebufferAttachmentParameter",
      "getParameter",
      "getProgramParameter",
      "getProgramInfoLog",
      "getRenderbufferParameter",
      "getShaderParameter",
      "getShaderInfoLog",
      "getShaderSource",
      "getTexParameter",
      "getUniform",
      "getUniformLocation",
      "getVertexAttrib"
    ];
    for (var ii = 0; ii < functionsThatShouldReturnNull.length; ++ii) {
      var functionName = functionsThatShouldReturnNull[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return null;
          }
          return f.apply(ctx, arguments);
        }
      }(wrappedContext_[functionName]);
    }
    var isFunctions = [
      "isBuffer",
      "isEnabled",
      "isFramebuffer",
      "isProgram",
      "isRenderbuffer",
      "isShader",
      "isTexture"
    ];
    for (var ii = 0; ii < isFunctions.length; ++ii) {
      var functionName = isFunctions[ii];
      wrappedContext_[functionName] = function(f) {
        return function() {
          loseContextIfTime();
          if (contextLost_) {
            return false;
          }
          return f.apply(ctx, arguments);
        }
      }(wrappedContext_[functionName]);
    }
    wrappedContext_.checkFramebufferStatus = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return wrappedContext_.FRAMEBUFFER_UNSUPPORTED;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.checkFramebufferStatus);
    wrappedContext_.getAttribLocation = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return -1;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.getAttribLocation);
    wrappedContext_.getVertexAttribOffset = function(f) {
      return function() {
        loseContextIfTime();
        if (contextLost_) {
          return 0;
        }
        return f.apply(ctx, arguments);
      };
    }(wrappedContext_.getVertexAttribOffset);
    wrappedContext_.isContextLost = function() {
      return contextLost_;
    };
    return wrappedContext_;
  }
}
return {
  'init': init,
  'mightBeEnum': mightBeEnum,
  'glEnumToString': glEnumToString,
  'glFunctionArgToString': glFunctionArgToString,
  'makeDebugContext': makeDebugContext,
  'makeLostContextSimulatingCanvas': makeLostContextSimulatingCanvas,
  'resetToInitialState': resetToInitialState
};
}();
var GLT = (function() {
 function GLToolbox() {}
 return new GLToolbox();
}());
(function(GLT) {
 "use strict";
 var SIZEOFFLOAT = 4;
 var SCHEMA_V = 0;
 var SCHEMA_VT = 1<<0;
 var SCHEMA_VN = 1<<1;
 var SCHEMA_VTN = SCHEMA_VT | SCHEMA_VN;
 var rgxWhitespace = /[\t\r\n ]+/g;
 function parse(text) {
  var lines = text.split("\n");
  var line = "";
  var linenum = 0;
  var vertice = [];
  var normals = [];
  var textureuv = [];
  var indiceV = [];
  var indiceN = [];
  var indiceT = [];
  var triangles = 0;
  var funcs = {
   "v" : function(s) {
    if(!s || s.length != 3) {
     throw new Error("Can't accept Vertic without 3 components. LINE:" + line);
    }
    var x = Number(s[0]);
    var y = Number(s[1]);
    var z = Number(s[2]);
    vertice.push(x,y,z);
   },
   "vn" : function(s) {
    if(!s || s.length != 3) {
     throw new Error("Can't accept Normal without 3 components. LINE:" + linenum);
    }
    var x = Number(s[0]);
    var y = Number(s[1]);
    var z = Number(s[2]);
    normals.push(x,y,z);
   },
   "vt" : function(s) {
    if(!s || s.length < 2) {
     throw new Error("Can't accept Texture with less than 2 components. LINE:" + linenum);
    }
    var u = Number(s[0]);
    var v = Number(s[1]);
    textureuv.push(u,v);
   },
   "f" : function pushFace(s) {
    if(!s || s.length < 3) {
     throw new Error("Can't accept Face with less than 3 components. LINE:" + linenum);
    }
    if(s.length > 3) {
     for(var n = s.length - 1; n !== 1; n--) {
      pushFace([s[0], s[n-1], s[n]]);
     }
     return;
    }
    triangles++;
    for(var i=0; i !== 3; i++) {
     var vtn = s[i].split("/");
     var v = parseInt(vtn[0], 10) - 1;
     var t = parseInt(vtn[1], 10) - 1;
     var n = parseInt(vtn[2], 10) - 1;
     indiceV.push(v);
     if(!isNaN(t)) indiceT.push(t);
     if(!isNaN(n)) indiceN.push(n);
    }
   }
  };
  for(linenum = 0; linenum != lines.length;) {
   line = lines[linenum++].trim();
   var elements = line.split(rgxWhitespace);
   var head = elements.shift();
   if(head in funcs) {
    funcs[head](elements);
   }
  }
  var schema = SCHEMA_V;
  if(textureuv.length !== 0 || indiceT.length !== 0) {
   schema |= SCHEMA_VT;
   if(indiceV.length !== indiceT.length) {
    throw new Error("Texture indice don't match Vertic indice.");
   }
  }
  if(normals.length !== 0 || indiceN.length !== 0) {
   schema |= SCHEMA_VN;
   if(indiceV.length !== indiceN.length) {
    throw new Error("Normal indice don't match Vertic indice.");
   }
  }
  var sizeArray = 0;
  var voffset = 0;
  var toffset = 0;
  var noffset = 0;
  var stride = 0;
  var packSize = 0;
  switch(schema) {
   case SCHEMA_V:
   stride = 4;
   break;
   case SCHEMA_VT:
   stride = 4+2;
            toffset = 4*SIZEOFFLOAT;
   break;
   case SCHEMA_VN:
   stride = 4+4;
            noffset = 4*SIZEOFFLOAT;
   break;
   case SCHEMA_VTN:
   stride = 4+2+4;
            toffset = 4*SIZEOFFLOAT;
            noffset = 6*SIZEOFFLOAT;
   break;
   default:
   throw new Error("Schema broken.");
  }
  sizeArray = triangles * 3 * stride;
  var rawData = new Float32Array(sizeArray);
  var p = 0;
  var vi = 0;
  var ti = 0;
  var ni = 0;
  for(var i = 0; i != indiceV.length; i++) {
   vi = 3*indiceV[i];
   rawData[p++] = vertice[ vi++ ];
   rawData[p++] = vertice[ vi++ ];
   rawData[p++] = vertice[ vi ];
   rawData[p++] = 1.0;
   if(schema & SCHEMA_VT) {
    ti = 2*indiceT[i];
    rawData[p++] = textureuv[ ti++ ];
    rawData[p++] = textureuv[ ti ];
   }
   if(schema & SCHEMA_VN) {
    ni = 3*indiceN[i];
    rawData[p++] = normals[ ni++ ];
    rawData[p++] = normals[ ni++ ];
    rawData[p++] = normals[ ni ];
    rawData[p++] = 0.0;
   }
  }
  return {
   "stride" : stride * SIZEOFFLOAT,
   "schema" : schema,
   "voffset" : voffset,
   "toffset" : toffset,
   "noffset" : noffset,
   "rawData" : rawData,
   "numVertices" : triangles * 3
  };
 }
 GLT.obj = {};
 GLT.obj.SCHEMA_V = SCHEMA_V;
 GLT.obj.SCHEMA_VN = SCHEMA_VN;
 GLT.obj.SCHEMA_VT = SCHEMA_VT;
 GLT.obj.SCHEMA_VTN = SCHEMA_VTN;
 GLT.obj.parse = parse;
}(GLT));
(function(GLT) {
"use strict";
var MTEXT = 1;
var MJSON = 2;
var MSCRIPT = 3;
var MXML = 4;
var MIMAGE = 5;
var MOBJ = 6;
var MHTML = 7;
function mimeToType(mime) {
 mime = mime.toLowerCase();
 if(mime === "application/json") {
  return MJSON;
 }
 if(mime === "text/html") {
  return MHTML;
 }
 if(mime.indexOf("javascript") !== -1) {
  return MSCRIPT;
 }
 if(mime.indexOf("xml") !== -1) {
  return MXML;
 }
 if(mime.indexOf("image") !== -1) {
  return MIMAGE;
 }
 return MTEXT;
}
function simpleAjaxCall(data, done, error) {
 var file;
 var respondWithTagObject = typeof data !== "string";
 if(!respondWithTagObject) {
  file = data;
 }
 else {
  if(!data.file) {
   throw new Error("data must contain a file path.");
  }
  file = data.file;
 }
 var mime = 0;
 var abort = false;
 var xhr = new XMLHttpRequest();
 xhr.onreadystatechange = onReadyState;
 xhr.open('GET', file, true);
 xhr.send(null);
 function success(file, respond) {
  if(!respondWithTagObject) {
   done(file, respond);
  }
  else {
   var o = Object.create(data);
   o.data = respond;
   done(file, o);
  }
 }
 function onReadyState() {
  if(!abort && (xhr.readyState === 2 || xhr.readyState === 3)){
   mime = mimeToType(xhr.getResponseHeader("content-type"));
   if(file.toLowerCase().lastIndexOf(".obj") + 4 === file.length) {
    mime = MOBJ;
   }
   if(mime === MIMAGE) {
    abort = true;
    xhr.abort();
    var image = new Image();
    image.onload = function() {
     success(file, image);
    };
    image.onerror = function() {
     error(file, "");
    }
    image.src = file;
    return;
   }
  }
  if(!abort && xhr.readyState === 4) {
   var s = xhr.status;
   if(s >= 200 && s <= 299 || s === 304 || s ===0) {
    if(mime === MXML) {
     success(file, xhr.responseXML);
    }
    else if(mime === MJSON) {
     try {
      success(file, JSON.parse(xhr.responseText));
     }
     catch(e) {
      error(file, e);
     }
    }
    else if(mime === MOBJ) {
     try {
      success(file, GLT.obj.parse(xhr.responseText));
     }
     catch(e) {
      error(file, e);
     }
    }
    else {
     success(file, xhr.responseText);
    }
   }
   else {
    error(file, s || 0);
   }
  }
 }
}
function nop() {
}
function loadFiles(options) {
 if(!options) throw new Error("Passed nothing in loadFiles");
 var files = options.files || [];
 var update = options.update || nop;
 var finished = options.finished || nop;
 var error = options.error || nop;
 var total = files.length;
 var filesInLoadingQueue = 0;
 var result = Object.create(null);
 var fileLoaded = function(file, blob) {
  filesInLoadingQueue++;
  result[file] = blob;
  update(file, filesInLoadingQueue/total);
  if(filesInLoadingQueue === total) {
   finished(result);
  }
 };
 var fileFailed = function(file, message) {
  fileLoaded = nop;
  fileFailed = nop;
  error(file, message);
 }
 for(var i = 0, file; file = files[i++];) {
  (function(file) {
   simpleAjaxCall(file, fileLoaded, fileFailed);
  }(file));
 }
}
GLT.loadmanager = {};
GLT.loadmanager.loadFiles = loadFiles;
}(GLT));
(function(GLT) {
"use strict";
var names = ["experimental-webgl", "webgl", "moz-webgl", "webkit-3d"];
function createContext(canvas) {
  var i;
  var name;
  var gl;
  for(i = 0; name = names[i++];) {
   gl = canvas.getContext(name, {alpha : false, preserveDrawingBuffer : true});
   if(gl) {
    return gl;
   }
  }
  return null;
}
function createSafeContext(canvas) {
 var gl = createContext(canvas);
 return WebGLDebugUtils.makeDebugContext(gl).getSafeContext();
}
GLT.createContext = createContext;
GLT.createSafeContext = createSafeContext;
}(GLT));
(function(GLT) {
 "use strict";
 var SIZE = 256;
 var keysDown = new Uint8Array(SIZE);
 var keysDownOld = new Uint8Array(SIZE);
 function cleanKeys() {
  for(var i = 0; i !== SIZE; i++) {
   keysDownOld[i] = 0;
   keysDown[i] = 0;
  }
 }
 function update() {
  for(var i = 0; i !== SIZE; i++) {
   keysDownOld[i] = keysDown[i];
  }
 }
 function isDown(key) {
  return keysDown[key] !== 0;
 }
 function isUp (key) {
  return keysDown[key] === 0;
 }
 function wasPressed (key) {
  return keysDown[key] !== 0 && keysDownOld[key] === 0;
 }
 function wasReleased (key) {
  return keysDown[key] === 0 && keysDownOld[key] !== 0;
 }
 cleanKeys();
 document.addEventListener("keydown", function(e) {
  var k = e.keyCode;
  if(k < SIZE) {
   keysDown[k] = 1;
  }
 }, false);
 document.addEventListener("keyup", function(e) {
  var k = e.keyCode;
  if(k < SIZE) {
   keysDown[k] = 0;
  }
 }, false);
 window.addEventListener("blur", function() {
  cleanKeys();
 }, false);
 var codes = {
  "backspace":8, "tab":9, "enter":13, "shift":16, "ctrl":17, "alt":18, "pause":19, "capslock":20,
  "escape":27, "space":32, "pageUp":33, "pageDown":34, "end":35, "home":36,
  "left":37, "up":38, "right":39, "down":40,
  "insert":45, "delete":46,
  "num0":48, "num1":49, "num2":50, "num3":51, "num4":52, "num5":53, "num6":54, "num7":55, "num8":56, "num9":57,
  "a":65, "b":66, "c":67, "d":68, "e":69, "f":70, "g":71, "h":72, "i":73, "j":74, "k":75, "l":76, "m":77,
  "n":78, "o":79, "p":80, "q":81, "r":82, "s":83, "t":84, "u":85, "v":86, "w":87, "x":88, "y":89, "z":90,
  "windowKeyLeft":91, "windowKeyRight":92, "select":93,
  "numpad0":96, "numpad1":97, "numpad2":98, "numpad3":99, "numpad4":100,
  "numpad5":101, "numpad6":102, "numpad7":103, "numpad8":104, "numpad9":105,
  "multiply":106, "add":107, "subtract":109, "decimalPoint":110, "divide":111,
  "f1":112, "f2":113, "f3":114, "f4":115, "f5":116, "f6":117,
  "f7":118, "f8":119, "f9":120, "f10":121, "f11":122, "f12":123,
  "numlock":144, "scrolllock":145, "semicolon":186, "equals":187, "comma":188,
  "dash":189, "period":190, "slash":191, "graveAccent":192, "openBracket":219,
  "backSlash":220, "closeBraket":221, "quote":222
 };
 GLT.keys = {};
 GLT.keys.codes = codes;
 GLT.keys.update = update;
 GLT.keys.isDown = isDown;
 GLT.keys.isUp = isUp;
 GLT.keys.wasPressed = wasPressed;
 GLT.keys.wasReleased = wasReleased;
}(GLT));
(function(GLT) {
"use strict";
function compileProgram(gl, programsource) {
 var defines = ["#define VERTEX\n", "#define FRAGMENT\n"];
 var shader = [gl.createShader(gl.VERTEX_SHADER), gl.createShader(gl.FRAGMENT_SHADER)];
 var program = gl.createProgram();
 var s = null;
 var info = "";
 for(var i = 0; i != defines.length; i++) {
  s = shader[i];
  gl.shaderSource(s, defines[i] + programsource);
  gl.compileShader(s);
  if( info = gl.getShaderInfoLog(s) ) {
   throw new Error(info);
  }
  gl.attachShader(program, s);
 }
 gl.linkProgram(program);
 if( info = gl.getProgramInfoLog(program) ) {
  throw new Error(info);
 }
 return program;
}
GLT.SHADER = {};
GLT.SHADER.compileProgram = compileProgram;
}(GLT));
(function(GLT){
"use strict";
function createCube() {
 var vert = new Float32Array([
  -1, -1, 1, 1,
   1, -1, 1, 1,
   1, 1, 1, 1,
  -1, 1, 1, 1,
  -1, -1, -1, 1,
   1, -1, -1, 1,
   1, 1, -1, 1,
  -1, 1, -1, 1
 ]);
 var n = 0.577350269;
 var norm = new Float32Array([
  -n, -n, n, 0,
   n, -n, n, 0,
   n, n, n, 0,
  -n, n, n, 0,
  -n, -n, -n, 0,
   n, -n, -n, 0,
   n, n, -n, 0,
  -n, n, -n, 0
 ]);
 var indx = new Uint16Array([
  0,1,2,
  0,2,3,
  1,5,6,
  1,6,2,
  5,4,7,
  5,7,6,
  4,0,3,
  4,3,7,
  3,2,6,
  3,6,7,
  4,5,1,
  4,1,0
 ]);
 return { vertices : vert, indices : indx, normals : norm };
}
function createPlane(level) {
    var vert = [];
    var tex = [];
    createTriangle(vert, tex, [1,0,1], [-1,0,1], [-1,0,-1], [1,1], [0,1], [0,0], level || 0);
    createTriangle(vert, tex, [1,0,1], [-1,0,-1], [1,0,-1], [1,1], [0,0], [1,0], level || 0);
    return { vertices : new Float32Array(vert), texCoords : new Float32Array(tex) };
    function createTriangle(vert, tex, v1, v2, v3, t1, t2, t3, n) {
        if(n === 0) {
            vert.push(v1[0], v1[1], v1[2], 1.0);
            vert.push(v2[0], v2[1], v2[2], 1.0);
            vert.push(v3[0], v3[1], v3[2], 1.0);
            tex.push(t1[0], t1[1]);
            tex.push(t2[0], t2[1]);
            tex.push(t3[0], t3[1]);
            return;
        }
        var v12 = middleVec(v1, v2);
        var v23 = middleVec(v2, v3);
        var v31 = middleVec(v3, v1);
        var t12 = middleTex(t1, t2);
        var t23 = middleTex(t2, t3);
        var t31 = middleTex(t3, t1);
        createTriangle(vert, tex, v1, v12, v31, t1, t12, t31, n-1);
        createTriangle(vert, tex, v2, v23, v12, t2, t23, t12, n-1);
        createTriangle(vert, tex, v3, v31, v23, t3, t31, t23, n-1);
        createTriangle(vert, tex, v12, v23, v31, t12, t23, t31, n-1);
        function middleVec(v1, v2) {
            var x1,y1,z1,x2,y2,z2;
            x1 = v1[0];
            y1 = v1[1];
            z1 = v1[2];
            x2 = v2[0];
            y2 = v2[1];
            z2 = v2[2];
            return [ (x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2 ];
        }
        function middleTex(t1, t2) {
            var x1,y1,x2,y2;
            x1 = t1[0];
            y1 = t1[1];
            x2 = t2[0];
            y2 = t2[1];
            return [ (x1 + x2) / 2, (y1 + y2) / 2 ];
        }
    }
}
GLT.shapes = {};
GLT.shapes.createCube = createCube;
GLT.shapes.createPlane = createPlane;
}(GLT));
(function(GLT) {
"use strict";
var useKeys = !!GLT.keys;
var requestAnimationFrame =
 window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame ||
 window.oRequestAnimationFrame ||
 function( callback ){
  window.setTimeout(callback, 1000 / 60);
 };
var requestGameFrame = (function() {
 var starttime = -1;
 var lasttime = 0;
 var time = {
  "delta" : 0,
  "total" : 0
 };
 var loopObject = {
  "time" : time,
  "frame" : 0,
  "reset" : reset
 };
 function reset() {
  starttime = -1;
 }
 return function (callback) {
  requestAnimationFrame(function () {
   var now = Date.now();
   if(starttime === -1) {
    lasttime = now;
    starttime = now;
    loopObject.frame = 0;
   }
   time.delta = (now - lasttime) / 1000.0;
   time.total = (now - starttime) / 1000.0;
   callback(loopObject);
   if(useKeys) {
    GLT.keys.update();
   }
   lasttime = now;
   loopObject.frame++;
  });
 };
}());
GLT.requestGameFrame = requestGameFrame;
}(GLT));
GLT.version = 'v0.2';
(function() {
"use strict";
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
function loadMap(mapname) {
 GLT.loadmanager.loadFiles({
  files : [mapname],
  finished : function(files) {
   var mapdata = files[mapname];
   console.log(mapdata.tilewidth);
   console.log(mapdata.tileset) ;
   GLT.loadmanager.loadFiles({
    files : mapdata.tilesets.map(function(tile) { return tile.image; }),
    finished : function(images) {
     console.log(images);
     start(mapdata, images);
    }
   });
  }
 });
}
function checkLayerDimension(layers) {
 var first = layers[0];
 var dim = { width : first.width, height : first.height };
 for(var i = 1; i < layers.length; i++) {
  var layer = layers[i];
  if(layer.width !== dim.width || layer.height !== layer.height) {
   throw new Error("Size of layer '" + layer.name + "' is different of layer '" + first.name + ".");
  }
 }
 return dim;
}
function mapIndexToTile(id, tilesets, images) {
 if(id === 0) {
  return null;
 }
 var tiles = tilesets.slice(0);
 tiles.sort(function(a,b) { return a.firstgid - b.firstgid; });
 var lastSet = null;
 var nextSet = null;
 var i = 0;
 do {
  lastSet = tiles[i];
  i++;
  nextSet = tiles[i];
 } while( nextSet && id >= nextSet.firstgid );
 var tileset = lastSet;
 var offset = id - tileset.firstgid;
 var width = (tileset.imagewidth / tileset.tilewidth) | 0;
 return {
  image : images[tileset.image],
  offx : offset % width,
  offy : (offset / width) | 0
 };
}
function addGrid(dimension, grids, layer, tilesets, images) {
 var grid = new Array(dimension.width);
 for(var x = 0; x < dimension.width; x++) {
  grid[x] = new Array(dimension.height);
 }
 var data = layer.data;
 var x = 0, y = 0;
 for(var i = 0; i !== data.length; i++) {
  x = i % dimension.width;
  y = (i / dimension.width) | 0;
  grid[x][y] = mapIndexToTile(data[i], tilesets, images);
 }
 grids[layer.name] = grid;
}
function start(map, images) {
 var dimension = checkLayerDimension(map.layers);
 var grids = {};
 for(var l = 0; l !== map.layers.length; l++) {
  addGrid(dimension, grids, map.layers[l], map.tilesets, images);
 }
 console.log(grids);
 map.grids = grids;
 startGameLoop(map);
}
function startGameLoop(map) {
 var width = map.width;
 var height = map.height;
 var tilewidth = map.tilewidth;
 var tileheight = map.tileheight;
 var bg = map.grids.background;
 var obstacles = map.grids.obstacles;
 var objects = map.grids.objects;
 var ceiling = map.grids.ceiling;
 var layer = [bg, obstacles, objects, ceiling];
 function gameloop(info) {
  for(var x = 0; x !== map.width; x++) {
   for(var y = 0; y !== map.height; y++) {
    for(var l = 0; l !== layer.length; l++) {
     var tile = layer[l][x][y];
     if(tile) {
      ctx.drawImage(
       tile.image,
       tilewidth * tile.offx, tileheight * tile.offy,
       tilewidth, tileheight,
       10 * Math.random() + tilewidth * x, tileheight * y,
       tilewidth, tileheight
      );
     }
    }
   }
  }
  GLT.requestGameFrame(gameloop);
 }
 GLT.requestGameFrame(gameloop);
}
loadMap("map1.json");
}());
