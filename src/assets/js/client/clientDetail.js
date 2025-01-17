import { Cookie } from "../lib/cookie.js";
import DateTimes from "../lib/date.js";
import { environment } from "../config/environment.js";
import { HTTPS } from "../lib/https.js";
import Origin  from "../lib/lib-origin.js";
import { Permission } from "../lib/permission.js";
import { Priture } from "../lib/priture.js";
import { Validation } from "../lib/validation.js";

window.onload = function(e) {
    const cookie = new Cookie();
    const date = new DateTimes();
    const https = new HTTPS();
    const origin = new Origin();
    const permission = new Permission();
    const priture = new Priture();
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const token = `Bearer ${cookie.get("Authentic")}`;
    const type = origin.parameter().type;

    // INFORMATION
    const address = $("#address");
    const blank = $("#blank");
    const Client = $('#Client');
    const content = $('#content');
    const DateOfBirth = $("#DateOfBirth");
    const Email = $("#Email");
    const Name = $("#Name");
    const Gender = $("#Gender");
    const Phone = $("#Phone");
    const Password = $("#Password");
    const Swicthed = $("#Switched");
    const Status = $("#Status");
    const Executed = $("#Executed");
    const Title = $("#Title-page");
    const Thumbnail = $("#Thumbnail");
    const thumbnail = $("#thumbnail");
    const Upload = $("#Upload");
    const redirect = $("#redirect");

    const hidden = $$(".hidden");

    let rules = [{
            selector: "#Name",
            guides: [Validation.required()]
        },
        {
            selector: "#Email",
            guides: [Validation.required(), Validation.isEmail()]
        },
        {
            selector: "#Gender",
            guides: [Validation.required()]
        },
        {
            selector: "#DateOfBirth",
            guides: [Validation.required()]
        },
        {
            selector: "#Phone",
            guides: [Validation.required(), Validation.phone()]
        },
        {
            selector: "#address",
            guides: [Validation.required()]
        },
    ];

    let app = (function() {
        let thumbnailOld = "";
        
        if(type === "update") {
            let payload = {
                client: {
                    id: (origin.parameter().token)? origin.parameter().token : localStorage.getItem("clientToken"),
                    type: "Find"
                },
                course: {
                    type: "Find",
                    status: true
                }
            };

            https.FIND(payload.client, token, environment.endpoint.client)
            .then((result) => {
                address.value = result.at(0)?.Address;
                DateOfBirth.value = date.bindingToTemplate(result.at(0)?.DateOfBirth);
                Email.value = result.at(0)?.Email;
                Name.value = result.at(0)?.Name;
                Gender.value = result.at(0)?.Gender;
                Phone.value = result.at(0)?.Phone;
                Status.checked = result.at(0)?.Status;
                if(result.at(0)?.Thumbnail) {
                    thumbnailOld = result.at(0)?.Thumbnail;
                    thumbnail.setAttribute("src", `${environment.priture.url}/${result.at(0)?.Thumbnail}`);
                }

                View(result.at(0)?.RegisterCourse);
            })
            .catch((err) => {
                throw err;
            })
        }

        function View(parameter) {
            if(parameter.length) {
                content.classList.add("active");
                content.innerHTML = parameter.reduce((accument, item) => {
                    return accument.concat(`<p class="document-content--items">
                        <i class="fa fa-check" aria-hidden="true"></i> ${item?.courseName}
                    </p>`);
                }, []).join(" ");

            } else {
                blank.classList.add("active");
            }
        }

        function getClient() {
            let payload = {
                Address: address.value,
                DateOfBirth: DateOfBirth.value,
                Email: Email.value,
                Name: Name.value,
                Gender: Gender.value,
                Platform: "System",
                Phone: Phone.value,
                Password: "P@ssword123",
                RegisterCourse: []
            }
    
            if(type === "create") {
                payload.Type = "Register";
                payload.Status = true;
                payload.Thumbnail = "";
            }
    
            if(type === "update") {
                payload.Type = "modified";
                payload.Id = (origin.parameter().token)? origin.parameter().token : localStorage.getItem("clientToken");
                (Password.value)? payload.Password = Password.value : delete payload.Password;

                delete payload.RegisterCourse;
                delete payload.Status;
            }
            
            return payload;
        }

        return  {
            BindInformationPage: function() {
                if(type === "update") {
                    Executed.innerHTML = "Cập nhật thông tin";
                    Swicthed.classList.add("active");
                    Thumbnail.classList.add("active");
                    Title.innerHTML = "Chỉnh sửa thông tin";

                    hidden.forEach((item) => {
                        item.classList.add("active");
                    })
                    
                } else {
                    Executed.innerHTML = "Thêm mới";
                    Swicthed.classList.remove("active");
                    Thumbnail.classList.remove("active");
                    Title.innerHTML = "Thêm mới học viên";

                }
            },            
            BindEvent: function(callback) {
                if(type === "update") {
                    Status.addEventListener("change", callback().state);
                    Upload.addEventListener("change", callback().thumbnail);
                    Client.addEventListener("submit", callback().update);

                } else {
                    Client.addEventListener("submit", callback().create);
                }
            },
            Event: function() {
                return {
                    create : function(e) {
                        e.preventDefault();
                        if (this.valid) {
                            https.POST(token, getClient(), environment.endpoint.client)
                            .then((result) => {
                                (result?.status)? window.location.href = "/web/client" : permission.setState(result);
                            })
                            .catch((err) => {
                                throw err;
                            })
                        } else {
                            permission.setState({type: "form-invalid"});
                        }
                    },
                    update: function(e) {
                        e.preventDefault();
                        if (this.valid) {
                            https.PUT(token, getClient(), environment.endpoint.client)
                            .then((result) => {
                                (result?.status)? window.location.href = "/web/client" : permission.setState(result);
                            })
                            .catch((err) => {
                                throw err;
                            })
                        } else {
                            permission.setState({type: "form-invalid"});
                        }
                    },
                    state: function(e) {
                        let payload = {
                            Status: this.checked,
                            Platform: "System",
                            Id: (origin.parameter().token)? origin.parameter().token : localStorage.getItem("clientToken"),
                            Type: "modified"
                        };

                        https.PUT(token, payload, environment.endpoint.client)
                        .then((result) => {
                            (result?.status)? window.location.reload(): permission.setState(result);
                        })
                        .catch((err) => {
                            throw err;
                        })
                    },
                    thumbnail: function(e) {
                        priture.upload(environment.priture.url, this.files[0], "clients", thumbnailOld)
                        .then((result) => {
                            let {status, message, destination} = result;
                            if(status) {
                                let payload = {
                                    Platform: "System",
                                    Id: (origin.parameter().token)? origin.parameter().token : localStorage.getItem("clientToken"),
                                    Type: "modified",
                                    Thumbnail: destination
                                }
                                return https.PUT(token, payload, environment.endpoint.client);
                            } else {
                                permission.setState({type: "upload-priture"});
                            }
                        })
                        .then((result) => {
                            (result?.status)? window.location.reload(): permission.setState(result);
                        })
                        .catch((err) => {
                            throw err;
                        })
                    }
                }
            },
            redirect: function() {
                redirect.addEventListener("click", function(e) {
                    if(origin.parameter().token) {
                        localStorage.setItem("clientToken", origin.parameter().token);
                    }
                    window.location.href = "/web/client/register";
                })
            },
            validation: function() {
                if(type === "update") {
                    rules.push(...[
                        {
                            selector: "#Password",
                            guides: [Validation.password()],
                            optional: true,
                        },
                        {
                            selector: "#ConfirmPassword",
                            guides: [Validation.ConfirmPassword($("#Password"))],
                            linked: {"element":$("#Password"), "status": true},
                        }
                    ]);
                }

                Validation({
                    form: "#Client",
                    selectorError: ".form-message",
                    rules: rules
                });
            }
        }
    })();

    app.BindInformationPage();
    app.validation();
    app.BindEvent(app.Event);
    app.redirect();
}