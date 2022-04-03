export function awaitLoader(element, status) {
    if (element && status) {
        element.classList.add("active");

    } else {
        element.classList.remove("active");
    }
}

export function toastsMessage(modal, content, message) {
    console.log(message);
    modal.classList.add("active");
    content.textContent = message?.message;

    setTimeout(function () {
        modal.classList.remove("active");
    }, 7000);
}

export function getType() {
    let type = location.search.split("&")[0];
    if (type && type.includes("type")) {
        return type.split("=")[1];
    }
    return null;
}

export function getToken() {
    let keys = ["id", "course", "unitId"];
    let token = location.search.split("&")[1];
    if (token && keys.some((e) => token.includes(e))) {
        return token.split("=")[1];
    }
    return 0;
}

export function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";" + ";path=/";
}

export function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}