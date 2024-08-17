import mongoose from 'mongoose';

//creating schema or structure of users and database for roles and stuff...
const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    history: [
        {
            role: {
                type: String,
                enum: ["user" , "model"],
                required: true,
            },
            parts: [
                {
                    text: {
                        type: String,
                        required: true,
                    },
                },
            ],
            img: {
                type: String,
                required: false,
            },
        },
    ],
},
{ timestamps: true}
);

//lastly we will export the db, if it already exist then simply export it or otherwise create new schmea-->
export default mongoose.models.chat || mongoose.model("chat", chatSchema);