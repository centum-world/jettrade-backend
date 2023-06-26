const mongoose = require('mongoose');

const notificationForAllTraderSchema = new mongoose.Schema({

    investerType:{
        type:String
    },
    message:{
        type:String
    }

})

const notificationForAllTrader = mongoose.model('notificationForAllTrader',notificationForAllTraderSchema);
module.exports = notificationForAllTrader