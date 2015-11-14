var User = {
    // Enforce model schema in the case of schemaless databases
    schema: true,

    attributes: {
        username  : { type: 'string', unique: true },
        email     : { type: 'email',  unique: true },
        passports : { collection: 'Passport', via: 'user' },
        path      : { type:'string', defaultsTo:'http://192.168.0.28:1337/images/default.jpg'}
    }
};

module.exports = User;
