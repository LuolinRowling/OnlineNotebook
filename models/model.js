var Waterline = require('waterline');

exports.User = Waterline.Collection.extend({
    identity: 'user',
    connection: 'mongo',
    schema: true,
    attributes: {
        username: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true           
        },
        email: {
            type: 'email',
            required: false
        },
        createTime: {
            type: 'date'
        }
    },
    beforeCreate: function(value, cb) {
        value.createTime = new Date();
        return cb();
    }

})