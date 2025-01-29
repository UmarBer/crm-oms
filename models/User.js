import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
// In the code snippet above, we define a User schema and model using Mongoose. The schema defines the structure of the User model, including the fields username, email, and password. The model is then exported for use in other parts of the application.
