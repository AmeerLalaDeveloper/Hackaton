const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const mainFunc = require('../server');
const mongoose = require('mongoose');
const peoplesModel = require('./linkedin.db').peoplesModel;
const exportUsersToExcel = require('../mongoDB/excel')
const workSheetColumnNames = [
    "Name",
    "Email",
    "LinkedIn Profile"]
const workSheetName = 'Users';
const filePath = './outputFiles/excel-from-js.xlsx'

app.use(cors())


bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
const getDataFromMongoAtlas = () => {
    peoplesModel.find({}).lean().exec(function (err, data) {
        if (err) throw err;
        exportUsersToExcel(data, workSheetColumnNames, workSheetName, filePath)
    });
}
const runMainFunc = async () => {
    await mainFunc.main()
}
runMainFunc().then(_ => getDataFromMongoAtlas())



mongoose.connect('mongodb+srv://AmeerLala:ameerlala123@cluster0.i5wcv.mongodb.net/people?retryWrites=true&w=majority', { useNewUrlParser: true });

app.listen(process.env.PORT || 5001, () => {
    console.log('Server started on port 5001');
});