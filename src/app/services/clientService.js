const Service = require("./service");
// const ObjectId = require("mongodb").ObjectId;
const Client = require("../module/client");
class ClientService extends Service {

    constructor() {
        super();
    }

    /**
     * 
     * Method count Course.
     * @Returns Number all Courses of collection.
     */
    countClient() {
        return super.documentQuery((resolve, reject) => {
            resolve(Client.count({}));
        })
    }

    /**
     * 
     * Method find one Course.
     * @param {*} id condition find single course.
     * @returns One Course document in collection.
     */
    findOneClient(query) {
        return super.documentQuery((resolve, reject) => {
            Client.findOne(query).exec((err, doc) => {
                if (err) reject(err);
                resolve(doc);
            })
        })
    }

    /**
     * 
     * Method find all Courses.
     * @returns List all Courses of collection.
     */
    findClient() {
        return super.documentQuery((resolve, reject) => {
            Client.find({}).exec((err, doc) => {
                if (err) reject(err);
                resolve(doc);
            })
        })
    }

    /**
     * 
     * Method find course with limit.
     * @param {*} limit number want get
     * @param {*} start location begin get
     * @returns list courses registry of []
     */
    findLimitClient(limit, start) {
        return Promise.all([super.documentQuery((resolve, reject) => {
            Client.find({}).limit(limit).skip(start).exec((err, doc) => {
                if (err) reject(err);
                resolve(doc);
            })
        }), this.countCourse()]);
    }


    /**
     * 
     * Method create course.
     * @param {*} body information new course
     * @returns status after create course
     */
    newClient(body) {
        return super.documentQuery((resolve, reject) => {
            Client.create(body, (err, doc) => {
                if (err) reject(err);
                resolve({ status: true, message: "Create done" })
            })
        })
    }

    /**
     * 
     * Method update course.
     * @param {*} query condition find course when update
     * @param {*} body information update course 
     * @returns status after update course
     */
    updateClient(query, body) {
        return super.documentQuery((resolve, reject) => {
            Client.updateOne(query, body, { upsert: true }).exec((err, doc) => {
                if (err) reject(err);
                resolve({ status: true, message: "Update done" });
            })
        })
    }

    /**
     * 
     * Method delete not sort
     * @param {*} query query condition find course when delete
     * @returns tatus after delete course
     */
    deleteClient(query) {
        return super.documentQuery((resolve, reject) => {
            Client.deleteOne(query).exec((err, doc) => {
                if (err) reject(err);
                resolve({ status: true, message: "Delete done" });
            })
        })
    }

}

module.exports = new ClientService;