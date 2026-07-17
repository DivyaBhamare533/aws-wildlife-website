const UPLOAD_API = "https://62b5rwvrpj.execute-api.ap-south-1.amazonaws.com/prod/upload";
const RESULT_API = "https://62b5rwvrpj.execute-api.ap-south-1.amazonaws.com/prod/results";

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const tableBody = document.getElementById("tableBody");

// Image Preview
imageInput.addEventListener("change", function () {

    const file = imageInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
});

// Upload Image
async function uploadImage() {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    status.innerHTML = "Uploading image...";

    const reader = new FileReader();

    reader.onload = async function () {

        const base64 = reader.result.split(",")[1];

        const response = await fetch(UPLOAD_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fileName: file.name,

                image: base64

            })

        });

        const result = await response.json();

        console.log(result);

        status.innerHTML = "Image Uploaded. Detecting Animals...";

        setTimeout(loadResults, 4000);

    };

    reader.readAsDataURL(file);

}

// Load Detection Results
async function loadResults() {

    const response = await fetch(RESULT_API);

    const data = await response.json();

    tableBody.innerHTML = "";

    data.reverse();

    data.forEach(item => {

        tableBody.innerHTML += `

        <tr>

            <td>${item.imageName}</td>

            <td>🦁 ${item.animal}</td>

            <td>${item.confidence}%</td>

            <td>${item.timestamp}</td>

        </tr>

        `;

    });

    status.innerHTML = `✅ ${data.length} Animal Detection Records`;

}

// Load existing records on page load
loadResults();