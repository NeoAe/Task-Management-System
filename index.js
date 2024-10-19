const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the main page
app.get("/", (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            return res.status(500).send("Error reading files.");
        }
        res.render("index", { files: files });
    });
});

// Route to handle form submission
app.post('/create', (req, res) => {
    const title = req.body.title.trim().replace(/\s+/g, '_'); // Replace spaces with underscores
    const description = req.body.discription.trim();

    if (!title || !description) {
        return res.status(400).send("Title and description are required.");
    }

    fs.writeFile(`./files/${title}.txt`, description, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error saving the file.");
        }
        console.log(req.body);
        res.redirect("/"); // Redirect to the main page after creating the task
    });
});

app.get('/files/:filename', (req,res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8" ,(err , files) => {
        if (err) {
            return res.status(500).send("Error reading files.");
        }
        res.render("show");
    })
})

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
