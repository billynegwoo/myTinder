/**
* User_save.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var User_saved = {
    schema: true,
  attributes: {
          user_id:{ type: 'integer'},
          user_id_saved:{ type: 'integer'}
  }
};
module.exports = User_saved;

