const mongoose = require('mongoose');

const notificationForAllRefferalSchema = new mongoose.Schema({

    investerType:{
        type:String
    },
    message:{
        type:String
    }

})

const notificationForAllRefferal = mongoose.model('notificationForAllRefferal',notificationForAllRefferalSchema);
module.exports = notificationForAllRefferal