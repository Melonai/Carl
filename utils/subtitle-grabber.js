const parser = require('fast-xml-parser');
const fetch = require('node-fetch');
const he = require('he');

async function getSubtitleList(videoID) {
    const listResponse = await fetch(`https://youtube.com/api/timedtext?type=list&v=${videoID}`)
        .then(r => r.text());
    return parser.parse(listResponse, {
        ignoreAttributes: false,
        parseAttributeValue: true,
        attributeNamePrefix : '',
    }).transcript_list.track;
}

const isDefault = t => t.lang_default;
const isEnglish = t => t.lang_long === 'en';
const isFirst = t => t.id === 0;

function getBestSubtitle(subtitleList) {
    if (!Array.isArray(subtitleList)) return subtitleList;
    const matches = subtitleList.filter(t => isDefault(t) || isEnglish(t) || isFirst(t));
    return matches.find(isDefault) || matches.find(isEnglish) || matches.find(isFirst) || subtitleList[0];
}

async function getSubtitle(videoID) {
    const subtitleList = await getSubtitleList(videoID);
    if (typeof subtitleList === 'undefined') return;
    const bestSubtitle = getBestSubtitle(subtitleList)
    const languageCode = bestSubtitle.lang_code;
    const languageName = bestSubtitle.name;
    let url = `http://youtube.com/api/timedtext?type=track&v=${videoID}&lang=${languageCode}`;
    if (typeof languageName !== 'undefined') {
        url += `&name=${languageName}`;
    }
    const subtitlesResponse = await fetch(url)
        .then(r => r.text());
    if (subtitlesResponse !== '') {
        return parser.parse(subtitlesResponse, {
            ignoreAttributes: false,
            parseAttributeValue: true,
            attributeNamePrefix : '',
            textNodeName : 'text',
            tagValueProcessor: (val, _) => he.decode(he.decode(val))
        }).transcript.text;
    }
}

module.exports = getSubtitle;