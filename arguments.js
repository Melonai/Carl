const Discord = require('discord.js');

class Any {
    static getName() {
        return "{anything}";
    }
    static check(arg) {
        return !(typeof arg === "undefined");
    }
}

class User {
    static getName() {
        return "{user}";
    }
    static check(arg) {
        if (typeof arg !== 'undefined') {
            let timestamp = Discord.SnowflakeUtil.deconstruct(arg).timestamp;
            return timestamp > 1420070400000 && timestamp < new Date().getTime();
        }
    }
}

class Number {
    static getName() {
        return "{number}";
    }
    static check(arg) {
        return !isNaN(arg);
    }
}

class NumberOptional {
    static getName() {
        return "{optional number}";
    }
    static check(arg) {
        return !isNaN(arg) || typeof arg === 'undefined';
    }
}

class Optional {
    static getName() {
        return "{optional}";
    }
    static check(arg) {
        return true;
    }
}

class Ranged {
    constructor(from_num, to_num) {
        this.from_num = from_num;
        this.to_num = to_num;
    }
    getName() {
        return `{${this.from_num} - ${this.to_num}}`;
    }
    check(arg) {
        return arg >= this.from_num && arg <= this.to_num;
    }
}

module.exports = {
    Any: Any,
    User: User,
    Number: Number,
    NumberOptional: NumberOptional,
    Optional: Optional,
    Ranged: Ranged
};