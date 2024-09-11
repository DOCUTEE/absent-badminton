function getData() {
      const week = document.getElementById("inputWeek").value;
      fetch(`/getData?week=${week}`)
            .then((response) => response.json())
            .then((data) => {
                  const absentJSON = data;
                    console.log(JSON.stringify(absentJSON,null,2));
                  let absentListDiv = document.getElementById('absentStudentList');
                  absentListDiv.innerHTML = '';
                  let output = '';
                  output += absentJSON["Week"] + '\n';
                  absentJSON["teamList"].forEach(team => {
                        let teamUL = document.createElement('ul');
                        output += team["Name"] + ': ' + (team["Total"] - team["List"].length).toString() + ' / ' + team["Total"] + '\n';
                        teamUL.innerHTML = team["Name"] +'\n' ;
                        team["List"].forEach(student => {
                              let studentLI = document.createElement('li');
                              studentLI.innerHTML = student["MSSV"] + " | " + student["Name"] + " | " + student["Reason"];
                              teamUL.appendChild(studentLI);
                              output += student["MSSV"] + " | " + student["Name"] + " | " + student["Reason"] + '\n';
                        });
                        absentListDiv.appendChild(teamUL);
                        console.log(team["List"]);
                  });
            })
            .catch((error) => {
                  console.error("Error: ", error);
            });
}