
// Util
function getPath() {
    return location.pathname;
}

function getCurrentPath(e) {
    const {target} = e;
    const listNode = e.target.closest("li");
    if(!listNode) return;
    if(target.nodeName === "A")  e.preventDefault();
    const path = listNode.querySelector("a").getAttribute("href");
    return path;
}

async function getInitData() {
    const res = await fetch('/api/content.json');
    return res.json();
}

async function getStates(path) {
    switch (path) {
        case "/":
            return Promise.resolve({}); 
        case "/content":
            return await getInitData();
        default:
            break;
    }
}

// render
function render(renderTarget, sHTML) {
    renderTarget.innerHTML = sHTML;
}

// Push State
function onLink() {
    document.querySelector("nav ul").addEventListener("click", async (e) => {
        const path  = getCurrentPath(e);
        const state = await getStates(path);
        
        //push state
        history.pushState(state, '', path)

        //render page
        popStateHandler({state});
    })
}

function popStateHandler({state}) {
    const renderTargetWrap = document.querySelector(".content-wrap");
    const targetView = getPath();
    const contentViewHTML = viewMap[targetView](state?.content);
    render(renderTargetWrap, contentViewHTML);
}

// Pop State
function onRouter() {
    window.addEventListener("popstate", popStateHandler);
}

// View
const viewMap = {
    '/'() {
        return `<h2>안녕하세요 코드스쿼드에 오셨네요!</h2>`
    },
    '/content'(data) {
        if(!data) return;
        return Object.values(data).reduce( (prev,next) => {
            return (
                prev + 
                `<li> 
                    <h3>${next.name}</h3>
                    <div>${next.body}</div>
                </li>`
            )
        },``);
    }
}

// Initialize
!(function(){
    onLink();
    onRouter()
    popStateHandler({})
})();