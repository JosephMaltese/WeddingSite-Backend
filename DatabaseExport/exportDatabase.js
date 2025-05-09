const mongoose = require('mongoose');
const dotenv = require('dotenv');
const xlsx = require('xlsx');

dotenv.config();


const userSchema = new mongoose.Schema({
    email: String,
    lastname: String,
    token: String,
    rsvp: Boolean,
    attending: Boolean,
    memberCount: Number,
    finishedRSVP: Boolean,
    familyMembers: [{
      name: String,
      attending: Boolean,
      plusOne: Boolean,
      plusOneName: String,
      canBringPlusOne: Boolean,
    }]
  });
  
  const User = mongoose.model('User', userSchema);

const flattenUserData = (users) => {
    const flattened = []

    users.forEach(user => {
        user.familyMembers.forEach(member => {
            flattened.push({
                userEmail: user.email,
                userLastName: user.lastname,
                userToken: user.token,
                userAttending: user.attending,
                memberName: member.name,
                memberAttending: member.attending,
                memberPlusOne: member.plusOne,
                plusOneName: member.plusOneName || '',
                canBringPlusOne: member.canBringPlusOne,
            });
        })
    })

    return flattened;

}

const exportToExcel = (filename, data) => {
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'RSVP Data');
    xlsx.writeFile(workbook, filename);
    console.log(`✅ Exported to ${filename}`);
}


const exportDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connection SUCCESS to DB:', mongoose.connection.name);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in DB:', collections.map(c => c.name));

        const attendingUsers = await User.find({ attending: true }).lean();
        const notAttendingUsers = await User.find({ attending: false }).lean();
        //console.log(JSON.stringify(notAttendingUsers[0], null, 2));

        const attendingData = flattenUserData(attendingUsers);
        const notAttendingData = flattenUserData(notAttendingUsers);

        exportToExcel('attending.xlsx', attendingData);
        exportToExcel('not_attending.xlsx', notAttendingData);

        process.exit(0)
    } catch (err) {
        console.log('Error exporting database:', err);
        process.exit(1)
    }
}

exportDatabase();