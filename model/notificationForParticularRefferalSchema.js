const mongoose = require('mongoose');

const notificationForParticularRefferalSchema = new mongoose.Schema({

    memberid:{
        type:String
    },
    message:{
        type:String
    }

})

const notificationForParticularRefferal = mongoose.model('notificationForParticularRefferal',notificationForParticularRefferalSchema);
module.exports = notificationForParticularRefferal