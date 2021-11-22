const chartForm = document.getElementById('addData');
const csvFile = document.getElementById('csvSheet');
const controlChart = document.getElementById('control-form');
const tabs = document.getElementById('tabs');
let data;

//parsing csv file
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

    array.pop();
    return array;
}

//submitting csv file
chartForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        data = toArray(text);
        timeFrame(1, 5, "#0ef147", "#0d12f2", 'day')
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

//create elements utility
function elFactory(type, attributes, ...children) {
    const el = document.createElement(type);
    for (key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else {
            el.appendChild(child);
        }
    });
    return el;
}

//group matching days
function groupDays(arr) {
    const hash = {};
    return arr.reduce(function (res, e) {
        if (hash[e] === undefined) {
            hash[e] = res.push([e]) - 1;
        } else {
            res[hash[e]].push(e);
        }
        return res;
    }, []);
}

//handle timeframe filter
function timeFrame(...args) {
    tabs.innerHTML = '';

    let endDates = data.map(d => d.endDate.slice(0, 10));
    let startDates = data.map(e => e.startDate.slice(0, 10));

    let startGroup = groupDays(startDates);
    let endGroup = groupDays(endDates);

    const workingWeek = dayFilter(args[0], args[1]);

    let sortedStart = [];
    let sortedEnd = [];

    //day
    if (args[4] == "day") {

        startGroup.forEach(g => {
            if (workingWeek.includes(new Date(g[0]).getDay())) {
                sortedStart.push(g)
            }
        })

        endGroup.forEach(g => {
            if (workingWeek.includes(new Date(g[0]).getDay())) {
                sortedEnd.push(g)
            }
        });
    }

    //month
    if (args[4] == "month") {
        startGroup.forEach(g => {
            if (workingWeek.includes(new Date(g[0]).getDay())) {
                g.map(el => {
                    sortedStart.push(el.slice(0, 7))
                })
            }
        });
        sortedStart = groupDays(sortedStart);

        endGroup.forEach(g => {
            if (workingWeek.includes(new Date(g[0]).getDay())) {
                g.map(el => {
                    sortedEnd.push(el.slice(0, 7))
                })
            }
        });
        sortedEnd = groupDays(sortedEnd);
    }

    sortedStart.forEach(s => {
        sortedEnd.forEach(e => {
            if (s[0] == e[0]) {
                tabs.appendChild(
                    elFactory('li',
                        { class: "tab" },
                        elFactory('div', { class: 'section-main' },
                            elFactory('div', { class: 'text' }, `${s[0]}`)),
                        elFactory('div', { class: "section-aside", id: 'section-aside' },
                            elFactory('div', {
                                class: 'col1', style: `height: ${s.length * 16.2}px; background: ${args[2]}`
                            }, `${s.length}`),
                            elFactory('div', { class: 'col2', style: `height: ${e.length * 16.2}px; background: ${args[3]}` }, `${e.length}`))
                    )
                );
            }
        });
    });
}

//change filters
controlChart.addEventListener('change', (ev) => {
    if (!data) {
        alert("No data to process")
        return;
    }

    //color update
    const day1 = document.getElementById('workdaySetting1').value
    const day2 = document.getElementById('workdaySetting2').value
    const colorStart = document.getElementById('started').value;
    const colorEnd = document.getElementById('finished').value;
    const timelineOpt = document.getElementById("timeline").value;

    //day
    if (timelineOpt == "day") {
        timeFrame(day1, day2, colorStart, colorEnd, 'day')
    }

    //month
    else if (timelineOpt == "month") {
        timeFrame(day1, day2, colorStart, colorEnd, 'month')
    }

})













