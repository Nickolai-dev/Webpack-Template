
console.log('Hello world!');

const $ = window.$ = DEV_ENV === 'production' ? require('jquery/dist/jquery.min'): require('jquery');


const appTree = window.appTree = {
  homePage: {
    html: require('src/homePage.html'),
    title: 'Home',
  },
  additionalPage: {
    html: require('src/additionalPage.html'),
    title: 'Additional page',
  }
};
let appRoot = window.appRoot = document.getElementById('app');
let historyStateObject = {};
let pageTitle = document.querySelector('title');

let asyncGoToPage = function(pageName, goBack = false) {
  if (!pageName) {
    pageName = window.location.pathname.substr(1);
  }
  let page = appTree[pageName] || appTree.homePage;
  if (!goBack) {
    history.pushState(historyStateObject, page.title, '/' + pageName);
  }
  new Promise((resolve, reject) => {
    appRoot.innerHTML = page.html;
    resolve();
  }).catch((reason) => {
    console.log(reason);
  }).then((val) => {
    updatePagesLinksBinds();
    pageTitle.innerHTML = page.title;
  });
};

let updatePagesLinksBinds = function() {
  let onPageLinkClick = function(ev) {
    let pageName = $(ev.originalEvent.target).attr('href');
    asyncGoToPage(pageName);
  };
  $('.app-page').on('click', (ev) => {ev.preventDefault(); onPageLinkClick(ev);});
};

window.addEventListener('popstate', function (ev) {
  if(!ev.target.location.hostname in ['localhost']) {
    return;
  }
  asyncGoToPage(ev.target.location.pathname.substr(1), true);
});

$(function () {
  asyncGoToPage();
});
