// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express();
server.use(express.json());

server.delete(`/api/users/:id`, async (req,res) => {
    try {
        const { id } = req.params;
        const possibleUser = await User.findById(id)
        if(!possibleUser){
            res.status(404).json({ 
                message: "The user with the specified ID does not exist"
            })
        }
        else {
            const deletedUser = await User.remove(possibleUser.id)
            res.status(200).json(deletedUser)
            }
    }
    catch(err) {
        res.status(500).json({
            message: "The user could not be removed",
            err: err.message
        })
    }
})

server.post('/api/users', (req,res) => {
    const user = req.body;
    if(!user.name || !user.bio){
        res.status(400).json({ 
            message: "Please provide name and bio for the user" 
        })
    }
    else {
        User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
        .catch(err => {
            res.status(500).json({
                message: `Error creating profile`,
                err: err.message,
                stack: err.stack
            })
        })
    }
})

server.get('/api/users', (req,res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: `Error getting Users`,
                err: err.message,
                stack: err.stack
            })
        })
})

server.get('/api/users/:id', (req,res) => {
    const { id } = req.params;
    User.findById(id)
        .then(user => {
            if (!user){
                res.status(404).json({
                    message: "the user with this id does not exist"
                })
            }
            else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Error getting Users`,
                err: err.message,
                stack: err.stack
            })
        })
})

server.use('*', (req,res) => {
    res.status(404).json({
        message: 'not found'
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}

