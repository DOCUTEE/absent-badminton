const express = require("express");
const path = require('path');
const axios = require('axios');
const XLSX = require('xlsx');
const app = express();
const port = 3000;

async function downloadXLSX(url) {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return response.data;
}

async function convertXLSXToJSON(data, sheetIndex) {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];
      // console.log(sheetName);
      const json = XLSX.utils.sheet_to_json(worksheet);
      return json;
}
async function getAbsentStudentList(need) {
      const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQTcHsRqB6m-hEIK_HXg6dMxiAl0TqThlhzbEDz2IOqHttOJLfAGnZXCM0XsR-7wEfaAoCSJzUeun3N/pub?output=xlsx';
      const week = need;
      const strWeek = "Tuần " + week.toString();
      const MSSV = "MSSV";
      const HoVaTen = "Họ và tên";
      const strStudentExist = "Có mặt";
      let absentList = {
            "Week": strWeek,
            "teamList": [
                  
            ]
      }
      // console.log(absentList);
      try {
            const xlsxData = await downloadXLSX(url);
            for (let i = 0; i < 5; i++) {
                  const jsonData = await convertXLSXToJSON(xlsxData, i);
                  let team = {
                        "Name": "Nhóm " + (i + 1).toString(),
                        "Total": jsonData.length.toString(),
                        "List": []
                  };
                  jsonData.forEach(student => {
                        if (student[strWeek] != strStudentExist) {
                              let studentInfo = {
                                    "MSSV": student[MSSV],
                                    "Name": student[HoVaTen],
                                    "Reason": student[strWeek]
                              };
                              team["List"].push(studentInfo);
                        }
                  });
                  absentList["teamList"].push(team);
            }
      } catch (error) {
            console.error('Error downloading or converting the file:', error);
      }
      return absentList;
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
      if (req.query.week != "") {
            console.log(req.query.week);
      }
      else console.log("GA");
      res.render("index");
});
app.get("/getData", async (req, res) => {
      const need = req.query.week;
      const result = await getAbsentStudentList(need);
      res.send(result);
})
app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);
});

