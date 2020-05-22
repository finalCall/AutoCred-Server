const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/key');
const user = require('./routes/api/user');

const app = express();

mongoose.connect(config.mongoURI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/user', user);
app.use('/',(req,res)=>{
    res.send('hello');
})

const port = 5000 || process.env.PORT;

app.listen(port, () => { console.log(`server started at port ${port}`) });