import FauxCode from './FauxCode';
import gists from './gists.json';
import hljs from 'highlight.js/lib/common';

const options = {
  theme: 'light',
  fontSize: 5,
  leading: 10,
  lineCap: 'round',
  margin: 50,
  lineNumbers: true,
  lineNumberOffset: -3,
};

const getSettings = () => {
  const url = document.querySelector('#url').value;
  const light = document.querySelector('#light');
  const theme = light.checked ? 'light' : 'dark';
  const rounded = document.querySelector('#rounded');
  const lineCap = rounded.checked ? 'round' : 'square';
  return { url, theme, lineCap };
};

const downloadLink = document.querySelector('.output-download');
const downloadButton = document.querySelector('.output-button');
const makeDownloadable = (svgString) => {
  const href = `data:application/octet-stream;base64,${btoa(svgString)}`;
  downloadLink.href = href;
  downloadButton.href = href;
};

const createSVG = (svgString) => {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  return doc.documentElement;
};

const addElementTo = (element, parentId) => {
  const parent = document.getElementById(parentId);
  parent.innerHTML = '';
  parent.appendChild(parent.ownerDocument.importNode(element, true));
};

const extractGistId = (url) => {
  const match = url.match(/gist\.github\.com\/[^/]+\/([a-f0-9]+)/);
  return match ? match[1] : null;
};

const fetchGist = async (url) => {
  const id = extractGistId(url);
  if (!id) throw new Error('Invalid gist URL');
  const response = await fetch(`https://api.github.com/gists/${id}`);
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  const data = await response.json();
  const file = Object.values(data.files)[0];
  return { content: file.content, language: file.language };
};

const highlightToLines = (content, language) => {
  let highlighted;
  try {
    const lang = language ? language.toLowerCase() : null;
    highlighted = (lang && hljs.getLanguage(lang))
      ? hljs.highlight(content, { language: lang }).value
      : hljs.highlightAuto(content).value;
  } catch {
    highlighted = hljs.highlightAuto(content).value;
  }

  const lines = highlighted.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();

  return lines.map((line) => {
    const div = document.createElement('div');
    div.innerHTML = line;
    return div;
  });
};

const start = async (url, settings) => {
  const { content, language } = await fetchGist(url);
  const lines = highlightToLines(content, language);
  const fauxCode = (new FauxCode(lines, settings)).render();
  const svg = createSVG(fauxCode);
  addElementTo(svg, 'fauxcode');
  makeDownloadable(fauxCode);
};

const startButtonHandler = () => {
  const settings = getSettings();
  if (settings.url && settings.url.includes('gist.github.com')) {
    const { theme, lineCap, url } = settings;
    options.theme = theme;
    options.lineCap = lineCap;
    start(url, options).catch((error) => {
      console.error('Caught error: ', error);
    });
    document.querySelector('section.output').classList.add('ready');
  }
};

const startButton = document.querySelector('#start');
startButton.addEventListener('click', startButtonHandler);

const randomFromList = (list) => list[Math.floor(Math.random() * list.length)];

const getNewUrl = () => {
  document.getElementById('url').value = randomFromList(gists);
};

document.getElementById('renew').addEventListener('click', getNewUrl);
