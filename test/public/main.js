let RestClient = {
    people: {
        list: async () => {
            let res = await fetch('/api/people');
            return await res.json();
        },
        save: async (data) => {
            let res = await fetch('/api/people',
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            return await res.json();
        },
        remove: async (index) => {
            let res = await fetch('/api/people/remove',
                {
                    method: 'POST',
                    body: JSON.stringify({ index }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            return await res.json();
        }
    }
};
function dset(obj, keys, val) {
    keys.split && (keys = keys.split('.'));
    var i = 0, l = keys.length, t = obj, x;
    for (; i < l; ++i) {
        x = t[keys[i]];
        t = t[keys[i]] = (i === l - 1 ? val : (x != null ? x : (!!~keys[i + 1].indexOf('.') || !(+keys[i + 1] > -1)) ? {} : []));
    }
}
function formDataToObject(form) {
    let object = {};

    let formData = new FormData(form);

    let keys = [];
    formData.forEach(function (value, key) {
        let needsArray = false;
        if (keys.indexOf(key) > -1) {
            needsArray = true;
        }
        keys.push(key);
        if (needsArray) {
            let val = delve(object, key);
            value = [...(Array.isArray(val) ? val : [val]), value];
        }
        dset(object, key, value);
        needsArray = false;
    });
    return object;
}
(async () => {
    let peopleList = document.getElementById('peopleList');
    let loadPeople = async () => {
        peopleList.innerHTML = '';
        let people = await RestClient.people.list();
        people.map((p, i) => {
            let li = document.createElement('li');
            li.innerText = p.name;
            let removeButton = document.createElement('button');
            removeButton.innerText = '(x)';
            removeButton.onclick = async () => {
                await RestClient.people.remove(i);
                await loadPeople();
            };
            li.append(removeButton);
            peopleList.append(li);
        });
    }


    let form = document.getElementById('addPersonForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        let data = formDataToObject(form);
        await RestClient.people.save(data);
        await loadPeople();
        form.reset();
    }

    await loadPeople();
})();