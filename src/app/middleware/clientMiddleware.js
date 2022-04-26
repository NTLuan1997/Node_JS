const unitService = require('../services/unitService');
const lessonService = require('../services/lessonService');

function courseDetail(req, res, next) {
    req.course = req.body;
    let unitQuery = {"courseId": {"$eq": String(req.body._id)}};

    unitService.findUnit(unitQuery)
    .then((units) => {
        req.course.units = units;
        next();

    })
    .catch((err) => {
        return res.status(405).json({status: false, message: "method failed"});
    })
}

function courseLesson(req, res, next) {
    if(Array.isArray(req.course.units) && req.course.units.length ) {
        for(let i = 0; i <= (req.course.units.length - 1); i++) {
            let lessonQuery = { "unitId": { "$eq": String(req.course.units[i]._id) } };

            lessonService.findLesson(lessonQuery)
            .then(function(lesson) {
                req.course.units[i].lessons = lesson;
                if(i == (req.course.units.length - 1)) {
                    next();
                }
            })
            .catch((err) => {
                throw err;
            })
        }
    } else {
        req.course.units = [];
        next();
    }
}

function client(req, res, next) {
    console.log(req.body);
    next();
}



module.exports = { client, courseDetail, courseLesson };