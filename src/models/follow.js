import mongoose from 'mongoose';

const { Schema } = mongoose;

const followSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Follow', followSchema);
