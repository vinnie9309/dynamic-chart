const chartForm = document.getElementById('addData');
const csvFile = document.getElementById('csvSheet');
const data = JSON.parse(localStorage.getItem('info'));
const controlChart = document.getElementById('control-form');

//parsing and storing csv file
function toArray(str) {
    const delimeter = ','
    const headers = str.slice(0, str.indexOf('\n') - 1).split(delimeter);
    const rows = str.slice(str.indexOf('\n') + 1).split("\r\n");

    const array = rows.map((row) => {
        const values = row.split(delimeter);
        const el = headers.reduce((object, header, index) => {
            if (header.includes("End Date")) {
                header = 'endDate';
            }
            if (header.includes("Start Date")) {
                header = "startDate";
            }
            if (header.includes("Created At")) {
                header = "created";
            }

            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    array.pop()
    localStorage.setItem("info", JSON.stringify(array))
    return array;
}

//submitting csv file
chartForm.addEventListener('submit', (ev) => {
    localStorage.clear()
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const data = toArray(text);
    };
    if (input) {
        reader.readAsText(input);
    }
    else {
        alert('No file found')
    }
})

//filter by working days
function dayFilter(num1, num2) {
    let arr = [1, 2, 3, 4, 5]
    let arr2 = [];
    if (num1 > num2) {
        consec1 = arr.slice(num1 - 1)
        consec2 = arr.slice(0, num2);
        arr2 = consec1.concat(consec2);
        return arr2
    } else if (num2 > num1) {
        arr2 = arr.slice(num1 - 1, num2)
        return arr2;
    } else {
        return num1
    }
}


//change filters
controlChart.addEventListener('change', (ev) => {
    if (!data) {
        alert("No data to process")
        return;
    }
    const endDates = data.map(d => d.endDate.slice(0, 10));
    const startDates = data.map(e => e.startDate.slice(0, 10));

    const tabs = document.getElementById('tabs');
    tabs.innerHTML = '';
    //color update
    const day1 = document.getElementById('workdaySetting1').value
    const day2 = document.getElementById('workdaySetting2').value

    const workingWeek = dayFilter(day1, day2);

    const colorStart = document.getElementById('started').value;
    const colorEnd = document.getElementById('finished').value;
    const timelineOpt = document.getElementById("timeline").value;

    //day
    if (timelineOpt == "day") {

        let startDays = [];
        let endDays = [];

        startDates.map(d => {
            const date = new Date(d);
            const day = date.getDay();
            if (day) {
                startDays.push(day)
            }
        })

        endDates.map(e => {
            const date2 = new Date(e);
            const day2 = date2.getDay();
            if (day2) {
                endDays.push(day2)
            }
        })
       
        if (workingWeek.length > 1) {
            workingWeek.forEach(w => {
                const end = endDays.filter(d => d == w);
                const start = startDays.filter(d => d == w);

                const li = document.createElement('li');
                li.setAttribute('class', "tab");
                const divSection = document.createElement("div");
                divSection.setAttribute('class', "section-main");
                const divText = document.createElement('div');
                divText.setAttribute('class', "text");
                if (w == 1) {
                    divText.textContent = "Monday"
                } else if (w == 2) {
                    divText.textContent = "Tuesday"
                } else if (w == 3) {
                    divText.textContent = "Wednesday"
                } else if (w == 4) {
                    divText.textContent = 'Thursday'
                } else if (w == 5) {
                    divText.textContent = "Friday"
                }
                divSection.appendChild(divText);
                li.appendChild(divSection)
                tabs.appendChild(li)

                const divAside = document.createElement('div');
                divAside.setAttribute('class', 'section-aside');

                const divCol1 = document.createElement('div');
                divCol1.setAttribute('class', 'col1');
                divCol1.textContent = start.length
                divCol1.style.height = `${start.length}vh`
                divCol1.style.background = colorStart

                const divCol2 = document.createElement("div");
                divCol2.setAttribute('class', 'col2');
                divCol2.textContent = end.length
                divCol2.style.height = `${end.length}vh`
                divCol2.style.background = colorEnd

                divAside.append(divCol1, divCol2);
                li.appendChild(divAside);
            })
        }
    }
    //month
    else if (timelineOpt == "month") {
        let startMonth = []
        let endMonth = []
        if (workingWeek.length > 1) {
            startDates.map(d => {
                const date = new Date(d);
                const month = date.getMonth();
                const day = date.getDay();
                if (workingWeek.includes(day)) {
                    startMonth.push(month)
                }
            })
            endDates.map(d => {
                const date = new Date(d);
                const month = date.getMonth();
                const day = date.getDay();
                if (workingWeek.includes(day)) {
                    endMonth.push(month)
                }
            })
            
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            arr.forEach(m => {
                const start = startMonth.filter(d => d == m);
                const end = endMonth.filter(d => d == m);

                if (start.length > 0 && end.length > 0) {
                    const li = document.createElement('li');
                    li.setAttribute('class', "tab");
                    const divSection = document.createElement("div");
                    divSection.setAttribute('class', "section-main");
                    const divText = document.createElement('div');
                    divText.setAttribute('class', "text");
                    if (m == 0) {
                        divText.textContent = "January"
                    } else if (m == 1) {
                        divText.textContent = "February"
                    } else if (m == 2) {
                        divText.textContent = "March"
                    } else if (m == 3) {
                        divText.textContent = 'April'
                    } else if (m == 4) {
                        divText.textContent = "May"
                    } else if (m == 5) {
                        divText.textContent = "June"
                    }
                    else if (m == 6) {
                        divText.textContent = "July"
                    }
                    else if (m == 7) {
                        divText.textContent = "August"
                    }
                    else if (m == 8) {
                        divText.textContent = "September"
                    }
                    else if (m == 9) {
                        divText.textContent = "October"
                    }
                    else if (m == 10) {
                        divText.textContent = "November"
                    }
                    else if (m == 11) {
                        divText.textContent = "December"
                    }
                    divSection.appendChild(divText);
                    li.appendChild(divSection)
                    tabs.appendChild(li)

                    const divAside = document.createElement('div');
                    divAside.setAttribute('class', 'section-aside');

                    const divCol1 = document.createElement('div');
                    divCol1.setAttribute('class', 'col1');
                    divCol1.textContent = start.length
                    divCol1.style.height = `${start.length}vh`
                    divCol1.style.background = colorStart

                    const divCol2 = document.createElement("div");
                    divCol2.setAttribute('class', 'col2');
                    divCol2.textContent = end.length
                    divCol2.style.height = `${end.length}vh`
                    divCol2.style.background = colorEnd

                    divAside.append(divCol1, divCol2);
                    li.appendChild(divAside);
                }

            })
        }

    }

})













