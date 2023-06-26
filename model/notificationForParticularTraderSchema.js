const mongoose = require('mongoose');

const notificationForParticularTraderSchema = new mongoose.Schema({

    userid:{
        type:String
    },
    message:{
        type:String
    }

})

const notificationForParticularTrader = mongoose.model('notificationForParticularTrader',notificationForParticularTraderSchema);
module.exports = notificationForParticularTrader