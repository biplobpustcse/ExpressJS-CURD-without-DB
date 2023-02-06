const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const courses = [
    { id: 1, name: 'Course1' },
    { id: 2, name: 'Course2' },
    { id: 3, name: 'Course3' }
]

app.get('/', (req, res) =>
{
    res.send('Hello world');
});

app.get('/api/courses', (req, res) =>
{
    res.send(courses);
})
app.get('/api/courses/:id', (req, res) =>
{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send(`The course by the given ID:${req.params.id} not found ....`)
    res.send(course);
})
// app.get('/api/posts/:year/:month', (req, res) =>
// {
//     res.send(req.query);
// })
app.post('/api/courses', (req, res) =>
{
    const { error } = validateCource(req.body);
    if (error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});
app.put('/api/courses/:id', (req, res) =>
{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`The course by the given ID:${req.params.id} not found ....`);

    const { error } = validateCource(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});
app.delete('/api/courses/:id', (req, res) =>
{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send(`The course by the given ID:${req.params.id} not found ....`);

    const index = courses.indexOf(course);
    courses.splice(index);
    res.send(course);
});

function validateCource(course)
{
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

const port = process.env.PORT | 4000;
app.listen(port, () => console.log(`Listinis port ${port} .....`));
