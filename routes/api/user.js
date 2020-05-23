const express = require('express');
const router = express.Router();
const User = require('../../models/User');

router.post('/register', (req, res) => {
    const { userName, phoneNumber, password } = req.body;

    if (!userName || !phoneNumber || !password) {
        return res.status(400).json({ msg: "Please Enter All fields" });
    }

    User.findOne({ userName })
        .then(user => {
            if (user) return res.status(400).json({ msg: "UserName already exists" });

            else {
                User.findOne({ phoneNumber })
                    .then(user1 => {
                        if (user1) return res.status(400).json({ msg: "PhoneNumber already exists" });
                        else {
                            const newUser = new User({
                                userName,
                                phoneNumber,
                                password
                            });

                            newUser.save()
                                .then(user2 => {
                                    res.status(200).json(user2);
                                })
                                .catch(err => {
                                    res.status(400).json({ msg: "Something went wrong!" })
                                })
                        }
                    })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: "Something went wrong!" })
        })
});

router.post('/login', (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ msg: "Please Enter All fields!" });
    }

    User.findOne({ userName })
        .then(user => {
            if (!user) return res.status(400).json({ msg: "User Does Not exist" });
            else {
                if (user.password === password)
                    return res.status(200).json(user);
                else
                    return res.status(400).json({ msg: "Wrong Credentials!" })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: "Something went wrong!" })
        })
});

router.post('/pay/:phoneNumber1/:phoneNumber2/:amount', (req, res) => {
    
    const { phoneNumber1, phoneNumber2, amount } = {
        phoneNumber1: req.params.phoneNumber1,
        phoneNumber2: req.params.phoneNumber2,
        amount: req.params.amount
    };

    if (!phoneNumber1 || !phoneNumber2 || !amount) {
        return res.status(400).json({ msg: "Please Enter All fields!" });
    }
    User.findOne({ 'phoneNumber': phoneNumber1 })
        .then(user1 => {
            if (!user1) return res.status(400).json({ msg: "User1 Does Not exist" });
            else {
                User.findOne({ 'phoneNumber': phoneNumber2 })
                    .then(user2 => {
                        if (!user2) return res.status(400).json({ msg: "User1 Does Not exist" });
                        else {
                            if (user1.wallet < amount)
                                return res.status(400).json({ msg: "Insufficient Balance!" })
                            else {
                                user1.wallet -= amount;

                                user1.save()
                                    .then(res1 => {
                                        user2.wallet += amount;
                                        user2.save()
                                            .then(res2 => {
                                                return res.status(200).json({ msg: `Money Transfered to ${phoneNumber2}` })
                                            })
                                            .catch(err2 => {
                                                return res.status(400).json({ msg: `Money Deducted and not settled to ${phoneNumber2}` })
                                            })
                                    })
                                    .catch(err => {
                                        res.status(400).json({ msg: "Something went wrong!" })
                                    })
                            }
                        }
                    })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: "Something went wrong!" })
        })
});

router.get('/wallet/:user', (req, res) => {
    
    const { userName } = {userName: req.params.user};
    console.log({ userName })
    User.findOne({ userName })
        .then(user => {
            if (user)
                return res.status(200).json(user.wallet);
            else {
                return res.status(400).json({ msg: "User not found!" })
            }
        })
        .catch(err => {
            res.status(400).json({ msg: "Something went wrong!" })
        })
})

module.exports = router;