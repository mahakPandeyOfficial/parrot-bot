import mongoose from 'mongoose';

//creating schema or structure of users and database for roles and stuff...
const userChatsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    chats: [
        {
            _id: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
            
        },
    ],
},
{ timestamps: true}
);

//lastly we will export the db, if it already exist then simply export it or otherwise create new schmea-->
export default mongoose.models.userchats || mongoose.model("userchats", userChatsSchema);