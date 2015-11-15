/**
 * User_trash.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var User_trashed = {
    schema: true,
    attributes: {
        user_id:{ type: 'integer'},
        user_id_trashed:{ type: 'integer'}
    }
};
module.exports = User_trashed;

