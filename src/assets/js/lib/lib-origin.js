export default class Origin {

    constructor() { }

    parameter() {
        let main = {};
        let {host, hostname, href, origin, pathname, port, protocol, search} = window.location;

        if(search.includes("token")) {
            main.token = search.slice(search.indexOf("token")).split("=")[1];
        }

        if(search.includes("type")) {
            main.type = search.slice(search.indexOf("type"), search.indexOf("&")).split("=")[1];
        }
        return main;
    }

    checkTypePage() {
        let {host, hostname, href, origin, pathname, port, protocol, search} = window.location;
        let endPoint = href.substring((href.lastIndexOf("/") + 1));
        let tam = "";
        console.log(endPoint.includes("?"));
        if(endPoint.includes("?")) {
            endPoint = endPoint.substring(0, endPoint.indexOf("?"));
        }
        
        return endPoint;
    }
}