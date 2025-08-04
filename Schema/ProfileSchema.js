const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  companyAddress: {
    type: String,
    required: true
  },
  companyGSTNumber: {
    type: String,
    required: true
  },
  phoneNumber1: {
    type: String,
    required: true
  },
  phoneNumber2: {
    type: String,
    required: false
  },
  personAddress: {
    type: String,
    required: true
  },
  profilePhotoCompany: {
    data: Buffer,          
    contentType: String 
  },
  profilePhotoPerson: {
   data: Buffer,          
    contentType: String 
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
