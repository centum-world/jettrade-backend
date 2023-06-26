const mongoose = require('mongoose');

const notificationForAllSchema = new mongoose.Schema({

    message:{
        type:String
    }

})

const notificationForAll = mongoose.model('notificationForAll',notificationForAllSchema);
module.exports = notificationForAll