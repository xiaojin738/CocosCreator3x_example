
/**
 * 工具管理器
 */
export default class Utils {

    /**
     * post请求
     * @param url 请求url
     * @param dataStr 请求信息
     * @param callback 请求响应的回调函数
     * @param headerdata 请求头数据
     */
    public static openPostHttpRequest(url: string, dataStr: string, callback: (response: string) => void, headerdata?: any): void {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(response);
                }
            }
            else {
            }
        };
        xhr.open("POST", url, true);
        if (headerdata) {
            for (const key in headerdata) {
                if (Object.prototype.hasOwnProperty.call(headerdata, key)) {
                    const element = headerdata[key];
                    xhr.setRequestHeader(key, element);
                }
            }
        }
        xhr.send(dataStr);
    }

    /**
     * get请求
     * @param url 请求url
     * @param callback 请求响应的回调函数
     * @param headerdata 请求头数据
     */
    public static openGetHttpRequest(url: string, callback: (response: string) => void, headerdata?: any): void {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                if (callback) {
                    callback(response);
                }
            }
            else {
            }
        };
        xhr.open("GET", url, true);
        if (headerdata) {
            for (const key in headerdata) {
                if (Object.prototype.hasOwnProperty.call(headerdata, key)) {
                    const element = headerdata[key];
                    xhr.setRequestHeader(key, element);
                }
            }
        }
        xhr.send();
    }

    /**
     * 获取指定长度的随机字符串
     * @param length 指定字符串长度
     * @returns 返回字符串
     */
    public static randomString(length: number): string {
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var str: string = '';
        for (var i = 0; i < length; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    /**
     * 获取指定长度的随机数字字符串
     * @param length 数字字符串
     * @returns 返回数字字符串
     */
    public static randomIntStr(length: number): string {
        var $chars = '0123456789';
        var maxPos = $chars.length;
        var str: string = '';
        for (var i = 0; i < length; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    }

    /**
     * 深度拷贝对象
     * @param obj 目标对象
     * @returns 返回拷贝对象
     */
    public static deepCopy(obj: any): any {
        if (typeof obj !== "object" || obj === null) {
            return obj;
        }
        let copy: any;
        if (Array.isArray(obj)) {
            copy = [];
            for (let i = 0; i < obj.length; i++) {
                copy[i] = Utils.deepCopy(obj[i]);
            }
        } else {
            copy = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    copy[key] = Utils.deepCopy(obj[key]);
                }
            }
        }
        return copy;
    }

    public static encode(input: string): string {
        let _keyStr: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = this._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    public static decode(input: string): string {
        let _keyStr: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = this._utf8_decode(output);
        return output;
    }

    protected static _utf8_encode(str: string): string {
        str = str.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < str.length; n++) {
            var c = str.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    protected static _utf8_decode(utftext: string): string {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }

    /**
     * 将字符串转成字节数组
     * @param input 字符串
     * @returns 字节数组
     */
    public static stringToByteArray(input: string): Uint8Array {
        const encoder = new TextEncoder();
        return encoder.encode(input);
    }

    /**
     * 字节数组转换为16进制字符串
     * @param byteArray 字节数组
     * @returns 返回16进制字符串
     */
    public static byteArrayToHexString(byteArray: Uint8Array): string {
        return Array.from(byteArray, (byte: number) => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }


    /**
     * 格式化数字  形式：12,345,678
     * @param num 目标数字
     * @returns 返回格式化数字
     */
    public static formatNumber(num: number): string {
        let numStr: string = '';
        let sourceNumStr: string = `${num}`;
        let strList: string[] = sourceNumStr.split('');
        while (strList.length > 3) {
            let tempList: string[] = strList.splice(strList.length - 3);
            let tempStr: string = tempList.join('');
            if (numStr) {
                numStr = `${tempStr},${numStr}`;
            }
            else {
                numStr = tempStr;
            }
        }
        if (!numStr) {
            numStr = sourceNumStr;
        }
        else {
            let tempStr: string = strList.join('');
            numStr = `${tempStr},${numStr}`;
        }
        return numStr;
    }

    /**
     * 限制字符串长度
     * @param str 原始字符串
     * @param cutCodeCount 限制的字符，中文为两个字符
     * @returns 返回限制后的字符串
     */
    public static truncationString(str: string, cutCodeCount: number = 10): string {
        let newStr: string = '';
        for (const ch of str) {
            let cnt: number = 1;
            const chineseRegex = /[\u4e00-\u9fa5]/g; // 这个正则表达式匹配所有中文字符的范围
            const chineseMatches = ch.match(chineseRegex);
            if (chineseMatches) {
                cnt = 2;
            }
            if (cutCodeCount < cnt) {
                break;
            }
            cutCodeCount -= cnt;
            newStr = `${newStr}${ch}`;
        }
        if (newStr.length < str.length) {
            newStr = `${newStr}...`;
        }
        return newStr;
    }

}
