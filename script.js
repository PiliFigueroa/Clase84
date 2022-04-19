const BASE_URL = "https://624f3f05bdda77e9a9bc0f10.mockapi.io/"
const queryId = (idName) => document.getElementById(idName)
let isEdit = false

// REQUESTS
const getData = () => {
    fetch(`${BASE_URL}dinero`)
        .then(response => response.json())
        .then(data => createCards(data))
        .catch(err => console.log(err))
}

const getDataById = (id) => {
    fetch(`${BASE_URL}dinero/${id}`)
        .then(response => response.json())
        .then(data => populateCardData(data))
        .catch(err => console.log(err))
}

const sendData = () => {
    fetch(`${BASE_URL}dinero`, {
        method: "POST",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveData())
    })
    .finally(() => console.log("termine de ejecutar el POST"))
}

const editData = (id) => {
    fetch(`${BASE_URL}dinero/${id}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(saveData())
    })
    .finally(() => console.log("termine de ejecutar el PUT"))
}

const deleteData = (id) => {
    fetch(`${BASE_URL}dinero/${id}`, {
        method: "DELETE",
    })
    .finally(() => console.log("termine de ejecutar el DELETE"))
}

// DOM

const createCards = (gastos) => {
    for (const gasto of gastos) {
        const { id, category, date, description, money } = gasto
        queryId("container").innerHTML += `
            <div class="card m-3" style="width: 18rem;">
                <img src="https://via.placeholder.com/200" class="card-img-top" alt="${category}">
                <div class="card-body">
                    <h5 class="card-title">${category}</h5>
                    <p class="card-text">${description}</p>
                    <p class="card-text"><b>Monto: </b>$${money}</p>
                    <span class="badge bg-warning text-dark">${date}</span>
                </div>
                <button class="btn btn-success m-1" onclick="showEditForm(${id})">Editar</button>
                <button class="btn btn-danger m-1" onclick="showDeleteAlert(${id})">Eliminar</button>
            </div>
        `
    }
}

const showDeleteAlert = (id) => {
    queryId("container").innerHTML = `
    <div class="alert alert-danger" role="alert">
        Estas seguro que queres eliminar este elemento?
        <button class="btn btn-danger" onclick="deleteData(${id})">Eliminar</button>
        <a href="index.html" class="btn btn-secondary">Volver</a>
    </div>
`
}

// METHODS

const saveData = () => {
    return {
        category: queryId("category").value,
        date: queryId("date").value,
        description: queryId("description").value,
        money: parseInt(queryId("price").value)
    }
}

const populateCardData = (data) => {
    const { category, date, description, money } = data
    queryId("category").value = category
    queryId("date").value = date
    queryId("description").value = description
    queryId("price").value = money
    queryId("form").classList.remove("d-none")
}

const addEvent = (id) => {
    queryId("submit").addEventListener("click", (e) => {
        e.preventDefault()
        if (isEdit) {
            editData(id)
        } else {
            sendData()
        }
    })
}

const showEditForm = (id) => {
    getDataById(id) // es mi GET a un id especifico
    queryId("container").innerHTML = ""
    queryId("submit").classList.remove("btn-primary")
    queryId("submit").classList.add("btn-success")
    queryId("submit").innerHTML = "Editar"
    isEdit = true
    addEvent(id)
}

// EVENTS

queryId("getRequest").addEventListener("click", getData)
queryId("showForm").addEventListener("click", () => {
    queryId("form").classList.remove("d-none")
    queryId("submit").classList.remove("btn-success")
    queryId("submit").classList.add("btn-primary")
    queryId("submit").innerHTML = "Enviar"
    isEdit = false
    addEvent()
})