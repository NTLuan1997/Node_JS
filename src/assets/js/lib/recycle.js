import { Cookie } from "./cookie.js";
import Delete from "./delete.js";
import { environment } from "../config/environment.js";
import { HTTPS } from "./https.js";
import Origin  from "./lib-origin.js";
import { View } from "./view.js";

window.onload = function(e) {

    const cookie = new Cookie();
    const deleted = new Delete();
    const https = new HTTPS();
    const origin = new Origin();
    const view = new View();
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const token = `Bearer ${cookie.get("Authentic")}`;

    let type = origin.parameter().type;
    environment.payload.type = "Find";

    const recycle = (function() {
        const Restore = $("#restore");
        let backpage = "";
        let endpoint = "";
        let options = {};
        let ParentRecycle;
        let ItemsRecycle;
        let Thumbnail = "";

        function stated() {
            ParentRecycle = $("#parent-recycle");
            ItemsRecycle = Array.from($$(".childrens-recycle"));

            ParentRecycle.addEventListener("change", function(e) {
                let _this = this;
                (_this.checked)? Restore.classList.add("active") : Restore.classList.remove("active");
                ItemsRecycle.forEach((recycle) => {
                    recycle.checked = _this.checked;
                })
            })

            ItemsRecycle.forEach((recycle) => {
                recycle.addEventListener("change", function(e) {
                    if(ItemsRecycle.every((item) => item.checked === false)) {
                        Restore.classList.remove("active");

                    } else if(ItemsRecycle.some((item) => item.checked === false)) {
                        ParentRecycle.checked = false;
                        Restore.classList.add("active");

                    } else {
                        if(ItemsRecycle.every((item) => item.checked === true)) {
                            ParentRecycle.checked = true;
                            Restore.classList.add("active");
                        }
                    }
                })
            })
        }

        function restored() {
            Restore.addEventListener("click", function(e) {
                let Tokens = [];
                ItemsRecycle.forEach(function(item) {
                    if(item.checked) {
                        Tokens.push(item.dataset.id);
                    }
                })

                let payload = {
                    Type: "Restore",
                    Tokens: Tokens,
                    Status: true,
                }

                https.PUT(token, payload, endpoint)
                .then((result) => {
                    if(result?.status) {
                        window.location.href = backpage;
                    }
                })
                .catch((err) => {
                    throw err;
                })
            })
        }

        return {
            config: function() {
                switch(type) {
                    case "user":
                    default:
                        backpage = "/web/user";
                        endpoint = environment.endpoint.user;
                        Object.assign(options, environment.options.user);
                        break;
                }
            },

            render: function() {
                https.FIND(environment.payload, token, endpoint)
                .then((result) => {
                    view.Render({
                        ...options,
                        Body: "#Body",
                        Blank: "#Blank",
                        Header: "#Header",
                        Result: result,
                        Type: "Recycle",
                    });
                })
                .then(() => {
                    stated();
                })
                .then(() => {
                    restored();
                    deleted.really($$(".delete"), endpoint);
                })
                .catch((err) => {
                    throw err;
                })
            }
        }
    })()

    recycle.config();
    recycle.render();
}