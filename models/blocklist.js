import mongoose from 'mongoose';

const blocklistSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: {
      validator: async function (value) {
        // Allow null values without uniqueness check
        if (value === null) {
          return true;
        }

        // Check uniqueness for non-null values
        const count = await mongoose.models.Blocklist.countDocuments({ username: value, _id: { $ne: this._id } });

        if (count !== 0) {
          this.invalidate('username', 'Username must be unique ', value);
        }
        return true;
      },
    },
  },
  email: {
    type: String,
    validate: {
      validator: async function (value) {
        // Allow null values without uniqueness check
        if (value === null) {
          return true;
        }

        // Check uniqueness for non-null values
        const count = await mongoose.models.Blocklist.countDocuments({ email: value, _id: { $ne: this._id } });

        if (count !== 0) {
          this.invalidate('email', 'Email must be unique ', value);
        }
        return true;
      },
    },
  },
});


const Blocklist = mongoose.model('Blocklist', blocklistSchema);

export default Blocklist;
