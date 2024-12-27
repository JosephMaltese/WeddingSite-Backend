const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';

    for (let i =0; i<length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return token;
}

const generateUniqueToken = async (length = 6) => {
    let tokenExists = true;
    let token = '';

    while (tokenExists) {
        token = generateToken(length);
        const userWithToken = await User.findOne({ token });

        tokenExists = !!userWithToken;
    }

    return token;
}

exports.createUser = async (req, res) => {
    const { members, lastname, email } = req.body;
    console.log(req.body);

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
          }
        
        // const uniqueToken = generateToken();
        const uniqueToken = await generateUniqueToken(6);
        const user = await User.create(
            {
                email,
                lastname,
                token: uniqueToken,
                rsvp: false,
                attending: false,
                memberCount: members.length,
                finishedRSVP: false,
                familyMembers: members
            }
        );

        console.log('Created user: ', user);

        res.status(201).json({ 
            _id: user._id,
            email: user.email,
            token: user.token,
            rsvp: user.rsvp,
            attending: user.attending,
            memberCount: user.memberCount,
            finishedRSVP: user.finishedRSVP,
            familyMembers: user.familyMembers 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


exports.deleteUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getUser = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getFamilyMembers = async (req, res) => {
    const email = req.params.email;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ familyMembers: user.familyMembers});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }    
}


exports.updateUser = async (req, res) => {
    const { email, rsvp, attending, familyMembers, lastname, memberCount, finishedRSVP } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;
        user.rsvp = rsvp;
        user.attending = attending;
        user.familyMembers = familyMembers;
        user.lastname = lastname;
        user.memberCount = memberCount;
        user.finishedRSVP = finishedRSVP;

        await user.save();

        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.userByToken = async (req, res) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }


}